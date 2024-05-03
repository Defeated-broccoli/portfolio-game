import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'
import { settings } from '../utility/settings'
import IUpdatable from '../interfaces/IUpdatable'

interface GoalProps {
  loader: GLTFLoader
  position: THREE.Vector3
  rotation: THREE.Euler
  size: THREE.Vector3
  scene: THREE.Scene
  world: CANNON.World
}

const goalUrl = new URL('../assets/soccer_goal.glb', import.meta.url)

export default class Goal extends THREE.Group implements IUpdatable {
  loader: GLTFLoader
  size: THREE.Vector3
  scene: THREE.Scene
  world: CANNON.World

  //CANNON
  body: CANNON.Body

  constructor({ loader, position, rotation, size, scene, world }: GoalProps) {
    super()

    this.loader = loader
    this.size = size
    this.position.set(position.x, position.y, position.z)
    this.rotation.set(rotation.x, rotation.y, rotation.z)

    this.scene = scene
    this.scene.add(this)
    this.loadFile()

    //CANNON
    this.world = world
    this.body = this.createBody()
  }

  loadFile = async () => {
    const goal = await this.loader
      .loadAsync(goalUrl.href)
      .then((gltf) => gltf.scene)

    const boundingBox = new THREE.Box3().setFromObject(goal)
    const goalSize = boundingBox.getSize(new THREE.Vector3())

    goal.scale.set(
      this.size.x / goalSize.x,
      this.size.y / goalSize.y,
      this.size.z / goalSize.z
    )

    Goal.setCastShadow(goal, true)

    console.log(goal)
    this.add(goal)
  }

  createBody = () => {
    const topShape = new CANNON.Cylinder(
      this.size.y * 0.04,
      this.size.y * 0.04,
      this.size.z * settings.goal.collisionBoxMultiplayer
    )

    const leftShape = new CANNON.Cylinder(
      this.size.z * 0.03,
      this.size.z * 0.03,
      this.size.y * settings.goal.collisionBoxMultiplayer
    )

    const rightShape = new CANNON.Cylinder(
      this.size.z * 0.03,
      this.size.z * 0.03,
      this.size.y * settings.goal.collisionBoxMultiplayer
    )

    const body = new CANNON.Body()
    body.addShape(
      topShape,
      new CANNON.Vec3(
        this.position.x,
        this.position.y + this.size.y - 0.2,
        this.position.z
      ),
      new CANNON.Quaternion().setFromEuler(Math.PI / 2, 0, this.rotation.y * 2)
    )

    body.addShape(
      leftShape,
      new CANNON.Vec3(
        this.position.x +
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.sin(this.rotation.y),
        this.position.y + this.size.y / 2,
        this.position.z +
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.cos(this.rotation.y)
      ),
      new CANNON.Quaternion().setFromEuler(0, 0, 0)
    )

    body.addShape(
      rightShape,
      new CANNON.Vec3(
        this.position.x -
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.sin(this.rotation.y),
        this.position.y + this.size.y / 2,
        this.position.z -
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.cos(this.rotation.y)
      ),
      new CANNON.Quaternion().setFromEuler(0, 0, 0)
    )

    this.world.addBody(body)

    return body
  }

  static setCastShadow = (
    object: THREE.Group<THREE.Object3DEventMap>,
    shadow: boolean
  ) => {
    object.traverse((child) => {
      child.castShadow = shadow
      //child.receiveShadow = shadow
    })
  }

  update = () => {
    //this.updateCollision()
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }
}
