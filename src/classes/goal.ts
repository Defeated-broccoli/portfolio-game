import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as CANNON from 'cannon-es'
import { settings } from '../utility/settings'

interface GoalProps {
  loader: GLTFLoader
  position: THREE.Vector3
  rotation: THREE.Euler
  scale?: THREE.Vector3
}

const goalUrl = new URL('../assets/soccer_goal.glb', import.meta.url)

export default class Goal extends THREE.Group {
  loader: GLTFLoader
  constructor({
    loader,
    position,
    rotation,
    scale = new THREE.Vector3(
      settings.goal.scale,
      settings.goal.scale,
      settings.goal.scale
    ),
  }: GoalProps) {
    super()

    this.loader = loader
    this.position.set(position.x, position.y, position.z)
    this.rotation.set(rotation.x, rotation.y, rotation.z)
    this.scale.set(scale.x, scale.y, scale.z)

    this.loadFile()
  }

  loadFile = async () => {
    const goal = await this.loader
      .loadAsync(goalUrl.href)
      .then((gltf) => gltf.scene)

    this.add(goal)
  }
}
