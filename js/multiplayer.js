// Multiplayer and Fellowship Features
class MultiplayerManager {
    constructor() {
        this.isConnected = false;
        this.players = new Map();
        this.chatHistory = [];
        this.fellowshipEvents = [];
        this.prayerRequests = [];
        
        // For demo purposes, we'll simulate multiplayer features
        this.simulateMultiplayer();
    }
    
    // Simulate multiplayer functionality for demo
    simulateMultiplayer() {
        // Add some demo players
        this.addDemoPlayers();
        
        // Simulate periodic chat messages
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.simulateChatMessage();
            }
        }, 30000); // Every 30 seconds
        
        // Simulate fellowship events
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance
                this.simulateFellowshipEvent();
            }
        }, 60000); // Every minute
    }
    
    addDemoPlayers() {
        const demoPlayers = [
            { id: 'demo1', name: 'Paul the Apostle', level: 15, class: 'PROPHET' },
            { id: 'demo2', name: 'Mary Magdalene', level: 12, class: 'DISCIPLE' },
            { id: 'demo3', name: 'Timothy', level: 8, class: 'SCRIBE' },
            { id: 'demo4', name: 'Lydia', level: 10, class: 'SHEPHERD' }
        ];
        
        demoPlayers.forEach(player => {
            this.players.set(player.id, {
                ...player,
                online: Math.random() > 0.3, // 70% chance of being online
                lastSeen: new Date(),
                status: 'In Fellowship'
            });
        });
    }
    
    simulateChatMessage() {
        const messages = [
            { speaker: 'Paul the Apostle', text: 'Grace and peace to you all!' },
            { speaker: 'Mary Magdalene', text: 'The Lord has risen indeed!' },
            { speaker: 'Timothy', text: 'Study to shew thyself approved unto God...' },
            { speaker: 'Lydia', text: 'Let us pray for one another.' },
            { speaker: 'Paul the Apostle', text: 'Be strong in the Lord and in His mighty power.' },
            { speaker: 'Mary Magdalene', text: 'Has anyone completed the Jerusalem quest?' },
            { speaker: 'Timothy', text: 'I found a beautiful scripture today!' },
            { speaker: 'Lydia', text: 'Fellowship makes the journey so much sweeter.' }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        this.receiveChatMessage(randomMessage.speaker, randomMessage.text);
    }
    
    simulateFellowshipEvent() {
        const events = [
            'Paul the Apostle completed the "Road to Damascus" quest!',
            'Mary Magdalene memorized Psalm 139:14',
            'Timothy reached level 9!',
            'Lydia shared scripture with a seeking soul',
            'A group prayer session is starting in Jerusalem',
            'Bible study group forming at the Sea of Galilee'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.addFellowshipEvent(randomEvent);
    }
    
    // Chat functionality
    sendChatMessage(message) {
        const playerName = window.gameManager?.player?.name || 'Anonymous';
        
        // Add to local chat history
        this.chatHistory.push({
            sender: playerName,
            message: message,
            timestamp: new Date(),
            type: 'player'
        });
        
        // In a real multiplayer setup, this would send to server
        console.log(`Chat: ${playerName}: ${message}`);
        
        // Trigger UI update
        this.notifyUIUpdate('chat', {
            sender: playerName,
            message: message
        });
        
        // Check for scripture sharing
        this.checkScriptureSharing(message);
        
        return true;
    }
    
    receiveChatMessage(sender, message) {
        this.chatHistory.push({
            sender: sender,
            message: message,
            timestamp: new Date(),
            type: 'received'
        });
        
        // Notify UI
        this.notifyUIUpdate('chat', {
            sender: sender,
            message: message
        });
    }
    
    checkScriptureSharing(message) {
        // Check if message contains scripture references
        const scripturePattern = /\b\d?\s?[A-Za-z]+\s+\d+:\d+(-\d+)?\b/g;
        const matches = message.match(scripturePattern);
        
        if (matches && window.gameManager?.player) {
            // Reward player for sharing scripture
            window.gameManager.player.fellowshipPoints += 5;
            window.gameManager.player.gainExperience(10);
            
            matches.forEach(ref => {
                const verse = window.scriptureManager?.getVerse(ref);
                if (verse) {
                    // Auto-share the verse content
                    setTimeout(() => {
                        this.receiveChatMessage('Scripture Bot', `"${verse.text}" - ${verse.reference} (KJV)`);
                    }, 1000);
                }
            });
        }
    }
    
    // Fellowship events
    addFellowshipEvent(event) {
        this.fellowshipEvents.push({
            event: event,
            timestamp: new Date()
        });
        
        // Keep only last 20 events
        if (this.fellowshipEvents.length > 20) {
            this.fellowshipEvents = this.fellowshipEvents.slice(-20);
        }
        
        // Notify UI
        this.notifyUIUpdate('fellowship-event', { event });
    }
    
    // Prayer requests
    submitPrayerRequest(request, category = 'general') {
        const playerName = window.gameManager?.player?.name || 'Anonymous';
        
        const prayerRequest = {
            id: Date.now() + Math.random(),
            requester: playerName,
            request: request,
            category: category,
            timestamp: new Date(),
            prayers: 0,
            answered: false
        };
        
        this.prayerRequests.push(prayerRequest);
        
        // Gain fellowship points for sharing prayer request
        if (window.gameManager?.player) {
            window.gameManager.player.fellowshipPoints += 3;
        }
        
        this.notifyUIUpdate('prayer-request', prayerRequest);
        
        return prayerRequest.id;
    }
    
    prayForRequest(requestId) {
        const request = this.prayerRequests.find(r => r.id === requestId);
        if (request) {
            request.prayers++;
            
            // Gain experience and fellowship points for praying for others
            if (window.gameManager?.player) {
                window.gameManager.player.gainExperience(5);
                window.gameManager.player.fellowshipPoints += 2;
                window.gameManager.player.restoreFaith(5);
            }
            
            this.notifyUIUpdate('prayer-update', request);
            
            // Check if prayer has been answered (randomly for demo)
            if (request.prayers >= 3 && Math.random() > 0.7) {
                request.answered = true;
                this.addFellowshipEvent(`Prayer answered: ${request.request.substring(0, 50)}...`);
            }
        }
    }
    
    // Group activities
    startBibleStudy(location, topic) {
        const study = {
            id: Date.now(),
            host: window.gameManager?.player?.name || 'Anonymous',
            location: location,
            topic: topic,
            participants: [],
            startTime: new Date(),
            active: true
        };
        
        this.addFellowshipEvent(`Bible study started: "${topic}" at ${location}`);
        
        // Gain experience for hosting
        if (window.gameManager?.player) {
            window.gameManager.player.gainExperience(20);
            window.gameManager.player.fellowshipPoints += 10;
        }
        
        return study;
    }
    
    joinBibleStudy(studyId) {
        // In a real implementation, this would join an active study
        if (window.gameManager?.player) {
            window.gameManager.player.gainExperience(15);
            window.gameManager.player.fellowshipPoints += 5;
            window.gameManager.player.gainWisdom(10);
        }
        
        return true;
    }
    
    startPrayerCircle(intention) {
        const circle = {
            id: Date.now(),
            host: window.gameManager?.player?.name || 'Anonymous',
            intention: intention,
            participants: [],
            startTime: new Date(),
            active: true
        };
        
        this.addFellowshipEvent(`Prayer circle formed: ${intention}`);
        
        // Gain faith and fellowship points
        if (window.gameManager?.player) {
            window.gameManager.player.restoreFaith(15);
            window.gameManager.player.fellowshipPoints += 8;
        }
        
        return circle;
    }
    
    joinPrayerCircle(circleId) {
        if (window.gameManager?.player) {
            window.gameManager.player.restoreFaith(10);
            window.gameManager.player.fellowshipPoints += 5;
        }
        
        return true;
    }
    
    // Encouragement system
    encouragePlayer(playerId, message) {
        const player = this.players.get(playerId);
        if (player) {
            // Send encouragement
            this.receiveChatMessage('System', `${window.gameManager?.player?.name || 'Someone'} encouraged ${player.name}: ${message}`);
            
            // Gain fellowship points for encouraging others
            if (window.gameManager?.player) {
                window.gameManager.player.fellowshipPoints += 5;
                window.gameManager.player.restoreFaith(5);
                window.gameManager.player.gainExperience(8);
            }
            
            return true;
        }
        return false;
    }
    
    // Scripture sharing
    shareScriptureWithFellowship(reference, personalNote = '') {
        const verse = window.scriptureManager?.getVerse(reference);
        if (verse) {
            let message = `📖 ${verse.reference}: "${verse.text}"`;
            if (personalNote) {
                message += `\n💭 ${personalNote}`;
            }
            
            this.receiveChatMessage(window.gameManager?.player?.name || 'Anonymous', message);
            
            // Gain rewards for sharing scripture
            if (window.gameManager?.player) {
                window.gameManager.player.fellowshipPoints += 8;
                window.gameManager.player.gainExperience(15);
                window.gameManager.player.gainWisdom(5);
            }
            
            return true;
        }
        return false;
    }
    
    // Mentorship system
    offerMentorship(newPlayerName) {
        // Offer to mentor a new player
        if (window.gameManager?.player) {
            const player = window.gameManager.player;
            if (player.level >= 10) {
                player.mentorshipLevel++;
                player.fellowshipPoints += 15;
                
                this.addFellowshipEvent(`${player.name} is now mentoring ${newPlayerName}`);
                
                return true;
            }
        }
        return false;
    }
    
    requestMentor() {
        // Request a mentor (for new players)
        this.addFellowshipEvent(`${window.gameManager?.player?.name || 'A new believer'} is seeking a mentor`);
        
        // Simulate mentor assignment after delay
        setTimeout(() => {
            const mentors = ['Paul the Apostle', 'Timothy', 'Lydia'];
            const assignedMentor = mentors[Math.floor(Math.random() * mentors.length)];
            
            this.receiveChatMessage('System', `${assignedMentor} has accepted to mentor you! Welcome to the fellowship!`);
            
            if (window.gameManager?.player) {
                window.gameManager.player.fellowshipPoints += 10;
                window.gameManager.player.gainWisdom(15);
            }
        }, 5000);
        
        return true;
    }
    
    // Server/Community events
    announceServerEvent(eventType, details) {
        const events = {
            'daily_devotion': 'Daily devotion starting in the Garden of Eden',
            'group_quest': 'Group quest available: "Spread the Gospel"',
            'prayer_meeting': 'Community prayer meeting at Jerusalem Temple',
            'scripture_study': 'Group scripture study: "The Parables of Jesus"',
            'worship_service': 'Online worship service beginning soon'
        };
        
        const message = events[eventType] || details;
        this.addFellowshipEvent(`🎺 Server Event: ${message}`);
        
        return true;
    }
    
    // Fellowship statistics
    getFellowshipStats() {
        const player = window.gameManager?.player;
        if (!player) return null;
        
        return {
            fellowshipPoints: player.fellowshipPoints,
            chatMessagesSent: this.chatHistory.filter(m => m.sender === player.name).length,
            prayerRequestsSubmitted: this.prayerRequests.filter(r => r.requester === player.name).length,
            prayersOffered: this.prayerRequests.reduce((sum, r) => sum + (r.prayers || 0), 0),
            scripturesShared: player.scripturesMemorized?.length || 0,
            mentorshipLevel: player.mentorshipLevel || 0
        };
    }
    
    // Leaderboards
    getFellowshipLeaderboard() {
        // In a real implementation, this would come from server
        return [
            { name: 'Paul the Apostle', fellowshipPoints: 1250, level: 15 },
            { name: 'Mary Magdalene', fellowshipPoints: 980, level: 12 },
            { name: window.gameManager?.player?.name || 'You', fellowshipPoints: window.gameManager?.player?.fellowshipPoints || 0, level: window.gameManager?.player?.level || 1 },
            { name: 'Timothy', fellowshipPoints: 750, level: 8 },
            { name: 'Lydia', fellowshipPoints: 650, level: 10 }
        ].sort((a, b) => b.fellowshipPoints - a.fellowshipPoints);
    }
    
    // Utility methods
    notifyUIUpdate(type, data) {
        const event = new CustomEvent('multiplayerUpdate', {
            detail: { type, data }
        });
        window.dispatchEvent(event);
    }
    
    getOnlinePlayers() {
        return Array.from(this.players.values()).filter(p => p.online);
    }
    
    getChatHistory(limit = 50) {
        return this.chatHistory.slice(-limit);
    }
    
    getFellowshipEvents(limit = 20) {
        return this.fellowshipEvents.slice(-limit);
    }
    
    getPrayerRequests(category = null) {
        if (category) {
            return this.prayerRequests.filter(r => r.category === category && !r.answered);
        }
        return this.prayerRequests.filter(r => !r.answered);
    }
    
    // Connection management (simulated)
    connect() {
        this.isConnected = true;
        this.addFellowshipEvent(`${window.gameManager?.player?.name || 'A believer'} joined the fellowship`);
        return true;
    }
    
    disconnect() {
        this.isConnected = false;
        this.addFellowshipEvent(`${window.gameManager?.player?.name || 'A believer'} left the fellowship`);
        return true;
    }
    
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            playersOnline: this.getOnlinePlayers().length,
            serverMessage: 'Fellowship Hall is open 24/7 for prayer and encouragement'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerManager;
}