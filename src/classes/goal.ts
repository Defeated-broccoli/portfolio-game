import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'
import { settings } from '../utility/settings'

interface GoalProps {
  loader: GLTFLoader
  position: THREE.Vector3
  orientation: THREE.Vector3
}

const goalUrl = new URL('../assets/soccer_goal.glb', import.meta.url)

export default class Goal {
  loader: GLTFLoader
  position: THREE.Vector3
  orientation: THREE.Vector3
  gltfScene: THREE.Group<THREE.Object3DEventMap> | undefined
  constructor({ loader, position, orientation }: GoalProps) {
    this.loader = loader
    this.position = position
    this.orientation = orientation
  }

  loadFile = async () => {
    const goal = await this.loader.loadAsync(goalUrl.href)
    this.gltfScene = goal.scene
    this.gltfScene.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    )
    this.gltfScene.quaternion.set(
      this.orientation.x,
      this.orientation.y,
      this.orientation.z,
      0
    )

    this.gltfScene.scale.set(0.01, 0.01, 0.01)
    return goal.scene
  }
}
