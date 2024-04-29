import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'
import { settings } from '../utility/settings'

interface GoalProps {
  loader: GLTFLoader
  position: THREE.Vector3
  rotation: THREE.Euler
  size: THREE.Vector3
}

const goalUrl = new URL('../assets/soccer_goal.glb', import.meta.url)

export default class Goal extends THREE.Group {
  loader: GLTFLoader
  size: THREE.Vector3
  constructor({ loader, position, rotation, size }: GoalProps) {
    super()

    this.loader = loader
    this.size = size
    this.position.set(position.x, position.y, position.z)
    this.rotation.set(rotation.x, rotation.y, rotation.z)

    this.loadFile()
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
}
