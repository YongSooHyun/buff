<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div v-if="program" class="w-96">
      <div class="mt-4 bg-white overflow-hidden shadow sm:rounded-lg p-6">
        <div class="mb-2 w-full">
          <h1 class="text-2xl text-center mb-4 text-gray-600 font-2">
            {{ program.workoutProgram.name || '가맹점 전용 운동 프로그램' }}
          </h1>

          <div>
            <h3 class="text-lg mb-2">
              <strong class="mr-2">
                운동 구성
              </strong>
            </h3>
            <div v-if="program.programStatus.setCount" class="mb-2">
              총 세트 수: {{ program.programStatus.setCount }}
            </div>

            <!-- 가맹점 -->
            <ul v-if="program.programStatus.userRole === 'SUBGYM'" class="divide-y">
              <li v-for="video of program.workoutProgram.workoutVideos" :key="video.id" class="flex items-center py-1 items-center">
                <span v-if="video.category" class="bg-blue-400 px-1 text-white text-sm mr-1 rounded">
                  {{ video.category.name }}
                </span>
                <span v-if="video.part" class="bg-green-400 px-1 text-white text-sm mr-2 rounded">
                  {{ video.part.name }}
                </span>
                <div>
                  {{ video.name }}
                </div>
              </li>
            </ul>
            <!-- 직영점 -->
            <ul v-else class="divide-y">
              <li v-if="program.workoutProgram.descriptionVideo" class="flex py-1 items-center">
                <span class="bg-red-400 px-1 text-white rounded text-sm mr-2">설명영상</span>
                <div>
                  {{ program.workoutProgram.descriptionVideo.name }}
                </div>
              </li>
              <li
                v-if="program.workoutProgram.warmUpVideos && program.workoutProgram.warmUpVideos.length"
                class="flex flex-col items-start py-1"
              >
                <div class="bg-purple-500 px-1 text-white rounded text-sm mb-2">
                  준비운동
                </div>
                <div
                  v-for="video of program.workoutProgram.warmUpVideos"
                  :key="'warm_' + video.id"
                  class="flex items-center py-1 items-center"
                >
                  <span class="bg-blue-400 px-1 text-white text-sm mr-1 rounded">
                    {{ video.category.name }}
                  </span>
                  <span class="bg-green-400 px-1 text-white text-sm mr-2 rounded">
                    {{ video.part.name }}
                  </span>
                  <div>
                    {{ video.name }}
                  </div>
                </div>
              </li>
              <li v-for="(set, i) of program.workoutProgram.workoutSets" :key="set.id">
                <div>- 세트 {{ i+1 }}</div>
                <div class="text-gray-400">
                  재생 횟수: {{ set.setPlayCount }}
                </div>
                <ul>
                  <li v-for="workout of set.workouts" :key="'w' + workout.id" class="flex items-center py-1 items-center">
                    <span class="bg-blue-400 px-1 text-white text-sm mr-1 rounded">
                      {{ workout.workoutVideo.category.name }}
                    </span>
                    <span class="bg-green-400 px-1 text-white text-sm mr-2 rounded">
                      {{ workout.workoutVideo.part.name }}
                    </span>
                    <div>
                      {{ workout.workoutVideo.name }}
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <p class="mt-3 text-gray-600">
          <nuxt-link :to="`/training/${programID}/controller?session=${sessionID}`" target="_blank" class="shadow bg-blue-500 text-white rounded p-2 mr-4">
            컨트롤러 열기
          </nuxt-link>
          <nuxt-link :to="`/training/${programID}/player?session=${sessionID}`" target="_blank" class="shadow bg-blue-500 text-white rounded p-2">
            운동 영상 화면 열기
          </nuxt-link>
        </p>
      </div>
      <p class="text-xl mt-4">
        세션 아이디: {{ sessionID }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SessionMixin from '@/mixins/session'
import { ProgramStatus } from '~/components/play-meter.vue'

type WorkoutProgram = {
  id: number
  name: string
  openDate: Date
  closeDate: Date
  preferPart: { id: number, name: string }
  preferCategory: { id: number, name: string }
  workoutVideos: any[]
  workoutSets: any[]
  warmUpVideos: any[]
  descriptionVideo: any
  setCount: number
}

@Component({
  mixins: [SessionMixin],
  middleware: ['authenticated'],

  asyncData: async ({ $axios, store, query, redirect }): Promise<{ program: { workoutProgram: WorkoutProgram, programStatus: ProgramStatus } } | void> => {
    const user = store.state.user
    const today = new Date().getTime()

    if (!user) {
      redirect('/')
    }

    const startDate = new Date(user.subscriptions?.startDate).getTime()
    const endDate = new Date(user.subscriptions?.endDate).getTime()

    const isAdmin = user.role === 'ADMIN'
    if (!isAdmin && !user.granted) {
      redirect('/')
      return
    }

    if (!isAdmin && isNaN(startDate)) {
      redirect('/')
      return
    }
    if (!isAdmin && (today < startDate)) {
      redirect('/')
      return
    }
    if (!isAdmin && (today > endDate)) {
      redirect('/')
      return
    }

    const program = await $axios.get(`/session/${query.session}`)

    return {
      program: program.data
    }
  }
})
export default class Index extends Vue {
  program!: { workoutProgram: WorkoutProgram, programStatus: ProgramStatus }

  get user () {
    return this.$store.state.user
  }

  async mounted () {
    await this.validate()
  }
}
</script>
