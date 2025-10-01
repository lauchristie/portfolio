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
    console.log('Creating 3D ASCII logo with exported values');
    
    // Exported values from debug session - for STL file
    const stlValues = {
        camera: { x: 0, y: 0, z: 45 },
        scale: 0.7,
        rotation: { x: -95, y: 0, z: 44 },
        position: { x: 0, y: 0, z: -2 },
        light: { angle: 65, distance: 49, height: -1 }
    };
    
    // Fallback values for simple geometry (matching original resetPositions)
    const fallbackValues = {
        camera: { x: 5, y: 3, z: 8 },
        scale: 1,
        rotation: { x: -90, y: 0, z: 0 },
        position: { x: 0, y: 0, z: 0 },
        light: { angle: 45, distance: 10, height: 10 }
    };
    
    // Will be set based on whether STL loads or fallback is used
    let exportedValues = stlValues;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Fixed dimensions for consistent rendering
    const containerWidth = 800;
    const containerHeight = 400;
    
    // Camera setup with exported values
    const camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 2000);
    camera.position.set(exportedValues.camera.x, exportedValues.camera.y, exportedValues.camera.z);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // ASCII Effect
    const characters = ' .:-+*=%@#';
    const effect = new THREE.AsciiEffect(renderer, characters, { 
        invert: true, 
        resolution: 0.24
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
    
    // Lighting setup with exported values
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
    const lightAngle = exportedValues.light.angle * Math.PI / 180;
    const lightDistance = exportedValues.light.distance;
    const lightHeight = exportedValues.light.height;
    
    pointLight.position.set(
        Math.cos(lightAngle) * lightDistance,
        lightHeight,
        Math.sin(lightAngle) * lightDistance
    );
    scene.add(pointLight);
    
    // Ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    // Create group for the model
    const group = new THREE.Group();
    
    // Material
    const material = new THREE.MeshStandardMaterial({
        color: 0x00ff41,
        flatShading: false,
        side: THREE.DoubleSide
    });
    
    // STL Loader - try to load LAU.stl
    const loader = new THREE.STLLoader();
    
    const paths = [
        'assets/LAU.stl',
        './assets/LAU.stl',
        '/portfolio/assets/LAU.stl',
        'LAU.stl'
    ];
    
    let pathIndex = 0;
    
    function tryLoadPath() {
        if (pathIndex >= paths.length) {
            console.warn('Could not load LAU.stl, using fallback geometry');
            createFallbackGeometry();
            return;
        }
        
        const currentPath = paths[pathIndex];
        console.log(`Attempting to load STL from: ${currentPath}`);
        
        loader.load(
            currentPath,
            function (geometry) {
                console.log('STL loaded successfully from:', currentPath);
                
                // Center the geometry
                geometry.computeBoundingBox();
                const center = new THREE.Vector3();
                geometry.boundingBox.getCenter(center);
                geometry.translate(-center.x, -center.y, -center.z);
                
                const mesh = new THREE.Mesh(geometry, material);
                group.add(mesh);
                scene.add(group);
                
                // Apply exported values
                applyExportedValues();
                
                // Start animation
                animate();
            },
            function (progress) {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    console.log(`Loading: ${percent}%`);
                }
            },
            function (error) {
                console.warn(`Failed to load from ${currentPath}:`, error);
                pathIndex++;
                tryLoadPath();
            }
        );
    }
    
    function createFallbackGeometry() {
        console.log('Creating fallback LAU geometry - using fallback values');
        
        // Switch to fallback values for simple geometry
        exportedValues = fallbackValues;
        camera.position.set(exportedValues.camera.x, exportedValues.camera.y, exportedValues.camera.z);
        
        // Update light for fallback
        const lightAngle = exportedValues.light.angle * Math.PI / 180;
        pointLight.position.set(
            Math.cos(lightAngle) * exportedValues.light.distance,
            exportedValues.light.height,
            Math.sin(lightAngle) * exportedValues.light.distance
        );
        
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
        
        scene.add(group);
        
        // Apply exported values
        applyExportedValues();
        
        // Start animation
        animate();
    }
    
    function applyExportedValues() {
        // Apply scale
        group.scale.set(exportedValues.scale, exportedValues.scale, exportedValues.scale);
        
        // Apply rotation (convert degrees to radians)
        group.rotation.set(
            exportedValues.rotation.x * Math.PI / 180,
            exportedValues.rotation.y * Math.PI / 180,
            exportedValues.rotation.z * Math.PI / 180
        );
        
        // Apply position
        group.position.set(
            exportedValues.position.x,
            exportedValues.position.y,
            exportedValues.position.z
        );
        
        console.log('Applied exported values:', exportedValues);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Slow rotation on Z-axis to keep the model dynamic
        group.rotation.z += 0.005;
        
        effect.render(scene, camera);
    }
    
    // Start loading process
    console.log('Starting STL load attempt');
    tryLoadPath();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing page');
    
    // Try 3D ASCII logo first, fallback to static
    setTimeout(() => {
        initASCIILogo();
    }, 100);
    
    // Type the initial command
    const initialCommand = document.getElementById('initial-command');
    if (initialCommand) {
        setTimeout(() => {
            typeText(initialCommand, './christie_lau', 100);
        }, 500);
    }
    
    // Add click handlers for navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            console.log(`Navigating to: ${section}`);
        });
    });
});
