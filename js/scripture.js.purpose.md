# scripture.js Purpose

## Overview
The `scripture.js` file contains the `ScriptureManager` class, which serves as the foundation of the game's biblical content system. This class manages the King James Version scripture database and provides contextual verse delivery for gameplay integration.

## Core Responsibilities

### Scripture Database Management
- Stores and organizes KJV Bible verses as key-value pairs
- Provides efficient lookup by scripture reference
- Maintains verse categorization for contextual delivery
- Handles scripture search functionality with relevance scoring

### Quest Generation System
- Creates gameplay quests directly from biblical content
- Maps scripture references to specific quest templates
- Generates objectives, rewards, and descriptions based on verses
- Provides fallback quest generation for unmapped scriptures

### Contextual Scripture Delivery
- Delivers appropriate verses based on gameplay situations
- Maps game contexts (prayer, combat, fellowship) to relevant scriptures
- Provides random verse selection with weighted preferences
- Supports daily verse functionality for spiritual discipline

### User Scripture Management
- Handles scripture bookmarking for player favorites
- Manages memorized verse tracking and progress
- Provides search functionality with text-based queries
- Supports verse sharing between players in fellowship

## Key Methods

### `getVerse(reference)`
- Retrieves specific verse by biblical reference
- Returns verse object with reference and text properties
- Used for direct scripture lookups in gameplay

### `getContextualVerse(context)`
- Provides scripture appropriate to current game situation
- Contexts include: 'prayer', 'combat', 'fellowship', 'healing'
- Returns contextually relevant verses for spiritual guidance

### `generateQuestFromScripture(reference)`
- Creates complete quest objects from scripture references
- Includes quest templates for major biblical themes
- Generates title, description, objectives, and rewards
- Falls back to meditation quest for unmapped verses

### `searchVerses(query)`
- Performs text-based search across scripture database
- Returns ranked results with relevance scoring
- Supports partial word matching and phrase searches
- Used for scripture study interface

## Scripture-to-Quest Mapping

### Great Commission (Matthew 28:19-20)
- Quest: Share Gospel with 3 characters
- Objectives: Find seekers, share scripture, pray for understanding
- Reward: Crown of Life

### Acts of Mercy (Matthew 25:35-36)
- Quest: Perform acts of kindness
- Objectives: Feed hungry, give water, welcome strangers
- Reward: Bread of Life

### The Good Shepherd (Psalm 23:1)
- Quest: Guide lost souls to safety
- Objectives: Find lost sheep, lead to pastures, protect from wolves
- Reward: Shepherd's Staff

## Integration Points

### With Quest System
- Provides scripture-based quest generation
- Links biblical themes to gameplay mechanics
- Creates meaningful spiritual objectives

### With Character Progression
- Tracks scripture memorization for experience points
- Provides wisdom bonuses for verse study
- Rewards spiritual discipline with character growth

### With UI System
- Supplies verse content for scripture study interface
- Provides search results for verse lookup
- Delivers contextual scriptures for display

### With Fellowship System
- Enables verse sharing between players
- Provides content for spiritual encouragement
- Supports group scripture study activities

## Data Structure
Verses are stored as objects with consistent structure:
```javascript
{
  reference: "John 3:16",
  text: "For God so loved the world, that he gave his only begotten Son..."
}
```

This centralized scripture management ensures consistent, theologically sound content delivery throughout the entire gaming experience, making the Word of God the foundation of all gameplay elements.