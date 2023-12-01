<template>
  <div>
    <div class="wrapper upload">
      <div class="upload-row">
        <div class="upload-title">
          뉴스제목
        </div>
        <input v-model="title" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          뉴스내용
        </div>
        <input v-model="body" class="upload-data" height="200px">
      </div>      <div class="upload-row">
        <div class="upload-title">
          언론사 이름
        </div>
        <input v-model="companyName" class="upload-data">
      </div>      <div class="upload-row">
        <div class="upload-title">
          링크
        </div>
        <input v-model="link" class="upload-data">
      </div>
      <div style="margin-top: 24px;" class="button" @click="createNews()">
        추가
      </div>
    </div>
    <div class="media-list">
      <h2>전체 보도자료 목록</h2>
      <div v-for="(media, index) in mediaList" :key="index">
        <div class="media">
          <div style="width: 100%;">
            <div class="media-title">
              뉴스제목:
              <br>{{ media.title }}
            </div>
            <br>
            <div class="media-body">
              뉴스내용:<br> {{ media.body }}
            </div>
            <br>
            <div class="content">
              언론사 이름: {{ media.mediaName }}
            </div>
            <div class="button" @click="deleteNews(media)">
              삭제
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
    const mediaList = (await $axios.get('/articles')).data

    return {
      mediaList
    }
  },
  data () {
    return {
      title: '',
      body: '',
      companyName: '',
      link: ''
    }
  },
  methods: {
    async createNews () {
      if (!this.title.length) {
        alert('뉴스 제목을 입력하세요')
        return
      }
      if (!this.body.length) {
        alert('뉴스 내용을 입력하세요')
        return
      }
      if (!this.companyName.length) {
        alert('언론사 이름을 입력하세요')
        return
      }
      if (!this.link.length) {
        alert('링크를 입력하세요')
        return
      }
      const result = (await this.$axios.post('/admin/articles', {
        title: this.title,
        body: this.body,
        mediaName: this.companyName,
        link: this.link
      }))

      if (result.status === 201) {
        window.alert('추가 되었습니다')
      } else {
        window.alert('에러 발생')
      }

      this.title = ''
      this.body = ''
      this.companyName = ''
      this.link = ''
      this.mediaList = (await this.$axios.get('/articles')).data
    },
    async deleteNews (media) {
      const result = (await this.$axios.delete(`/admin/articles/${media.id}`))
      if (result.status === 200) {
        window.alert('삭제 되었습니다')
      } else {
        window.alert('에러 발생')
      }
      this.mediaList = (await this.$axios.get('/articles')).data
    }
  }
}
</script>
<style scoped>
.main {
  width: 800px !important;
}
.upload {
  width: 600px;
}
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 16px auto;
  background-color: #ccc;
  padding: 16px;
  border: 1px solid #ccc;
  padding-bottom: 20 px;
}
.upload-row {
  display: flex;
  margin-top: 32px;
}
.row-sm-mg {
  margin-top:8px !important;
}
.upload-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
.upload-data {
  width: 300px;
  text-align: center;
  margin-left: auto;
  padding: 12px;
  background-color: #fff;
}
.upload-input {
  width: 150px;
  text-align: center;
  margin-left: auto;
  padding: 4px;
  background: #fff;
}
.media-list {
  margin: 0 auto;
  display: block;
  width: 600px;
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
.button {
  padding: 4px 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  width: 60px;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
}
.button:hover {
  background-color: #f7f7f7;
}
</style>
