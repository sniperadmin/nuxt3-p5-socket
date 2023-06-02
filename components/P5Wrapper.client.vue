<template>
  <p5 :sketch="sketch" />
</template>

<script lang="ts" setup>
const props = defineProps(['sketch'])
const sketch = props.sketch
</script>

<script lang="ts">
export default {
  name: "P5Wrapper"
}
</script>

<style scoped>

</style>
