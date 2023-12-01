<template>
  <div class="features_area" style="background-color: #f7f7f7;">
    <div class="container wrapper">
      <div class="row">
        <div class="col-xl-12">
          <div class="section_title mb-73" style="width: 360px; margin: auto; padding: 16px; border: 1px solid #ccc; background-color: #fff; border-radius: 4px;">
            <p class="hh3">
              비밀변호 변경
            </p>
            <div class="profile-row">
              현재 비밀번호
              <input v-model="oldp" type="password" class="row-p">
            </div>
            <div class="profile-row">
              새로운 비밀번호
              <input v-model="newp" type="password" class="row-p">
            </div>
            <div class="cursor-pointer flex items-center hover:text-gray-100 cursor-pointer font-1 logout-button" @click="changePassword">
              변경
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data () {
    return {
      oldp: '',
      newp: ''
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.user
    }
  },
  methods: {
    async changePassword () {
      const id = this.currentUser.sub
      if (!this.oldp) {
        alert('현재 비밀번호를 입력해주세요')
        return
      }
      if (!this.newp) {
        alert('새로운 비밀번호를 입력해주세요')
        return
      }
      const result = (await this.$axios.patch(`/admin/user/${id}`, {
        old: this.oldp,
        new: this.newp
      })).data
      if (result) {
        alert('비밀번호가 변경되었습니다. 새로 로그인 해주세요')
        this.$store.commit('logout')
        this.$router.push('/')
        return
      }
      alert('비밀번호 변경에 실패했습니다')
    }
  }
}
</script>
<style scoped>
.wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.logout-button {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  background-color: #b23b3b;
  color: #fff;
  border-radius: 4px;
  width: 100px;
  padding: 4px 8px;
}
.hh3 {
  font-size: 34px;
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
