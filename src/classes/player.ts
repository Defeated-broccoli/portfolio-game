import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'
import { settings } from '../utility/settings'

interface PlayerProps {
  width: number
  height: number
  depth: number
  readonly color?: THREE.Color
  position?: THREE.Vector3
  velocity?: THREE.Vector3
  scene: THREE.Scene

  //CANNON
  world: CANNON.World
}

export default class Player extends THREE.Mesh implements IUpdatable {
  width: number
  height: number
  depth: number

  bottom: number
  top: number
  left: number
  right: number
  front: number
  back: number

  scene: THREE.Scene

  //CANNON
  body: CANNON.Body
  world: CANNON.World

  //Movement
  keys = {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
  }
  velocity: THREE.Vector3

  constructor({
    width,
    height,
    depth,
    color = new THREE.Color(0xffff00),
    position = new THREE.Vector3(0, 0, 0),
    velocity = new THREE.Vector3(0, 0, 0),
    world,
    scene,
  }: PlayerProps) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color: color })
    )

    this.receiveShadow = true
    this.castShadow = true

    this.width = width
    this.height = height
    this.depth = depth

    this.position.set(position.x, position.y, position.z)

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2
    this.left = this.position.x - this.width / 2
    this.right = this.position.x + this.width / 2
    this.front = this.position.z - this.depth / 2
    this.back = this.position.z + this.depth / 2

    this.scene = scene
    this.scene.add(this)

    //CANNON
    this.world = world
    this.body = this.createBody()

    //Movement
    this.velocity = velocity
    this.setupMovement()
  }

  createBody = () => {
    const body = new CANNON.Body({
      mass: settings.player.mass,
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y,
        this.position.z
      ),
      shape: new CANNON.Box(
        new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2)
      ),
    })
    this.world.addBody(body)
    return body
  }

  update = () => {
    this.updateCollision()
    this.updateSides()
    this.updateVelocity()
  }

  updateSides = () => {
    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2
    this.left = this.position.x - this.width / 2
    this.right = this.position.x + this.width / 2
    this.front = this.position.z - this.depth / 2
    this.back = this.position.z + this.depth / 2
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }

  updateVelocity = () => {
    if (this.keys.a.pressed) {
      this.body.velocity.x = -settings.player.speedVelocity
    } else if (this.keys.d.pressed) {
      this.body.velocity.x = settings.player.speedVelocity
    }

    if (this.keys.w.pressed) {
      this.body.velocity.z = -settings.player.speedVelocity
    } else if (this.keys.s.pressed) {
      this.body.velocity.z = settings.player.speedVelocity
    }

    if (this.keys.space.pressed && this.isOnGround()) {
      this.body.velocity.y = settings.player.jumpVelocity
    }
  }

  isOnGround = (): boolean => {
    const from = this.body.position.clone()
    const to = new CANNON.Vec3(
      from.x,
      from.y - settings.player.jumpRaycastRange,
      from.z
    )

    const result = new CANNON.RaycastResult()
    this.world.rayTest(from, to, result)
    console.log(result.hasHit)
    return result.hasHit
  }

  setupMovement = () => {
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyA':
          this.keys.a.pressed = true
          break
        case 'KeyD':
          this.keys.d.pressed = true
          break
        case 'KeyW':
          this.keys.w.pressed = true
          break
        case 'KeyS':
          this.keys.s.pressed = true
          break
        case 'Space':
          this.keys.space.pressed = true
          break
      }
    })

    window.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyA':
          this.keys.a.pressed = false
          break
        case 'KeyD':
          this.keys.d.pressed = false
          break
        case 'KeyS':
          this.keys.s.pressed = false
          break
        case 'KeyW':
          this.keys.w.pressed = false
          break
        case 'Space':
          this.keys.space.pressed = false
          break
      }
    })
  }
}
