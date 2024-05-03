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
  textureLoader: THREE.TextureLoader
}

const soccerBallTexture = new URL(
  '../assets/soccer-ball-texture.png',
  import.meta.url
)

export default class Ball extends THREE.Mesh implements IUpdatable {
  radius: number
  color: THREE.Color
  position: THREE.Vector3
  ground: Ground
  scene: THREE.Scene
  textureLoader: THREE.TextureLoader

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
    textureLoader,
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

    this.textureLoader = textureLoader
    this.loadTexture()

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

  loadTexture = async () => {
    this.textureLoader
      .loadAsync(soccerBallTexture.href)
      .then((texture) => {
        const mat = new THREE.MeshStandardMaterial({ map: texture })
        this.material = mat
      })
      .catch((e) => {
        console.log(e)
      })
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
