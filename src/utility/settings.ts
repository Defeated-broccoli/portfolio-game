import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export const settings = {
  player: {
    speedVelocity: 1.5,
    jumpVelocity: 10,
    jumpRaycastRange: 0.5,
    mass: 3,
    width: 1,
    height: 1,
    depth: 1,
  },
  engine: {
    gravity: new CANNON.Vec3(0, -9.81, 0),
    timeStep: 1 / 60,
  },
  ball: {
    mass: 0.5,
    radius: 0.5,
    segmentCount: 64,
  },
  ground: {
    radius: 20,
    height: 1,
    segmentCount: 256,
  },
}
