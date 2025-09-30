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
        this.effect = null;
        this.mesh = null;
        this.stlLoader = new THREE.STLLoader();
        
        // ASCII settings matching the original
        this.characters = ' .:-+*=%@#';
        this.effectSize = { amount: 0.205 };
        this.backgroundColor = 'black';
        this.ASCIIColor = 'white';
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0, 0, 0);
        
        // Setup camera 
        const width = Math.min(window.innerWidth, 800);
        const height = Math.min(window.innerHeight, 400);
        
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer();
        
        // Create ASCII effect (this is the key missing piece!)
        this.effect = new THREE.AsciiEffect(this.renderer, this.characters, { 
            invert: true, 
            resolution: this.effectSize.amount 
        });
        this.effect.setSize(width, height);
        this.effect.domElement.style.color = this.ASCIIColor;
        this.effect.domElement.style.backgroundColor = this.backgroundColor;
        
        // Add lighting
        const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
        pointLight.position.set(100, 100, 400);
        this.scene.add(pointLight);
        
        // Replace the ASCII logo div with the ASCII effect
        const logoContainer = document.getElementById('ascii-logo-container');
        if (logoContainer) {
            logoContainer.innerHTML = '';
            logoContainer.appendChild(this.effect.domElement);
        }
        
        // Load a simple geometry as placeholder (or your STL)
        this.loadDefaultGeometry();
        
        // Start animation
        this.animate();
    }
    
    loadDefaultGeometry() {
        // Create simple "LAU"-like geometry as placeholder
        const geometry = new THREE.BoxGeometry(2, 1, 0.5);
        const material = new THREE.MeshStandardMaterial();
        material.flatShading = true;
        material.side = THREE.DoubleSide;
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Center and position the mesh
        geometry.computeVertexNormals();
        geometry.center();
        geometry.computeBoundingBox();
        
        const bbox = geometry.boundingBox;
        this.mesh.position.y = (bbox.max.z - bbox.min.z) / 5;
        
        // Position camera
        this.camera.position.x = bbox.max.x * 4;
        this.camera.position.y = bbox.max.y;
        this.camera.position.z = bbox.max.z * 3;
        
        this.scene.add(this.mesh);
        
        // TODO: Replace with your actual STL file
        // this.loadSTL('./assets/lau-logo.stl');
    }
    
    loadSTL(url) {
        this.stlLoader.load(url, (geometry) => {
            if (this.mesh) {
                this.scene.remove(this.mesh);
            }
            
            const material = new THREE.MeshStandardMaterial();
            material.flatShading = true;
            material.side = THREE.DoubleSide;
            
            this.mesh = new THREE.Mesh(geometry, material);
            
            geometry.computeVertexNormals();
            geometry.center();
            geometry.computeBoundingBox();
            
            const bbox = geometry.boundingBox;
            this.mesh.position.y = (bbox.max.z - bbox.min.z) / 6;
            
            this.scene.add(this.mesh);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.mesh) {
            // Rotate only on Z-axis as requested
            this.mesh.rotation.z += 0.02;
        }
        
        this.render();
    }
    
    render() {
        this.effect.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        if (document.getElementById('ascii-logo-container')) {
            new ASCIILogo();
        }
    }, 100);
});
