<template>
  <div style="display: flex;">
    <div style="padding: 32px; width: 800px; margin: auto">
      <p>제목</p>
      <textarea v-model="title" class="input-area" placeholder="제목을 입력해주세요" style="resize: none; padding: 4px" />

      <div style="height: 16px;" />

      <p>내용</p>
      <client-only>
        <ckeditor v-model="body" :config="editorConfig" />
      </client-only>
      <div class="submit" @click="submit()">
        제출
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ckeditor: process.client ? require('ckeditor4-vue').component : null
  },
  middleware: ['admin'],
  data () {
    return {
      temp: [],
      title: '',
      body: null,
      editorData: null,
      editorConfig: {}
    }
  },

  methods: {
    async submit () {
      const title = this.title ? this.title.trim() : null
      const body = this.body ? this.body.trim() : null

      if (!title) {
        alert('제목을 입력해주세요')
        return
      }
      if (!body) {
        alert('내용을 입력해주세요')
        return
      }

      const result = (await this.$axios.post('/admin/notice', {
        title,
        body
      }))

      if (result.status === 201) {
        alert('업로드 되었습니다.')
        this.$router.push('/notice')
      } else {
        alert('업로드 실패')
      }
    }
  }
}
</script>

<style scoped>
.input-area {
  border: 1px solid #ccc;
  width: 80%;
}
.title {
  border: 1px solid #ccc;
}
.body {
  width: 80%;
  border: 1px solid #ccc;
}
.submit {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #4712d3;
  color: #fff;
  display: flex;
  justify-content: center;
  margin-top: 16px;
  border-radius: 4px;
}
</style>
