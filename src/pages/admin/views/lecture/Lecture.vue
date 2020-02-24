<template>
    <!--관리자 페이지의 수강과목 생성 페이지 -->
    <div class="view">
        <Panel :title="title">
            <el-form label-position="top">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item :label="$t('m.LectureTitle')" required="required">
                            <el-input v-model="lecture.title" :placeholder="$t('m.LectureTitle')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="$t('m.LectureDescription')" required="required">
                            <Simditor v-model="lecture.description"></Simditor>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('m.LectureStatus')">
                            <el-switch v-model="lecture.status" active-text="" inactive-text=""></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('m.Lecture_Password')">
                            <el-input v-model="lecture.password" active-text="" inactive-text=""></el-input>
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
          description: '',
          status: false,
          password: '',
          contestlist: [{
            value: ''
          }]
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
      },
      addContest () {
        this.lecture.contestlist.push({value: ''})
      },
      removeContest (range) {
        let index = this.contest.contestlist.indexOf(range)
        if (index !== -1) {
          this.lecture.contestlist.splice(index, 1)
        }
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
      } else if (this.$route.name === 'lecture-contest-list') {
        this.title = 'Add Lecture'
      }
    }
  }
</script>
