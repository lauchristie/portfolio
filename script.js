// ASCII logo will be handled by ascii-logo.js
// This is just a fallback static version

const fallbackASCII = `
 ________  ___  ___  ________  ___  ________  _________  ___  _______           ___       ________  ___  ___     
|\   ____\|\  \|\  \|\   __  \|\  \|\   ____\|\___   ___\\  \|\  ___ \         |\  \     |\   __  \|\  \|\  \    
\ \  \___|\ \  \\\  \ \  \|\  \ \  \ \  \___|\|___ \  \_\ \  \ \   __/|        \ \  \    \ \  \|\  \ \  \\\  \   
 \ \  \    \ \   __  \ \   _  _\ \  \ \_____  \   \ \  \ \ \  \ \  \_|/__       \ \  \    \ \   __  \ \  \\\  \  
  \ \  \____\ \  \ \  \ \  \\  \\ \  \|____|\  \   \ \  \ \ \  \ \  \_|\ \       \ \  \____\ \  \ \  \ \  \\\  \ 
   \ \_______\ \__\ \__\ \__\\ _\\ \__\____\_\  \   \ \__\ \ \__\ \_______\       \ \_______\ \__\ \__\ \_______\
    \|_______|\|__|\|__|\|__|\|__|\|__|\_________\   \|__|  \|__|\|_______|        \|_______|\|__|\|__|\|_______|
                                      \|_________|                                                               
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
    
    // Use full container dimensions like the original
    const containerWidth = 600;
    const containerHeight = 300;
    
    // Camera setup matching original proportions
    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 2000);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // ASCII Effect using original parameters
    const characters = ' .:-+*=%@#';
    const effect = new THREE.AsciiEffect(renderer, characters, { 
        invert: true, 
        resolution: 0.205 // Using original resolution setting
    });
    
    effect.setSize(containerWidth, containerHeight);
    effect.domElement.style.color = '#00ff41';
    effect.domElement.style.backgroundColor = 'transparent';
    
    // Add to page
    const logoContainer = document.getElementById('ascii-logo-container');
    if (logoContainer) {
        logoContainer.innerHTML = '';
        logoContainer.appendChild(effect.domElement);
        console.log('ASCII effect added to page');
    }
    
    // Lighting setup matching original
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight.position.set(100, 100, 400);
    scene.add(pointLight);
    
    // Create "LAU" geometry
    const group = new THREE.Group();
    
    // Material matching original
    const material = new THREE.MeshStandardMaterial();
    material.flatShading = true;
    material.side = THREE.DoubleSide;
    
    // L
    const lGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const lMesh = new THREE.Mesh(lGeometry, material);
    lMesh.position.set(-2, 0, 0);
    group.add(lMesh);
    
    // A 
    const aGeometry = new THREE.ConeGeometry(0.7, 3, 4);
    const aMesh = new THREE.Mesh(aGeometry, material);
    aMesh.position.set(0, 0, 0);
    group.add(aMesh);
    
    // U
    const uGeometry = new THREE.TorusGeometry(0.8, 0.3, 8, 16, Math.PI);
    const uMesh = new THREE.Mesh(uGeometry, material);
    uMesh.position.set(2, 0, 0);
    uMesh.rotation.z = Math.PI;
    group.add(uMesh);
    
    // Center the group and compute bounding box like original
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center); // Center the geometry
    
    scene.add(group);
    
    // Calculate bounding box for camera positioning (like original)
    const bbox = box;
    const size = bbox.getSize(new THREE.Vector3());
    
    // Position camera based on bounding box (original approach)
    camera.position.x = size.x * 2;
    camera.position.y = size.y * 1;
    camera.position.z = size.z * 4;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate on Z-axis only
        group.rotation.z += 0.01; // Using original rotation speed
        
        effect.render(scene, camera);
    }
    
    console.log('Starting 3D animation with original parameters');
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
