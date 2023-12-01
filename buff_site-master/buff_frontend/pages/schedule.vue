<template>
  <div class="text-center section wrapper">
    <h2 class="h2">
      버프 스케줄 관리 프로그램
    </h2>

    <client-only>
      <div class="calendar-wrapper">
        <v-calendar
          class="custom-calendar max-w-full"
          :masks="masks"
          :attributes="attributes"
          disable-page-swipe
          is-expanded
        >
          <template #day-content="{ day, attributes }">
            <div class="flex flex-col h-full z-10 overflow-hidden" style="height: 100%;" @click="openModal(attributes, day)">
              <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
              <div class="flex-grow overflow-y-auto overflow-x-auto">
                <p
                  v-for="attr in attributes"
                  :key="attr.key"
                  class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                  style="background-color: #3F51B5; color: #fff"
                  :class="attr.customData.class"
                  :style="attr.highlight ? 'cursor: pointer' : ''"
                >
                  {{ attr.customData.title }}
                </p>
              </div>
            </div>
          </template>
        </v-calendar>
      </div>
    </client-only>

    <div v-if="modal" class="modal-wrapper">
      <div class="modal">
        <div class="modal-container">
          <div class="button-wrapper">
            <!-- <label class="button green" @click="toggleModal(false)">등록</label> -->
            <label class="button red" @click="toggleModal(false)">닫기</label>
          </div>
          <div style="font-weight: bold; font-size: 18px;">
            {{ date.year }}년 {{ date.month }}월 {{ date.day }}일
          </div>
          <div class="program-wrapper">
            <h3 style="margin-bottom: 24px">
              현재 등록된 프로그램 리스트
            </h3>
            <div v-if="programList.length">
              <div v-for="(program, index) in programList" :key="index" class="modal-row">
                <span class="bg-blue-400 px-1 text-white mr-1 rounded text-sm">{{ program.customData.preferCategory.name }}</span>
                <span class="bg-green-400 px-1 text-white mr-2 rounded text-sm">{{ program.customData.preferPart.name }}</span>
                {{ program.customData.title }}       <div class="button-wrapper">
                  <label class="button red" @click="deleteSchedule(program, index)">삭제</label>
                </div>
              </div>
            </div>
            <div v-else style="color: #ccc">
              등록된 프로그램이 없습니다.
            </div>
          </div>
          <div v-if="totalProgramList" class="program-wrapper">
            <h3 style="margin-bottom: 24px">
              전체 프로그램 리스트
            </h3>
            <div v-for="(item, index) in totalProgramList" :key="index" class="modal-row">
              <span class="bg-blue-400 px-1 text-white mr-1 rounded text-sm">{{ item.preferCategory.name }}</span>
              <span class="bg-green-400 px-1 text-white mr-2 rounded text-sm">{{ item.preferPart.name }}</span>
              {{ item.name }}
              <div class="button-wrapper" style="margin-top: 0;">
                <label class="button green" style="margin-bottom: 0;" @click="addSchedule(item)">등록</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin'],

  async asyncData ({ $axios }) {
    const fromYear = new Date().getFullYear()
    const toYear = fromYear + 1
    const month = new Date().getMonth() + 1

    const day = new Date().getDate()

    const totalProgramList = (await $axios.get('/programs')).data

    const programsForCustomer = (await $axios.get(`/programs?targetUserRole=CUSTOMER&fromYear=${fromYear}&fromMonth=${month}&toYear=${toYear}&toMonth=${month}`)).data

    const attributes = []
    for (const program of programsForCustomer) {
      if (program.customerSchedule) {
        for (const schedule of program.customerSchedule) {
          let highlight = false
          const scheduleYear = schedule.year
          const scheduleMonth = schedule.month
          const scheduleDay = schedule.date
          if ((fromYear === scheduleYear) && (month === scheduleMonth) && (day === scheduleDay)) {
            highlight = true
          }
          attributes.push({
            key: schedule.id,
            programId: program.name,
            highlight: !!highlight,
            customData: {
              title: program.name,
              programId: program.id,
              year: scheduleYear,
              month: scheduleMonth,
              day: scheduleDay,
              preferCategory: program.preferCategory,
              preferPart: program.preferPart,
              class: 'bg-indigo-500 text-white'
            },
            dates: new Date(schedule.year, schedule.month - 1, schedule.date)
          })
        }
      }
    }
    return {
      attributes,
      totalProgramList
    }
  },
  data () {
    return {
      modal: false,
      totalProgramList: null,
      programList: [],
      date: {
        year: null,
        month: null,
        day: null
      },
      masks: {
        weekdays: 'WWW'
      }
    }
  },
  computed: {
    isGym () {
      const user = this.$store.state.user
      if (user && user.role === 'GYM') {
        return true
      }
      return false
    }
  },
  methods: {
    toggleModal (bool) {
      this.modal = bool
    },
    openModal (attributes, day) {
      this.modal = true
      this.programList = attributes
      this.date.year = day.year
      this.date.month = day.month
      this.date.day = day.day
    },
    async deleteSchedule (data, index) {
      const result = await this.$axios.post('/admin/schedule/programs/customer ', {
        type: 'DELETE',
        scheduleID: data.key,
        programTypeID: data.customData.preferCategory.id,
        programID: data.customData.programId,
        year: this.date.year,
        month: this.date.month,
        date: this.date.day
      })
      if (result.status === 201) {
        this.programList.splice(index, 1)
        window.alert('삭제 되었습니다')
      }
    },
    async addSchedule (data) {
      await this.$axios.post('/admin/schedule/programs/customer ', {
        type: 'CREATE',
        programTypeID: data.preferCategory.id,
        programID: data.id,
        year: this.date.year,
        month: this.date.month,
        date: this.date.day
      })

      const fromYear = new Date().getFullYear()
      const toYear = fromYear + 1
      const month = new Date().getMonth() + 1

      const day = new Date().getDate()

      const programsForCustomer = (await this.$axios.get(`/programs?targetUserRole=CUSTOMER&fromYear=${fromYear}&fromMonth=${month}&toYear=${toYear}&toMonth=${month}`)).data

      const attributes = []
      for (const program of programsForCustomer) {
        if (program.customerSchedule) {
          for (const schedule of program.customerSchedule) {
            let highlight = false
            const scheduleYear = schedule.year
            const scheduleMonth = schedule.month
            const scheduleDay = schedule.date
            if ((fromYear === scheduleYear) && (month === scheduleMonth) && (day === scheduleDay)) {
              highlight = true
            }
            attributes.push({
              key: schedule.id,
              programId: program.name,
              highlight: !!highlight,
              customData: {
                title: program.name,
                programId: program.id,
                year: scheduleYear,
                month: scheduleMonth,
                day: scheduleDay,
                preferCategory: program.preferCategory,
                preferPart: program.preferPart,
                class: 'bg-indigo-500 text-white'
              },
              dates: new Date(schedule.year, schedule.month - 1, schedule.date)
            })
          }
        }
      }
      this.programsForCustomer = programsForCustomer
      this.attributes = attributes
      this.modal = false
      // this.programList.push(null)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  margin-top: 200px;
}
.list-wrapper {
  width: 500px;
  margin: auto;
  margin-bottom: 64px;
  padding: 36px;
  border: 1px solid #ccc;
}
.program {
  margin-bottom: 12px;
  padding: 4px 12px;
  border: 1px solid #ccc;
}
.calendar-wrapper {
  margin: auto;
  margin-top: 36px;
  margin-bottom: 72px;
  display: flex;
  width: 960px;
  align-items: center;
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
  .list-wrapper {
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
    padding: 0 0 3px 0;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    cursor: pointer;
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
.modal-wrapper {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
}
.modal {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  width: 600px;
  height: 600px;
  overflow: scroll;
  margin: auto;
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  background-color: #f7f7f7;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-row {
  border: 1px solid #ccc;
  margin-bottom: 4px;
  display: flex;
  padding: 4px;
  align-items: center;
  border-radius: 4px;
}
.button {
  border: 1px solid #f7f7f7;
  padding: 6px 24px;
  border-radius: 4px;
  background-color: #fff;
  margin: 0;
  cursor: pointer;
}
.red {
  background-color: red;
  color: #fff;
}

.green {
  background-color: green;
  color: #fff;
}
.button:hover {
  background-color: #ccc;
}
.button-wrapper {
  margin-left: auto;
  display: flex;
}
.program-wrapper {
  border: 1px solid #ccc;
  padding: 16px;
  background-color: #fff;
  margin-bottom: 16px;
}
</style>
