import * as THREE from 'three';
import earthMap from './textures/earthmap.jpg'; // Ensure this path is correct

let scene, camera, renderer, earthMesh;

function init() {
    // Create the scene
    scene = new THREE.Scene();

    // Create and position the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Create the WebGL renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add Earth mesh
    const geometry = new THREE.SphereGeometry(10, 32, 32);
    // Since you've imported the image as a module, you can pass it directly to the TextureLoader
    const texture = new THREE.TextureLoader().load(earthMap);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth
    earthMesh.rotation.y += 0.005;

    renderer.render(scene, camera);
}

init();
animate();

function onDocumentMouseDown(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // intersects[0].object is the clicked object
        // Implement logic to show country information
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
