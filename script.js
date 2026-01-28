import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';

/* --------------------
  基本セットアップ
-------------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.4, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* --------------------
  ライト
-------------------- */
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(2, 3, 2);
scene.add(dirLight);

/* --------------------
  表示切り替え用グループ
-------------------- */
const root = new THREE.Group();
scene.add(root);

/* --------------------
  画像プレーン
-------------------- */
const imgTex = new THREE.TextureLoader().load('./image.jpg');
const imgMat = new THREE.MeshBasicMaterial({ map: imgTex });
const imgMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  imgMat
);

/* --------------------
  動画プレーン
-------------------- */
const video = document.createElement('video');
video.src = './video.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;

const videoTex = new THREE.VideoTexture(video);
const videoMat = new THREE.MeshBasicMaterial({ map: videoTex });
const videoMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 2),
  videoMat
);

/* --------------------
  3Dモデル
-------------------- */
let model;
const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(1, 1, 1);
  model.position.set(0, -1, 0);

  // 🔑 正面向き初期値（ここをGUIで調整）
  model.rotation.set(0, Math.PI, 0);

  root.add(model);
});

/* --------------------
  初期表示
-------------------- */
root.add(imgMesh);
let mode = 'image';

/* --------------------
  lil-gui（スマホ確認用）
-------------------- */
const gui = new GUI();

const debug = {
  mode: 'image',
  rotX: 0,
  rotY: Math.PI,
  rotZ: 0,
  inertia: true,
  playVideo: () => video.play(),
  pauseVideo: () => video.pause(),
};

gui.add(debug, 'mode', ['image', '3d', 'video']).name('表示切替').onChange(updateMode);

const rotFolder = gui.addFolder('回転調整');
rotFolder.add(debug, 'rotX', -Math.PI, Math.PI, 0.01);
rotFolder.add(debug, 'rotY', -Math.PI, Math.PI, 0.01);
rotFolder.add(debug, 'rotZ', -Math.PI, Math.PI, 0.01);

gui.add(debug, 'inertia').name('慣性ON/OFF');

const videoFolder = gui.addFolder('動画');
videoFolder.add(debug, 'playVideo').name('再生');
videoFolder.add(debug, 'pauseVideo').name('停止');

/* --------------------
  表示切り替え処理
-------------------- */
function updateMode(val) {
  root.clear();

  if (val === 'image') {
    root.add(imgMesh);
    video.pause();
  }

  if (val === '3d' && model) {
    root.add(model);
    video.pause();
  }

  if (val === 'video') {
    root.add(videoMesh);
    video.play();
  }
}

/* --------------------
  タッチ回転 + 慣性
-------------------- */
let dragging = false;
let lastX = 0;
let velocity = 0;

renderer.domElement.addEventListener('pointerdown', e => {
  dragging = true;
  lastX = e.clientX;
});

renderer.domElement.addEventListener('pointermove', e => {
  if (!dragging || !model) return;
  const dx = e.clientX - lastX;
  velocity = dx * 0.002;
  model.rotation.y += velocity;
  lastX = e.clientX;
});

renderer.domElement.addEventListener('pointerup', () => {
  dragging = false;
});

/* --------------------
  レンダーループ
-------------------- */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.x = debug.rotX;
    model.rotation.z = debug.rotZ;

    if (!dragging && debug.inertia) {
      model.rotation.y += velocity;
      velocity *= 0.92;
    }

    debug.rotY = model.rotation.y;
  }

  renderer.render(scene, camera);
}

animate();

/* --------------------
  リサイズ対応
-------------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
