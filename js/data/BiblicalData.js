/**
 * Biblical Data for Spirit-To-Soul
 * Contains scriptures, verses, and biblical content from the King James Version
 */

class BiblicalData {
    constructor() {
        this.scriptures = new Map();
        this.books = new Map();
        this.themes = new Map();
    }
    
    async initialize() {
        this.loadScriptures();
        this.loadBooks();
        this.loadThemes();
        console.log('Biblical Data initialized');
    }
    
    loadScriptures() {
        const scriptures = [
            // Core Gospel Scriptures
            {
                id: 'john_3_16',
                book: 'John',
                chapter: 3,
                verse: 16,
                text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
                reference: 'John 3:16 (KJV)',
                theme: 'salvation',
                meditation: 'This verse reveals the ultimate expression of God\'s love for humanity - the gift of His Son for our eternal salvation.'
            },
            {
                id: 'john_1_1',
                book: 'John',
                chapter: 1,
                verse: 1,
                text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
                reference: 'John 1:1 (KJV)',
                theme: 'divinity',
                meditation: 'The eternal nature of Christ, existing before creation as the Word of God.'
            },
            {
                id: 'matthew_4_19',
                book: 'Matthew',
                chapter: 4,
                verse: 19,
                text: 'And he said unto them, Follow me, and I will make you fishers of men.',
                reference: 'Matthew 4:19 (KJV)',
                theme: 'discipleship',
                meditation: 'Jesus calls us to follow Him and share the Gospel with others.'
            },
            {
                id: 'matthew_28_19',
                book: 'Matthew',
                chapter: 28,
                verse: 19,
                text: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.',
                reference: 'Matthew 28:19 (KJV)',
                theme: 'great_commission',
                meditation: 'The Great Commission - our calling to spread the Gospel to all nations.'
            },
            
            // Faith and Trust
            {
                id: 'hebrews_11_1',
                book: 'Hebrews',
                chapter: 11,
                verse: 1,
                text: 'Now faith is the substance of things hoped for, the evidence of things not seen.',
                reference: 'Hebrews 11:1 (KJV)',
                theme: 'faith',
                meditation: 'Faith is the foundation of our relationship with God, trusting in what we cannot see.'
            },
            {
                id: 'proverbs_3_5',
                book: 'Proverbs',
                chapter: 3,
                verse: 5,
                text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.',
                reference: 'Proverbs 3:5 (KJV)',
                theme: 'trust',
                meditation: 'Complete trust in God requires setting aside our limited understanding.'
            },
            {
                id: 'psalm_23_1',
                book: 'Psalms',
                chapter: 23,
                verse: 1,
                text: 'The Lord is my shepherd; I shall not want.',
                reference: 'Psalm 23:1 (KJV)',
                theme: 'comfort',
                meditation: 'God provides for all our needs as a loving shepherd cares for his flock.'
            },
            
            // Love and Compassion
            {
                id: 'john_13_34',
                book: 'John',
                chapter: 13,
                verse: 34,
                text: 'A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.',
                reference: 'John 13:34 (KJV)',
                theme: 'love',
                meditation: 'Christ\'s love for us is the model for how we should love others.'
            },
            {
                id: '1_corinthians_13_4',
                book: '1 Corinthians',
                chapter: 13,
                verse: 4,
                text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up.',
                reference: '1 Corinthians 13:4 (KJV)',
                theme: 'love',
                meditation: 'True love is patient, kind, and humble - reflecting God\'s character.'
            },
            
            // Strength and Courage
            {
                id: 'joshua_1_9',
                book: 'Joshua',
                chapter: 1,
                verse: 9,
                text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.',
                reference: 'Joshua 1:9 (KJV)',
                theme: 'courage',
                meditation: 'God\'s presence gives us strength and courage to face any challenge.'
            },
            {
                id: 'philippians_4_13',
                book: 'Philippians',
                chapter: 4,
                verse: 13,
                text: 'I can do all things through Christ which strengtheneth me.',
                reference: 'Philippians 4:13 (KJV)',
                theme: 'strength',
                meditation: 'Christ is the source of our strength for every challenge and task.'
            },
            
            // Wisdom and Understanding
            {
                id: 'proverbs_9_10',
                book: 'Proverbs',
                chapter: 9,
                verse: 10,
                text: 'The fear of the Lord is the beginning of wisdom: and the knowledge of the holy is understanding.',
                reference: 'Proverbs 9:10 (KJV)',
                theme: 'wisdom',
                meditation: 'True wisdom begins with reverent respect for God and His holiness.'
            },
            {
                id: 'james_1_5',
                book: 'James',
                chapter: 1,
                verse: 5,
                text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.',
                reference: 'James 1:5 (KJV)',
                theme: 'wisdom',
                meditation: 'God generously gives wisdom to those who ask with sincere hearts.'
            },
            
            // Peace and Comfort
            {
                id: 'john_14_27',
                book: 'John',
                chapter: 14,
                verse: 27,
                text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.',
                reference: 'John 14:27 (KJV)',
                theme: 'peace',
                meditation: 'Christ gives us a supernatural peace that transcends worldly understanding.'
            },
            {
                id: 'psalm_46_10',
                book: 'Psalms',
                chapter: 46,
                verse: 10,
                text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.',
                reference: 'Psalm 46:10 (KJV)',
                theme: 'peace',
                meditation: 'In stillness and quiet trust, we recognize God\'s sovereignty and find peace.'
            },
            
            // Prayer and Communication
            {
                id: 'matthew_6_9',
                book: 'Matthew',
                chapter: 6,
                verse: 9,
                text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.',
                reference: 'Matthew 6:9 (KJV)',
                theme: 'prayer',
                meditation: 'Jesus teaches us to approach God as our loving Father with reverence and honor.'
            },
            {
                id: '1_thessalonians_5_17',
                book: '1 Thessalonians',
                chapter: 5,
                verse: 17,
                text: 'Pray without ceasing.',
                reference: '1 Thessalonians 5:17 (KJV)',
                theme: 'prayer',
                meditation: 'Continuous communion with God through prayer should be our way of life.'
            },
            
            // Hope and Future
            {
                id: 'jeremiah_29_11',
                book: 'Jeremiah',
                chapter: 29,
                verse: 11,
                text: 'For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.',
                reference: 'Jeremiah 29:11 (KJV)',
                theme: 'hope',
                meditation: 'God has good plans for our future, filled with hope and purpose.'
            },
            {
                id: 'romans_8_28',
                book: 'Romans',
                chapter: 8,
                verse: 28,
                text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
                reference: 'Romans 8:28 (KJV)',
                theme: 'hope',
                meditation: 'God works all circumstances together for good in the lives of those who love Him.'
            },
            
            // Biblical Locations and Stories
            {
                id: 'micah_5_2',
                book: 'Micah',
                chapter: 5,
                verse: 2,
                text: 'But thou, Bethlehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel.',
                reference: 'Micah 5:2 (KJV)',
                theme: 'prophecy',
                meditation: 'The prophecy of Messiah\'s birth in Bethlehem, fulfilled in Jesus Christ.'
            },
            {
                id: 'luke_4_16',
                book: 'Luke',
                chapter: 4,
                verse: 16,
                text: 'And he came to Nazareth, where he had been brought up: and, as his custom was, he went into the synagogue on the sabbath day.',
                reference: 'Luke 4:16 (KJV)',
                theme: 'worship',
                meditation: 'Jesus\'s example of regular worship and devotion to God.'
            },
            {
                id: 'matthew_3_13',
                book: 'Matthew',
                chapter: 3,
                verse: 13,
                text: 'Then cometh Jesus from Galilee to Jordan unto John, to be baptized of him.',
                reference: 'Matthew 3:13 (KJV)',
                theme: 'baptism',
                meditation: 'Jesus\'s baptism marks the beginning of His public ministry.'
            },
            {
                id: 'exodus_19_20',
                book: 'Exodus',
                chapter: 19,
                verse: 20,
                text: 'And the Lord came down upon mount Sinai, on the top of the mount: and the Lord called Moses up to the top of the mount.',
                reference: 'Exodus 19:20 (KJV)',
                theme: 'revelation',
                meditation: 'God reveals Himself to Moses on Mount Sinai, giving the Law.'
            },
            {
                id: 'matthew_4_18',
                book: 'Matthew',
                chapter: 4,
                verse: 18,
                text: 'And Jesus, walking by the sea of Galilee, saw two brethren, Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers.',
                reference: 'Matthew 4:18 (KJV)',
                theme: 'calling',
                meditation: 'Jesus calls ordinary people to extraordinary purposes.'
            },
            {
                id: 'psalm_122_6',
                book: 'Psalms',
                chapter: 122,
                verse: 6,
                text: 'Pray for the peace of Jerusalem: they shall prosper that love thee.',
                reference: 'Psalm 122:6 (KJV)',
                theme: 'jerusalem',
                meditation: 'Jerusalem holds special significance as the holy city in God\'s plan.'
            },
            
            // Additional Wisdom and Guidance
            {
                id: 'psalm_119_105',
                book: 'Psalms',
                chapter: 119,
                verse: 105,
                text: 'Thy word is a lamp unto my feet, and a light unto my path.',
                reference: 'Psalm 119:105 (KJV)',
                theme: 'guidance',
                meditation: 'God\'s Word illuminates our way and guides our steps.'
            },
            {
                id: 'matthew_17_20',
                book: 'Matthew',
                chapter: 17,
                verse: 20,
                text: 'And Jesus said unto them, Because of your unbelief: for verily I say unto you, If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you.',
                reference: 'Matthew 17:20 (KJV)',
                theme: 'faith',
                meditation: 'Even small faith can accomplish great things through God\'s power.'
            },
            {
                id: 'genesis_8_20',
                book: 'Genesis',
                chapter: 8,
                verse: 20,
                text: 'And Noah builded an altar unto the Lord; and took of every clean beast, and of every clean fowl, and offered burnt offerings on the altar.',
                reference: 'Genesis 8:20 (KJV)',
                theme: 'worship',
                meditation: 'Noah\'s first act after the flood was to worship and thank God.'
            },
            {
                id: 'john_4_6',
                book: 'John',
                chapter: 4,
                verse: 6,
                text: 'Now Jacob\'s well was there. Jesus therefore, being wearied with his journey, sat thus on the well: and it was about the sixth hour.',
                reference: 'John 4:6 (KJV)',
                theme: 'compassion',
                meditation: 'Jesus, in His humanity, experienced weariness yet showed compassion to the Samaritan woman.'
            },
            {
                id: 'james_2_26',
                book: 'James',
                chapter: 2,
                verse: 26,
                text: 'For as the body without the spirit is dead, so faith without works is dead also.',
                reference: 'James 2:26 (KJV)',
                theme: 'works',
                meditation: 'True faith is demonstrated through our actions and deeds.'
            }
        ];
        
        scriptures.forEach(scripture => {
            this.scriptures.set(scripture.id, scripture);
        });
        
        console.log(`Loaded ${scriptures.length} scriptures`);
    }
    
    loadBooks() {
        const books = [
            { name: 'Genesis', testament: 'old', chapters: 50 },
            { name: 'Exodus', testament: 'old', chapters: 40 },
            { name: 'Psalms', testament: 'old', chapters: 150 },
            { name: 'Proverbs', testament: 'old', chapters: 31 },
            { name: 'Isaiah', testament: 'old', chapters: 66 },
            { name: 'Jeremiah', testament: 'old', chapters: 52 },
            { name: 'Micah', testament: 'old', chapters: 7 },
            { name: 'Matthew', testament: 'new', chapters: 28 },
            { name: 'Luke', testament: 'new', chapters: 24 },
            { name: 'John', testament: 'new', chapters: 21 },
            { name: 'Romans', testament: 'new', chapters: 16 },
            { name: '1 Corinthians', testament: 'new', chapters: 16 },
            { name: 'Philippians', testament: 'new', chapters: 4 },
            { name: 'Hebrews', testament: 'new', chapters: 13 },
            { name: 'James', testament: 'new', chapters: 5 },
            { name: '1 Thessalonians', testament: 'new', chapters: 5 }
        ];
        
        books.forEach(book => {
            this.books.set(book.name, book);
        });
    }
    
    loadThemes() {
        const themes = [
            {
                id: 'salvation',
                name: 'Salvation',
                description: 'God\'s gift of eternal life through Jesus Christ'
            },
            {
                id: 'faith',
                name: 'Faith',
                description: 'Trust and belief in God and His promises'
            },
            {
                id: 'love',
                name: 'Love',
                description: 'God\'s love for us and our love for others'
            },
            {
                id: 'wisdom',
                name: 'Wisdom',
                description: 'Divine insight and understanding'
            },
            {
                id: 'courage',
                name: 'Courage',
                description: 'Strength and bravery through God\'s power'
            },
            {
                id: 'peace',
                name: 'Peace',
                description: 'Inner tranquility and harmony with God'
            },
            {
                id: 'hope',
                name: 'Hope',
                description: 'Confident expectation in God\'s promises'
            },
            {
                id: 'prayer',
                name: 'Prayer',
                description: 'Communication and fellowship with God'
            },
            {
                id: 'discipleship',
                name: 'Discipleship',
                description: 'Following Jesus and growing in faith'
            },
            {
                id: 'great_commission',
                name: 'Great Commission',
                description: 'Sharing the Gospel with all nations'
            }
        ];
        
        themes.forEach(theme => {
            this.themes.set(theme.id, theme);
        });
    }
    
    getAllScriptures() {
        return Array.from(this.scriptures.values());
    }
    
    getScripture(id) {
        return this.scriptures.get(id);
    }
    
    getScripturesByTheme(theme) {
        return Array.from(this.scriptures.values()).filter(s => s.theme === theme);
    }
    
    getScripturesByBook(book) {
        return Array.from(this.scriptures.values()).filter(s => s.book === book);
    }
    
    getRandomScripture() {
        const scriptures = Array.from(this.scriptures.values());
        return scriptures[Math.floor(Math.random() * scriptures.length)];
    }
    
    searchScriptures(query) {
        const searchTerm = query.toLowerCase();
        return Array.from(this.scriptures.values()).filter(scripture => 
            scripture.text.toLowerCase().includes(searchTerm) ||
            scripture.reference.toLowerCase().includes(searchTerm) ||
            scripture.theme.toLowerCase().includes(searchTerm)
        );
    }
    
    getThemes() {
        return Array.from(this.themes.values());
    }
    
    getBooks() {
        return Array.from(this.books.values());
    }
}