/**
 * Audio System for Spirit-To-Soul
 * Handles background music, sound effects, and audio for the biblical RPG
 */

class AudioSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Audio context
        this.audioContext = null;
        this.masterGain = null;
        
        // Audio state
        this.isInitialized = false;
        this.isEnabled = true;
        this.masterVolume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.8;
        
        // Audio assets
        this.music = new Map();
        this.soundEffects = new Map();
        this.ambientSounds = new Map();
        
        // Current audio state
        this.currentMusic = null;
        this.currentAmbient = null;
        this.activeSounds = new Set();
        
        // Biblical audio themes
        this.audioThemes = {
            peaceful: ['psalm_music', 'gentle_breeze', 'flowing_water'],
            spiritual: ['choir_ethereal', 'bells_sacred', 'prayer_ambient'],
            adventurous: ['journey_music', 'exploration_theme'],
            dramatic: ['mighty_works', 'divine_power', 'epic_biblical']
        };
        
        this.initialize();
    }
    
    async initialize() {
        try {
            // Initialize Web Audio API
            await this.initializeAudioContext();
            
            // Create audio assets programmatically (procedural audio)
            this.createProceduralAudio();
            
            // Set up audio event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('Audio System initialized');
            
        } catch (error) {
            console.warn('Audio System initialization failed:', error);
            this.isEnabled = false;
        }
    }
    
    async initializeAudioContext() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain node
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = this.masterVolume;
        this.masterGain.connect(this.audioContext.destination);
        
        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    createProceduralAudio() {
        // Create peaceful background music
        this.createPeacefulMusic();
        
        // Create sound effects
        this.createSoundEffects();
        
        // Create ambient sounds
        this.createAmbientSounds();
    }
    
    createPeacefulMusic() {
        // Create a simple, peaceful melody using Web Audio API
        const musicData = this.generatePeacefulMelody();
        this.music.set('peaceful_background', {
            type: 'procedural',
            data: musicData,
            duration: 60, // 60 seconds
            loop: true
        });
        
        // Create spiritual theme
        const spiritualData = this.generateSpiritualMelody();
        this.music.set('spiritual_theme', {
            type: 'procedural',
            data: spiritualData,
            duration: 45,
            loop: true
        });
    }
    
    generatePeacefulMelody() {
        // Generate a simple pentatonic melody for peaceful background
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C, D, E, G, A (pentatonic)
        const melody = [];
        
        for (let i = 0; i < 32; i++) {
            const noteIndex = Math.floor(Math.random() * notes.length);
            const frequency = notes[noteIndex];
            const duration = 0.5 + Math.random() * 1.5; // 0.5 to 2 seconds
            const delay = i * 2; // Start time
            
            melody.push({
                frequency,
                duration,
                startTime: delay,
                volume: 0.1 + Math.random() * 0.1
            });
        }
        
        return melody;
    }
    
    generateSpiritualMelody() {
        // Generate a more ethereal, spiritual melody
        const notes = [523.25, 587.33, 659.25, 698.46, 783.99]; // Higher octave C, D, E, F, G
        const melody = [];
        
        for (let i = 0; i < 24; i++) {
            const noteIndex = Math.floor(Math.random() * notes.length);
            const frequency = notes[noteIndex];
            const duration = 1 + Math.random() * 2; // Longer notes
            const delay = i * 2.5;
            
            melody.push({
                frequency,
                duration,
                startTime: delay,
                volume: 0.05 + Math.random() * 0.05,
                reverb: true // Add reverb for ethereal effect
            });
        }
        
        return melody;
    }
    
    createSoundEffects() {
        // Prayer sound effect
        this.soundEffects.set('prayer', {
            type: 'synthesized',
            generate: () => this.generateBellSound(440, 2, 0.3)
        });
        
        // Blessing sound effect
        this.soundEffects.set('blessing', {
            type: 'synthesized',
            generate: () => this.generateChimeSound([523, 659, 784], 1.5, 0.2)
        });
        
        // Scripture recitation
        this.soundEffects.set('scripture', {
            type: 'synthesized',
            generate: () => this.generateHarmoniousChord([261, 329, 392], 1, 0.15)
        });
        
        // Healing touch
        this.soundEffects.set('healing', {
            type: 'synthesized',
            generate: () => this.generateHealingTone(174, 3, 0.2) // 174 Hz is associated with healing
        });
        
        // Footsteps
        this.soundEffects.set('footstep', {
            type: 'synthesized',
            generate: () => this.generateFootstepSound()
        });
        
        // Interaction
        this.soundEffects.set('interact', {
            type: 'synthesized',
            generate: () => this.generateInteractionSound()
        });
        
        // Level up
        this.soundEffects.set('levelup', {
            type: 'synthesized',
            generate: () => this.generateLevelUpSound()
        });
        
        // Quest complete
        this.soundEffects.set('quest_complete', {
            type: 'synthesized',
            generate: () => this.generateVictorySound()
        });
    }
    
    createAmbientSounds() {
        // Wind ambient
        this.ambientSounds.set('wind', {
            type: 'synthesized',
            generate: () => this.generateWindSound()
        });
        
        // Water flowing
        this.ambientSounds.set('water', {
            type: 'synthesized',
            generate: () => this.generateWaterSound()
        });
        
        // Birds chirping
        this.ambientSounds.set('birds', {
            type: 'synthesized',
            generate: () => this.generateBirdSounds()
        });
    }
    
    // Sound generation methods
    generateBellSound(frequency, duration, volume) {
        return (audioContext, destination) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            // Bell-like envelope
            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.connect(gain);
            gain.connect(destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }
    
    generateChimeSound(frequencies, duration, volume) {
        return (audioContext, destination) => {
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = freq;
                
                const startTime = audioContext.currentTime + index * 0.2;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(volume / frequencies.length, startTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                oscillator.connect(gain);
                gain.connect(destination);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });
        };
    }
    
    generateHarmoniousChord(frequencies, duration, volume) {
        return (audioContext, destination) => {
            frequencies.forEach(freq => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'triangle';
                oscillator.frequency.value = freq;
                
                gain.gain.setValueAtTime(volume / frequencies.length, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.connect(gain);
                gain.connect(destination);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            });
        };
    }
    
    generateHealingTone(frequency, duration, volume) {
        return (audioContext, destination) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const lowpass = audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            
            lowpass.type = 'lowpass';
            lowpass.frequency.value = 800;
            
            // Gentle fade in and out
            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.5);
            gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
            
            oscillator.connect(lowpass);
            lowpass.connect(gain);
            gain.connect(destination);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }
    
    generateFootstepSound() {
        return (audioContext, destination) => {
            const noise = audioContext.createBufferSource();
            const gain = audioContext.createGain();
            const highpass = audioContext.createBiquadFilter();
            
            // Create noise buffer
            const bufferSize = audioContext.sampleRate * 0.1;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            noise.buffer = buffer;
            
            highpass.type = 'highpass';
            highpass.frequency.value = 200;
            
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            noise.connect(highpass);
            highpass.connect(gain);
            gain.connect(destination);
            
            noise.start(audioContext.currentTime);
            noise.stop(audioContext.currentTime + 0.1);
        };
    }
    
    generateInteractionSound() {
        return (audioContext, destination) => {
            const frequencies = [523, 659, 784]; // C, E, G chord
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'square';
                oscillator.frequency.value = freq;
                
                const startTime = audioContext.currentTime + index * 0.05;
                gain.gain.setValueAtTime(0.05, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
                
                oscillator.connect(gain);
                gain.connect(destination);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        };
    }
    
    generateLevelUpSound() {
        return (audioContext, destination) => {
            const notes = [261, 329, 392, 523]; // C major arpeggio
            notes.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'triangle';
                oscillator.frequency.value = freq;
                
                const startTime = audioContext.currentTime + index * 0.2;
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
                
                oscillator.connect(gain);
                gain.connect(destination);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.8);
            });
        };
    }
    
    generateVictorySound() {
        return (audioContext, destination) => {
            // Triumphant chord progression
            const chords = [
                [261, 329, 392], // C major
                [293, 369, 440], // D major
                [392, 493, 587]  // G major
            ];
            
            chords.forEach((chord, chordIndex) => {
                chord.forEach(freq => {
                    const oscillator = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.value = freq;
                    
                    const startTime = audioContext.currentTime + chordIndex * 0.5;
                    gain.gain.setValueAtTime(0.1, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1);
                    
                    oscillator.connect(gain);
                    gain.connect(destination);
                    
                    oscillator.start(startTime);
                    oscillator.stop(startTime + 1);
                });
            });
        };
    }
    
    generateWindSound() {
        return (audioContext, destination) => {
            const noise = audioContext.createBufferSource();
            const gain = audioContext.createGain();
            const lowpass = audioContext.createBiquadFilter();
            
            // Create longer noise buffer for wind
            const bufferSize = audioContext.sampleRate * 10; // 10 seconds
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.5;
            }
            
            noise.buffer = buffer;
            noise.loop = true;
            
            lowpass.type = 'lowpass';
            lowpass.frequency.value = 500;
            
            gain.gain.value = 0.05;
            
            noise.connect(lowpass);
            lowpass.connect(gain);
            gain.connect(destination);
            
            return { source: noise, gain }; // Return for control
        };
    }
    
    generateWaterSound() {
        return (audioContext, destination) => {
            const noise = audioContext.createBufferSource();
            const gain = audioContext.createGain();
            const bandpass = audioContext.createBiquadFilter();
            
            const bufferSize = audioContext.sampleRate * 8;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            
            noise.buffer = buffer;
            noise.loop = true;
            
            bandpass.type = 'bandpass';
            bandpass.frequency.value = 1000;
            bandpass.Q.value = 1;
            
            gain.gain.value = 0.08;
            
            noise.connect(bandpass);
            bandpass.connect(gain);
            gain.connect(destination);
            
            return { source: noise, gain };
        };
    }
    
    generateBirdSounds() {
        return (audioContext, destination) => {
            // Generate multiple bird chirps
            const birdCount = 3;
            const sources = [];
            
            for (let bird = 0; bird < birdCount; bird++) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                oscillator.type = 'sine';
                
                // Random chirp pattern
                const baseFreq = 800 + bird * 200;
                oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
                
                // Create chirp pattern
                const chirpInterval = 2 + Math.random() * 3; // 2-5 seconds between chirps
                const chirpDuration = 0.1 + Math.random() * 0.2; // 0.1-0.3 second chirps
                
                gain.gain.value = 0;
                
                const scheduleChirp = (time) => {
                    const freq1 = baseFreq + Math.random() * 400;
                    const freq2 = freq1 + 100 + Math.random() * 200;
                    
                    oscillator.frequency.setValueAtTime(freq1, time);
                    oscillator.frequency.linearRampToValueAtTime(freq2, time + chirpDuration / 2);
                    oscillator.frequency.linearRampToValueAtTime(freq1, time + chirpDuration);
                    
                    gain.gain.setValueAtTime(0, time);
                    gain.gain.linearRampToValueAtTime(0.02, time + 0.01);
                    gain.gain.linearRampToValueAtTime(0, time + chirpDuration);
                };
                
                // Schedule initial chirps
                for (let i = 0; i < 5; i++) {
                    scheduleChirp(audioContext.currentTime + i * chirpInterval + Math.random());
                }
                
                oscillator.connect(gain);
                gain.connect(destination);
                
                sources.push({ source: oscillator, gain });
            }
            
            return sources;
        };
    }
    
    setupEventListeners() {
        // Handle user interaction to enable audio
        const enableAudio = async () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
        
        document.addEventListener('click', enableAudio);
        document.addEventListener('keydown', enableAudio);
    }
    
    update(deltaTime) {
        if (!this.isInitialized || !this.isEnabled) return;
        
        // Update based on game state and context
        this.updateContextualAudio();
        
        // Clean up finished sounds
        this.cleanupFinishedSounds();
    }
    
    updateContextualAudio() {
        const gameState = this.gameEngine.getGameState();
        const player = this.gameEngine.getPlayer();
        const world = this.gameEngine.getWorld();
        
        // Start appropriate background music
        if (gameState === 'playing' && !this.currentMusic) {
            this.playMusic('peaceful_background');
        }
        
        // Update ambient sounds based on location
        if (player && world) {
            const location = world.getLocationAt(player.x, player.y);
            this.updateAmbientForLocation(location);
        }
    }
    
    updateAmbientForLocation(location) {
        let targetAmbient = null;
        
        if (location) {
            switch (location.type) {
                case 'water':
                    targetAmbient = 'water';
                    break;
                case 'mountain':
                    targetAmbient = 'wind';
                    break;
                default:
                    targetAmbient = 'birds';
                    break;
            }
        } else {
            targetAmbient = 'birds'; // Default outdoor ambient
        }
        
        if (targetAmbient !== this.currentAmbient) {
            this.stopAmbient();
            this.playAmbient(targetAmbient);
        }
    }
    
    cleanupFinishedSounds() {
        // Remove finished sounds from active set
        this.activeSounds.forEach(sound => {
            if (sound.finished) {
                this.activeSounds.delete(sound);
            }
        });
    }
    
    // Public API methods
    playSound(soundName, volume = 1) {
        if (!this.isEnabled || !this.audioContext) return;
        
        const soundDef = this.soundEffects.get(soundName);
        if (!soundDef) {
            console.warn(`Sound effect '${soundName}' not found`);
            return;
        }
        
        try {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = volume * this.sfxVolume;
            gainNode.connect(this.masterGain);
            
            const playFunction = soundDef.generate();
            playFunction(this.audioContext, gainNode);
            
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    playMusic(musicName, fadeIn = true) {
        if (!this.isEnabled || !this.audioContext) return;
        
        // Stop current music
        this.stopMusic();
        
        const musicDef = this.music.get(musicName);
        if (!musicDef) {
            console.warn(`Music '${musicName}' not found`);
            return;
        }
        
        try {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = fadeIn ? 0 : this.musicVolume;
            gainNode.connect(this.masterGain);
            
            if (fadeIn) {
                gainNode.gain.linearRampToValueAtTime(this.musicVolume, this.audioContext.currentTime + 2);
            }
            
            // Play the procedural music
            this.playProceduralMusic(musicDef, gainNode);
            
            this.currentMusic = { name: musicName, gainNode };
            
        } catch (error) {
            console.error('Error playing music:', error);
        }
    }
    
    playProceduralMusic(musicDef, destination) {
        if (musicDef.type === 'procedural') {
            musicDef.data.forEach(note => {
                const oscillator = this.audioContext.createOscillator();
                const noteGain = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = note.frequency;
                
                const startTime = this.audioContext.currentTime + note.startTime;
                noteGain.gain.setValueAtTime(0, startTime);
                noteGain.gain.linearRampToValueAtTime(note.volume, startTime + 0.1);
                noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);
                
                oscillator.connect(noteGain);
                noteGain.connect(destination);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + note.duration);
            });
            
            // Schedule loop if needed
            if (musicDef.loop) {
                setTimeout(() => {
                    if (this.currentMusic && this.currentMusic.name === musicDef.name) {
                        this.playProceduralMusic(musicDef, destination);
                    }
                }, musicDef.duration * 1000);
            }
        }
    }
    
    stopMusic(fadeOut = true) {
        if (this.currentMusic) {
            if (fadeOut && this.currentMusic.gainNode) {
                this.currentMusic.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
            }
            this.currentMusic = null;
        }
    }
    
    playAmbient(ambientName) {
        if (!this.isEnabled || !this.audioContext) return;
        
        const ambientDef = this.ambientSounds.get(ambientName);
        if (!ambientDef) return;
        
        try {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.3; // Ambient sounds are quieter
            gainNode.connect(this.masterGain);
            
            const playFunction = ambientDef.generate();
            const ambientControl = playFunction(this.audioContext, gainNode);
            
            if (ambientControl) {
                if (Array.isArray(ambientControl)) {
                    ambientControl.forEach(control => {
                        if (control.source) control.source.start();
                    });
                } else if (ambientControl.source) {
                    ambientControl.source.start();
                }
            }
            
            this.currentAmbient = ambientName;
            
        } catch (error) {
            console.error('Error playing ambient sound:', error);
        }
    }
    
    stopAmbient() {
        this.currentAmbient = null;
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        if (!this.isEnabled) {
            this.stopMusic(false);
            this.stopAmbient();
        }
        return this.isEnabled;
    }
}