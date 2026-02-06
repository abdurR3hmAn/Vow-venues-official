import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "./models/user";
import type { IUser } from "./schema";
import { Document } from "mongoose";

declare global {
  namespace Express {
    interface User extends Document, IUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user as any);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user as any);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      console.log('[Auth] Registration request:', { 
        username: req.body.username, 
        email: req.body.email,
        name: req.body.name 
      });
      
      // Validate required fields
      const { username, password, name, email } = req.body;
      if (!username || !password || !name || !email) {
        console.log('[Auth] Missing required fields');
        return res.status(400).json({ 
          message: "All fields are required: username, password, name, and email" 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('[Auth] Invalid email format:', email);
        return res.status(400).json({ 
          message: "Please enter a valid email address" 
        });
      }

      // Check if username already exists
      console.log('[Auth] Checking if username exists:', username);
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        console.log('[Auth] Username already exists:', username);
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if email already exists
      console.log('[Auth] Checking if email exists:', email);
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        console.log('[Auth] Email already exists:', email);
        return res.status(409).json({ message: "Email already exists" });
      }

      console.log('[Auth] Creating user...');
      const user = await storage.createUser({
        username,
        password: await hashPassword(password),
        name,
        email,
      });

      // Convert to plain object and remove password
      const userObj = (user as any).toObject ? (user as any).toObject() : user;
      const userResponse = {
        ...userObj,
        password: undefined
      };

      console.log('[Auth] User created successfully:', userResponse.username);

      req.login(userObj, (err) => {
        if (err) {
          console.error('[Auth] Login after registration failed:', err);
          // Still return success for registration, but indicate login issue
          return res.status(201).json({ 
            user: userResponse,
            message: "Registration successful, but auto-login failed. Please log in manually." 
          });
        }
        console.log('[Auth] Registration and login successful');
        res.status(201).json({ 
          user: userResponse,
          message: "Registration successful" 
        });
      });
    } catch (error: any) {
      console.error('[Auth] Registration error:', error.message);
      if (error.code === 11000) {
        // Duplicate key error
        if (error.keyPattern?.username) {
          return res.status(409).json({ message: "Username already exists" });
        }
        if (error.keyPattern?.email) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }
      next(error);
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    console.log('[Auth] Login request:', req.body.username);
    
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error('[Auth] Login error:', err);
        return next(err);
      }
      
      if (!user) {
        console.log('[Auth] Login failed for:', req.body.username);
        return res.status(401).json({ 
          message: "Invalid username or password" 
        });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('[Auth] Login session error:', err);
          return next(err);
        }
        
        // Convert to plain object and remove sensitive fields
        const userObj = (user as any).toObject ? (user as any).toObject() : user;
        const userResponse = {
          ...userObj,
          password: undefined
        };
        
        console.log('[Auth] Login successful for:', userResponse.username);
        res.json({ user: userResponse, message: "Login successful" });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Convert to plain object and remove sensitive fields
    const userObj = (req.user as any).toObject ? (req.user as any).toObject() : req.user;
    const userResponse = {
      ...userObj,
      password: undefined
    };
    res.json({ user: userResponse });
  });
}
