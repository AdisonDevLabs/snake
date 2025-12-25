const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');
const path = require('path');
const { Pool } = require('pg'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// --- DATABASE CONFIGURATION ---
const NEON_DB_CONNECTION_STRING = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: NEON_DB_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.query(`
    CREATE TABLE IF NOT EXISTS tiktok_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        is_paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`).catch(err => console.error('Error creating table', err));

app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", 'index.html'));
});

const activeSessions = new Map();

io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);

    socket.on('tiktok_connect', async (data) => {
        
        let uniqueId;
        let gameConfig = {
            teamA: 'rose',   
            teamB: 'tiktok',
            teamABoost: 'money gun',
            teamBBoost: 'galaxy'
        };

        if (typeof data === 'object' && data !== null) {
            uniqueId = data.username.replace('@', '');
            if (data.teamAGift) gameConfig.teamA = data.teamAGift.toLowerCase();
            if (data.teamBGift) gameConfig.teamB = data.teamBGift.toLowerCase();
            if (data.teamABoost) gameConfig.teamABoost = data.teamABoost.toLowerCase();
            if (data.teamBBoost) gameConfig.teamBBoost = data.teamBBoost.toLowerCase();
        } else {
            uniqueId = data.toString().replace('@', '');
        }

        console.log(`Config: @${uniqueId}`);

        // --- SESSION TIME LIMIT LOGIC ---
        const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
        const THIRTY_MINS_MS = 30 * 60 * 1000;
        let sessionLimit = THIRTY_MINS_MS; // Default fallback

        try {
            const userCheck = await pool.query('SELECT * FROM tiktok_users WHERE username = $1', [uniqueId]);

            if (userCheck.rows.length > 0) {
                // EXISTING USER
                const user = userCheck.rows[0];
                
                if (user.is_paid) {
                    sessionLimit = -1; // Unlimited
                    console.log(`User @${uniqueId}: Paid (Unlimited)`);
                } else {
                    sessionLimit = THIRTY_MINS_MS; // Unpaid Returning
                    console.log(`User @${uniqueId}: Unpaid (30 Mins Limit)`);
                }

                await pool.query('UPDATE tiktok_users SET last_login = CURRENT_TIMESTAMP WHERE username = $1', [uniqueId]);
                
            } else {
                // NEW USER (Unregistered) -> FIRST USE
                console.log(`User @${uniqueId}: New (2 Hours Trial)`);
                await pool.query(
                    'INSERT INTO tiktok_users (username, is_paid) VALUES ($1, $2)',
                    [uniqueId, false] 
                );
                sessionLimit = TWO_HOURS_MS;
            }
        } catch (err) {
            console.error('Database Error:', err);
        }

        // Apply Time Limit
        if (sessionLimit > 0) {
            // Schedule disconnect
            setTimeout(() => {
                const disconnectMsg = 'SESSION LIMIT REACHED. PLEASE UPGRADE FOR UNLIMITED ACCESS.';
                socket.emit('tiktok_error', disconnectMsg);
                
                // Disconnect TikTok connection
                if (activeSessions.has(socket.id)) {
                    const session = activeSessions.get(socket.id);
                    if (session.connection) session.connection.disconnect();
                    activeSessions.delete(socket.id);
                }
                
                // Disconnect Client
                socket.disconnect();
                console.log(`Session ended for @${uniqueId} due to time limit.`);
            }, sessionLimit);
        }


        // 2. Cleanup existing session
        if (activeSessions.has(socket.id)) {
            const session = activeSessions.get(socket.id);
            if (session.connection) session.connection.disconnect();
            activeSessions.delete(socket.id);
        }

        // 3. Connect to TikTok
        const tiktokLiveConnection = new WebcastPushConnection(uniqueId);

        tiktokLiveConnection.connect()
            .then(state => {
                console.log(`Connected to RoomId: ${state.roomId}`);
                socket.emit('tiktok_connected', { username: uniqueId });
                
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
            const session = activeSessions.get(socket.id);
            if (!session) return;

            const targetGiftName = data.giftName.toLowerCase();
            const repeatCount = data.repeatCount || 1; 

            // Team A
            if (targetGiftName.includes(session.config.teamABoost)) {
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'girls',
                    isBoost: true, 
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            else if (targetGiftName.includes(session.config.teamA)) {
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'girls',
                    isBoost: false,
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            // Team B
            else if (targetGiftName.includes(session.config.teamBBoost)) {
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'boys',
                    isBoost: true,
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
            else if (targetGiftName.includes(session.config.teamB)) {
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'boys',
                    isBoost: false,
                    user: data.uniqueId,
                    gift: data.giftName,
                    count: repeatCount
                });
            }
        });

        tiktokLiveConnection.on('streamEnd', () => {
            socket.emit('tiktok_error', 'STREAM ENDED');
        });
    });

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