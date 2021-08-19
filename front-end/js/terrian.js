import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';
import * as dat from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/libs/dat.gui.module.js"

//Texture Loader
const loader = new THREE.TextureLoader();
const height = loader.load('assets/height.png');
console.log(height);
const texture = loader.load('assets/rgb.png');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI();
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 6
scene.add(camera)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

//Objects
const geometry = new THREE.PlaneGeometry(5.84,2.83,512,512);

//Materials
const material = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    map: texture,
    displacementMap: height,
    displacementScale: 0.2,
    side: THREE.DoubleSide
} );

// Mesh
const terrian = new THREE.Mesh( geometry, material );
scene.add( terrian );
terrian.rotation.x=-0.9;

// Lights
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

gui.add(terrian.rotation,'x').min(-2).max(2);
gui.add(material,'displacementScale').min(0).max(1);

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();