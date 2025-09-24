# main.js Purpose

## Overview
The `main.js` file contains the central `GameManager` class that serves as the orchestrator for all game systems in Spirit-To-Soul. This is the main entry point that coordinates initialization, manages game state, and facilitates communication between different subsystems.

## Core Responsibilities

### System Coordination
- Initializes all manager classes (ScriptureManager, MultiplayerManager, UIManager)
- Exposes managers globally for cross-component access
- Manages the loading sequence and error handling during initialization

### Player Management
- Creates and manages the main player character instance
- Handles character progression, experience gains, and spiritual growth
- Coordinates save/load operations for persistent game state

### Quest System Integration
- Monitors quest progress and completion conditions
- Links scripture-based activities to quest objectives
- Triggers UI updates when quests are completed

### Scripture Integration
- Provides contextual scripture delivery through ScriptureManager
- Handles scripture memorization mechanics
- Shares spiritual achievements with fellowship system

### Analytics and Tracking
- Tracks player actions for engagement metrics
- Monitors spiritual disciplines (prayer, scripture reading)
- Provides feedback for spiritual growth and achievements

## Key Methods

### `initialize()`
- Async method that sets up all game systems
- Establishes global references and event listeners
- Handles initialization failures gracefully

### `checkQuestProgress()`
- Evaluates current quest completion status
- Links player actions to quest objectives
- Updates UI when milestones are reached

### `memorizeScripture(reference)`
- Processes scripture memorization events
- Awards experience and wisdom points
- Shares achievements with fellowship

### Save/Load System
- `saveGame()` - Persists character and world state
- `loadGame()` - Restores saved progress
- `deleteSaveGame()` - Removes saved data

## Integration Points

### With ScriptureManager
- Requests contextual verses for gameplay situations
- Processes scripture memorization events
- Links verses to quest generation

### With Character System
- Manages character progression and stats
- Handles spiritual discipline tracking
- Processes achievement unlocking

### With UI System
- Responds to user interface events
- Updates displays when game state changes
- Shows notifications for achievements

### With Multiplayer System
- Shares character achievements with fellowship
- Processes multiplayer interactions
- Handles fellowship event generation

## Dependencies
- Requires GameConfig for game constants
- Depends on ScriptureManager, Character, UIManager, MultiplayerManager classes
- Uses browser localStorage for save data persistence

This file serves as the central nervous system of the game, ensuring all components work together harmoniously to deliver the biblical RPG experience.