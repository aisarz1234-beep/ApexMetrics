import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import { generalLimiter } from './middleware/rateLimit.js';

// Route imports
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import leaderboardRoutes from './routes/leaderboards.js';
import raidRoutes from './routes/raids.js';
import turfWarRoutes from './routes/turfWars.js';
import bountyRoutes from './routes/bounties.js';
import antiCheatRoutes from './routes/antiCheat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.set('io', io);

// Security Headers & Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // relaxed for local dev and vite assets
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use('/api', generalLimiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/raids', raidRoutes);
app.use('/api/turf-wars', turfWarRoutes);
app.use('/api/bounties', bountyRoutes);
app.use('/api/anticheat', antiCheatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ApexMetrics Backend & Real-Time Engine',
    timestamp: new Date().toISOString()
  });
});

// Socket.io connection events
io.on('connection', (socket) => {
  console.log(`[Socket] Athlete connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket] Athlete disconnected: ${socket.id}`);
  });

  socket.on('raid:cheer', (data) => {
    io.emit('raid:cheered', {
      user: data.user,
      message: `${data.user?.name || 'An athlete'} energized the raid party! ⚡`
    });
  });
});

// Serve frontend build if available
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // In development, if dist doesn't exist, return API info
      res.json({
        message: 'ApexMetrics API Server is live. Launch client on http://localhost:5173',
        endpoints: ['/api/auth', '/api/workouts', '/api/leaderboards', '/api/raids', '/api/turf-wars']
      });
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.'
  });
});

const PORT = CONFIG.PORT;
server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 ApexMetrics Server running on http://localhost:${PORT}`);
  console.log(`⚡ Real-Time WebSockets active`);
  console.log(`🛡️ Anti-Cheat Engine & Heuristic validation online`);
  console.log(`===============================================`);
});

export default app;
