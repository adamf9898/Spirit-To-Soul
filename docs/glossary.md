# Spirit-To-Soul Glossary

## Core Concepts

### A

**Achievement System** - Recognition system for spiritual milestones and gameplay accomplishments, tracked in the Character class and displayed through UI notifications.

**API Integration** - The game's modular design allows for future expansion through external scripture databases, multiplayer servers, or church management systems.

### B

**Biblical Character Classes** - Four playable character types based on biblical ministry roles:
- **Disciple**: Balanced spiritual growth focused on following Christ's example
- **Prophet**: High faith and wisdom for speaking God's word with authority  
- **Shepherd**: High health for protecting and guiding the spiritual flock
- **Scribe**: High wisdom for mastering scripture and teaching others

**Bookmark System** - Scripture management feature allowing players to save favorite verses for quick access, persisted in localStorage.

### C

**Character Progression** - Spiritual growth system tracking experience points, level advancement, and stat development through biblical activities.

**Contextual Scripture** - Dynamic verse delivery system that provides appropriate biblical content based on gameplay situations (prayer, healing, fellowship, etc.).

**Canvas Rendering** - HTML5 Canvas-based world visualization showing biblical locations, characters, and interactive elements in a 800x600 viewport.

### D

**Daily Verse System** - Deterministic scripture selection providing consistent daily spiritual content using date-based random generation.

**Dynamic Caching** - PWA feature that caches game content and scripture data as players access it, enabling offline spiritual study.

### E

**Experience Points (XP)** - Spiritual growth currency earned through:
- Scripture memorization (15 XP)
- Daily prayer (5 XP) 
- Quest completion (25-100 XP)
- Fellowship encouragement (3 XP)
- Achievement unlocks (10 XP)

**Event-Driven Architecture** - System communication through custom browser events (characterUpdate, gameMessage, questOpportunity) enabling loose coupling between components.

### F

**Faith Stat** - One of three core character attributes representing spiritual power and connection with God, restored through prayer and worship activities.

**Fellowship System** - Simulated multiplayer community featuring biblical character personas who provide encouragement, scripture sharing, and prayer support.

**Fellowship Points** - Social currency earned through encouraging others (3 pts), sharing scripture (5 pts), and community participation.

### G

**GameConfig** - Centralized configuration object containing all game constants, character class definitions, biblical locations, and item catalogs.

**GameManager** - Central orchestrator class coordinating all game systems, managing initialization, and facilitating cross-component communication.

**GameWorld** - Canvas-based spatial system managing biblical locations, NPCs, world objects, and player movement within the game environment.

### H

**Health Stat** - Physical/spiritual well-being attribute representing character vitality and capacity for spiritual warfare and ministry activities.

**HTML5 Canvas** - Web technology providing 2D rendering context for game world visualization, character movement, and interactive biblical environments.

### I

**Inventory System** - Biblical-themed item management featuring spiritual equipment and artifacts with symbolic meaning (Sword of Spirit, Crown of Life, etc.).

**IndexedDB Integration** - Browser database technology planned for advanced offline data storage and complex spiritual progress tracking.

### J

**JavaScript Modules** - ES6 class-based architecture with seven core modules:
- main.js (GameManager)
- scripture.js (ScriptureManager)  
- character.js (Character)
- ui.js (UIManager)
- game-world.js (GameWorld)
- multiplayer.js (MultiplayerManager)
- config.js (GameConfig)

### K

**King James Version (KJV)** - Biblical translation used as the authoritative text source for all scripture content and quest generation in the game.

### L

**LocalStorage Persistence** - Browser storage system for character saves, game progress, scripture bookmarks, and player preferences.

**Level System** - Character advancement through spiritual activities, with each level requiring 25% more experience and providing stat bonuses based on character class.

### M

**Memorization System** - Core spiritual discipline allowing players to learn scripture verses, gaining wisdom and experience while building a personal biblical foundation.

**Multiplayer Manager** - Fellowship system simulating spiritual community through biblical character interactions, chat messages, and shared spiritual activities.

### N

**NPC (Non-Player Characters)** - Biblical figures providing dialogue, quests, spiritual guidance, and historical context within the game world.

**Notification System** - UI feedback mechanism for spiritual achievements, quest progress, fellowship events, and divine guidance through customizable alerts.

### P

**Progressive Web App (PWA)** - Modern web application architecture enabling offline play, device installation, background sync, and native app-like experience.

**Prayer System** - Daily spiritual discipline mechanic with streak tracking, faith restoration, and contextual scripture delivery for consistent spiritual growth.

**PWA Manifest** - Configuration file defining app icons, shortcuts, display settings, and platform integration for seamless cross-device spiritual engagement.

### Q

**Quest System** - Scripture-based mission structure generating meaningful gameplay objectives from biblical verses and spiritual themes.

**Quest Templates** - Predefined mission structures linking specific scripture references to gameplay objectives, rewards, and spiritual lessons.

### R

**Relevance Scoring** - Scripture search algorithm providing weighted results based on exact matches, word frequency, and reference proximity for effective verse discovery.

**Responsive Design** - Mobile-friendly interface adaptation with touch controls, device-appropriate layouts, and accessibility features for universal spiritual access.

### S

**Scripture Database** - Core content system containing KJV verses organized by reference with search, categorization, and contextual delivery capabilities.

**ScriptureManager** - Primary biblical content system providing verse lookup, search functionality, quest generation, and contextual spiritual guidance.

**Service Worker** - PWA background process enabling offline functionality, asset caching, push notifications, and background spiritual content synchronization.

**Spiritual Stats** - Three-attribute system tracking character development:
- **Health**: Physical/spiritual vitality
- **Faith**: Spiritual power and connection  
- **Wisdom**: Biblical knowledge and understanding

**Save System** - Comprehensive game state persistence including character progress, spiritual achievements, world exploration, and fellowship relationships.

### T

**Touch Controls** - Mobile interface features including on-screen D-pad, gesture support, and touch-optimized interactions for spiritual gaming accessibility.

**Tutorial System** - Guided introduction to spiritual gameplay mechanics, biblical concepts, and fellowship features for new believers and gamers.

### U

**UIManager** - User interface coordination system managing screen transitions, panel overlays, input processing, and visual feedback for seamless spiritual interaction.

**User Experience (UX)** - Spiritual-focused design prioritizing meaningful engagement with scripture, community building, and authentic faith development over competitive gaming elements.

### V

**Verse Objects** - Standardized data structure for biblical content containing reference and text properties for consistent scripture handling throughout the system.

### W

**Wisdom Stat** - Biblical knowledge and understanding attribute gained through scripture study, teaching others, and spiritual meditation activities.

**World Objects** - Interactive biblical artifacts and items scattered throughout the game world, providing collection objectives and spiritual symbolism.

### X

**XP (Experience Points)** - See Experience Points definition above.

### Z

**Zone-Based Locations** - Biblical places organized by geographical and spiritual significance, each offering unique quests, NPCs, and spiritual learning opportunities.

## Technical Terms

### API Endpoints
- **getVerse(reference)** - Retrieve specific biblical verse
- **searchVerses(query)** - Find verses by content search
- **getContextualVerse(context)** - Get appropriate verse for situation
- **memorizeScripture(reference)** - Record verse memorization
- **pray()** - Execute daily prayer activity
- **gainExperience(amount, source)** - Award spiritual progress

### Event Types
- **characterUpdate** - Triggers UI refresh for character changes
- **gameMessage** - Displays notifications and spiritual guidance
- **questOpportunity** - Presents available spiritual missions
- **showScripture** - Reveals contextual biblical content
- **gameDialogue** - Shows NPC conversation content

### Storage Keys
- **spirit_to_soul_save** - Main character and progress data
- **spirit_soul_bookmarks** - Saved scripture references
- **spirit_fellowship_data** - Community interaction history

### Configuration Constants
- **CANVAS_WIDTH/HEIGHT** - Game world display dimensions (800x600)
- **PLAYER_SPEED** - Character movement rate (2 pixels/frame)
- **SAVE_KEY** - LocalStorage identifier for game data
- **VERSION** - Game version for save compatibility (1.0.0)

## Spiritual Terminology

### Biblical Concepts
- **Great Commission** - Scripture-based quest from Matthew 28:19-20
- **Acts of Mercy** - Service quest from Matthew 25:35-36  
- **Good Shepherd** - Guidance quest from Psalm 23:1
- **Daily Bread** - Spiritual sustenance through daily scripture
- **Fellowship** - Community worship and mutual encouragement

### Character Development
- **Spiritual Warfare** - Prophet class ability for overcoming challenges
- **Encouragement Ministry** - Fellowship feature for supporting others
- **Scripture Mastery** - Scribe class specialization in biblical knowledge
- **Pastoral Care** - Shepherd class focus on protecting and guiding

### Achievement Categories
- **Spiritual Milestones** - Faith development recognitions
- **Scripture Achievements** - Biblical memorization rewards
- **Fellowship Honors** - Community service acknowledgments
- **Quest Completions** - Mission-based spiritual accomplishments

This glossary provides essential understanding of all terms, concepts, and technical elements within the Spirit-To-Soul biblical RPG system, ensuring clarity for developers, players, and ministry leaders engaging with the platform.