<template>
  <div>
    <div v-if="playerStatus && programStatus" class="player relative">
      <div v-if="programStatus.currentState !== 'DESCRIPTION'" class="grid" :style="{ ...gridStyle }">
        <div v-for="(screen, i) in playerStatus.screens" :key="`${screen.index}_${i}`" class="video-wrapper">
          <div
            v-if="screen.src && (programStatus.userRole === 'GYM' || programStatus.userRole === 'SUBGYM') && (programStatus.currentState === 'PLAYING')"
            class="absolute right-0 top-0 bg-black text-white text-3xl flex items-center justify-center border-l border-b"
            style="width: 80px; height: 80px"
          >
            {{ screen.index + 1 }}
          </div>
          <div v-if="screen.src" class="video">
            <video
              ref="videos"
              :muted="programStatus.currentState !== 'WARMUP'"
              :src="screen.src.filePath"
              loop
              preload="auto"
            />
          </div>
          <div v-else-if="programStatus.coverImageType === 'VIDEO'" class="image">
            <video :src="programStatus.coverImage" muted loop autoplay playsinline />
          </div>
          <div v-else class="image">
            <img :src="programStatus.coverImage || logo">
          </div>
        </div>
      </div>
      <div
        v-if="programStatus.currentState === 'DESCRIPTION' || programStatus.currentState === 'MIDDLE_DESCRIPTION'"
        class="w-screen h-screen fixed top-0 z-10 flex"
      >
        <div class="w-full h-full bg-black">
          <video ref="video" class="w-full h-full" :src="playerStatus.screens[0].src.filePath" loop muted />
        </div>
      </div>
      <div class="w-screen h-screen fixed top-0 z-20">
        <div
          v-if="programStatus.currentState === 'READY' && (programStatus.userRole === 'CUSTOMER' || programStatus.userRole === 'SUBGYM')"
          class="fixed top-2/3 left-1/2 text-white bg-black transform -translate-x-1/2 -translate-y-1/2 text-2xl font-1 p-4 rounded-md z-30 cursor-pointer select-none"
          @click="commandPlay"
        >
          {{ programStatus.userRole === 'CUSTOMER' ? (clickedStartButton ? `${remainTimerSeconds}초 후에 시작 합니다!` : '여기를 클릭하여 시작하세요') : '컨트롤러에서 시작을 눌러주세요' }}
        </div>
        <div
          v-if="programStatus.currentState === 'FINISHED' || programStatus.paused"
          class="fixed top-1/2 left-1/2 text-white bg-black transform -translate-x-1/2 -translate-y-1/2 text-2xl font-1 p-4 rounded-md z-30"
        >
          {{ programStatus.currentState === 'FINISHED' ? '운동이 종료되었습니다. 수고하셨습니다.' : '일시 정지 되었습니다.' }}
        </div>
        <div v-if="showTimer" class="timer aspect-w-1 aspect-h-1" :class="{ 'big-timer': bigTimer }" :style="{ 'opacity': programStatus.currentState === 'WAIT_NEXT' ? '0.6' : '0.9' }">
          <div class="timer__count">
            <div class="base-timer">
              <svg
                class="base-timer__svg"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g class="base-timer__circle">
                  <circle
                    class="base-timer__path-elapsed"
                    cx="50"
                    cy="50"
                    r="45"
                  />
                  <path
                    :stroke-dasharray="timerCircleDashArray"
                    class="base-timer__path-remaining"
                    :style="{ color: timerRemainColor }"
                    d="
                      M 50, 50
                      m -45, 0
                      a 45,45 0 1,0 90,0
                      a 45,45 0 1,0 -90,0
                    "
                  />
                </g>
              </svg>
              <span class="base-timer__label big-timer__label">
                {{ timerTime }}
              </span>
            </div>
          </div>
          <div class="timer__description font-1 border-b">
            {{ timerDescription }}
          </div>
          <div class="timer__description font-1">
            다음: {{ nextStepDescription }}
          </div>
          <div
            v-if="programStatus.currentState === 'DESCRIPTION' || programStatus.currentState === 'MIDDLE_DESCRIPTION'"
            class="timer__description font-1 cursor-pointer"
            style="font-size: 1rem"
            @click="commandSkip"
          >
            여기를 클릭하여 스킵
          </div>
        </div>
        <div
          class="breaktime-background"
          :class="{ on: showVeil }"
          :style="{ 'background-image': `url('${veilImage}')` }"
        />
      </div>
      <play-meter
        :program-status="programStatus"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'nuxt-property-decorator'
import type { NuxtSocket } from 'nuxt-socket-io'
import PlayMeter, { PlayerStatus, ProgramState, ProgramStatus } from '@/components/play-meter.vue'
import SessionMixin from '@/mixins/session'

@Component({ components: { PlayMeter }, mixins: [SessionMixin], middleware: ['authenticated'] })
export default class Player extends Vue {
  sessionStatus: any = null
  programStatus: ProgramStatus | null = null
  playerStatus: PlayerStatus | null = null
  socket!: NuxtSocket
  timer?: NodeJS.Timer
  timerSeconds: number = 0
  remainTimerSeconds: number = 0
  background: string = ''
  clickedStartButton = false
  logo = require('~/assets/logo.png')
  beep = false

  @Ref() readonly videos!: HTMLVideoElement[]

  breakTimeBackground = ''

  get user () {
    return this.$store.state.user
  }

  get gridStyle () {
    if (!this.playerStatus) {
      return {}
    }

    if (this.playerStatus.screens.length === 1) {
      return {
        'grid-template-rows': 'repeat(1, 100%)',
        'grid-template-columns': 'repeat(1, 100%)'
      }
    }

    const rows = Math.round(Math.log2(this.playerStatus.screens.length))
    const columns = Math.ceil(this.playerStatus.screens.length / rows)

    return {
      'grid-template-columns': `repeat(${rows}, ${100 / rows}%)`,
      'grid-template-rows': `repeat(${columns}, ${100 / columns}%)`
    }
  }

  get gridSize () {
    if (!this.playerStatus) {
      return 0
    }

    const columns = Math.round(Math.log2(this.playerStatus.screens.length))
    const rows = Math.ceil(this.playerStatus.screens.length / columns)

    return columns * rows
  }

  get isShowScreenNum () {
    if (this.programStatus?.currentState === ProgramState.PLAYING_WARMUP) {
      return true
    }

    if (this.programStatus?.userRole === 'GYM') {
      return true
    }

    return false
  }

  get showTimer () {
    switch (this.programStatus?.currentState) {
      case ProgramState.DESCRIPTION:
      case ProgramState.COUNTDOWN:
      case ProgramState.PLAYING_WARMUP:
      case ProgramState.PLAYING_WORKOUT:
      case ProgramState.PREPARE:
      case ProgramState.BREAKING_SET:
      case ProgramState.MIDDLE_DESCRIPTION:
      case ProgramState.BREAKING_WORKOUT:
        return true

      case ProgramState.WAIT_NEXT:
        if (this.programStatus?.reservations.length) {
          return true
        }
    }

    return false
  }

  get timerRemainColor () {
    switch (this.programStatus?.currentState) {
      case ProgramState.BREAKING_SET:
      case ProgramState.BREAKING_WORKOUT:
        return 'red'
    }

    return 'rgb(0, 182, 100)'
  }

  get showVeil () {
    switch (this.programStatus?.currentState) {
      case ProgramState.BREAKING_SET: {
        if (this.timerSeconds - this.remainTimerSeconds < 2) {
          return true
        }
        break
      }
      case ProgramState.READY:
      case ProgramState.COUNTDOWN:
      case ProgramState.PREPARE:
      case ProgramState.BREAKING_WORKOUT:
      case ProgramState.FINISHED:
        return true
    }

    return false
  }

  get veilImage () {
    if (!this.programStatus) {
      return ''
    }

    const state = this.programStatus.currentState

    if (this.user?.subGymImage && this.programStatus.userRole === 'SUBGYM') {
      this.logo = this.user.subGymImage.filePath || this.logo

      if (this.logo[0] !== '/') {
        this.logo = '/' + this.logo
      }
    } else {
      this.logo = this.programStatus.coverImage || this.logo
    }

    if (state === ProgramState.READY) {
      return this.programStatus.coverImage || this.logo
    }
    if (state === ProgramState.COUNTDOWN) {
      return this.programStatus.coverImage || this.logo
    }
    if (state === ProgramState.PREPARE) {
      if (this.remainTimerSeconds < 2) {
        return require('~/assets/lets_go.jpeg')
      }

      if (this.remainTimerSeconds < 4) {
        return require('~/assets/are_you_ready.jpeg')
      }
      return this.programStatus.warmupBreakTimeImage || this.logo
    }
    if (state === ProgramState.BREAKING_WORKOUT) {
      return this.programStatus.workoutBreakTimeImage || this.logo
    }
    if (state === ProgramState.BREAKING_SET) {
      return this.programStatus.setBreakTimeImage || require('~/assets/breaktime.jpeg')
    }
    if (state === ProgramState.FINISHED) {
      return require('~/assets/finish.jpeg')
    }

    return this.logo
  }

  get timerDescription () {
    if (!this.programStatus) {
      return ''
    }

    const state = this.programStatus.currentState
    if (state === ProgramState.DESCRIPTION) {
      return '프로그램 설명'
    }
    if (state === ProgramState.MIDDLE_DESCRIPTION) {
      return '운동 설명'
    }
    if (state === ProgramState.COUNTDOWN) {
      return '준비하세요!'
    }
    if (state === ProgramState.PLAYING_WARMUP) {
      return `준비운동 ${this.programStatus.warmupCount + 1}`
    }
    if (state === ProgramState.PREPARE) {
      return '시작합니다!'
    }
    if (state === ProgramState.PLAYING_WORKOUT) {
      return '운동'
    }
    if (state === ProgramState.BREAKING_SET) {
      return '쉬는 시간'
    }
    if (state === ProgramState.BREAKING_WORKOUT) {
      return '대기'
    }
    if (state === ProgramState.WAIT_NEXT) {
      return '기다리는중'
    }
  }

  get nextStepDescription () {
    if (!this.programStatus) {
      return ''
    }

    const state = this.programStatus.currentState

    if (state === ProgramState.DESCRIPTION) {
      return '준비하세요!'
    }
    if (state === ProgramState.MIDDLE_DESCRIPTION) {
      return '운동'
    }
    if (state === ProgramState.COUNTDOWN) {
      if (this.programStatus.userRole === 'SUBGYM') {
        return '운동'
      } else {
        return '준비하세요!'
      }
    }
    if (state === ProgramState.PLAYING_WARMUP) {
      if (this.sessionStatus.workoutProgram.warmUpVideos?.length - 1 === this.programStatus.warmupCount) {
        return '준비하세요!'
      }

      return `준비운동 ${this.programStatus.warmupCount + 2}`
    }
    if (state === ProgramState.PREPARE) {
      return '운동'
    }
    if (state === ProgramState.PLAYING_WORKOUT) {
      return '대기'
    }
    if (state === ProgramState.BREAKING_SET) {
      return '운동'
    }
    if (state === ProgramState.BREAKING_WORKOUT) {
      return '운동'
    }
    if (state === ProgramState.WAIT_NEXT) {
      return '프로그램 시작'
    }
  }

  get bigTimer () {
    if (!this.programStatus) {
      return false
    }

    const state = this.programStatus.currentState

    if (state === ProgramState.COUNTDOWN) {
      return true
    }

    if (state === ProgramState.WAIT_NEXT) {
      if (this.programStatus?.reservations.length) {
        return true
      }
    }

    return false
  }

  get timerCircleDashArray () {
    return `${(((this.remainTimerSeconds) / this.timerSeconds) * 283).toFixed(0)} 283`
  }

  get timerTime () {
    const hours = Math.floor(this.remainTimerSeconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((this.remainTimerSeconds / 60) % 60).toString().padStart(2, '0')
    const seconds = Math.floor(this.remainTimerSeconds % 60).toString().padStart(2, '0')

    if (this.remainTimerSeconds >= 3600) {
      return `${hours}:${minutes}:${seconds}`
    }

    if (this.remainTimerSeconds >= 60) {
      return `${minutes}:${seconds}`
    }

    return seconds
  }

  play () {
    if (!this.videos) {
      return
    }

    for (const video of this.videos) {
      video.play()
    }
    (this.$refs.video as HTMLVideoElement)?.play()
  }

  stopAll (currentTime?: number) {
    if (!this.videos) {
      return
    }

    for (const video of this.videos) {
      video.pause()

      if (typeof currentTime === 'number') {
        video.currentTime = currentTime
      }
    }
    (this.$refs.video as HTMLVideoElement)?.pause()
  }

  commandPlay () {
    if (this.clickedStartButton) {
      return
    }

    this.clearTimer()

    this.clickedStartButton = true
    this.remainTimerSeconds = 5
    this.timer = setInterval(() => {
      if (this.remainTimerSeconds > 0) {
        this.remainTimerSeconds--
      } else {
        this.clearTimer()
        this.socket.emit('command:play')
        this.clickedStartButton = false
      }
    }, 1000)
  }

  commandSkip () {
    this.clearTimer()
    this.stopAll()
    this.socket.emit('command:skip')
  }

  notifyPlayerStatus () {
    if (!this.videos) {
      return
    }

    this.socket.emit('notify:playerStatus')
  }

  notifyInitPlayer () {
    this.socket.emit('notify:playerInit')
  }

  notifyJoin () {
    this.socket.emit('notify:playerJoin')
  }

  startTimer () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.beep = false
      switch (this.programStatus?.currentState) {
        case ProgramState.WAIT_NEXT:
          if (this.remainTimerSeconds < 10) {
            this.beep = true
          }
          break
        case ProgramState.PLAYING_WARMUP:
        case ProgramState.PLAYING_WORKOUT:
          if (this.remainTimerSeconds < 2) {
            this.beep = true
          }
          break
        case ProgramState.BREAKING_SET:
        case ProgramState.PREPARE:
          if (this.remainTimerSeconds < 4) {
            this.beep = true
          }
          break
      }

      if (this.programStatus?.userRole === 'GYM' || this.programStatus?.userRole === 'SUBGYM') {
        if (this.programStatus?.currentState === ProgramState.BREAKING_SET) {
          if (this.timerSeconds - this.remainTimerSeconds === 2) {
            this.play()
          }
        }
      }

      if (this.remainTimerSeconds > 0) {
        this.remainTimerSeconds--
        if (this.beep && this.programStatus?.userRole === 'CUSTOMER') {
          new Audio(require('@/assets/beep.mp3').default).play()
        }
      }
    }, 1000)
  }

  clearTimer () {
    this.timerSeconds = 0
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  async mounted () {
    await this.validate()
    this.socket = this.$nuxtSocket({ name: 'party', reconnection: true, query: { sessionID: this.sessionID, type: 'player' } })
    this.socket.on('notify:sessionStatus', (sessionStatus) => {
      this.sessionStatus = sessionStatus
    })
    this.socket.on('notify:playerStatus', async (playerStatus) => {
      this.playerStatus = playerStatus
      await this.$nextTick()
    })

    this.socket.on('notify:programStatus', async (programStatus: ProgramStatus) => {
      this.programStatus = programStatus
      await this.$nextTick()

      if (programStatus.paused) {
        this.stopAll(0)
        return this.clearTimer()
      }

      switch (programStatus.currentState) {
        case ProgramState.READY: {
          this.background = programStatus.coverImage
          this.stopAll()
          break
        }
        case ProgramState.DESCRIPTION: {
          this.timerSeconds = programStatus.explicitWaitSeconds
          this.play()
          break
        }
        case ProgramState.COUNTDOWN: {
          this.timerSeconds = 5
          this.stopAll()
          break
        }
        case ProgramState.PLAYING_WARMUP: {
          this.timerSeconds = programStatus.warmupTimeSeconds || programStatus.explicitWaitSeconds
          this.play()
          break
        }
        case ProgramState.PREPARE: {
          this.background = programStatus.warmupBreakTimeImage
          this.timerSeconds = programStatus.warmupBreakTimeSeconds
          this.stopAll()
          break
        }
        case ProgramState.PLAYING_WORKOUT: {
          this.stopAll(0)
          this.timerSeconds = programStatus.workoutSeconds || programStatus.explicitWaitSeconds
          this.play()
          break
        }
        case ProgramState.BREAKING_WORKOUT: {
          this.background = programStatus.workoutBreakTimeImage
          this.timerSeconds = programStatus.breakTimeSeconds
          this.stopAll()
          break
        }
        case ProgramState.BREAKING_SET: {
          this.background = programStatus.setBreakTimeImage
          this.timerSeconds = programStatus.setBreakTimeSeconds
          this.stopAll()
          break
        }
        case ProgramState.MIDDLE_DESCRIPTION: {
          this.timerSeconds = 7
          this.play()
          break
        }
        case ProgramState.WAIT_NEXT: {
          this.timerSeconds = programStatus.explicitWaitSeconds
          this.play()
          this.startTimer()
          break
        }
        default:
          break
      }

      this.remainTimerSeconds = this.timerSeconds

      this.startTimer()
    })

    this.notifyInitPlayer()
    this.notifyJoin()
  }

  beforeDestroy () {
    if (this.timer) {
      this.clearTimer()
    }
  }
}

</script>

<style lang="scss" scoped>
.player {
  height: 100vh;
  max-height: 100vh;

  .grid {
    background-color: #567;
    height: calc(100%);
    display: grid;
    grid-gap: 2px;
    overflow: hidden;

    > .video-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      overflow: hidden;
      background-color: #000;

      > .video-num {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        background-color: #000;
        min-width: 100px;
        padding-left: 8px;
        padding-right: 8px;
        height: 100px;
        left: 0;
        top: 0;
        color: #fff;
        font-size: 40px;
      }

      > .video {
        > video {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }

      > .image {
        width: 100%;
        height: 100%;
        background-color: rgb(63, 56, 56);
        > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        >video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }

  .breaktime-background {
    z-index: 5;
    position: fixed;
    top: -100%;
    left: 0;
    background-color: rgb(224, 224, 224);
    width: 100%;
    height: 100%;
    transition: top 0.5s;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: 50% 50%;

     &.on {
      top: 0;
    }
  }
  .timer {
    z-index: 10;
    position: fixed;
    left: 0;
    top: 0;
    transition: all 0.5s;
    opacity: 0.9;
    width: 11%;
    min-width: 140px;
    font-family: "Paytone One", sans-serif;

    &__description {
      transition: width 0.5s, height 0.5s;
      background-color: #000;
      color: #fff;
      padding: 8px;
      text-align: center;
      white-space: nowrap;

      @media screen and (max-width: 1280px) {
        font-size: 16px;
      }

      @media screen and (min-width: 1280px) {
        font-size: 22px;
      }
    }

    &__count {
      transition: width 0.5s, height 0.5s;
      width: 100%;
      height: 100%;
      padding: 16px;
      background-color: #fff;

      .base-timer {
        position: relative;
        width: 100%;
        height: 100%;

        &__svg {
          transform: scaleX(-1);
        }

        &__circle {
          fill: white;
          stroke: none;
        }

        &__path-elapsed {
          stroke-width: 8px;
          stroke:rgb(202, 189, 189);
        }

        &__path-remaining {
          stroke-width: 8px;
          stroke-linecap: round;
          transform: rotate(90deg);
          transform-origin: center;
          transition: 1s linear all;
          stroke: currentColor;
          fill-rule: nonzero;

        }
        .green {
          color: rgb(0, 182, 100);
        }

        .red {
          color: red;
        }

        .base-timer__svg {
          transform: scaleX(-1);
        }

        &__label {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          @media screen and (max-width: 1280px) {
            font-size: 60px;
          }

          @media screen and (min-width: 1280px) {
            font-size: 70px;
          }
        }
      }
    }
  }

  .big-timer {
    left: calc(50% - 125px);
    top: calc(50% - 125px);
    width: 250px !important;
    height: 250px !important;

    .timer__count {
      width: 100%;
      height: 100%;
    }

    .timer__description {
      width: 250px !important;
      font-size: 22px;
    }

    .big-timer__label {
      font-size: 52px !important;
    }
  }
}

</style>
