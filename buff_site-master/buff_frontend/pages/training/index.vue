<template>
  <div class="relative flex flex-col justify-center bg-gray-100 py-4">
    <div class="flex justify-center pt-0 sm:pt-0 mx-w-full w-1/4 mx-auto">
      <img src="/logo.png">
    </div>

    <div v-if="isAdmin || isGym" class="max-w-4xl w-full mx-auto sm:px-6 lg:px-8 py-6">
      <h1 class="text-2xl mt-4 font-1">
        직영점 전용 프로그램
      </h1>

      <div class="mt-4 flex">
        <input
          v-model="startedSessionID"
          class="shadow sm:rounded-lg px-3 py-3 flex-1 mr-3 text-xl"
          type="text"
          placeholder="진행중인 세션 아이디"
        >
        <button
          class="shadow py-3 px-3 bg-blue-500 text-white sm:rounded-lg"
          @click="goToProgramBySessionID"
        >
          연결
        </button>
      </div>

      <h2 class="mt-4 mb-2 text-lg font-1">
        프로그램 세션 새로 만들기
      </h2>
      <div class="bg-white overflow-hidden shadow sm:rounded-lg px-2 py-2">
        <ul class="divide-y">
          <li v-for="program in programs" :key="program.id" class="py-2 px-2 flex hover:bg-gray-100 items-center">
            <span class="bg-blue-400 px-1 text-white mr-1 rounded text-sm font-2">{{ program.preferCategory.name }}</span>
            <span class="bg-green-400 px-1 text-white mr-2 rounded text-sm font-2">{{ program.preferPart.name }}</span>
            <a target="_blank" class="flex-1 cursor-pointer font-2" @click="createSession(program.id, 'GYM')">
              {{ program.name }}
            </a>
            <span class="tracking-tighter text-gray-700 text-opacity-60 font-2">
              공개: {{ toDateString(program.openDate) }} ~ {{ toDateString(program.closeDate) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="isAdmin || isSubGym" class="max-w-4xl w-full mx-auto sm:px-6 lg:px-8 py-6">
      <h1 class="text-2xl mt-4 font-1 mb-4">
        가맹점 전용 프로그램
      </h1>
      <div class="bg-white overflow-hidden shadow sm:rounded-lg px-4 py-2 mb-4 divide-y">
        <div class="font-2 flex items-center py-3">
          <span class="w-48">
            영상 갯수
          </span>
          <select v-model.number="workoutVideoCount" type="text" class="bg-gray-50 rounded-sm shadow p-1 cursor-pointer appearance-none">
            <option :value="0">
              운동 영상의 갯수를 선택하세요
            </option>
            <option v-for="i in 9" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
        </div>
        <div v-if="workoutVideoCount" class="font-2 flex items-center py-3">
          <span class="w-48">
            운동 선택
          </span>
          <div>
            <ul class="mb-2">
              <li v-for="i in workoutVideoCount" :key="i" class="py-2">
                <div class="bg-gray-50 rounded-sm shadow py-1 px-2 text-gray-500 cursor-pointer" @click="openSelectWorkoutModal(i - 1)">
                  {{ workoutVideos[i - 1] ? workoutVideos[i - 1].videos_name : '클릭 하여 운동 선택' }}
                </div>
              </li>
            </ul>
            <div>
              <button class="rounded-md shadow py-2 px-4 bg-green-500 text-white" @click="randomizeProgram">
                운동 랜덤 선택
              </button>
            </div>
          </div>
        </div>
        <div class="font-2 flex items-center py-3">
          <span class="w-48">
            세트 후 쉬는 시간 (초)
          </span>
          <select v-model.number="workoutSetBreakTimeSeconds" type="text" class="bg-gray-50 rounded-sm shadow p-1 cursor-pointer mr-2 appearance-none">
            <option :value="0">
              쉬는 시간 없음
            </option>
            <option v-for="i in 100" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
          초
        </div>
        <div class="font-2 flex items-center py-3">
          <span class="w-48">
            개별 운동 영상 시간 (초)
          </span>
          <select v-model.number="workoutSeconds" type="text" class="bg-gray-50 rounded-sm shadow p-1 cursor-pointer mr-2 appearance-none">
            <option :value="0">
              정하지 않음
            </option>
            <option v-for="i in 100" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
          초
        </div>
        <div class="font-2 flex items-center py-3">
          <span class="w-48">
            세트 수
          </span>
          <select v-model.number="workoutSetCount" type="text" class="bg-gray-50 rounded-sm shadow p-1 cursor-pointer appearance-none">
            <option :value="0">
              무한 반복
            </option>
            <option v-for="i in 100" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
        </div>
        <div class="font-2 flex items-center py-3">
          <span class="w-48">
            커버이미지
          </span>
          <div class="rounded border w-32 h-32 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-50" @click="openUploadCoverImage">
            <img v-if="coverImageThumbnailPath" draggable="false" class="w-full h-full object-cover" :src="coverImageThumbnailPath">
            <div v-else class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>선택</div>
            </div>
          </div>
          <div
            v-if="coverImageThumbnailPath"
            class="self-start ml-2 bg-red-500 text-white rounded px-2 py-1 cursor-pointer"
            @click="deleteCoverImage"
          >
            삭제
          </div>
        </div>

        <!-- <div class="font-2 flex items-start py-3">
          <span class="w-48">
            시간 예약
          </span>
          <div>
            <div class="text-gray-500 text-sm mb-3">
              시간 예약 추가 시, 최초 영상이 종료된 후 해당 시간에 영상이 다시 재생됩니다. 추가하지 않을 시 계속 반복 재생 됩니다.
            </div>
            <ul class="w-full">
              <li
                class="flex w-full mb-2 items-center"
              >
                <input
                  v-model.number="resvHour"
                  class="w-14 bg-gray-50 rounded-sm shadow p-1 mr-2"
                  type="number"
                  min="0"
                  max="23"
                >
                <span class="mr-2">시</span>
                <input v-model="resvMinute" class="w-14 bg-gray-50 rounded-sm shadow p-1 mr-2" type="number" min="0" max="60">
                <span class="mr-2">분</span>
                <button class="bg-blue-500 text-white text-sm rounded-md px-3 py-1" @click="addReservation">
                  추가
                </button>
              </li>
              <li
                v-for="reservation in reservations"
                :key="`${reservation.hour}:${reservation.minute}`"
                class="flex w-full mb-2"
              >
                <input
                  class="w-14 bg-gray-50 rounded-sm shadow p-1 text-gray-400 mr-2"
                  type="number"
                  min="0"
                  max="23"
                  :value="reservation.hour"
                  disabled
                >
                <span class="mr-2">시</span>
                <input
                  class="w-14 bg-gray-50 rounded-sm shadow p-1 text-gray-400 mr-2"
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
        </div> -->
        <div class="py-2 border-none">
          <button class="rounded-md shadow py-2 px-4 bg-blue-500 text-white" @click="openSubGymSession">
            영상 재생
          </button>
        </div>
      </div>
    </div>
    <div v-if="isAdmin || isCustomer || !user" class="calendar-wrapper">
      <h1 class="text-2xl mt-4 font-1">
        사용자 전용 프로그램
      </h1>
      <div style="height: 32px;" />
      <v-calendar
        class="custom-calendar max-w-full"
        :masks="masks"
        :attributes="attributes"
        disable-page-swipe
        is-expanded
      >
        <template #day-content="{ day, attributes }">
          <div class="flex flex-col h-full z-10 overflow-hidden">
            <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
            <div class="flex-grow overflow-y-auto overflow-x-auto">
              <p
                v-for="attr in attributes"
                :key="attr.key"
                class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                :class="attr.customData.class"
                :style="attr.highlight ? 'cursor: pointer' : ''"
                @click="attr.highlight ? createSession(attr.customData.programId, 'CUSTOMER') : null"
              >
                {{ attr.customData.title }}
              </p>
            </div>
          </div>
        </template>
      </v-calendar>
    </div>
    <div v-if="modal" class="fixed top-0 left-0 w-screen h-screen z-10 flex items-center justify-center">
      <div class="absolute top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-50" @click="modal = false" />
      <div class="relative z-20 bg-white max-w-lg w-full p-4 shadow rounded-md">
        <h4 class="font-1">
          운동 선택
        </h4>
        <div>
          <ul class="divide-y">
            <li
              v-for="video in allVideos"
              :key="video.id"
              class="cursor-pointer py-1"
              @click="selectVideo(video)"
            >
              {{ video.videos_name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

type WorkoutProgramSchedule = {
  id: number;
  year: number;
  month: number;
  date: number;
}

type WorkoutProgram = {
  id: number
  name: string
  openDate: Date
  closeDate: Date
  preferPart: { id: number, name: string }
  preferCategory: { id: number, name: string }
  customerSchedule?: WorkoutProgramSchedule[]
}

@Component({
  asyncData: async ({ $axios, store }): Promise<{ programs: WorkoutProgram[], programsForCustomer: any }> => {
    const user = store.state.user

    if (user) {
      const result = await $axios.get(`auth/profile?id=${user.sub}`)

      const accessToken = result.data.access_token
      store.commit('setUser', { accessToken })
    }

    const programs = await $axios.get('/programs?targetUserRole=GYM')

    const fromYear = new Date().getFullYear()
    const toYear = fromYear + 1
    const month = new Date().getMonth() + 1

    const programsForCustomer = (await $axios.get(`/programs?targetUserRole=CUSTOMER&fromYear=${fromYear}&fromMonth=${month}&toYear=${toYear}&toMonth=${month}`)).data

    return {
      programs: programs.data,
      programsForCustomer
    }
  }
})
export default class Index extends Vue {
  programs!: WorkoutProgram[]
  programsForCustomer!: WorkoutProgram[]
  startedSessionID: string = ''

  modal = false

  reservations: { hour: number; minute: number }[] = []
  resvHour: number = 0
  resvMinute: number = 0

  workoutSetCount: number = 0
  workoutVideoCount: number = 0
  workoutVideos: any[] = []
  workoutSeconds = 0
  workoutSetBreakTimeSeconds = 0
  focusedWorkoutVideoIndex = 0
  coverImageThumbnailPath = this.user?.subGymImage?.thumbnailPath || ''

  allVideos: any[] = []

  get user () {
    return this.$store.state.user
  }

  get isSubGym () {
    return this.user?.role === 'SUBGYM'
  }

  get isGym () {
    return this.user?.role === 'GYM'
  }

  get isCustomer () {
    return this.user?.role === 'CUSTOMER'
  }

  get isAdmin () {
    return this.user?.role === 'ADMIN'
  }

  get masks () {
    return { weekdays: 'WWW' }
  }

  get attributes () {
    const list = []
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    for (const program of this.programsForCustomer) {
      if (program.customerSchedule) {
        for (const schedule of program.customerSchedule) {
          let highlight = false
          const scheduleYear = schedule.year
          const scheduleMonth = schedule.month
          const scheduleDay = schedule.date
          if ((year === scheduleYear) && (month === scheduleMonth) && (day === scheduleDay)) {
            highlight = true
          }
          list.push({
            key: schedule.id,
            programId: program.name,
            highlight: !!highlight,
            customData: {
              title: program.name,
              programId: program.id,
              class: 'bg-indigo-500 text-white'
            },
            dates: new Date(schedule.year, schedule.month - 1, schedule.date)
          })
        }
      }
    }
    return list
  }

  toDateString (date: Date) {
    return dayjs(date).format('YYYY-MM-DD')
  }

  async goToProgramBySessionID () {
    if (!this.startedSessionID) {
      return alert('세션 아이디를 입력해주세요.')
    }

    const program = await this.$axios.get(`/session/${this.startedSessionID}`)

    if (!program.data) {
      return alert('진행중인 세션이 없습니다.')
    }

    this.$router.push(`/training/${program.data.id}?session=${this.startedSessionID}`)
  }

  async createSession (programID: number, from: string) {
    const user = this.$store.state.user
    const today = new Date().getTime()

    if (!user) {
      alert('로그인이 필요합니다!')
      this.$router.push('/login')
      return
    }

    const startDate = new Date(user.subscriptions?.startDate).getTime()
    const endDate = new Date(user.subscriptions?.endDate).getTime()

    if (!this.isAdmin) {
      if (!user.granted) {
        alert('관리자 승인이 필요합니다. 고객센터로 문의해주세요')
        return
      }

      if (isNaN(startDate)) {
        alert('결제가 필요합니다. 고객센터로 문의해주세요')
        return
      }
      if ((today < startDate)) {
        alert('구독이 시작되지 않았습니다.')
        return
      }
      if ((today > endDate)) {
        alert('구독 기간이 종료되었습니다.')
        return
      }
    }

    const targetUserRole = this.isAdmin ? from : this.user.role

    const result = await this.$axios.post('/session', { programID, userRole: targetUserRole, userID: this.user.sub })
    const { sessionID } = result.data
    if (targetUserRole === 'GYM') {
      this.$router.push(`/training/${programID}?session=${sessionID}`)
    } else {
      this.$router.push(`/training/${programID}/player?session=${sessionID}`)
    }
  }

  addReservation () {
    this.reservations.push({ hour: this.resvHour, minute: this.resvMinute })
    this.resvHour = 0
    this.resvMinute = 0
  }

  deleteReservation (reservation: any) {
    const idx = this.reservations.findIndex(r => r.hour === reservation.hour && r.minute === reservation.minute)

    if (idx === -1) {
      return
    }

    this.reservations.splice(idx, 1)
  }

  async randomizeProgram () {
    const videos = await this.$axios.$get(`/admin/randomize?count=${this.workoutVideoCount}`)

    if (!videos) {
      return
    }

    this.workoutVideos = videos
  }

  openSelectWorkoutModal (index: number) {
    this.modal = true
    this.focusedWorkoutVideoIndex = index

    if (!this.allVideos.length) {
      this.loadVideoList()
    }
  }

  selectVideo (video: any) {
    this.workoutVideos[this.focusedWorkoutVideoIndex] = video
    this.modal = false
  }

  // 추가, 편집
  async loadVideoList () {
    const videoList = await this.$axios.$get('/admin/videos')
    this.allVideos = videoList
  }

  async openSubGymSession () {
    if (!this.workoutVideoCount) {
      return alert('영상 갯수를 선택해주세요.')
    }

    if (this.workoutVideos.length !== this.workoutVideoCount || this.workoutVideos.filter(v => !v).length) {
      return alert('비어 있는 영상을 선택해 채워주세요.')
    }

    const result = await this.$axios.post('/session/sub', {
      workoutVideos: this.workoutVideos,
      workoutSetCount: this.workoutSetCount,
      workoutSetBreakTimeSeconds: this.workoutSetBreakTimeSeconds,
      workoutSeconds: this.workoutSeconds,
      reservations: this.reservations,
      userID: this.user.sub
    })
    const { sessionID } = result.data
    this.$router.push(`/training/sub?session=${sessionID}`)
  }

  openUploadCoverImage () {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/png,image/jpeg')
    input.click()
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files!.item(0)!
        const formData = new FormData()
        formData.set('file', file)
        formData.set('name', this.user.sub)
        formData.set('type', 'SUBGYM_COVER')
        const image = await this.$axios.$post(`/images/subgym/${this.user.sub}`, formData)
        this.coverImageThumbnailPath = image.thumbnailPath
      }

      input.onchange = null
    }
  }

  async deleteCoverImage () {
    await this.$axios.$delete(`/images/subgym/${this.user.sub}`)
    this.coverImageThumbnailPath = ''
  }
}
</script>

<style lang="scss" scoped>
.calendar-wrapper {
  margin: auto;
  margin-top: 36px;
  margin-bottom: 72px;
  display: flex;
  flex-direction: column;
  width: 960px;
  align-items: center;
  color: #fff !important;
}
@media screen and(max-width: 960px) {
  .calendar-wrapper {
    width: 768px;
  }
}
@media screen and(max-width: 768px) {
  .calendar-wrapper {
    width: 540px;
  }
}
@media screen and(max-width: 540px) {
  .calendar-wrapper {
    width: 100%;
  }
}
::-webkit-scrollbar-track {
  display: none;
}
::v-deep .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 40px;
  --day-height: 140px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;

  border-radius: 0;
  width: 100%;
  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }
  & .vc-highlights {
    background-color: #FFFED0 !important;
  }
  & .vc-highlight {
    width: 0 !important;
    height: 0 !important;
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>
