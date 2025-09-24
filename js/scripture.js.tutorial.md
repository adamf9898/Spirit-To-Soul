# scripture.js Tutorial: Building the Scripture Management System

This tutorial provides a comprehensive guide to implementing and extending the ScriptureManager class, which serves as the foundation for all biblical content in Spirit-To-Soul.

## Step 1: Understanding the Scripture Database Structure

The ScriptureManager uses a simple key-value structure for storing and retrieving Bible verses:

```javascript
class ScriptureManager {
    constructor() {
        this.verses = this.initializeScriptures();
        this.currentVerse = null;
        this.bookmarks = this.loadBookmarks();
    }
    
    initializeScriptures() {
        return {
            // Reference as key, verse text as value
            'John 3:16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
            'Psalm 23:1': 'The LORD is my shepherd; I shall not want.',
            // ... more verses
        };
    }
}
```

**Key Design Decisions:**
- References are exact strings (case-sensitive)
- Verses stored as plain text from King James Version
- Bookmarks managed separately for user preferences
- Current verse tracking for session state

## Step 2: Implementing Verse Retrieval Methods

Here's how to properly implement verse lookup and random selection:

```javascript
// Get specific verse by reference
getVerse(reference) {
    const verse = this.verses[reference];
    if (verse) {
        return {
            reference: reference,
            text: verse
        };
    }
    
    console.warn(`Scripture not found: ${reference}`);
    return null;
}

// Get random verse from entire collection
getRandomVerse() {
    const references = Object.keys(this.verses);
    if (references.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * references.length);
    const randomReference = references[randomIndex];
    
    this.currentVerse = this.getVerse(randomReference);
    return this.currentVerse;
}
```

**Best Practices:**
- Always return consistent verse objects with `reference` and `text` properties
- Handle missing verses gracefully with warnings, not errors
- Update `currentVerse` for session tracking
- Use descriptive console logging for debugging

## Step 3: Building the Contextual Scripture System

This is where the spiritual power of the system really shines - delivering appropriate verses for gameplay situations:

```javascript
getContextualVerse(context) {
    const contextualVerses = {
        'prayer': [
            'Matthew 6:9-13', 'Luke 11:2-4', '1 Thessalonians 5:17',
            'Philippians 4:6', 'James 5:16', 'Matthew 21:22'
        ],
        'healing': [
            'James 5:14-15', 'Jeremiah 17:14', 'Psalm 103:2-3',
            'Isaiah 53:5', '1 Peter 2:24', 'Matthew 9:35'
        ],
        'fellowship': [
            'Hebrews 10:24-25', '1 John 1:7', 'Acts 2:42-47',
            'Ecclesiastes 4:12', 'Matthew 18:20', 'Romans 12:10'
        ],
        'wisdom': [
            'Proverbs 3:5-6', 'James 1:5', 'Proverbs 9:10',
            'Ecclesiastes 12:13', 'Psalm 111:10', 'Proverbs 2:6'
        ],
        'courage': [
            'Joshua 1:9', 'Deuteronomy 31:6', 'Psalm 27:1',
            'Isaiah 41:10', '2 Timothy 1:7', 'Philippians 4:13'
        ],
        'comfort': [
            'Psalm 23:4', '2 Corinthians 1:3-4', 'Matthew 11:28',
            'Psalm 34:18', 'Romans 8:28', 'Isaiah 43:2'
        ]
    };
    
    const verses = contextualVerses[context];
    if (!verses || verses.length === 0) {
        console.warn(`No contextual verses found for: ${context}`);
        return this.getRandomVerse();
    }
    
    const randomIndex = Math.floor(Math.random() * verses.length);
    const selectedReference = verses[randomIndex];
    
    return this.getVerse(selectedReference);
}
```

**Context Categories:**
- **Prayer**: Verses about communication with God
- **Healing**: Scriptures for restoration and wellness
- **Fellowship**: Community and relationship verses
- **Wisdom**: Guidance and decision-making scriptures
- **Courage**: Strength and boldness in faith
- **Comfort**: Peace and consolation during trials

## Step 4: Implementing Scripture Search Functionality

Build a robust search system for finding verses by content:

```javascript
searchVerses(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    // Search through all verses
    for (const [reference, text] of Object.entries(this.verses)) {
        const relevance = this.calculateRelevance(searchTerm, text.toLowerCase(), reference);
        
        if (relevance > 0) {
            results.push({
                reference: reference,
                text: text,
                relevance: relevance,
                // Highlight matching terms for display
                highlightedText: this.highlightSearchTerms(text, searchTerm)
            });
        }
    }
    
    // Sort by relevance (highest first)
    return results.sort((a, b) => b.relevance - a.relevance);
}

calculateRelevance(searchTerm, text, reference) {
    let relevance = 0;
    
    // Exact phrase match gets highest score
    if (text.includes(searchTerm)) {
        relevance += 100;
    }
    
    // Individual word matches
    const searchWords = searchTerm.split(/\s+/);
    for (const word of searchWords) {
        if (word.length < 3) continue; // Skip short words
        
        const wordCount = (text.match(new RegExp(word, 'gi')) || []).length;
        relevance += wordCount * 10;
    }
    
    // Reference match bonus (for book/chapter searches)
    if (reference.toLowerCase().includes(searchTerm)) {
        relevance += 50;
    }
    
    return relevance;
}

highlightSearchTerms(text, searchTerm) {
    let highlighted = text;
    const words = searchTerm.split(/\s+/);
    
    for (const word of words) {
        if (word.length >= 3) {
            const regex = new RegExp(`(${word})`, 'gi');
            highlighted = highlighted.replace(regex, '<mark>$1</mark>');
        }
    }
    
    return highlighted;
}
```

**Search Features:**
- Minimum 2-character query requirement
- Relevance scoring with exact phrase bonus
- Individual word matching with scoring
- Reference-based search support
- HTML highlighting for display purposes

## Step 5: Creating Scripture-Based Quests

This is where scripture transforms into interactive gameplay:

```javascript
generateQuestFromScripture(reference) {
    const verse = this.getVerse(reference);
    if (!verse) return null;
    
    // Predefined quest templates for major scriptures
    const questTemplates = {
        'Matthew 28:19-20': {
            title: 'The Great Commission',
            description: 'Share the Gospel with 3 different characters in the world',
            objectives: [
                'Find someone seeking truth',
                'Share scripture with them',
                'Pray for their understanding'
            ],
            reward: 'Crown of Life',
            experienceReward: 100,
            faithReward: 25
        },
        
        'Matthew 25:35-36': {
            title: 'Acts of Mercy',
            description: 'Show Christ\'s love through acts of kindness',
            objectives: [
                'Feed the hungry (Find and help 3 NPCs in need)',
                'Give water to the thirsty (Visit the well at Samaria)',
                'Welcome the stranger (Greet 5 new fellowship members)'
            ],
            reward: 'Bread of Life',
            experienceReward: 75,
            faithReward: 20
        },
        
        'Psalm 23:1': {
            title: 'The Good Shepherd',
            description: 'Guide lost souls back to safety',
            objectives: [
                'Find the lost sheep (Locate 3 wandering NPCs)',
                'Lead them to green pastures (Guide to safe locations)',
                'Protect from wolves (Defend against spiritual attacks)'
            ],
            reward: 'Shepherd\'s Staff',
            experienceReward: 85,
            faithReward: 30
        }
    };
    
    // Return specific quest or generate generic meditation quest
    const specificQuest = questTemplates[reference];
    if (specificQuest) {
        return {
            id: `quest_${reference.replace(/[^a-zA-Z0-9]/g, '_')}`,
            reference: reference,
            verse: verse,
            ...specificQuest,
            objectives: specificQuest.objectives.map((obj, index) => ({
                id: index,
                description: obj,
                completed: false
            }))
        };
    }
    
    // Generic scripture meditation quest
    return {
        id: `meditation_${reference.replace(/[^a-zA-Z0-9]/g, '_')}`,
        title: 'Scripture Meditation',
        description: `Meditate deeply on ${reference}`,
        reference: reference,
        verse: verse,
        objectives: [
            { id: 0, description: 'Read the scripture carefully', completed: false },
            { id: 1, description: 'Pray for understanding', completed: false },
            { id: 2, description: 'Apply the wisdom to your life', completed: false }
        ],
        reward: 'Sacred Scroll',
        experienceReward: 25,
        faithReward: 15
    };
}
```

**Quest Design Principles:**
- Link objectives directly to scripture themes
- Provide meaningful rewards that reflect the verse's message
- Include both specific and generic quest templates
- Ensure objectives can be completed within the game world

## Step 6: Implementing Bookmark Management

Allow players to save their favorite verses:

```javascript
// Add verse to bookmarks
addBookmark(reference) {
    if (!this.verses[reference]) {
        console.warn(`Cannot bookmark unknown scripture: ${reference}`);
        return false;
    }
    
    if (!this.bookmarks.includes(reference)) {
        this.bookmarks.push(reference);
        this.saveBookmarks();
        console.log(`Bookmarked: ${reference}`);
        return true;
    }
    
    console.log(`Already bookmarked: ${reference}`);
    return false;
}

// Remove bookmark
removeBookmark(reference) {
    const index = this.bookmarks.indexOf(reference);
    if (index !== -1) {
        this.bookmarks.splice(index, 1);
        this.saveBookmarks();
        console.log(`Removed bookmark: ${reference}`);
        return true;
    }
    
    console.log(`Bookmark not found: ${reference}`);
    return false;
}

// Get all bookmarked verses
getBookmarkedVerses() {
    return this.bookmarks.map(reference => this.getVerse(reference))
                       .filter(verse => verse !== null);
}

// Persistence
saveBookmarks() {
    try {
        localStorage.setItem('spirit_soul_bookmarks', JSON.stringify(this.bookmarks));
    } catch (error) {
        console.error('Failed to save bookmarks:', error);
    }
}

loadBookmarks() {
    try {
        const saved = localStorage.getItem('spirit_soul_bookmarks');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load bookmarks:', error);
        return [];
    }
}
```

## Step 7: Daily Verse System

Provide consistent daily spiritual content:

```javascript
getDailyVerse() {
    // Use date as seed for consistent daily selection
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Create deterministic random selection based on date
    const references = Object.keys(this.verses);
    const dayHash = this.hashString(dateString);
    const index = dayHash % references.length;
    
    const dailyReference = references[index];
    const dailyVerse = this.getVerse(dailyReference);
    
    // Cache for the day
    this.currentDailyVerse = {
        ...dailyVerse,
        date: dateString
    };
    
    return this.currentDailyVerse;
}

// Simple string hash function for consistent daily selection
hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}
```

## Step 8: Integration with Game Systems

Here's how to properly integrate the ScriptureManager with other game components:

```javascript
// Export for module usage (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScriptureManager;
}

// Integration helper methods
getScriptureForCharacterClass(characterClass) {
    const classContexts = {
        'DISCIPLE': 'fellowship',
        'PROPHET': 'wisdom', 
        'SHEPHERD': 'comfort',
        'SCRIBE': 'wisdom'
    };
    
    const context = classContexts[characterClass] || 'wisdom';
    return this.getContextualVerse(context);
}

// Spiritual milestone verses
getMilestoneVerse(milestone) {
    const milestoneVerses = {
        'first_prayer': 'Matthew 6:6',
        'first_memorization': 'Psalm 119:11',
        'level_up': 'Philippians 3:14',
        'quest_complete': 'Galatians 6:9',
        'fellowship_join': 'Hebrews 10:24-25'
    };
    
    const reference = milestoneVerses[milestone];
    return reference ? this.getVerse(reference) : this.getRandomVerse();
}
```

## Common Implementation Mistakes to Avoid

1. **Don't modify the verses object directly during runtime**
   ```javascript
   // Wrong - modifies source data
   this.verses['John 3:16'] = 'Modified text';
   
   // Correct - work with copies for modifications
   const verse = { ...this.getVerse('John 3:16') };
   ```

2. **Always check for null returns**
   ```javascript
   // Wrong - assumes verse exists
   const verse = scriptureManager.getVerse('Unknown:1');
   console.log(verse.text); // Error!
   
   // Correct - check for existence
   const verse = scriptureManager.getVerse('Unknown:1');
   if (verse) {
       console.log(verse.text);
   }
   ```

3. **Use consistent reference formatting**
   ```javascript
   // Be consistent with spacing and capitalization
   'John 3:16'     // Correct
   'john 3:16'     // Wrong - case sensitive
   'John 3: 16'    // Wrong - extra space
   ```

This tutorial provides the foundation for building a robust, spiritually meaningful scripture management system that enhances every aspect of the Spirit-To-Soul gaming experience through the power of God's Word.