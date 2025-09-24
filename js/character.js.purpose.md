# character.js Purpose

## Overview
The `character.js` file contains the `Character` class that represents the player's spiritual journey and progression through the biblical RPG experience. This class manages all aspects of character development, spiritual disciplines, and gameplay statistics.

## Core Responsibilities

### Character Creation and Classes
- Supports four biblical character classes: Disciple, Prophet, Shepherd, Scribe
- Each class has unique stat distributions and spiritual abilities
- Initializes character with class-appropriate starting values
- Manages character naming and spiritual path selection

### Stat Management System
- Tracks three core stats: Health, Faith, and Wisdom
- Maintains both current and maximum stat values
- Provides methods for stat modification and restoration
- Links stat growth to spiritual activities and achievements

### Experience and Progression
- Manages experience points and level progression
- Calculates experience requirements for next level
- Awards experience for spiritual activities (scripture, prayer, fellowship)
- Provides level-up bonuses and spiritual growth rewards

### Inventory and Equipment
- Maintains character inventory with biblical-themed items
- Manages equipped items (weapon, armor, accessory)
- Provides item usage and equipment methods
- Links items to spiritual symbolism (Staff, Crown, Scroll, etc.)

### Spiritual Journey Tracking
- Records scripture memorization progress and achievements
- Maintains prayer streak counters for spiritual discipline
- Tracks completed quests and current quest progress
- Records fellowship interactions and spiritual milestones

## Key Methods

### Character Progression
- `gainExperience(amount)` - Awards experience points for spiritual actions
- `levelUp()` - Handles level advancement and stat bonuses
- `gainWisdom(amount)` - Increases wisdom through scripture study
- `restoreFaith(amount)` - Restores faith through prayer and worship

### Spiritual Disciplines
- `memorizeScripture(reference)` - Records memorized verses and awards bonuses
- `pray()` - Handles prayer mechanics with streak tracking
- `encourageFellow(otherPlayer)` - Provides fellowship support mechanics
- `shareScripture(reference, otherPlayer)` - Enables verse sharing

### Quest Management
- `startQuest(quest)` - Begins new spiritual quest
- `updateQuestProgress(objectiveId, progress)` - Updates quest completion status
- `checkQuestCompletion()` - Evaluates quest completion criteria
- `completeQuest()` - Handles quest rewards and progression

### Save/Load Functionality
- `toSaveData()` - Serializes character data for persistence
- `fromSaveData(data)` - Restores character from saved data
- `getSummary()` - Provides character overview for display

## Character Classes

### Disciple (Default)
- Focus: Following Christ's example, healing and encouragement
- Stats: Balanced health (100), good faith (80), decent wisdom (70)
- Abilities: Heal, Bless, Encourage

### Prophet
- Focus: Speaking God's word with power and divine revelation
- Stats: Moderate health (80), highest faith (100), high wisdom (90)
- Abilities: Prophecy, Divine Vision, Spiritual Warfare

### Shepherd
- Focus: Guiding and protecting the spiritual flock
- Stats: Highest health (120), moderate faith (70), basic wisdom (60)
- Abilities: Protect, Guide, Courage

### Scribe
- Focus: Master of scripture and divine knowledge
- Stats: Lowest health (70), good faith (85), highest wisdom (100)
- Abilities: Scripture Mastery, Teaching, Interpretation

## Spiritual Achievement System

### Scripture Milestones
- Awards achievements for memorizing 10, 20, 50+ verses
- Provides "Scripture Scholar" title for major milestones
- Links memorization to wisdom growth and special items

### Prayer Disciplines
- Tracks daily prayer streaks for consistency rewards
- Provides faith restoration bonuses for regular prayer
- Awards special recognition for extended prayer commitments

### Fellowship Contributions
- Records encouragement given to other players
- Tracks scripture sharing and spiritual support
- Awards fellowship points for community involvement

## Integration Points

### With ScriptureManager
- Receives contextual verses for character situations
- Records memorized scriptures for achievement tracking
- Links verse knowledge to character wisdom progression

### With GameWorld
- Provides character position and movement data
- Interacts with NPCs and biblical locations
- Participates in world-based quests and activities

### With UI System
- Supplies character data for interface displays
- Updates stat bars and progression indicators
- Provides inventory and equipment information

### With Quest System
- Maintains current quest status and objectives
- Records quest completion history
- Links quest rewards to character progression

This class serves as the spiritual heart of the player's journey, tracking their growth in faith, wisdom, and biblical knowledge while providing meaningful progression through scripture-based activities and fellowship with other believers.