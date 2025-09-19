/**
 * Spirit-To-Soul Main Application Entry Point
 * Biblical Open World RPG inspired by the King James Version of The Bible
 * 
 * "Hear what The Spirit says to the soul in this action, adventure, chaotic, 
 * open world, role playing, web game based on sharing The Gospel and scripture 
 * from The King James Version of The BIBLE."
 */

// Global game engine reference
let gameEngine = null;

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🕊️ Initializing Spirit-To-Soul...');
    console.log('"Hear what The Spirit says to the soul"');
    
    try {
        // Initialize the game engine
        gameEngine = new GameEngine();
        
        // Make game engine globally accessible for debugging and UI interaction
        window.gameEngine = gameEngine;
        
        // Set up global error handling
        setupErrorHandling();
        
        // Set up performance monitoring
        setupPerformanceMonitoring();
        
        // Set up mobile-specific optimizations
        setupMobileOptimizations();
        
        console.log('✨ Spirit-To-Soul initialized successfully!');
        console.log('🙏 May God bless your spiritual journey!');
        
    } catch (error) {
        console.error('❌ Failed to initialize Spirit-To-Soul:', error);
        showCriticalError('Failed to initialize the game. Please refresh and try again.');
    }
});

// Global error handling
function setupErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('🚨 Global error:', event.error);
        
        // Don't crash the game for non-critical errors
        if (gameEngine && gameEngine.isRunning) {
            gameEngine.showError('An error occurred, but the game is still running.');
        }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent the default error handling
    });
}

// Performance monitoring
function setupPerformanceMonitoring() {
    // Monitor FPS and performance
    let lastTime = performance.now();
    let frameCount = 0;
    let totalTime = 0;
    
    function checkPerformance() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        frameCount++;
        totalTime += deltaTime;
        
        // Log performance every 5 seconds
        if (totalTime >= 5000) {
            const avgFps = (frameCount / totalTime) * 1000;
            
            if (avgFps < 30) {
                console.warn(`⚠️ Low FPS detected: ${avgFps.toFixed(1)} FPS`);
                
                // Suggest performance optimizations
                if (gameEngine) {
                    gameEngine.uiManager?.showNotification(
                        'Performance may be slow. Try closing other browser tabs.', 
                        'warning'
                    );
                }
            }
            
            frameCount = 0;
            totalTime = 0;
        }
        
        requestAnimationFrame(checkPerformance);
    }
    
    requestAnimationFrame(checkPerformance);
}

// Mobile optimizations
function setupMobileOptimizations() {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;
    
    if (isMobile || isTouch) {
        console.log('📱 Mobile device detected, applying optimizations...');
        
        // Prevent zoom on input focus
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
        
        // Prevent scroll bouncing on iOS
        document.body.style.overscrollBehavior = 'none';
        
        // Optimize touch handling
        document.body.style.touchAction = 'manipulation';
        
        // Add mobile-specific CSS class
        document.body.classList.add('mobile-device');
        
        // Reduce particle effects and visual complexity for performance
        if (gameEngine) {
            gameEngine.mobileMode = true;
        }
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (gameEngine && gameEngine.resizeCanvas) {
                gameEngine.resizeCanvas();
            }
        }, 100);
    });
}

// Critical error display
function showCriticalError(message) {
    const errorOverlay = document.createElement('div');
    errorOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Libre Baskerville', serif;
    `;
    
    errorOverlay.innerHTML = `
        <div style="text-align: center; padding: 2rem; max-width: 500px;">
            <h1 style="font-family: 'Cinzel', serif; color: #FFD700; font-size: 2.5rem; margin-bottom: 1rem;">
                Spirit-To-Soul
            </h1>
            <p style="font-size: 1.2rem; margin-bottom: 1rem; font-style: italic;">
                "Hear what The Spirit says to the soul"
            </p>
            <div style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; border-left: 4px solid #FFD700; margin: 2rem 0;">
                <h2 style="color: #FFD700; margin-bottom: 1rem;">Unable to Start</h2>
                <p style="margin-bottom: 1rem;">${message}</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">
                    Please ensure you have a modern browser with JavaScript enabled.
                </p>
            </div>
            <button onclick="location.reload()" style="
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #FFD700, #B8860B);
                border: none;
                border-radius: 8px;
                color: #000;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                font-family: 'Cinzel', serif;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">
                Reload Game
            </button>
            <div style="margin-top: 2rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <p style="font-style: italic; font-size: 0.9rem;">
                    "Trust in the Lord with all thine heart; and lean not unto thine own understanding."
                </p>
                <cite style="color: #FFD700; font-size: 0.8rem;">- Proverbs 3:5 (KJV)</cite>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorOverlay);
}

// Utility functions for debugging and development
window.SpiritToSoul = {
    // Debug functions
    debug: {
        toggleDebugMode: () => {
            const currentUrl = new URL(window.location);
            const hasDebug = currentUrl.searchParams.has('debug');
            
            if (hasDebug) {
                currentUrl.searchParams.delete('debug');
            } else {
                currentUrl.searchParams.set('debug', 'true');
            }
            
            window.location.href = currentUrl.toString();
        },
        
        getGameState: () => {
            return gameEngine ? gameEngine.getGameState() : 'not_initialized';
        },
        
        getPlayer: () => {
            return gameEngine ? gameEngine.getPlayer() : null;
        },
        
        teleportPlayer: (x, y) => {
            const player = gameEngine?.getPlayer();
            if (player) {
                player.setPosition(x, y);
                console.log(`🏃‍♂️ Teleported player to (${x}, ${y})`);
            }
        },
        
        giveExperience: (amount) => {
            const player = gameEngine?.getPlayer();
            if (player) {
                player.gainExperience(amount);
                console.log(`✨ Gave ${amount} experience to player`);
            }
        },
        
        learnScripture: (scriptureId) => {
            const player = gameEngine?.getPlayer();
            if (player) {
                player.learnScripture(scriptureId);
                console.log(`📖 Player learned scripture: ${scriptureId}`);
            }
        },
        
        startQuest: (questId) => {
            const questManager = gameEngine?.getQuestManager();
            if (questManager) {
                questManager.startQuest(questId);
                console.log(`🎯 Started quest: ${questId}`);
            }
        },
        
        listScriptures: () => {
            const scriptureManager = gameEngine?.getScriptureManager();
            if (scriptureManager) {
                const scriptures = scriptureManager.scriptures;
                console.table(Array.from(scriptures.values()).map(s => ({
                    id: s.id,
                    reference: s.reference,
                    theme: s.theme
                })));
            }
        },
        
        listQuests: () => {
            const questManager = gameEngine?.getQuestManager();
            if (questManager) {
                const quests = questManager.quests;
                console.table(Array.from(quests.values()).map(q => ({
                    id: q.definition.id,
                    title: q.definition.title,
                    type: q.definition.type
                })));
            }
        }
    },
    
    // Game info
    info: {
        version: '1.0.0',
        author: 'Spirit-To-Soul Development Team',
        description: 'A biblical open world RPG inspired by the King James Version of The Bible',
        scripture: '"In the beginning was the Word, and the Word was with God, and the Word was God." - John 1:1 (KJV)',
        
        showCredits: () => {
            console.log(`
🕊️ Spirit-To-Soul v${window.SpiritToSoul.info.version}
Biblical Open World RPG

"Hear what The Spirit says to the soul"

Built with love and faith for sharing The Gospel
All scripture from the King James Version of The Bible

May God bless your spiritual journey! 🙏
            `);
        },
        
        showCommands: () => {
            console.log(`
🎮 Spirit-To-Soul Debug Commands:

Movement:
  WASD / Arrow Keys - Move player
  Right Click - Move to position
  E - Interact with objects/NPCs

Abilities:
  1 - Prayer
  2 - Blessing  
  3 - Scripture Recite
  4 - Healing Touch

UI:
  Tab - Toggle Quest Panel
  Enter - Focus Chat
  Esc - Menu/Pause

Debug (in console):
  SpiritToSoul.debug.toggleDebugMode() - Toggle debug overlay
  SpiritToSoul.debug.teleportPlayer(x, y) - Teleport player
  SpiritToSoul.debug.giveExperience(amount) - Give XP
  SpiritToSoul.debug.learnScripture(id) - Learn scripture
  SpiritToSoul.debug.startQuest(id) - Start quest
  SpiritToSoul.debug.listScriptures() - List all scriptures
  SpiritToSoul.debug.listQuests() - List all quests
            `);
        }
    }
};

// Show welcome message in console
console.log(`
🕊️ Welcome to Spirit-To-Soul! 🕊️

"Hear what The Spirit says to the soul"

Type SpiritToSoul.info.showCommands() for help
Type SpiritToSoul.info.showCredits() for credits

May God bless your spiritual journey! 🙏
`);

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be implemented for offline play
        console.log('🔄 Service Worker support detected (offline play could be implemented)');
    });
}

// Export for testing and external access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gameEngine };
}