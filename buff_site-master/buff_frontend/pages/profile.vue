<template>
  <div class="features_area" style="background-color: #f7f7f7;">
    <div class="container wrapper">
      <div class="row">
        <div class="col-xl-12">
          <div class="section_title mb-73" style="width: 360px; margin: auto; padding: 16px; border: 1px solid #ccc; background-color: #fff; border-radius: 4px;">
            <h3 class="hh3">
              My Page
            </h3>
            <div class="profile-row">
              아이디
              <p class="row-p">
                {{ currentUser.username }}
              </p>
            </div>
            <div class="profile-row">
              권한  <p class="row-p">
                {{ getRole(currentUser.role) }}
              </p>
            </div>
            <div class="profile-row">
              이름
              <input v-model="name" class="row-p border px-2 py-1">
            </div>
            <div class="profile-row">
              연락처
              <input v-model="phoneNumber" class="row-p border px-2 py-1">
            </div>
            <div class="profile-row">
              이메일
              <input v-model="email" class="row-p border px-2 py-1">
            </div>
            <div v-if="currentUser.subscriptions" class="profile-row">
              <div>
                구독시작날짜
                <p class="row-p">
                  {{ toDateString(currentUser.subscriptions.startDate) }}
                </p>
              </div>
              <div>
                구독만료날짜  <p class="row-p">
                  {{ toDateString(currentUser.subscriptions.endDate) }}
                </p>
              </div>
            </div>
            <div v-else class="profile-row">
              구독정보
              <p class="row-p">
                구독이 필요합니다.
              </p>
            </div>
            <div style="display: flex;">
              <div class="cursor-pointer flex items-center hover:text-gray-100 cursor-pointer font-1 btn" style="margin-right: 6px; background-color:#b23b3b;" @click="logout">
                로그아웃
              </div>
              <div class="cursor-pointer flex items-center hover:text-gray-100 cursor-pointer font-1 btn" style="background-color:#3b4db2;" @click="updateInfo">
                정보변경
              </div>
            </div>
            <nuxt-link class="cursor-pointer flex items-center hover:text-gray-100 cursor-pointer font-1 btn" style="margin-right: 6px; background-color:#b23b3b;" to="/edit-profile">
              비밀번호 변경
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  middleware: ['authenticated'],
  data () {
    return {
      name: this.$store.state.user.name,
      phoneNumber: this.$store.state.user.phoneNumber,
      email: this.$store.state.user.email
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.user
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.drawer = false
      this.$router.push('/')
    },
    async updateInfo () {
      const id = this.currentUser.sub

      try {
        const result = await this.$axios.patch(`/admin/profile/${id}`, {
          name: this.name,
          phoneNumber: this.phoneNumber,
          email: this.email
        })
        if (result.status === 200) {
          const accessToken = result.data.access_token
          this.$store.commit('setUser', { accessToken })

          alert('변경되었습니다')
        }
      } catch (e) {
        alert('정보 변경에 실패했습니다')
      }
    },
    toDateString (date) {
      if (!date) {
        return '-'
      }
      return dayjs(date).format('YYYY-MM-DD')
    },
    getRole (role) {
      switch (role) {
        case 'ADMIN':
          return '관리자'
        case 'GYM':
          return '직영점'
        case 'SUBGYM':
          return '가맹점'
        case 'CUSTOMER':
          return '개인 회원'
        default:
          return '--'
      }
    }
  }
}
</script>
<style scoped>
.wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.btn {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  color: #fff;
  border-radius: 4px;
  width: 100px;
  padding: 4px 8px;
}
.hh3 {
  margin-bottom: 32px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.profile-row {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #AAB1B7;
  margin-bottom: 8px;
}
.row-p {
  color: #001D38;
  font-size: 16px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
</style>
