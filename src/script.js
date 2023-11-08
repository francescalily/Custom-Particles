import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/2.png");

//making the particles geometry and material
const particlesGeometry = new THREE.BufferGeometry(1, 32, 32);
//making own geometry
const count = 20000;

const positions = new Float32Array(count * 3); //vertices
//filling the array with random values next
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1, //size of particles
  sizeAttenuation: true,
  //   color: "#ffffff",
  transparent: true,
  //   alphaTest: 0.001, //first technique to get sort out depth testing and getting rid of black backgrounds - test which is best for project - none have performance impact
  alphaMap: particleTexture, //wether there is depth to particles so ones further away look smaller and ones closer look bigger //false is better for performance
  //   depthTest: false, // depth testing can be deactivated with alphaTest - when drawing the webgl tests if whats been draw is closer than whats already been drawn
  depthWrite: false, // depth of whats being draw is stored in what we call a depth buffer - instead of the above we can tell the WebGL not to weite the particles that are in the depth buffer // good if other objects are in the scene
  blending: THREE.AdditiveBlending, //with blending can tell the webgl to add color of the picelto the color of thr pixel already drawn // this can impact performance though
  vertexColors: true,
});

//making the points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

//creating own geomtery practice

// const ownGeometry = new THREE.BufferGeometry();
// const vertices = new Float32Array([
//   -1.0,
//   -1.0,
//   1.0, // v0
//   1.0,
//   -1.0,
//   1.0, // v1
//   1.0,
//   1.0,
//   1.0, // v2

//   1.0,
//   1.0,
//   1.0, // v3
//   -1.0,
//   1.0,
//   1.0, // v4
//   -1.0,
//   -1.0,
//   1.0, // v5
// ]);

// ownGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// const ownParticles = new THREE.Points(ownGeometry, particlesMaterial);

scene.add(particles);

// /**
//  * Test cube
//  */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //changing particles
  //   particles.rotation.y = elapsedTime * 0.2;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;
  //this not good for processing power but shaders are !!

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
