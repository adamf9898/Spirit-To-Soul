# config.js Purpose

## Overview
The `config.js` file contains the `GameConfig` object that serves as the centralized configuration system for all game constants, settings, and data structures in Spirit-To-Soul. This configuration-driven approach ensures consistency and maintainability across the entire biblical RPG system.

## Core Responsibilities

### Game Engine Configuration
- Defines canvas dimensions and rendering parameters
- Sets player movement speed and character sizing
- Provides game state constants for screen management
- Establishes core gameplay mechanics parameters

### Character Class System Definition
- Defines four biblical character classes with unique attributes
- Specifies starting stats, abilities, and spiritual characteristics
- Provides class descriptions and thematic elements
- Links character types to biblical roles and ministries

### Biblical Location Registry
- Maps biblical locations with world coordinates
- Provides location names and spatial relationships
- Establishes the game world geography and navigation
- Links locations to historical and spiritual significance

### Item and Equipment Catalog
- Defines biblical-themed items with spiritual symbolism
- Specifies item properties, descriptions, and icons
- Provides equipment categories and usage mechanics
- Links items to scriptural references and spiritual meaning

### System Configuration Constants
- Establishes save game keys and versioning
- Provides system-wide settings and preferences
- Defines integration points for external systems
- Maintains compatibility parameters for different platforms

## Key Configuration Sections

### Canvas and Display Settings
```javascript
CANVAS_WIDTH: 800,
CANVAS_HEIGHT: 600,
PLAYER_SPEED: 2,
PLAYER_SIZE: 20
```
These settings establish the visual framework for the game world, ensuring consistent display across devices and platforms.

### Game State Management
```javascript
STATES: {
    LOADING: 'loading',
    MENU: 'menu',
    CHARACTER_CREATION: 'character_creation',
    GAME_WORLD: 'game_world',
    SCRIPTURE_STUDY: 'scripture_study'
}
```
Defines the primary application states for screen management and user flow control.

### Character Classes
Each class represents a biblical ministry role:

#### Disciple
- **Theme**: Following Christ's example in love and service
- **Stats**: Balanced approach to health, faith, and wisdom
- **Abilities**: Heal, Bless, Encourage - supporting others in their journey

#### Prophet
- **Theme**: Speaking God's word with divine authority
- **Stats**: Highest faith and wisdom, moderate health
- **Abilities**: Prophecy, Divine Vision, Spiritual Warfare - spiritual leadership

#### Shepherd
- **Theme**: Protecting and guiding the spiritual flock
- **Stats**: Highest health for protection, balanced spiritual stats
- **Abilities**: Protect, Guide, Courage - leadership through strength

#### Scribe
- **Theme**: Master of scripture and divine knowledge
- **Stats**: Highest wisdom, good faith, focused on learning
- **Abilities**: Scripture Mastery, Teaching, Interpretation - education ministry

### Biblical World Geography
Locations positioned to reflect historical relationships:
- **Jerusalem** (400, 300) - Central holy city
- **Bethlehem** (350, 350) - South of Jerusalem, birthplace of Christ
- **Nazareth** (300, 200) - North, childhood home of Jesus
- **Sea of Galilee** (320, 150) - Northern ministry area
- **Jordan River** (380, 250) - Baptism site
- **Mount Sinai** (200, 400) - Desert wilderness, law giving
- **Garden of Eden** (100, 100) - Paradise, spiritual origin

### Spiritual Items and Equipment

#### Weapons (Spiritual Tools)
- **Sword of the Spirit** - Word of God for spiritual battle
- **Shepherd's Staff** - Guidance and protection tool
- **Scroll of Wisdom** - Knowledge and teaching implement

#### Armor (Spiritual Protection)
- **Breastplate of Righteousness** - Protection through righteous living
- **Helmet of Salvation** - Mental and spiritual protection

#### Accessories (Spiritual Symbols)
- **Cross of Salvation** - Central symbol of Christian faith
- **Crown of Life** - Reward for faithfulness and perseverance

## Integration Points

### With Character System
- Provides class definitions for character creation
- Supplies starting stats and abilities for character initialization
- Links character progression to class-specific growth patterns

### With Game World
- Defines biblical locations for world map generation
- Provides coordinates and spatial relationships for navigation
- Links locations to quest opportunities and spiritual activities

### With Scripture System
- Supports scripture-based quest generation through thematic alignment
- Links character classes to appropriate biblical roles and ministries
- Provides framework for contextual scripture delivery

### With UI System
- Supplies display constants for consistent interface rendering
- Provides state definitions for screen management
- Links visual elements to spiritual themes and biblical imagery

## Configuration Management Benefits

### Maintainability
- Centralized location for all game constants and settings
- Easy modification of game balance and mechanics
- Single source of truth for system-wide parameters

### Consistency
- Ensures uniform implementation across all game systems
- Maintains thematic coherence in biblical content
- Provides standardized data structures and formats

### Extensibility
- Supports easy addition of new character classes and abilities
- Allows expansion of biblical locations and world content
- Enables simple integration of new items and equipment

### Modularity
- Exports configuration for use across multiple JavaScript modules
- Supports both browser and Node.js environments
- Maintains separation between configuration and implementation

This configuration system ensures that Spirit-To-Soul maintains biblical authenticity, gameplay balance, and technical consistency while providing a flexible foundation for future expansion and enhancement of the spiritual gaming experience.