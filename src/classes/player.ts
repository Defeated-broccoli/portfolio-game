import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'

interface PlayerProps {
  width: number
  height: number
  depth: number
  color?: THREE.Color
  position?: THREE.Vector3
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

  //CANNON
  body: CANNON.Body

  constructor({
    width,
    height,
    depth,
    color = new THREE.Color(0xffff00),
    position = new THREE.Vector3(0, 0, 0),
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

    this.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2)),
    })
  }

  update = () => {
    this.updateCollision()
    this.updateSides()
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
}
