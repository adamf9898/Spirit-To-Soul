// UI Management
class UIManager {
    constructor() {
        this.currentScreen = 'loading';
        this.panels = {};
        this.modals = {};
        this.notifications = [];
        
        this.initializeEventListeners();
        this.loadPanelReferences();
    }
    
    loadPanelReferences() {
        // Store references to DOM elements
        this.panels = {
            fellowship: document.getElementById('fellowship-panel'),
            inventory: document.getElementById('inventory-panel'),
            scriptureDisplay: document.getElementById('scripture-display')
        };
        
        this.screens = {
            loading: document.getElementById('loading-screen'),
            menu: document.getElementById('main-menu'),
            characterCreation: document.getElementById('character-creation'),
            gameWorld: document.getElementById('game-world'),
            scriptureStudy: document.getElementById('scripture-study')
        };
    }
    
    initializeEventListeners() {
        // Menu buttons
        document.getElementById('new-game-btn')?.addEventListener('click', () => {
            this.showScreen('character-creation');
        });
        
        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.loadGame();
        });
        
        document.getElementById('multiplayer-btn')?.addEventListener('click', () => {
            this.showPanel('fellowship');
        });
        
        document.getElementById('scripture-btn')?.addEventListener('click', () => {
            this.showScreen('scripture-study');
        });
        
        document.getElementById('settings-btn')?.addEventListener('click', () => {
            this.showSettings();
        });
        
        // Character creation
        this.initializeCharacterCreation();
        
        // Game controls
        this.initializeGameControls();
        
        // Panel controls
        this.initializePanelControls();
        
        // Scripture study
        this.initializeScriptureStudy();
        
        // Custom game events
        this.initializeGameEventListeners();
        
        // Keyboard controls
        this.initializeKeyboardControls();
    }
    
    initializeCharacterCreation() {
        // Character class selection
        document.querySelectorAll('.class-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.class-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // Create character button
        document.getElementById('create-character-btn')?.addEventListener('click', () => {
            this.createCharacter();
        });
    }
    
    initializeGameControls() {
        // Action buttons
        document.getElementById('interact-btn')?.addEventListener('click', () => {
            this.handleInteraction();
        });
        
        document.getElementById('inventory-btn')?.addEventListener('click', () => {
            this.togglePanel('inventory');
        });
        
        document.getElementById('pray-btn')?.addEventListener('click', () => {
            this.handlePrayer();
        });
        
        document.getElementById('fellowship-btn')?.addEventListener('click', () => {
            this.togglePanel('fellowship');
        });
        
        // Movement buttons
        document.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.direction;
                this.handleMovement(direction);
            });
        });
        
        // Scripture toggle
        document.getElementById('scripture-toggle')?.addEventListener('click', () => {
            this.toggleScriptureDisplay();
        });
    }
    
    initializePanelControls() {
        // Fellowship panel
        document.getElementById('close-fellowship')?.addEventListener('click', () => {
            this.hidePanel('fellowship');
        });
        
        document.getElementById('send-chat')?.addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // Inventory panel
        document.getElementById('close-inventory')?.addEventListener('click', () => {
            this.hidePanel('inventory');
        });
    }
    
    initializeScriptureStudy() {
        document.getElementById('search-btn')?.addEventListener('click', () => {
            this.searchScriptures();
        });
        
        document.getElementById('scripture-search')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchScriptures();
            }
        });
        
        document.getElementById('back-to-menu')?.addEventListener('click', () => {
            this.showScreen('menu');
        });
    }
    
    initializeGameEventListeners() {
        // Listen for custom game events
        window.addEventListener('gameMessage', (e) => {
            this.showNotification(e.detail.title, e.detail.message);
        });
        
        window.addEventListener('gameDialogue', (e) => {
            this.showDialogue(e.detail.speaker, e.detail.text);
        });
        
        window.addEventListener('questOpportunity', (e) => {
            this.showQuestOpportunity(e.detail);
        });
        
        window.addEventListener('characterUpdate', (e) => {
            this.updateCharacterDisplay();
        });
    }
    
    initializeKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'game-world') {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        e.preventDefault();
                        this.handleMovement('up');
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        e.preventDefault();
                        this.handleMovement('down');
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        e.preventDefault();
                        this.handleMovement('left');
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        e.preventDefault();
                        this.handleMovement('right');
                        break;
                    case ' ':
                        e.preventDefault();
                        this.handleInteraction();
                        break;
                    case 'p':
                    case 'P':
                        e.preventDefault();
                        this.handlePrayer();
                        break;
                    case 'i':
                    case 'I':
                        e.preventDefault();
                        this.togglePanel('inventory');
                        break;
                    case 'c':
                    case 'C':
                        e.preventDefault();
                        this.togglePanel('fellowship');
                        break;
                }
            }
        });
    }
    
    // Screen management
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = this.screens[screenName] || document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
        
        // Handle screen-specific logic
        switch (screenName) {
            case 'menu':
                this.updateMenuState();
                break;
            case 'game-world':
                this.initializeGameWorld();
                break;
            case 'scripture-study':
                this.loadScriptureStudy();
                break;
        }
    }
    
    updateMenuState() {
        // Check if save game exists
        const saveExists = localStorage.getItem(GameConfig.SAVE_KEY);
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.style.display = saveExists ? 'block' : 'none';
        }
        
        // Update daily verse
        if (window.scriptureManager) {
            const dailyVerse = window.scriptureManager.getDailyVerse();
            const verseElement = document.getElementById('daily-verse');
            if (verseElement && dailyVerse) {
                verseElement.textContent = `"${dailyVerse.text}" - ${dailyVerse.reference} (KJV)`;
            }
        }
    }
    
    // Panel management
    showPanel(panelName) {
        const panel = this.panels[panelName];
        if (panel) {
            panel.classList.remove('hidden');
        }
    }
    
    hidePanel(panelName) {
        const panel = this.panels[panelName];
        if (panel) {
            panel.classList.add('hidden');
        }
    }
    
    togglePanel(panelName) {
        const panel = this.panels[panelName];
        if (panel) {
            panel.classList.toggle('hidden');
            
            // Update panel content when shown
            if (!panel.classList.contains('hidden')) {
                this.updatePanelContent(panelName);
            }
        }
    }
    
    updatePanelContent(panelName) {
        switch (panelName) {
            case 'inventory':
                this.updateInventoryDisplay();
                break;
            case 'fellowship':
                this.updateFellowshipDisplay();
                break;
        }
    }
    
    // Character creation
    createCharacter() {
        const nameInput = document.getElementById('character-name');
        const selectedClass = document.querySelector('.class-option.selected');
        
        if (!nameInput?.value.trim()) {
            this.showNotification('Error', 'Please enter a character name');
            return;
        }
        
        if (!selectedClass) {
            this.showNotification('Error', 'Please select a character class');
            return;
        }
        
        const characterName = nameInput.value.trim();
        const characterClass = selectedClass.dataset.class.toUpperCase();
        
        // Create character and start game
        window.gameManager?.createNewCharacter(characterName, characterClass);
        this.showScreen('game-world');
    }
    
    // Game world management
    initializeGameWorld() {
        if (window.gameManager) {
            window.gameManager.initializeGameWorld();
            this.updateCharacterDisplay();
        }
    }
    
    updateCharacterDisplay() {
        const player = window.gameManager?.player;
        if (!player) return;
        
        // Update character stats
        this.updateStatBar('health', player.currentStats.health, player.maxStats.health);
        this.updateStatBar('faith', player.currentStats.faith, player.maxStats.faith);
        this.updateStatBar('wisdom', player.currentStats.wisdom, player.maxStats.wisdom);
        
        // Update quest display
        const currentQuest = document.getElementById('current-quest');
        const questDescription = document.getElementById('quest-description');
        
        if (player.currentQuest) {
            currentQuest.textContent = player.currentQuest.title;
            questDescription.textContent = player.currentQuest.description;
        } else {
            currentQuest.textContent = 'No Active Quest';
            questDescription.textContent = 'Explore the world to find new quests';
        }
    }
    
    updateStatBar(statName, current, max) {
        const fillElement = document.querySelector(`.stat-bar.${statName} .fill`);
        if (fillElement) {
            const percentage = (current / max) * 100;
            fillElement.style.width = `${percentage}%`;
        }
    }
    
    // Game actions
    handleMovement(direction) {
        if (window.gameManager?.player) {
            window.gameManager.player.move(direction);
        }
    }
    
    handleInteraction() {
        if (window.gameManager?.gameWorld) {
            // Check for nearby NPCs or objects
            const player = window.gameManager.player;
            const gameWorld = window.gameManager.gameWorld;
            
            // Try NPC interactions first
            const nearbyNPC = gameWorld.npcs.find(npc => npc.nearPlayer);
            if (nearbyNPC) {
                gameWorld.interactWithNPC(nearbyNPC.id);
                return;
            }
            
            // Try object interactions
            const nearbyObject = gameWorld.worldObjects.find(obj => obj.nearPlayer);
            if (nearbyObject) {
                gameWorld.interactWithObject(nearbyObject.id);
                return;
            }
            
            this.showNotification('Interaction', 'Nothing to interact with here');
        }
    }
    
    handlePrayer() {
        if (window.gameManager?.player) {
            const result = window.gameManager.player.pray();
            this.showNotification('Prayer', 
                `You offer prayers to the Lord. ${result.streak} day streak! Faith restored: ${result.faithRestored}`);
            this.updateCharacterDisplay();
            
            // Show contextual scripture
            if (window.scriptureManager) {
                const verse = window.scriptureManager.getContextualVerse('prayer');
                this.updateScriptureDisplay(verse);
            }
        }
    }
    
    // Inventory management
    updateInventoryDisplay() {
        const inventoryGrid = document.getElementById('inventory-grid');
        if (!inventoryGrid || !window.gameManager?.player) return;
        
        inventoryGrid.innerHTML = '';
        
        const player = window.gameManager.player;
        
        // Create inventory slots
        for (let i = 0; i < player.maxInventorySize; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.slotIndex = i;
            
            if (i < player.inventory.length) {
                const item = player.inventory[i];
                slot.textContent = item.icon || '📦';
                slot.title = `${item.name}: ${item.description}`;
                
                slot.addEventListener('click', () => {
                    this.useInventoryItem(item.id);
                });
            }
            
            inventoryGrid.appendChild(slot);
        }
    }
    
    useInventoryItem(itemId) {
        if (window.gameManager?.player) {
            const success = window.gameManager.player.useItem(itemId);
            if (success) {
                this.updateInventoryDisplay();
                this.updateCharacterDisplay();
                this.showNotification('Item Used', 'Item consumed successfully');
            } else {
                this.showNotification('Error', 'Cannot use this item');
            }
        }
    }
    
    // Fellowship/Chat management
    updateFellowshipDisplay() {
        // This would connect to multiplayer features
        // For now, just show a welcome message
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && chatMessages.children.length <= 1) {
            this.addChatMessage('System', 'Welcome to the Fellowship Hall! Share encouragement and scripture with others.');
        }
    }
    
    sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput?.value.trim()) return;
        
        const message = chatInput.value.trim();
        const playerName = window.gameManager?.player?.name || 'Anonymous';
        
        this.addChatMessage(playerName, message);
        chatInput.value = '';
        
        // Gain fellowship points for chatting
        if (window.gameManager?.player) {
            window.gameManager.player.fellowshipPoints += 1;
        }
    }
    
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Scripture management
    toggleScriptureDisplay() {
        const scriptureDisplay = this.panels.scriptureDisplay;
        if (scriptureDisplay) {
            scriptureDisplay.classList.toggle('hidden');
            
            if (!scriptureDisplay.classList.contains('hidden')) {
                // Show a contextual verse
                if (window.scriptureManager) {
                    const verse = window.scriptureManager.getContextualVerse('guidance');
                    this.updateScriptureDisplay(verse);
                }
            }
        }
    }
    
    updateScriptureDisplay(verse) {
        const scriptureText = document.getElementById('current-scripture');
        if (scriptureText && verse) {
            scriptureText.innerHTML = `<strong>${verse.reference}</strong><br>"${verse.text}"`;
        }
    }
    
    searchScriptures() {
        const searchInput = document.getElementById('scripture-search');
        const resultsContainer = document.getElementById('scripture-results');
        
        if (!searchInput?.value.trim() || !resultsContainer || !window.scriptureManager) return;
        
        const query = searchInput.value.trim();
        const results = window.scriptureManager.searchVerses(query);
        
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No verses found matching your search.</p>';
            return;
        }
        
        results.slice(0, 10).forEach(result => {
            const verseElement = document.createElement('div');
            verseElement.className = 'scripture-verse';
            verseElement.innerHTML = `
                <h3>${result.reference}</h3>
                <p>"${result.text}"</p>
            `;
            
            verseElement.addEventListener('click', () => {
                this.memorizeVerse(result.reference);
            });
            
            resultsContainer.appendChild(verseElement);
        });
    }
    
    memorizeVerse(reference) {
        if (window.gameManager?.player) {
            window.gameManager.player.memorizeScripture(reference);
            this.showNotification('Scripture Memorized', `You have memorized ${reference}`);
            this.updateCharacterDisplay();
        }
    }
    
    loadScriptureStudy() {
        // Load random verses for study
        if (window.scriptureManager) {
            const resultsContainer = document.getElementById('scripture-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
                
                // Show some featured verses
                const featuredVerses = [
                    'John 3:16', 'Psalm 23:1', 'Romans 8:28', 'Philippians 4:13', 
                    'Jeremiah 29:11', 'Matthew 11:28', 'Proverbs 3:5-6'
                ];
                
                featuredVerses.forEach(ref => {
                    const verse = window.scriptureManager.getVerse(ref);
                    if (verse) {
                        const verseElement = document.createElement('div');
                        verseElement.className = 'scripture-verse';
                        verseElement.innerHTML = `
                            <h3>${verse.reference}</h3>
                            <p>"${verse.text}"</p>
                        `;
                        
                        verseElement.addEventListener('click', () => {
                            this.memorizeVerse(verse.reference);
                        });
                        
                        resultsContainer.appendChild(verseElement);
                    }
                });
            }
        }
    }
    
    // Notification system
    showNotification(title, message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <strong>${title}</strong><br>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(47, 27, 20, 0.95);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            border: 2px solid #DAA520;
            max-width: 300px;
            z-index: 10000;
            font-family: Georgia, serif;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
    }
    
    showDialogue(speaker, text) {
        this.showNotification(speaker, text, 4000);
    }
    
    showQuestOpportunity(quest) {
        const accept = confirm(`Quest Available: ${quest.title}\n${quest.description}\n\nWould you like to accept this quest?`);
        
        if (accept && window.gameManager?.player) {
            window.gameManager.player.startQuest(quest);
            this.showNotification('Quest Started', `You have accepted: ${quest.title}`);
            this.updateCharacterDisplay();
        }
    }
    
    // Settings management
    showSettings() {
        this.showNotification('Settings', 'Settings panel coming soon!');
    }
    
    // Save/Load functionality
    saveGame() {
        if (window.gameManager) {
            window.gameManager.saveGame();
            this.showNotification('Game Saved', 'Your progress has been saved');
        }
    }
    
    loadGame() {
        if (window.gameManager) {
            const loaded = window.gameManager.loadGame();
            if (loaded) {
                this.showScreen('game-world');
                this.showNotification('Game Loaded', 'Your journey continues...');
            } else {
                this.showNotification('Error', 'No saved game found');
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}