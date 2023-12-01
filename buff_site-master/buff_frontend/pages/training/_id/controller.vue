<template>
  <div class="bg-gray-50">
    <div class="bg-gray-50">
      <div v-if="sessionStatus && programStatus" class="flex w-full bg-gray-50 items-start py-24 justify-center">
        <div class="flex flex-col w-96 items-center">
          <h3 class="font-1 mb-4">
            {{ sessionStatus.workoutProgram.name }}
          </h3>
          <div class="border p-4 rounded-md mb-3 w-full max-w-xs font-2 bg-white">
            <h2 class="text-sm text-gray-500 mb-4">
              플레이어
            </h2>
            <div class="flex justify-center">
              <div
                v-for="(player, i) of sessionStatus.playersStatus.players"
                :key="i"
                class="h-20 w-24 bg-black flex items-center justify-center rounded-md mx-2"
              >
                <div class="text-white text-xl">
                  화면 {{ i + 1 }}
                </div>
              </div>
              <div
                v-if="!sessionStatus.playersStatus.players.length"
              >
                연결된 화면이 없습니다.
              </div>
            </div>
          </div>
          <div class="border p-4 rounded-md w-full max-w-xs mb-3 font-2 bg-white">
            <h2 class="text-sm text-gray-500">
              컨트롤러
            </h2>
            <div class="controller-session-status mb-4 text-xl">
              현재 상태: {{ statusText }}
            </div>

            <div class="flex justify-around">
              <fa v-if="playing" class="cursor-pointer" style="width: 40px; height: 40px" :icon="['fas', 'pause']" @click="pause" />
              <fa v-else class="cursor-pointer" style="width: 40px; height: 40px" :icon="['fas', 'play']" @click="play" />
              <fa class="cursor-pointer" style="width: 40px; height: 40px" :icon="['fas', 'stop']" @click="stop" />
            </div>
            <div class="flex mt-4">
              <div>
                볼륨:
              </div>
              <div class="flex flex-1 mx-2 border-l border-r hover:bg-gray-50">
                <div
                  v-for="i in 20"
                  :key="i"
                  class="flex-1 border-t border-b cursor-pointer"
                  :class="{ 'bg-black': volume * 20 >= i }"
                  @click="volume = i * 0.05"
                />
              </div>
              <div class="w-14">
                {{ Math.floor(volume * 100) }} %
              </div>
            </div>
            <div class="mt-2">
              <button class="border text-sm px-2 py-1 hover:bg-gray-100" @click="volume = 0">
                음소거
              </button>
            </div>
            <div v-if="sessionStatus.workoutProgram.descriptionVideo" class="mt-3">
              <input id="loop-description" type="checkbox" @input="onChangeDescriptionVideoLoop">
              <label for="loop-description" class="select-none">설명영상 무한반복</label>
            </div>
          </div>
          <div class="border p-4 rounded-md w-full max-w-xs mb-4 font-2 bg-white">
            <h2 class="text-sm text-gray-500 mb-3">
              재생 시간 예약
            </h2>
            <ul class="w-full">
              <li
                class="flex w-full mb-2"
              >
                <input
                  v-model.number="resvHour"
                  class="w-14 border rounded-sm mr-1 px-1"
                  type="number"
                  min="0"
                  max="23"
                >
                <span class="mr-2">시</span>
                <input
                  v-model.number="resvMinute"
                  class="w-14 border rounded-sm mr-1 px-1"
                  type="number"
                  min="0"
                  max="60"
                >
                <span class="mr-2">분</span>
                <button class="bg-blue-500 text-white text-sm rounded-md px-3" @click="addReservation">
                  추가
                </button>
              </li>
              <li
                v-for="reservation in programStatus.reservations"
                :key="`${reservation.hour}:${reservation.minute}`"
                class="flex w-full mb-2"
              >
                <input
                  class="w-14 border rounded-sm mr-1 px-1 text-gray-400"
                  type="number"
                  min="0"
                  max="23"
                  :value="reservation.hour"
                  disabled
                >
                <span class="mr-2">시</span>
                <input
                  class="w-14 border rounded-sm mr-1 px-1 text-gray-400"
                  type="number"
                  min="0"
                  max="59"
                  :value="reservation.minute"
                  disabled
                >
                <span class="mr-2">분</span>
                <button class="bg-red-500 text-white text-sm rounded-md px-3" @click="deleteReservation(reservation)">
                  삭제
                </button>
              </li>
            </ul>
          </div>
          <div class="font-2 text-gray-500">
            현재 세션 아이디: {{ sessionID }}
          </div>
        </div>
        <div class="w-96 bg-gray-50">
          <div class="border rounded-lg bg-white p-4">
            <div>
              <h3 class="text-lg mb-2">
                <strong class="mr-2">
                  영상 바로가기
                </strong>
              </h3>
              <ul v-if="programStatus.userRole === 'SUBGYM'" class="divide-y">
                <li
                  v-for="(video, i) of sessionStatus.workoutProgram.workoutVideos"
                  :key="video.id"
                  class="flex items-center py-1 items-center cursor-pointer hover:bg-blue-50"
                  @click="peek(0, i)"
                >
                  <span v-if="video.category" class="bg-blue-400 px-1 text-white text-sm mr-1 rounded">
                    {{ video.category.name }}
                  </span>
                  <span v-if="video.part" class="bg-green-400 px-1 text-white text-sm mr-2 rounded">
                    {{ video.part.name }}
                  </span>
                  <div>
                    {{ i + 1 }} 번 째 영상
                  </div>
                </li>
              </ul>
              <ul v-else class="divide-y">
                <li v-if="sessionStatus.workoutProgram.warmUpVideos && sessionStatus.workoutProgram.warmUpVideos.length" class="py-2">
                  <div>준비운동</div>
                  <ul>
                    <li
                      v-for="(video, i) of sessionStatus.workoutProgram.warmUpVideos"
                      :key="'w' + video.id"
                      class="flex items-center py-1 items-center hover:bg-blue-50 cursor-pointer"
                      @click="peekWarup(i)"
                    >
                      <span class="bg-blue-400 px-1 text-white text-xs mr-1 rounded">
                        {{ video.category.name }}
                      </span>
                      <span class="bg-green-400 px-1 text-white text-xs mr-2 rounded">
                        {{ video.part.name }}
                      </span>
                      <div class="text-sm">
                        {{ video.name }}
                      </div>
                    </li>
                  </ul>
                </li>
                <li v-for="(set, i) of sessionStatus.workoutProgram.workoutSets" :key="set.id" class="py-2">
                  <div>세트 {{ i+1 }}</div>
                  <ul>
                    <li
                      v-for="(workout, j) of set.setPlayCount"
                      :key="'w' + workout"
                      class="flex items-center py-1 items-center cursor-pointer hover:bg-blue-50"
                      @click="peek(i, workout)"
                    >
                      <span class="bg-blue-400 px-1 text-white text-xs mr-1 rounded">
                        {{ set.workouts[workout % set.workouts.length].workoutVideo.category.name }}
                      </span>
                      <span class="bg-green-400 px-1 text-white text-xs mr-2 rounded">
                        {{ set.workouts[workout % set.workouts.length].workoutVideo.part.name }}
                      </span>
                      <div class="text-sm">
                        {{ (j+1) }} 번 째 영상
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <play-meter
      v-if="programStatus"
      :program-status="programStatus"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import type { NuxtSocket } from 'nuxt-socket-io'
import PlayMeter, { ProgramReservation, ProgramState, ProgramStatus } from '@/components/play-meter.vue'
import SessionMixin from '@/mixins/session'

@Component({ components: { PlayMeter }, mixins: [SessionMixin], middleware: ['authenticated'] })
export default class Player extends Vue {
  sessionStatus: any = null
  programStatus: ProgramStatus | null = null
  socket!: NuxtSocket

  resvHour = 0
  resvMinute = 0

  timer?: NodeJS.Timer
  beep = false
  timerSeconds = 0
  remainTimerSeconds = 0

  volume = 1

  @Watch('resvHour')
  cutVal1 (v: number) { if (v < 0) { this.resvHour = 0 } if (v > 23) { this.resvHour = 23 } }

  @Watch('resvMinute')
  cutVal2 (v: number) { if (v < 0) { this.resvMinute = 0 } if (v > 59) { this.resvMinute = 59 } }

  get statusText () {
    if (!this.programStatus) {
      return ''
    }

    const state = this.programStatus.currentState
    if (this.programStatus.paused) {
      return '일시 정지'
    }

    if (state === ProgramState.READY) {
      return '시작 전'
    }
    if (state === ProgramState.DESCRIPTION || state === ProgramState.MIDDLE_DESCRIPTION) {
      return '운동 설명'
    }
    if (state === ProgramState.COUNTDOWN) {
      return '준비하세요!'
    }
    if (state === ProgramState.PLAYING_WARMUP) {
      return '몸풀기 운동'
    }
    if (state === ProgramState.PREPARE) {
      return '시작합니다!'
    }
    if (state === ProgramState.PLAYING_WORKOUT) {
      return '운동'
    }
    if (state === ProgramState.BREAKING_WORKOUT) {
      return '대기'
    }
    if (state === ProgramState.BREAKING_SET) {
      return '쉬는 시간'
    }
    if (state === ProgramState.WAIT_NEXT) {
      return '다시시작 기다리는중'
    }
  }

  get playing () {
    if (!this.programStatus) {
      return false
    }

    const state = this.programStatus.currentState

    return state !== ProgramState.READY && state !== ProgramState.FINISHED && !this.programStatus.paused
  }

  async mounted () {
    await this.validate()
    this.socket = this.$nuxtSocket({ name: 'party', reconnection: true, query: { sessionID: this.sessionID, type: 'controller' } })
    this.socket.on('notify:sessionStatus', (status) => {
      this.sessionStatus = status
    })
    this.socket.on('notify:programStatus', (status) => {
      this.programStatus = status
      console.log(this.programStatus)

      const programStatus = this.programStatus!

      switch (programStatus.currentState) {
        case ProgramState.READY: {
          break
        }
        case ProgramState.DESCRIPTION: {
          break
        }
        case ProgramState.COUNTDOWN: {
          this.timerSeconds = 5
          break
        }
        case ProgramState.PLAYING_WARMUP: {
          this.timerSeconds = programStatus.warmupTimeSeconds
          break
        }
        case ProgramState.PREPARE: {
          this.timerSeconds = programStatus.warmupBreakTimeSeconds
          break
        }
        case ProgramState.PLAYING_WORKOUT: {
          this.timerSeconds = programStatus.workoutSeconds || programStatus.explicitWaitSeconds
          break
        }
        case ProgramState.BREAKING_WORKOUT: {
          this.timerSeconds = programStatus.breakTimeSeconds
          break
        }
        case ProgramState.BREAKING_SET: {
          this.timerSeconds = programStatus.setBreakTimeSeconds
          break
        }
        case ProgramState.MIDDLE_DESCRIPTION: {
          this.timerSeconds = 15
          break
        }
        case ProgramState.WAIT_NEXT: {
          this.timerSeconds = programStatus.explicitWaitSeconds
          break
        }
        default:
          break
      }

      this.remainTimerSeconds = this.timerSeconds
      this.startTimer()

      if (programStatus.paused) {
        this.clearTimer()
      }
    })

    this.notifyJoinController()
  }

  startTimer () {
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.timer = setInterval(() => {
      this.beep = false
      switch (this.programStatus?.currentState) {
        case ProgramState.PLAYING_WARMUP:
        case ProgramState.PLAYING_WORKOUT:
          if (this.remainTimerSeconds < 2) {
            this.beep = true
          }
          break
        case ProgramState.WAIT_NEXT:
        case ProgramState.BREAKING_SET:
        case ProgramState.BREAKING_WORKOUT:
        case ProgramState.PREPARE:
          if (this.remainTimerSeconds < 4) {
            this.beep = true
          }
          break
      }

      if (this.remainTimerSeconds > 0) {
        this.remainTimerSeconds--
        if (this.beep) {
          const audio = new Audio(require('@/assets/beep.mp3').default)
          audio.volume = this.volume
          audio.play()
        }
      }
    }, 1000)
  }

  clearTimer () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  onChangeDescriptionVideoLoop (event: Event) {
    const input = event.target as HTMLInputElement
    const value = input.checked

    this.socket.emit('command:descriptionLoop', value)
  }

  play () {
    this.socket.emit('command:play')
  }

  pause () {
    this.socket.emit('command:pause')
  }

  stop () {
    this.socket.emit('command:stop')
  }

  peek (set: number, workout: number) {
    this.socket.emit('command:peek', { set, workout: workout - 1 })
  }

  peekWarup (index: number) {
    this.socket.emit('command:peekWarmup', { index })
  }

  addReservation () {
    this.socket.emit('command:addReservation', { hour: this.resvHour, minute: this.resvMinute })
    this.resvHour = 0
    this.resvMinute = 0
  }

  deleteReservation (reservation: ProgramReservation) {
    this.socket.emit('command:deleteReservation', reservation)
  }

  notifyJoinController () {
    this.socket.emit('notify:controllerJoin')
  }
}
</script>
