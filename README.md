# Spirit To Soul - Biblical RPG Adventure

[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![KJV Scripture](https://img.shields.io/badge/Scripture-KJV-blue.svg)](https://www.kingjamesbibleonline.org/)
[![Fellowship Ready](https://img.shields.io/badge/Fellowship-Community-purple.svg)](#-fellowship-features)

A massive online, open world action-adventure RPG inspired by the King James Version of The Bible. Experience immersive gameplay where you explore diverse environments, complete scripture-based quests, and interact with characters and events rooted in biblical teachings.

*"Hear what The Spirit says to the soul in this action, adventure, chaotic, open world, role playing, web game based on sharing The Gospel and scripture from The King James Version of The BIBLE."*

## 📋 Table of Contents
- [🎮 Game Features](#-game-features)
- [🚀 Getting Started](#-getting-started)
- [🎯 Character Classes](#-character-classes)  
- [🗺️ Biblical Locations](#️-biblical-locations)
- [📖 Scripture Features](#-scripture-features)
- [🤝 Fellowship Features](#-fellowship-features)
- [🛠️ Development](#️-development)
- [📚 Documentation](#-documentation)
- [🙏 Spiritual Purpose](#-spiritual-purpose)
- [📞 Support & Feedback](#-support--feedback)

## 🎮 Game Features

### Core Gameplay
- **Open World Exploration**: Journey through biblical lands including Jerusalem, Bethlehem, Nazareth, the Sea of Galilee, and more
- **Character Classes**: Choose from Disciple, Prophet, Shepherd, or Scribe, each with unique abilities and spiritual gifts
- **Scripture-Based Quests**: Complete missions inspired by biblical stories and teachings
- **Character Progression**: Grow in faith, wisdom, and experience as you advance your spiritual journey

### Spiritual Elements
- **Scripture Integration**: Over 50 carefully selected verses from the King James Version
- **Prayer System**: Daily prayer streaks that provide spiritual benefits
- **Scripture Memorization**: Learn and store God's word in your heart
- **Contextual Verses**: Receive appropriate scriptures based on your current situation

### Multiplayer Fellowship
- **Fellowship Hall**: Chat and encourage other believers
- **Prayer Requests**: Share and pray for one another's needs
- **Scripture Sharing**: Exchange favorite verses and spiritual insights
- **Group Activities**: Join Bible studies and prayer circles
- **Mentorship System**: Guide new believers in their faith journey

### Technical Features
- **Progressive Web App**: Install on mobile and desktop devices
- **Offline Play**: Continue your journey even without internet
- **Responsive Design**: Optimized for all screen sizes
- **Auto-Save**: Never lose your spiritual progress

## 🚀 Getting Started

1. **Open the Game**: Visit the website or launch the installed PWA
2. **Create Character**: Choose your name and spiritual path
3. **Begin Journey**: Start with a welcome quest to learn the basics
4. **Explore & Grow**: Visit biblical locations, meet NPCs, and complete quests
5. **Fellowship**: Connect with other players in the Fellowship Hall

## 🎯 Character Classes

### Disciple 👥
*"Follow in Christ's footsteps, spreading love and healing"*
- **Strengths**: High faith, healing abilities, encouraging others
- **Special Abilities**: Heal, Bless, Encourage
- **Starting Stats**: Health 100, Faith 80, Wisdom 70

### Prophet 🗣️
*"Speak God's word with power and divine wisdom"*
- **Strengths**: Spiritual warfare, divine revelation, teaching
- **Special Abilities**: Prophecy, Divine Vision, Spiritual Warfare
- **Starting Stats**: Health 80, Faith 100, Wisdom 90

### Shepherd 🐑
*"Guide and protect the flock with courage"*
- **Strengths**: Protection, guidance, courage in trials
- **Special Abilities**: Protect, Guide, Courage
- **Starting Stats**: Health 120, Faith 70, Wisdom 60

### Scribe 📜
*"Master of scripture and divine knowledge"*
- **Strengths**: Scripture knowledge, teaching, interpretation
- **Special Abilities**: Scripture Mastery, Teaching, Interpretation
- **Starting Stats**: Health 70, Faith 85, Wisdom 100

## 🗺️ Biblical Locations

- **Jerusalem** - The holy city, center of faith and worship
- **Bethlehem** - The birthplace of our Lord Jesus Christ
- **Nazareth** - Where Jesus grew up and began His ministry
- **Sea of Galilee** - Where Jesus called His disciples and performed miracles
- **Jordan River** - Where Jesus was baptized by John the Baptist
- **Mount Sinai** - Where Moses received the Ten Commandments
- **Garden of Eden** - The paradise where it all began

## 📖 Scripture Features

The game includes carefully selected verses from the King James Version of the Bible, including:

- **Genesis** - Creation and God's promises
- **Psalms** - Worship and comfort
- **Proverbs** - Wisdom for daily living
- **Isaiah** - Prophecy and hope
- **Matthew** - The Gospel message
- **John** - God's love revealed
- **Romans** - Salvation by grace
- **And many more...**

## 🤝 Fellowship Features

### Chat System
- Real-time messaging with other believers
- Scripture sharing with automatic verse lookup
- Encouragement and prayer support

### Group Activities
- **Bible Study Groups** - Study scripture together
- **Prayer Circles** - Join in group prayer
- **Quest Parties** - Complete missions with friends
- **Mentorship** - Guide or be guided by other players

### Community Events
- Daily devotions
- Seasonal celebrations (Christmas, Easter, Pentecost)
- Scripture memory challenges
- Fellowship contests and activities

## 📱 Technical Requirements

### Minimum Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for multiplayer features)
- 50MB available storage

### Recommended
- Progressive Web App installation
- Stable internet connection
- Mobile device or desktop computer
- Audio support for enhanced experience

## 🛠️ Development

### Technology Stack
This game is built with modern web technologies:

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Graphics**: HTML5 Canvas for game rendering
- **Storage**: LocalStorage for save games, IndexedDB for complex data
- **PWA**: Service Worker for offline functionality
- **Architecture**: Modular JavaScript with component-based design

### Quick Start for Developers

```bash
# Clone the repository
git clone https://github.com/adamf9898/Spirit-To-Soul.git
cd Spirit-To-Soul

# Serve locally (choose one method)
python3 -m http.server 8000
# OR
npx serve .
# OR  
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

### Project Structure
```
Spirit-To-Soul/
├── index.html              # Main application entry point
├── manifest.json           # PWA configuration
├── sw.js                   # Service Worker for offline functionality
├── css/
│   └── styles.css          # Game styling and responsive design
├── js/
│   ├── config.js           # Game constants and character classes
│   ├── main.js             # GameManager - system orchestration
│   ├── scripture.js        # ScriptureManager - biblical content
│   ├── character.js        # Character - player progression
│   ├── ui.js               # UIManager - interface coordination  
│   ├── game-world.js       # GameWorld - canvas rendering
│   └── multiplayer.js      # MultiplayerManager - fellowship
├── assets/                 # Icons, images, and media files
└── docs/                   # Comprehensive documentation
    ├── architecture-diagrams.md
    ├── glossary.md
    └── configuration.md
```

### Core Architecture
The game follows a modular, event-driven architecture:

- **GameManager** (`main.js`) - Central coordinator for all systems
- **ScriptureManager** (`scripture.js`) - KJV Bible verse management and quest generation
- **Character** (`character.js`) - Player progression and spiritual growth tracking
- **UIManager** (`ui.js`) - Interface management and user interaction
- **GameWorld** (`game-world.js`) - Canvas rendering and biblical world simulation
- **MultiplayerManager** (`multiplayer.js`) - Fellowship community features

### Development Workflow

1. **No Build Process Required** - Direct file serving for development
2. **Browser DevTools** - Use console for debugging and state inspection
3. **Live Reload** - Manual refresh needed (or use live-server for auto-reload)
4. **Testing** - Manual testing in browser, PWA testing with Chrome DevTools

### Key Development Commands

```javascript
// Access game state in browser console
window.gameManager.player         // Current character
window.scriptureManager.verses   // All scripture content
window.uiManager.currentScreen   // Current UI state

// Debug character progression
window.gameManager.player.gainExperience(100)
window.gameManager.player.memorizeScripture('John 3:16')
window.gameManager.player.pray()
```

## 📚 Documentation

### For Developers
- **[🤖 GitHub Copilot Instructions](.github/copilot-instructions.md)** - AI coding agent guidelines
- **[🏗️ Architecture Diagrams](docs/architecture-diagrams.md)** - System architecture and data flow
- **[📋 Glossary](docs/glossary.md)** - Complete terminology reference
- **[⚙️ Configuration](docs/configuration.md)** - Setup and configuration guide

### Module Documentation
- **[main.js Purpose](js/main.js.purpose.md)** | **[Tutorial](js/main.js.tutorial.md)**
- **[scripture.js Purpose](js/scripture.js.purpose.md)** | **[Tutorial](js/scripture.js.tutorial.md)**
- **[character.js Purpose](js/character.js.purpose.md)** | **[Tutorial](js/character.js.tutorial.md)**
- **[ui.js Purpose](js/ui.js.purpose.md)**
- **[game-world.js Purpose](js/game-world.js.purpose.md)**
- **[multiplayer.js Purpose](js/multiplayer.js.purpose.md)**
- **[config.js Purpose](js/config.js.purpose.md)**

### Getting Started Guides

#### For Players
1. **Installation**: Visit the website and click "Install App" for offline access
2. **Character Creation**: Choose your biblical character class and spiritual path
3. **Tutorial Quest**: Complete the welcome quest to learn game mechanics
4. **Fellowship**: Join the community for encouragement and scripture sharing

#### For Ministry Leaders
1. **Educational Use**: Engage youth and adults with interactive Bible study
2. **Small Group Integration**: Use fellowship features for group activities
3. **Scripture Memorization**: Encourage biblical memorization through gameplay
4. **Community Building**: Foster spiritual connections through shared activities

#### For Contributors
1. **Fork the Repository**: Create your own copy for modifications
2. **Read Documentation**: Review architecture and coding guidelines
3. **Test Changes**: Ensure functionality across devices and browsers
4. **Submit Pull Request**: Share improvements with the community

## 🙏 Spiritual Purpose

Spirit To Soul is more than just a game - it's a digital ministry tool designed to:

- **🌱 Encourage spiritual growth** through interactive Bible study
- **🌍 Build community** among believers worldwide  
- **📢 Share the Gospel** through engaging storytelling
- **📖 Memorize scripture** in an enjoyable way
- **🙏 Practice spiritual disciplines** like prayer and meditation
- **🤗 Support fellow believers** through fellowship and encouragement

### Biblical Foundation
> *"Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."* - 2 Timothy 2:15

The game integrates authentic KJV scripture into every aspect of gameplay, creating opportunities for:
- **Scripture Memorization** - Hide God's word in your heart through interactive gameplay
- **Biblical History** - Explore the lands and events of biblical times
- **Spiritual Disciplines** - Develop consistent prayer and study habits
- **Christian Fellowship** - Connect with believers for mutual encouragement
- **Evangelism** - Share the Gospel through compelling spiritual narratives

## 📞 Support & Feedback

### Community Support
- **Fellowship Hall**: In-game community for player support and encouragement
- **Prayer Requests**: Share spiritual needs with the community
- **Scripture Sharing**: Exchange favorite verses and insights

### Technical Support
- **Issues**: Report bugs and technical problems through GitHub Issues
- **Feature Requests**: Suggest new biblical content and gameplay features
- **Documentation**: Contribute to guides and tutorials for other players

### Ministry Inquiries
For churches, ministries, and educational organizations interested in using Spirit-To-Soul:
- Custom content development
- Educational integration support  
- Community moderation and guidance
- Spiritual mentorship program setup

---

*"Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord."* - Colossians 3:16

## 📜 Scripture Foundation

*"Study to shew thyself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth."* - 2 Timothy 2:15 (KJV)

*"Iron sharpeneth iron; so a man sharpeneth the countenance of his friend."* - Proverbs 27:17 (KJV)

---

**May God bless your spiritual journey through Spirit To Soul!** 🙏✨
