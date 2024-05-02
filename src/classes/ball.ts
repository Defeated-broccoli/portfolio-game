import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'
import { settings } from '../utility/settings'
import Ground from './ground'

interface BallProps {
  radius: number
  color?: THREE.Color
  position?: THREE.Vector3
  ground: Ground
  scene: THREE.Scene
  world: CANNON.World
}

export default class Ball extends THREE.Mesh implements IUpdatable {
  radius: number
  color: THREE.Color
  position: THREE.Vector3
  ground: Ground
  scene: THREE.Scene

  //CANNON
  body: CANNON.Body
  world: CANNON.World

  constructor({
    radius,
    color = new THREE.Color(0x0000ff),
    position = new THREE.Vector3(0, 0, 0),
    ground,
    scene,
    world,
  }: BallProps) {
    super(
      new THREE.SphereGeometry(
        radius,
        settings.ball.segmentCount,
        settings.ball.segmentCount
      ),
      new THREE.MeshStandardMaterial({ color: color })
    )

    this.radius = radius
    this.color = color
    this.position = position
    this.position.set(position.x, position.y, position.z)
    this.ground = ground

    this.receiveShadow = true
    this.castShadow = true

    this.scene = scene
    this.scene.add(this)

    //CANNON
    this.world = world
    this.body = new CANNON.Body({
      mass: settings.ball.mass,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Sphere(radius),
      material: new CANNON.Material(),
    })
    this.world.addBody(this.body)
  }

  update = () => {
    this.updateCollision()
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }

  updateRange = () => {}
}
