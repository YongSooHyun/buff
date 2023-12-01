<template>
  <div>
    <div class="wrapper">
      <h2>회원 관리</h2>

      <div style="display: flex; flex-direction: column;">
        <div class="header row">
          <div class="row-item username">
            아이디
          </div>
          <div class="row-item name">
            이름
          </div>
          <div class="row-item email">
            이메일
          </div>
          <div class="row-item phonenumber">
            연락처
          </div>
          <div class="row-item subscription">
            승인
          </div>
          <div class="row-item date">
            날짜
          </div>
          <div class="row-item role">
            회원유형
          </div>
        </div>
        <div class="body">
          <div v-for="(user, index) in userList" :key="index" class="user-row row">
            <div class="row-item username">
              {{ user.username }}
            </div>
            <div class="row-item name">
              {{ user.name }}
            </div>
            <div class="row-item email">
              {{ user.email }}
            </div>
            <div class="row-item phonenumber">
              {{ user.phoneNumber }}
            </div>
            <div class="row-item subscription">
              <select v-model="user.granted" style="width: 50px; border: 1px solid #ccc;">
                <option disabled value="">
                  Please select one
                </option>
                <option>O</option>
                <option>X</option>
              </select>
            </div>
            <div class="row-item date">
              <div v-if="user.granted == 'O'">
                <div class="date-wrapper">
                  시작날짜: &nbsp;<date-picker v-model="user.subscriptions[0].startDate" value-type="format" />
                </div>
                <div class="date-wrapper">
                  종료날짜: &nbsp;<date-picker v-model="user.subscriptions[0].endDate" value-type="format" />
                </div>
              </div>
              <div v-else class="row">
                승인되지 않았습니다.
              </div>
            </div>
            <div class="row-item role">
              <!-- {{ user.userRole }} -->
              <select
                v-model="user.userRole"
                name="select_role"
                style="width: 120px; border: 1px solid #ccc"
                @change="(e) => {
                  changeRole(user, e)
                }"
              >
                <option value="ADMIN">
                  관리자
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
            <div class="row-item">
              <label class="button edit" @click="changeUserInfo(user)">변경</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
  components: {
    DatePicker
  },
  middleware: ['admin'],

  async asyncData ({ $axios }) {
    const result = (await $axios.get('/admin/users')).data
    const userList = result.map((user) => {
      user.granted = user.granted ? 'O' : 'X'
      if (!user.subscriptions.length) {
        user.subscriptions = [{
          startDate: null,
          endDate: null
        }]
      }

      return user
    })

    return {
      userList
    }
  },
  data () {
    return {
      tool: null,
      category: null,
      part: null
    }
  },
  methods: {
    async changeUserInfo (user) {
      const result = (await this.$axios.patch(`/admin/users/${user.id}`, {
        granted: user.granted === 'O',
        role: user.userRole,
        subscription: user.subscriptions[0]
          ? {
              startDate: user.subscriptions[0].startDate,
              endDate: user.subscriptions[0].endDate,
              id: user.subscriptions[0].id
            }
          : undefined
      }))

      if (result.status) {
        window.alert('수정되었습니다.')
      } else {
        window.alert('수정에 실패했습니다.')
      }
    },
    changeRole (user, event) {
      user.userRole = event.target.value
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
  font-family: Arial, Helvetica, sans-serif !important;
  margin: 16px auto;
  background-color: #fff;
  padding: 16px;
  max-width: 960px;
  padding-bottom: 48px;
}
.row {
  padding: 4px 8px;
  display: flex;
}
.header {
  background-color: #ddd;
  font-weight: bold;
  padding: 16px 8px !important;
}
.body {
  font-size: 14px;
}
.user-row {
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
}
.row-item {
  display: flex;
  align-items: center;
  word-break: break-all;
}
.username {
  width: 100px;
}.name {
  width: 100px;
}.email {
  width: 140px;
}
.phonenumber {
  width: 140px;
}
.subscription {
  width: 60px;
}
.date {
  width: 200px;
  display: flex;
  flex-direction: column;
}
.date-wrapper {
  display: flex;
  font-size: 14px;
  align-items: center;
  margin-top: 4px;
}
.row-enddate {
  width: 230px;
}
.role {
  width: 100px;
  display: flex;
  align-items: center;
}
.button {
  padding: 4px 6px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin: 4px;
}
.edit {
  background-color: orange;
}
.edit:hover {
  background-color: red;
}
::v-deep .mx-datepicker {
    position: relative;
    display: inline-block;
    width: 120px;
}
</style>
