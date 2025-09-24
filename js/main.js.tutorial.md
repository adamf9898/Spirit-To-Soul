# main.js Tutorial: Setting Up the Game Manager

This tutorial walks through the essential components of the GameManager class and how to properly initialize and use the main game coordination system in Spirit-To-Soul.

## Step 1: Understanding the GameManager Structure

The GameManager serves as the central coordinator for all game systems. Here's how to understand its architecture:

```javascript
class GameManager {
    constructor() {
        this.player = null;
        this.gameWorld = null;
        this.currentScreen = 'loading';
        this.isInitialized = false;
    }
}
```

**Key Points:**
- GameManager is a singleton - only one instance should exist
- It coordinates all other manager classes (Scripture, UI, Multiplayer)
- State tracking through `currentScreen` and `isInitialized`

## Step 2: Implementing Proper Initialization

Follow this pattern for setting up the game manager:

```javascript
async initialize() {
    try {
        // Initialize core systems in order
        this.scriptureManager = new ScriptureManager();
        this.multiplayerManager = new MultiplayerManager();
        this.uiManager = new UIManager();
        
        // Make managers globally available
        window.scriptureManager = this.scriptureManager;
        window.multiplayerManager = this.multiplayerManager;
        window.gameManager = this;
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize loading sequence
        await this.startLoadingSequence();
        
        this.isInitialized = true;
        console.log('Spirit To Soul initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        this.handleInitializationError(error);
    }
}
```

**Important Steps:**
1. Initialize managers in dependency order
2. Expose managers globally for cross-system access
3. Set up event listeners before starting game loop
4. Use async/await for proper loading sequence management

## Step 3: Creating and Managing the Player Character

Here's how to properly create and manage the player character:

```javascript
createPlayer(name, characterClass) {
    this.player = new Character(name, characterClass);
    
    // Initialize player in game world
    if (this.gameWorld) {
        this.gameWorld.player = this.player;
    }
    
    // Set up initial quest
    const welcomeQuest = {
        id: 'welcome',
        title: 'Welcome to Your Spiritual Journey',
        description: 'Begin your adventure in faith',
        objectives: [
            { id: 0, description: 'Visit a biblical location', completed: false },
            { id: 1, description: 'Offer a prayer to the Lord', completed: false },
            { id: 2, description: 'Read and meditate on scripture', completed: false }
        ],
        reward: 'Sacred Scroll'
    };
    
    this.player.startQuest(welcomeQuest);
    
    // Trigger UI update
    window.dispatchEvent(new CustomEvent('characterUpdate'));
}
```

**Key Concepts:**
- Always create character through GameManager, not directly
- Link character to game world immediately
- Provide meaningful starting quest for player engagement
- Use custom events for UI synchronization

## Step 4: Implementing Quest Progress Tracking

Here's the pattern for monitoring and updating quest progress:

```javascript
checkQuestProgress() {
    if (!this.player?.currentQuest) return;
    
    const quest = this.player.currentQuest;
    
    // Check various quest conditions based on quest type
    if (quest.title === 'Welcome to Your Spiritual Journey') {
        // Check location visits
        if (this.gameWorld.locations.some(loc => loc.visited)) {
            this.player.updateQuestProgress(0, true);
        }
        
        // Check prayer activity
        if (this.player.prayerStreak > 0) {
            this.player.updateQuestProgress(1, true);
        }
        
        // Check scripture memorization
        if (this.player.scripturesMemorized.length > 0) {
            this.player.updateQuestProgress(2, true);
        }
    }
    
    // Handle quest completion
    if (this.player.checkQuestCompletion()) {
        this.completeCurrentQuest();
        window.dispatchEvent(new CustomEvent('characterUpdate'));
    }
}
```

**Best Practices:**
- Always check for null/undefined before accessing quest data
- Use specific quest identification for different progress checks
- Link quest objectives to meaningful player actions
- Trigger UI updates when quest status changes

## Step 5: Integrating Scripture with Gameplay

Here's how to properly integrate scripture into game mechanics:

```javascript
memorizeScripture(reference) {
    if (this.player) {
        // Add to character's memorized collection
        this.player.memorizeScripture(reference);
        
        // Update character display
        window.dispatchEvent(new CustomEvent('characterUpdate'));
        
        // Share achievement with fellowship
        if (this.multiplayerManager.isConnected) {
            this.multiplayerManager.addFellowshipEvent(
                `${this.player.name} memorized ${reference}`
            );
        }
        
        // Check if this completes any quest objectives
        this.checkQuestProgress();
    }
}

getRandomScriptureForContext(context) {
    return this.scriptureManager?.getContextualVerse(context);
}
```

**Integration Points:**
- Always route scripture actions through GameManager
- Link scripture memorization to character progression
- Share spiritual achievements with fellowship system
- Use contextual scripture delivery for enhanced experience

## Step 6: Implementing Save/Load System

Here's the proper approach to game state persistence:

```javascript
saveGame() {
    if (!this.player) {
        console.warn('No player to save');
        return false;
    }
    
    const saveData = {
        version: GameConfig.VERSION,
        timestamp: Date.now(),
        player: this.player.toSaveData(),
        gameWorld: this.gameWorld?.getSaveData() || null,
        settings: this.getGameSettings()
    };
    
    try {
        localStorage.setItem(GameConfig.SAVE_KEY, JSON.stringify(saveData));
        console.log('Game saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

loadGame() {
    try {
        const saveDataStr = localStorage.getItem(GameConfig.SAVE_KEY);
        if (!saveDataStr) {
            console.log('No save game found');
            return false;
        }
        
        const saveData = JSON.parse(saveDataStr);
        
        // Validate save data version
        if (saveData.version !== GameConfig.VERSION) {
            console.warn('Save game version mismatch');
            // Handle migration if needed
        }
        
        // Restore player
        this.player = new Character();
        this.player.fromSaveData(saveData.player);
        
        // Restore world state
        if (this.gameWorld && saveData.gameWorld) {
            this.gameWorld.fromSaveData(saveData.gameWorld);
        }
        
        console.log('Game loaded successfully');
        return true;
    } catch (error) {
        console.error('Failed to load game:', error);
        return false;
    }
}
```

**Save System Guidelines:**
- Always include version information for migration support
- Use try/catch blocks for localStorage operations
- Validate data before attempting to restore
- Provide meaningful console feedback for debugging

## Step 7: Error Handling and Recovery

Implement robust error handling throughout the GameManager:

```javascript
handleInitializationError(error) {
    console.error('Game initialization failed:', error);
    
    // Show user-friendly error message
    const errorScreen = document.getElementById('error-screen');
    if (errorScreen) {
        errorScreen.innerHTML = `
            <h2>Initialization Failed</h2>
            <p>We encountered an issue starting your spiritual journey.</p>
            <p>Please refresh the page and try again.</p>
            <button onclick="window.location.reload()">Refresh Page</button>
        `;
        errorScreen.style.display = 'block';
    }
    
    // Attempt graceful fallback
    this.attemptFallbackMode();
}

attemptFallbackMode() {
    // Provide minimal functionality even if full initialization fails
    console.log('Attempting fallback mode...');
    
    // Initialize basic scripture access
    if (!this.scriptureManager) {
        this.scriptureManager = new ScriptureManager();
        window.scriptureManager = this.scriptureManager;
    }
    
    // Show scripture study as fallback
    if (this.uiManager) {
        this.uiManager.showScreen('scripture_study');
    }
}
```

**Error Handling Principles:**
- Always provide user-friendly error messages
- Implement graceful degradation when possible
- Log detailed error information for debugging
- Offer recovery options (refresh, fallback modes)

## Common Pitfalls to Avoid

1. **Don't access managers before initialization**
   ```javascript
   // Wrong
   window.gameManager.player.gainExperience(10);
   
   // Correct
   if (window.gameManager?.player) {
       window.gameManager.player.gainExperience(10);
   }
   ```

2. **Don't create multiple GameManager instances**
   ```javascript
   // Wrong - creates multiple instances
   const gm1 = new GameManager();
   const gm2 = new GameManager();
   
   // Correct - use the global instance
   const gameManager = window.gameManager;
   ```

3. **Don't forget to trigger UI updates**
   ```javascript
   // Always dispatch events after state changes
   window.dispatchEvent(new CustomEvent('characterUpdate'));
   ```

This tutorial provides the foundation for properly implementing and extending the GameManager system in Spirit-To-Soul, ensuring reliable coordination between all game systems while maintaining spiritual authenticity and technical robustness.