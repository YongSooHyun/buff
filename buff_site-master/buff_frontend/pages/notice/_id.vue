<template>
  <section class="mb-16">
    <h2 class="font-2 mx-16 my-8">
      버프소식
    </h2>
    <div class="container bt title pd-15">
      {{ notice ? notice.title : '' }}
    </div>
    <div class="container bt pd-15">
      등록일 : {{ notice ? toDateString(notice.createDate) : '' }}
    </div>
    <div class="container bt">
      <article class="sample-text text-gray-700 text-xl leading-9 pt-8">
        <div v-html="notice ? notice.body : ''" />
      </article>
    </div>
    <div class="container bt pd-15">
      <div class="cbutton" @click="toback()">
        뒤로가기
      </div>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

export default {
  async asyncData ({ $axios, params }) {
    const notice = (await $axios.get(`/notice?id=${params.id}`)).data
    return {
      id: params.id,
      notice
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
    toback () {
      this.$router.push('/about')
    }
  }
}
</script>

<style scoped>
.title {
  color: #6366f1 !important;
  font-size: 18px;
}
.pd-15 {
  padding: 15px;
}
.bt {
  border-top: 1px solid #ddd;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.cbutton {
  padding: 10px 15px;
  font-size: 15px;
  background-color: #c3a14f;
  color: #fff !important;
  margin: auto;
  width: 90px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

</style>
