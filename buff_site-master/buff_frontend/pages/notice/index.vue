<template>
  <div class="d-flex mx-auto flex-col py-16 fixed-width">
    <h3>버프소식 관리</h3>
    <a class="ml-auto mr-8 mb-4 px-4 py-2 border bg-green-400 text-white" href="/notice/new">
      작성
    </a>
    <div v-for="(notice, index) in noticeList" :key="index" class="py-1">
      <div class="d-flex border p-2">
        <div class="">
          <div class="" style="color: #536cbd !important">
            {{ notice.title }}
          </div>
        </div>
        <div class="ml-auto">
          <div class="content">
            {{ toDateString(notice.createDate) }}
          </div>
        </div>
        <a :href="'/notice/edit?id=' + notice.id" class="ml-4 bg-blue-500 text-white p-1">수정</a>
        <button class="ml-2 bg-red-500 text-white p-1" @click="deleteNotice(notice.id)">
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
    const noticeList = (await $axios.get('/notices')).data
    return {
      noticeList
    }
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    toDateString (date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    async deleteNotice (id) {
      await this.$axios.delete('/admin/notice', {
        data: {
          id
        }
      })
      alert('삭제되었습니다')
      this.noticeList = (await this.$axios.get('/notices')).data
    }
  }
}
</script>
<style scoped>
.fixed-width {
  width: 600px !important;
}
</style>
