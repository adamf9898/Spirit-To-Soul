/**
 * Render System for Spirit-To-Soul
 * Handles all rendering operations for the biblical RPG
 */

class RenderSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.canvas = gameEngine.getCanvas();
        this.ctx = gameEngine.getContext();
        
        // Rendering state
        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;
        
        // Rendering layers
        this.layers = {
            background: [],
            terrain: [],
            entities: [],
            effects: [],
            ui: []
        };
        
        // Performance tracking
        this.renderStats = {
            drawCalls: 0,
            entitiesRendered: 0,
            frameTime: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        // Set up rendering context
        this.setupRenderingContext();
        
        console.log('Render System initialized');
    }
    
    setupRenderingContext() {
        // Configure canvas context for optimal rendering
        this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
        this.ctx.textBaseline = 'top';
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
    }
    
    render() {
        const startTime = performance.now();
        
        // Reset stats
        this.renderStats.drawCalls = 0;
        this.renderStats.entitiesRendered = 0;
        
        // Clear canvas
        this.clearCanvas();
        
        // Render game based on state
        const gameState = this.gameEngine.getGameState();
        
        switch (gameState) {
            case 'playing':
            case 'paused':
                this.renderGameplay();
                break;
            default:
                // Menu states are handled by HTML/CSS
                break;
        }
        
        // Update performance stats
        this.renderStats.frameTime = performance.now() - startTime;
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#2a5934'; // Biblical green landscape
        this.ctx.fillRect(0, 0, this.viewportWidth, this.viewportHeight);
        this.renderStats.drawCalls++;
    }
    
    renderGameplay() {
        const world = this.gameEngine.getWorld();
        const player = this.gameEngine.getPlayer();
        
        if (!world || !player) return;
        
        // Get camera for viewport culling
        const camera = world.getCamera();
        
        // Set up world transform
        this.ctx.save();
        this.ctx.translate(-camera.x, -camera.y);
        
        // Render world layers
        this.renderWorldBackground(world, camera);
        this.renderWorldTerrain(world, camera);
        this.renderWorldEntities(world, camera);
        this.renderWorldEffects(world, camera);
        
        // Restore transform
        this.ctx.restore();
        
        // Render UI overlay (not affected by camera)
        this.renderUIOverlay();
    }
    
    renderWorldBackground(world, camera) {
        // Render sky/background
        const gradient = this.ctx.createLinearGradient(0, camera.y, 0, camera.y + this.viewportHeight);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.7, '#98FB98'); // Pale green
        gradient.addColorStop(1, '#2a5934'); // Ground green
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(camera.x, camera.y, this.viewportWidth, this.viewportHeight);
        this.renderStats.drawCalls++;
        
        // Render distant mountains/hills for atmosphere
        this.renderDistantLandscape(camera);
    }
    
    renderDistantLandscape(camera) {
        this.ctx.fillStyle = 'rgba(139, 115, 85, 0.6)'; // Distant mountains
        
        // Simple mountain silhouette
        this.ctx.beginPath();
        const mountainY = camera.y + this.viewportHeight * 0.3;
        this.ctx.moveTo(camera.x, mountainY);
        
        for (let x = 0; x <= this.viewportWidth; x += 50) {
            const height = Math.sin((camera.x + x) * 0.01) * 30 + 50;
            this.ctx.lineTo(camera.x + x, mountainY - height);
        }
        
        this.ctx.lineTo(camera.x + this.viewportWidth, mountainY);
        this.ctx.lineTo(camera.x + this.viewportWidth, camera.y + this.viewportHeight);
        this.ctx.lineTo(camera.x, camera.y + this.viewportHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.renderStats.drawCalls++;
    }
    
    renderWorldTerrain(world, camera) {
        // Terrain is rendered by the world itself
        // This method could add additional terrain effects
        
        // Add some atmospheric particles
        this.renderAtmosphericParticles(camera);
    }
    
    renderAtmosphericParticles(camera) {
        // Render floating particles for atmosphere
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        const particleCount = 20;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < particleCount; i++) {
            const x = camera.x + (i * 127 + time * 20) % this.viewportWidth;
            const y = camera.y + (i * 241 + Math.sin(time + i) * 50) % this.viewportHeight;
            const size = 1 + Math.sin(time * 2 + i) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.renderStats.drawCalls++;
    }
    
    renderWorldEntities(world, camera) {
        // Get all entities in viewport
        const entities = world.getEntities().filter(entity => 
            this.isInViewport(entity.x, entity.y, camera, 50)
        );
        
        // Sort by Y position for depth
        entities.sort((a, b) => a.y - b.y);
        
        // Render each entity
        entities.forEach(entity => {
            this.renderEntity(entity);
            this.renderStats.entitiesRendered++;
        });
        
        // Render player last (on top)
        const player = this.gameEngine.getPlayer();
        if (player && this.isInViewport(player.x, player.y, camera, 50)) {
            this.renderPlayer(player);
            this.renderStats.entitiesRendered++;
        }
    }
    
    renderEntity(entity) {
        if (!entity.sprite) return;
        
        // Draw shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(entity.x, entity.y + 15, 8, 4, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw entity
        this.ctx.fillStyle = entity.sprite.color;
        this.ctx.fillRect(entity.x - 12, entity.y - 12, 24, 24);
        
        // Draw symbol/character
        if (entity.sprite.symbol) {
            this.ctx.font = '18px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(entity.sprite.symbol, entity.x, entity.y - 8);
        }
        
        // Draw name if nearby
        const player = this.gameEngine.getPlayer();
        if (player) {
            const distance = Math.sqrt(
                Math.pow(entity.x - player.x, 2) + Math.pow(entity.y - player.y, 2)
            );
            
            if (distance <= 100) {
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = 'bold 11px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(entity.name, entity.x, entity.y - 30);
            }
        }
        
        this.renderStats.drawCalls += 3;
    }
    
    renderPlayer(player) {
        // Draw shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(player.x, player.y + 18, 10, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw player body with calling color
        this.ctx.fillStyle = player.sprite.color;
        this.ctx.fillRect(player.x - 14, player.y - 14, 28, 28);
        
        // Draw player face
        this.ctx.fillStyle = '#FDBCB4'; // Skin tone
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y - 6, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw calling symbol
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        
        const symbols = {
            shepherd: '🐑',
            warrior: '⚔️',
            healer: '✚',
            teacher: '📖'
        };
        
        const symbol = symbols[player.calling] || symbols.shepherd;
        this.ctx.fillText(symbol, player.x, player.y - 18);
        
        // Draw player name
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(player.name, player.x, player.y - 35);
        
        // Draw movement indicator if moving
        if (player.isMoving) {
            const time = Date.now() * 0.01;
            const bobOffset = Math.sin(time) * 2;
            
            this.ctx.save();
            this.ctx.translate(0, bobOffset);
            
            // Add movement dust particles
            this.ctx.fillStyle = 'rgba(139, 115, 85, 0.5)';
            for (let i = 0; i < 3; i++) {
                const angle = (time + i * 120) * Math.PI / 180;
                const radius = 20 + i * 5;
                const dustX = player.x + Math.cos(angle) * radius;
                const dustY = player.y + Math.sin(angle) * radius * 0.5 + 10;
                
                this.ctx.beginPath();
                this.ctx.arc(dustX, dustY, 2 - i * 0.5, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
        
        // Draw interaction range if near entities
        if (player.nearbyEntities && player.nearbyEntities.length > 0) {
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.arc(player.x, player.y, player.interactionRadius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
        
        this.renderStats.drawCalls += 4;
    }
    
    renderWorldEffects(world, camera) {
        // Render any world effects like weather, magic, etc.
        this.renderAbilityEffects();
        this.renderWeatherEffects(world);
    }
    
    renderAbilityEffects() {
        // Render visual effects for abilities
        // This would be expanded with a proper effect system
        const player = this.gameEngine.getPlayer();
        if (!player) return;
        
        // Check for active ability cooldowns to show effects
        Object.keys(player.abilities).forEach(abilityName => {
            const ability = player.abilities[abilityName];
            const cooldownPercent = ability.cooldown / ability.maxCooldown;
            
            if (cooldownPercent > 0.8) { // Recently used
                this.renderAbilityGlow(player, abilityName, cooldownPercent);
            }
        });
    }
    
    renderAbilityGlow(player, abilityName, intensity) {
        const colors = {
            prayer: '#FFD700',
            blessing: '#FFFFFF',
            scripture_recite: '#4169E1',
            healing_touch: '#FF69B4'
        };
        
        const color = colors[abilityName] || '#FFFFFF';
        const alpha = intensity * 0.5;
        
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 10;
        this.ctx.strokeStyle = `rgba(${this.hexToRgb(color)}, ${alpha})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, 40, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        
        this.renderStats.drawCalls++;
    }
    
    renderWeatherEffects(world) {
        if (world.weather === 'rain') {
            const camera = world.getCamera();
            this.renderRain(camera);
        }
    }
    
    renderRain(camera) {
        this.ctx.strokeStyle = 'rgba(173, 216, 230, 0.6)';
        this.ctx.lineWidth = 1;
        
        const rainDrops = 50;
        const time = Date.now() * 0.01;
        
        for (let i = 0; i < rainDrops; i++) {
            const x = (camera.x + (i * 17 + time * 5) % this.viewportWidth);
            const y = (camera.y + (i * 23 + time * 8) % this.viewportHeight);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - 1, y + 8);
            this.ctx.stroke();
        }
        
        this.renderStats.drawCalls++;
    }
    
    renderUIOverlay() {
        // Render debug info if enabled
        if (this.gameEngine.isDebugMode()) {
            this.renderDebugInfo();
        }
        
        // Render performance stats
        this.renderPerformanceStats();
    }
    
    renderDebugInfo() {
        const player = this.gameEngine.getPlayer();
        const world = this.gameEngine.getWorld();
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 200, 120);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        let y = 25;
        this.ctx.fillText(`FPS: ${this.gameEngine.fps}`, 15, y); y += 15;
        this.ctx.fillText(`Delta: ${this.gameEngine.deltaTime.toFixed(3)}s`, 15, y); y += 15;
        this.ctx.fillText(`State: ${this.gameEngine.getGameState()}`, 15, y); y += 15;
        
        if (player) {
            this.ctx.fillText(`Player: ${Math.round(player.x)}, ${Math.round(player.y)}`, 15, y); y += 15;
            this.ctx.fillText(`Health: ${Math.round(player.health.current)}`, 15, y); y += 15;
            this.ctx.fillText(`Faith: ${Math.round(player.faith.current)}`, 15, y); y += 15;
        }
        
        if (world) {
            const camera = world.getCamera();
            this.ctx.fillText(`Camera: ${Math.round(camera.x)}, ${Math.round(camera.y)}`, 15, y); y += 15;
        }
        
        this.renderStats.drawCalls++;
    }
    
    renderPerformanceStats() {
        if (!this.gameEngine.isDebugMode()) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(this.viewportWidth - 150, 10, 140, 80);
        
        this.ctx.fillStyle = '#90EE90';
        this.ctx.font = '11px monospace';
        this.ctx.textAlign = 'left';
        
        let y = 25;
        this.ctx.fillText(`Draw Calls: ${this.renderStats.drawCalls}`, this.viewportWidth - 145, y); y += 12;
        this.ctx.fillText(`Entities: ${this.renderStats.entitiesRendered}`, this.viewportWidth - 145, y); y += 12;
        this.ctx.fillText(`Render: ${this.renderStats.frameTime.toFixed(2)}ms`, this.viewportWidth - 145, y); y += 12;
        
        // Render time graph
        const maxTime = 16.67; // 60 FPS target
        const graphWidth = 120;
        const graphHeight = 20;
        const graphX = this.viewportWidth - 135;
        const graphY = y + 5;
        
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(graphX, graphY, graphWidth, graphHeight);
        
        const fillWidth = Math.min(graphWidth, (this.renderStats.frameTime / maxTime) * graphWidth);
        const fillColor = this.renderStats.frameTime > maxTime ? '#FF0000' : '#00FF00';
        
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(graphX + 1, graphY + 1, fillWidth - 1, graphHeight - 2);
        
        this.renderStats.drawCalls += 3;
    }
    
    // Utility methods
    isInViewport(x, y, camera, margin = 0) {
        return x + margin >= camera.x && 
               x - margin <= camera.x + this.viewportWidth &&
               y + margin >= camera.y && 
               y - margin <= camera.y + this.viewportHeight;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '255, 255, 255';
    }
    
    // Viewport and camera methods
    updateViewport() {
        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;
    }
    
    worldToScreen(worldX, worldY) {
        const world = this.gameEngine.getWorld();
        if (!world) return { x: worldX, y: worldY };
        
        const camera = world.getCamera();
        return {
            x: worldX - camera.x,
            y: worldY - camera.y
        };
    }
    
    screenToWorld(screenX, screenY) {
        const world = this.gameEngine.getWorld();
        if (!world) return { x: screenX, y: screenY };
        
        const camera = world.getCamera();
        return {
            x: screenX + camera.x,
            y: screenY + camera.y
        };
    }
}