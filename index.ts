import express from "express";
import { registerRoutes } from "./routes";
import { importVenues } from "./import-venues";
import mongoose from "./db";

const PORT = 3001; // Changed from 3000 to avoid port conflict

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all routes with credential support
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from mobile app origins and localhost
  if (!origin || 
      origin === 'http://localhost:3000' || 
      origin === 'http://localhost:3001' || 
      origin === 'http://localhost:8081' || // Expo dev server
      origin === 'http://10.0.2.2:3000' ||   // Android emulator
      origin === 'http://10.0.2.2:3001' ||   // Android emulator with new port
      origin === 'http://192.168.1.100:3000' || // Local network
      origin === 'http://192.168.1.100:3001' // Local network with new port
  ) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

(async () => {
  try {
    // Wait for MongoDB connection before starting the server
    mongoose.connection.once('open', async () => {
      try {
        // Import venues if needed
        await importVenues();
        console.log('Venues imported successfully');

        const server = await registerRoutes(app);

        // Serve client from the same server
        if (process.env.NODE_ENV !== 'production') {
          // Development: mount Vite dev middleware
          const { setupVite } = await import('./vite');
          await setupVite(app as any, server as any);
          console.log('Vite middleware mounted for development');
        } else {
          // Production: serve static build from dist
          const { serveStatic } = await import('./vite');
          serveStatic(app as any);
          console.log('Serving static client build');
        }

        server.listen(PORT, '0.0.0.0', () => {
          console.log(`Server running at http://0.0.0.0:${PORT}`);
          console.log(`Local access: http://localhost:${PORT}`);
          console.log(`Android emulator access: http://10.0.2.2:${PORT}`);
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
