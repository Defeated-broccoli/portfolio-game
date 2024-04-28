import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'
import { settings } from '../utility/settings'

interface BallProps {
  radius: number
  color?: THREE.Color
  position?: THREE.Vector3
}

export default class Ball extends THREE.Mesh implements IUpdatable {
  radius: number
  color: THREE.Color
  position: THREE.Vector3

  //CANNON
  body: CANNON.Body
  constructor({
    radius,
    color = new THREE.Color(0x0000ff),
    position = new THREE.Vector3(0, 0, 0),
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

    this.receiveShadow = true
    this.castShadow = true

    //CANNON
    this.body = new CANNON.Body({
      mass: settings.ball.mass,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Sphere(radius),
    })
  }

  update = () => {
    this.updateCollision()
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }
}
