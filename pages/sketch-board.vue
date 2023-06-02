<template>
  <p>
    socket connection => {{status}}
  </p>
  <p>
    click and drag with mouse to draw something
  </p>
  <p> Please join with other device if you like multi-interaction</p>
  <P5Wrapper :sketch="startGame" />
</template>

<script lang="ts">
export default {
  name: "SketchBoard"
}
</script>

<script lang="ts" setup>
import p5 from 'p5'
import {useWebSocket} from "@vueuse/core";

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
const { ws, status, send } = useWebSocket(`${wsProtocol}//nash-dev.local:3000`)
const router = useRouter()

const startGame = (p5: p5) => {
  p5.setup = () => {
    const back = p5.createButton('back')
    p5.createCanvas(p5.windowWidth, 400)
    p5.background(200)
    ws.value!.onmessage = ({ data }) => drawFromData(data)
    back.mousePressed(() => {
      destroyGame()
      router.back()
    })
  }

  function destroyGame () {
    // NOTE: comment out the following if you use engine
    // Composite.clear(engine.world, false, true)
    // Engine.clear(engine)
    // clearTimeout(fireTimer)
    p5.remove()
  }

  async function drawFromData(data: any) {
    const result = JSON.parse(await data.text())
    p5.noStroke()
    p5.fill(200, 0, 100)
    p5.ellipse(result.x, result.y, 5, 5)
  }

  p5.mouseDragged = () => {
    const data = JSON.stringify({ x: p5.mouseX, y: p5.mouseY })
    send(data)
    p5.noStroke()
    p5.fill(200, 0, 100)
    p5.ellipse(p5.mouseX, p5.mouseY, 5, 5)
  },
  p5.draw = () => {}
}
</script>

<style scoped>

</style>
