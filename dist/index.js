import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/postprocessing/AfterimagePass.js";

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


let w = window.innerWidth;
let h = window.innerHeight;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.065);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 15;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);


//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.update();

const renderScene = new  RenderPass(scene,camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(w,h), 3, 0 ,0);

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.975;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(afterImagePass)

const ballGeo = new THREE.IcosahedronBufferGeometry(6,3);
// const ballMat = new THREE.MeshBasicMaterial({wireframe: true, color: 0x202020});
// const mesh = new THREE.Mesh(ballGeo, ballMat);
// scene.add(mesh)


const colors = [];
const color = new THREE.Color();
const numVertices = ballGeo.attributes.position.count;
let x;
for (let i = 0; i < numVertices ; i+= 1) {
    x = ballGeo.attributes.position.array[i * 3];
    color.setHSL(0.97 + x * 0.025, 1.0, 0.5);
    colors.push(color.r, color.g , color.b)
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', ballGeo.attributes.position);
geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
const mat = new THREE.PointsMaterial({size: 0.055, vertexColors: true})
const points = new THREE.Points(geo,mat);
scene.add(points);



function animate() {
    requestAnimationFrame(animate);
    // mesh.rotation.x += 0.0075;
    // mesh.rotation.y += 0.005;
    points.rotation.x += 0.003;
    points.rotation.y += 0.003;
    // points.rotation.z += 0.003;

    composer.render(scene, camera);
}

animate();

function handleWindowResize () {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
