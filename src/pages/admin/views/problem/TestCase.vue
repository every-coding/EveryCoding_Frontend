<template>
  <div class="testcase">
    <div>
      Zip파일 선택 : <input id="fileForUpload" type="file" name="zipfilename" onchange="myOnChangeFile(event)" />
    </div>
  </div>

</template>

<script>
  export default {
    name: 'TestCase',
    data () {
      return {
        pageSize: 20
      }
    },
    methods: {
      goHome () {
        this.$router.push({
          name: 'home'
        })
      }
    },
    myOnChangeFile (evt) {
      var file = document.getElementByld("fileForUpload").files[0]
      if (file) {
        var reader = new FileReader()
      }
    }
  }
</script>

<style lang="less" scoped>

</style>

