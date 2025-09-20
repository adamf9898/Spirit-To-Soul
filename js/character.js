// Character Management
class Character {
    constructor(name = '', characterClass = 'DISCIPLE') {
        this.name = name;
        this.class = characterClass;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Initialize stats based on class
        const classData = GameConfig.CHARACTER_CLASSES[characterClass];
        this.maxStats = { ...classData.stats };
        this.currentStats = { ...classData.stats };
        
        // Position and movement
        this.x = 400;
        this.y = 300;
        this.facing = 'down';
        this.isMoving = false;
        
        // Inventory and equipment
        this.inventory = [];
        this.maxInventorySize = 20;
        this.equipped = {
            weapon: null,
            armor: null,
            accessory: null
        };
        
        // Spiritual journey
        this.questsCompleted = [];
        this.currentQuest = null;
        this.scripturesMemorized = [];
        this.prayerStreak = 0;
        this.lastPrayerDate = null;
        
        // Achievements and milestones
        this.achievements = [];
        this.faithMilestones = [];
        
        // Social features
        this.fellowshipPoints = 0;
        this.mentorshipLevel = 0;
        
        // Initialize starting items
        this.initializeStartingItems();
    }
    
    initializeStartingItems() {
        // Add starting items based on class
        const startingItems = {
            'DISCIPLE': ['BREAD', 'WATER'],
            'PROPHET': ['SCROLL', 'LAMP'],
            'SHEPHERD': ['STAFF', 'BREAD'],
            'SCRIBE': ['SCROLL', 'LAMP']
        };
        
        const items = startingItems[this.class] || ['BREAD'];
        items.forEach(itemKey => {
            this.addToInventory(GameConfig.ITEMS[itemKey]);
        });
    }
    
    // Movement methods
    move(direction) {
        const oldX = this.x;
        const oldY = this.y;
        
        switch (direction) {
            case 'up':
                this.y = Math.max(0, this.y - GameConfig.PLAYER_SPEED);
                break;
            case 'down':
                this.y = Math.min(GameConfig.CANVAS_HEIGHT - GameConfig.PLAYER_SIZE, 
                                 this.y + GameConfig.PLAYER_SPEED);
                break;
            case 'left':
                this.x = Math.max(0, this.x - GameConfig.PLAYER_SPEED);
                break;
            case 'right':
                this.x = Math.min(GameConfig.CANVAS_WIDTH - GameConfig.PLAYER_SIZE, 
                                 this.x + GameConfig.PLAYER_SPEED);
                break;
        }
        
        // Update facing direction if actually moved
        if (this.x !== oldX || this.y !== oldY) {
            this.facing = direction;
            this.isMoving = true;
        }
    }
    
    stopMoving() {
        this.isMoving = false;
    }
    
    // Experience and leveling
    gainExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
        
        return this.level;
    }
    
    levelUp() {
        this.experience -= this.experienceToNext;
        this.level++;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
        
        // Increase stats on level up
        this.maxStats.health += 10;
        this.maxStats.faith += 5;
        this.maxStats.wisdom += 3;
        
        // Restore health and other stats
        this.currentStats = { ...this.maxStats };
        
        // Unlock new abilities or features based on level
        this.checkLevelMilestones();
        
        return {
            level: this.level,
            newStats: this.maxStats,
            message: `Blessed! You have grown in faith to level ${this.level}!`
        };
    }
    
    checkLevelMilestones() {
        const milestones = {
            5: 'Advanced Prayer unlocked',
            10: 'Scripture Teaching unlocked',
            15: 'Fellowship Leadership unlocked',
            20: 'Divine Guidance unlocked'
        };
        
        if (milestones[this.level]) {
            this.achievements.push({
                title: 'Level Milestone',
                description: milestones[this.level],
                date: new Date().toISOString()
            });
        }
    }
    
    // Health and status management
    takeDamage(amount) {
        this.currentStats.health = Math.max(0, this.currentStats.health - amount);
        return this.currentStats.health <= 0;
    }
    
    heal(amount) {
        this.currentStats.health = Math.min(this.maxStats.health, 
                                           this.currentStats.health + amount);
    }
    
    restoreFaith(amount) {
        this.currentStats.faith = Math.min(this.maxStats.faith, 
                                          this.currentStats.faith + amount);
    }
    
    gainWisdom(amount) {
        this.currentStats.wisdom = Math.min(this.maxStats.wisdom, 
                                           this.currentStats.wisdom + amount);
    }
    
    // Inventory management
    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push({
                ...item,
                id: Date.now() + Math.random(),
                quantity: item.quantity || 1
            });
            return true;
        }
        return false;
    }
    
    removeFromInventory(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        if (index > -1) {
            return this.inventory.splice(index, 1)[0];
        }
        return null;
    }
    
    useItem(itemId) {
        const item = this.inventory.find(i => i.id === itemId);
        if (!item) return false;
        
        // Apply item effects
        switch (item.name) {
            case 'Bread of Life':
                this.heal(20);
                this.restoreFaith(10);
                break;
            case 'Living Water':
                this.heal(15);
                this.gainWisdom(5);
                break;
            case 'Sacred Scroll':
                this.gainWisdom(10);
                this.gainExperience(25);
                break;
            case 'Lamp of Truth':
                this.restoreFaith(15);
                break;
        }
        
        // Remove item after use (consumables)
        if (item.consumable !== false) {
            this.removeFromInventory(itemId);
        }
        
        return true;
    }
    
    // Quest management
    startQuest(quest) {
        this.currentQuest = {
            ...quest,
            startDate: new Date().toISOString(),
            progress: {},
            completed: false
        };
    }
    
    updateQuestProgress(objectiveId, progress) {
        if (this.currentQuest) {
            this.currentQuest.progress[objectiveId] = progress;
            this.checkQuestCompletion();
        }
    }
    
    checkQuestCompletion() {
        if (!this.currentQuest) return false;
        
        const allObjectivesComplete = this.currentQuest.objectives.every(
            (objective, index) => this.currentQuest.progress[index] === true
        );
        
        if (allObjectivesComplete) {
            this.completeQuest();
            return true;
        }
        
        return false;
    }
    
    completeQuest() {
        if (this.currentQuest) {
            this.currentQuest.completed = true;
            this.currentQuest.completionDate = new Date().toISOString();
            
            // Add to completed quests
            this.questsCompleted.push(this.currentQuest);
            
            // Grant rewards
            const expReward = 50 * this.level;
            this.gainExperience(expReward);
            
            if (this.currentQuest.reward) {
                const rewardItem = GameConfig.ITEMS[this.currentQuest.reward];
                if (rewardItem) {
                    this.addToInventory(rewardItem);
                }
            }
            
            this.currentQuest = null;
        }
    }
    
    // Scripture memorization
    memorizeScripture(reference) {
        if (!this.scripturesMemorized.includes(reference)) {
            this.scripturesMemorized.push(reference);
            this.gainExperience(15);
            this.gainWisdom(5);
            
            // Check for memorization milestones
            const count = this.scripturesMemorized.length;
            if (count % 10 === 0) {
                this.achievements.push({
                    title: 'Scripture Scholar',
                    description: `Memorized ${count} verses`,
                    date: new Date().toISOString()
                });
            }
        }
    }
    
    // Prayer and spiritual disciplines
    pray() {
        const today = new Date().toDateString();
        
        if (this.lastPrayerDate !== today) {
            this.prayerStreak++;
            this.lastPrayerDate = today;
            
            // Prayer benefits
            this.restoreFaith(20);
            this.heal(10);
            this.gainExperience(10);
            
            // Check prayer streak milestones
            if (this.prayerStreak % 7 === 0) {
                this.achievements.push({
                    title: 'Faithful Prayer Warrior',
                    description: `${this.prayerStreak} day prayer streak`,
                    date: new Date().toISOString()
                });
                this.gainWisdom(10);
            }
        }
        
        return {
            faithRestored: 20,
            healthRestored: 10,
            streak: this.prayerStreak
        };
    }
    
    // Fellowship and social features
    encourageFellow(otherPlayer) {
        this.fellowshipPoints += 5;
        this.restoreFaith(5);
        
        return {
            message: `You have encouraged ${otherPlayer}!`,
            fellowshipPoints: this.fellowshipPoints
        };
    }
    
    shareScripture(reference, otherPlayer) {
        this.fellowshipPoints += 10;
        this.gainExperience(20);
        
        return {
            message: `You shared ${reference} with ${otherPlayer}`,
            fellowshipPoints: this.fellowshipPoints
        };
    }
    
    // Save/Load functionality
    toSaveData() {
        return {
            name: this.name,
            class: this.class,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            maxStats: this.maxStats,
            currentStats: this.currentStats,
            x: this.x,
            y: this.y,
            inventory: this.inventory,
            equipped: this.equipped,
            questsCompleted: this.questsCompleted,
            currentQuest: this.currentQuest,
            scripturesMemorized: this.scripturesMemorized,
            prayerStreak: this.prayerStreak,
            lastPrayerDate: this.lastPrayerDate,
            achievements: this.achievements,
            fellowshipPoints: this.fellowshipPoints,
            mentorshipLevel: this.mentorshipLevel,
            saveDate: new Date().toISOString()
        };
    }
    
    fromSaveData(data) {
        Object.assign(this, data);
    }
    
    // Get character summary for display
    getSummary() {
        return {
            name: this.name,
            class: GameConfig.CHARACTER_CLASSES[this.class].name,
            level: this.level,
            stats: this.currentStats,
            maxStats: this.maxStats,
            questsCompleted: this.questsCompleted.length,
            scripturesMemorized: this.scripturesMemorized.length,
            achievements: this.achievements.length,
            prayerStreak: this.prayerStreak
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Character;
}