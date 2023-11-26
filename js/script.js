import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import earthMap from '../textures/earthmap10k.jpg';
import moonMap from '../textures/moonmap4k.jpg';

let scene, camera, renderer, earthMesh, moonMesh, controls;
let autoRotate = true;

function init() {
    scene = new THREE.Scene();

    // Adjust camera position so both Earth and Moon are visible at start
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50; // Increased the z position

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(10, 32, 32);
    const texture = new THREE.TextureLoader().load(earthMap);
    const material = new THREE.MeshPhongMaterial({ map: texture });
    earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthMesh);

    const moonGeometry = new THREE.SphereGeometry(2.7, 32, 32);
    const moonTexture = new THREE.TextureLoader().load(moonMap);
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moonMesh);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.enabled = false;
    controls.minDistance = 10;
    controls.maxDistance = 150;
    controls.maxPolarAngle = Math.PI / 2;
    controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
    };

    const toggleButton = document.getElementById('toggleRotation');
    toggleButton.addEventListener('click', () => {
        autoRotate = !autoRotate;
        controls.enabled = !autoRotate;
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
        earthMesh.rotation.y += 0.005;
        simulateMoonOrbitAndRotation();
    }

    controls.update();
    renderer.render(scene, camera);
}

function simulateMoonOrbitAndRotation() {
    const moonOrbitRadiusX = 40; // Semi-major axis for elliptical orbit
    const moonOrbitRadiusZ = 35; // Semi-minor axis for elliptical orbit
    const moonOrbitInclination = 0.087; // About 5 degrees in radians
    const moonOrbitSpeed = 0.01; // Orbit speed
    const moonAngle = moonOrbitSpeed * Date.now() * 0.001;

    moonMesh.position.x = moonOrbitRadiusX * Math.cos(moonAngle);
    moonMesh.position.y = moonOrbitRadiusX * Math.sin(moonAngle) * Math.sin(moonOrbitInclination);
    moonMesh.position.z = moonOrbitRadiusZ * Math.sin(moonAngle);

    // Synchronizing moon's rotation with its orbit
    moonMesh.rotation.y += moonOrbitSpeed;
}

init();
animate();