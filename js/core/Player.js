/**
 * Player Class for Spirit-To-Soul
 * Represents the player character with biblical attributes and abilities
 */

class Player {
    constructor(gameEngine, characterData = {}) {
        this.gameEngine = gameEngine;
        
        // Character properties
        this.name = characterData.name || 'Disciple';
        this.calling = characterData.calling || 'shepherd';
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Position and movement
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 150; // pixels per second
        this.isMoving = false;
        this.direction = 'down'; // up, down, left, right
        
        // Biblical attributes
        this.attributes = this.initializeAttributes(characterData.calling);
        
        // Resources
        this.health = { current: 100, max: 100 };
        this.faith = { current: 100, max: 100 };
        this.wisdom = { current: 50, max: 100 };
        
        // Inventory and abilities
        this.inventory = [];
        this.scriptures = [];
        this.abilities = this.initializeAbilities();
        
        // Visual properties
        this.sprite = null;
        this.animationFrame = 0;
        this.animationTime = 0;
        this.animationSpeed = 4; // frames per second
        
        // Interaction
        this.interactionRadius = 50;
        this.nearbyEntities = [];
        
        this.initialize();
    }
    
    initialize() {
        // Create player sprite representation
        this.createSprite();
        
        // Set initial position
        this.targetX = this.x;
        this.targetY = this.y;
        
        // Initialize starting scripture
        this.learnScripture('john_3_16');
        
        console.log(`Player ${this.name} (${this.calling}) initialized`);
    }
    
    initializeAttributes(calling) {
        const baseAttributes = {
            strength: 5,
            wisdom: 5,
            faith: 5,
            compassion: 5,
            courage: 5,
            understanding: 5
        };
        
        // Apply calling bonuses
        const callingBonuses = {
            shepherd: { wisdom: 2, faith: 1, compassion: 1 },
            warrior: { strength: 2, faith: 1, courage: 1 },
            healer: { compassion: 2, wisdom: 1, faith: 1 },
            teacher: { wisdom: 2, compassion: 1, understanding: 1 }
        };
        
        const bonuses = callingBonuses[calling] || callingBonuses.shepherd;
        
        Object.keys(bonuses).forEach(attr => {
            baseAttributes[attr] += bonuses[attr];
        });
        
        return baseAttributes;
    }
    
    initializeAbilities() {
        const baseAbilities = {
            prayer: { level: 1, cooldown: 0, maxCooldown: 10 },
            blessing: { level: 1, cooldown: 0, maxCooldown: 15 },
            scripture_recite: { level: 1, cooldown: 0, maxCooldown: 8 },
            healing_touch: { level: 1, cooldown: 0, maxCooldown: 20 }
        };
        
        // Calling-specific ability bonuses
        const callingAbilityBonuses = {
            shepherd: { blessing: 1 },
            warrior: { scripture_recite: 1 },
            healer: { healing_touch: 2 },
            teacher: { scripture_recite: 2 }
        };
        
        const bonuses = callingAbilityBonuses[this.calling] || {};
        Object.keys(bonuses).forEach(ability => {
            if (baseAbilities[ability]) {
                baseAbilities[ability].level += bonuses[ability];
            }
        });
        
        return baseAbilities;
    }
    
    createSprite() {
        // Create a simple visual representation
        this.sprite = {
            width: 32,
            height: 32,
            color: this.getCallingColor(),
            frames: 4
        };
    }
    
    getCallingColor() {
        const colors = {
            shepherd: '#8B4513', // Brown
            warrior: '#B22222', // Fire brick
            healer: '#32CD32', // Lime green
            teacher: '#4169E1'  // Royal blue
        };
        return colors[this.calling] || colors.shepherd;
    }
    
    update(deltaTime) {
        // Update cooldowns
        this.updateCooldowns(deltaTime);
        
        // Update movement
        this.updateMovement(deltaTime);
        
        // Update animation
        this.updateAnimation(deltaTime);
        
        // Update resources regeneration
        this.updateResources(deltaTime);
        
        // Check for nearby entities
        this.updateNearbyEntities();
        
        // Update UI
        this.updateUI();
    }
    
    updateCooldowns(deltaTime) {
        Object.keys(this.abilities).forEach(abilityName => {
            const ability = this.abilities[abilityName];
            if (ability.cooldown > 0) {
                ability.cooldown = Math.max(0, ability.cooldown - deltaTime);
            }
        });
    }
    
    updateMovement(deltaTime) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 2) {
            this.isMoving = true;
            
            // Normalize direction and apply speed
            const moveDistance = this.speed * deltaTime;
            const ratio = Math.min(moveDistance / distance, 1);
            
            this.x += dx * ratio;
            this.y += dy * ratio;
            
            // Update direction for sprite animation
            if (Math.abs(dx) > Math.abs(dy)) {
                this.direction = dx > 0 ? 'right' : 'left';
            } else {
                this.direction = dy > 0 ? 'down' : 'up';
            }
        } else {
            this.isMoving = false;
            this.x = this.targetX;
            this.y = this.targetY;
        }
        
        // Keep player within world bounds
        if (this.gameEngine.world) {
            this.x = Math.max(16, Math.min(this.gameEngine.world.width - 16, this.x));
            this.y = Math.max(16, Math.min(this.gameEngine.world.height - 16, this.y));
            this.targetX = this.x;
            this.targetY = this.y;
        }
    }
    
    updateAnimation(deltaTime) {
        if (this.isMoving) {
            this.animationTime += deltaTime;
            if (this.animationTime >= 1 / this.animationSpeed) {
                this.animationFrame = (this.animationFrame + 1) % this.sprite.frames;
                this.animationTime = 0;
            }
        } else {
            this.animationFrame = 0;
        }
    }
    
    updateResources(deltaTime) {
        // Slow faith regeneration
        if (this.faith.current < this.faith.max) {
            this.faith.current = Math.min(this.faith.max, this.faith.current + 2 * deltaTime);
        }
        
        // Very slow health regeneration when faith is high
        if (this.faith.current > this.faith.max * 0.8 && this.health.current < this.health.max) {
            this.health.current = Math.min(this.health.max, this.health.current + 0.5 * deltaTime);
        }
    }
    
    updateNearbyEntities() {
        // Find entities within interaction radius
        this.nearbyEntities = [];
        
        if (this.gameEngine.world) {
            const entities = this.gameEngine.world.getEntities();
            entities.forEach(entity => {
                const dx = entity.x - this.x;
                const dy = entity.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= this.interactionRadius) {
                    this.nearbyEntities.push(entity);
                }
            });
        }
    }
    
    updateUI() {
        // Update health bar
        const healthBar = document.getElementById('health-bar');
        const healthValue = document.getElementById('health-value');
        if (healthBar && healthValue) {
            const healthPercent = (this.health.current / this.health.max) * 100;
            healthBar.style.width = healthPercent + '%';
            healthValue.textContent = `${Math.round(this.health.current)}/${this.health.max}`;
        }
        
        // Update faith bar
        const faithBar = document.getElementById('faith-bar');
        const faithValue = document.getElementById('faith-value');
        if (faithBar && faithValue) {
            const faithPercent = (this.faith.current / this.faith.max) * 100;
            faithBar.style.width = faithPercent + '%';
            faithValue.textContent = `${Math.round(this.faith.current)}/${this.faith.max}`;
        }
        
        // Update player name and level
        const playerName = document.getElementById('player-name');
        const playerLevel = document.getElementById('player-level');
        if (playerName) playerName.textContent = this.name;
        if (playerLevel) playerLevel.textContent = `Level ${this.level}`;
    }
    
    render(ctx) {
        // Draw player sprite
        ctx.save();
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + 20, 12, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw character body
        ctx.fillStyle = this.sprite.color;
        ctx.fillRect(
            this.x - this.sprite.width / 2,
            this.y - this.sprite.height / 2,
            this.sprite.width,
            this.sprite.height
        );
        
        // Draw character face/head
        ctx.fillStyle = '#FDBCB4'; // Skin tone
        ctx.beginPath();
        ctx.arc(this.x, this.y - 8, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw calling symbol
        this.drawCallingSymbol(ctx);
        
        // Draw movement indicator if moving
        if (this.isMoving) {
            const bobOffset = Math.sin(this.animationTime * 10) * 2;
            ctx.translate(0, bobOffset);
        }
        
        // Draw name above character
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - 35);
        
        ctx.restore();
        
        // Draw interaction range if near entities
        if (this.nearbyEntities.length > 0) {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.interactionRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    drawCallingSymbol(ctx) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        const symbols = {
            shepherd: '🐑',
            warrior: '⚔️',
            healer: '✚',
            teacher: '📖'
        };
        
        const symbol = symbols[this.calling] || symbols.shepherd;
        ctx.fillText(symbol, this.x, this.y - 20);
    }
    
    // Movement methods
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    moveInDirection(direction, distance = 50) {
        switch (direction) {
            case 'up':
                this.targetY = Math.max(16, this.y - distance);
                break;
            case 'down':
                this.targetY = this.y + distance;
                break;
            case 'left':
                this.targetX = Math.max(16, this.x - distance);
                break;
            case 'right':
                this.targetX = this.x + distance;
                break;
        }
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }
    
    // Ability methods
    useAbility(abilityName) {
        const ability = this.abilities[abilityName];
        if (!ability || ability.cooldown > 0) {
            return false;
        }
        
        switch (abilityName) {
            case 'prayer':
                return this.usePrayer();
            case 'blessing':
                return this.useBlessing();
            case 'scripture_recite':
                return this.useScriptureRecite();
            case 'healing_touch':
                return this.useHealingTouch();
            default:
                return false;
        }
    }
    
    usePrayer() {
        console.log(`${this.name} offers a prayer`);
        
        // Restore faith
        this.faith.current = Math.min(this.faith.max, this.faith.current + 20);
        
        // Set cooldown
        this.abilities.prayer.cooldown = this.abilities.prayer.maxCooldown;
        
        // Add visual effect
        this.createPrayerEffect();
        
        // Add chat message
        this.gameEngine.uiManager.addChatMessage(`${this.name} offers a prayer`, 'player');
        
        return true;
    }
    
    useBlessing() {
        console.log(`${this.name} bestows a blessing`);
        
        // Heal self and nearby entities
        this.health.current = Math.min(this.health.max, this.health.current + 15);
        
        // Heal nearby entities (NPCs or other players)
        this.nearbyEntities.forEach(entity => {
            if (entity.heal) {
                entity.heal(10);
            }
        });
        
        // Set cooldown
        this.abilities.blessing.cooldown = this.abilities.blessing.maxCooldown;
        
        // Add visual effect
        this.createBlessingEffect();
        
        this.gameEngine.uiManager.addChatMessage(`${this.name} bestows a blessing`, 'player');
        
        return true;
    }
    
    useScriptureRecite() {
        console.log(`${this.name} recites scripture`);
        
        if (this.scriptures.length === 0) {
            this.gameEngine.uiManager.addChatMessage('You need to learn some scriptures first!', 'system');
            return false;
        }
        
        // Select random scripture
        const scripture = this.scriptures[Math.floor(Math.random() * this.scriptures.length)];
        
        // Boost faith and wisdom
        this.faith.current = Math.min(this.faith.max, this.faith.current + 10);
        this.wisdom.current = Math.min(this.wisdom.max, this.wisdom.current + 5);
        
        // Set cooldown
        this.abilities.scripture_recite.cooldown = this.abilities.scripture_recite.maxCooldown;
        
        // Share scripture in chat
        this.gameEngine.uiManager.addChatMessage(`${this.name} recites: "${scripture.text}" - ${scripture.reference}`, 'scripture');
        
        return true;
    }
    
    useHealingTouch() {
        console.log(`${this.name} uses healing touch`);
        
        if (this.faith.current < 20) {
            this.gameEngine.uiManager.addChatMessage('Not enough faith for healing touch!', 'system');
            return false;
        }
        
        // Consume faith
        this.faith.current -= 20;
        
        // Heal significantly
        this.health.current = Math.min(this.health.max, this.health.current + 40);
        
        // Set cooldown
        this.abilities.healing_touch.cooldown = this.abilities.healing_touch.maxCooldown;
        
        // Add visual effect
        this.createHealingEffect();
        
        this.gameEngine.uiManager.addChatMessage(`${this.name} channels divine healing`, 'player');
        
        return true;
    }
    
    // Visual effects
    createPrayerEffect() {
        // Create floating prayer symbols
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFloatingSymbol('🙏', '#FFD700');
            }, i * 200);
        }
    }
    
    createBlessingEffect() {
        // Create blessing sparkles
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFloatingSymbol('✨', '#FFFFFF');
            }, i * 100);
        }
    }
    
    createHealingEffect() {
        // Create healing hearts
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.createFloatingSymbol('❤️', '#FF69B4');
            }, i * 150);
        }
    }
    
    createFloatingSymbol(symbol, color) {
        // This would create floating visual effects in a more complete implementation
        console.log(`Visual effect: ${symbol} at player position`);
    }
    
    // Scripture and learning
    learnScripture(scriptureId) {
        const scripture = this.gameEngine.scriptureManager.getScripture(scriptureId);
        if (scripture && !this.hasScripture(scriptureId)) {
            this.scriptures.push(scripture);
            this.gameEngine.uiManager.addChatMessage(`You have learned: ${scripture.reference}`, 'system');
            console.log(`Player learned scripture: ${scripture.reference}`);
        }
    }
    
    hasScripture(scriptureId) {
        return this.scriptures.some(s => s.id === scriptureId);
    }
    
    // Experience and leveling
    gainExperience(amount) {
        this.experience += amount;
        this.gameEngine.uiManager.addChatMessage(`+${amount} XP`, 'system');
        
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
        
        // Increase stats
        this.health.max += 10;
        this.faith.max += 10;
        this.wisdom.max += 5;
        
        // Restore all resources
        this.health.current = this.health.max;
        this.faith.current = this.faith.max;
        this.wisdom.current = this.wisdom.max;
        
        this.gameEngine.uiManager.addChatMessage(`Congratulations! You reached level ${this.level}!`, 'system');
        console.log(`Player leveled up to ${this.level}`);
    }
    
    // Interaction
    interact() {
        if (this.nearbyEntities.length > 0) {
            const entity = this.nearbyEntities[0];
            if (entity.interact) {
                entity.interact(this);
                return true;
            }
        }
        return false;
    }
    
    // Getters
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    getAttributes() {
        return { ...this.attributes };
    }
    
    getStats() {
        return {
            health: { ...this.health },
            faith: { ...this.faith },
            wisdom: { ...this.wisdom }
        };
    }
}