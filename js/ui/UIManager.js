/**
 * UI Manager for Spirit-To-Soul
 * Handles all user interface interactions and management
 */

class UIManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // UI state
        this.currentScreen = 'loading';
        this.modalStack = [];
        this.characterData = {};
        
        // UI elements cache
        this.elements = {};
        
        // Chat system
        this.chatMessages = [];
        this.maxChatMessages = 50;
        
        this.initialize();
    }
    
    initialize() {
        // Cache frequently used elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize UI systems
        this.initializeChatSystem();
        this.initializeMenuSystem();
        
        console.log('UI Manager initialized');
    }
    
    cacheElements() {
        this.elements = {
            // Screens
            loadingScreen: document.getElementById('loading-screen'),
            mainMenu: document.getElementById('main-menu'),
            characterCreation: document.getElementById('character-creation'),
            gameInterface: document.getElementById('game-interface'),
            
            // Menu buttons
            newGameBtn: document.getElementById('new-game-btn'),
            continueBtn: document.getElementById('continue-btn'),
            multiplayerBtn: document.getElementById('multiplayer-btn'),
            scriptureBtn: document.getElementById('scripture-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            
            // Character creation
            characterName: document.getElementById('character-name'),
            createCharacterBtn: document.getElementById('create-character-btn'),
            
            // Game UI
            playerName: document.getElementById('player-name'),
            playerLevel: document.getElementById('player-level'),
            healthBar: document.getElementById('health-bar'),
            healthValue: document.getElementById('health-value'),
            faithBar: document.getElementById('faith-bar'),
            faithValue: document.getElementById('faith-value'),
            
            // Chat
            chatContent: document.getElementById('chat-content'),
            chatInput: document.getElementById('chat-input'),
            sendMessage: document.getElementById('send-message'),
            chatToggle: document.getElementById('chat-toggle'),
            
            // Quest panel
            questPanel: document.getElementById('quest-panel'),
            questClose: document.getElementById('quest-close'),
            
            // Modals
            scriptureModal: document.getElementById('scripture-modal'),
            scriptureClose: document.getElementById('scripture-close')
        };
    }
    
    setupEventListeners() {
        // Menu buttons
        if (this.elements.newGameBtn) {
            this.elements.newGameBtn.addEventListener('click', () => this.startNewGame());
        }
        
        if (this.elements.continueBtn) {
            this.elements.continueBtn.addEventListener('click', () => this.continueGame());
        }
        
        if (this.elements.multiplayerBtn) {
            this.elements.multiplayerBtn.addEventListener('click', () => this.showMultiplayer());
        }
        
        if (this.elements.scriptureBtn) {
            this.elements.scriptureBtn.addEventListener('click', () => this.showScriptureStudy());
        }
        
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        }
        
        // Character creation
        if (this.elements.characterName) {
            this.elements.characterName.addEventListener('input', () => this.validateCharacterCreation());
        }
        
        if (this.elements.createCharacterBtn) {
            this.elements.createCharacterBtn.addEventListener('click', () => this.createCharacter());
        }
        
        // Calling selection
        const callingCards = document.querySelectorAll('.calling-card');
        callingCards.forEach(card => {
            card.addEventListener('click', () => this.selectCalling(card));
        });
        
        // Chat system
        if (this.elements.sendMessage) {
            this.elements.sendMessage.addEventListener('click', () => this.sendChatMessage());
        }
        
        if (this.elements.chatInput) {
            this.elements.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage();
                }
            });
        }
        
        if (this.elements.chatToggle) {
            this.elements.chatToggle.addEventListener('click', () => this.toggleChat());
        }
        
        // Quest panel
        if (this.elements.questClose) {
            this.elements.questClose.addEventListener('click', () => this.closeQuestPanel());
        }
        
        // Scripture modal
        if (this.elements.scriptureClose) {
            this.elements.scriptureClose.addEventListener('click', () => this.closeScriptureModal());
        }
        
        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeTopModal();
            }
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }
    
    initializeChatSystem() {
        // Add welcome message
        this.addChatMessage('Welcome to Spirit-To-Soul! Share the Gospel and grow in fellowship.', 'system');
        
        // Set up chat auto-scroll
        this.setupChatAutoScroll();
    }
    
    initializeMenuSystem() {
        // Check for saved game
        const savedGame = this.loadGameData();
        if (savedGame) {
            this.elements.continueBtn.disabled = false;
        }
    }
    
    update(deltaTime) {
        // Update UI based on game state
        this.updateUI(deltaTime);
        
        // Update chat system
        this.updateChatSystem(deltaTime);
        
        // Update modals
        this.updateModals(deltaTime);
    }
    
    updateUI(deltaTime) {
        const gameState = this.gameEngine.getGameState();
        
        // Update current screen
        if (this.currentScreen !== gameState) {
            this.transitionToScreen(gameState);
        }
        
        // Update game-specific UI
        if (gameState === 'playing') {
            this.updateGameplayUI(deltaTime);
        }
    }
    
    updateGameplayUI(deltaTime) {
        // UI updates are handled by the Player class for resources
        // Additional UI updates can be added here
    }
    
    updateChatSystem(deltaTime) {
        // Auto-scroll chat if new messages
        if (this.elements.chatContent) {
            const shouldScroll = this.elements.chatContent.scrollTop + this.elements.chatContent.clientHeight >= this.elements.chatContent.scrollHeight - 10;
            if (shouldScroll) {
                this.elements.chatContent.scrollTop = this.elements.chatContent.scrollHeight;
            }
        }
    }
    
    updateModals(deltaTime) {
        // Handle modal animations and updates
    }
    
    transitionToScreen(newScreen) {
        this.currentScreen = newScreen;
        
        // Hide all screens first
        const screens = ['loading-screen', 'main-menu', 'character-creation', 'game-interface'];
        screens.forEach(screenId => {
            const element = document.getElementById(screenId);
            if (element) {
                element.classList.add('hidden');
            }
        });
        
        // Show the appropriate screen
        let targetScreenId = null;
        switch (newScreen) {
            case 'loading':
                targetScreenId = 'loading-screen';
                break;
            case 'menu':
                targetScreenId = 'main-menu';
                break;
            case 'character_creation':
                targetScreenId = 'character-creation';
                break;
            case 'playing':
            case 'paused':
                targetScreenId = 'game-interface';
                break;
        }
        
        if (targetScreenId) {
            const targetElement = document.getElementById(targetScreenId);
            if (targetElement) {
                targetElement.classList.remove('hidden');
            }
        }
    }
    
    // Menu system methods
    startNewGame() {
        console.log('Starting new game');
        this.gameEngine.transitionToCharacterCreation();
    }
    
    continueGame() {
        console.log('Continuing game');
        const savedData = this.loadGameData();
        if (savedData) {
            this.characterData = savedData.character;
            this.gameEngine.transitionToGameplay();
        }
    }
    
    showMultiplayer() {
        console.log('Multiplayer not yet implemented');
        this.showNotification('Multiplayer features coming soon!', 'info');
    }
    
    showScriptureStudy() {
        console.log('Opening scripture study');
        this.openScriptureModal('john_3_16');
    }
    
    showSettings() {
        console.log('Settings not yet implemented');
        this.showNotification('Settings panel coming soon!', 'info');
    }
    
    // Character creation methods
    selectCalling(callingCard) {
        // Remove selection from other cards
        document.querySelectorAll('.calling-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select clicked card
        callingCard.classList.add('selected');
        this.characterData.calling = callingCard.dataset.calling;
        
        // Validate form
        this.validateCharacterCreation();
    }
    
    validateCharacterCreation() {
        const name = this.elements.characterName?.value?.trim();
        const calling = this.characterData.calling;
        
        const isValid = name && name.length >= 2 && calling;
        
        if (this.elements.createCharacterBtn) {
            this.elements.createCharacterBtn.disabled = !isValid;
        }
        
        return isValid;
    }
    
    createCharacter() {
        if (!this.validateCharacterCreation()) return;
        
        this.characterData.name = this.elements.characterName.value.trim();
        
        console.log('Creating character:', this.characterData);
        
        // Save character data
        this.saveGameData({ character: this.characterData });
        
        // Transition to gameplay
        this.gameEngine.transitionToGameplay();
    }
    
    getCharacterData() {
        return { ...this.characterData };
    }
    
    // Chat system methods
    addChatMessage(message, type = 'system', sender = null) {
        const chatMessage = {
            id: Date.now() + Math.random(),
            message,
            type,
            sender,
            timestamp: new Date()
        };
        
        this.chatMessages.push(chatMessage);
        
        // Limit chat history
        if (this.chatMessages.length > this.maxChatMessages) {
            this.chatMessages.shift();
        }
        
        // Add to DOM
        this.renderChatMessage(chatMessage);
        
        // Auto-scroll
        this.scrollChatToBottom();
    }
    
    renderChatMessage(chatMessage) {
        if (!this.elements.chatContent) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${chatMessage.type}`;
        
        const timeStr = chatMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let messageHTML = '';
        if (chatMessage.sender) {
            messageHTML = `
                <span class="message-sender">${chatMessage.sender}:</span>
                <span class="message-text">${chatMessage.message}</span>
                <span class="message-time">${timeStr}</span>
            `;
        } else {
            messageHTML = `
                <span class="message-text">${chatMessage.message}</span>
                <span class="message-time">${timeStr}</span>
            `;
        }
        
        messageDiv.innerHTML = messageHTML;
        this.elements.chatContent.appendChild(messageDiv);
    }
    
    sendChatMessage() {
        const message = this.elements.chatInput?.value?.trim();
        if (!message) return;
        
        const player = this.gameEngine.getPlayer();
        const playerName = player ? player.name : 'Player';
        
        // Add message to chat
        this.addChatMessage(message, 'player', playerName);
        
        // Clear input
        this.elements.chatInput.value = '';
        
        // In a multiplayer implementation, this would send to other players
        console.log(`${playerName}: ${message}`);
        
        // Auto-reply with biblical encouragement (simulation)
        setTimeout(() => {
            this.addBiblicalResponse(message);
        }, 1000 + Math.random() * 2000);
    }
    
    addBiblicalResponse(userMessage) {
        const responses = [
            'Amen! "Let your light so shine before men." - Matthew 5:16',
            'Praise be to God! "Be strong and of good courage." - Joshua 1:9',
            'Blessed words! "The Lord is my shepherd." - Psalm 23:1',
            'Glory to God! "Faith can move mountains." - Matthew 17:20',
            'Hallelujah! "Love one another." - John 13:34',
            '"And we know that all things work together for good." - Romans 8:28',
            '"Trust in the Lord with all thine heart." - Proverbs 3:5'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addChatMessage(response, 'npc', 'Elder Samuel');
    }
    
    toggleChat() {
        const chatPanel = document.querySelector('.chat-panel');
        if (chatPanel) {
            const isMinimized = chatPanel.classList.contains('minimized');
            if (isMinimized) {
                chatPanel.classList.remove('minimized');
                this.elements.chatToggle.textContent = '_';
            } else {
                chatPanel.classList.add('minimized');
                this.elements.chatToggle.textContent = '□';
            }
        }
    }
    
    scrollChatToBottom() {
        if (this.elements.chatContent) {
            setTimeout(() => {
                this.elements.chatContent.scrollTop = this.elements.chatContent.scrollHeight;
            }, 50);
        }
    }
    
    setupChatAutoScroll() {
        // Add CSS for minimized chat
        if (!document.getElementById('chat-minimize-style')) {
            const style = document.createElement('style');
            style.id = 'chat-minimize-style';
            style.textContent = `
                .chat-panel.minimized .chat-content,
                .chat-panel.minimized .chat-input {
                    display: none;
                }
                .chat-panel.minimized {
                    height: 40px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Quest panel methods
    closeQuestPanel() {
        if (this.elements.questPanel) {
            this.elements.questPanel.style.display = 'none';
        }
    }
    
    // Modal system methods
    openScriptureModal(scriptureId) {
        const scriptureManager = this.gameEngine.getScriptureManager();
        if (scriptureManager) {
            scriptureManager.openScriptureModal(scriptureId);
            this.modalStack.push('scripture');
        }
    }
    
    closeScriptureModal() {
        if (this.elements.scriptureModal) {
            this.elements.scriptureModal.classList.add('hidden');
            this.modalStack = this.modalStack.filter(modal => modal !== 'scripture');
        }
    }
    
    closeTopModal() {
        if (this.modalStack.length > 0) {
            const topModal = this.modalStack.pop();
            switch (topModal) {
                case 'scripture':
                    this.closeScriptureModal();
                    break;
            }
        }
    }
    
    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    // Save/Load system
    saveGameData(data) {
        try {
            const saveData = {
                ...data,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            localStorage.setItem('spirit-to-soul-save', JSON.stringify(saveData));
            console.log('Game data saved');
            return true;
        } catch (error) {
            console.error('Failed to save game data:', error);
            return false;
        }
    }
    
    loadGameData() {
        try {
            const saveData = localStorage.getItem('spirit-to-soul-save');
            if (saveData) {
                const parsed = JSON.parse(saveData);
                console.log('Game data loaded');
                return parsed;
            }
        } catch (error) {
            console.error('Failed to load game data:', error);
        }
        return null;
    }
    
    clearSaveData() {
        try {
            localStorage.removeItem('spirit-to-soul-save');
            console.log('Save data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear save data:', error);
            return false;
        }
    }
    
    // Utility methods
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    // Mobile-specific UI adjustments
    setupMobileUI() {
        if (window.innerWidth <= 768) {
            // Show mobile controls
            const mobileControls = document.querySelector('.mobile-controls');
            if (mobileControls) {
                mobileControls.style.display = 'flex';
            }
            
            // Adjust chat panel for mobile
            const chatPanel = document.querySelector('.chat-panel');
            if (chatPanel) {
                chatPanel.style.width = '250px';
                chatPanel.style.height = '150px';
            }
            
            // Adjust quest panel for mobile
            if (this.elements.questPanel) {
                this.elements.questPanel.style.width = '280px';
                this.elements.questPanel.style.right = '10px';
            }
        }
    }
}

// Auto-setup mobile UI on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-controls { display: flex !important; }
            .chat-panel { width: 250px !important; height: 150px !important; }
            .quest-panel { width: 280px !important; right: 10px !important; }
        `;
        document.head.appendChild(style);
    }
});