/**
 * Quest System for Spirit-To-Soul
 * Manages scripture-based quests and spiritual progression
 */

class QuestManager {
    constructor() {
        this.quests = new Map();
        this.activeQuests = new Map();
        this.completedQuests = new Set();
        this.questData = null;
        
        this.questUpdateHandlers = [];
    }
    
    async initialize() {
        // Load quest data
        this.questData = new QuestData();
        await this.questData.initialize();
        
        // Initialize quest definitions
        this.initializeQuests();
        
        console.log('Quest Manager initialized');
    }
    
    initializeQuests() {
        const questDefinitions = this.questData.getAllQuests();
        
        questDefinitions.forEach(questDef => {
            this.quests.set(questDef.id, new Quest(questDef));
        });
        
        console.log(`Loaded ${this.quests.size} quest definitions`);
    }
    
    update(deltaTime) {
        // Update active quests
        this.activeQuests.forEach(quest => {
            quest.update(deltaTime);
            
            // Check for completion
            if (quest.isCompleted() && !this.completedQuests.has(quest.id)) {
                this.completeQuest(quest.id);
            }
        });
    }
    
    startQuest(questId) {
        const questDef = this.quests.get(questId);
        if (!questDef) {
            console.error(`Quest ${questId} not found`);
            return false;
        }
        
        if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
            console.log(`Quest ${questId} already active or completed`);
            return false;
        }
        
        const quest = new Quest(questDef.definition);
        quest.start();
        this.activeQuests.set(questId, quest);
        
        // Update UI
        this.updateQuestUI();
        
        // Notify handlers
        this.notifyQuestUpdate('started', quest);
        
        console.log(`Started quest: ${quest.title}`);
        return true;
    }
    
    completeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return false;
        
        // Mark as completed
        this.completedQuests.add(questId);
        this.activeQuests.delete(questId);
        
        // Give rewards
        this.giveQuestRewards(quest);
        
        // Start follow-up quests
        if (quest.definition.followUpQuests) {
            quest.definition.followUpQuests.forEach(followUpId => {
                setTimeout(() => this.startQuest(followUpId), 1000);
            });
        }
        
        // Update UI
        this.updateQuestUI();
        
        // Notify handlers
        this.notifyQuestUpdate('completed', quest);
        
        console.log(`Completed quest: ${quest.title}`);
        return true;
    }
    
    giveQuestRewards(quest) {
        const player = window.gameEngine?.getPlayer();
        if (!player || !quest.definition.rewards) return;
        
        const rewards = quest.definition.rewards;
        
        // Experience reward
        if (rewards.experience) {
            player.gainExperience(rewards.experience);
        }
        
        // Scripture reward
        if (rewards.scripture) {
            player.learnScripture(rewards.scripture);
        }
        
        // Item rewards
        if (rewards.items) {
            rewards.items.forEach(item => {
                player.inventory.push(item);
            });
        }
        
        // Attribute rewards
        if (rewards.attributes) {
            Object.keys(rewards.attributes).forEach(attr => {
                if (player.attributes[attr]) {
                    player.attributes[attr] += rewards.attributes[attr];
                }
            });
        }
        
        console.log(`Rewarded player for quest: ${quest.title}`);
    }
    
    updateObjective(questId, objectiveId, completed = true) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return false;
        
        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return false;
        
        objective.completed = completed;
        objective.completedAt = completed ? Date.now() : null;
        
        // Update UI
        this.updateQuestUI();
        
        // Notify handlers
        this.notifyQuestUpdate('objective_updated', quest, objective);
        
        console.log(`Updated objective ${objectiveId} for quest ${questId}: ${completed}`);
        return true;
    }
    
    updateQuestUI() {
        // Update the quest panel UI
        const questPanel = document.getElementById('quest-panel');
        const activeQuestsList = Array.from(this.activeQuests.values());
        
        if (activeQuestsList.length === 0) {
            questPanel.style.display = 'none';
            return;
        }
        
        // Show the first active quest (in a full implementation, allow cycling through quests)
        const currentQuest = activeQuestsList[0];
        questPanel.style.display = 'flex';
        
        // Update quest title
        const titleElement = document.getElementById('current-quest-title');
        if (titleElement) {
            titleElement.textContent = currentQuest.title;
        }
        
        // Update quest description
        const descElement = document.getElementById('current-quest-desc');
        if (descElement) {
            descElement.textContent = currentQuest.description;
        }
        
        // Update objectives
        const objectivesList = document.getElementById('quest-objectives-list');
        if (objectivesList) {
            objectivesList.innerHTML = '';
            
            currentQuest.objectives.forEach(objective => {
                const li = document.createElement('li');
                li.className = `objective ${objective.completed ? 'complete' : 'incomplete'}`;
                li.textContent = objective.description;
                objectivesList.appendChild(li);
            });
        }
    }
    
    addQuestUpdateHandler(handler) {
        this.questUpdateHandlers.push(handler);
    }
    
    notifyQuestUpdate(event, quest, data = null) {
        this.questUpdateHandlers.forEach(handler => {
            try {
                handler(event, quest, data);
            } catch (error) {
                console.error('Quest update handler error:', error);
            }
        });
    }
    
    // Getters
    getActiveQuests() {
        return Array.from(this.activeQuests.values());
    }
    
    getCompletedQuests() {
        return Array.from(this.completedQuests);
    }
    
    getQuest(questId) {
        return this.activeQuests.get(questId) || this.quests.get(questId);
    }
    
    isQuestActive(questId) {
        return this.activeQuests.has(questId);
    }
    
    isQuestCompleted(questId) {
        return this.completedQuests.has(questId);
    }
}

/**
 * Individual Quest Class
 */
class Quest {
    constructor(definition) {
        this.definition = definition;
        this.id = definition.id;
        this.title = definition.title;
        this.description = definition.description;
        this.scripture = definition.scripture;
        this.type = definition.type || 'main';
        
        // Quest state
        this.status = 'inactive'; // inactive, active, completed, failed
        this.startedAt = null;
        this.completedAt = null;
        
        // Objectives
        this.objectives = definition.objectives.map(obj => ({
            ...obj,
            completed: false,
            completedAt: null
        }));
        
        // Progress tracking
        this.progress = {};
    }
    
    start() {
        this.status = 'active';
        this.startedAt = Date.now();
        
        // Initialize progress tracking
        this.objectives.forEach(objective => {
            if (objective.tracking) {
                this.progress[objective.id] = 0;
            }
        });
        
        console.log(`Quest started: ${this.title}`);
    }
    
    update(deltaTime) {
        if (this.status !== 'active') return;
        
        // Check auto-completing objectives
        this.objectives.forEach(objective => {
            if (!objective.completed && this.checkObjectiveCompletion(objective)) {
                objective.completed = true;
                objective.completedAt = Date.now();
            }
        });
    }
    
    checkObjectiveCompletion(objective) {
        const player = window.gameEngine?.getPlayer();
        if (!player) return false;
        
        switch (objective.type) {
            case 'talk_to':
                // Check if player has talked to the specified NPC
                return this.progress[`talked_to_${objective.target}`] || false;
                
            case 'visit_location':
                // Check if player has visited the location
                const world = window.gameEngine?.getWorld();
                if (world) {
                    const location = world.getLocationAt(player.x, player.y);
                    return location && location.id === objective.target;
                }
                return false;
                
            case 'learn_scripture':
                // Check if player has learned the scripture
                return player.hasScripture(objective.target);
                
            case 'use_ability':
                // This would be tracked when abilities are used
                return this.progress[`used_${objective.target}`] >= (objective.count || 1);
                
            case 'reach_level':
                return player.level >= objective.target;
                
            case 'collect_item':
                return player.inventory.filter(item => item.id === objective.target).length >= (objective.count || 1);
                
            default:
                return false;
        }
    }
    
    isCompleted() {
        return this.objectives.every(objective => objective.completed);
    }
    
    getCompletionPercentage() {
        const completedCount = this.objectives.filter(obj => obj.completed).length;
        return (completedCount / this.objectives.length) * 100;
    }
    
    // Progress tracking methods
    trackProgress(objectiveId, value) {
        if (this.progress.hasOwnProperty(objectiveId)) {
            this.progress[objectiveId] = value;
        }
    }
    
    incrementProgress(objectiveId, amount = 1) {
        if (this.progress.hasOwnProperty(objectiveId)) {
            this.progress[objectiveId] += amount;
        }
    }
    
    markObjectiveComplete(objectiveId) {
        const objective = this.objectives.find(obj => obj.id === objectiveId);
        if (objective && !objective.completed) {
            objective.completed = true;
            objective.completedAt = Date.now();
            return true;
        }
        return false;
    }
}

/**
 * Scripture Manager for handling biblical content
 */
class ScriptureManager {
    constructor() {
        this.scriptures = new Map();
        this.dailyVerse = null;
        this.currentReading = null;
    }
    
    async initialize() {
        // Load scripture data
        const scriptureData = new BiblicalData();
        await scriptureData.initialize();
        
        // Initialize scriptures
        const scriptureList = scriptureData.getAllScriptures();
        scriptureList.forEach(scripture => {
            this.scriptures.set(scripture.id, scripture);
        });
        
        // Set daily verse
        this.setDailyVerse();
        
        console.log(`Scripture Manager initialized with ${this.scriptures.size} verses`);
    }
    
    getScripture(scriptureId) {
        return this.scriptures.get(scriptureId);
    }
    
    getRandomScripture() {
        const scriptureArray = Array.from(this.scriptures.values());
        return scriptureArray[Math.floor(Math.random() * scriptureArray.length)];
    }
    
    setDailyVerse() {
        // Set a daily verse based on date
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        
        const scriptureArray = Array.from(this.scriptures.values());
        this.dailyVerse = scriptureArray[dayOfYear % scriptureArray.length];
    }
    
    getDailyVerse() {
        return this.dailyVerse;
    }
    
    searchScriptures(keyword) {
        const results = [];
        this.scriptures.forEach(scripture => {
            if (scripture.text.toLowerCase().includes(keyword.toLowerCase()) ||
                scripture.reference.toLowerCase().includes(keyword.toLowerCase())) {
                results.push(scripture);
            }
        });
        return results;
    }
    
    getScripturesByBook(book) {
        const results = [];
        this.scriptures.forEach(scripture => {
            if (scripture.book.toLowerCase() === book.toLowerCase()) {
                results.push(scripture);
            }
        });
        return results.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
    }
    
    openScriptureModal(scriptureId) {
        const scripture = this.getScripture(scriptureId);
        if (!scripture) return;
        
        const modal = document.getElementById('scripture-modal');
        const textElement = document.getElementById('scripture-text');
        const referenceElement = document.getElementById('scripture-reference');
        const meditationElement = document.getElementById('scripture-meditation');
        
        if (modal && textElement && referenceElement) {
            textElement.textContent = `"${scripture.text}"`;
            referenceElement.textContent = scripture.reference;
            
            if (meditationElement && scripture.meditation) {
                meditationElement.textContent = scripture.meditation;
            }
            
            modal.classList.remove('hidden');
        }
    }
}