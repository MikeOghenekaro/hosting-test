import './style.css'
import * as THREE from 'three'
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'

document.querySelector('#app').innerHTML = `
  <div class="scene">
    <div class="scene-copy">
      <p class="eyebrow">THREE.JS SCENE</p>
      <h1>Orbit study</h1>
      <p class="help">WASD to move <span>·</span> Mouse to look <span>·</span> R/F to rise and descend</p>
    </div>
    <div class="crosshair" aria-hidden="true"></div>
    <div class="scene-caption">FIRST PERSON <span>—</span> 75° FOV</div>
  </div>
`

const container = document.querySelector('.scene')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x101923)
scene.fog = new THREE.Fog(0x101923, 90, 260)

const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  500,
)
camera.position.set(0, 12, 82)
camera.lookAt(0, 24, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.15
container.appendChild(renderer.domElement)

const controls = new FirstPersonControls(camera, renderer.domElement)
controls.movementSpeed = 24
controls.lookSpeed = 0.08
controls.lookVertical = true
controls.constrainVertical = true
controls.verticalMin = 0.45
controls.verticalMax = 2.65
controls.activeLook = true

scene.add(new THREE.AmbientLight(0xff9a42, 0.4))

const orbitLight = new THREE.DirectionalLight(0xa8d8ff, 3)
orbitLight.castShadow = true
orbitLight.shadow.mapSize.set(1024, 1024)
orbitLight.shadow.camera.left = -45
orbitLight.shadow.camera.right = 45
orbitLight.shadow.camera.top = 45
orbitLight.shadow.camera.bottom = -45
orbitLight.shadow.bias = -0.0005
scene.add(orbitLight)
scene.add(orbitLight.target)

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(100, 10, 100),
  new THREE.MeshStandardMaterial({ color: 0x263542, roughness: 0.82 }),
)
floor.position.y = -5
floor.receiveShadow = true
scene.add(floor)

const box = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshStandardMaterial({
    color: 0xe9a15d,
    roughness: 0.38,
    metalness: 0.12,
  }),
)
box.position.set(0, 30, 0)
box.castShadow = true
box.receiveShadow = true
scene.add(box)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 24),
  new THREE.MeshStandardMaterial({
    color: 0xff303b,
    roughness: 0.3,
    metalness: 0.08,
    emissive: 0x4a080c,
  }),
)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const orbitDistance = 25
const orbitSpeed = 0.55
const timer = new THREE.Timer()
timer.connect(document)

function resize() {
  const width = container.clientWidth
  const height = container.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

window.addEventListener('resize', resize)

function animate() {
  requestAnimationFrame(animate)
  timer.update()
  const delta = Math.min(timer.getDelta(), 0.05)
  const elapsed = timer.getElapsed()

  controls.update(delta)
  box.rotation.x += delta * 0.35
  box.rotation.y += delta * 0.55

  sphere.position.set(
    Math.cos(elapsed * orbitSpeed) * orbitDistance,
    30,
    Math.sin(elapsed * orbitSpeed) * orbitDistance,
  )
  orbitLight.position.copy(sphere.position)
  orbitLight.target.position.copy(box.position)

  renderer.render(scene, camera)
}

animate()
