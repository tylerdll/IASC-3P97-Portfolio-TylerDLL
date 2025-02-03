import * as THREE from "https://unpkg.com/three@0.155.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "https://unpkg.com/three@0.155.0/examples/jsm/loaders/OBJLoader.js";

/**** SCENE SETUP ****/
const canvas = document.querySelector(".webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

// Camera setup
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 1, 5);
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**** ADD VIDEO TEXTURE ****/
const video = document.createElement("video");
video.src = "AdventureTime.mp4";  // Set path to your video file
video.load();
video.play();
video.loop = true;  // Loop the video
video.muted = true; // Optional: Mute the video if needed

// Create a Video Texture from the video element
const videoTexture = new THREE.VideoTexture(video);

// Create a Plane Geometry and apply the video texture as a material
const videoGeometry = new THREE.PlaneGeometry(4, 3);  // Adjust size of the plane
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
videoPlane.position.set(0, 0, -3);  // Position the video plane in front of the camera
scene.add(videoPlane);

/**** LOAD 3D MODEL (OBJ) WITHOUT MATERIAL ****/
const objLoader = new OBJLoader();

objLoader.load(
    "models/dogdogdogdog.obj", // Ensure the path matches your model
    function (object) {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.7 });
            }
        });

        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
        console.error("Error loading model:", error);
    }
);
/**** ADD ROMAN PILLAR ****/
const pillarHeight = 3;  // Height remains the same
const pillarRadius = 0.5;
const pillarSegments = 32;

// Create the shaft of the pillar (cylinder)
const pillarGeometry = new THREE.CylinderGeometry(pillarRadius, pillarRadius, pillarHeight, pillarSegments);
const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.7, metalness: 0.1 });
const pillarShaft = new THREE.Mesh(pillarGeometry, pillarMaterial);
pillarShaft.position.set(0, -3.5, -5);  // Lowered further down

// Create the base of the pillar (smaller cylinder)
const baseHeight = 0.5;
const baseGeometry = new THREE.CylinderGeometry(pillarRadius * 1.2, pillarRadius * 1.2, baseHeight, pillarSegments);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, roughness: 0.7, metalness: 0.1 });
const pillarBase = new THREE.Mesh(baseGeometry, baseMaterial);
pillarBase.position.set(0, -2, -5);  // Lowered further down

// Create the capital (top) of the pillar (slightly wider cylinder)
const capitalHeight = 0.5;
const capitalGeometry = new THREE.CylinderGeometry(pillarRadius * 1.5, pillarRadius * 1.5, capitalHeight, pillarSegments);
const capitalMaterial = new THREE.MeshStandardMaterial({ color: 0xBBBBBB, roughness: 0.7, metalness: 0.1 });
const pillarCapital = new THREE.Mesh(capitalGeometry, capitalMaterial);
pillarCapital.position.set(0, -5, -5);  // Lowered the capital quite a bit

// Add all parts of the pillar to the scene
scene.add(pillarShaft);
scene.add(pillarBase);
scene.add(pillarCapital);

/**** ANIMATION LOOP ****/
function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

/**** HANDLE WINDOW RESIZE ****/
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
