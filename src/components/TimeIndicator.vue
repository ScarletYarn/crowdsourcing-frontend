<template>
  <div class="panel">
    <span>做题时间 | {{ minutes }}:{{ seconds }}</span>
  </div>
</template>

<script>
export default {
  name: 'TimeIndicator',
  data() {
    return {
      remainingTime: 0,
      running: false,
      id: 0
    }
  },
  computed: {
    minutes() {
      let minutes = Math.floor(this.remainingTime / 60) + ''
      if (minutes.length < 2) minutes = '0' + minutes
      return minutes
    },
    seconds() {
      let seconds = (this.remainingTime % 60) + ''
      if (seconds.length < 2) seconds = '0' + seconds
      return seconds
    }
  },
  methods: {
    initiate() {
      this.remainingTime = 0
      this.running = true
      this.id = setTimeout(this.handler, 1000)
    },
    pause() {
      if (!this.running) return
      clearTimeout(this.id)
      this.running = false
    },
    continue() {
      if (this.running) return
      this.running = true
      this.id = setTimeout(this.handler, 1000)
    },
    handler() {
      this.remainingTime++
      if (this.remainingTime === 0) {
        this.$emit('end')
        this.running = false
      }
      if (this.running) {
        this.id = setTimeout(this.handler, 1000)
      }
    }
  }
}
</script>

<style scoped lang="sass">
.panel
  padding-top: 1em
  font-weight: 400
  font-size: 24px
</style>
