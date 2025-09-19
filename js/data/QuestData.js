/**
 * Quest Data for Spirit-To-Soul
 * Defines all scripture-based quests and spiritual missions
 */

class QuestData {
    constructor() {
        this.quests = new Map();
    }
    
    async initialize() {
        this.loadQuests();
        console.log('Quest Data initialized');
    }
    
    loadQuests() {
        const quests = [
            // Main Story Quests
            {
                id: 'great_commission',
                title: 'The Great Commission',
                description: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost. - Matthew 28:19',
                type: 'main',
                scripture: 'matthew_28_19',
                objectives: [
                    {
                        id: 'explore_village',
                        description: 'Explore the starting village',
                        type: 'visit_location',
                        target: 'starting_village',
                        completed: false
                    },
                    {
                        id: 'talk_to_elder',
                        description: 'Speak with Elder Samuel',
                        type: 'talk_to',
                        target: 'village_elder',
                        completed: false
                    },
                    {
                        id: 'learn_first_scripture',
                        description: 'Learn your first scripture',
                        type: 'learn_scripture',
                        target: 'john_3_16',
                        completed: false
                    },
                    {
                        id: 'pray_together',
                        description: 'Pray with Elder Samuel',
                        type: 'use_ability',
                        target: 'prayer',
                        count: 1,
                        completed: false
                    }
                ],
                rewards: {
                    experience: 100,
                    scripture: 'matthew_4_19',
                    attributes: { faith: 2, wisdom: 1 }
                },
                followUpQuests: ['fishers_of_men']
            },
            
            {
                id: 'fishers_of_men',
                title: 'Fishers of Men',
                description: 'Follow me, and I will make you fishers of men. Learn the ways of discipleship and sharing the Gospel.',
                type: 'main',
                scripture: 'matthew_4_19',
                objectives: [
                    {
                        id: 'visit_galilee',
                        description: 'Visit the Sea of Galilee',
                        type: 'visit_location',
                        target: 'sea_of_galilee',
                        completed: false
                    },
                    {
                        id: 'meet_peter',
                        description: 'Meet Simon Peter by the shore',
                        type: 'talk_to',
                        target: 'peter',
                        completed: false
                    },
                    {
                        id: 'learn_calling',
                        description: 'Learn about your spiritual calling',
                        type: 'talk_to',
                        target: 'peter',
                        completed: false
                    },
                    {
                        id: 'share_testimony',
                        description: 'Share your testimony with another believer',
                        type: 'use_ability',
                        target: 'scripture_recite',
                        count: 1,
                        completed: false
                    }
                ],
                rewards: {
                    experience: 150,
                    scripture: 'john_1_1',
                    attributes: { wisdom: 2, understanding: 1 }
                },
                followUpQuests: ['baptism_witness']
            },
            
            {
                id: 'baptism_witness',
                title: 'Witness at the Jordan',
                description: 'Journey to the Jordan River where John baptized Jesus, and witness the power of spiritual cleansing.',
                type: 'main',
                scripture: 'matthew_3_13',
                objectives: [
                    {
                        id: 'travel_jordan',
                        description: 'Travel to the Jordan River',
                        type: 'visit_location',
                        target: 'jordan_river',
                        completed: false
                    },
                    {
                        id: 'meet_john_baptist',
                        description: 'Speak with John the Baptist',
                        type: 'talk_to',
                        target: 'john_baptist',
                        completed: false
                    },
                    {
                        id: 'witness_baptism',
                        description: 'Witness a baptism ceremony',
                        type: 'special_event',
                        target: 'baptism_ceremony',
                        completed: false
                    },
                    {
                        id: 'pray_for_others',
                        description: 'Pray for other believers',
                        type: 'use_ability',
                        target: 'prayer',
                        count: 3,
                        completed: false
                    }
                ],
                rewards: {
                    experience: 200,
                    scripture: 'romans_8_28',
                    attributes: { faith: 3, compassion: 2 }
                },
                followUpQuests: ['mountain_revelation']
            },
            
            {
                id: 'mountain_revelation',
                title: 'Mountain of Revelation',
                description: 'Ascend Mount Sinai where Moses received the Law, and seek divine revelation and wisdom.',
                type: 'main',
                scripture: 'exodus_19_20',
                objectives: [
                    {
                        id: 'climb_sinai',
                        description: 'Climb Mount Sinai',
                        type: 'visit_location',
                        target: 'mount_sinai',
                        completed: false
                    },
                    {
                        id: 'meditate_summit',
                        description: 'Meditate at the summit',
                        type: 'special_action',
                        target: 'meditation',
                        completed: false
                    },
                    {
                        id: 'receive_wisdom',
                        description: 'Receive divine wisdom',
                        type: 'learn_scripture',
                        target: 'proverbs_9_10',
                        completed: false
                    },
                    {
                        id: 'descend_transformed',
                        description: 'Descend the mountain transformed',
                        type: 'special_event',
                        target: 'transformation',
                        completed: false
                    }
                ],
                rewards: {
                    experience: 300,
                    scripture: 'psalm_119_105',
                    attributes: { wisdom: 4, understanding: 3, faith: 2 }
                },
                followUpQuests: ['holy_city_pilgrimage']
            },
            
            {
                id: 'holy_city_pilgrimage',
                title: 'Pilgrimage to the Holy City',
                description: 'Journey to Jerusalem, the Holy City, and experience the heart of biblical faith.',
                type: 'main',
                scripture: 'psalm_122_6',
                objectives: [
                    {
                        id: 'enter_jerusalem',
                        description: 'Enter the gates of Jerusalem',
                        type: 'visit_location',
                        target: 'jerusalem',
                        completed: false
                    },
                    {
                        id: 'pray_for_peace',
                        description: 'Pray for the peace of Jerusalem',
                        type: 'use_ability',
                        target: 'prayer',
                        count: 1,
                        completed: false
                    },
                    {
                        id: 'visit_temple',
                        description: 'Visit the temple area',
                        type: 'special_location',
                        target: 'temple_area',
                        completed: false
                    },
                    {
                        id: 'complete_pilgrimage',
                        description: 'Complete your spiritual pilgrimage',
                        type: 'special_event',
                        target: 'pilgrimage_complete',
                        completed: false
                    }
                ],
                rewards: {
                    experience: 400,
                    scripture: 'john_14_27',
                    attributes: { faith: 3, wisdom: 3, compassion: 2, understanding: 2 }
                },
                followUpQuests: ['spread_gospel']
            },
            
            // Side Quests
            {
                id: 'spread_gospel',
                title: 'Spread the Good News',
                description: 'Share the Gospel with others and help them grow in faith.',
                type: 'side',
                scripture: 'john_13_34',
                objectives: [
                    {
                        id: 'help_three_people',
                        description: 'Help three people in need',
                        type: 'help_npcs',
                        target: 'any',
                        count: 3,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'share_five_scriptures',
                        description: 'Share scriptures with five people',
                        type: 'use_ability',
                        target: 'scripture_recite',
                        count: 5,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'pray_with_believers',
                        description: 'Pray with fellow believers',
                        type: 'group_prayer',
                        target: 'group',
                        count: 2,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 250,
                    scripture: '1_corinthians_13_4',
                    attributes: { compassion: 3, faith: 2 }
                },
                followUpQuests: ['healing_ministry']
            },
            
            {
                id: 'healing_ministry',
                title: 'Ministry of Healing',
                description: 'Develop your gift of healing and comfort those who suffer.',
                type: 'side',
                scripture: 'james_1_5',
                objectives: [
                    {
                        id: 'learn_healing_scripture',
                        description: 'Learn healing scriptures',
                        type: 'learn_scripture',
                        target: 'psalm_23_1',
                        completed: false
                    },
                    {
                        id: 'heal_five_people',
                        description: 'Use healing touch on five people',
                        type: 'use_ability',
                        target: 'healing_touch',
                        count: 5,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'comfort_grieving',
                        description: 'Comfort those who are grieving',
                        type: 'special_interaction',
                        target: 'comfort',
                        count: 3,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 200,
                    scripture: 'philippians_4_13',
                    attributes: { compassion: 4, faith: 2 }
                }
            },
            
            {
                id: 'wisdom_seeker',
                title: 'Seeker of Wisdom',
                description: 'Grow in wisdom and understanding through study and meditation.',
                type: 'side',
                scripture: 'proverbs_9_10',
                objectives: [
                    {
                        id: 'collect_ten_scriptures',
                        description: 'Collect ten different scriptures',
                        type: 'collect_scriptures',
                        target: 'any',
                        count: 10,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'meditate_daily',
                        description: 'Meditate on scripture daily',
                        type: 'daily_action',
                        target: 'meditation',
                        count: 7,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'teach_others',
                        description: 'Teach scripture to others',
                        type: 'teaching',
                        target: 'scripture_teaching',
                        count: 3,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 300,
                    scripture: 'psalm_46_10',
                    attributes: { wisdom: 5, understanding: 3 }
                }
            },
            
            {
                id: 'shepherd_calling',
                title: 'The Shepherd\'s Heart',
                description: 'Develop the heart of a shepherd, caring for and guiding others.',
                type: 'calling',
                callingRequired: 'shepherd',
                scripture: 'psalm_23_1',
                objectives: [
                    {
                        id: 'protect_flock',
                        description: 'Protect fellow believers from danger',
                        type: 'protect_npcs',
                        target: 'believers',
                        count: 5,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'guide_lost_sheep',
                        description: 'Guide lost souls to faith',
                        type: 'convert_npcs',
                        target: 'unbelievers',
                        count: 3,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'provide_comfort',
                        description: 'Provide comfort and blessing',
                        type: 'use_ability',
                        target: 'blessing',
                        count: 10,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 350,
                    scripture: 'john_10_11',
                    attributes: { compassion: 4, wisdom: 3, faith: 2 }
                }
            },
            
            {
                id: 'warrior_calling',
                title: 'Warrior of Faith',
                description: 'Stand strong against spiritual darkness and defend the faith.',
                type: 'calling',
                callingRequired: 'warrior',
                scripture: 'ephesians_6_11',
                objectives: [
                    {
                        id: 'resist_temptation',
                        description: 'Resist spiritual temptations',
                        type: 'spiritual_battle',
                        target: 'temptation',
                        count: 5,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'defend_faith',
                        description: 'Defend the faith against attacks',
                        type: 'defend_believers',
                        target: 'persecution',
                        count: 3,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'strengthen_others',
                        description: 'Strengthen fellow believers',
                        type: 'encourage_npcs',
                        target: 'believers',
                        count: 8,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 350,
                    scripture: 'joshua_1_9',
                    attributes: { strength: 4, courage: 4, faith: 3 }
                }
            },
            
            {
                id: 'healer_calling',
                title: 'Hands of Healing',
                description: 'Develop your gift of divine healing and restoration.',
                type: 'calling',
                callingRequired: 'healer',
                scripture: 'james_5_14',
                objectives: [
                    {
                        id: 'heal_the_sick',
                        description: 'Heal the sick with divine power',
                        type: 'use_ability',
                        target: 'healing_touch',
                        count: 15,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'restore_hope',
                        description: 'Restore hope to the despairing',
                        type: 'comfort_npcs',
                        target: 'despairing',
                        count: 8,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'prayer_ministry',
                        description: 'Develop a powerful prayer ministry',
                        type: 'use_ability',
                        target: 'prayer',
                        count: 20,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 400,
                    scripture: '1_peter_2_24',
                    attributes: { compassion: 5, faith: 4, wisdom: 2 }
                }
            },
            
            {
                id: 'teacher_calling',
                title: 'Teacher of Truth',
                description: 'Share wisdom and knowledge, teaching others the ways of God.',
                type: 'calling',
                callingRequired: 'teacher',
                scripture: '2_timothy_2_2',
                objectives: [
                    {
                        id: 'teach_scripture',
                        description: 'Teach scripture to eager students',
                        type: 'teach_npcs',
                        target: 'students',
                        count: 10,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'correct_errors',
                        description: 'Gently correct misunderstandings',
                        type: 'correct_npcs',
                        target: 'confused',
                        count: 5,
                        completed: false,
                        tracking: true
                    },
                    {
                        id: 'share_wisdom',
                        description: 'Share divine wisdom through scripture',
                        type: 'use_ability',
                        target: 'scripture_recite',
                        count: 25,
                        completed: false,
                        tracking: true
                    }
                ],
                rewards: {
                    experience: 375,
                    scripture: 'matthew_28_20',
                    attributes: { wisdom: 5, understanding: 4, compassion: 2 }
                }
            },
            
            // Daily/Repeatable Quests
            {
                id: 'daily_devotion',
                title: 'Daily Devotion',
                description: 'Maintain your daily spiritual disciplines.',
                type: 'daily',
                scripture: '1_thessalonians_5_17',
                objectives: [
                    {
                        id: 'morning_prayer',
                        description: 'Begin the day with prayer',
                        type: 'use_ability',
                        target: 'prayer',
                        count: 1,
                        completed: false
                    },
                    {
                        id: 'scripture_reading',
                        description: 'Read and meditate on scripture',
                        type: 'read_scripture',
                        target: 'any',
                        count: 1,
                        completed: false
                    },
                    {
                        id: 'evening_blessing',
                        description: 'End the day with blessing',
                        type: 'use_ability',
                        target: 'blessing',
                        count: 1,
                        completed: false
                    }
                ],
                rewards: {
                    experience: 50,
                    attributes: { faith: 1 }
                },
                repeatable: true
            },
            
            {
                id: 'fellowship_gathering',
                title: 'Fellowship Gathering',
                description: 'Participate in fellowship with other believers.',
                type: 'weekly',
                scripture: 'hebrews_10_25',
                objectives: [
                    {
                        id: 'join_fellowship',
                        description: 'Join a fellowship gathering',
                        type: 'special_event',
                        target: 'fellowship',
                        count: 1,
                        completed: false
                    },
                    {
                        id: 'encourage_others',
                        description: 'Encourage fellow believers',
                        type: 'encourage_npcs',
                        target: 'believers',
                        count: 3,
                        completed: false
                    },
                    {
                        id: 'share_testimony',
                        description: 'Share your testimony',
                        type: 'use_ability',
                        target: 'scripture_recite',
                        count: 1,
                        completed: false
                    }
                ],
                rewards: {
                    experience: 100,
                    attributes: { faith: 2, compassion: 1 }
                },
                repeatable: true
            }
        ];
        
        quests.forEach(quest => {
            this.quests.set(quest.id, quest);
        });
        
        console.log(`Loaded ${quests.length} quests`);
    }
    
    getAllQuests() {
        return Array.from(this.quests.values());
    }
    
    getQuest(id) {
        return this.quests.get(id);
    }
    
    getQuestsByType(type) {
        return Array.from(this.quests.values()).filter(q => q.type === type);
    }
    
    getQuestsByCalling(calling) {
        return Array.from(this.quests.values()).filter(q => 
            !q.callingRequired || q.callingRequired === calling
        );
    }
    
    getMainQuests() {
        return this.getQuestsByType('main');
    }
    
    getSideQuests() {
        return this.getQuestsByType('side');
    }
    
    getCallingQuests() {
        return this.getQuestsByType('calling');
    }
    
    getDailyQuests() {
        return this.getQuestsByType('daily');
    }
    
    getRepeatableQuests() {
        return Array.from(this.quests.values()).filter(q => q.repeatable);
    }
}