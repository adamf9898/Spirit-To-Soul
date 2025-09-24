# character.js Tutorial: Implementing Character Progression

This tutorial guides you through creating a comprehensive character system that tracks spiritual growth, biblical achievements, and gameplay progression in Spirit-To-Soul.

## Step 1: Understanding Character Class Architecture

The Character class represents the player's spiritual journey with biblical character archetypes:

```javascript
class Character {
    constructor(name = '', characterClass = 'DISCIPLE') {
        this.name = name;
        this.class = characterClass;
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Initialize stats based on class from GameConfig
        const classData = GameConfig.CHARACTER_CLASSES[characterClass];
        this.maxStats = { ...classData.stats };
        this.currentStats = { ...classData.stats };
        
        // Spiritual journey tracking
        this.scripturesMemorized = [];
        this.prayerStreak = 0;
        this.questsCompleted = [];
        this.currentQuest = null;
        this.achievements = [];
        
        // Fellowship tracking
        this.fellowshipPoints = 0;
        this.encouragementsGiven = 0;
        this.scripturesShared = 0;
    }
}
```

**Key Design Elements:**
- Character classes mirror biblical ministries (Disciple, Prophet, Shepherd, Scribe)
- Stats represent spiritual attributes: Health, Faith, Wisdom
- Progression tracked through experience and spiritual disciplines
- Fellowship integration for community aspects

## Step 2: Implementing Stat Management

Create robust stat tracking with bounds checking and restoration mechanics:

```javascript
// Stat modification with bounds checking
gainHealth(amount) {
    this.currentStats.health = Math.min(
        this.currentStats.health + amount,
        this.maxStats.health
    );
    
    // Trigger UI update
    this.triggerStatsUpdate();
}

restoreFaith(amount) {
    this.currentStats.faith = Math.min(
        this.currentStats.faith + amount,
        this.maxStats.faith
    );
    
    // Log spiritual activity
    console.log(`Faith restored: ${amount} points`);
    this.triggerStatsUpdate();
}

gainWisdom(amount) {
    const oldWisdom = this.currentStats.wisdom;
    this.currentStats.wisdom = Math.min(
        this.currentStats.wisdom + amount,
        this.maxStats.wisdom
    );
    
    const actualGain = this.currentStats.wisdom - oldWisdom;
    if (actualGain > 0) {
        console.log(`Wisdom increased by ${actualGain}`);
        this.checkWisdomMilestones();
    }
    
    this.triggerStatsUpdate();
}

// Helper method for UI synchronization
triggerStatsUpdate() {
    window.dispatchEvent(new CustomEvent('characterUpdate', {
        detail: { character: this }
    }));
}

// Check for wisdom-based achievements
checkWisdomMilestones() {
    const wisdom = this.currentStats.wisdom;
    
    if (wisdom >= 50 && !this.hasAchievement('Wisdom Seeker')) {
        this.unlockAchievement('Wisdom Seeker', 'Reached 50 wisdom through scripture study');
    }
    
    if (wisdom >= 100 && !this.hasAchievement('Wise as Solomon')) {
        this.unlockAchievement('Wise as Solomon', 'Achieved maximum wisdom');
    }
}
```

**Stat Management Principles:**
- Always enforce maximum stat limits
- Provide meaningful feedback for stat changes
- Link stat gains to spiritual activities
- Check for milestone achievements automatically

## Step 3: Experience and Leveling System

Implement meaningful character progression through spiritual activities:

```javascript
gainExperience(amount, source = 'unknown') {
    const oldLevel = this.level;
    this.experience += amount;
    
    // Check for level up
    while (this.experience >= this.experienceToNext) {
        this.levelUp();
    }
    
    // Log experience gain with source
    console.log(`Gained ${amount} experience from ${source}. Total: ${this.experience}`);
    
    // If level changed, show special notification
    if (this.level > oldLevel) {
        this.celebrateLevelUp();
    }
    
    this.triggerStatsUpdate();
}

levelUp() {
    this.experience -= this.experienceToNext;
    this.level++;
    
    // Increase experience requirement (25% more each level)
    this.experienceToNext = Math.floor(this.experienceToNext * 1.25);
    
    // Award stat bonuses based on character class
    this.awardLevelUpBonuses();
    
    // Check for level-based achievements
    this.checkLevelAchievements();
    
    console.log(`Level up! Now level ${this.level}`);
}

awardLevelUpBonuses() {
    const classData = GameConfig.CHARACTER_CLASSES[this.class];
    
    // Base stat increases for all characters
    this.maxStats.health += 5;
    this.maxStats.faith += 3;
    this.maxStats.wisdom += 2;
    
    // Class-specific bonuses
    switch (this.class) {
        case 'DISCIPLE':
            this.maxStats.health += 3; // Extra healing focus
            break;
        case 'PROPHET':
            this.maxStats.faith += 5;  // Extra spiritual power
            break;
        case 'SHEPHERD':
            this.maxStats.health += 7; // Extra protection ability
            break;
        case 'SCRIBE':
            this.maxStats.wisdom += 5; // Extra learning capacity
            break;
    }
    
    // Restore stats to maximum on level up
    this.currentStats = { ...this.maxStats };
}

celebrateLevelUp() {
    // Show special level-up notification
    window.dispatchEvent(new CustomEvent('gameMessage', {
        detail: {
            title: 'Spiritual Growth!',
            message: `You have grown in faith and wisdom! Welcome to level ${this.level}!`,
            type: 'celebration'
        }
    }));
    
    // Get contextual scripture for milestone
    if (window.scriptureManager) {
        const verse = window.scriptureManager.getMilestoneVerse('level_up');
        if (verse) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('showScripture', {
                    detail: verse
                }));
            }, 2000);
        }
    }
}
```

**Experience Sources:**
- Scripture memorization: 15 XP
- Prayer completion: 5 XP
- Quest completion: Variable (25-100 XP)
- Fellowship encouragement: 3 XP
- NPC interaction: 2 XP

## Step 4: Scripture Memorization System

Create meaningful scripture interaction that grows the character spiritually:

```javascript
memorizeScripture(reference) {
    // Prevent duplicate memorization
    if (this.scripturesMemorized.includes(reference)) {
        console.log(`Already memorized: ${reference}`);
        return false;
    }
    
    // Add to memorized collection
    this.scripturesMemorized.push(reference);
    
    // Award experience and wisdom
    this.gainExperience(15, 'scripture memorization');
    this.gainWisdom(5);
    
    // Check for memorization milestones
    const count = this.scripturesMemorized.length;
    this.checkScriptureMilestones(count);
    
    // Log achievement
    console.log(`Memorized ${reference}. Total verses: ${count}`);
    
    // Show encouragement
    window.dispatchEvent(new CustomEvent('gameMessage', {
        detail: {
            title: 'Scripture Memorized!',
            message: `"Thy word have I hid in mine heart..." - You've memorized ${reference}`,
            type: 'spiritual'
        }
    }));
    
    return true;
}

checkScriptureMilestones(count) {
    const milestones = [
        { count: 1, title: 'First Scripture', description: 'Memorized your first verse' },
        { count: 10, title: 'Scripture Student', description: 'Memorized 10 verses' },
        { count: 25, title: 'Scripture Scholar', description: 'Memorized 25 verses' },
        { count: 50, title: 'Living Scripture', description: 'Memorized 50 verses' },
        { count: 100, title: 'Walking Bible', description: 'Memorized 100 verses' }
    ];
    
    const milestone = milestones.find(m => m.count === count);
    if (milestone) {
        this.unlockAchievement(milestone.title, milestone.description);
        
        // Special reward for major milestones
        if (count >= 25) {
            this.gainWisdom(10);
            console.log('Bonus wisdom gained for scripture mastery!');
        }
    }
}

// Get a random memorized verse for display
getRandomMemorizedVerse() {
    if (this.scripturesMemorized.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * this.scripturesMemorized.length);
    const reference = this.scripturesMemorized[randomIndex];
    
    return window.scriptureManager?.getVerse(reference) || null;
}
```

## Step 5: Prayer and Spiritual Disciplines

Implement meaningful prayer mechanics that encourage consistent spiritual growth:

```javascript
pray() {
    const now = new Date();
    const today = now.toDateString();
    
    // Check if already prayed today
    if (this.lastPrayerDate === today) {
        return {
            success: false,
            message: "You've already offered prayers today. Continue in spiritual reflection.",
            streak: this.prayerStreak
        };
    }
    
    // Update prayer tracking
    this.lastPrayerDate = today;
    
    // Calculate streak
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.lastPrayerDate === yesterday.toDateString()) {
        this.prayerStreak++; // Continue streak
    } else if (this.lastPrayerDate !== today) {
        this.prayerStreak = 1; // Start new streak
    }
    
    // Award faith restoration and experience
    const faithRestored = Math.min(10 + this.prayerStreak, 25); // Bonus for streaks
    this.restoreFaith(faithRestored);
    this.gainExperience(5, 'daily prayer');
    
    // Streak bonuses
    if (this.prayerStreak === 7) {
        this.unlockAchievement('Faithful Week', 'Prayed for 7 consecutive days');
        this.gainWisdom(3);
    } else if (this.prayerStreak === 30) {
        this.unlockAchievement('Faithful Month', 'Prayed for 30 consecutive days');
        this.gainWisdom(10);
    }
    
    return {
        success: true,
        message: "Your prayers rise like incense before the Lord.",
        streak: this.prayerStreak,
        faithRestored: faithRestored
    };
}

// Get prayer streak status for UI display
getPrayerStatus() {
    const today = new Date().toDateString();
    const daysSinceLastPrayer = this.lastPrayerDate === today ? 0 : 
        Math.floor((Date.now() - new Date(this.lastPrayerDate).getTime()) / (1000 * 60 * 60 * 24));
    
    return {
        streak: this.prayerStreak,
        prayedToday: this.lastPrayerDate === today,
        daysSinceLast: daysSinceLastPrayer,
        nextStreakBonus: this.getNextStreakMilestone()
    };
}

getNextStreakMilestone() {
    const milestones = [7, 30, 100];
    return milestones.find(milestone => milestone > this.prayerStreak) || null;
}
```

## Step 6: Quest Management System

Implement spiritual quest tracking that integrates with scripture and character growth:

```javascript
startQuest(quest) {
    if (this.currentQuest) {
        console.warn('Already on a quest. Complete current quest first.');
        return false;
    }
    
    this.currentQuest = {
        ...quest,
        startTime: Date.now(),
        objectives: quest.objectives.map(obj => ({ ...obj, completed: false }))
    };
    
    console.log(`Started quest: ${quest.title}`);
    
    // Show quest notification
    window.dispatchEvent(new CustomEvent('questOpportunity', {
        detail: this.currentQuest
    }));
    
    return true;
}

updateQuestProgress(objectiveId, completed = true) {
    if (!this.currentQuest) return false;
    
    const objective = this.currentQuest.objectives.find(obj => obj.id === objectiveId);
    if (objective && objective.completed !== completed) {
        objective.completed = completed;
        
        console.log(`Quest objective ${completed ? 'completed' : 'reset'}: ${objective.description}`);
        
        // Show progress notification
        if (completed) {
            window.dispatchEvent(new CustomEvent('gameMessage', {
                detail: {
                    title: 'Quest Progress',
                    message: `Completed: ${objective.description}`,
                    type: 'quest'
                }
            }));
        }
        
        return true;
    }
    
    return false;
}

checkQuestCompletion() {
    if (!this.currentQuest) return false;
    
    const allCompleted = this.currentQuest.objectives.every(obj => obj.completed);
    return allCompleted;
}

completeQuest() {
    if (!this.currentQuest || !this.checkQuestCompletion()) {
        return false;
    }
    
    const quest = this.currentQuest;
    
    // Award rewards
    if (quest.experienceReward) {
        this.gainExperience(quest.experienceReward, 'quest completion');
    }
    
    if (quest.faithReward) {
        this.restoreFaith(quest.faithReward);
    }
    
    if (quest.reward) {
        this.addToInventory(quest.reward);
    }
    
    // Record completion
    this.questsCompleted.push({
        ...quest,
        completionTime: Date.now(),
        duration: Date.now() - quest.startTime
    });
    
    // Clear current quest
    this.currentQuest = null;
    
    // Show completion celebration
    window.dispatchEvent(new CustomEvent('gameMessage', {
        detail: {
            title: 'Quest Complete!',
            message: `"Well done, good and faithful servant!" - You completed: ${quest.title}`,
            type: 'celebration'
        }
    }));
    
    // Check for quest-based achievements
    this.checkQuestAchievements();
    
    console.log(`Completed quest: ${quest.title}`);
    return true;
}

checkQuestAchievements() {
    const count = this.questsCompleted.length;
    
    if (count === 1) {
        this.unlockAchievement('First Steps', 'Completed your first spiritual quest');
    } else if (count === 10) {
        this.unlockAchievement('Faithful Journey', 'Completed 10 spiritual quests');
    } else if (count === 25) {
        this.unlockAchievement('Spiritual Warrior', 'Completed 25 spiritual quests');
    }
}
```

## Step 7: Fellowship and Social Features

Enable meaningful social interaction that builds community:

```javascript
encourageFellow(otherPlayer) {
    if (!otherPlayer || otherPlayer === this) {
        return false;
    }
    
    // Award fellowship points and experience
    this.fellowshipPoints += 3;
    this.encouragementsGiven++;
    this.gainExperience(3, 'fellowship encouragement');
    
    // Show encouragement message
    const encouragements = [
        "May the Lord bless you and keep you!",
        "You are fearfully and wonderfully made!",
        "God has great plans for your life!",
        "Keep fighting the good fight of faith!",
        "You are loved beyond measure!"
    ];
    
    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    // Simulate multiplayer encouragement
    if (window.multiplayerManager) {
        window.multiplayerManager.addFellowshipEvent(
            `${this.name} encouraged ${otherPlayer.name}: "${message}"`
        );
    }
    
    console.log(`Encouraged ${otherPlayer.name}`);
    return true;
}

shareScripture(reference, otherPlayer) {
    if (!reference || !window.scriptureManager) {
        return false;
    }
    
    const verse = window.scriptureManager.getVerse(reference);
    if (!verse) {
        return false;
    }
    
    // Track scripture sharing
    this.scripturesShared++;
    this.fellowshipPoints += 5;
    this.gainExperience(5, 'scripture sharing');
    
    // Share with fellowship
    if (window.multiplayerManager) {
        const shareMessage = otherPlayer ? 
            `${this.name} shared ${reference} with ${otherPlayer.name}` :
            `${this.name} shared ${reference}: "${verse.text.substring(0, 50)}..."`;
        
        window.multiplayerManager.addFellowshipEvent(shareMessage);
    }
    
    console.log(`Shared scripture: ${reference}`);
    return true;
}

// Get fellowship statistics for display
getFellowshipStats() {
    return {
        fellowshipPoints: this.fellowshipPoints,
        encouragementsGiven: this.encouragementsGiven,
        scripturesShared: this.scripturesShared,
        fellowshipLevel: this.getFellowshipLevel()
    };
}

getFellowshipLevel() {
    if (this.fellowshipPoints >= 100) return 'Fellowship Leader';
    if (this.fellowshipPoints >= 50) return 'Encouraging Friend';
    if (this.fellowshipPoints >= 20) return 'Growing Fellowship';
    if (this.fellowshipPoints >= 5) return 'New Fellowship';
    return 'Seeker';
}
```

## Step 8: Achievement System

Create meaningful recognition for spiritual growth:

```javascript
unlockAchievement(title, description, type = 'spiritual') {
    // Prevent duplicates
    if (this.hasAchievement(title)) {
        return false;
    }
    
    const achievement = {
        title: title,
        description: description,
        type: type,
        unlockedAt: new Date().toISOString(),
        level: this.level
    };
    
    this.achievements.push(achievement);
    
    // Show achievement notification
    window.dispatchEvent(new CustomEvent('gameMessage', {
        detail: {
            title: 'Achievement Unlocked!',
            message: `${title}: ${description}`,
            type: 'achievement'
        }
    }));
    
    // Award bonus experience for achievements
    this.gainExperience(10, 'achievement unlock');
    
    console.log(`Achievement unlocked: ${title}`);
    return true;
}

hasAchievement(title) {
    return this.achievements.some(achievement => achievement.title === title);
}

getAchievementsByType(type) {
    return this.achievements.filter(achievement => achievement.type === type);
}

// Get character summary for display
getSummary() {
    return {
        name: this.name,
        class: this.class,
        level: this.level,
        experience: this.experience,
        experienceToNext: this.experienceToNext,
        stats: { ...this.currentStats },
        maxStats: { ...this.maxStats },
        scripturesMemorized: this.scripturesMemorized.length,
        prayerStreak: this.prayerStreak,
        questsCompleted: this.questsCompleted.length,
        achievements: this.achievements.length,
        fellowshipLevel: this.getFellowshipLevel()
    };
}
```

## Step 9: Save/Load System Integration

Enable persistent character progression:

```javascript
toSaveData() {
    return {
        name: this.name,
        class: this.class,
        level: this.level,
        experience: this.experience,
        experienceToNext: this.experienceToNext,
        maxStats: { ...this.maxStats },
        currentStats: { ...this.currentStats },
        position: { x: this.x, y: this.y },
        inventory: [...this.inventory],
        equipped: { ...this.equipped },
        questsCompleted: [...this.questsCompleted],
        currentQuest: this.currentQuest ? { ...this.currentQuest } : null,
        scripturesMemorized: [...this.scripturesMemorized],
        prayerStreak: this.prayerStreak,
        lastPrayerDate: this.lastPrayerDate,
        achievements: [...this.achievements],
        fellowshipPoints: this.fellowshipPoints,
        encouragementsGiven: this.encouragementsGiven,
        scripturesShared: this.scripturesShared,
        saveTimestamp: Date.now()
    };
}

fromSaveData(data) {
    // Validate save data
    if (!data || typeof data !== 'object') {
        console.error('Invalid save data');
        return false;
    }
    
    try {
        // Restore basic character info
        this.name = data.name || '';
        this.class = data.class || 'DISCIPLE';
        this.level = data.level || 1;
        this.experience = data.experience || 0;
        this.experienceToNext = data.experienceToNext || 100;
        
        // Restore stats
        this.maxStats = { ...data.maxStats } || { health: 100, faith: 80, wisdom: 70 };
        this.currentStats = { ...data.currentStats } || { ...this.maxStats };
        
        // Restore position
        this.x = data.position?.x || 400;
        this.y = data.position?.y || 300;
        
        // Restore spiritual progress
        this.scripturesMemorized = [...(data.scripturesMemorized || [])];
        this.prayerStreak = data.prayerStreak || 0;
        this.lastPrayerDate = data.lastPrayerDate || null;
        this.achievements = [...(data.achievements || [])];
        
        // Restore fellowship data
        this.fellowshipPoints = data.fellowshipPoints || 0;
        this.encouragementsGiven = data.encouragementsGiven || 0;
        this.scripturesShared = data.scripturesShared || 0;
        
        // Restore quest data
        this.questsCompleted = [...(data.questsCompleted || [])];
        this.currentQuest = data.currentQuest ? { ...data.currentQuest } : null;
        
        console.log('Character data restored successfully');
        return true;
    } catch (error) {
        console.error('Failed to restore character data:', error);
        return false;
    }
}
```

## Common Implementation Pitfalls

1. **Always validate stat boundaries**
   ```javascript
   // Wrong - can exceed maximum
   this.currentStats.health += amount;
   
   // Correct - respects limits
   this.currentStats.health = Math.min(this.currentStats.health + amount, this.maxStats.health);
   ```

2. **Use consistent event triggering**
   ```javascript
   // Always trigger UI updates after state changes
   this.triggerStatsUpdate();
   window.dispatchEvent(new CustomEvent('characterUpdate'));
   ```

3. **Handle null/undefined gracefully**
   ```javascript
   // Check for existence before operations
   if (window.scriptureManager) {
       const verse = window.scriptureManager.getVerse(reference);
   }
   ```

This comprehensive character system creates meaningful spiritual progression that encourages real-world application of biblical principles while providing engaging gameplay mechanics rooted in faith and community.