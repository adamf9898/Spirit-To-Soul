// Game World Management and Rendering
class GameWorld {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.player = null;
        this.npcs = [];
        this.locations = [];
        this.quests = [];
        this.worldObjects = [];
        this.camera = { x: 0, y: 0 };
        
        this.initializeWorld();
    }
    
    initializeWorld() {
        this.createLocations();
        this.createNPCs();
        this.createWorldObjects();
    }
    
    createLocations() {
        // Create biblical locations on the map
        for (const [key, location] of Object.entries(GameConfig.LOCATIONS)) {
            this.locations.push({
                id: key,
                name: location.name,
                x: location.x,
                y: location.y,
                radius: 30,
                type: 'location',
                description: this.getLocationDescription(key),
                quests: this.getLocationQuests(key),
                visited: false
            });
        }
    }
    
    getLocationDescription(locationKey) {
        const descriptions = {
            'JERUSALEM': 'The holy city, center of faith and worship',
            'BETHLEHEM': 'The birthplace of our Lord Jesus Christ',
            'NAZARETH': 'Where Jesus grew up and began His ministry',
            'GALILEE': 'Where Jesus called His disciples and performed miracles',
            'JORDAN_RIVER': 'Where Jesus was baptized by John the Baptist',
            'MOUNT_SINAI': 'Where Moses received the Ten Commandments',
            'GARDEN_OF_EDEN': 'The paradise where it all began'
        };
        return descriptions[locationKey] || 'A place of spiritual significance';
    }
    
    getLocationQuests(locationKey) {
        const locationQuests = {
            'JERUSALEM': [
                {
                    title: 'Temple Cleansing',
                    description: 'Help restore order to the temple',
                    giver: 'Temple Priest',
                    scripture: 'Matthew 21:12-13'
                }
            ],
            'GALILEE': [
                {
                    title: 'Fishers of Men',
                    description: 'Learn to fish for souls',
                    giver: 'Fisherman Peter',
                    scripture: 'Matthew 4:19'
                }
            ],
            'BETHLEHEM': [
                {
                    title: 'Good News',
                    description: 'Share the news of Christ\'s birth',
                    giver: 'Shepherd',
                    scripture: 'Luke 2:10-11'
                }
            ]
        };
        return locationQuests[locationKey] || [];
    }
    
    createNPCs() {
        // Create Non-Player Characters with biblical themes
        this.npcs = [
            {
                id: 'peter',
                name: 'Simon Peter',
                x: 350,
                y: 150,
                type: 'apostle',
                dialogue: [
                    'Greetings, fellow believer!',
                    'Have you heard the Good News?',
                    'Follow Christ, and He will make you a fisher of men!'
                ],
                quests: ['fishers_of_men'],
                scriptures: ['Matthew 4:19', 'Matthew 16:16']
            },
            {
                id: 'mary',
                name: 'Mary of Bethany',
                x: 350,
                y: 350,
                type: 'disciple',
                dialogue: [
                    'Welcome, friend. How can I serve you?',
                    'Mary chose the better portion...',
                    'Listen to the words of Jesus.'
                ],
                quests: ['mary_and_martha'],
                scriptures: ['Luke 10:38-42']
            },
            {
                id: 'john_baptist',
                name: 'John the Baptist',
                x: 450,
                y: 250,
                type: 'prophet',
                dialogue: [
                    'Prepare ye the way of the Lord!',
                    'Repent, for the kingdom of heaven is at hand!',
                    'He must increase, but I must decrease.'
                ],
                quests: ['baptism_preparation'],
                scriptures: ['Matthew 3:2', 'John 3:30']
            },
            {
                id: 'david',
                name: 'David the Shepherd',
                x: 300,
                y: 200,
                type: 'king',
                dialogue: [
                    'The Lord is my shepherd; I shall not want.',
                    'Trust in the Lord with all your heart.',
                    'A man after God\'s own heart seeks wisdom.'
                ],
                quests: ['shepherd_quest'],
                scriptures: ['Psalm 23:1', '1 Samuel 13:14']
            }
        ];
    }
    
    createWorldObjects() {
        // Create interactive objects in the world
        this.worldObjects = [
            {
                id: 'well',
                name: 'Jacob\'s Well',
                x: 400,
                y: 200,
                type: 'well',
                interactable: true,
                description: 'A well of living water',
                action: 'drink',
                scripture: 'John 4:14'
            },
            {
                id: 'tree',
                name: 'Tree of Life',
                x: 600,
                y: 100,
                type: 'tree',
                interactable: true,
                description: 'A tree bearing fruit for eternal life',
                action: 'rest',
                scripture: 'Revelation 22:2'
            },
            {
                id: 'altar',
                name: 'Altar of Sacrifice',
                x: 200,
                y: 500,
                type: 'altar',
                interactable: true,
                description: 'A place of worship and sacrifice',
                action: 'pray',
                scripture: 'Romans 12:1'
            }
        ];
    }
    
    setPlayer(player) {
        this.player = player;
        this.centerCameraOnPlayer();
    }
    
    centerCameraOnPlayer() {
        if (this.player) {
            this.camera.x = this.player.x - this.canvas.width / 2;
            this.camera.y = this.player.y - this.canvas.height / 2;
            
            // Keep camera within world bounds
            this.camera.x = Math.max(0, Math.min(this.camera.x, 1000 - this.canvas.width));
            this.camera.y = Math.max(0, Math.min(this.camera.y, 800 - this.canvas.height));
        }
    }
    
    update() {
        if (this.player) {
            this.centerCameraOnPlayer();
            this.checkInteractions();
            this.updateNPCs();
        }
    }
    
    checkInteractions() {
        const playerCenterX = this.player.x + GameConfig.PLAYER_SIZE / 2;
        const playerCenterY = this.player.y + GameConfig.PLAYER_SIZE / 2;
        
        // Check location interactions
        this.locations.forEach(location => {
            const distance = Math.sqrt(
                Math.pow(playerCenterX - location.x, 2) + 
                Math.pow(playerCenterY - location.y, 2)
            );
            
            if (distance < location.radius && !location.visited) {
                this.triggerLocationVisit(location);
            }
        });
        
        // Check NPC interactions
        this.npcs.forEach(npc => {
            const distance = Math.sqrt(
                Math.pow(playerCenterX - npc.x, 2) + 
                Math.pow(playerCenterY - npc.y, 2)
            );
            
            if (distance < 40) {
                npc.nearPlayer = true;
            } else {
                npc.nearPlayer = false;
            }
        });
        
        // Check object interactions
        this.worldObjects.forEach(obj => {
            const distance = Math.sqrt(
                Math.pow(playerCenterX - obj.x, 2) + 
                Math.pow(playerCenterY - obj.y, 2)
            );
            
            if (distance < 30) {
                obj.nearPlayer = true;
            } else {
                obj.nearPlayer = false;
            }
        });
    }
    
    triggerLocationVisit(location) {
        location.visited = true;
        this.player.gainExperience(30);
        
        // Show location message
        this.showMessage(`You have arrived at ${location.name}`, location.description);
        
        // Check for location-specific events
        if (location.quests.length > 0) {
            this.showQuestOpportunity(location.quests[0]);
        }
    }
    
    updateNPCs() {
        // Simple AI for NPCs - they can move around their general area
        this.npcs.forEach(npc => {
            if (Math.random() < 0.01) { // 1% chance to move each frame
                const moveX = (Math.random() - 0.5) * 2;
                const moveY = (Math.random() - 0.5) * 2;
                
                npc.x = Math.max(50, Math.min(950, npc.x + moveX));
                npc.y = Math.max(50, Math.min(750, npc.y + moveY));
            }
        });
    }
    
    interactWithNPC(npcId) {
        const npc = this.npcs.find(n => n.id === npcId);
        if (npc && npc.nearPlayer) {
            const dialogue = npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];
            this.showDialogue(npc.name, dialogue);
            
            // Gain fellowship points for social interaction
            this.player.fellowshipPoints += 2;
            
            return true;
        }
        return false;
    }
    
    interactWithObject(objectId) {
        const object = this.worldObjects.find(o => o.id === objectId);
        if (object && object.nearPlayer) {
            switch (object.action) {
                case 'drink':
                    this.player.heal(25);
                    this.player.restoreFaith(15);
                    this.showMessage('Living Water', 'You are refreshed in body and spirit');
                    break;
                case 'rest':
                    this.player.heal(30);
                    this.player.gainWisdom(10);
                    this.showMessage('Divine Rest', 'You find peace under the tree of life');
                    break;
                case 'pray':
                    const prayerResult = this.player.pray();
                    this.showMessage('Prayer', `You offer prayers at the altar. Streak: ${prayerResult.streak} days`);
                    break;
            }
            return true;
        }
        return false;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB'; // Sky blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw world background
        this.drawBackground();
        
        // Draw world objects
        this.drawWorldObjects();
        
        // Draw NPCs
        this.drawNPCs();
        
        // Draw locations
        this.drawLocations();
        
        // Draw player
        this.drawPlayer();
        
        // Draw UI overlays
        this.drawUIOverlays();
    }
    
    drawBackground() {
        // Create a simple gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.3, '#98FB98'); // Pale green
        gradient.addColorStop(1, '#8FBC8F'); // Dark sea green
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw simple terrain features
        this.drawTerrain();
    }
    
    drawTerrain() {
        // Draw Jordan River
        this.ctx.strokeStyle = '#4169E1';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(430 - this.camera.x, 100 - this.camera.y);
        this.ctx.lineTo(470 - this.camera.x, 400 - this.camera.y);
        this.ctx.stroke();
        
        // Draw mountains (simple triangles)
        this.ctx.fillStyle = '#8B4513';
        this.drawMountain(180 - this.camera.x, 450 - this.camera.y, 40, 80);
        this.drawMountain(220 - this.camera.x, 480 - this.camera.y, 30, 60);
    }
    
    drawMountain(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width / 2, y - height);
        this.ctx.lineTo(x + width, y);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawLocations() {
        this.locations.forEach(location => {
            const x = location.x - this.camera.x;
            const y = location.y - this.camera.y;
            
            // Only draw if on screen
            if (x > -50 && x < this.canvas.width + 50 && y > -50 && y < this.canvas.height + 50) {
                // Draw location circle
                this.ctx.fillStyle = location.visited ? '#DAA520' : '#F0E68C';
                this.ctx.beginPath();
                this.ctx.arc(x, y, location.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Draw location border
                this.ctx.strokeStyle = '#8B4513';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                
                // Draw location name
                this.ctx.fillStyle = '#2F1B14';
                this.ctx.font = 'bold 12px Georgia';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(location.name, x, y + location.radius + 15);
            }
        });
    }
    
    drawNPCs() {
        this.npcs.forEach(npc => {
            const x = npc.x - this.camera.x;
            const y = npc.y - this.camera.y;
            
            // Only draw if on screen
            if (x > -30 && x < this.canvas.width + 30 && y > -30 && y < this.canvas.height + 30) {
                // Draw NPC
                this.ctx.fillStyle = this.getNPCColor(npc.type);
                this.ctx.fillRect(x - 15, y - 15, 30, 30);
                
                // Draw NPC border
                this.ctx.strokeStyle = npc.nearPlayer ? '#FFD700' : '#FFFFFF';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x - 15, y - 15, 30, 30);
                
                // Draw name
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '10px Georgia';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(npc.name, x, y - 20);
                
                // Draw interaction indicator
                if (npc.nearPlayer) {
                    this.ctx.fillStyle = '#FFD700';
                    this.ctx.beginPath();
                    this.ctx.arc(x, y - 25, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        });
    }
    
    getNPCColor(type) {
        const colors = {
            'apostle': '#4169E1',
            'disciple': '#9370DB',
            'prophet': '#DAA520',
            'king': '#8B4513'
        };
        return colors[type] || '#8FBC8F';
    }
    
    drawWorldObjects() {
        this.worldObjects.forEach(obj => {
            const x = obj.x - this.camera.x;
            const y = obj.y - this.camera.y;
            
            // Only draw if on screen
            if (x > -20 && x < this.canvas.width + 20 && y > -20 && y < this.canvas.height + 20) {
                this.ctx.fillStyle = this.getObjectColor(obj.type);
                
                switch (obj.type) {
                    case 'well':
                        this.ctx.beginPath();
                        this.ctx.arc(x, y, 15, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.strokeStyle = '#654321';
                        this.ctx.lineWidth = 3;
                        this.ctx.stroke();
                        break;
                    case 'tree':
                        // Tree trunk
                        this.ctx.fillStyle = '#8B4513';
                        this.ctx.fillRect(x - 5, y - 10, 10, 20);
                        // Tree top
                        this.ctx.fillStyle = '#228B22';
                        this.ctx.beginPath();
                        this.ctx.arc(x, y - 15, 20, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    case 'altar':
                        this.ctx.fillRect(x - 10, y - 5, 20, 10);
                        break;
                }
                
                // Draw interaction indicator
                if (obj.nearPlayer) {
                    this.ctx.strokeStyle = '#FFD700';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 25, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        });
    }
    
    getObjectColor(type) {
        const colors = {
            'well': '#87CEEB',
            'tree': '#228B22',
            'altar': '#8B4513'
        };
        return colors[type] || '#808080';
    }
    
    drawPlayer() {
        if (this.player) {
            const x = this.player.x - this.camera.x;
            const y = this.player.y - this.camera.y;
            
            // Draw player
            this.ctx.fillStyle = '#DAA520';
            this.ctx.fillRect(x, y, GameConfig.PLAYER_SIZE, GameConfig.PLAYER_SIZE);
            
            // Draw player border
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, GameConfig.PLAYER_SIZE, GameConfig.PLAYER_SIZE);
            
            // Draw facing direction
            this.ctx.fillStyle = '#FFFFFF';
            const centerX = x + GameConfig.PLAYER_SIZE / 2;
            const centerY = y + GameConfig.PLAYER_SIZE / 2;
            
            switch (this.player.facing) {
                case 'up':
                    this.ctx.fillRect(centerX - 2, y, 4, 6);
                    break;
                case 'down':
                    this.ctx.fillRect(centerX - 2, y + GameConfig.PLAYER_SIZE - 6, 4, 6);
                    break;
                case 'left':
                    this.ctx.fillRect(x, centerY - 2, 6, 4);
                    break;
                case 'right':
                    this.ctx.fillRect(x + GameConfig.PLAYER_SIZE - 6, centerY - 2, 6, 4);
                    break;
            }
        }
    }
    
    drawUIOverlays() {
        // Draw minimap
        this.drawMinimap();
    }
    
    drawMinimap() {
        const minimapSize = 120;
        const minimapX = this.canvas.width - minimapSize - 10;
        const minimapY = 10;
        
        // Minimap background
        this.ctx.fillStyle = 'rgba(47, 27, 20, 0.8)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Minimap border
        this.ctx.strokeStyle = '#DAA520';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Scale factor for minimap
        const scale = minimapSize / 1000;
        
        // Draw locations on minimap
        this.locations.forEach(location => {
            const x = minimapX + location.x * scale;
            const y = minimapY + location.y * scale;
            
            this.ctx.fillStyle = location.visited ? '#DAA520' : '#F0E68C';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw player on minimap
        if (this.player) {
            const playerX = minimapX + this.player.x * scale;
            const playerY = minimapY + this.player.y * scale;
            
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(playerX, playerY, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Message and dialogue systems
    showMessage(title, message) {
        // This would typically show a modal or notification
        console.log(`${title}: ${message}`);
        
        // Dispatch custom event for UI to handle
        const event = new CustomEvent('gameMessage', {
            detail: { title, message }
        });
        window.dispatchEvent(event);
    }
    
    showDialogue(speaker, text) {
        console.log(`${speaker}: ${text}`);
        
        const event = new CustomEvent('gameDialogue', {
            detail: { speaker, text }
        });
        window.dispatchEvent(event);
    }
    
    showQuestOpportunity(quest) {
        const event = new CustomEvent('questOpportunity', {
            detail: quest
        });
        window.dispatchEvent(event);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameWorld;
}