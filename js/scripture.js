// Scripture Database and Management
class ScriptureManager {
    constructor() {
        this.verses = this.initializeScriptures();
        this.currentVerse = null;
        this.bookmarks = this.loadBookmarks();
    }
    
    initializeScriptures() {
        return {
            // Genesis
            'Genesis 1:1': 'In the beginning God created the heaven and the earth.',
            'Genesis 1:27': 'So God created man in his own image, in the image of God created he him; male and female created he them.',
            'Genesis 3:15': 'And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.',
            
            // Psalms
            'Psalm 23:1': 'The LORD is my shepherd; I shall not want.',
            'Psalm 23:4': 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
            'Psalm 119:105': 'Thy word is a lamp unto my feet, and a light unto my path.',
            'Psalm 139:14': 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.',
            
            // Proverbs
            'Proverbs 3:5-6': 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.',
            'Proverbs 27:17': 'Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.',
            
            // Isaiah
            'Isaiah 40:31': 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
            'Isaiah 55:8-9': 'For my thoughts are not your thoughts, neither are your ways my ways, saith the LORD. For as the heavens are higher than the earth, so are my ways higher than your ways, and my thoughts than your thoughts.',
            
            // Jeremiah
            'Jeremiah 29:11': 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
            
            // Matthew
            'Matthew 5:14': 'Ye are the light of the world. A city that is set on an hill cannot be hid.',
            'Matthew 6:33': 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.',
            'Matthew 11:28': 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.',
            'Matthew 28:19-20': 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost: Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
            
            // John
            'John 1:1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
            'John 3:16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
            'John 8:32': 'And ye shall know the truth, and the truth shall make you free.',
            'John 14:6': 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
            
            // Romans
            'Romans 8:28': 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
            'Romans 10:9': 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.',
            
            // 1 Corinthians
            '1 Corinthians 13:4-7': 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.',
            
            // Ephesians
            'Ephesians 2:8-9': 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.',
            
            // Philippians
            'Philippians 4:13': 'I can do all things through Christ which strengtheneth me.',
            'Philippians 4:19': 'But my God shall supply all your need according to his riches in glory by Christ Jesus.',
            
            // 2 Timothy
            '2 Timothy 3:16': 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:',
            
            // Hebrews
            'Hebrews 11:1': 'Now faith is the substance of things hoped for, the evidence of things not seen.',
            
            // James
            'James 1:5': 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
            
            // 1 Peter
            '1 Peter 5:7': 'Casting all your care upon him; for he careth for you.',
            
            // 1 John
            '1 John 4:8': 'He that loveth not knoweth not God; for God is love.',
            
            // Revelation
            'Revelation 21:4': 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.'
        };
    }
    
    // Get a random verse
    getRandomVerse() {
        const references = Object.keys(this.verses);
        const randomRef = references[Math.floor(Math.random() * references.length)];
        return {
            reference: randomRef,
            text: this.verses[randomRef]
        };
    }
    
    // Get verse by reference
    getVerse(reference) {
        if (this.verses[reference]) {
            return {
                reference: reference,
                text: this.verses[reference]
            };
        }
        return null;
    }
    
    // Search verses by text content
    searchVerses(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [reference, text] of Object.entries(this.verses)) {
            if (text.toLowerCase().includes(searchTerm) || 
                reference.toLowerCase().includes(searchTerm)) {
                results.push({
                    reference: reference,
                    text: text,
                    relevance: this.calculateRelevance(searchTerm, text, reference)
                });
            }
        }
        
        // Sort by relevance
        return results.sort((a, b) => b.relevance - a.relevance);
    }
    
    calculateRelevance(searchTerm, text, reference) {
        let score = 0;
        const textLower = text.toLowerCase();
        const refLower = reference.toLowerCase();
        
        // Exact match in reference gets highest score
        if (refLower.includes(searchTerm)) {
            score += 100;
        }
        
        // Count occurrences in text
        const matches = textLower.split(searchTerm).length - 1;
        score += matches * 10;
        
        // Bonus for shorter verses (more focused)
        score += Math.max(0, 50 - text.length / 10);
        
        return score;
    }
    
    // Get verse for specific game context
    getContextualVerse(context) {
        const contextualVerses = {
            'start': ['John 3:16', 'Genesis 1:1', 'Psalm 23:1'],
            'battle': ['Ephesians 6:11', 'Psalm 23:4', 'Joshua 1:9'],
            'healing': ['Jeremiah 30:17', 'Psalm 147:3', 'Isaiah 53:5'],
            'guidance': ['Proverbs 3:5-6', 'Psalm 119:105', 'Isaiah 30:21'],
            'encouragement': ['Philippians 4:13', 'Isaiah 40:31', 'Romans 8:28'],
            'fellowship': ['1 John 1:7', 'Proverbs 27:17', 'Hebrews 10:25'],
            'prayer': ['Matthew 6:9-13', 'Philippians 4:6-7', '1 Thessalonians 5:17'],
            'wisdom': ['James 1:5', 'Proverbs 9:10', '1 Corinthians 1:25']
        };
        
        const verses = contextualVerses[context] || ['Psalm 23:1'];
        const selectedRef = verses[Math.floor(Math.random() * verses.length)];
        return this.getVerse(selectedRef);
    }
    
    // Bookmark management
    addBookmark(reference) {
        if (!this.bookmarks.includes(reference) && this.verses[reference]) {
            this.bookmarks.push(reference);
            this.saveBookmarks();
            return true;
        }
        return false;
    }
    
    removeBookmark(reference) {
        const index = this.bookmarks.indexOf(reference);
        if (index > -1) {
            this.bookmarks.splice(index, 1);
            this.saveBookmarks();
            return true;
        }
        return false;
    }
    
    getBookmarkedVerses() {
        return this.bookmarks.map(ref => this.getVerse(ref)).filter(v => v !== null);
    }
    
    saveBookmarks() {
        localStorage.setItem('spirit_bookmarks', JSON.stringify(this.bookmarks));
    }
    
    loadBookmarks() {
        try {
            const saved = localStorage.getItem('spirit_bookmarks');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Failed to load bookmarks:', e);
            return [];
        }
    }
    
    // Daily verse functionality
    getDailyVerse() {
        const today = new Date().toDateString();
        const savedDaily = localStorage.getItem('spirit_daily_verse');
        
        if (savedDaily) {
            const dailyData = JSON.parse(savedDaily);
            if (dailyData.date === today) {
                return this.getVerse(dailyData.reference);
            }
        }
        
        // Generate new daily verse
        const verse = this.getRandomVerse();
        localStorage.setItem('spirit_daily_verse', JSON.stringify({
            date: today,
            reference: verse.reference
        }));
        
        return verse;
    }
    
    // Scripture-based quest generation
    generateQuestFromScripture(reference) {
        const verse = this.getVerse(reference);
        if (!verse) return null;
        
        const questTemplates = {
            'Matthew 28:19-20': {
                title: 'The Great Commission',
                description: 'Share the Gospel with 3 different characters in the world',
                objectives: ['Find someone seeking truth', 'Share scripture with them', 'Pray for their understanding'],
                reward: 'Crown of Life'
            },
            'Matthew 25:35-36': {
                title: 'Acts of Mercy',
                description: 'Show Christ\'s love through acts of kindness',
                objectives: ['Feed the hungry', 'Give water to the thirsty', 'Welcome the stranger'],
                reward: 'Bread of Life'
            },
            'Psalm 23:1': {
                title: 'The Good Shepherd',
                description: 'Guide lost souls back to safety',
                objectives: ['Find the lost sheep', 'Lead them to green pastures', 'Protect from wolves'],
                reward: 'Shepherd\'s Staff'
            }
        };
        
        return questTemplates[reference] || {
            title: 'Scripture Meditation',
            description: `Meditate on ${reference}`,
            objectives: ['Read the scripture', 'Pray for understanding', 'Apply the wisdom'],
            reward: 'Sacred Scroll'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScriptureManager;
}