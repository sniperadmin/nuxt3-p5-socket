<template>
<!--  <nuxt-link to="/">Go back</nuxt-link>-->
  <P5Wrapper :sketch="startGame" />
</template>

<script lang="ts">
export default {
  name: "AngryBirdsView"
}
</script>

<script lang="ts" setup>
import p5 from 'p5'
import {Composite, Engine, Events, Mouse, MouseConstraint, World} from "matter-js";
import {Bird, Box, Ground, Slingshot} from "~/utils/types";
import {useRouter} from "#app";

function distance(posA: { x: number, y: number }, posB: { x: number, y: number }) {
  const x = Math.abs(posB.x - posA.x);
  const y = Math.abs(posB.y - posA.y);
  return Math.sqrt(x*x + y*y);
}

let gameConfig: { birdOrigin: { x: number, y: number } } = { birdOrigin: {x:0,y:0} },
    engine: Engine,
    ground: Ground,
    mouseConstraint: MouseConstraint,
    boxes: Array<Box> = [],
    bird: Bird,
    birdImg: any,
    blockImg: any,
    slingshot: Slingshot,
    slingshotSound: any,
    fireTimer: NodeJS.Timeout,
    firing: boolean
// slingStretchSfx: any

const destroyGame = (p5: p5) => {
  Composite.clear(engine.world, false, true)
  Engine.clear(engine)
  clearTimeout(fireTimer)
  p5.remove()
}

const loadGame = (p5: p5, canvas: p5.Renderer) => {
  if (engine) {
    Composite.clear(engine.world, false, true)
    Engine.clear(engine)
    clearTimeout(fireTimer)
  }

  engine = Engine.create()
  const world = engine.world
  ground = new Ground(p5, world, null,p5.width / 2, p5.height - 20, p5.width, 20)

  for (let i = 0; i < 3; i++) {
    boxes[i] = new Box(p5, world, blockImg, p5.windowWidth - 150, 300 - i * 75, 50, 75)
  }

  //  Birds
  gameConfig.birdOrigin = { x: 350, y: p5.height - 120 }
  bird = new Bird(p5, engine, [birdImg], gameConfig.birdOrigin.x, gameConfig.birdOrigin.y)
  slingshot = new Slingshot(p5, world, 350, 200, bird.body)

  //  mouse
  const mouse = Mouse.create(canvas.elt)
  mouseConstraint = MouseConstraint.create(engine, { mouse })
  World.add(world, mouseConstraint)

  // TODO: add after fixing sound
  Events.on(mouseConstraint, 'startdrag', function(e) {
    if (e.body === bird.body) slingshotSound.play()
  })

  Events.on(mouseConstraint, 'enddrag', function(e) {
    if (e.body === bird.body) firing = true
  })

  Events.on(engine, 'afterUpdate', function() {
    const birdPos = bird.body.position
    if (firing && distance(birdPos, gameConfig?.birdOrigin) < bird.config.radius + 20) {
      clearTimeout(fireTimer)
      slingshot.detach()
      console.log('should be detached')
      firing = false
      fireTimer = setTimeout(() => {
        World.remove(world, bird.body)
        bird = new Bird(p5, engine, [birdImg], gameConfig.birdOrigin.x, gameConfig.birdOrigin.y)
        slingshot.attach(bird.body)
      }, 3000)
    }
  })

  // TODO: add this when creating enemy pigs
  // Events.on(engine, 'collisionActive', function(e) {
  //   if (pig) {
  //     const birdHit = SAT.collides(bird.body, pig.body).collided;
  //     const onGround = SAT.collides(ground.body, pig.body).collided
  //     if (birdHit || onGround) {
  //       pig.destroy();
  //       pig = null;
  //     }
  //   }
  // })
}

const router = useRouter()

const startGame = (p5: p5) => {
  p5.preload = () => {
    birdImg = p5.loadImage('/bird1.png')
    blockImg = p5.loadImage('/block.jpg')
  }

  p5.setup = () => {
    const back = p5.createButton('back')
    const canvas = p5.createCanvas(p5.windowWidth - 20, 400)
    loadGame(p5, canvas)
    back.mousePressed(() => {
      destroyGame(p5)
      router.back()
    })

    const reset = p5.createButton('reset')
    reset.mousePressed(() => loadGame(p5, canvas))
  }

  p5.draw = () => {
    p5.background(250)
    Engine.update(engine)
    ground.show()
    for (let box of boxes) { box.show() }
    slingshot.show()
    bird.show()
  }
}
</script>

<style scoped>

</style>
