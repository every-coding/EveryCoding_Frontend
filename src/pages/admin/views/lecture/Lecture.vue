<template><!--관리자 페이지의 수강과목 생성 페이지 -->
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.LectureTitle')" required>
              <el-input v-model="lecture.title" :placeholder="$t('m.LectureTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.LectureDescription')" required>
              <Simditor v-model="lecture.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveLecture"></save>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateLecture',
    components: {
      Simditor
    },
    data () {
      return {
        title: 'Create Lecture',
        disableRuleType: false,
        lecture: {
          title: '',
          description: ''
        }
      }
    },
    methods: {
      saveLecture () {
        let funcName = this.$route.name === 'edit-lecture' ? 'editLecture' : 'createLecture'
        let data = Object.assign({}, this.lecture)
        api[funcName](data).then(res => {
          this.$router.push({name: 'lecture-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      }
    },
    mounted () {
      if (this.$route.name === 'edit-lecture') {
        this.title = 'Edit Lecture'
        api.getLecture(this.$route.params.lectureId).then(res => {
          let data = res.data.data
          this.lecture = data
        }).catch(() => {
        })
      }
    }
  }
</script>
