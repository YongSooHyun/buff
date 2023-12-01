<template>
  <div class="flex justify-center bg-gray-100">
    <div class="my-auto w-100 max-w-lg border-2 border-gray-200 p-3 bg-white">
      <!-- header -->
      <div class="text-center my-6">
        <h1 class="text-3xl font-semibold text-gray-700">
          BUF 회원가입
        </h1>
      </div>
      <!-- sign-in -->
      <div class="m-6">
        <form class="mb-4" @submit.prevent="signup">
          <div class="mb-2">
            <label class="block mb-2 text-sm text-gray-600 dark:text-gray-400">회원 아이디</label>
            <input
              v-model="id"
              type="text"
              placeholder="회원 아이디를 입력해주세요"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">이름</label>
            <input
              v-model="name"
              type="text"
              placeholder="이름을 입력해주세요"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">이메일</label>
            <div class="flex items-center">
              <input
                v-model="emailid"
                type="text"
                placeholder="이메일 아이디"
                class="w-1/3 px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              >
              &nbsp;@&nbsp;
              <input
                v-model="email"
                :readonly="emailReadonly"
                :disabled="emailReadonly"
                type="text"
                placeholder="이메일 주소"
                class="w-1/3 mr-2 px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              >
              <select
                v-model="selectedEmail"
                name="select_email"
                class="w-1/3 px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                @change="selectemail"
              >
                <option value="custom">
                  직접입력
                </option>
                <option value="naver.com">
                  naver.com
                </option>
                <option value="gmail.com">
                  gmail.com
                </option>
                <option value="hanmail.com">
                  hanmail.com
                </option>
              </select>
            </div>
          </div>
          <div class="mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">연락처</label>
            <input
              v-model="contact"
              type="text"
              placeholder="연락처를 입력해주세요 (010-XXXX-XXXX)"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            >
          </div>
          <div class="mb-6">
            <label class="text-sm text-gray-600 dark:text-gray-400">회원 유형</label>
            <select
              v-model="selectedRole"
              name="select_role"
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              @change="selectRole"
            >
              <option value="">
                회원 유형을 선택해주세요
              </option>
              <option value="CUSTOMER">
                개인 회원
              </option>
              <option value="GYM">
                직영점
              </option>
              <option value="SUBGYM">
                가맹점
              </option>
            </select>
          </div>
          <div>
            <button type="submit" style="background-color: rgb(167, 148, 121)" class="w-full px-3 py-3 text-white rounded-md focus:outline-none duration-100 ease-in-out">
              회원가입
            </button>
          </div>
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
      password: '',
      name: '',
      emailid: '',
      email: '',
      emailReadonly: false,
      contact: '',
      selectedEmail: 'custom',
      selectedRole: ''
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
    selectRole (event) {
      this.selectedRole = event.target.value
    },
    async signup () {
      if (!this.id || !this.id.length) {
        window.alert('아이디를 입력해주세요')
        return
      }
      if (!this.password || !this.password.length) {
        window.alert('비밀번호를 입력해주세요')
        return
      }

      if (!this.name || !this.name.length) {
        window.alert('이름을 입력해주세요')
        return
      }
      // 이메일
      if (!this.emailid) {
        window.alert('이메일을 입력해주세요')
        return
      }
      // 이메일
      if (!this.emailReadonly && !this.email.length) {
        window.alert('이메일을 입력해주세요')
        return
      }
      if (!this.contact || !this.contact.length) {
        window.alert('연락처를 입력해주세요')
        return
      }
      if (!this.selectedRole) {
        window.alert('회원 유형을 선택해주세요')
        return
      }

      const email = this.emailid + '@' + this.email
      const result = (await this.$axios.post('/auth/signup', {
        username: this.id,
        password: this.password,
        name: this.name,
        email,
        phoneNumber: this.contact,
        userRole: this.selectedRole
      }))
      if (result.status === 201) {
        window.alert('회원가입 되었습니다')
        location.replace('/login')
      } else {
        window.alert('회원가입에 실패했습니다')
      }
    }
  }
}
</script>

<style scoped>
.join-form-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  margin: 16px auto;
  padding: 16px;
  border: 1px solid #ccc;
  max-width: 400px;
  position: relative;
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
  font-family: "Teko", sans-serif;
  cursor: pointer;
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
