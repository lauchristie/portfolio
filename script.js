// ASCII logo will be handled by ascii-logo.js
// This is just a fallback static version

const fallbackASCII = `
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

// 3D ASCII Logo functionality
function initASCIILogo() {
    console.log('Initializing ASCII Logo');
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded');
        useFallbackASCII();
        return;
    }
    console.log('THREE.js loaded:', THREE.REVISION);
    
    // Check if AsciiEffect is available
    if (typeof THREE.AsciiEffect === 'undefined') {
        console.error('AsciiEffect not loaded - using fallback');
        useFallbackASCII();
        return;
    }
    console.log('AsciiEffect loaded');
    
    // Try to create the 3D ASCII logo
    try {
        createASCIILogo();
    } catch (error) {
        console.error('Error creating ASCII logo:', error);
        useFallbackASCII();
    }
}

function useFallbackASCII() {
    console.log('Using fallback ASCII');
    const logoContainer = document.getElementById('ascii-logo-container');
    if (logoContainer) {
        logoContainer.innerHTML = `
            <pre id="ascii-logo" style="color: #00ff41; font-size: 8px; line-height: 1;">
██      █████  ██    ██ 
██     ██   ██ ██    ██ 
██     ███████ ██    ██ 
██     ██   ██ ██    ██ 
█████████   ██  ██████  
            </pre>
        `;
    }
}

function createASCIILogo() {
    console.log('Creating 3D ASCII logo');
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 2000);
    camera.position.set(5, 5, 10);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // ASCII Effect
    const characters = ' .:-+*=%@#';
    const effect = new THREE.AsciiEffect(renderer, characters, { 
        invert: true, 
        resolution: 0.15 
    });
    
    effect.setSize(400, 200);
    effect.domElement.style.color = '#00ff41';
    effect.domElement.style.backgroundColor = 'transparent';
    effect.domElement.style.fontSize = '6px';
    effect.domElement.style.lineHeight = '6px';
    
    // Add to page
    const logoContainer = document.getElementById('ascii-logo-container');
    if (logoContainer) {
        logoContainer.innerHTML = '';
        logoContainer.appendChild(effect.domElement);
        console.log('ASCII effect added to page');
    }
    
    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    // Create simple "LAU" geometry
    const group = new THREE.Group();
    
    // L
    const lGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const lMesh = new THREE.Mesh(lGeometry, new THREE.MeshLambertMaterial());
    lMesh.position.set(-2, 0, 0);
    group.add(lMesh);
    
    // A 
    const aGeometry = new THREE.ConeGeometry(0.7, 3, 3);
    const aMesh = new THREE.Mesh(aGeometry, new THREE.MeshLambertMaterial());
    aMesh.position.set(0, 0, 0);
    group.add(aMesh);
    
    // U
    const uGeometry = new THREE.TorusGeometry(0.8, 0.3, 8, 16, Math.PI);
    const uMesh = new THREE.Mesh(uGeometry, new THREE.MeshLambertMaterial());
    uMesh.position.set(2, 0, 0);
    uMesh.rotation.z = Math.PI;
    group.add(uMesh);
    
    scene.add(group);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate on Z-axis only
        group.rotation.z += 0.02;
        
        effect.render(scene, camera);
    }
    
    console.log('Starting 3D animation');
    animate();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page');
    
    // Try 3D ASCII logo first, fallback to static
    setTimeout(() => {
        initASCIILogo();
    }, 100);
    
    // Fallback ASCII logo if 3D version doesn't load
    const logoElement = document.getElementById('ascii-logo');
    if (logoElement && !logoElement.textContent.trim()) {
        logoElement.textContent = fallbackASCII;
    }
    
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
            console.log(`Navigating to: ${section}`);
        });
    });
});

// Optional: Add some dynamic effects
function addMatrixRain() {
    // Matrix-style rain effect (optional enhancement)
    // You can implement this later for extra visual flair
}
