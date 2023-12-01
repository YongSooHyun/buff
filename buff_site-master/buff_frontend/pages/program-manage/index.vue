<template>
  <div class="wrapper">
    <div class="text-lg p-2 mb-4">
      전체 프로그램 목록
    </div>
    <div class="border">
      <div v-for="(item, i) in programs" :key="i" class="flex p-3 border-b items-center">
        <span class="bg-blue-400 px-1 text-white mr-1 rounded text-sm my-2">{{ item.preferCategory.name }}</span>
        <span class="bg-green-400 px-1 text-white mr-2 rounded text-sm my-2">{{ item.preferPart.name }}</span>
        {{ item.name }}
        <span class="ml-auto"> {{ toDateString(item.createdDate ) }} </span>
        <nuxt-link :to="`/manage?program=true&programID=${item.id}`" class="border bg-blue-500 rounded ml-2 text-sm p-2 text-white">
          수정
        </nuxt-link>
        <button class="border bg-red-500 rounded ml-2 text-sm p-2 text-white" @click="deleteProgram(item.id)">
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  middleware: ['admin'],
  async asyncData ({ $axios }) {
    const programs = (await $axios.get('/programs', {
      data: {
        targetUserRole: 1
      }
    })).data
    return {
      programs
    }
  },

  data () {
    return {
    }
  },
  methods: {
    toDateString (date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    async deleteProgram (id) {
      await this.$axios.patch(`/program/${id}`)
      this.programs = (await this.$axios.get('/programs', {
        data: {
          targetUserRole: 1
        }
      })).data
      alert('삭제되었습니다')
    }
  }
}
</script>

<style scoped>
.wrapper {
  width: 800px !important;
  display: flex;
  flex-direction: column;
  margin: 16px auto;
}
</style>
