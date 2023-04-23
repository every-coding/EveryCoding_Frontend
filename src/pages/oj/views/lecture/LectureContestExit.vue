<template>
  <div class="flex-container">
    <div id="main">
      <Panel shadow>
        <div slot="title">종료하시겠습니까?</div>
        <div slot="extra">
          <Button @click="contestExit">{{$t('m.Exit')}}</Button>
        </div>
      </Panel>
    </div>
  </div>
</template>

<script>
import api from '../../api.js'

export default {
  name: 'lecturecontestExit',
  data () {
    return {
      lectureID: '',
      contestID: '',
      contest: {},
      is_show: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.contestID = this.$route.params.contestID
      this.lectureID = this.$route.params.lectureID
    },
    contestExit () {
      api.getContestExit(this.$route.params.contestID).then(res => {
        this.contest = res.data.data
        console.log(this.contestID)
        console.log(this.lectureID)
      }).catch(() => {
      })
      this.$router.push({name: 'home'})
    }
    // ,
    // handle_toggle () {
    //   this.is_show = !this.is_show
    // }
  }
}
</script>

<style scoped lang="less">
.ivu-btn-text {
  color: #407a2d;
}
.flex-container {
  #main {
    flex: auto;
    margin-right: 18px;
    .filter {
      margin-right: -10px;
    }
  }
}
</style>
