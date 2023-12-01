<template>
  <div>
    <div class="wrapper upload">
      <div class="upload-row">
        <div class="upload-title">
          센터 이름
        </div>
        <input v-model="name" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          위도(LATITUDE)
        </div>
        <input v-model="latitude" class="upload-data" height="200px">
      </div>      <div class="upload-row">
        <div class="upload-title">
          경도(LONGITUDE)
        </div>
        <input v-model="longitude" class="upload-data">
      </div>      <div class="upload-row">
        <div class="upload-title">
          주소
        </div>
        <textarea v-model="address" class="upload-data">d </textarea>
      </div>     <div class="upload-row">
        <div class="upload-title">
          전화번호
        </div>
        <input v-model="phoneNumber1" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          예약링크
        </div>
        <input v-model="bookingLink" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          카카오링크
        </div>
        <input v-model="kakaoLink" class="upload-data">
      </div>
      <div style="margin-top: 24px;" class="button" @click="createGym()">
        추가
      </div>
    </div>
    <div class="gym-list">
      <h2>전체 센터 목록</h2>
      <div v-for="(gym, index) in gymList" :key="index">
        <div class="gym">
          <div class="content">
            센터이름
            <input v-model="gym.name" class="upload-data">
          </div>

          <div class="content">
            위도(LATITUDE)
            <input v-model="gym.latitude" class="upload-data">
          </div>

          <div class="content">
            경도(LONGITUDE)
            <input v-model="gym.longitude" class="upload-data">
          </div>
          <div class="content">
            주소
            <input v-model="gym.address" class="upload-data">
          </div>
          <div class="content">
            전화번호
            <input v-model="gym.phoneNumber1" class="upload-data">
          </div>
          <div class="content">
            예약링크:
            <input v-model="gym.bookingLink" class="upload-data">
          </div>
          <div class="content">
            카카오링크:
            <input v-model="gym.kakaoLink" class="upload-data">
          </div>
          <div style="display: flex;">
            <div class="button" @click="editGym(gym)">
              변경
            </div>
            <div class="button" style="margin-left: 6px !important;" @click="deleteGym(gym)">
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
    const result = (await $axios.get('/gyms')).data
    return {
      gymList: result
    }
  },
  data () {
    return {
      longitude: '',
      latitude: '',
      name: '',
      address: '',
      phoneNumber1: '',
      bookingLink: '',
      kakaoLink: ''
    }
  },
  methods: {
    async createGym () {
      if (!this.name.length) {
        alert('센터 이름을 입력하세요')
        return
      }
      if (!this.latitude.length) {
        alert('LATITUDE를 입력하세요')
        return
      }
      if (!this.longitude.length) {
        alert('LONGITUDE를 입력하세요')
        return
      }
      if (!this.address.length) {
        alert('주소를 입력하세요')
        return
      }

      const result = (await this.$axios.post('/admin/gyms', {
        longitude: this.longitude,
        latitude: this.latitude,
        name: this.name,
        address: this.address,
        phoneNumber1: this.phoneNumber1,
        bookingLink: this.bookingLink,
        kakakoLink: this.kakaoLink
      }))

      if (result.status === 201) {
        window.alert('추가 되었습니다')
        await this.reloadGymList()
      } else {
        window.alert('에러 발생')
      }

      this.longitude = ''
      this.latitude = ''
      this.name = ''
      this.address = ''
      this.phoneNumber1 = ''
      this.bookingLink = ''
    },
    async editGym (gym) {
      console.log(gym, 'zz짐')
      if (!gym.name.trim().length) {
        alert('센터 이름을 입력하세요')
        return
      }
      if (!gym.latitude.toString().trim().length) {
        alert('LATITUDE를 입력하세요')
        return
      }
      if (!gym.longitude.toString().trim().length) {
        alert('LONGITUDE를 입력하세요')
        return
      }
      if (!gym.address.trim().length) {
        alert('주소를 입력하세요')
        return
      }
      const result = (await this.$axios.patch('/admin/gyms', {
        id: gym.id,
        longitude: gym.longitude,
        latitude: gym.latitude,
        name: gym.name,
        address: gym.address,
        phoneNumber1: gym.phoneNumber1,
        bookingLink: gym.bookingLink,
        kakaoLink: gym.kakaoLink
      }))

      if (result.status === 200) {
        alert('변경되었습니다.')
      } else {
        alert('오류가 발생했습니다.')
      }
      await this.reloadGymList()
    },
    async reloadGymList () {
      this.gymList = (await this.$axios.get('/gyms')).data
    },
    async deleteGym (media) {
      const result = (await this.$axios.delete(`/admin/gyms/${media.id}`))
      if (result.status === 200) {
        alert('삭제되었습니다.')
      } else {
        alert('오류가 발생했습니다.')
      }
      await this.reloadGymList()
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
  border: 1px solid #ccc;
  text-align: center;
  margin-left: auto;
  padding: 4px 8px;
  background-color: #fff;
}
.upload-input {
  width: 150px;
  text-align: center;
  margin-left: auto;
  padding: 4px;
  background: #fff;
}

.gym {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  border: 1px solid #ccc;
  margin-bottom: 12px;
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
.gym-list {
  width: 600px;
  margin: 0 auto;
}
.content {
  display: flex;
  margin-bottom: 4px;
}
</style>
