<template>
  <div class="sticky z-50 top-0 flex flex-wrap place-items-center relative border-b">
    <section class="relative mx-auto">
      <!-- navbar -->
      <nav class="flex justify-between bg-white text-white w-screen whitespace-nowrap">
        <div class="px-5 xl:px-12 py-6 flex w-full items-center">
          <nuxt-link class="text-3xl font-bold font-heading" to="/">
            <img class="h-12" src="/logo.png" alt="logo" style="margin-top: -1rem; margin-bottom: -1rem;">
          </nuxt-link>
          <!-- Nav Links -->
          <ul class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
            <li>
              <nuxt-link class="hover:text-gray-600 font-1" to="/about">
                버프 소개
              </nuxt-link>
            </li>

            <li>
              <nuxt-link class="hover:text-gray-600 font-1" to="/program">
                프로그램
              </nuxt-link>
            </li>
            <li>
              <nuxt-link class="hover:text-gray-600 font-1" to="/find-a-gym">
                매장 위치
              </nuxt-link>
            </li>
            <li class="flex items-center">
              <nuxt-link class="hover:text-gray-600 font-1" to="/training">
                영상보기
              </nuxt-link>
              <span class="flex ml-1">
                <span class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-3 w-3 bg-pink-500" />
              </span>
            </li>
            <li>
              <nuxt-link class="hover:text-gray-600 font-1" to="/contact">
                창업문의
              </nuxt-link>
            </li>
            <li v-if="isAdmin">
              <nuxt-link class="hover:text-gray-600 font-1" to="/manage">
                관리자페이지
              </nuxt-link>
            </li>
          </ul>
          <!-- Header Icons -->
          <div class="hidden md:flex items-center space-x-5 items-center">
            <!-- Sign In / Register      -->
            <nuxt-link v-if="currentUser" class="flex items-center text-white hover:text-gray-600 font-bold py-1 px-3 rounded font-1" style="background-color: #a79479;" to="/profile">
              My Page
            </nuxt-link>
            <div v-if="currentUser" class="cursor-pointer flex items-center text-gray-900 hover:text-gray-600 cursor-pointer font-1" @click="logout">
              Logout
            </div>
            <nuxt-link v-else class="flex items-center text-white hover:text-gray-600 font-bold py-1 px-3 rounded font-1" style="background-color: #a79479;" to="/login">
              로그인
            </nuxt-link>
          </div>
        </div>
        <!-- Responsive navbar -->
        <div class="navbar-burger self-center mr-12 md:hidden" @click.prevent="toggle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-black hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </nav>
      <div v-if="currentUser && userSubscriptionExpire && notice" class="font-2 border-t text-white" style="background-color: #a79479;">
        <div class="max-w-screen-lg mx-auto py-2 px-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <nuxt-link to="/profile" class="text-white">
            {{ userSubscriptionExpire > 0 ? `구독 기간이 ${userSubscriptionExpire}일 남았습니다.` : '구독이 종료 되었습니다.' }}
          </nuxt-link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-auto cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click="notice = false"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </section>
    <Drawer class="flex md:hidden fixed z-10 top-0 transition-all duration-100 ease-in-out" :style="{ left: drawer ? 0 : '-100%' }" />
  </div>
</template>

<script>
import Drawer from '~/components/drawer.vue'
export default {
  components: { Drawer },
  data () {
    return {
      drawer: false,
      notice: true
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.user
    },
    isAdmin () {
      const user = this.$store.state.user
      if (user && user.role === 'ADMIN') {
        return true
      }
      return false
    },
    userSubscriptionExpire () {
      if (!this.currentUser) {
        return null
      }

      if (!this.currentUser.subscriptions) {
        return null
      }

      const subscriptions = this.currentUser.subscriptions

      const now = new Date()
      const endDate = new Date(subscriptions.endDate)

      const remainExpireDate = Math.ceil((endDate.getTime() - now.getTime()) / (60000 * 60 * 24))

      if (remainExpireDate > 10) {
        return null
      }

      return remainExpireDate
    }
  },

  watch: {
    '$route.path' () {
      this.drawer = false
    }
  },

  methods: {
    logout () {
      this.$store.commit('logout')
      this.drawer = false
      this.$router.push('/')
    },

    toggle () {
      this.drawer = !this.drawer
    }
  }
}
</script>
