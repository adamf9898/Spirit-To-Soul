# GitHub Copilot Instructions for Spirit-To-Soul

## Project Overview
Spirit-To-Soul is a biblical RPG web game built with vanilla JavaScript, HTML5 Canvas, and PWA technologies. The game integrates King James Version scripture to create immersive spiritual adventures with character progression, multiplayer fellowship, and scripture-based quests.

## Core Architecture

### Main Module Structure
- **`js/main.js`** - `GameManager` class coordinates all game systems, handles initialization, and manages game state
- **`js/scripture.js`** - `ScriptureManager` manages KJV Bible verses, quest generation, and contextual scripture delivery
- **`js/character.js`** - `Character` class handles player progression, stats, inventory, and spiritual journey tracking
- **`js/ui.js`** - `UIManager` manages all user interface elements, screen transitions, and user interactions
- **`js/game-world.js`** - `GameWorld` handles canvas rendering, biblical locations, NPCs, and world object management
- **`js/multiplayer.js`** - `MultiplayerManager` provides fellowship features and simulated multiplayer experience
- **`js/config.js`** - `GameConfig` centralized configuration for game constants, character classes, and locations

### Key Design Patterns
- **Singleton managers** - Core systems exposed globally (`window.gameManager`, `window.scriptureManager`)
- **Event-driven communication** - Custom events for cross-component updates (`characterUpdate`, `gameMessage`)
- **Modular class system** - Each major feature encapsulated in ES6 classes with clear responsibilities
- **Progressive Web App** - Service worker (`sw.js`) enables offline gameplay and caching

## Development Workflows

### Starting Development
```bash
# Serve locally for development
python3 -m http.server 8000
# Or use any static file server pointing to project root
```

### Key Files to Understand
1. **`index.html`** - Single-page application structure with multiple game screens
2. **`manifest.json`** - PWA configuration with shortcuts and icons
3. **`sw.js`** - Service worker for offline functionality and background sync

### Testing Approach
- No formal test framework - testing done through browser console and gameplay
- Use browser DevTools for debugging game state and canvas rendering
- Test on both desktop and mobile viewports (responsive design)

## Project-Specific Conventions

### Scripture Integration Pattern
```javascript
// Always use ScriptureManager for bible verses
const verse = window.scriptureManager.getContextualVerse('prayer');
// Verses are stored as objects with reference and text properties
{ reference: 'John 3:16', text: 'For God so loved the world...' }
```

### Character Progression System
```javascript
// Stats follow biblical theme: health, faith, wisdom
this.currentStats = { health: 100, faith: 80, wisdom: 70 };
// Experience gained through scripture memorization and spiritual actions
this.gainExperience(15); // Scripture memorization
this.restoreFaith(10);   // Prayer actions
```

### UI State Management
```javascript
// Screen transitions managed through UIManager
this.showScreen('game_world'); // Switches between loading, menu, game screens
// Panel system for overlays (inventory, scripture, fellowship)
this.showPanel('scripture_panel');
```

### Canvas Rendering Architecture
- Fixed 800x600 canvas with camera system for world scrolling
- Biblical locations rendered as interactive circles on world map
- Character movement handled through both keyboard and on-screen D-pad

## Integration Points

### Scripture-Quest Integration
- `ScriptureManager.generateQuestFromScripture()` creates gameplay from Bible verses
- Quest templates match scripture references to game objectives
- Character progress tracked through spiritual disciplines (prayer streaks, memorization)

### PWA-Game Integration
- Service worker caches game assets and scripture content for offline play
- Background sync for fellowship messages and game data
- Push notifications for daily verses and fellowship events

### Save System
- LocalStorage for game saves (`GameConfig.SAVE_KEY`)
- Character data serialized with `toSaveData()` / `fromSaveData()` methods
- Progressive data persistence through browser storage APIs

## Common Gotchas
- Canvas context must be obtained from GameWorld, not directly
- All managers must be initialized before use (check `window.gameManager` exists)
- Scripture references are case-sensitive keys in the verses object
- Mobile controls require both touch and click event handlers
- Service worker updates require page refresh or skipWaiting()

## Debugging Tips
- Use `window.gameManager.player` to inspect character state in console
- Check `window.scriptureManager.verses` for available scripture content  
- Monitor canvas rendering with `GameWorld.render()` method
- Fellowship simulation can be paused by clearing intervals in MultiplayerManager

This architecture enables rapid development of scripture-based gameplay features while maintaining clear separation between spiritual content, game mechanics, and user interface systems.