import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import Ground from './ground'
import Player from './player'
import IUpdatable from '../interfaces/IUpdatable'
import Ball from './ball'
import { settings } from '../utility/settings'
import Goal from './goal'

import CannonDebugger from 'cannon-es-debugger'
import Wall from './wall'

export default class Engine {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  gltfLoader: GLTFLoader
  textureLoader: THREE.TextureLoader

  //CANNON
  world: CANNON.World

  cannonDebugRenderer: any

  movableObjects: IUpdatable[] = []

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1
    )
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.setCamera(new THREE.Vector3(0, 5, 5))
    this.setWindowResize(this)

    this.gltfLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()

    //CANNON
    this.world = new CANNON.World({
      gravity: settings.engine.gravity,
    })

    this.cannonDebugRenderer = new (CannonDebugger as any)(
      this.scene,
      this.world
    )
  }

  setCamera = (position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) => {
    this.camera.position.set(position.x, position.y, position.z)
    this.camera.lookAt(0, 0, 0)
  }

  setup = () => {
    const ground = this.createGround()

    const player = this.createPlayer()
    this.movableObjects.push(player)

    const ball = this.createBall(ground)
    this.movableObjects.push(ball)

    this.createGoals(ground)

    this.createLight()

    this.createWall(ground)

    this.addHelpers()

    this.addContactMaterial(ball.body, ground.body, {
      restitution: 0.7,
      friction: 0.3,
    })
    this.addContactMaterial(ball.body, player.body, {
      restitution: 0.5,
      friction: 0.2,
    })
  }

  createGround = (): Ground => {
    const ground = new Ground({
      radius: settings.ground.radius,
      height: settings.ground.height,
      color: new THREE.Color(0x00ff00),
      textureLoader: this.textureLoader,
      world: this.world,
      scene: this.scene,
    })
    return ground
  }

  createPlayer = (): Player => {
    const player = new Player({
      width: settings.player.width,
      height: settings.player.height,
      depth: settings.player.depth,
      position: new THREE.Vector3(0, 2, 0),
      color: new THREE.Color(0xffff00),
      world: this.world,
      scene: this.scene,
    })
    return player
  }

  createBall = (ground: Ground): Ball => {
    const ball = new Ball({
      radius: settings.ball.radius,
      position: new THREE.Vector3(0, 4, 0),
      ground: ground,
      world: this.world,
      scene: this.scene,
      textureLoader: this.textureLoader,
    })
    return ball
  }

  createLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(100, 100, -50)

    directionalLight.castShadow = true
    directionalLight.shadow.bias = 0.0001

    directionalLight.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2)

    const groundRadius = settings.ground.radius

    directionalLight.shadow.camera.left = -groundRadius
    directionalLight.shadow.camera.right = groundRadius
    directionalLight.shadow.camera.top = groundRadius
    directionalLight.shadow.camera.bottom = -groundRadius

    this.scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 2)
    this.scene.add(ambientLight)
  }

  createGoals = async (ground: Ground) => {
    const numberOfGoals = settings.goal.numberOfGoals
    const size = new THREE.Vector3(
      settings.ground.radius * 0.1,
      settings.ground.radius * 0.16,
      settings.ground.radius * 0.32
    )

    const radius = ground.radius - size.x - settings.ground.radius * 0.11
    for (let i = 0; i < numberOfGoals; i++) {
      const angle = (i / numberOfGoals) * Math.PI * 2
      const x = radius * Math.cos(angle) + ground.position.x
      const z = radius * Math.sin(angle) + ground.position.z
      const y = ground.top

      const goal = new Goal({
        loader: this.gltfLoader,
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Euler(0, Math.PI - angle, 0),
        size: size,
        world: this.world,
        scene: this.scene,
      })
    }
  }

  createWall = (ground: Ground) => {
    const wall = new Wall({
      radius: ground.radius,
      height: 50,
      position: new THREE.Vector3(0, 0, 0),
      scene: this.scene,
      world: this.world,
    })
  }

  addHelpers = () => {
    const axisHelper = new THREE.AxesHelper(5)
    this.scene.add(axisHelper)
    axisHelper.position.y = 2
  }

  addContactMaterial = (
    object1: CANNON.Body,
    object2: CANNON.Body,
    props: {
      restitution: number
      friction: number
    }
  ) => {
    if (object1.material && object2.material) {
      const contactMat = new CANNON.ContactMaterial(
        object1.material,
        object2.material,
        {
          ...props,
        }
      )
      this.world.addContactMaterial(contactMat)
      return contactMat
    } else console.error('')
  }

  setWindowResize = (engine: Engine) => {
    window.addEventListener('resize', function () {
      engine.camera.aspect = window.innerWidth / window.innerHeight
      engine.camera.updateProjectionMatrix()
      engine.renderer.setSize(window.innerWidth, window.innerHeight)
    })
  }

  animate = () => {
    this.world.step(settings.engine.timeStep)

    this.movableObjects.forEach((obj) => {
      obj.update()
    })

    if (settings.debug.cannonDebugger) this.cannonDebugRenderer.update()

    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }
}
