/**
 * World Class for Spirit-To-Soul
 * Represents the biblical game world with landscapes, NPCs, and locations
 */

class World {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // World dimensions
        this.width = 2400;  // Larger than canvas for exploration
        this.height = 1600;
        
        // Camera for viewport
        this.camera = {
            x: 0,
            y: 0,
            width: 1200,
            height: 800
        };
        
        // World entities
        this.entities = [];
        this.npcs = [];
        this.locations = [];
        this.terrain = [];
        
        // Biblical regions
        this.regions = [];
        
        // World state
        this.timeOfDay = 'morning'; // morning, noon, evening, night
        this.weather = 'clear'; // clear, cloudy, rain
        
        this.initialize();
    }
    
    initialize() {
        console.log('Initializing biblical world...');
        
        // Create terrain
        this.generateTerrain();
        
        // Create biblical locations
        this.createBiblicalLocations();
        
        // Create NPCs
        this.createNPCs();
        
        // Create interactive objects
        this.createInteractables();
        
        console.log('Biblical world initialized');
    }
    
    generateTerrain() {
        // Create different terrain types representing biblical lands
        this.terrain = [
            // Jordan River area
            {
                type: 'river',
                x: this.width * 0.3,
                y: 0,
                width: 60,
                height: this.height,
                color: '#4A90E2'
            },
            // Desert region (wilderness)
            {
                type: 'desert',
                x: this.width * 0.7,
                y: this.height * 0.2,
                width: this.width * 0.3,
                height: this.height * 0.6,
                color: '#D2B48C'
            },
            // Mountain region (Mount Sinai area)
            {
                type: 'mountain',
                x: this.width * 0.1,
                y: this.height * 0.1,
                width: this.width * 0.2,
                height: this.height * 0.3,
                color: '#8B7355'
            },
            // Fertile plains (Galilee area)
            {
                type: 'plains',
                x: this.width * 0.4,
                y: this.height * 0.3,
                width: this.width * 0.3,
                height: this.height * 0.4,
                color: '#90EE90'
            }
        ];
    }
    
    createBiblicalLocations() {
        this.locations = [
            {
                id: 'bethlehem',
                name: 'Bethlehem',
                x: this.width * 0.5,
                y: this.height * 0.6,
                radius: 80,
                type: 'city',
                description: 'The city where our Savior was born',
                scripture: 'micah_5_2'
            },
            {
                id: 'nazareth',
                name: 'Nazareth',
                x: this.width * 0.4,
                y: this.height * 0.4,
                radius: 70,
                type: 'town',
                description: 'The town where Jesus grew up',
                scripture: 'luke_4_16'
            },
            {
                id: 'jordan_river',
                name: 'Jordan River',
                x: this.width * 0.3,
                y: this.height * 0.5,
                radius: 100,
                type: 'water',
                description: 'Where Jesus was baptized by John',
                scripture: 'matthew_3_13'
            },
            {
                id: 'mount_sinai',
                name: 'Mount Sinai',
                x: this.width * 0.15,
                y: this.height * 0.2,
                radius: 90,
                type: 'mountain',
                description: 'Where Moses received the Ten Commandments',
                scripture: 'exodus_19_20'
            },
            {
                id: 'sea_of_galilee',
                name: 'Sea of Galilee',
                x: this.width * 0.45,
                y: this.height * 0.35,
                radius: 120,
                type: 'water',
                description: 'Where Jesus called His disciples',
                scripture: 'matthew_4_18'
            },
            {
                id: 'jerusalem',
                name: 'Jerusalem',
                x: this.width * 0.55,
                y: this.height * 0.65,
                radius: 100,
                type: 'holy_city',
                description: 'The Holy City',
                scripture: 'psalm_122_6'
            }
        ];
    }
    
    createNPCs() {
        this.npcs = [
            {
                id: 'village_elder',
                name: 'Elder Samuel',
                x: this.width * 0.5,
                y: this.height * 0.5,
                type: 'elder',
                dialogue: [
                    'Welcome, young disciple! The Lord has blessed this day.',
                    'Have you studied the scriptures today?',
                    'Remember, faith without works is dead. - James 2:26'
                ],
                quest: 'great_commission',
                sprite: { color: '#8B4513', symbol: '👴' }
            },
            {
                id: 'mary_magdalene',
                name: 'Mary Magdalene',
                x: this.width * 0.45,
                y: this.height * 0.4,
                type: 'disciple',
                dialogue: [
                    'I have seen the Lord! He is risen!',
                    'Do not let your hearts be troubled.',
                    'Go and tell the others the good news!'
                ],
                quest: 'spread_gospel',
                sprite: { color: '#4169E1', symbol: '👩' }
            },
            {
                id: 'peter',
                name: 'Simon Peter',
                x: this.width * 0.3,
                y: this.height * 0.5,
                type: 'apostle',
                dialogue: [
                    'Come, follow me, and I will make you fishers of men.',
                    'You are the Christ, the Son of the living God!',
                    'Lord, to whom shall we go? You have the words of eternal life.'
                ],
                quest: 'discipleship',
                sprite: { color: '#FF6347', symbol: '👨' }
            },
            {
                id: 'john_baptist',
                name: 'John the Baptist',
                x: this.width * 0.3,
                y: this.height * 0.45,
                type: 'prophet',
                dialogue: [
                    'Repent, for the kingdom of heaven is at hand!',
                    'He must increase, but I must decrease.',
                    'Behold, the Lamb of God!'
                ],
                quest: 'baptism_quest',
                sprite: { color: '#654321', symbol: '🧙' }
            }
        ];
        
        // Add NPCs to entities
        this.entities.push(...this.npcs);
    }
    
    createInteractables() {
        const interactables = [
            {
                id: 'well',
                name: 'Jacob\'s Well',
                x: this.width * 0.6,
                y: this.height * 0.4,
                type: 'well',
                description: 'A deep well where Jesus met the Samaritan woman',
                scripture: 'john_4_6',
                sprite: { color: '#8B4513', symbol: '🏺' },
                interact: (player) => {
                    this.gameEngine.uiManager.addChatMessage('You draw water from the ancient well', 'system');
                    player.faith.current = Math.min(player.faith.max, player.faith.current + 5);
                }
            },
            {
                id: 'altar',
                name: 'Stone Altar',
                x: this.width * 0.2,
                y: this.width * 0.3,
                type: 'altar',
                description: 'An altar for prayer and sacrifice',
                scripture: 'genesis_8_20',
                sprite: { color: '#696969', symbol: '⛩️' },
                interact: (player) => {
                    this.gameEngine.uiManager.addChatMessage('You kneel and pray at the altar', 'system');
                    player.usePrayer();
                }
            },
            {
                id: 'scroll',
                name: 'Ancient Scroll',
                x: this.width * 0.7,
                y: this.height * 0.3,
                type: 'scroll',
                description: 'A scroll containing sacred writings',
                scripture: 'psalm_119_105',
                sprite: { color: '#DEB887', symbol: '📜' },
                interact: (player) => {
                    this.gameEngine.uiManager.addChatMessage('You read from the ancient scroll', 'system');
                    player.learnScripture('psalm_119_105');
                }
            }
        ];
        
        this.entities.push(...interactables);
    }
    
    update(deltaTime) {
        // Update camera to follow player
        this.updateCamera();
        
        // Update NPCs
        this.updateNPCs(deltaTime);
        
        // Update world state (time, weather)
        this.updateWorldState(deltaTime);
        
        // Update entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
    }
    
    updateCamera() {
        const player = this.gameEngine.getPlayer();
        if (player) {
            // Center camera on player with smooth following
            const targetX = player.x - this.camera.width / 2;
            const targetY = player.y - this.camera.height / 2;
            
            // Keep camera within world bounds
            this.camera.x = Math.max(0, Math.min(this.width - this.camera.width, targetX));
            this.camera.y = Math.max(0, Math.min(this.height - this.camera.height, targetY));
        }
    }
    
    updateNPCs(deltaTime) {
        this.npcs.forEach(npc => {
            // Simple AI: NPCs move slightly for life-like behavior
            if (Math.random() < 0.1 * deltaTime) {
                const moveDistance = 20;
                const angle = Math.random() * Math.PI * 2;
                npc.x += Math.cos(angle) * moveDistance;
                npc.y += Math.sin(angle) * moveDistance;
                
                // Keep NPCs in reasonable bounds
                npc.x = Math.max(50, Math.min(this.width - 50, npc.x));
                npc.y = Math.max(50, Math.min(this.height - 50, npc.y));
            }
        });
    }
    
    updateWorldState(deltaTime) {
        // Simple day/night cycle (for demonstration)
        // In a full implementation, this would be more sophisticated
    }
    
    render(ctx) {
        ctx.save();
        
        // Apply camera transform
        ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render terrain
        this.renderTerrain(ctx);
        
        // Render locations
        this.renderLocations(ctx);
        
        // Render entities (NPCs, interactables)
        this.renderEntities(ctx);
        
        // Render world effects
        this.renderEffects(ctx);
        
        ctx.restore();
    }
    
    renderTerrain(ctx) {
        // Base terrain
        ctx.fillStyle = '#2a5934'; // Base grass color
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Render terrain features
        this.terrain.forEach(terrain => {
            ctx.fillStyle = terrain.color;
            
            if (terrain.type === 'river') {
                // Draw flowing river
                ctx.fillRect(terrain.x, terrain.y, terrain.width, terrain.height);
                
                // Add river banks
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(terrain.x - 10, terrain.y, 10, terrain.height);
                ctx.fillRect(terrain.x + terrain.width, terrain.y, 10, terrain.height);
            } else {
                ctx.fillRect(terrain.x, terrain.y, terrain.width, terrain.height);
            }
        });
        
        // Add some texture/pattern for visual interest
        this.renderTerrainDetails(ctx);
    }
    
    renderTerrainDetails(ctx) {
        // Add some rocks, trees, and other details
        ctx.fillStyle = '#654321';
        
        // Simple procedural generation for details
        for (let i = 0; i < 50; i++) {
            const x = (i * 123 + 456) % this.width;
            const y = (i * 789 + 234) % this.height;
            
            // Don't place details in water
            const isInWater = this.terrain.some(t => 
                t.type === 'river' && x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + t.height
            );
            
            if (!isInWater) {
                ctx.beginPath();
                ctx.arc(x, y, 3 + (i % 5), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Add some trees
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < 30; i++) {
            const x = (i * 234 + 567) % this.width;
            const y = (i * 890 + 123) % this.height;
            
            // Check if in valid area (not water or desert)
            const validArea = !this.terrain.some(t => 
                (t.type === 'river' || t.type === 'desert') && 
                x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + t.height
            );
            
            if (validArea) {
                // Tree trunk
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x - 2, y, 4, 20);
                
                // Tree foliage
                ctx.fillStyle = '#228B22';
                ctx.beginPath();
                ctx.arc(x, y - 5, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    renderLocations(ctx) {
        this.locations.forEach(location => {
            // Only render if in camera view
            if (this.isInCameraView(location.x, location.y, location.radius)) {
                // Draw location boundary
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 3;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(location.x, location.y, location.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Draw location center
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(location.x, location.y, 8, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw location name
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 16px Cinzel';
                ctx.textAlign = 'center';
                ctx.fillText(location.name, location.x, location.y - location.radius - 10);
                
                // Draw location symbol based on type
                const symbols = {
                    city: '🏘️',
                    town: '🏠',
                    water: '🌊',
                    mountain: '⛰️',
                    holy_city: '🕊️'
                };
                
                ctx.font = '24px Arial';
                ctx.fillText(symbols[location.type] || '📍', location.x, location.y + 5);
            }
        });
    }
    
    renderEntities(ctx) {
        // Sort entities by y position for proper depth
        const sortedEntities = [...this.entities].sort((a, b) => a.y - b.y);
        
        sortedEntities.forEach(entity => {
            if (this.isInCameraView(entity.x, entity.y, 50)) {
                this.renderEntity(ctx, entity);
            }
        });
    }
    
    renderEntity(ctx, entity) {
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(entity.x, entity.y + 15, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw entity body
        if (entity.sprite) {
            ctx.fillStyle = entity.sprite.color;
            ctx.fillRect(entity.x - 12, entity.y - 12, 24, 24);
            
            // Draw entity symbol/face
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(entity.sprite.symbol, entity.x, entity.y + 5);
        }
        
        // Draw name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(entity.name, entity.x, entity.y - 25);
        
        // Draw interaction indicator if near player
        const player = this.gameEngine.getPlayer();
        if (player) {
            const dx = entity.x - player.x;
            const dy = entity.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= player.interactionRadius) {
                // Draw interaction prompt
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 10px Arial';
                ctx.fillText('Press E to interact', entity.x, entity.y - 40);
                
                // Draw glow effect
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, 30, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    
    renderEffects(ctx) {
        // Render any world effects like weather, particles, etc.
        if (this.weather === 'rain') {
            this.renderRain(ctx);
        }
    }
    
    renderRain(ctx) {
        ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
        ctx.lineWidth = 1;
        
        const rainDrops = 100;
        for (let i = 0; i < rainDrops; i++) {
            const x = (this.camera.x + (i * 17) % this.camera.width);
            const y = (this.camera.y + (i * 23) % this.camera.height);
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x - 2, y + 10);
            ctx.stroke();
        }
    }
    
    isInCameraView(x, y, radius = 0) {
        return x + radius >= this.camera.x && 
               x - radius <= this.camera.x + this.camera.width &&
               y + radius >= this.camera.y && 
               y - radius <= this.camera.y + this.camera.height;
    }
    
    // World interaction methods
    getEntitiesAt(x, y, radius = 20) {
        return this.entities.filter(entity => {
            const dx = entity.x - x;
            const dy = entity.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
        });
    }
    
    getLocationAt(x, y) {
        return this.locations.find(location => {
            const dx = location.x - x;
            const dy = location.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= location.radius;
        });
    }
    
    addEntity(entity) {
        this.entities.push(entity);
    }
    
    removeEntity(entityId) {
        this.entities = this.entities.filter(e => e.id !== entityId);
    }
    
    // Getters
    getEntities() {
        return this.entities;
    }
    
    getNPCs() {
        return this.npcs;
    }
    
    getLocations() {
        return this.locations;
    }
    
    getCamera() {
        return this.camera;
    }
    
    // Utility methods for movement and collision
    isValidPosition(x, y) {
        // Check if position is valid (not in water for non-swimming entities, etc.)
        const inWater = this.terrain.some(t => 
            t.type === 'river' && x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + t.height
        );
        
        return !inWater && x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
    
    getRandomValidPosition() {
        let attempts = 0;
        let x, y;
        
        do {
            x = Math.random() * this.width;
            y = Math.random() * this.height;
            attempts++;
        } while (!this.isValidPosition(x, y) && attempts < 100);
        
        return { x: x || this.width / 2, y: y || this.height / 2 };
    }
}