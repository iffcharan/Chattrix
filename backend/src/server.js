import express from 'express';
import "dotenv/config";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';


import {connectDB} from './lib/db.js';

await connectDB();
const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const __dirname = path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`Server is running on port ${actualPort}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});
