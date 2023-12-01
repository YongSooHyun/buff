<template>
  <div class="flex justify-center bg-gray-100">
    <div class="my-auto w-100 max-w-md border-2 border-gray-200 p-3 bg-white">
      <!-- header -->
      <div class="text-center my-6">
        <h1 class="text-3xl font-semibold text-gray-700">
          로그인
        </h1>
        <p class="text-gray-400">
          BUF의 기능을 모두 이용하려면 로그인 해주세요.
        </p>
      </div>
      <!-- sign-in -->
      <div class="m-6">
        <form class="mb-4" @submit.prevent="login">
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">회원 아이디</label>
            <input
              id="email"
              v-model="id"
              type="text"
              name="email"
              placeholder="회원 아이디를 입력해주세요"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-6">
            <label for="password" class="text-sm text-gray-600 dark:text-gray-400">비밀번호</label>
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-6">
            <button type="submit" style="background-color: rgb(167, 148, 121)" class="w-full px-3 py-3 text-white rounded-md focus:outline-none duration-100 ease-in-out">
              로그인
            </button>
          </div>
          <p class="text-sm text-center text-gray-400">
            아직 계정이 없으신가요?
            <nuxt-link to="/join" class="font-semibold text-indigo-500 focus:text-indigo-600 focus:outline-none focus:underline">
              회원가입
            </nuxt-link>.
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      password: ''
    }
  },
  methods: {
    selectemail (event) {
      if (event.target.value === 'custom') {
        this.email = ''
        this.emailReadonly = false
      } else {
        this.email = event.target.value
        this.emailReadonly = true
      }
    },
    async login () {
      if (!this.id.length) {
        window.alert('아이디를 입력히세요')
        return
      }
      if (!this.password.length) {
        window.alert('비밀번호를 입력하세요')
        return
      }

      try {
        const result = await this.$axios.post('/auth/login', {
          username: this.id,
          password: this.password
        })

        if (result.status === 201) {
          const accessToken = result.data.access_token
          this.$store.commit('setUser', { accessToken })
          this.$router.push('/')
        }
      } catch (e) {
        alert('가입되지 않은 아이디이거나 비밀번호가 틀립니다.')
      }
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  flex-direction: column;
  margin: 16px auto;
  margin-bottom: 16px;
}
.box-wrapper {
  margin: 0 auto;
  margin-bottom: 200px;
  justify-content: center;
  align-items: center;
}
.wrapper {
  display: flex;
  max-width: 400px;
  padding: 16px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.join-form-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.join-form-input {
  display: flex;
}

.join-button {
  bottom: 10px;
  margin-top: auto;
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #a79479;
  background-color: #a79479;
  color: #fff;
  font-weight: 600;
  font-family: "Teko", sans-serif !important;
  cursor: pointer;
}
.button-a {
  color: #fff;
  font-family: "Teko", sans-serif !important;
}
input {
  border: 1px solid #dedede;
  padding: 0 5px;
}
.email {
  width: 113px;
}
.email:read-only {
  background-color: #dedede;
}
select {
  margin-left: auto;
  vertical-align: middle;
}
</style>
