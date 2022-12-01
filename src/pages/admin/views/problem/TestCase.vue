<template>
  <div class="testcase">
    <p>it will be testcae.viue</p>
  </div>

</template>

<script>
  export default {
    name: 'TestCase',
    methods: {
      goHome () {
        this.$router.push({
          name: 'home'
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

