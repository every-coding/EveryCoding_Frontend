<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 my-3">
        <h2>Room</h2>
        <input v-model="roomId">
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="">
          <vue-webrtc ref="webrtc"
                      width="100%"
                      :roomId="roomId"
                      v-on:joined-room="logEvent"
                      v-on:left-room="logEvent"
                      v-on:opened-room="logEvent"
                      v-on:share-started="logEvent"
                      v-on:share-stopped="logEvent"
                      @error="onError" />
        </div>
        <div class="row">
          <div class="col-md-12 my-3">
            <button type="button" class="btn btn-primary" @click="onJoin">Join</button>
            <button type="button" class="btn btn-primary" @click="onLeave">Leave</button>
            <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
            <button type="button" class="btn btn-primary" @click="onShareScreen">Share Screen</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </div>
    </div>
  </div>
<!--  <div class="view">-->
<!--    <Panel :title="title">-->
<!--	    <div slot="header">-->
<!--		    <el-button type="primary" @click="createRoom = !createRoom">Create A New Room</el-button>-->
<!--		    <p style="display: inline-block; margin: 14px">Active rooms: {{num}}</p>-->
<!--      </div>-->
<!--	    <el-table-->
<!--		    :data="tableData"-->
<!--		    stripe-->
<!--		    style="width: 100%">-->
<!--		    <el-table-column-->
<!--		      prop="id"-->
<!--		      label="#"-->
<!--		      width="180">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      prop="Rid"-->
<!--		      label="Room ID"-->
<!--		      width="180">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      prop="Oid"-->
<!--		      label="Owner ID"-->
<!--		      width="180">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      prop="session"-->
<!--		      label="Session"-->
<!--		      width="180">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      prop="extra"-->
<!--		      label="Extra">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      prop="participant"-->
<!--		      label="Participants"-->
<!--		      width="180">-->
<!--		    </el-table-column>-->
<!--		    <el-table-column-->
<!--		      label="Join"-->
<!--		      width="180">-->
<!--			    <template slot-scope="scope">-->
<!--		        <el-button-->
<!--		          type="info"-->
<!--		          size="small">-->
<!--		          Join-->
<!--		        </el-button>-->
<!--		      </template>-->
<!--		    </el-table-column>-->
<!--	    </el-table>-->
<!--    </Panel>-->
<!--    <el-dialog title="Create A New Room" :visible.sync="createRoom">-->
<!--      <div>-->
<!--        <p>-->
<!--          Enter Room ID:-->
<!--        </p>-->
<!--        <el-input v-model="createRoomID"></el-input>-->
<!--        <p>-->
<!--          Enter Your Nmae:-->
<!--        </p>-->
<!--        <el-input v-model="UserID"></el-input>-->
<!--      </div>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="createRoom = false">Cancel</el-button>-->
<!--        <el-button v-if="!create" type="primary" @click="createSupervisor">Create Room</el-button>-->
<!--        <el-button v-else type="primary" @click="createSupervisor" disable>create now</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
<!--  </div>-->
</template>

<script>
import Vue from 'vue'
import { WebRTC } from 'vue-webrtc'
import * as io from 'socket.io-client'

Vue.component(WebRTC.name, WebRTC)

// import * as RTCMultiConnection from 'rtcmulticonnection'
// global.io = io
export default {
  name: 'showSupervisorList',
  components: {
    WebRTC
  },
  data () {
    return {
      img: null,
      roomId: 'public-room-v2',
      num: 0,
      test: 0,
      create: true,
      publicRoomIdentifier: 'dashboard',
      createRoom: false,
      createRoomID: '',
      UserID: '',
      connection: '',
      title: '온라인 시험 감독 서비스',
      // tableData: []
      defaultRoom: {
        id: 'No active room found for this demo',
        Rid: '',
        Oid: '',
        session: '',
        extra: '',
        participant: ''
      },
      tableData: []
    }
  },
  methods: {
    onCapture () {
      this.img = this.$refs.webrtc.capture()
    },
    onJoin () {
      this.$refs.webrtc.join()
    },
    onLeave () {
      this.$refs.webrtc.leave()
    },
    onShareScreen () {
      this.img = this.$refs.webrtc.shareScreen()
    },
    onError (error, stream) {
      console.log('On Error Event', error, stream)
    },
    logEvent (event) {
      console.log('Event : ', event)
    }
    // createSupervisor () {
    //   let self = this
    //   this.create = false
    //   if (!this.createRoomID || !this.createRoomID.replace(/ /g, '').length) {
    //     console.log('Please enter room-id.', 'Room ID Is Required')
    //     return
    //   }
    //   if (!this.UserID || !this.UserID.replace(/ /g, '').length) {
    //     console.log('Please enter your name.', 'Your Name Is Required')
    //     return
    //   }
    //   this.connection.extra.userFullName = this.UserID
    //   this.connection.checkPresence(this.createRoomID, function(isRoomExist) {
    //     if (isRoomExist === true) {
    //       console.log('This room-id is already taken and room is active. Please join instead.', 'Room ID In Use')
    //       return
    //     }
    //     self.connection.sessionid = self.createRoomID
    //     self.connection.isInitiator = true
    //   })
    // },
    // updateListOfRooms (rooms) {
    //   let self = this
    //   this.tableData = []
    //   rooms.forEach(function (room, idx) {
    //     let data = {
    //       id: idx + 1,
    //       Rid: room.sessionid,
    //       Oid: room.owner,
    //       session: JSON.stringify(room.session),
    //       extra: JSON.stringify(room.extra),
    //       participant: room.participants.length + ' peoples left'
    //     }
    //     self.tableData.push(data)
    //   })
    // },
    // looper () {
    //   let self = this
    //   this.connection.socket.emit('get-public-rooms', this.publicRoomIdentifier, function (listOfRooms) {
    //     if (listOfRooms.length > 0) {
    //       self.updateListOfRooms(listOfRooms)
    //     } else {
    //       self.tableData = []
    //       self.tableData.push(self.defaultRoom)
    //     }
    //     setTimeout(self.looper(), 3000)
    //   })
    // },
    // init () {
    //   this.connection = new RTCMultiConnection()
    //   // this.connection.socketURL = 'http://203.250.32.197:9001/'
    //   this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
    //   this.connection.publicRoomIdentifier = this.publicRoomIdentifier
    //   this.connection.socketMessageEvent = this.publicRoomIdentifier
    //   this.connection.autoCloseEntireSession = true
    //   let self = this
    //   this.connection.connectSocket(function (socket) {
    //     self.looper()
    //     socket.on('disconnect', function () {
    //       window.location.reload()
    //     })
    //   })
    // }
  },
  mounted () {
    // this.init()
  }
}
</script>
