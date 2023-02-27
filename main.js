import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var renderer, scene, camera, control, pointLight, eyeball, moon;
setUpCanvas();
addLighting();
// addHelper();
addOrbitControl();
addMoon();
// addEyeball();
animate();
animateContent();
animateMouseMove();

/* SET UP INITIAL CANVAS */
function setUpCanvas() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( // mimicking human eyeballs POV
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
  }); // render graphic to the scene

  renderer.setPixelRatio(2);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(20);
  renderer.render(scene, camera);
}

/* LIGHTING */
function addLighting() {
  pointLight = new THREE.PointLight(0xffffff); // emit light in all directions - accent light
  pointLight.intensity = 1.25;
  pointLight.position.set(0, 10, 10); // bigger numbers moving light further away
  scene.add(pointLight);

  // const ambientLight = new THREE.AmbientLight(0xffffff); // light up the whole scene
  // scene.add(ambientLight);
}

/* EYEBALL */
function addEyeball() {
  const eyeballTexture = new THREE.TextureLoader().load("./img/eyeball.png");
  eyeball = new THREE.Mesh(
    new THREE.SphereGeometry(3, 64, 64),
    // new THREE.MeshStandardMaterial({ color: "#00ff83" })
    new THREE.MeshStandardMaterial({ map: eyeballTexture })
  );
  scene.add(eyeball);

  // sphere.position.z = 23;
  // sphere.position.setX(-7); // same as assigning
}

/* MOON */
function addMoon() {
  const moonTexture = new THREE.TextureLoader().load("./img/moon.jpg");

  moon = new THREE.Mesh(
    new THREE.SphereGeometry(5, 64, 64),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
    })
  );
  scene.add(moon);
}

function addHelper() {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);
}

function addOrbitControl() {
  control = new OrbitControls(camera, renderer.domElement);
  control.enableDamping = true;
  control.enablePan = false;
  control.enableZoom = false;
  control.autoRotate = true;
  control.autoRotateSpeed = 5;
}

/* Game Loop: recursive function to animate in order to not call .render() repeatedly
 * whenever browser re-paint the screen, render method is called
 **/
function animate() {
  requestAnimationFrame(animate);

  control.update();

  renderer.render(scene, camera);
}

/* Handle Resize */
window.addEventListener("resize", () => {
  // update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* Synchronize All Animation */
function animateContent() {
  const tl = gsap.timeline({ default: { duration: 1 } });
  // scale moon animation
  tl.fromTo(moon.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
  // nav bar animation (slide down)
  tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
  // fade in title
  tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });
}

/* Animate Mouse Drag Color */
function animateMouseMove() {
  let mouseDown = false;
  let rgb = [];
  window.addEventListener("mousedown", () => (mouseDown = true));
  window.addEventListener("mouseup", () => (mouseDown = false));
  window.addEventListener("mousemove", (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / window.innerWidth) * 255), // random number 0 - 255 (moving mouse horizontally)
        Math.round((e.pageY / window.innerWidth) * 255), // random number 0 - 255 (moving mouse vertically)
        Math.floor(Math.random() * 255) + 0, // random number 0 - 255
      ];
      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
      gsap.to(pointLight.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      });
    }
  });
}
