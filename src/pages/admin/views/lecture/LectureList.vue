<template>
  <div class="view">
    <Panel title="Lecture List">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="lectureList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Start Time: {{props.row.start_time | localtime }}</p>
            <p>End Time: {{props.row.end_time | localtime }}</p>
            <p>Create Time: {{props.row.create_time | localtime}}</p>
            <p>Creator: {{props.row.created_by.username}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="title"
          label="Title">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="250"
          label="Operation">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn name="Problem" icon="list-ol" @click.native="goContestProblemList(scope.row.id)"></icon-btn>
            <icon-btn name="Announcement" icon="info-circle"
                      @click.native="goContestAnnouncement(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Download Contest Submissions"
               width="30%"
               :visible.sync="downloadDialogVisible">
      <el-switch v-model="excludeAdmin" active-text="Exclude admin submissions"></el-switch>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadSubmissions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'

  export default {
    name: 'LectureList',
    data () {
      return {
        pageSize: 10,
        total: 0,
        lectureList: [],
        keyword: '',
        loading: false,
        excludeAdmin: true,
        currentPage: 1,
        currentId: 1,
        downloadDialogVisible: false
      }
    },
    mounted () {
      this.getLectureList(this.currentPage)
    },
    methods: {
      currentChange (page) {
        this.currentPage = page
        this.getContestList(page)
      },
      getLectureList (page) {
        this.loading = true
        api.getLectureList((page - 1) * this.pageSize, this.pageSize, this.keyword).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.lectureList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      openDownloadOptions (lectureId) {
        this.downloadDialogVisible = true
        this.currentId = lectureId
      },
      goEdit (lectureId) {
        this.$router.push({name: 'edit-lecture', params: {lectureId}})
      },
      handleVisibleSwitch (row) {
        api.editLecture(row)
      }
    },
    watch: {
      'keyword' () {
        this.currentChange(1)
      }
    }
  }
</script>
