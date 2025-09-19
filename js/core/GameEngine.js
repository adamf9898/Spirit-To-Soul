/**
 * Spirit-To-Soul Game Engine
 * Core game engine for biblical open-world RPG
 */

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameState = 'loading'; // loading, menu, character_creation, playing, paused
        this.isRunning = false;
        
        // Game systems
        this.inputSystem = null;
        this.renderSystem = null;
        this.audioSystem = null;
        this.uiManager = null;
        
        // Game objects
        this.player = null;
        this.world = null;
        this.questManager = null;
        this.scriptureManager = null;
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('Initializing Spirit-To-Soul Game Engine...');
        
        try {
            // Initialize canvas
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            
            if (!this.ctx) {
                throw new Error('Unable to get 2D rendering context');
            }
            
            // Set up canvas properties
            this.setupCanvas();
            
            // Initialize game systems
            await this.initializeSystems();
            
            // Load game data
            await this.loadGameData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            console.log('Game engine initialized successfully');
            
            // Start the game loop
            this.start();
            
        } catch (error) {
            console.error('Failed to initialize game engine:', error);
            this.showError('Failed to initialize game. Please refresh and try again.');
        }
    }
    
    setupCanvas() {
        // Set canvas size based on screen
        this.resizeCanvas();
        
        // Set up rendering context properties
        this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        this.ctx.textBaseline = 'top';
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const maxWidth = Math.min(window.innerWidth - 40, 1200);
        const maxHeight = Math.min(window.innerHeight - 40, 800);
        
        // Maintain aspect ratio
        const aspectRatio = 1200 / 800;
        let width = maxWidth;
        let height = width / aspectRatio;
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
    }
    
    async initializeSystems() {
        // Initialize input system
        this.inputSystem = new InputSystem(this);
        
        // Initialize render system
        this.renderSystem = new RenderSystem(this);
        
        // Initialize audio system
        this.audioSystem = new AudioSystem(this);
        
        // Initialize UI manager
        this.uiManager = new UIManager(this);
        
        console.log('Game systems initialized');
    }
    
    async loadGameData() {
        // Load biblical data
        this.scriptureManager = new ScriptureManager();
        await this.scriptureManager.initialize();
        
        // Load quest data
        this.questManager = new QuestManager();
        await this.questManager.initialize();
        
        console.log('Game data loaded');
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Visibility change (pause when tab not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
        
        console.log('Game loop started');
    }
    
    pause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            console.log('Game paused');
        }
    }
    
    resume() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.lastTime = performance.now(); // Reset timing
            console.log('Game resumed');
        }
    }
    
    stop() {
        this.isRunning = false;
        console.log('Game stopped');
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 0.1);
        
        // Update FPS counter
        this.updateFPS(this.deltaTime);
        
        // Update game state
        this.update(this.deltaTime);
        
        // Render game
        this.render();
        
        // Schedule next frame
        requestAnimationFrame(() => this.gameLoop());
    }
    
    updateFPS(deltaTime) {
        this.frameCount++;
        this.fpsTime += deltaTime;
        
        if (this.fpsTime >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTime = 0;
        }
    }
    
    update(deltaTime) {
        // Update input system
        this.inputSystem.update(deltaTime);
        
        // Update based on game state
        switch (this.gameState) {
            case 'loading':
                this.updateLoading(deltaTime);
                break;
            case 'menu':
                this.updateMenu(deltaTime);
                break;
            case 'character_creation':
                this.updateCharacterCreation(deltaTime);
                break;
            case 'playing':
                this.updateGameplay(deltaTime);
                break;
            case 'paused':
                // Don't update gameplay when paused
                break;
        }
        
        // Update UI
        this.uiManager.update(deltaTime);
        
        // Update audio
        this.audioSystem.update(deltaTime);
    }
    
    updateLoading(deltaTime) {
        // Simulate loading progress
        const loadingProgress = document.querySelector('.loading-progress');
        if (loadingProgress) {
            const currentWidth = parseFloat(loadingProgress.style.width) || 0;
            const newWidth = Math.min(currentWidth + deltaTime * 30, 100);
            loadingProgress.style.width = newWidth + '%';
            
            if (newWidth >= 100) {
                setTimeout(() => {
                    this.transitionToMenu();
                }, 500);
            }
        }
    }
    
    updateMenu(deltaTime) {
        // Menu animations and interactions handled by UI system
    }
    
    updateCharacterCreation(deltaTime) {
        // Character creation logic handled by UI system
    }
    
    updateGameplay(deltaTime) {
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // Update world
        if (this.world) {
            this.world.update(deltaTime);
        }
        
        // Update quest system
        if (this.questManager) {
            this.questManager.update(deltaTime);
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2a5934'; // Biblical green landscape
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render based on game state
        switch (this.gameState) {
            case 'playing':
                this.renderGameplay();
                break;
            case 'paused':
                this.renderGameplay();
                this.renderPauseOverlay();
                break;
        }
        
        // Render debug info in development
        if (this.isDebugMode()) {
            this.renderDebugInfo();
        }
    }
    
    renderGameplay() {
        // Render world
        if (this.world) {
            this.world.render(this.ctx);
        }
        
        // Render player
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Render minimap
        this.renderMinimap();
    }
    
    renderMinimap() {
        const minimapCanvas = document.getElementById('minimap-canvas');
        if (minimapCanvas && this.world && this.player) {
            const minimapCtx = minimapCanvas.getContext('2d');
            
            // Clear minimap
            minimapCtx.fillStyle = '#1a4a2e';
            minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
            
            // Draw simplified world view
            minimapCtx.fillStyle = '#2a5934';
            minimapCtx.fillRect(5, 5, minimapCanvas.width - 10, minimapCanvas.height - 10);
            
            // Draw player position
            const playerX = (this.player.x / this.world.width) * (minimapCanvas.width - 10) + 5;
            const playerY = (this.player.y / this.world.height) * (minimapCanvas.height - 10) + 5;
            
            minimapCtx.fillStyle = '#FFD700';
            minimapCtx.beginPath();
            minimapCtx.arc(playerX, playerY, 3, 0, Math.PI * 2);
            minimapCtx.fill();
        }
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 48px Cinzel';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 24);
        
        this.ctx.font = '24px Libre Baskerville';
        this.ctx.fillText('Press SPACE to continue', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
    
    renderDebugInfo() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 100);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${this.fps}`, 20, 30);
        this.ctx.fillText(`Delta: ${this.deltaTime.toFixed(3)}s`, 20, 50);
        this.ctx.fillText(`State: ${this.gameState}`, 20, 70);
        
        if (this.player) {
            this.ctx.fillText(`Player: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`, 20, 90);
        }
    }
    
    isDebugMode() {
        return window.location.search.includes('debug=true');
    }
    
    // State transitions
    transitionToMenu() {
        this.gameState = 'menu';
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        console.log('Transitioned to main menu');
    }
    
    transitionToCharacterCreation() {
        this.gameState = 'character_creation';
        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('character-creation').classList.remove('hidden');
        console.log('Transitioned to character creation');
    }
    
    transitionToGameplay() {
        this.gameState = 'playing';
        document.getElementById('character-creation').classList.add('hidden');
        document.getElementById('game-interface').classList.remove('hidden');
        
        // Initialize game world and player
        this.initializeGameplay();
        
        console.log('Transitioned to gameplay');
    }
    
    initializeGameplay() {
        // Create world
        this.world = new World(this);
        
        // Create player with character data
        const characterData = this.uiManager.getCharacterData();
        this.player = new Player(this, characterData);
        
        // Set initial player position
        this.player.setPosition(this.world.width / 2, this.world.height / 2);
        
        // Start first quest
        this.questManager.startQuest('great_commission');
        
        console.log('Gameplay initialized');
    }
    
    showError(message) {
        console.error(message);
        
        // Create error overlay
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-overlay';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h2>Error</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Reload Game</button>
            </div>
        `;
        
        // Add CSS for error overlay
        const style = document.createElement('style');
        style.textContent = `
            .error-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: 'Libre Baskerville', serif;
            }
            .error-content {
                text-align: center;
                padding: 2rem;
                background: #1e3a8a;
                border: 2px solid #FFD700;
                border-radius: 8px;
            }
            .error-content h2 {
                color: #FFD700;
                margin-bottom: 1rem;
                font-family: 'Cinzel', serif;
            }
            .error-content button {
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #FFD700;
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorDiv);
    }
    
    // Public API methods
    getGameState() {
        return this.gameState;
    }
    
    getPlayer() {
        return this.player;
    }
    
    getWorld() {
        return this.world;
    }
    
    getQuestManager() {
        return this.questManager;
    }
    
    getScriptureManager() {
        return this.scriptureManager;
    }
    
    getCanvas() {
        return this.canvas;
    }
    
    getContext() {
        return this.ctx;
    }
}