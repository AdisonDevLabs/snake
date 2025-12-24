const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { WebcastPushConnection } = require('tiktok-live-connector');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the index.html file
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Map of active TikTok connections
const tiktokConnections = new Map();

io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);

    // Frontend requests to connect to a specific TikTok username
    socket.on('tiktok_connect', (username) => {
        // Clean username
        const uniqueId = username.replace('@', '');
        console.log(`Attempting to connect to TikTok Live: @${uniqueId}`);

        // Prevent duplicate connections for the same socket
        if (tiktokConnections.has(socket.id)) {
            tiktokConnections.get(socket.id).disconnect();
        }

        // Create new TikTok connection
        const tiktokLiveConnection = new WebcastPushConnection(uniqueId);

        tiktokLiveConnection.connect()
            .then(state => {
                console.log(`Connected to RoomId: ${state.roomId}`);
                socket.emit('tiktok_connected', { username: uniqueId });
                tiktokConnections.set(socket.id, tiktokLiveConnection);
            })
            .catch(err => {
                console.error('Failed to connect', err);
                socket.emit('tiktok_error', 'FAILED TO CONNECT. IS USER LIVE?');
            });

        // --- Event Listeners ---

        // Gifts
        tiktokLiveConnection.on('gift', (data) => {
            // Note: Gift IDs change. It's safer to check names or diamond cost.
            // Rose ID: 5655 (usually)
            // TikTok ID: 5269 (usually)
            
            const giftId = data.giftId;
            const giftName = data.giftName.toLowerCase();
            
            // LOGIC: Map Gifts to Game Teams
            if (giftName.includes('rose') || giftId === 5655) {
                // Girls Team (Pink)
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'girls',
                    user: data.uniqueId,
                    gift: 'Rose'
                });
            } else if (giftName.includes('tiktok') || giftId === 5269) {
                // Boys Team (Blue)
                io.to(socket.id).emit('game_event', {
                    type: 'gift',
                    team: 'boys',
                    user: data.uniqueId,
                    gift: 'TikTok'
                });
            } else {
                // Optional: Handle other gifts as generic boosts
                console.log(`Unhandled Gift: ${giftName} (${giftId})`);
            }
        });

        // Likes (Optional: make snake faster?)
        tiktokLiveConnection.on('like', (data) => {
            // io.to(socket.id).emit('game_event', { type: 'like', count: data.likeCount });
        });

        // Chat (Optional: Manual controls via chat?)
        tiktokLiveConnection.on('chat', (data) => {
            // console.log(`${data.uniqueId}: ${data.comment}`);
        });
        
        // Handle Disconnect
        tiktokLiveConnection.on('streamEnd', () => {
            socket.emit('tiktok_error', 'STREAM ENDED');
        });
    });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
        if (tiktokConnections.has(socket.id)) {
            tiktokConnections.get(socket.id).disconnect();
            tiktokConnections.delete(socket.id);
        }
        console.log('Frontend disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});