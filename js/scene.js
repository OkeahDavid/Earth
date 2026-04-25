import * as THREE from 'three';

const MOON_TEXTURE = new URL('../textures/moonmap4k.jpg', import.meta.url).href;

export function addStars(globe) {
  const scene = globe.scene();
  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 10000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const radius = 800 + Math.random() * 1200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8
  });

  scene.add(new THREE.Points(starsGeometry, starsMaterial));
}

export function addDayNightLighting(globe) {
  const scene = globe.scene();

  // Remove default lights
  scene.children.filter(c => c.isLight).forEach(l => scene.remove(l));

  // Dim ambient (starlight/indirect)
  scene.add(new THREE.AmbientLight(0x222244, 0.4 * Math.PI));

  // Sun directional light positioned by real UTC time
  const sunLight = new THREE.DirectionalLight(0xffeedd, 1.2 * Math.PI);
  scene.add(sunLight);

  function updateSunPosition() {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const sunLngRad = ((12 - utcHours) * 15) * (Math.PI / 180);
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const sunLatRad = 23.44 * (Math.PI / 180) * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81));

    const dist = 500;
    sunLight.position.set(
      dist * Math.cos(sunLatRad) * Math.cos(sunLngRad),
      dist * Math.sin(sunLatRad),
      dist * Math.cos(sunLatRad) * Math.sin(sunLngRad)
    );
  }

  updateSunPosition();
  setInterval(updateSunPosition, 60000);
}

export function addMoon(globe) {
  const scene = globe.scene();
  const globeRadius = globe.getGlobeRadius();

  const moonGeometry = new THREE.SphereGeometry(globeRadius * 0.27, 32, 32);
  const moonTexture = new THREE.TextureLoader().load(MOON_TEXTURE);
  const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  scene.add(moonMesh);

  function animateMoon() {
    requestAnimationFrame(animateMoon);
    const t = Date.now() * 0.0001;
    const orbitX = globeRadius * 4;
    const orbitZ = globeRadius * 3.5;
    const inclination = 0.087;

    moonMesh.position.x = orbitX * Math.cos(t);
    moonMesh.position.y = orbitX * Math.sin(t) * Math.sin(inclination);
    moonMesh.position.z = orbitZ * Math.sin(t);
    moonMesh.rotation.y += 0.001;
  }
  animateMoon();
}
