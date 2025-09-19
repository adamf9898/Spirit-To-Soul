// Main Game Manager - Coordinates all game systems
class GameManager {
    constructor() {
        this.player = null;
        this.gameWorld = null;
        this.scriptureManager = null;
        this.uiManager = null;
        this.multiplayerManager = null;
        
        this.gameState = GameConfig.STATES.LOADING;
        this.gameLoop = null;
        this.lastUpdate = 0;
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Initialize core systems
            this.scriptureManager = new ScriptureManager();
            this.multiplayerManager = new MultiplayerManager();
            this.uiManager = new UIManager();
            
            // Make managers globally available
            window.scriptureManager = this.scriptureManager;
            window.multiplayerManager = this.multiplayerManager;
            window.gameManager = this;
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize loading sequence
            await this.startLoadingSequence();
            
            console.log('Spirit To Soul initialized successfully');
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.handleInitializationError(error);
        }
    }
    
    async startLoadingSequence() {
        // Simulate loading with progress updates
        const loadingSteps = [
            { message: 'Loading Sacred Texts...', duration: 800 },
            { message: 'Preparing Biblical Lands...', duration: 600 },
            { message: 'Gathering Fellowship...', duration: 500 },
            { message: 'Opening Hearts and Minds...', duration: 700 },
            { message: 'Ready for Your Journey...', duration: 400 }
        ];
        
        let totalProgress = 0;
        const progressIncrement = 100 / loadingSteps.length;
        
        for (const step of loadingSteps) {
            this.updateLoadingText(step.message);
            await this.delay(step.duration);
            totalProgress += progressIncrement;
            this.updateLoadingProgress(totalProgress);
        }
        
        // Transition to main menu after loading
        setTimeout(() => {
            this.gameState = GameConfig.STATES.MENU;
            this.uiManager.showScreen('menu');
        }, 500);
    }
    
    updateLoadingText(text) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }
    
    updateLoadingProgress(percentage) {
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    setupEventListeners() {
        // Listen for multiplayer updates
        window.addEventListener('multiplayerUpdate', (e) => {
            this.handleMultiplayerUpdate(e.detail);
        });
        
        // Listen for visibility change (for pause/resume)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        });
        
        // Auto-save periodically
        setInterval(() => {
            if (this.player && this.gameState === GameConfig.STATES.GAME_WORLD) {
                this.saveGame();
            }
        }, 300000); // Auto-save every 5 minutes
    }
    
    handleMultiplayerUpdate(detail) {
        switch (detail.type) {
            case 'chat':
                if (this.uiManager) {
                    this.uiManager.addChatMessage(detail.data.sender, detail.data.message);
                }
                break;
            case 'fellowship-event':
                // Handle fellowship events
                console.log('Fellowship event:', detail.data.event);
                break;
            case 'prayer-request':
                // Handle new prayer requests
                console.log('New prayer request:', detail.data);
                break;
        }
    }
    
    // Character Management
    createNewCharacter(name, characterClass) {
        this.player = new Character(name, characterClass);
        
        // Start with a welcome quest
        const welcomeQuest = {
            title: 'Welcome to Your Spiritual Journey',
            description: 'Take your first steps in faith by exploring the world and meeting fellow believers',
            objectives: [
                'Visit any biblical location',
                'Pray for the first time',
                'Read a scripture verse'
            ],
            reward: 'LAMP'
        };
        
        this.player.startQuest(welcomeQuest);
        
        // Connect to multiplayer
        this.multiplayerManager.connect();
        
        // Notify UI of character creation
        window.dispatchEvent(new CustomEvent('characterUpdate'));
        
        console.log(`Created character: ${name} the ${characterClass}`);
        
        return this.player;
    }
    
    // Game World Management
    initializeGameWorld() {
        if (!this.gameWorld) {
            const canvas = document.getElementById('game-canvas');
            if (canvas) {
                this.gameWorld = new GameWorld(canvas);
                
                if (this.player) {
                    this.gameWorld.setPlayer(this.player);
                }
                
                // Start game loop
                this.startGameLoop();
                
                this.gameState = GameConfig.STATES.GAME_WORLD;
                console.log('Game world initialized');
            } else {
                console.error('Game canvas not found');
            }
        }
    }
    
    startGameLoop() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        const loop = (timestamp) => {
            const deltaTime = timestamp - this.lastUpdate;
            this.lastUpdate = timestamp;
            
            this.update(deltaTime);
            this.render();
            
            if (this.gameState === GameConfig.STATES.GAME_WORLD) {
                this.gameLoop = requestAnimationFrame(loop);
            }
        };
        
        this.gameLoop = requestAnimationFrame(loop);
    }
    
    update(deltaTime) {
        if (this.gameWorld && this.player) {
            this.gameWorld.update();
            
            // Stop player movement after a short time
            if (this.player.isMoving) {
                setTimeout(() => {
                    this.player.stopMoving();
                }, 100);
            }
            
            // Check quest progress
            this.checkQuestProgress();
        }
    }
    
    render() {
        if (this.gameWorld) {
            this.gameWorld.render();
        }
    }
    
    pauseGame() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    resumeGame() {
        if (this.gameState === GameConfig.STATES.GAME_WORLD && !this.gameLoop) {
            this.startGameLoop();
        }
    }
    
    // Quest Management
    checkQuestProgress() {
        if (!this.player?.currentQuest) return;
        
        const quest = this.player.currentQuest;
        
        // Check various quest conditions
        if (quest.title === 'Welcome to Your Spiritual Journey') {
            // Check if player visited a location
            if (this.gameWorld.locations.some(loc => loc.visited)) {
                this.player.updateQuestProgress(0, true);
            }
            
            // Check if player prayed (tracked in character)
            if (this.player.prayerStreak > 0) {
                this.player.updateQuestProgress(1, true);
            }
            
            // Check if player read scripture (tracked in character)
            if (this.player.scripturesMemorized.length > 0) {
                this.player.updateQuestProgress(2, true);
            }
        }
        
        // Update UI if quest completed
        if (this.player.checkQuestCompletion()) {
            window.dispatchEvent(new CustomEvent('characterUpdate'));
            this.uiManager?.showNotification('Quest Complete!', `You completed: ${quest.title}`);
        }
    }
    
    // Scripture Integration
    getRandomScriptureForContext(context) {
        return this.scriptureManager?.getContextualVerse(context);
    }
    
    memorizeScripture(reference) {
        if (this.player) {
            this.player.memorizeScripture(reference);
            window.dispatchEvent(new CustomEvent('characterUpdate'));
            
            // Share with fellowship if connected
            if (this.multiplayerManager.isConnected) {
                this.multiplayerManager.addFellowshipEvent(
                    `${this.player.name} memorized ${reference}`
                );
            }
        }
    }
    
    // Save/Load System
    saveGame() {
        if (!this.player) return false;
        
        try {
            const saveData = {
                version: GameConfig.VERSION,
                player: this.player.toSaveData(),
                gameState: this.gameState,
                timestamp: new Date().toISOString(),
                statistics: this.getGameStatistics()
            };
            
            localStorage.setItem(GameConfig.SAVE_KEY, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }
    
    loadGame() {
        try {
            const saveDataString = localStorage.getItem(GameConfig.SAVE_KEY);
            if (!saveDataString) return false;
            
            const saveData = JSON.parse(saveDataString);
            
            // Version compatibility check
            if (saveData.version !== GameConfig.VERSION) {
                console.warn('Save file version mismatch');
                // Handle migration if needed
            }
            
            // Restore player
            this.player = new Character();
            this.player.fromSaveData(saveData.player);
            
            // Connect to multiplayer
            this.multiplayerManager.connect();
            
            console.log('Game loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load game:', error);
            return false;
        }
    }
    
    deleteSaveGame() {
        try {
            localStorage.removeItem(GameConfig.SAVE_KEY);
            console.log('Save game deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete save game:', error);
            return false;
        }
    }
    
    // Statistics and Achievements
    getGameStatistics() {
        if (!this.player) return null;
        
        return {
            character: this.player.getSummary(),
            fellowship: this.multiplayerManager?.getFellowshipStats(),
            gameplay: {
                totalPlayTime: this.calculatePlayTime(),
                locationsVisited: this.gameWorld?.locations.filter(loc => loc.visited).length || 0,
                npcsInteracted: this.getNPCInteractionCount(),
                itemsUsed: this.getItemUsageCount()
            }
        };
    }
    
    calculatePlayTime() {
        // This would track actual play time in a real implementation
        return this.player?.level * 30 || 0; // Rough estimate
    }
    
    getNPCInteractionCount() {
        // Track NPC interactions
        return Math.floor(Math.random() * 20); // Placeholder
    }
    
    getItemUsageCount() {
        // Track item usage
        return Math.floor(Math.random() * 50); // Placeholder
    }
    
    // Special Events and Seasonal Content
    checkForSpecialEvents() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        // Christmas Event
        if (month === 12 && day >= 20 && day <= 31) {
            return {
                name: 'Christmas Celebration',
                description: 'Celebrate the birth of our Lord Jesus Christ',
                bonus: 'Double experience for sharing the Gospel'
            };
        }
        
        // Easter Event (simplified - would need proper calculation)
        if (month === 3 || month === 4) {
            return {
                name: 'Resurrection Sunday',
                description: 'He is risen! Rejoice in the victory over death',
                bonus: 'Extra faith restoration for all prayers'
            };
        }
        
        // Pentecost-themed event
        if (month === 5) {
            return {
                name: 'Pentecost Power',
                description: 'Experience the power of the Holy Spirit',
                bonus: 'Enhanced wisdom gain from scripture study'
            };
        }
        
        return null;
    }
    
    // Analytics and Feedback
    trackPlayerAction(action, details = {}) {
        // In a real implementation, this would send analytics data
        console.log(`Player action: ${action}`, details);
        
        // Update player engagement metrics
        if (this.player) {
            switch (action) {
                case 'scripture_read':
                    this.player.gainExperience(5);
                    break;
                case 'prayer_offered':
                    this.player.restoreFaith(10);
                    break;
                case 'fellowship_interaction':
                    this.player.fellowshipPoints += 3;
                    break;
            }
        }
    }
    
    // Error Handling
    handleInitializationError(error) {
        console.error('Game initialization failed:', error);
        
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #8B0000;
            color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
        `;
        errorMessage.innerHTML = `
            <h2>Initialization Error</h2>
            <p>Failed to start Spirit To Soul. Please refresh the page.</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem;">Reload</button>
        `;
        
        document.body.appendChild(errorMessage);
    }
    
    // Performance Monitoring
    getPerformanceMetrics() {
        return {
            frameRate: this.calculateFPS(),
            memoryUsage: this.getMemoryUsage(),
            loadTime: performance.now()
        };
    }
    
    calculateFPS() {
        // Simplified FPS calculation
        return 60; // Placeholder
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(performance.memory.totalJSHeapSize / 1048576) // MB
            };
        }
        return null;
    }
    
    // Debug Methods
    debugInfo() {
        return {
            gameState: this.gameState,
            player: this.player?.getSummary(),
            gameWorld: this.gameWorld ? 'Initialized' : 'Not initialized',
            performance: this.getPerformanceMetrics(),
            specialEvent: this.checkForSpecialEvents()
        };
    }
    
    // Cleanup
    destroy() {
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        // Save before destroying
        this.saveGame();
        
        // Disconnect multiplayer
        if (this.multiplayerManager) {
            this.multiplayerManager.disconnect();
        }
        
        console.log('Game manager destroyed');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game
    window.gameManager = new GameManager();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.gameManager) {
        window.gameManager.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}