// Game Configuration
const GameConfig = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Player settings
    PLAYER_SPEED: 2,
    PLAYER_SIZE: 20,
    
    // Game states
    STATES: {
        LOADING: 'loading',
        MENU: 'menu',
        CHARACTER_CREATION: 'character_creation',
        GAME_WORLD: 'game_world',
        SCRIPTURE_STUDY: 'scripture_study'
    },
    
    // Character classes
    CHARACTER_CLASSES: {
        DISCIPLE: {
            name: 'Disciple',
            description: 'Follow in Christ\'s footsteps, spreading love and healing',
            stats: { health: 100, faith: 80, wisdom: 70 },
            abilities: ['Heal', 'Bless', 'Encourage']
        },
        PROPHET: {
            name: 'Prophet',
            description: 'Speak God\'s word with power and divine wisdom',
            stats: { health: 80, faith: 100, wisdom: 90 },
            abilities: ['Prophecy', 'Divine Vision', 'Spiritual Warfare']
        },
        SHEPHERD: {
            name: 'Shepherd',
            description: 'Guide and protect the flock with courage',
            stats: { health: 120, faith: 70, wisdom: 60 },
            abilities: ['Protect', 'Guide', 'Courage']
        },
        SCRIBE: {
            name: 'Scribe',
            description: 'Master of scripture and divine knowledge',
            stats: { health: 70, faith: 85, wisdom: 100 },
            abilities: ['Scripture Mastery', 'Teaching', 'Interpretation']
        }
    },
    
    // Biblical locations
    LOCATIONS: {
        JERUSALEM: { name: 'Jerusalem', x: 400, y: 300 },
        BETHLEHEM: { name: 'Bethlehem', x: 350, y: 350 },
        NAZARETH: { name: 'Nazareth', x: 300, y: 200 },
        GALILEE: { name: 'Sea of Galilee', x: 350, y: 150 },
        JORDAN_RIVER: { name: 'Jordan River', x: 450, y: 250 },
        MOUNT_SINAI: { name: 'Mount Sinai', x: 200, y: 500 },
        GARDEN_OF_EDEN: { name: 'Garden of Eden', x: 600, y: 100 }
    },
    
    // Inventory items
    ITEMS: {
        SCROLL: { name: 'Sacred Scroll', description: 'Contains divine wisdom', icon: '📜' },
        BREAD: { name: 'Bread of Life', description: 'Spiritual nourishment', icon: '🍞' },
        WATER: { name: 'Living Water', description: 'Eternal refreshment', icon: '💧' },
        LAMP: { name: 'Lamp of Truth', description: 'Illuminates the path', icon: '🪔' },
        STAFF: { name: 'Shepherd\'s Staff', description: 'Symbol of guidance', icon: '🦯' },
        CROWN: { name: 'Crown of Life', description: 'Reward for faithfulness', icon: '👑' }
    },
    
    // Game settings
    SAVE_KEY: 'spirit_to_soul_save',
    VERSION: '1.0.0'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}