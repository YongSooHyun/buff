<template>
  <div class="py-4">
    <section class="flex flex-col container mb-16">
      <img src="/logo.png" class="w-96 self-center mt-6 mb-12">
      <h2 class="self-center">
        HIIT Training Allow up failure.
      </h2>
    </section>
    <section class="mb-16">
      <div class="bg-blue-400 py-12">
        <div class="container">
          <h4 class="text-white text-3xl font-1 mb-6">
            운동 초보라구요???
          </h4>
          <h4 class="text-white text-2xl font-2">
            첫 날은 샤워만 하고 가셔도 좋습니다.
          </h4>
        </div>
      </div>
    </section>
    <section class="container mb-16">
      <video class="w-full" :src="require('~/assets/sub.mp4')" muted autoplay loop />
    </section>
    <section class="mb-16">
      <div class="bg-blue-400 py-12">
        <div class="container">
          <h4 class="text-white text-3xl font-1 mb-6">
            처음이라 동작이 어렵다구요???
          </h4>
          <h4 class="text-white text-2xl font-2">
            팀 트레이닝 후 교정시간에 참여해 보세요.
          </h4>
        </div>
      </div>
    </section>
    <section class="container mb-16">
      <img class="w-full" :src="require('~/assets/sub.jpeg')">
    </section>
    <section class="mb-16">
      <div class="bg-blue-400 py-12">
        <div class="container">
          <h4 class="text-white text-3xl font-1 mb-6">
            바빠서 운동할 시간이 없다고요???
          </h4>
          <h4 class="text-white text-2xl font-2">
            40분이면 충분합니다. 하루 1440분중 40분만 버프에 맡겨주세요.
          </h4>
          <h4 class="text-white text-2xl font-2">
            버프의 코치들이 당신의 시간을 절약해 줄 것입니다.
          </h4>
        </div>
      </div>
      <div class="container">
        <p class="sample-text text-gray-700 text-xl leading-9 pt-8">
          세상에 좋은 운동은 많습니다. <br>
          하지만 BUF를 먼저 익힌다면, 세상 어디에 있던 어떤 상황이던 1평의 공간만 있다면 당신은 어떤 운동도 할 수 있을 것입니다. <br>
          버프와 함께라면 어느 순간 운동을 즐기는 자신을 발견하게 될 것입니다. <br>
          <br>
          버프는 파이팅 히트트레이닝 스튜디오짐입니다. <br>
          다양한 파이팅 동작과 히트트레이닝 동작이 당신의 숨어있는 근육들을 찾아 깨워줄 것입니다. <br>
          몸은 올바로 알고 제대로 쓰는 것이 중요합니다. 기초가 되는 움직임을 익히고 나면, 그 어떤 운동도 쉽게 익힐 수 있습니다. <br>
          우리는 당신을 위한 모든 준비가 되어 있습니다. <br>
          <br>
          쉽고! 재미있고! 효과적으로!
        </p>
      </div>
    </section>
    <div class="container mb-12">
      <h2 class="font-2 mb-4">
        버프소식
      </h2>
      <div class="media-list">
        <div v-for="(notice, index) in noticeList" :key="index">
          <a class="media" :href="'/notice/' + notice.id" target="_blank">
            <div class="media-left">
              <div class="media-title" style="color: #536cbd !important">{{ notice.title }}</div>
            </div>
            <div class="media-right">
              <div class="content">{{ toDateString(notice.createDate) }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>
    <div class="container mb-12">
      <h2 class="font-2 mb-4">
        언론보도
      </h2>
      <div class="media-list">
        <div v-for="(media, index) in mediaList" :key="index">
          <a class="media" :href="media.link" target="_blank">
            <div class="media-left">
              <div class="media-title">{{ media.title }}</div>
              <div class="media-body">{{ media.body }}</div>
            </div>
            <div class="media-right">
              <div class="content">{{ media.mediaName }}</div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <div class="container mb-12">
      <h2 class="font-2 mb-1">
        채용안내
      </h2>
      <p class="sample-text text-gray-700 text-xl leading-9 pt-8">
        채용관련 문의는 아래에 톡상담을 이용해 주세요
      </p>
      <div style="margin: auto; display: flex; width: 110px; margin-top: 4px;">
        <a id="channel-chat-button" target="_blank" :href="'https://pf.kakao.com/_ZZddK/chat'">
          <img
            src="kakaoChannel.png"
          >
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  async asyncData ({ $axios }) {
    const mediaList = (await $axios.get('/articles')).data
    const noticeList = (await $axios.get('/notices')).data
    return {
      mediaList,
      noticeList
    }
  },
  methods: {
    toDateString (date) {
      return dayjs(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
.logo {
  display: block;
  margin-bottom: 2rem;
  width: 400px;
  max-width: 100%;
}
.wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.media-wrapper {
  max-width: 1140px;
  margin: auto;
  margin-bottom: 120px;
}
.media-list {
  display: block;
}
.media {
  display: flex;
  width: 100%;
  padding: 8px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  border: 1px solid #ccc;
  margin-bottom: 12px;
  cursor: pointer;
}
.media:hover {
  background-color: #f7f7f7;
}
.media-left {
  display: flex;
  width: 85%;
  flex-direction: column;
  flex: 6;
}
.media-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: #111;
  margin: auto;
}
.content {
  display: flex;
  margin-left: auto;
}
.media-title {
  color: #a79479;
}
.media-body {
  width: 100%;
  color: #ccc;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pagination {
  display: flex;
}
@media screen and (max-width: 1200px) {
  .media-wrapper {
    max-width: 960px;
  }
}
@media screen and (max-width: 992px) {
  .media-wrapper {
    max-width: 720px;
  }
}
@media screen and (max-width: 768px) {
  .media-wrapper {
    max-width: 540px;
  }
  .media {
    flex-direction: column;
  }
  .media-right {
    display: flex;
    margin: 0;
  }
}
@media screen and (max-width: 576px) {
  .media-wrapper {
    max-width: 360px;
  }
  .media {
    flex-direction: column;
  }
}
</style>
