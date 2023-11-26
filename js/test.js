import * as THREE from 'three';

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
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

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
