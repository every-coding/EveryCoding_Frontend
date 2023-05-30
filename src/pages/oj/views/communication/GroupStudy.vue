<template>
  <main>
    <div id="roomcreation">
      <span><b>{{$t('m.RoomCreation')}}</b></span>
      <input
        id="roomCreateInputField"
        v-model="roomName"
        type="text"
        :placeholder="$t('스터디 코드 명')">
      <button
        data-test-id="button-create-room"
        :disabled="jitsi || (cleanup(roomName).length === 0)"
        @click="onCreate">
        {{ $t('create') }}
      </button>
      <div
        v-show="jitsi"
        ref="jitsiInterface"
        class="jitsiInterface"
      />
    </div>
    <div id="roomselection">
      <span><b>{{$t('m.RoomSelection')}}</b></span>
      <input
        id="roomEnterInputField"
        v-model="channelID"
        type="text"
        :placeholder="$t('스터디 코드 명')">
      <button
        data-test-id="button-enter-room"
        :disabled="jitsi || (cleanup(channelID).length === 0)"
        @click="onJoin">
        {{$t('m.Selection')}}
      </button>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import api from '@oj/api'

const domain = 'meet.jit.si'

export default {
  i18nOptions: {
    namespaces: 'app',
    keyPrefix: 'jitsi'
  },

  name: 'JitsiBridge',

  params: {
    user: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      channelID: '',
      roomName: '',
      jitsi: null,
      channels: null
    }
  },

  destroyed () {
    this.dispose()
  },

  mounted () {
    this.loadScript(`https://meet.jit.si/external_api.js`, () => {
      if (!window.JitsiMeetExternalAPI) throw new Error('Jitsi Meet External API not loaded')
    })
  },

  methods: {
    loadScript (src, callback) {
      const script = document.createElement('script')
      script.src = src
      script.addEventListener('load', callback)
      script.addEventListener('error', () => {
        throw new Error(`Failed to load script ${src}`)
      })
      document.head.appendChild(script)
    },
    dispose () {
      if (this.jitsi) {
        this.jitsi.dispose()
        this.jitsi = null
      }
    },

    cleanup (str) {
      return str.replace(/[^a-z0-9+]+/gi, '')
    },

    onJoin () {
      this.open({
        roomName: this.channelID,
        userDisplayName: this.roomName
      })
    },

    onCreate () {
      this.open({
        roomName: this.roomName,
        userDisplayName: this.roomName
      })
    },

    onClose () {
      this.dispose()
    },

    removeJitsiAfterHangup () {
      this.dispose()
    },

    open ({ roomName, userDisplayName } = {}) {
      this.dispose()

      const $t = (k) => this.$t(k)

      /* eslint-disable no-undef */
      this.jitsi = new JitsiMeetExternalAPI(domain, {
        roomName: `Every-coding_${this.cleanup(roomName || 'unnamed')}`,
        width: '100%',
        height: '100%',
        parentNode: this.$refs.jitsiInterface,
        interfaceConfigOverwrite: {
          DEFAULT_BACKGROUND: '#232323',
          SHOW_JITSI_WATERMARK: true,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          DEFAULT_REMOTE_DISPLAY_NAME: $t('jitsi.defaultRemoteDisplayName'),
          DEFAULT_LOCAL_DISPLAY_NAME: userDisplayName || $t('jitsi.defaultLocalDisplayName'),
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'profile',
            'info',
            'recording',
            'settings',
            'tileview',
            'videoquality',
            'filmstrip',
            'invite',
            'shortcuts'
          ],
          SETTINGS_SECTIONS: [
            'devices',
            'language',
            'moderator',
            'profile',
            'calendar'
          ]
        }
      })

      // add an event listner to remove jitsi after the local party has hung up the call.
      // this is to remove the page that mentions slack after the rating page.
      this.jitsi.addEventListeners({
        readyToClose: this.removeJitsiAfterHangup
      })

      const numberOfParticipants = this.jitsi.getNumberOfParticipants()
      console.log('wow1')
      console.log(numberOfParticipants)
      console.log('wow2')
      api.getNumOfParticipants(numberOfParticipants).then(res => {
        console.log('wow3')
        console.log(numberOfParticipants)
        console.log('wow4')
      }, () => {
      })

      window.jitsi = this.jitsi
    }
  }
}
</script>
<style scoped lang="less">
main {
  overflow: auto;
  height: 100vh;

  .logo {
    text-align: center;
    margin-top: 4rem;
    img {
      max-width: 200px;
    }
  }

  .jitsiInterface {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #232323;

    & > iframe {
      flex: 1 1 auto;
    }
  }

  #roomcreation {
    max-width: 400px;
    margin: 50px auto;
    padding: 50px;
    background: white;
    font-size: 20px;
  }

  #roomselection {
    max-width: 400px;
    margin: 50px auto;
    padding: 50px;
    background: white;
    font-size: 20px;
  }

  input {
    height: 30px;
    width: 100%;
    border: 1px solid #ccc;
    padding-left: 10px;
    font-size: 14px;
    display: block;
    margin-top: 10px;
    box-sizing: border-box;
  }

  select {
    height: 30px;
    width: 100%;
    margin-top: 10px;
    background: transparent;
    padding-left: 10px;
    font-size: 14px;
    border-radius: 0;
    appearance: none;
    border: 1px solid #ccc;
  }

  #roomdropdown::after {
    border: 4px dashed transparent;
    border-top: 4px solid #ccc;
    content: "";
    display: inline-block;
    float: right;
    margin-right: 10px;
    margin-top: -15px;
  }

  select:focus,
  input:focus {
    outline: none;
  }

  button {
    cursor: pointer;
    background: transparent;
    color: #407a2d;
    font-size: 14px;
    line-height: 38px;
    text-decoration: none;
    display: block;
    width: 150px;
    text-align: center;
    height: 40px;
    margin: 20px auto 0;
    transition: color .2s,background-color .2s;
    border: 1px solid #407a2d;
    &:hover {
      border: 1px solid #407a2d;
      background: #407a2d;
      color: #fff;
    }
    &:disabled {
      cursor: not-allowed;
      color: #ccc;
      border-color: #ccc;
      &:hover {
        background: transparent;
      }
    }
  }

  h4 {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 30px 0;
    color: #ccc;
    &:before,
    &:after {
      content: '';
      border-top: 1px solid #ccc;
      margin: 0 20px 0 0;
      flex: 1 0 20px;
    }
    &:after {
      margin: 0 0 0 20px;
    }
  }
}

</style>
