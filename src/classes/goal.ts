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
}

const goalUrl = new URL('../assets/soccer_goal.glb', import.meta.url)

export default class Goal extends THREE.Group implements IUpdatable {
  loader: GLTFLoader
  size: THREE.Vector3

  //CANNON
  bodies: CANNON.Body[]

  constructor({ loader, position, rotation, size }: GoalProps) {
    super()

    this.loader = loader
    this.size = size
    this.position.set(position.x, position.y, position.z)
    this.rotation.set(rotation.x, rotation.y, rotation.z)

    this.loadFile()

    //CANNON
    this.bodies = this.createBody()
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

    this.add(goal)
  }

  createBody = () => {
    let bodies: CANNON.Body[] = []

    const topBar = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      shape: new CANNON.Cylinder(
        settings.goal.height * 0.04,
        settings.goal.height * 0.04,
        this.size.z * settings.goal.collisionBoxMultiplayer
      ),
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y + this.size.y - 0.2,
        this.position.z
      ),
      quaternion: new CANNON.Quaternion().setFromEuler(
        Math.PI / 2,
        0,
        this.rotation.y * 2
      ),
    })

    bodies.push(topBar)

    const leftBar = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      shape: new CANNON.Cylinder(
        settings.goal.width * 0.03,
        settings.goal.width * 0.03,
        this.size.y * settings.goal.collisionBoxMultiplayer
      ),
      position: new CANNON.Vec3(
        this.position.x +
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.sin(this.rotation.y),
        this.position.y + this.size.y / 2,
        this.position.z +
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.cos(this.rotation.y)
      ),
      quaternion: new CANNON.Quaternion().setFromEuler(0, 0, 0),
    })

    bodies.push(leftBar)

    const rightBar = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      shape: new CANNON.Cylinder(
        settings.goal.width * 0.03,
        settings.goal.width * 0.03,
        this.size.y * settings.goal.collisionBoxMultiplayer
      ),
      position: new CANNON.Vec3(
        this.position.x -
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.sin(this.rotation.y),
        this.position.y + this.size.y / 2,
        this.position.z -
          ((this.size.z * settings.goal.collisionBoxMultiplayer) / 2) *
            Math.cos(this.rotation.y)
      ),
      quaternion: new CANNON.Quaternion().setFromEuler(0, 0, 0),
    })

    bodies.push(rightBar)

    return bodies
  }

  update = () => {
    //this.updateCollision()
  }

  updateCollision = () => {
    this.bodies.forEach((body) => {
      this.position.copy(body.position)
      this.quaternion.copy(body.quaternion)
    })
  }
}
