<template>
    <div>
        <Panel title="CopyKiller based on JPlag">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Single Lecture" name="first">
                    선택 과목 CopyKiller 수행 <el-button type="primary" icon="el-icon-download" @click.native="single_download"></el-button>
                </el-tab-pane>
                <!--
                <el-tab-pane label="Multiple Lecture" name="second" :disable=check>
                    <br/>
                    <h3>다중 과목 CopyKiller 수행</h3> <el-input v-model="keyword"
                                                          prefix-icon="el-icon-search"
                                                           @keyup.enter.native="searchProblem"
                                                          placeholder="유사과목 키워드 검색">
                                                        </el-input>
                    <hr/>
                    <el-transfer
                        v-model="value"
                        :props="{
                          key: 'value',
                          label: 'desc'
                        }"
                        @change="handleChange"
                        :format="{
                          noChecked: '${total}',
                          hasChecked: '${checked}/${total}'
                        }"
                        :data="data">
                    </el-transfer>
                </el-tab-pane>
                -->
              </el-tabs>
        </Panel>
    </div>
</template>

<script>
  import utils from '@/utils/utils'

  export default {
    name: 'CopyKiller',
    components: {
    },
    data () {
      return {
        activeName: 'first',
        index_html: '',
        keyword: '',
        check: true,
        noChecked: '',
        hasChecked: '',
        problem: '',
        value: [],
        data: [{'value': 1, 'desc': 'tset1'}, {'value': 2, 'desc': 'tset2'}]
      }
    },
    mounted () {
      this.problem = this.$route.params.problemID
    },
    methods: {
      single_download () {
        let url = '/admin/problem/copy_killer?id=' + this.problem
        utils.downloadFile(url)
      },
      transferlog (a, b) {
        console.log(a, b)
      },
      handleChange (value, direction, movedKeys) {
        console.log(value, direction, movedKeys)
      },
      searchProblem () {
        console.log(this.keyword)
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