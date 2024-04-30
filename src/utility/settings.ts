import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export const settings = {
  player: {
    speedVelocity: 1,
    jumpVelocity: 10,
    jumpRaycastRange: 0.7,
    mass: 3,
    width: 0.3,
    height: 0.3,
    depth: 0.3,
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
    radius: 50,
    height: 1,
    segmentCount: 256,
  },
  goal: {
    numberOfGoals: 3,
    collisionBoxMultiplayer: 0.88,
  },
  debug: {
    cannonDebugger: true,
  },
}
