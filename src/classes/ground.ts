import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'

interface GroundProps {
  radius: number
  height: number
  color: THREE.Color
  position?: THREE.Vector3
}

export default class Ground extends THREE.Mesh implements IUpdatable {
  radius: number
  height: number
  color: THREE.Color
  bottom: number
  top: number

  //CANNON
  body: CANNON.Body

  constructor({
    radius,
    height,
    color,
    position = new THREE.Vector3(0, 0, 0),
  }: GroundProps) {
    super(
      new THREE.CylinderGeometry(radius, radius, height, 256),
      new THREE.MeshStandardMaterial({ color: color })
    )

    this.radius = radius
    this.height = height
    this.color = color
    this.position.set(position.x, position.y, position.z)

    this.receiveShadow = true
    this.castShadow = true

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    //CANNON
    this.body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Cylinder(radius, radius, height, 256),
    })
  }

  update = () => {
    this.updateCollision()
    this.updateSides()
  }

  updateSides = () => {
    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }
}
