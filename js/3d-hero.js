// THREE.JS 3D SCENE GENERATOR FOR HERO SECTION
window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('threejs-container');
    if(!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Perfume Bottle Mesh Creation (Procedural Geometry)
    const bottleGroup = new THREE.Group();

    // Glass Body
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.3, 4, 8);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9, // Glass transparency
        thickness: 1.2,
        reflectivity: 0.9
    });
    const bottleBody = new THREE.Mesh(bodyGeo, glassMat);
    bottleGroup.add(bottleBody);

    // Golden Cap
    const capGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.9,
        roughness: 0.2
    });
    const bottleCap = new THREE.Mesh(capGeo, goldMat);
    bottleCap.position.y = 2.6;
    bottleGroup.add(bottleCap);

    scene.add(bottleGroup);

    // 3. Floating Gold Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 3);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 7;

    // 5. Interactive Mouse Rotation Parallax
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // 6. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        bottleGroup.rotation.y += 0.005;
        bottleGroup.rotation.x = mouseY * 0.3;
        bottleGroup.rotation.y += mouseX * 0.05;

        particles.rotation.y -= 0.001;

        renderer.render(scene, camera);
    }
    animate();

    // 7. Window Resize Responsive Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});