<template>
  <div class="flex-container" v-if="isAdmin">
    <div id="manage">
      <Panel shadow>
        <div slot="title"><b>사용자 퇴실 관리</b></div>
        <table>
          <thead>
          <tr>
            <th>이름</th>
            <th>학번</th>
            <th>퇴실 여부</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th></th>
          </tr>
          </tbody>
        </table>
      </Panel>
    </div>
  </div>
  <div class="flex-container" v-else>
    <div id="exit">
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
import { mapGetters } from 'vuex'

export default {
  name: 'lecturecontestExit',
  data () {
    return {
      lectureID: '',
      contestID: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.contestID = this.$route.params.contestID
      this.lectureID = this.$route.params.lectureID
      this.lectureTitle = this.$route.params.lectureTitle // 뭐지
      this.lectureFounder = this.$route.params.lectureFounder // 뭘까
    },
    contestExit () {
      api.getContestExit(this.$route.params.contestID).then(res => {
        console.log(this.contestID)
        console.log(this.lectureID)
      }).catch(() => {
      })
      this.$router.push({name: 'home'})
    }
  },
  computed: {
    ...mapGetters(['isAdmin', 'isSemiAdmin'])
  }
}
</script>

<style scoped lang="less">
.flex-container {
  #manage {
    flex: auto;
    margin-right: 18px;
    .filter {
      margin-right: -10px;
    }
  }
  #exit {
    flex: auto;
    margin-right: 18px;
    .filter {
      margin-right: -10px;
    }
  }
}
</style>
