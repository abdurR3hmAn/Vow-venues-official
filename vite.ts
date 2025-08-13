import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import { nanoid } from "nanoid";
import mongoose from "./db";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  } as const;

  const vite = await import('vite');

  // Serve static files from the client/public directory
  app.use(express.static(path.resolve(__dirname, "..", "client", "public")));

  // Serve static files from the hall pictures directory with proper path mapping
  const hallPicturesPath = path.resolve(__dirname, "..", "client", "public", "hall pictures data");
  app.use("/hall pictures data", express.static(hallPicturesPath, {
    setHeaders: (res, p) => {
      if (p.endsWith('.jpeg') || p.endsWith('.jpg') || p.endsWith('.png')) {
        res.setHeader('Content-Type', p.endsWith('.png') ? 'image/png' : 'image/jpeg');
      }
    }
  }));

  // Note: API routes are handled by the main routes.ts file, not duplicated here

  const viteServer = await vite.createServer({
    // Let Vite load the config file itself (ESM) to avoid CJS transform and top-level await issues
    configFile: path.resolve(__dirname, "vite.config.ts"),
    logLevel: 'info',
    server: serverOptions,
    appType: "custom",
  });

  app.use(viteServer.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(__dirname, "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e: any) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Serve hall pictures in production as well
  const hallPicturesPath = path.resolve(__dirname, "..", "client", "public", "hall pictures data");
  app.use("/hall pictures data", express.static(hallPicturesPath, {
    setHeaders: (res, p) => {
      if (p.endsWith('.jpeg') || p.endsWith('.jpg') || p.endsWith('.png')) {
        res.setHeader('Content-Type', p.endsWith('.png') ? 'image/png' : 'image/jpeg');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
