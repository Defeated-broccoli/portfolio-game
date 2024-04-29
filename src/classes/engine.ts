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

export default class Engine {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  loader: GLTFLoader

  //CANNON
  world: CANNON.World

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

    this.loader = new GLTFLoader()

    //CANNON
    this.world = new CANNON.World({
      gravity: settings.engine.gravity,
    })
  }

  setCamera = (position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)) => {
    this.camera.position.set(position.x, position.y, position.z)
    this.camera.lookAt(0, 0, 0)
  }

  setup = () => {
    this.createGround()

    const player = this.createPlayer()
    this.movableObjects.push(player)

    const ball = this.createBall()
    this.movableObjects.push(ball)

    const goal = this.createGoal()

    this.createLight()
  }

  createGround = (): Ground => {
    const ground = new Ground({
      radius: settings.ground.radius,
      height: settings.ground.height,
      color: new THREE.Color(0x00ff00),
    })
    this.scene.add(ground)
    this.world.addBody(ground.body)
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
    })
    this.scene.add(player)
    this.world.addBody(player.body)

    return player
  }

  createBall = (): Ball => {
    const ball = new Ball({
      radius: settings.ball.radius,
      position: new THREE.Vector3(0, 4, 0),
    })
    this.scene.add(ball)
    this.world.addBody(ball.body)

    return ball
  }

  createLight = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(10, 10, -5)

    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    const ambientLight = new THREE.AmbientLight(0x333333, 2)
    this.scene.add(ambientLight)
  }

  createGoal = async () => {
    const goal = new Goal({
      loader: this.loader,
      position: new THREE.Vector3(10, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
    })

    this.scene.add(goal)
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

    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }
}
