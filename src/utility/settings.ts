import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export const settings = {
  player: {
    speedVelocity: 5,
    jumpVelocity: 15,
    jumpRaycastRange: Math.cbrt(1) + 0.2,
    mass: 2,
    width: 1,
    height: 1,
    depth: 1,
  },
  engine: {
    gravity: new CANNON.Vec3(0, -9.81, 0),
    timeStep: 1 / 60,
  },
  ball: {
    mass: 0.2,
    radius: 3,
    segmentCount: 64,
  },
  ground: {
    radius: 50,
    height: 1,
    segmentCount: 256,
  },
  goal: {
    numberOfGoals: 3,
    collisionBoxMultiplayer: 0.88,
  },
  debug: {
    cannonDebugger: false,
  },
  wall: {
    segmentCount: 14,
  },
}
