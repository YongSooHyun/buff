<template>
  <div>
    <div class="wrapper upload">
      <div class="button-wrapper">
        <label class="button" for="input-image">이미지 선택</label>
        <input
          id="input-image"
          ref="image"
          type="file"
          name="image"
          :accept="getAccept()"
          style="display: none;"
          @change="selectImage"
        >
      </div>
      <div id="img-preview" style="width: 100px; height: 100px; background-color: #fff;">
        <img id="preview-image" style="width: 100px; height: 100px;" src="">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          파일이름
        </div>
        <input v-model="imageName" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          이미지 타입
        </div>
        <select v-model="imageType" class="upload-data">
          <option v-for="i in imageTypeList" :key="i.id" :value="i.id">
            {{ i.name }}
          </option>
        </select>
      </div>
      <div class="button-wrapper" style="margin-top: 32px;">
        <label class="button" @click="upload">등록</label>
        <label class="button" @click="cancelUpload">취소</label>
      </div>
    </div>
    <div class="d-flex flex-col border bg-white p-1 mx-auto" style="width: 600px;">
      <div v-for="(item, index) in images" :key="index" class="border p-1 d-flex mb-1">
        <img :src="item.filePath" width="140" height="140">
        <div class="ml-auto d-flex flex-col p-1">
          <div class="ml-auto">
            파일이름: {{ item.name }}
          </div>
          <button class="ml-auto mt-auto bg-red-400 text-white px-2 py-1" @click="deleteImage(item.id)">
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin'],
  async asyncData ({ $axios }) {
    const images = (await $axios.get('admin/images')).data
    console.log(images, '이미자')
    return {
      images
    }
  },
  data () {
    return {
      // 영상
      image: null,
      imageName: '',
      imageType: 'WORKOUT_COVER',
      imageTypeList: [
        {
          id: 'WORKOUT_COVER',
          name: '커버'
        },
        {
          id: 'WARMUP_BREAK',
          name: '준비운동 후'
        },
        {
          id: 'WORKOUT_BREAK',
          name: '운동 후'
        },
        {
          id: 'SET_BREAK',
          name: '세트 후'
        }
      ],
      loadedImageList: null,
      modal: false

    }
  },
  methods: {
    getAccept () {
      if (this.imageType === 'WORKOUT_COVER') {
        return 'image/*, video/*'
      }
      return 'image/*'
    },
    selectImage (e) {
      const file = e.target.files[0]
      if (!file) {
        this.image = null
        this.imageName = ''
        return
      }
      const reader = new FileReader()

      const previewImage = document.getElementById('preview-image')
      previewImage.src = URL.createObjectURL(file)
      this.image = file
      this.imageName = file.name

      reader.readAsText(file)
    },
    async upload () {
      const data = new FormData()

      if (!this.imageName) {
        window.alert('파일이름을 입력해주세요')
        return
      }
      if (!this.image) {
        window.alert('파일을 업로드 해주세요')
        return
      }
      data.append('type', this.imageType)
      data.append('name', this.imageName)

      data.append('file', this.image)
      const result = await this.$axios.post('/admin/images/upload', data, {
        headers: { 'content-type': 'multipart/form-data' }
      })

      let alertMsg = '이미지 등록 '
      if (result.status === 201) {
        alertMsg += '성공'
      } else {
        alertMsg += '실패'
      }

      if (window) {
        window.alert(alertMsg)
      }

      const previewImage = document.getElementById('preview-image')
      previewImage.src = ''
      this.image = null
      this.imageName = ''
    },
    cancelUpload () {
      this.$router.replace('/manage')
    },
    toggleModal (bool) {
      this.modal = bool
    },
    async deleteImage (id) {
      await this.$axios.patch('/admin/image', {
        id
      })
      this.images = (await this.$axios.get('admin/images')).data
      alert('삭제 되었습니다!')
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
}
.button-wrapper {
  display: flex;
  margin-left: auto;
  margin-top: auto;
  align-items: center;
}
.remove-mt {
  margin-top: 0 !important;
}
.button {
  border: 1px solid #f7f7f7;
  padding: 6px 24px;
  border-radius: 4px;
  background-color: #fff;
  margin-left: 16px;
  cursor: pointer;
}
.sm-button {
  margin-bottom: 0;
  padding: 2px 4px !important;
}
.button:hover {
  background-color: #f3f3f3;
}
.video-list-wrapper {
  padding: 16px;
  margin-top: 32px;
  background-color: #fff;
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
.program-video {
  border: 1px solid #ccc;
  padding: 8px 16px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.green {
  background-color: green;
  color: #fff;
}
.red {
  background-color: red;
  color: #fff;
}
.tool-label {
  margin-right: 8px;
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
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-video-list-wrapper {
  margin-top: 32px;
}
.video {
  border: 1px solid #ccc;
  display: flex;
  padding: 4px 8px;
  margin-bottom: 4px;
  cursor: pointer;
  text-align: center;
  align-items: center;
}
.video:hover {
  background-color: #f7f7f7;
}
.image-wrapper {
  padding: 16px;
  width: 128px;
  height: 128px;
  font-size: 14px;
  background-color: #fff;
  border: 1px solid #777;
  margin-right: 32px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
