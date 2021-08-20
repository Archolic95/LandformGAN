import * as THREE from 'https://cdn.skypack.dev/three@0.131.3';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.131.3/examples/jsm/controls/OrbitControls.js';
import * as dat from "https://cdn.skypack.dev/three@0.131.3/examples/jsm/libs/dat.gui.module.js"

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const gui = new dat.GUI();
// Scene
const scene = new THREE.Scene();

// // Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//const camera = new THREE.OrthographicCamera( -5, 5, 10, -10, -1000, 1000);
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

// Lights
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
const loader = new THREE.TextureLoader();
let terrian;

//Objects
const geometry = new THREE.PlaneGeometry(5.84,2.83,512,512);

const height = loader.load('assets/height.png');
console.log(height);
const texture = loader.load('assets/rgb.png');

const material = new THREE.MeshStandardMaterial( {
    //color: 0xffffff,
    map: texture,
    displacementMap: height,
    displacementScale: 0.3,
    side: THREE.DoubleSide
} );

material.needsUpdate = true;

terrian = new THREE.Mesh( geometry, material );
terrian.rotation.x=-0.7;
terrian.rotation.y=0;
terrian.rotation.z=0;

scene.add( terrian );

let i = 0;
const tick = () =>
{
    
    const elapsedTime = parseInt(clock.getElapsedTime()*5);
    //console.log(elapsedTime);
    //Texture Loader
    
    const new_height = loader.load('assets/height_'+elapsedTime.toString()+'.png');
    //console.log(height);
    const new_texture = loader.load('assets/rgb_'+elapsedTime.toString()+'.png');

    //Materials
    const new_material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        map: new_texture,
        displacementMap: new_height,
        displacementScale: 0.3,
        side: THREE.DoubleSide
    } );
    
    if(i!=elapsedTime)
    {
        console.log("update")
        // Mesh
        material.map = new_texture;
        material.displacementMap = new_height;
    }


    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    i = elapsedTime;
}


// gui.add(terrian.rotation,'x').min(-2).max(2);
// gui.add(material,'displacementScale').min(0).max(1);

tick();