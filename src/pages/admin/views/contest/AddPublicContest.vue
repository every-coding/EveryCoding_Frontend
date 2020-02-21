<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="contests" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the Contest"
                    @click.native="handleAddContest(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicContest"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-contest-from-public',
    props: ['lectureID'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        contests: [],
        lecture: {},
        keyword: ''
      }
    },
    mounted () {
      api.getLecture(this.lectureID).then(res => {
        this.lecture = res.data.data
        this.getPublicContest()
      }).catch(() => {
      })
    },
    methods: {
      getPublicContest (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit
        }
        api.getContestList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.contests = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddContest (contestID) {
        let data = {
          contest_id: contestID,
          lecture_id: this.lectureID
        }
        api.addContestFromPublic(data).then(() => {
          this.$emit('on-change')
        }, () => {
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPublicProblem(this.page)
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
