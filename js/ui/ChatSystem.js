/**
 * Chat System for Spirit-To-Soul
 * Handles fellowship chat and Gospel sharing
 */

class ChatSystem {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.gameEngine = uiManager.gameEngine;
        
        // Chat state
        this.isMinimized = false;
        this.chatFilters = {
            system: true,
            player: true,
            npc: true,
            scripture: true
        };
        
        // Auto-responses for NPCs
        this.npcResponses = new Map();
        this.loadNPCResponses();
        
        this.initialize();
    }
    
    initialize() {
        this.setupChatCommands();
        this.setupAutoScrolling();
        console.log('Chat System initialized');
    }
    
    loadNPCResponses() {
        this.npcResponses.set('greeting', [
            'Peace be with you, fellow believer!',
            'Blessings in the name of our Lord!',
            'May God\'s grace be upon you this day!',
            'Welcome, disciple of Christ!',
            'The Lord has blessed this meeting!'
        ]);
        
        this.npcResponses.set('encouragement', [
            '"Be strong and of good courage!" - Joshua 1:9',
            '"The Lord is my shepherd; I shall not want." - Psalm 23:1',
            '"I can do all things through Christ which strengtheneth me." - Philippians 4:13',
            '"Trust in the Lord with all thine heart." - Proverbs 3:5',
            '"And we know that all things work together for good." - Romans 8:28'
        ]);
        
        this.npcResponses.set('gospel', [
            '"For God so loved the world, that he gave his only begotten Son..." - John 3:16',
            '"Come unto me, all ye that labour and are heavy laden." - Matthew 11:28',
            '"Jesus saith unto him, I am the way, the truth, and the life." - John 14:6',
            '"For by grace are ye saved through faith." - Ephesians 2:8',
            '"Behold, I stand at the door, and knock." - Revelation 3:20'
        ]);
        
        this.npcResponses.set('wisdom', [
            '"The fear of the Lord is the beginning of wisdom." - Proverbs 9:10',
            '"If any of you lack wisdom, let him ask of God." - James 1:5',
            '"Thy word is a lamp unto my feet, and a light unto my path." - Psalm 119:105',
            '"Study to shew thyself approved unto God." - 2 Timothy 2:15',
            '"The entrance of thy words giveth light." - Psalm 119:130'
        ]);
    }
    
    setupChatCommands() {
        // Chat commands for enhanced interaction
        this.commands = {
            '/help': () => this.showHelpMessage(),
            '/scripture': (args) => this.shareRandomScripture(args),
            '/pray': () => this.initiateGroupPrayer(),
            '/bless': (args) => this.sendBlessing(args),
            '/verse': (args) => this.lookupVerse(args),
            '/clear': () => this.clearChat(),
            '/time': () => this.showTime(),
            '/who': () => this.showOnlinePlayers()
        };
    }
    
    setupAutoScrolling() {
        // Set up intersection observer for auto-scroll
        const chatContent = document.getElementById('chat-content');
        if (chatContent) {
            this.isScrolledToBottom = true;
            
            chatContent.addEventListener('scroll', () => {
                const threshold = 5;
                this.isScrolledToBottom = chatContent.scrollTop + chatContent.clientHeight >= chatContent.scrollHeight - threshold;
            });
        }
    }
    
    processMessage(message) {
        const trimmed = message.trim();
        
        // Check for commands
        if (trimmed.startsWith('/')) {
            this.processCommand(trimmed);
            return;
        }
        
        // Regular message
        const player = this.gameEngine.getPlayer();
        const playerName = player ? player.name : 'Anonymous';
        
        this.uiManager.addChatMessage(message, 'player', playerName);
        
        // Trigger NPC responses
        this.triggerNPCResponse(message);
    }
    
    processCommand(commandText) {
        const parts = commandText.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');
        
        const commandFunction = this.commands[command];
        if (commandFunction) {
            commandFunction(args);
        } else {
            this.uiManager.addChatMessage(`Unknown command: ${command}. Type /help for available commands.`, 'system');
        }
    }
    
    showHelpMessage() {
        const helpText = `
📖 Chat Commands:
/help - Show this help message
/scripture [theme] - Share a random scripture
/pray - Start group prayer
/bless [player] - Send blessing
/verse [reference] - Look up specific verse
/clear - Clear chat history
/time - Show current time
/who - Show online players

💬 Chat Features:
- Share scriptures and testimonies
- Encourage fellow believers
- Participate in group prayers
- Fellowship with other disciples
        `;
        
        this.uiManager.addChatMessage(helpText, 'system');
    }
    
    shareRandomScripture(theme) {
        const scriptureManager = this.gameEngine.getScriptureManager();
        if (!scriptureManager) return;
        
        let scripture;
        if (theme) {
            const themeScriptures = scriptureManager.searchScriptures(theme);
            if (themeScriptures.length > 0) {
                scripture = themeScriptures[Math.floor(Math.random() * themeScriptures.length)];
            }
        }
        
        if (!scripture) {
            scripture = scriptureManager.getRandomScripture();
        }
        
        if (scripture) {
            const player = this.gameEngine.getPlayer();
            const playerName = player ? player.name : 'Anonymous';
            
            this.uiManager.addChatMessage(`"${scripture.text}" - ${scripture.reference}`, 'scripture', playerName);
        }
    }
    
    initiateGroupPrayer() {
        const player = this.gameEngine.getPlayer();
        const playerName = player ? player.name : 'Anonymous';
        
        this.uiManager.addChatMessage(`${playerName} has started a group prayer. 🙏`, 'system');
        
        // Auto-prayer responses from NPCs
        setTimeout(() => {
            this.uiManager.addChatMessage('Elder Samuel joined the prayer', 'system');
        }, 1000);
        
        setTimeout(() => {
            this.uiManager.addChatMessage('"Our Father which art in heaven, Hallowed be thy name..." - Matthew 6:9', 'npc', 'Elder Samuel');
        }, 2000);
        
        setTimeout(() => {
            this.uiManager.addChatMessage('Mary Magdalene joined the prayer', 'system');
        }, 3000);
        
        setTimeout(() => {
            this.uiManager.addChatMessage('Amen! May God bless our fellowship. 🙏', 'npc', 'Mary Magdalene');
        }, 4000);
    }
    
    sendBlessing(targetPlayer) {
        const player = this.gameEngine.getPlayer();
        const playerName = player ? player.name : 'Anonymous';
        
        const target = targetPlayer || 'everyone';
        const blessings = [
            'May God bless and keep you always',
            'May His face shine upon you',
            'May you find peace in His presence',
            'May His love surround you this day',
            'May you walk in His light and truth'
        ];
        
        const blessing = blessings[Math.floor(Math.random() * blessings.length)];
        this.uiManager.addChatMessage(`${playerName} blesses ${target}: ${blessing} ✨`, 'blessing');
    }
    
    lookupVerse(reference) {
        if (!reference) {
            this.uiManager.addChatMessage('Please specify a verse reference (e.g., /verse John 3:16)', 'system');
            return;
        }
        
        const scriptureManager = this.gameEngine.getScriptureManager();
        if (!scriptureManager) return;
        
        const found = scriptureManager.searchScriptures(reference);
        if (found.length > 0) {
            const scripture = found[0];
            this.uiManager.addChatMessage(`"${scripture.text}" - ${scripture.reference}`, 'scripture');
        } else {
            this.uiManager.addChatMessage(`Could not find verse: ${reference}`, 'system');
        }
    }
    
    clearChat() {
        const chatContent = document.getElementById('chat-content');
        if (chatContent) {
            chatContent.innerHTML = '';
            this.uiManager.chatMessages = [];
        }
        
        this.uiManager.addChatMessage('Chat cleared. Peace be with you! 🕊️', 'system');
    }
    
    showTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        this.uiManager.addChatMessage(`Current time: ${timeStr}`, 'system');
    }
    
    showOnlinePlayers() {
        const player = this.gameEngine.getPlayer();
        const playerName = player ? player.name : 'Anonymous';
        
        // In a real multiplayer game, this would show actual online players
        const simulatedPlayers = [
            playerName,
            'Elder Samuel',
            'Mary Magdalene', 
            'Simon Peter',
            'John the Baptist'
        ];
        
        this.uiManager.addChatMessage(`Online believers: ${simulatedPlayers.join(', ')}`, 'system');
    }
    
    triggerNPCResponse(message) {
        const messageText = message.toLowerCase();
        
        // Determine response type based on message content
        let responseType = null;
        let responseDelay = 1000 + Math.random() * 2000; // 1-3 seconds
        
        if (messageText.includes('hello') || messageText.includes('hi') || messageText.includes('greetings')) {
            responseType = 'greeting';
        } else if (messageText.includes('help') || messageText.includes('struggling') || messageText.includes('difficult')) {
            responseType = 'encouragement';
        } else if (messageText.includes('jesus') || messageText.includes('christ') || messageText.includes('salvation') || messageText.includes('gospel')) {
            responseType = 'gospel';
        } else if (messageText.includes('wisdom') || messageText.includes('guidance') || messageText.includes('learn')) {
            responseType = 'wisdom';
        } else if (Math.random() < 0.3) { // 30% chance for random encouragement
            responseType = 'encouragement';
        }
        
        if (responseType) {
            setTimeout(() => {
                this.sendNPCResponse(responseType);
            }, responseDelay);
        }
    }
    
    sendNPCResponse(responseType) {
        const responses = this.npcResponses.get(responseType);
        if (!responses || responses.length === 0) return;
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        const npcs = ['Elder Samuel', 'Mary Magdalene', 'Simon Peter', 'John the Baptist'];
        const npc = npcs[Math.floor(Math.random() * npcs.length)];
        
        this.uiManager.addChatMessage(response, 'npc', npc);
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const chatPanel = document.querySelector('.chat-panel');
        
        if (chatPanel) {
            if (this.isMinimized) {
                chatPanel.classList.add('minimized');
            } else {
                chatPanel.classList.remove('minimized');
                this.scrollToBottom();
            }
        }
    }
    
    scrollToBottom() {
        if (this.isScrolledToBottom) {
            const chatContent = document.getElementById('chat-content');
            if (chatContent) {
                setTimeout(() => {
                    chatContent.scrollTop = chatContent.scrollHeight;
                }, 50);
            }
        }
    }
    
    addMessage(message, type = 'system', sender = null) {
        this.uiManager.addChatMessage(message, type, sender);
        this.scrollToBottom();
    }
    
    // Public API
    sendSystemMessage(message) {
        this.addMessage(message, 'system');
    }
    
    sendScriptureMessage(scripture) {
        this.addMessage(`"${scripture.text}" - ${scripture.reference}`, 'scripture');
    }
    
    announcePlayerAction(playerName, action) {
        this.addMessage(`${playerName} ${action}`, 'system');
    }
}