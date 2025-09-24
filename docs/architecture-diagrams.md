# Spirit-To-Soul Architecture Diagrams and Schemas

## System Architecture Overview

```mermaid
graph TB
    User[Player/User] --> HTML[index.html]
    HTML --> UI[UIManager]
    HTML --> Canvas[HTML5 Canvas]
    
    UI --> GM[GameManager]
    Canvas --> GW[GameWorld]
    
    GM --> Character[Character]
    GM --> Scripture[ScriptureManager]
    GM --> Multiplayer[MultiplayerManager]
    GM --> Config[GameConfig]
    
    Scripture --> Quests[Quest Generation]
    Character --> Stats[Health/Faith/Wisdom]
    Character --> Progress[Experience/Levels]
    
    GW --> NPCs[Biblical NPCs]
    GW --> Locations[Biblical Locations]
    GW --> Rendering[Canvas Rendering]
    
    Multiplayer --> Fellowship[Fellowship System]
    Multiplayer --> Chat[Chat/Messages]
    
    GM --> Storage[LocalStorage]
    Storage --> SaveData[Character Saves]
    Storage --> Bookmarks[Scripture Bookmarks]
    
    SW[Service Worker] --> Cache[Asset Caching]
    SW --> BGSync[Background Sync]
    SW --> Push[Push Notifications]
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant UI as UIManager
    participant GM as GameManager
    participant C as Character
    participant S as ScriptureManager
    participant GW as GameWorld
    participant M as MultiplayerManager
    
    U->>UI: User Action (e.g., Prayer)
    UI->>GM: handlePrayer()
    GM->>C: pray()
    C->>C: Update prayer streak
    C->>C: Restore faith stats
    C->>GM: Return prayer result
    GM->>S: getContextualVerse('prayer')
    S->>GM: Return prayer verse
    GM->>UI: Update UI with verse
    GM->>M: Share fellowship event
    M->>UI: Update fellowship display
    UI->>U: Show prayer result + verse
```

## Character Progression Schema

```mermaid
erDiagram
    CHARACTER {
        string name
        string class
        int level
        int experience
        int experienceToNext
        object currentStats
        object maxStats
        array inventory
        object equipped
        int x
        int y
    }
    
    STATS {
        int health
        int faith
        int wisdom
    }
    
    SPIRITUAL_PROGRESS {
        array scripturesMemorized
        int prayerStreak
        string lastPrayerDate
        array achievements
        int fellowshipPoints
    }
    
    QUEST {
        string id
        string title
        string description
        array objectives
        string reward
        int experienceReward
        string reference
        object verse
    }
    
    ACHIEVEMENT {
        string title
        string description
        string type
        string unlockedAt
        int level
    }
    
    CHARACTER ||--|| STATS : has
    CHARACTER ||--o{ SPIRITUAL_PROGRESS : tracks
    CHARACTER ||--o| QUEST : currentQuest
    CHARACTER ||--o{ ACHIEVEMENT : unlocked
```

## Scripture System Schema

```mermaid
erDiagram
    SCRIPTURE_MANAGER {
        object verses
        object currentVerse
        array bookmarks
    }
    
    VERSE {
        string reference
        string text
    }
    
    QUEST_TEMPLATE {
        string title
        string description
        array objectives
        string reward
        int experienceReward
        int faithReward
    }
    
    CONTEXTUAL_CATEGORIES {
        string context
        array references
    }
    
    SCRIPTURE_MANAGER ||--o{ VERSE : contains
    SCRIPTURE_MANAGER ||--o{ QUEST_TEMPLATE : generates
    SCRIPTURE_MANAGER ||--|| CONTEXTUAL_CATEGORIES : organizes
```

## Game World Schema

```mermaid
erDiagram
    GAME_WORLD {
        object canvas
        object ctx
        object player
        array npcs
        array locations
        array worldObjects
        object camera
    }
    
    LOCATION {
        string id
        string name
        int x
        int y
        int radius
        string type
        string description
        array quests
        boolean visited
    }
    
    NPC {
        string id
        string name
        string type
        int x
        int y
        array dialogue
        object quest
        string scriptureContext
    }
    
    WORLD_OBJECT {
        string id
        string type
        int x
        int y
        string description
        string icon
        boolean collected
    }
    
    GAME_WORLD ||--o{ LOCATION : contains
    GAME_WORLD ||--o{ NPC : manages
    GAME_WORLD ||--o{ WORLD_OBJECT : tracks
```

## Multiplayer/Fellowship Schema

```mermaid
erDiagram
    MULTIPLAYER_MANAGER {
        boolean isConnected
        map players
        array chatHistory
        array fellowshipEvents
        array prayerRequests
    }
    
    FELLOW_PLAYER {
        string id
        string name
        int level
        string class
        boolean online
        datetime lastSeen
        string status
    }
    
    CHAT_MESSAGE {
        string id
        string sender
        string message
        string type
        datetime timestamp
    }
    
    FELLOWSHIP_EVENT {
        string id
        string message
        string type
        datetime timestamp
        object data
    }
    
    PRAYER_REQUEST {
        string id
        string requester
        string request
        array supporters
        datetime created
        boolean answered
    }
    
    MULTIPLAYER_MANAGER ||--o{ FELLOW_PLAYER : tracks
    MULTIPLAYER_MANAGER ||--o{ CHAT_MESSAGE : stores
    MULTIPLAYER_MANAGER ||--o{ FELLOWSHIP_EVENT : broadcasts
    MULTIPLAYER_MANAGER ||--o{ PRAYER_REQUEST : manages
```

## UI State Flow

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> MainMenu : Initialization Complete
    
    MainMenu --> CharacterCreation : New Game
    MainMenu --> GameWorld : Continue Game
    MainMenu --> ScriptureStudy : Scripture Study
    
    CharacterCreation --> GameWorld : Character Created
    
    GameWorld --> InventoryPanel : Inventory Button
    GameWorld --> ScripturePanel : Scripture Button
    GameWorld --> FellowshipPanel : Fellowship Button
    GameWorld --> PrayerDialog : Prayer Button
    
    InventoryPanel --> GameWorld : Close Panel
    ScripturePanel --> GameWorld : Close Panel
    FellowshipPanel --> GameWorld : Close Panel
    PrayerDialog --> GameWorld : Prayer Complete
    
    ScriptureStudy --> MainMenu : Back to Menu
    GameWorld --> MainMenu : Menu Button
```

## PWA Architecture

```mermaid
graph TB
    Browser[Web Browser] --> App[Spirit-To-Soul App]
    App --> SW[Service Worker]
    App --> Manifest[Web App Manifest]
    
    SW --> StaticCache[Static File Cache]
    SW --> DynamicCache[Dynamic Content Cache]
    SW --> BGSync[Background Sync]
    SW --> Push[Push Notifications]
    
    StaticCache --> HTML[HTML/CSS/JS Files]
    DynamicCache --> Scripture[Scripture Content]
    DynamicCache --> SaveData[Save Game Data]
    
    BGSync --> GameSync[Game Data Sync]
    BGSync --> FellowshipSync[Fellowship Messages]
    
    Push --> DailyVerse[Daily Verse Notifications]
    Push --> FellowshipAlert[Fellowship Activity]
    
    Manifest --> Icons[App Icons]
    Manifest --> Shortcuts[App Shortcuts]
    Manifest --> Display[Display Settings]
```

## Event System Flow

```mermaid
graph LR
    UserInput[User Input] --> UI[UI Manager]
    UI --> CustomEvent[Custom Events]
    
    CustomEvent --> GameMessage[gameMessage]
    CustomEvent --> CharUpdate[characterUpdate]
    CustomEvent --> QuestOpp[questOpportunity]
    CustomEvent --> ShowScript[showScripture]
    
    GameMessage --> Notification[Show Notification]
    CharUpdate --> StatsUpdate[Update Character Display]
    QuestOpp --> QuestDialog[Show Quest Dialog]
    ShowScript --> ScriptureDisplay[Display Verse]
    
    CustomEvent --> GameManager[Game Manager]
    GameManager --> Character[Character System]
    GameManager --> Scripture[Scripture System]
    GameManager --> Fellowship[Fellowship System]
```

## Save Data Schema

```json
{
  "version": "1.0.0",
  "timestamp": 1640995200000,
  "player": {
    "name": "PlayerName",
    "class": "DISCIPLE",
    "level": 5,
    "experience": 350,
    "experienceToNext": 156,
    "maxStats": {
      "health": 120,
      "faith": 105,
      "wisdom": 85
    },
    "currentStats": {
      "health": 120,
      "faith": 95,
      "wisdom": 85
    },
    "position": {
      "x": 400,
      "y": 300
    },
    "inventory": ["Sacred Scroll", "Bread of Life"],
    "equipped": {
      "weapon": "Sword of the Spirit",
      "armor": "Breastplate of Righteousness",
      "accessory": "Cross of Salvation"
    },
    "scripturesMemorized": ["John 3:16", "Psalm 23:1", "Romans 8:28"],
    "prayerStreak": 7,
    "lastPrayerDate": "2023-12-31",
    "achievements": [
      {
        "title": "First Scripture",
        "description": "Memorized your first verse",
        "type": "spiritual",
        "unlockedAt": "2023-12-25T10:00:00.000Z",
        "level": 1
      }
    ],
    "fellowshipPoints": 25,
    "encouragementsGiven": 5,
    "scripturesShared": 3,
    "questsCompleted": [
      {
        "id": "welcome",
        "title": "Welcome to Your Spiritual Journey",
        "completionTime": 1640995000000,
        "duration": 300000
      }
    ],
    "currentQuest": null
  },
  "gameWorld": {
    "visitedLocations": ["JERUSALEM", "BETHLEHEM"],
    "discoveredNPCs": ["prophet_elijah", "disciple_john"],
    "collectedObjects": ["scroll_1", "bread_2"]
  },
  "settings": {
    "musicVolume": 0.7,
    "soundEffects": true,
    "autoSave": true
  }
}
```

## Class Inheritance and Relationships

```mermaid
classDiagram
    class GameManager {
        -ScriptureManager scriptureManager
        -Character player
        -UIManager uiManager
        -MultiplayerManager multiplayerManager
        -GameWorld gameWorld
        +initialize()
        +createPlayer()
        +saveGame()
        +loadGame()
    }
    
    class Character {
        -string name
        -string class
        -int level
        -object stats
        -array inventory
        +gainExperience()
        +memorizeScripture()
        +pray()
        +levelUp()
    }
    
    class ScriptureManager {
        -object verses
        -array bookmarks
        +getVerse()
        +searchVerses()
        +getContextualVerse()
        +generateQuestFromScripture()
    }
    
    class UIManager {
        -object screens
        -object panels
        +showScreen()
        +updateCharacterDisplay()
        +handleMovement()
        +showNotification()
    }
    
    class GameWorld {
        -canvas canvas
        -array locations
        -array npcs
        +render()
        +createLocations()
        +checkInteractions()
    }
    
    class MultiplayerManager {
        -map players
        -array chatHistory
        +addChatMessage()
        +simulateMultiplayer()
        +addFellowshipEvent()
    }
    
    GameManager --> Character : manages
    GameManager --> ScriptureManager : uses
    GameManager --> UIManager : coordinates
    GameManager --> GameWorld : controls
    GameManager --> MultiplayerManager : integrates
    
    Character --> ScriptureManager : memorizes verses
    UIManager --> GameManager : sends events
    ScriptureManager --> Character : provides quests
```

This architectural documentation provides a comprehensive view of how all components in Spirit-To-Soul work together to create a cohesive biblical gaming experience, with clear data flows, relationships, and schemas for all major systems.