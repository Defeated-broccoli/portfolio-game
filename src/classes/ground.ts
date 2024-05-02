import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import IUpdatable from '../interfaces/IUpdatable'
import { settings } from '../utility/settings'

interface GroundProps {
  radius: number
  height: number
  color: THREE.Color
  position?: THREE.Vector3
  textureLoader: THREE.TextureLoader
  world: CANNON.World
  scene: THREE.Scene
}

const groundTexture = new URL('../assets/ground-texture.png', import.meta.url)

export default class Ground extends THREE.Mesh {
  radius: number
  height: number
  color: THREE.Color
  bottom: number
  top: number

  scene: THREE.Scene
  textureLoader: THREE.TextureLoader

  //CANNON
  body: CANNON.Body
  world: CANNON.World

  constructor({
    radius,
    height,
    color,
    position = new THREE.Vector3(0, 0, 0),
    textureLoader,
    world,
    scene,
  }: GroundProps) {
    super(
      new THREE.CylinderGeometry(
        radius,
        radius,
        height,
        settings.ground.segmentCount
      ),
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

    this.scene = scene
    this.scene.add(this)

    this.textureLoader = textureLoader
    this.loadTexture()

    //CANNON
    this.world = world
    this.body = this.createBody()
  }

  loadTexture = async () => {
    this.textureLoader
      .loadAsync(groundTexture.href)
      .then((texture) => {
        const mat = new THREE.MeshStandardMaterial({ map: texture })
        this.material = mat
      })
      .catch((e) => {
        console.log(e)
      })
  }

  createBody = () => {
    const body = new CANNON.Body({
      type: CANNON.Body.STATIC,
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y,
        this.position.z
      ),
      shape: new CANNON.Cylinder(
        this.radius,
        this.radius,
        this.height,
        settings.ground.segmentCount
      ),
      material: new CANNON.Material(),
    })

    this.world.addBody(body)
    return body
  }
}
