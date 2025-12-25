const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');
const path = require('path');
const { Pool } = require('pg'); // Import PostgreSQL client

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- DATABASE CONFIGURATION ---
// Replace this connection string with your actual Neon DB string
const NEON_DB_CONNECTION_STRING = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: NEON_DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false // Required for Neon
    }
});

// Initialize DB Table
pool.query(`
    CREATE TABLE IF NOT EXISTS tiktok_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        is_paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`).catch(err => console.error('Error creating table', err));


// Serve the index.html file
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});

// Map of active TikTok connections & their game config
// Structure: socket.id => { connection: WebcastPushConnection, config: { teamA: 'rose', teamB: 'tiktok' } }
const activeSessions = new Map();

io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);

    // Frontend requests to connect
    socket.on('tiktok_connect', async (data) => { // Made async for DB calls
        
        let uniqueId;
        let gameConfig = {
            teamA: 'rose',    // Default
            teamB: 'tiktok',
            teamABoost: 'money gun',
            teamBBoost: 'galaxy'
        };

        // 1. Parse incoming data (String vs Object)
        if (typeof data === 'object' && data !== null) {
            uniqueId = data.username.replace('@', '');
            // Store the chosen gift names (lowercase for easy matching)
            if (data.teamAGift) gameConfig.teamA = data.teamAGift.toLowerCase();
            if (data.teamBGift) gameConfig.teamB = data.teamBGift.toLowerCase();

            if (data.teamABoost) gameConfig.teamABoost = data.teamABoost.toLowerCase();
            if (data.teamBBoost) gameConfig.teamBBoost = data.teamBBoost.toLowerCase();
        } else {
            // Legacy mode (just string)
            uniqueId = data.toString().replace('@', '');
        }

        console.log(`Config: @${uniqueId}`);

        // --- DATABASE CHECK LOGIC ---
        try {
            // Check if user exists
            const userCheck = await pool.query('SELECT * FROM tiktok_users WHERE username = $1', [uniqueId]);

            if (userCheck.rows.length > 0) {
                // User Exists - Check Payment Status
                const user = userCheck.rows[0];
                console.log(`User @${uniqueId} found. Paid status: ${user.is_paid}`);

                // If you want to BLOCK unpaid users, uncomment the lines below:
                /*
                if (!user.is_paid) {
                    socket.emit('tiktok_error', 'ACCOUNT NOT PAID. PLEASE UPGRADE.');
                    return; // Stop execution
                }
                */

                // Update last login
                await pool.query('UPDATE tiktok_users SET last_login = CURRENT_TIMESTAMP WHERE username = $1', [uniqueId]);
                
            } else {
                // User Does Not Exist - Register Them
                console.log(`User @${uniqueId} not found. Registering...`);
                await pool.query(
                    'INSERT INTO tiktok_users (username, is_paid) VALUES ($1, $2)',
                    [uniqueId, false] // Default to NOT paid
                );
                // Note: If you want to block new users until they pay, emit error here and return.
            }
        } catch (err) {
            console.error('Database Error:', err);
            // Optionally emit an error or allow play in "offline mode" if DB fails
            // socket.emit('tiktok_error', 'DATABASE ERROR'); 
        }

        console.log(`A: ${gameConfig.teamA} (Boost: ${gameConfig.teamABoost})`);
        console.log(`B: ${gameConfig.teamB} (Boost: ${gameConfig.teamBBoost})`);

        // 2. Cleanup existing session for this socket
        if (activeSessions.has(socket.id)) {
            const session = activeSessions.get(socket.id);
            if (session.connection) session.connection.disconnect();
            activeSessions.delete(socket.id);
        }

        // 3. Create new TikTok connection
        const tiktokLiveConnection = new WebcastPushConnection(uniqueId);

        tiktokLiveConnection.connect()
            .then(state => {
                console.log(`Connected to RoomId: ${state.roomId}`);
                socket.emit('tiktok_connected', { username: uniqueId });
                
                // Store connection AND the specific gifts for this session
                activeSessions.set(socket.id, {
                    connection: tiktokLiveConnection,
                    config: gameConfig
                });
            })
            .catch(err => {
                console.error('Failed to connect', err);
                socket.emit('tiktok_error', 'FAILED TO CONNECT. IS USER LIVE?');
            });

        // --- Event Listeners ---

        tiktokLiveConnection.on('gift', (data) => {
            // Retrieve the config for this specific socket
            const session = activeSessions.get(socket.id);
            if (!session) return;

            const targetGiftName = data.giftName.toLowerCase();
            const giftId = data.giftId;
            const repeatCount = data.repeatCount || 1; // Assuming 1 if undefined

            // --- TEAM A LOGIC ---
            if (targetGiftName.includes(session.config.teamABoost)) {
                // TEAM A SUPER BOOST
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'girls',
                    isBoost: true, // <--- FLAG
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            else if (targetGiftName.includes(session.config.teamA)) {
                // TEAM A NORMAL
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'girls',
                    isBoost: false,
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            // --- TEAM B LOGIC ---
            else if (targetGiftName.includes(session.config.teamBBoost)) {
                // TEAM B SUPER BOOST
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'boys',
                    isBoost: true, // <--- FLAG
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            else if (targetGiftName.includes(session.config.teamB)) {
                // TEAM B NORMAL
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'boys',
                    isBoost: false,
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }

            console.log(`Gift received: ${targetGiftName} (x${repeatCount})`);
        });

        // Handle Stream End
        tiktokLiveConnection.on('streamEnd', () => {
            socket.emit('tiktok_error', 'STREAM ENDED');
        });
        
        // Optional: Chat/Like handlers
        tiktokLiveConnection.on('chat', (data) => {
            // console.log(`${data.uniqueId}: ${data.comment}`);
        });
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
        if (activeSessions.has(socket.id)) {
            const session = activeSessions.get(socket.id);
            if (session.connection) session.connection.disconnect();
            activeSessions.delete(socket.id);
        }
        console.log('Frontend disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});