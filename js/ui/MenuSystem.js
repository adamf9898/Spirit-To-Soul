/**
 * Menu System for Spirit-To-Soul
 * Handles menu navigation and screen transitions
 */

class MenuSystem {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.gameEngine = uiManager.gameEngine;
        
        // Menu state
        this.currentMenu = null;
        this.menuHistory = [];
        
        this.initialize();
    }
    
    initialize() {
        this.setupMenuAnimations();
        console.log('Menu System initialized');
    }
    
    setupMenuAnimations() {
        // Add CSS for smooth menu transitions
        if (!document.getElementById('menu-animations')) {
            const style = document.createElement('style');
            style.id = 'menu-animations';
            style.textContent = `
                .menu-transition {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                .menu-slide-in {
                    animation: slideInFromRight 0.3s ease;
                }
                
                .menu-slide-out {
                    animation: slideOutToLeft 0.3s ease;
                }
                
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideOutToLeft {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    showMenu(menuId, animation = 'fade') {
        if (this.currentMenu) {
            this.menuHistory.push(this.currentMenu);
        }
        
        this.currentMenu = menuId;
        
        // Hide all menus first
        this.hideAllMenus();
        
        // Show target menu with animation
        const menuElement = document.getElementById(menuId);
        if (menuElement) {
            menuElement.classList.remove('hidden');
            
            if (animation === 'slide') {
                menuElement.classList.add('menu-slide-in');
                setTimeout(() => {
                    menuElement.classList.remove('menu-slide-in');
                }, 300);
            }
        }
    }
    
    hideMenu(menuId, animation = 'fade') {
        const menuElement = document.getElementById(menuId);
        if (menuElement) {
            if (animation === 'slide') {
                menuElement.classList.add('menu-slide-out');
                setTimeout(() => {
                    menuElement.classList.add('hidden');
                    menuElement.classList.remove('menu-slide-out');
                }, 300);
            } else {
                menuElement.classList.add('hidden');
            }
        }
    }
    
    hideAllMenus() {
        const menus = ['main-menu', 'character-creation', 'settings-menu', 'scripture-modal'];
        menus.forEach(menuId => {
            const element = document.getElementById(menuId);
            if (element) {
                element.classList.add('hidden');
            }
        });
    }
    
    goBack() {
        if (this.menuHistory.length > 0) {
            const previousMenu = this.menuHistory.pop();
            this.showMenu(previousMenu, 'slide');
        }
    }
    
    closeAllMenus() {
        this.hideAllMenus();
        this.currentMenu = null;
        this.menuHistory = [];
    }
}