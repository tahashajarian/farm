import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import { Sky } from 'three/examples/jsm/objects/Sky';
import Stats from 'three/examples/jsm/libs/stats.module'
import { treeData } from './constances/tree-positions';
// import { cornPositions } from './constances/corn-positions';
import { loadTerrain } from './loaders/load-train'
import { loadTreesLOD } from './loaders/load-trees'
import { loadCornsLOD } from './loaders/load-corns'
import { loadCattleModel } from './loaders/load-cattle-model'
import { makeUrl } from './constances/path-to-models'
import { loadGoatModel } from './loaders/load-goat-model'
import { loadStable } from './loaders/load-stable'
/**
 * Loaders
 */


const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(() => {
  window.setTimeout(() => {
    // Animate overlay
    gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })

    // Update loadingBarElement
    loadingBarElement.classList.add('ended')
    loadingBarElement.style.transform = ''
  }, 500)
},
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal
    loadingBarElement.style.transform = `scaleX(${progressRatio})`
  }
)

const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

const debugObject = {}

const clock = new THREE.Clock()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const overlayGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms:
  {
    uAlpha: { value: 1 }
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)




const mixers = []
debugObject.envMapIntensity = 5


// load stuff

loadTerrain(scene, gltfLoader, 'Terrain/Terrain');
loadStable(scene, gltfLoader, 'Stable/Stable');
loadTreesLOD(scene, gltfLoader, 'Trees Level/Tree Level');
loadCornsLOD(scene, gltfLoader, 'Corn level/Corn level');
loadCattleModel(scene, gltfLoader, 'Cattle/Cattle', mixers)
loadGoatModel(scene, gltfLoader, 'goat/goat', mixers)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = false
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-250, 20, 0)
camera.lookAt(-250, 20, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = Math.PI * 0.5 - 0.01;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const stats = new Stats();
document.body.appendChild(stats.dom);

scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.003);
/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update()

  const delta = clock.getDelta();

  for (let i = 0; i < mixers.length; i++) {
    const mixer = mixers[i];
    mixer.update(delta);
  }


  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
  stats.update();
}

tick()

// loadModels();


// scene.fog = new THREE.Fog(0xffffff, 20, 100);


function initSky() {

  // Add Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const sun = new THREE.Vector3();

  /// GUI

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure
  };

  function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);

  }



  guiChanged();

  scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
  const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), new THREE.MeshBasicMaterial({ color: 0x496645 }));
  floorMesh.rotation.set(-Math.PI / 2, 0, 0)
  scene.add(floorMesh)
}


// initSky();

