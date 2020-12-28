<template>
    <div>
        <Panel title="CopyKiller based on JPlag">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Single Lecture" name="first">
                    <div v-loading="loading">
                        선택 과목 CopyKiller 수행 <el-button type="primary" icon="el-icon-download" @click.native="single_download"></el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Multiple Lecture" name="second" :disable=check>
                    <br/>
                    <el-row>
                        <el-col :span="4">
                            <h3 style="margin: 10px">다중 과목 CopyKiller 수행</h3>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="keyword"
                              prefix-icon="el-icon-search"
                               @keyup.enter.native="searchProblem"
                              placeholder="유사과목 키워드 검색">
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="small" style="margin: 4px"
                                       @click="searchProblem" icon="el-icon-search">검색
                            </el-button>
                        </el-col>
                    </el-row>
                    <hr/>
                    <el-transfer
                        style="width: auto;"
                        v-loading="loading"
                        v-model="value"
                        :props="{
                          key: 'value',
                          label: 'desc'
                        }"
                        :titles="['검색 리스트', 'CopyKiller 대상']"
                        @change="handleChange"
                        :format="{
                          noChecked: '${total}',
                          hasChecked: '${checked}/${total}'
                        }"
                        :data="data">
                        <el-button class="transfer-footer" slot="right-footer" @click="multiple_download" size="small">CopyKiller 실행</el-button>
                    </el-transfer>
                </el-tab-pane>
              </el-tabs>
        </Panel>
    </div>
</template>

<script>
  import utils from '@/utils/utils'
  import api from '../../api'

  export default {
    name: 'CopyKiller',
    components: {
    },
    data () {
      return {
        loading: false,
        activeName: 'first',
        index_html: '',
        keyword: '',
        check: true,
        Checked: [],
        problem: '',
        value: [0],
        data: [],
        defaultData: []
      }
    },
    mounted () {
      this.problem = this.$route.params.problemID
      this.init()
    },
    methods: {
      init () {
        api.getProblem(this.problem).then(res => {
          console.log(res)
          this.data = [{'value': 0, 'id': res.data.data.id, 'disabled': true, 'desc': res.data.data.contest.created_by.realname + '-' + res.data.data.contest.lecture_title + '_' + res.data.data.title}]
          this.defaultData = this.data
        }).catch(() => {
        })
      },
      single_download () {
        this.loading = true
        let url = '/admin/problem/copy_killer?id=' + this.problem + '&'
        utils.downloadFile(url)
        this.loading = false
      },
      multiple_download () {
        let url = '/admin/problem/copy_killer?'
        for (let id in this.Checked) {
          url += 'id=' + this.data[id].id + '&'
        }
        utils.downloadFile(url)
        console.log(url)
      },
      handleChange (value, direction, movedKeys) {
        this.Checked = value
        console.log(value, direction, movedKeys)
      },
      searchProblem () {
        this.data = this.defaultData
        api.copy_killer(this.keyword, this.problem).then(res => {
          this.data = this.data.concat(res.data.data)
        }).catch(() => {
        })
      },
      handleClick (tab, event) {
        console.log(tab, event)
      }
    },
    watch: {
      'keyword' () {
      }
    }
  }
</script>

<style>
.el-transfer-panel {
  min-width: 200px;
  width: 500px;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
</style>