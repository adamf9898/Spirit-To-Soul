/**
 * Input System for Spirit-To-Soul
 * Handles keyboard, mouse, and touch input for the biblical RPG
 */

class InputSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        
        // Input state
        this.keys = new Set();
        this.keysPressed = new Set();
        this.keysReleased = new Set();
        
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            buttons: new Set(),
            buttonsPressed: new Set(),
            buttonsReleased: new Set()
        };
        
        this.touch = {
            touches: new Map(),
            gestureScale: 1,
            gestureRotation: 0
        };
        
        // Input bindings
        this.keyBindings = {
            // Movement
            'KeyW': 'move_up',
            'KeyS': 'move_down',
            'KeyA': 'move_left',
            'KeyD': 'move_right',
            'ArrowUp': 'move_up',
            'ArrowDown': 'move_down',
            'ArrowLeft': 'move_left',
            'ArrowRight': 'move_right',
            
            // Actions
            'KeyE': 'interact',
            'Space': 'action',
            'Enter': 'chat',
            'Escape': 'menu',
            'Tab': 'toggle_quest',
            
            // Abilities
            'Digit1': 'ability_1',
            'Digit2': 'ability_2',
            'Digit3': 'ability_3',
            'Digit4': 'ability_4',
            
            // UI
            'KeyI': 'inventory',
            'KeyM': 'map',
            'KeyH': 'help',
            'KeyP': 'prayer'
        };
        
        this.initialize();
    }
    
    initialize() {
        this.setupEventListeners();
        console.log('Input System initialized');
    }
    
    setupEventListeners() {
        const canvas = this.gameEngine.getCanvas();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('wheel', (e) => this.handleMouseWheel(e));
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        canvas.addEventListener('touchcancel', (e) => this.handleTouchCancel(e));
        
        // Gesture events
        canvas.addEventListener('gesturestart', (e) => this.handleGestureStart(e));
        canvas.addEventListener('gesturechange', (e) => this.handleGestureChange(e));
        canvas.addEventListener('gestureend', (e) => this.handleGestureEnd(e));
        
        // Prevent default behaviors
        document.addEventListener('keydown', (e) => {
            if (e.code in this.keyBindings) {
                e.preventDefault();
            }
        });
        
        canvas.addEventListener('touchstart', (e) => e.preventDefault());
        canvas.addEventListener('touchmove', (e) => e.preventDefault());
    }
    
    update(deltaTime) {
        // Process input based on game state
        const gameState = this.gameEngine.getGameState();
        
        switch (gameState) {
            case 'playing':
                this.processGameplayInput(deltaTime);
                break;
            case 'menu':
            case 'character_creation':
                this.processMenuInput(deltaTime);
                break;
            case 'paused':
                this.processPausedInput(deltaTime);
                break;
        }
        
        // Clear frame-specific input states
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouse.buttonsPressed.clear();
        this.mouse.buttonsReleased.clear();
    }
    
    processGameplayInput(deltaTime) {
        const player = this.gameEngine.getPlayer();
        if (!player) return;
        
        // Movement input
        this.processMovementInput(player, deltaTime);
        
        // Action input
        this.processActionInput(player);
        
        // Ability input
        this.processAbilityInput(player);
        
        // UI input
        this.processUIInput();
        
        // Mouse input for world interaction
        this.processMouseInput(player);
    }
    
    processMovementInput(player, deltaTime) {
        let moveX = 0;
        let moveY = 0;
        const moveSpeed = 100; // pixels per second
        
        // Keyboard movement
        if (this.isActionActive('move_up')) moveY -= 1;
        if (this.isActionActive('move_down')) moveY += 1;
        if (this.isActionActive('move_left')) moveX -= 1;
        if (this.isActionActive('move_right')) moveX += 1;
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707; // 1/sqrt(2)
            moveY *= 0.707;
        }
        
        // Apply movement
        if (moveX !== 0 || moveY !== 0) {
            const newX = player.x + moveX * moveSpeed * deltaTime;
            const newY = player.y + moveY * moveSpeed * deltaTime;
            player.moveTo(newX, newY);
        }
    }
    
    processActionInput(player) {
        // Interaction
        if (this.wasActionPressed('interact')) {
            player.interact();
        }
        
        // General action (context-sensitive)
        if (this.wasActionPressed('action')) {
            // In gameplay, this could be context-sensitive
            if (player.nearbyEntities.length > 0) {
                player.interact();
            } else {
                player.usePrayer(); // Default action is prayer
            }
        }
        
        // Prayer hotkey
        if (this.wasActionPressed('prayer')) {
            player.usePrayer();
        }
    }
    
    processAbilityInput(player) {
        if (this.wasActionPressed('ability_1')) {
            player.useAbility('prayer');
        }
        if (this.wasActionPressed('ability_2')) {
            player.useAbility('blessing');
        }
        if (this.wasActionPressed('ability_3')) {
            player.useAbility('scripture_recite');
        }
        if (this.wasActionPressed('ability_4')) {
            player.useAbility('healing_touch');
        }
    }
    
    processUIInput() {
        // Toggle quest panel
        if (this.wasActionPressed('toggle_quest')) {
            this.toggleQuestPanel();
        }
        
        // Open chat
        if (this.wasActionPressed('chat')) {
            this.focusChatInput();
        }
        
        // Menu
        if (this.wasActionPressed('menu')) {
            this.gameEngine.pause();
        }
        
        // Other UI toggles
        if (this.wasActionPressed('inventory')) {
            this.toggleInventory();
        }
        
        if (this.wasActionPressed('map')) {
            this.toggleMap();
        }
        
        if (this.wasActionPressed('help')) {
            this.showHelp();
        }
    }
    
    processMouseInput(player) {
        // Right-click to move (classic RPG style)
        if (this.mouse.buttonsPressed.has(2)) { // Right mouse button
            const world = this.gameEngine.getWorld();
            if (world) {
                const camera = world.getCamera();
                const worldX = this.mouse.x + camera.x;
                const worldY = this.mouse.y + camera.y;
                
                if (world.isValidPosition(worldX, worldY)) {
                    player.moveTo(worldX, worldY);
                }
            }
        }
        
        // Left-click for interaction
        if (this.mouse.buttonsPressed.has(0)) { // Left mouse button
            this.handleWorldClick(player);
        }
    }
    
    handleWorldClick(player) {
        const world = this.gameEngine.getWorld();
        if (!world) return;
        
        const camera = world.getCamera();
        const worldX = this.mouse.x + camera.x;
        const worldY = this.mouse.y + camera.y;
        
        // Check for entities at click position
        const entities = world.getEntitiesAt(worldX, worldY, 30);
        if (entities.length > 0) {
            const entity = entities[0];
            if (entity.interact) {
                entity.interact(player);
            }
        }
    }
    
    processMenuInput(deltaTime) {
        // Menu navigation would be handled here
        // For now, most menu interaction is handled by HTML/CSS
    }
    
    processPausedInput(deltaTime) {
        // Resume game
        if (this.wasActionPressed('action') || this.wasActionPressed('menu')) {
            this.gameEngine.resume();
        }
    }
    
    // Event handlers
    handleKeyDown(event) {
        this.keys.add(event.code);
        
        if (!this.keysPressed.has(event.code)) {
            this.keysPressed.add(event.code);
        }
    }
    
    handleKeyUp(event) {
        this.keys.delete(event.code);
        this.keysReleased.add(event.code);
    }
    
    handleMouseDown(event) {
        this.updateMousePosition(event);
        this.mouse.buttons.add(event.button);
        this.mouse.buttonsPressed.add(event.button);
    }
    
    handleMouseUp(event) {
        this.updateMousePosition(event);
        this.mouse.buttons.delete(event.button);
        this.mouse.buttonsReleased.add(event.button);
    }
    
    handleMouseMove(event) {
        this.updateMousePosition(event);
    }
    
    handleMouseWheel(event) {
        // Could be used for zooming or UI scrolling
        event.preventDefault();
    }
    
    updateMousePosition(event) {
        const canvas = this.gameEngine.getCanvas();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        this.mouse.x = (event.clientX - rect.left) * scaleX;
        this.mouse.y = (event.clientY - rect.top) * scaleY;
        
        // Update world coordinates
        const world = this.gameEngine.getWorld();
        if (world) {
            const camera = world.getCamera();
            this.mouse.worldX = this.mouse.x + camera.x;
            this.mouse.worldY = this.mouse.y + camera.y;
        }
    }
    
    // Touch event handlers
    handleTouchStart(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            this.touch.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                startX: touch.clientX,
                startY: touch.clientY,
                startTime: Date.now()
            });
        }
        
        // Handle single touch as mouse click
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.updateMousePositionFromTouch(touch);
            this.mouse.buttonsPressed.add(0);
        }
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            const touchData = this.touch.touches.get(touch.identifier);
            if (touchData) {
                // Handle tap gesture
                const duration = Date.now() - touchData.startTime;
                const distance = Math.sqrt(
                    Math.pow(touch.clientX - touchData.startX, 2) +
                    Math.pow(touch.clientY - touchData.startY, 2)
                );
                
                if (duration < 500 && distance < 20) {
                    // It's a tap
                    this.handleTap(touch);
                }
                
                this.touch.touches.delete(touch.identifier);
            }
        }
        
        // Release mouse button for single touch
        if (event.touches.length === 0) {
            this.mouse.buttonsReleased.add(0);
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            const touchData = this.touch.touches.get(touch.identifier);
            if (touchData) {
                touchData.x = touch.clientX;
                touchData.y = touch.clientY;
            }
        }
        
        // Update mouse position for single touch
        if (event.touches.length === 1) {
            this.updateMousePositionFromTouch(event.touches[0]);
        }
    }
    
    handleTouchCancel(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            this.touch.touches.delete(touch.identifier);
        }
    }
    
    updateMousePositionFromTouch(touch) {
        const canvas = this.gameEngine.getCanvas();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        this.mouse.x = (touch.clientX - rect.left) * scaleX;
        this.mouse.y = (touch.clientY - rect.top) * scaleY;
    }
    
    handleTap(touch) {
        // Convert to world coordinates and handle as click
        const player = this.gameEngine.getPlayer();
        if (player && this.gameEngine.getGameState() === 'playing') {
            this.handleWorldClick(player);
        }
    }
    
    // Gesture handlers
    handleGestureStart(event) {
        event.preventDefault();
        this.touch.gestureScale = event.scale;
        this.touch.gestureRotation = event.rotation;
    }
    
    handleGestureChange(event) {
        event.preventDefault();
        // Could be used for pinch-to-zoom
        this.touch.gestureScale = event.scale;
        this.touch.gestureRotation = event.rotation;
    }
    
    handleGestureEnd(event) {
        event.preventDefault();
    }
    
    // Utility methods
    isActionActive(action) {
        return this.getKeysForAction(action).some(key => this.keys.has(key));
    }
    
    wasActionPressed(action) {
        return this.getKeysForAction(action).some(key => this.keysPressed.has(key));
    }
    
    wasActionReleased(action) {
        return this.getKeysForAction(action).some(key => this.keysReleased.has(key));
    }
    
    getKeysForAction(action) {
        return Object.keys(this.keyBindings).filter(key => this.keyBindings[key] === action);
    }
    
    // UI helper methods
    toggleQuestPanel() {
        const questPanel = document.getElementById('quest-panel');
        if (questPanel) {
            questPanel.style.display = questPanel.style.display === 'none' ? 'flex' : 'none';
        }
    }
    
    focusChatInput() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    }
    
    toggleInventory() {
        // Placeholder for inventory system
        console.log('Toggle inventory');
    }
    
    toggleMap() {
        // Placeholder for full map view
        console.log('Toggle map');
    }
    
    showHelp() {
        // Show help/controls modal
        console.log('Show help');
        alert('Controls:\\nWASD/Arrow Keys: Move\\nE: Interact\\nSpace: Action/Prayer\\n1-4: Use Abilities\\nTab: Toggle Quest\\nEnter: Chat\\nEsc: Menu');
    }
    
    // Mobile control setup
    setupMobileControls() {
        // Set up mobile D-pad and action buttons
        const dpadButtons = document.querySelectorAll('.dpad-btn');
        const actionButtons = document.querySelectorAll('.action-btn');
        
        dpadButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const direction = button.dataset.direction;
                this.handleMobileMovement(direction, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                const direction = button.dataset.direction;
                this.handleMobileMovement(direction, false);
            });
        });
        
        actionButtons.forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleMobileAction(button.classList[1]); // action-btn class name
            });
        });
    }
    
    handleMobileMovement(direction, pressed) {
        const actionMap = {
            'up': 'move_up',
            'down': 'move_down',
            'left': 'move_left',
            'right': 'move_right'
        };
        
        const action = actionMap[direction];
        if (action) {
            // Simulate key press/release
            const keyCode = this.getKeysForAction(action)[0];
            if (keyCode) {
                if (pressed) {
                    this.keys.add(keyCode);
                } else {
                    this.keys.delete(keyCode);
                }
            }
        }
    }
    
    handleMobileAction(action) {
        switch (action) {
            case 'interact':
                this.keysPressed.add('KeyE');
                break;
            case 'menu':
                this.keysPressed.add('Escape');
                break;
        }
    }
}

// Auto-setup mobile controls when screen is small
if (window.innerWidth <= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        const mobileControls = document.querySelector('.mobile-controls');
        if (mobileControls) {
            mobileControls.style.display = 'flex';
        }
    });
}