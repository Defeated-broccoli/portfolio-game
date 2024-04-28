import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'

interface PlayerProps {
  width: number
  height: number
  depth: number
  color?: THREE.Color
  position?: THREE.Vector3
  velocity?: THREE.Vector3
}

const playerSpeedVelocity = 3
const playerJumpVelocity = 10

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

  //CANNON
  body: CANNON.Body

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

    //CANNON
    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    })

    //Movement
    this.velocity = velocity
    this.setupMovement()
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
      this.body.velocity.x = -playerSpeedVelocity
    } else if (this.keys.d.pressed) {
      this.body.velocity.x = playerSpeedVelocity
    }

    if (this.keys.w.pressed) {
      this.body.velocity.z = -playerSpeedVelocity
    } else if (this.keys.s.pressed) {
      this.body.velocity.z = playerSpeedVelocity
    }

    if (this.keys.space.pressed) {
      this.body.velocity.y = playerJumpVelocity
    }

    this.body.position.x += this.velocity.x
    this.body.position.y += this.velocity.y
    this.body.position.z += this.velocity.z
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
