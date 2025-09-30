/*
 * 3D ASCII Logo functionality adapted from:
 * STL-to-ASCII-Generator by AndrewSink
 * https://github.com/AndrewSink/STL-to-ASCII-Generator
 * MIT License
 */

class ASCIILogo {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.asciiElement = document.getElementById('ascii-logo');
        this.canvas = document.getElementById('ascii-canvas');
        
        // ASCII conversion settings
        this.chars = ' .,:;ox%#@';
        this.width = 80;
        this.height = 40;
        
        this.init();
    }
    
    init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true 
        });
        
        this.renderer.setSize(this.width * 8, this.height * 8);
        this.renderer.setClearColor(0x000000);
        
        // Position camera
        this.camera.position.z = 5;
        
        // Add lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Load your LAU.stl file (you'll need to upload this)
        this.loadModel();
        
        // Start animation
        this.animate();
    }
    
    loadModel() {
        // For now, create a simple text geometry as placeholder
        // Replace this with STL loader when you upload your model
        const loader = new THREE.FontLoader();
        
        // Fallback: create simple box geometry with "LAU" concept
        const geometry = new THREE.BoxGeometry(2, 1, 0.5);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff41 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // TODO: Replace with STL loader
        // const stlLoader = new THREE.STLLoader();
        // stlLoader.load('assets/lau-logo.stl', (geometry) => {
        //     const material = new THREE.MeshLambertMaterial({ color: 0x00ff41 });
        //     this.mesh = new THREE.Mesh(geometry, material);
        //     this.scene.add(this.mesh);
        // });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.mesh) {
            // Rotate only on Z-axis as requested
            this.mesh.rotation.z += 0.02;
        }
        
        this.renderer.render(this.scene, this.camera);
        this.convertToASCII();
    }
    
    convertToASCII() {
        const canvas = this.renderer.domElement;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let ascii = '';
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const pixelX = Math.floor((x / this.width) * canvas.width);
                const pixelY = Math.floor((y / this.height) * canvas.height);
                const index = (pixelY * canvas.width + pixelX) * 4;
                
                // Get pixel brightness
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                const brightness = (r + g + b) / 3;
                
                // Convert to ASCII character
                const charIndex = Math.floor((brightness / 255) * (this.chars.length - 1));
                ascii += this.chars[charIndex];
            }
            ascii += '\n';
        }
        
        this.asciiElement.textContent = ascii;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the main page
    if (document.getElementById('ascii-logo')) {
        new ASCIILogo();
    }
});
