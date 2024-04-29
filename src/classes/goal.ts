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
  body: CANNON.Body

  constructor({ loader, position, rotation, size }: GoalProps) {
    super()

    this.loader = loader
    this.size = size
    this.position.set(position.x, position.y, position.z)
    this.rotation.set(rotation.x, rotation.y, rotation.z)

    this.loadFile()

    //CANNON
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

    this.add(goal)
  }

  createBody = () => {
    const topBar = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      shape: new CANNON.Cylinder(1, 1, this.size.x),
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y + this.size.y - 0.05
      ),
      //quaternion: new CANNON.Quaternion().setFromEuler(0, 0, 0),
    })

    return topBar
  }

  update = () => {
    //this.updateCollision()
  }

  updateCollision = () => {
    this.position.copy(this.body.position)
    this.quaternion.copy(this.body.quaternion)
  }
}
