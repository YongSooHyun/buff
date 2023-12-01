<template>
  <div>
    <div class="wrapper upload">
      <div class="d-flex flex-col text-center items-center mb-8">
        <h3>도구</h3>
        <div class="upload-row">
          <input v-model="tool" class="upload-data">
          <div class="button-wrapper">
            <label class="button" @click="createType('TOOL', tool)">추가</label>
          </div>
        </div>
        <div class="upload-row container">
          <div class="upload-title">
            도구 목록
          </div>
          <div v-for="(item, index) in tools" :key="index" class="ml-4 border p-1 cursor-pointer bg-white">
            {{ item.name }}
            <button class="bg-red-400 ml-2 px-1 text-white hover:bg-red-300" @click="deleteType('TOOL', item)">
              삭제
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-col text-center items-center mb-8">
        <h3>카테고리</h3>
        <div class="upload-row">
          <input v-model="category" class="upload-data">
          <div class="button-wrapper">
            <label class="button" @click="createType('CATEGORY', category)">추가</label>
          </div>
        </div>
        <div class="upload-row container">
          <div class="upload-title">
            카테고리 목록
          </div>
          <div v-for="(item, index) in categories" :key="index" class="ml-4 border p-1 bg-white">
            {{ item.name }}
            <button class="bg-red-400 ml-2 px-1 text-white hover:bg-red-300" @click="deleteType('CATEGORY', item)">
              삭제
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-col text-center items-center mb-8">
        <h3>운동부위</h3>
        <div class="upload-row">
          <input v-model="part" class="upload-data">
          <div class="button-wrapper">
            <label class="button" @click="createType('PART', part)">추가</label>
          </div>
        </div>
        <div class="upload-row container">
          <div class="upload-title">
            운동부위 목록
          </div>
          <div v-for="(item, index) in parts" :key="index" class="ml-4 border p-1 cursor-pointer bg-white" @click="deletePopup()">
            {{ item.name }}
            <button class="bg-red-400 ml-2 px-1 text-white hover:bg-red-300" @click="deleteType('PART', item)">
              삭제
            </button>
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
    const result = (await $axios.get('/admin/deletable_types')).data
    console.log(result.parts, ' part')
    return {
      categories: result.categories,
      parts: result.parts,
      tools: result.tools
    }
  },
  data () {
    return {
      tool: null,
      category: null,
      part: null,
      type: {
        TOOL: 'tool',
        CATEGORY: 'category',
        PART: 'part'
      }
    }
  },
  methods: {
    async createType (type, name) {
      if (!name || !name.length || !name.trim().length) {
        return
      }
      const result = (await this.$axios.post('/admin/types', {
        type,
        name
      }))
      if (result.status === 201) {
        window.alert('추가 되었습니다')
      } else {
        window.alert('에러 발생')
      }
      this.getTypes()
      this[this.type[type]] = ''
    },
    async deleteType (type, item) {
      await this.$axios.delete('/admin/types', {
        data: {
          type,
          id: item.id
        }
      })
      alert('삭제되었습니다')
      this.getTypes()
    },
    async getTypes () {
      const result = (await this.$axios.get('/admin/deletable_types')).data
      this.categories = result.categories
      this.parts = result.parts
      this.tools = result.tools
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
  padding-bottom: 48px;
}
.button-wrapper {
  display: flex;
  align-items: center;
}
.button {
  border: 1px solid #f7f7f7;
  padding: 6px 24px;
  border-radius: 4px;
  background-color: #fff;
  margin-left: 16px;
  margin-top: auto;
  cursor: pointer;
}
.button:hover {
  background-color: #f3f3f3;
}

.upload-row {
  display: flex;
  margin-top: 32px;
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
</style>
