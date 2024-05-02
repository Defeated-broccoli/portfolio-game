import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { settings } from '../utility/settings'

interface WallProps {
  radius: number
  height: number
  position: THREE.Vector3
  scene: THREE.Scene
  world: CANNON.World
}

export default class Wall {
  radius: number
  height: number
  position: THREE.Vector3
  scene: THREE.Scene
  world: CANNON.World

  constructor({ radius, height, position, scene, world }: WallProps) {
    this.radius = radius
    this.height = height
    this.position = position
    this.scene = scene

    //CANNON
    this.world = world

    this.createBody()
  }

  createBody = () => {
    const radius = settings.ground.radius - 1
    const segmentCount = settings.wall.segmentCount
    const vertices = []
    const faces = []

    // Create vertices for the dome
    for (let i = 0; i <= segmentCount; i++) {
      const phi = (Math.PI / 2) * (i / segmentCount)
      for (let j = 0; j <= segmentCount; j++) {
        const theta = 2 * Math.PI * (j / segmentCount)
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)
        vertices.push(new CANNON.Vec3(x, y, z))
      }
    }

    // Create faces for the dome
    for (let i = 0; i < segmentCount; i++) {
      for (let j = 0; j < segmentCount; j++) {
        const v1 = i * (segmentCount + 1) + j
        const v2 = v1 + 1
        const v3 = (i + 1) * (segmentCount + 1) + j
        const v4 = v3 + 1
        faces.push([v1, v2, v4])
        faces.push([v1, v3, v4])
      }
    }

    // Create ConvexPolyhedron shape
    const poly = new CANNON.ConvexPolyhedron({
      vertices,
      faces,
      //boundingSphereRadius: radius,
    })
    this.world.addBody(
      new CANNON.Body({
        shape: poly,
        type: CANNON.BODY_TYPES.STATIC,
        mass: 0,
        quaternion: new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0),
        collisionResponse: true,
        position: new CANNON.Vec3(0, -1, 0),
      })
    )
  }
}
