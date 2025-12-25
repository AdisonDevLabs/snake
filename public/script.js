// --- Data: TikTok Gifts ---
const TIKTOK_GIFTS = [
    // --- 1 Coin ---
    { id: 1, name: "Rose", cost: 1 },
    { id: 2, name: "TikTok", cost: 1 },
    { id: 3, name: "GG", cost: 1 },
    { id: 4, name: "Ice Cream Cone", cost: 1 },
    { id: 7, name: "Heart", cost: 1 },
    
    // --- Small Gifts (2-99 Coins) ---
    { id: 5, name: "Finger Heart", cost: 5 },
    { id: 6, name: "Drum", cost: 9 },
    { id: 8, name: "Perfume", cost: 20 },
    { id: 9, name: "Doughnut", cost: 30 },
    { id: 10, name: "Butterfly", cost: 88 },
    { id: 11, name: "Paper Crane", cost: 99 },
    { id: 12, name: "Cap", cost: 99 },
    { id: 13, name: "Little Crown", cost: 99 },

    // --- Medium Gifts (100-499 Coins) ---
    { id: 14, name: "Hand Hearts", cost: 100 },
    { id: 15, name: "Confetti", cost: 100 },
    { id: 16, name: "Sunglasses", cost: 199 },
    { id: 17, name: "Love You", cost: 199 },
    { id: 18, name: "Garland Headpiece", cost: 199 },
    { id: 19, name: "Cheer Mic", cost: 249 },
    { id: 20, name: "Corgi", cost: 299 },
    { id: 21, name: "Boxing Gloves", cost: 299 },
    { id: 22, name: "Rock Star", cost: 299 },
    { id: 23, name: "Birthday Cake", cost: 300 },
    { id: 24, name: "Relaxed Goose", cost: 399 },
    { id: 25, name: "Wishing Cake", cost: 400 },
    { id: 26, name: "Coral", cost: 499 },

    // --- High Tier / Effect Gifts (500-999 Coins) ---
    { id: 27, name: "Money Gun", cost: 500 },
    { id: 28, name: "Cuddle with Me", cost: 500 },
    { id: 29, name: "Swan", cost: 699 },
    { id: 30, name: "Train", cost: 899 },
    
    // --- Big Gifts (1000-4999 Coins) ---
    { id: 31, name: "Galaxy", cost: 1000 },
    { id: 32, name: "Fireworks", cost: 1088 },
    { id: 33, name: "Diamond Crown", cost: 1499 },
    { id: 34, name: "Whale Diving", cost: 2150 },
    { id: 35, name: "Motorcycle", cost: 2988 },
    { id: 36, name: "Private Jet", cost: 4888 },
    { id: 37, name: "Unicorn Fantasy", cost: 5000 },
    
    // --- Super Gifts / Whales (5000+ Coins) ---
    { id: 38, name: "Sports Car", cost: 7000 },
    { id: 39, name: "Leon and Lili", cost: 9699 },
    { id: 40, name: "Interstellar", cost: 10000 },
    { id: 41, name: "Falcon", cost: 10999 },
    { id: 42, name: "Sunset Speedway", cost: 10000 },
    { id: 43, name: "Crown World", cost: 14999 },
    { id: 44, name: "Amusement Park", cost: 17000 },
    { id: 45, name: "Phoenix", cost: 25999 },
    { id: 46, name: "Dragon Flame", cost: 25999 },
    { id: 47, name: "Lion", cost: 29999 },
    { id: 48, name: "Fire Phoenix", cost: 39999 },
    { id: 49, name: "TikTok Universe", cost: 44999 },
    { id: 50, name: "Leon and Lion", cost: 34000 }
];

function getGiftImgPath(name) {
    const filename = name.toLowerCase().replace(/\s+/g, '_') + '.webp';
    return `public/images/gifts/${filename}`;
}


// --- Global Config State ---
const AppConfig = {
    username: '',
    gameMode: 'auto',
    teamA: {
        name: 'GIRLS',
        color: '#be185d',
        giftId: 1,
        giftName: 'Rose',
        giftImg: '',
        boostGiftName: 'Money Gun', 
        boostImg: ''
    },
    teamB: {
        name: 'BOYS',
        color: '#1d4ed8',
        giftId: 2,
        giftName: 'TikTok',
        giftImg: '',
        boostGiftName: 'Galaxy',
        boostImg: ''
    }
};

// NEW: Store the last sent configuration to handle auto-reconnect
let lastSentConfig = null;

// --- DOM Elements (Config) ---
const configDashboard = document.getElementById('configDashboard');
const dashboardError = document.getElementById('dashboardError');
const gameContainer = document.getElementById('gameContainer');
const goLiveBtn = document.getElementById('goLiveBtn');

const teamANameInput = document.getElementById('teamAName');
const teamAColorInput = document.getElementById('teamAColor');
const teamAGiftSelect = document.getElementById('teamAGift');

const teamBNameInput = document.getElementById('teamBName');
const teamBColorInput = document.getElementById('teamBColor');
const teamBGiftSelect = document.getElementById('teamBGift');

const teamABoostGiftSelect = document.getElementById('teamABoostGift'); 
const teamBBoostGiftSelect = document.getElementById('teamBBoostGift'); 

const configUsername = document.getElementById('configUsername');
const gameModeSelect = document.getElementById('gameModeSelect');

// --- DOM Elements (Game UI) ---
const mobileControls = document.getElementById('mobileControls');
const dpadUp = document.getElementById('dpadUp');
const dpadDown = document.getElementById('dpadDown');
const dpadLeft = document.getElementById('dpadLeft');
const dpadRight = document.getElementById('dpadRight');

const cardTeamA = document.getElementById('cardTeamA');
const labelTeamA = document.getElementById('labelTeamA');
const scoreTeamA = document.getElementById('scoreTeamA');
const giftIconA = document.getElementById('giftIconA');
const giftNameA = document.getElementById('giftNameA');

const cardTeamB = document.getElementById('cardTeamB');
const labelTeamB = document.getElementById('labelTeamB');
const scoreTeamB = document.getElementById('scoreTeamB');
const giftIconB = document.getElementById('giftIconB');
const giftNameB = document.getElementById('giftNameB');

const boostIconA = document.getElementById('boostIconA');
const boostIconB = document.getElementById('boostIconB');

const btnTeamA = document.getElementById('btnTeamA');
const btnLabelA = document.getElementById('btnLabelA');
const btnIconA = document.getElementById('btnIconA');

const btnTeamB = document.getElementById('btnTeamB');
const btnLabelB = document.getElementById('btnLabelB');
const btnIconB = document.getElementById('btnIconB');

const winRegisterEl = document.getElementById('winRegister');
const sessionTimerEl = document.getElementById('sessionTimer');
const chatLog = document.getElementById('chatLog');
const uiOverlay = document.getElementById('uiOverlay');
const actionBtn = document.getElementById('actionBtn');
const statusText = document.getElementById('statusText');
const displayUser = document.getElementById('displayUser');
const matchTitle = document.getElementById('matchTitle');

// --- Fullscreen Logic ---
const fullscreenBtn = document.getElementById('fullscreenBtn');
if(fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
            if (doc.requestFullscreen) doc.requestFullscreen();
            else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen(); // Safari
            else if (doc.msRequestFullscreen) doc.msRequestFullscreen(); // IE11
            
            // Optional: Lock orientation to landscape if supported
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('portrait').catch(e => console.log('Orientation lock not supported'));
            }
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    });
}

// Auto-resize canvas on rotation
window.addEventListener('resize', () => {
    resizeCanvas();
    // Force a redraw after a brief delay to handle transition
    setTimeout(resizeCanvas, 300); 
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('public/sw.js').then(() => console.log('SW Registered'));
}
const socket = io();

// --- Game Variables ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20; 
let TILE_COUNT_X = 20;
let TILE_COUNT_Y = 15;

let snake = [];
let velocity = {x: 1, y: 0};
let manualNextVelocity = {x: 1, y: 0}; 
let foods = []; 
let scores = { teamA: 0, teamB: 0 };
let matchWins = { teamA: 0, teamB: 0 };
let isGameRunning = false;
let isPaused = false;
let isConnected = false;
let gameLoopId = null;
let gameSpeed = 150;
let lastTime = 0;
let accumulator = 0;
let startTime = 0;
let timerInterval = null;
let autoRestartTimeout = null;

// [NEW] Fake Bot Variables
let fakeBotInterval = null;
const FAKE_TARGET_SCORE = 1000; // Score to reach before slowing down
const FAKE_MAX_GAMES = 5;       // Stop auto-play after 5 total games (e.g. 3-2)

// [NEW] Realistic Usernames Pool
const FAKE_USERNAMES = [
    "Gaming_King_x", "Sarah_", "Shadow_Hunter", "Moba_Master", 
    "Cute_Panda_99", "Dragon_Slayer", "Pro_Gamer_24", "Chill_Vibes"
];

let audioCtx;
try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
} catch(e) { console.warn("AudioContext not supported"); }

let wakeLock = null;
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) { console.error(err); }
}
function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release().then(() => wakeLock = null);
    }
}
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') await requestWakeLock();
});

// ============================================
// INITIALIZATION
// ============================================

function populateGiftSelects() {
    const createOption = (gift) => {
        const opt = document.createElement('option');
        opt.value = gift.id;
        opt.text = `${gift.name} (${gift.cost})`;
        opt.dataset.name = gift.name;
        opt.dataset.img = getGiftImgPath(gift.name);
        return opt;
    };

    TIKTOK_GIFTS.forEach(gift => {
        teamAGiftSelect.appendChild(createOption(gift));
        teamBGiftSelect.appendChild(createOption(gift));
        teamABoostGiftSelect.appendChild(createOption(gift));
        teamBBoostGiftSelect.appendChild(createOption(gift));
    });

    teamAGiftSelect.value = 1; // Rose
    teamABoostGiftSelect.value = 27;

    teamBGiftSelect.value = 2; // TikTok
    teamBBoostGiftSelect.value = 31;
}

function applyConfiguration() {
    if(!configUsername.value.trim()) {
        dashboardError.innerText = "USERNAME REQUIRED";
        return false;
    }

    AppConfig.username = configUsername.value.trim();
    AppConfig.gameMode = gameModeSelect.value;

    const giftA = teamAGiftSelect.options[teamAGiftSelect.selectedIndex];
    const boostA = teamABoostGiftSelect.options[teamABoostGiftSelect.selectedIndex];

    AppConfig.teamA = {
        name: teamANameInput.value.toUpperCase(),
        color: teamAColorInput.value,
        giftId: parseInt(teamAGiftSelect.value),
        giftName: giftA.dataset.name,
        giftImg: giftA.dataset.img,
        boostGiftName: boostA.dataset.name,
        boostImg: boostA.dataset.img
    };

    const giftB = teamBGiftSelect.options[teamBGiftSelect.selectedIndex];
    const boostB = teamBBoostGiftSelect.options[teamBBoostGiftSelect.selectedIndex];

    AppConfig.teamB = {
        name: teamBNameInput.value.toUpperCase(),
        color: teamBColorInput.value,
        giftId: parseInt(teamBGiftSelect.value),
        giftName: giftB.dataset.name,
        giftImg: giftB.dataset.img,
        boostGiftName: boostB.dataset.name,
        boostImg: boostB.dataset.img
    };

    document.documentElement.style.setProperty('--team-a-color', AppConfig.teamA.color);
    document.documentElement.style.setProperty('--team-b-color', AppConfig.teamB.color);

    // Team A
    labelTeamA.innerText = AppConfig.teamA.name;
    cardTeamA.style.borderColor = AppConfig.teamA.color;
    cardTeamA.style.boxShadow = `4px 4px 0 ${AppConfig.teamA.color}`;

    giftIconA.src = AppConfig.teamA.giftImg;
    giftNameA.innerText = AppConfig.teamA.giftName;
    boostIconA.src = AppConfig.teamA.boostImg;

    btnIconA.src = AppConfig.teamA.giftImg;
    btnLabelA.innerText = AppConfig.teamA.name;
    btnTeamA.style.backgroundColor = AppConfig.teamA.color;
    
    // Team B
    labelTeamB.innerText = AppConfig.teamB.name;
    cardTeamB.style.borderColor = AppConfig.teamB.color;
    cardTeamB.style.boxShadow = `4px 4px 0 ${AppConfig.teamB.color}`;

    giftIconB.src = AppConfig.teamB.giftImg;
    giftNameB.innerText = AppConfig.teamB.giftName;
    boostIconB.src = AppConfig.teamB.boostImg;

    btnIconB.src = AppConfig.teamB.giftImg;
    btnLabelB.innerText = AppConfig.teamB.name;
    btnTeamB.style.backgroundColor = AppConfig.teamB.color;

    winRegisterEl.innerText = `${AppConfig.teamA.name.substring(0,1)}:0 - ${AppConfig.teamB.name.substring(0,1)}:0`;
    matchTitle.innerText = `${AppConfig.teamA.name} VS ${AppConfig.teamB.name}`;

    // TOGGLE MOBILE CONTROLS
    if (AppConfig.gameMode === 'manual') {
        mobileControls.classList.remove('hidden');
        mobileControls.classList.add('flex');
    } else {
        mobileControls.classList.add('hidden');
        mobileControls.classList.remove('flex');
    }

    return true;
}

goLiveBtn.addEventListener('click', () => {
    dashboardError.innerText = "";
    if(applyConfiguration()) {
        goLiveBtn.innerText = "CONNECTING...";
        goLiveBtn.disabled = true;
        
        // Save config for auto-reconnect
        lastSentConfig = {
          username: AppConfig.username,
          teamAGift: AppConfig.teamA.giftName,
          teamBGift: AppConfig.teamB.giftName,
          teamABoost: AppConfig.teamA.boostGiftName,
          teamBBoost: AppConfig.teamB.boostGiftName
        };

        socket.emit('tiktok_connect', lastSentConfig);
    }
});

// ============================================
// SOCKET & CONNECTION MANAGEMENT (UPDATED)
// ============================================

// 1. Handle Socket.io Reconnection (Internet back)
socket.on('connect', () => {
    // If we have a saved config and we were on the game screen, try to reconnect to TikTok
    if(lastSentConfig && !configDashboard.classList.contains('hidden') === false) {
        console.log("Socket reconnected. Attempting to restore TikTok session...");
        displayUser.innerText = "RECONNECTING...";
        displayUser.style.color = "yellow";
        socket.emit('tiktok_connect', lastSentConfig);
    }
});

// 2. Handle TikTok Connection Success
socket.on('tiktok_connected', (data) => {
    isConnected = true;
    displayUser.innerText = data.username;
    displayUser.style.color = "#25f4ee";

    // If on dashboard, switch to game
    if (!configDashboard.classList.contains('hidden')) {
        configDashboard.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        resizeCanvas();
    }

    // RESUME LOGIC:
    // If the game was running but paused due to disconnect, RESUME it.
    if (isGameRunning && isPaused) {
        isPaused = false;
        uiOverlay.classList.add('opacity-0', 'pointer-events-none');
        actionBtn.style.display = 'block'; 
        
        statusText.innerHTML = "CONNECTION RESTORED!<br>RESUMING...";
        statusText.style.color = "#a4e638";
        
        // Short delay to let user see "Resuming"
        setTimeout(() => {
            if(!isPaused) statusText.innerHTML = "";
        }, 2000);

        requestAnimationFrame(gameLoop); 
    } 
    // If game wasn't running (fresh start)
    else if (!isGameRunning) {
        statusText.innerHTML = "SYSTEM ONLINE<br>READY TO START";
        actionBtn.disabled = false;
        actionBtn.innerText = "START MATCH";
        actionBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
    }
});

// 3. Handle Disconnect (Internet lost)
socket.on('disconnect', () => {
    isConnected = false;
    displayUser.innerText = "OFFLINE";
    displayUser.style.color = "red";

    if (isGameRunning) {
        // PAUSE THE GAME, DO NOT STOP IT
        isPaused = true;
        
        // Show Overlay
        uiOverlay.classList.remove('opacity-0', 'pointer-events-none');
        actionBtn.style.display = 'none'; // Hide button while reconnecting
        
        statusText.innerHTML = `⚠️ CONNECTION LOST ⚠️<br>WAITING FOR INTERNET...`;
        statusText.style.color = "red";
        
        // We do NOT call stopGameDueToDisconnect() here anymore.
        // We wait indefinitely for reconnection.
    } else {
        // If game wasn't running, just disable start button
        actionBtn.disabled = true;
        actionBtn.classList.add('disabled:opacity-50', 'disabled:cursor-not-allowed');
        statusText.innerHTML = "DISCONNECTED<br>WAITING RECONNECT...";
        statusText.style.color = "red";
    }
});

socket.on('tiktok_error', (msg) => {
    if (!configDashboard.classList.contains('hidden')) {
        goLiveBtn.innerText = "GO LIVE";
        goLiveBtn.disabled = false;
        dashboardError.innerText = msg;
    } else {
        // Only stop game on fatal errors
        if(msg.includes("Ended") || msg.includes("Failed")) {
             stopGameDueToDisconnect();
             statusText.innerText = msg;
        }
    }
});

function stopGameDueToDisconnect() {
    isGameRunning = false;
    isPaused = false;
    releaseWakeLock();
    statusText.innerHTML = "DISCONNECTED<br>GAME STOPPED";
    statusText.style.color = "red";
    actionBtn.style.display = 'block';
    actionBtn.innerText = "PLAY AGAIN";
    actionBtn.disabled = false;
    actionBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
}


socket.on('game_event', (data) => {
    if (!isGameRunning || isPaused) return; 
    
    if (data.type === 'gift') {
        const isBoost = data.isBoost;
        
        if (data.team === 'girls') {
            spawnFood('teamA', isBoost);
            const imgPath = isBoost ? AppConfig.teamA.boostImg : AppConfig.teamA.giftImg;
            const msg = isBoost ? "SUPER BOOST!" : "Gift";
            addLog(data.user, msg, AppConfig.teamA.color, imgPath);
        } else if (data.team === 'boys') {
            spawnFood('teamB', isBoost); 
            const imgPath = isBoost ? AppConfig.teamB.boostImg : AppConfig.teamB.giftImg;
            const msg = isBoost ? "SUPER BOOST!" : "Gift";
            addLog(data.user, msg, AppConfig.teamB.color, imgPath);
        }
    }
});

// ============================================
// CONTROLS
// ============================================

btnTeamA.addEventListener('click', () => {
    if(!isGameRunning || isPaused) return;
    spawnFood('teamA');
    addLog('Manual', AppConfig.teamA.name, AppConfig.teamA.color);
});
btnTeamB.addEventListener('click', () => {
    if(!isGameRunning || isPaused) return;
    spawnFood('teamB');
    addLog('Manual', AppConfig.teamB.name, AppConfig.teamB.color);
});

function handleManualMove(dx, dy) {
    if (AppConfig.gameMode !== 'manual' || !isGameRunning || isPaused) return;
    
    if (dx !== 0 && velocity.x !== -dx) {
        manualNextVelocity = {x: dx, y: 0};
    } else if (dy !== 0 && velocity.y !== -dy) {
        manualNextVelocity = {x: 0, y: dy};
    }
}

function setupDpadButton(btn, dx, dy) {
    const handler = (e) => {
        if(e.cancelable) e.preventDefault();
        handleManualMove(dx, dy);
    };
    btn.addEventListener('touchstart', handler, {passive: false});
    btn.addEventListener('mousedown', handler);
}

setupDpadButton(dpadUp, 0, -1);
setupDpadButton(dpadDown, 0, 1);
setupDpadButton(dpadLeft, -1, 0);
setupDpadButton(dpadRight, 1, 0);

document.addEventListener('keydown', (e) => {
    if (AppConfig.gameMode !== 'manual' || !isGameRunning || isPaused) return;
    
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    switch(e.code) {
        case 'ArrowUp': handleManualMove(0, -1); break;
        case 'ArrowDown': handleManualMove(0, 1); break;
        case 'ArrowLeft': handleManualMove(-1, 0); break;
        case 'ArrowRight': handleManualMove(1, 0); break;
    }
});

// ============================================
// GAME LOGIC
// ============================================

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 225;
    TILE_COUNT_X = Math.floor(canvas.width / GRID_SIZE);
    TILE_COUNT_Y = Math.floor(canvas.height / GRID_SIZE);
}

function updateTimer() {
    if(isPaused) return; 
    const now = Date.now();
    const diff = now - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    sessionTimerEl.innerText = 
        `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}


// [NEW] Function to manage Auto-Play Bot behavior
function runFakeBotLogic() {
    // Clear any existing timer to prevent overlaps
    if (fakeBotInterval) clearTimeout(fakeBotInterval);

    // Stop if we reached max games
    if ((matchWins.teamA + matchWins.teamB) >= FAKE_MAX_GAMES) return;

    const botLoop = () => {
        // If paused, wait 1 second and check again
        if (!isGameRunning || isPaused) {
            fakeBotInterval = setTimeout(botLoop, 1000);
            return;
        }

        // Stop naturally if score target reached
        if (scores.teamA >= FAKE_TARGET_SCORE || scores.teamB >= FAKE_TARGET_SCORE) {
            return;
        }

        // --- 1. DECIDE TEAM (War Logic) ---
        let targetTeam = '';
        if (scores.teamA < scores.teamB - 150) targetTeam = 'teamA'; // Help A
        else if (scores.teamB < scores.teamA - 150) targetTeam = 'teamB'; // Help B
        else targetTeam = Math.random() > 0.5 ? 'teamA' : 'teamB'; // Random

        // --- 2. PICK A USER ---
        const randomUser = FAKE_USERNAMES[Math.floor(Math.random() * FAKE_USERNAMES.length)];
        
        // --- 3. DETERMINE BURST (1 to 4 gifts) ---
        let burstCount = 1;
        if (Math.random() > 0.6) {
            burstCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 gifts
        }

        let giftsSent = 0;

        // Inner function to handle the rapid burst
        const sendBurst = () => {
            if (giftsSent >= burstCount) {
                // Burst finished. Schedule next MAJOR user action.
                const nextDelay = Math.random() * 4000 + 1000;
                fakeBotInterval = setTimeout(botLoop, nextDelay);
                return;
            }

            // --- SEND GIFT & LOG WITH ICON ---
            spawnFood(targetTeam);

            const isTeamA = targetTeam === 'teamA';
            const color = isTeamA ? AppConfig.teamA.color : AppConfig.teamB.color;
            // Get the correct image path from the config
            const imgPath = isTeamA ? AppConfig.teamA.giftImg : AppConfig.teamB.giftImg;

            // Updated Log: Pass "Gift" as text and imgPath as the 4th argument
            // Result: "User: [Icon] Gift"
            addLog(randomUser, "Gift", color, imgPath);
            
            giftsSent++;

            // Short delay between gifts in a burst
            fakeBotInterval = setTimeout(sendBurst, Math.random() * 300 + 100);
        };

        // Start the burst
        sendBurst();
    };

    // Trigger the first loop
    botLoop();
}

function initGame() {
    if (!isConnected) {
        statusText.innerHTML = "CANNOT START<br>NO CONNECTION";
        statusText.style.color = "red";
        setTimeout(() => statusText.innerHTML = "WAITING FOR<br>CONNECTION...", 2000);
        return;
    }

    // [UPDATED] Clear previous bot interval and speech
    if (fakeBotInterval) clearTimeout(fakeBotInterval);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    if (autoRestartTimeout) {
        clearTimeout(autoRestartTimeout);
        autoRestartTimeout = null;
    }

    requestWakeLock();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    
    resizeCanvas();
    const startX = Math.floor(TILE_COUNT_X / 2);
    const startY = Math.floor(TILE_COUNT_Y / 2);
    snake = [{x: startX, y: startY}, {x: startX - 1, y: startY}, {x: startX - 2, y: startY}];
    
    velocity = {x: 1, y: 0};
    manualNextVelocity = {x: 1, y: 0};
    
    scores = { teamA: 0, teamB: 0 };
    foods = [];
    spawnFood('common'); 
    
    scoreTeamA.innerText = 0;
    scoreTeamB.innerText = 0;
    
    isGameRunning = true;
    isPaused = false;
    uiOverlay.classList.add('opacity-0', 'pointer-events-none');
    
    statusText.style.color = "white"; 

    if (!timerInterval) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // [UPDATED] Start the Bot Logic landscape
    runFakeBotLogic();

    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    lastTime = performance.now();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function spawnFood(type, isBoost = false) {
    let valid = false;
    let f = {x:0, y:0, type: type, isBoost: isBoost};

    let attempts = 0;
    while (!valid && attempts < 100) {
        f.x = Math.floor(Math.random() * TILE_COUNT_X);
        f.y = Math.floor(Math.random() * TILE_COUNT_Y);
        const hitSnake = snake.some(s => s.x === f.x && s.y === f.y);
        const hitFood = foods.some(fd => fd.x === f.x && fd.y === f.y);
        valid = !hitSnake && !hitFood;
        attempts++;
    }
    if(valid) foods.push(f);
}

function update() {
    if (AppConfig.gameMode === 'manual') {
        velocity = manualNextVelocity;
    } else {
        const aiMove = getAIMove();
        if (aiMove) velocity = aiMove;
    }

    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
    
    if (head.x < 0 || head.x >= TILE_COUNT_X || head.y < 0 || head.y >= TILE_COUNT_Y || snake.some(s => s.x === head.x && s.y === head.y)) { 
        gameOver(); return; 
    }
    
    snake.unshift(head);
    
    const foodIdx = foods.findIndex(f => f.x === head.x && f.y === head.y);
    if (foodIdx !== -1) {
        const food = foods[foodIdx];

        const points = food.isBoost ? 500 : 50; 
        
        playTone(600, 'square', 0.1);
        
        if (food.type === 'teamA') scores.teamA += points;
        else if (food.type === 'teamB') scores.teamB += points;
        
        foods.splice(foodIdx, 1);

        if(foods.length === 0) spawnFood('common');
    } else {
        snake.pop(); 
    }
}

function draw() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-color');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const w = canvas.width / TILE_COUNT_X;
    const h = canvas.height / TILE_COUNT_Y;

    ctx.fillStyle = '#000000';
    snake.forEach((p) => {
        ctx.fillRect(p.x * w + 1, p.y * h + 1, w - 2, h - 2); 
    });

    foods.forEach(f => {
        let radius = (Math.min(w, h) / 2) * 0.7;
        
        if (f.type === 'teamA') {
            ctx.fillStyle = f.isBoost ? '#FFD700' : AppConfig.teamA.color;
            radius = (Math.min(w, h) / 2) * (f.isBoost ? 1.5 : 1.3);
        } else if (f.type === 'teamB') {
            ctx.fillStyle = f.isBoost ? '#FFD700' : AppConfig.teamB.color;
            radius = (Math.min(w, h) / 2) * (f.isBoost ? 1.5 : 1.3);
        } else {
            ctx.fillStyle = '#444444';
        }
        
        const centerX = f.x * w + w / 2;
        const centerY = f.y * h + h / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        if(f.isBoost) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
    });
    
    scoreTeamA.innerText = scores.teamA;
    scoreTeamB.innerText = scores.teamB;
}

function gameLoop(timestamp) {
    if (!isGameRunning) return;
    if (isPaused) return; 

    const dt = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += dt;
    if (accumulator > gameSpeed * 3) accumulator = gameSpeed;
    if (accumulator >= gameSpeed) { update(); accumulator = 0; }
    draw();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameRunning = false;

    if (fakeBotInterval) clearTimeout(fakeBotInterval);

    releaseWakeLock();
    playTone(100, 'sawtooth', 0.4);
    
    let winnerText = "DRAW";
    if (scores.teamA > scores.teamB) {
        winnerText = `${AppConfig.teamA.name} WIN`;
        matchWins.teamA++;
    } else if (scores.teamB > scores.teamA) {
        winnerText = `${AppConfig.teamB.name} WIN`;
        matchWins.teamB++;
    }
    
    winRegisterEl.innerText = `${AppConfig.teamA.name.substring(0,1)}:${matchWins.teamA} - ${AppConfig.teamB.name.substring(0,1)}:${matchWins.teamB}`;
    
    statusText.innerHTML = `GAME OVER<br>${winnerText}<br>${AppConfig.teamA.name}: ${scores.teamA}<br>${AppConfig.teamB.name}: ${scores.teamB}`;
    statusText.style.color = "white";
    actionBtn.innerText = "PLAY AGAIN";
    uiOverlay.classList.remove('opacity-0', 'pointer-events-none');

    if (autoRestartTimeout) clearTimeout(autoRestartTimeout);
    autoRestartTimeout = setTimeout(() => {
        if (!isGameRunning && isConnected) initGame();
    }, 10000);
}

function getSafeMoves(head) {
    const moves = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
    return moves.filter(move => {
        const nx = head.x + move.x;
        const ny = head.y + move.y;
        return nx >= 0 && nx < TILE_COUNT_X && ny >= 0 && ny < TILE_COUNT_Y && !snake.some(s => s.x === nx && s.y === ny);
    });
}
function countReachable(startX, startY) {
    const q = [{x: startX, y: startY}];
    const visited = new Set();
    visited.add(`${startX},${startY}`);
    const obstacles = new Set(snake.map(p => `${p.x},${p.y}`));
    let count = 0;
    const limit = snake.length * 2; 

    while(q.length > 0 && count < limit) {
        const curr = q.shift();
        count++;
        const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
        for(let dir of dirs) {
            const nx = curr.x + dir.x;
            const ny = curr.y + dir.y;
            const key = `${nx},${ny}`;
            if (nx >= 0 && nx < TILE_COUNT_X && ny >= 0 && ny < TILE_COUNT_Y && !visited.has(key) && !obstacles.has(key)) {
                visited.add(key);
                q.push({x: nx, y: ny});
            }
        }
    }
    return count;
}
function getAIMove() {
    if (snake.length === 0) return null;
    const head = snake[0];
    const safeMoves = getSafeMoves(head);
    if (safeMoves.length === 0) return null;

    let target = null;
    const specialFoods = foods.filter(f => f.type === 'teamA' || f.type === 'teamB');
    const candidates = specialFoods.length > 0 ? specialFoods : foods;
    let minDist = Infinity;
    if (candidates.length > 0) {
        candidates.forEach(f => {
            const d = Math.abs(head.x - f.x) + Math.abs(head.y - f.y);
            if (d < minDist) {
                minDist = d;
                target = f;
            }
        });
    }

    let bestMove = null;
    if (target) {
        const q = [{x: head.x, y: head.y, path: []}];
        const visited = new Set();
        visited.add(`${head.x},${head.y}`);
        const obstacles = new Set(snake.map(p => `${p.x},${p.y}`));
        let foundPath = null;
        let iterations = 0;
        while(q.length > 0 && iterations < 500) {
            const curr = q.shift();
            iterations++;
            if (curr.x === target.x && curr.y === target.y) {
                foundPath = curr.path;
                break;
            }
            const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
            for(let dir of dirs) {
                const nx = curr.x + dir.x;
                const ny = curr.y + dir.y;
                const key = `${nx},${ny}`;
                if (nx >= 0 && nx < TILE_COUNT_X && ny >= 0 && ny < TILE_COUNT_Y && !visited.has(key) && !obstacles.has(key)) {
                    visited.add(key);
                    const newPath = curr.path.length === 0 ? [dir] : curr.path; 
                    q.push({x: nx, y: ny, path: newPath});
                }
            }
        }
        if (foundPath && foundPath.length > 0) {
            const potentialMove = foundPath[0];
            const nextX = head.x + potentialMove.x;
            const nextY = head.y + potentialMove.y;
            const space = countReachable(nextX, nextY);
            if (space >= Math.min(snake.length, 50)) bestMove = potentialMove;
        }
    }
    if (!bestMove) {
        let maxSpace = -1;
        for (let move of safeMoves) {
            const nx = head.x + move.x;
            const ny = head.y + move.y;
            const space = countReachable(nx, ny);
            if (space > maxSpace) {
                maxSpace = space;
                bestMove = move;
            }
        }
    }
    return bestMove || safeMoves[0]; 
}

function addLog(user, msg, color, iconPath = null) {
    const el = document.createElement('div');
    el.className = "flex items-center gap-1"; 
    
    let iconHtml = '';
    if (iconPath) {
        iconHtml = `<img src="${iconPath}" class="w-3 h-3 object-contain inline-block mr-1">`;
    }

    el.innerHTML = `<span style="color:${color};font-weight:900">${user}:</span> ${iconHtml}${msg}`;
    
    chatLog.appendChild(el);
    if(chatLog.children.length > 4) chatLog.removeChild(chatLog.firstChild);
    setTimeout(() => el.remove(), 3000);
}

function playTone(freq, type, duration) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(e => {});
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

populateGiftSelects();
actionBtn.addEventListener('click', initGame);
window.addEventListener('resize', resizeCanvas);