// ASCII logo for Christie Lau
const asciiLogo = `
   ______ __          __     __  _         __                
  / ____// /_   ____ (_)___ / /_(_)___    / /   ____ ___  __
 / /    / __ \\ / __ \`/ / __  __/ / __ \\  / /   / __ \`/ / / /
/ /___ / / / // /_/ / / /_/ /_/ / /_/ / / /___/ /_/ / /_/ / 
\\____//_/ /_/ \\__,_/_/\\__,_/ /_/\\____/ /_____/\\__,_/\\__,_/  
`;

// Auto-typing effect
function typeText(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typing-cursor');
        }
    }
    
    element.classList.add('typing-cursor');
    type();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display ASCII logo immediately
    const logoElement = document.getElementById('ascii-logo');
    logoElement.textContent = asciiLogo;
    
    // Type the initial command
    const initialCommand = document.getElementById('initial-command');
    setTimeout(() => {
        typeText(initialCommand, './christie_lau', 100);
    }, 500);
    
    // Add click handlers for navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            // For now, just show which section was clicked
            // Later you'll create separate pages for each section
            console.log(`Navigating to: ${section}`);
            
            // You can add navigation logic here later
            // For example: window.location.href = `${section}.html`;
        });
    });
    
    // Add some interactive terminal effects
    document.addEventListener('keydown', function(e) {
        // Add terminal-like interactions if needed
        if (e.key === 'Enter') {
            // Could add command input functionality here
        }
    });
});

// Optional: Add some dynamic effects
function addMatrixRain() {
    // Matrix-style rain effect (optional enhancement)
    // You can implement this later for extra visual flair
}
