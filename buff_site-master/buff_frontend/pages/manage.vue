<template>
  <div>
    <div v-if="loading" class="z-50 fixed w-screen h-screen top-0 left-0 bg-black text-white text-xl flex justify-center items-center opacity-75">
      업로드중입니다. 잠시만 기다려주세요
    </div>
    <div v-if="program" class="wrapper upload">
      <div class="upload-row">
        <div class="upload-title">
          프로그램 이름
        </div>
        <input v-model="programName" class="upload-data">
      </div>
      <div class="upload-row">
        <div class="upload-title">
          카테고리
        </div>
        <select v-model="category" class="upload-data">
          <option v-for="c in categoryList" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          운동부위
        </div>
        <select v-model="part" class="upload-data">
          <option v-for="p in partList" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>
      <div class="upload-row">
        <div>
          시작날짜 <date-picker v-model="startDate" value-type="format" />
        </div>
        <div style="margin-left: auto">
          종료날짜
          <date-picker v-model="endDate" value-type="format" />
        </div>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          도구
        </div>
        <div class="upload-data" style="width: 500px !important; display: flex;">
          <div v-for="(tool, index) in toolList" :key="index" style="display: flex; align-items: center;">
            <input :id="'tool' + tool.id" v-model="toolIDList" type="checkbox" :value="tool.id">
            <label :for="'tool' + tool.id" class="tool-label" style="margin: 0 8px 0 1px;">{{ tool.name }}</label>
          </div>
        </div>
      </div>
      <div class="upload-row" style="flex-direction: column">
        <div class="upload-title">
          이미지
        </div>
        <div class="upload-row">
          <div class="image-wrapper" @click="loadImageList('WORKOUT_COVER')">
            커버 <img :src="WORKOUT_COVER.id ? WORKOUT_COVER.thumbnailPath : ''">
          </div>
          <div class="image-wrapper" @click="loadImageList('WARMUP_BREAK')">
            준비운동 후 <img :src="WARMUP_BREAK && WARMUP_BREAK.id ? WARMUP_BREAK.thumbnailPath : ''">
          </div>
          <!-- <div class="image-wrapper" @click="loadImageList('WORKOUT_BREAK')">
            운동 후 <img :src="WORKOUT_BREAK.id ? WORKOUT_BREAK.thumbnailPath : ''">
          </div>
          <div class="image-wrapper" @click="loadImageList('SET_BREAK')">
            세트 후 <img :src="SET_BREAK.id ? SET_BREAK.thumbnailPath : '/breaktime.jpeg'">
          </div> -->
        </div>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          준비운동시간(초)
        </div>
        <input v-model="warmupTimeSeconds" type="number" min="1" class="upload-input">
      </div>
      <div class="upload-row row-sm-mg">
        <div class="upload-title">
          준비시간(초)
        </div>
        <input v-model="warmupBreakTimeSeconds" type="number" min="1" class="upload-input">
      </div>
      <!-- <div class="upload-row row-sm-mg">
        <div class="upload-title">
          운동시간(초)
        </div>
        <input v-model="workoutTimeSeconds" type="number" min="1" class="upload-input">
      </div> -->
      <!-- <div class="upload-row row-sm-mg">
        <div class="upload-title ">
          운동 간 휴식시간(초)
        </div>
        <input v-model="workoutBreakTimeSeconds" type="number" min="1" class="upload-input">
      </div> -->
      <!-- <div class="upload-row row-sm-mg">
        <div class="upload-title">
          세트 간 쉬는시간(초)
        </div>
        <input v-model="setBreakTimeSeconds" type="number" min="1" class="upload-input">
      </div> -->
      <div class="upload-row">
        <div class="upload-title">
          설명영상
        </div>
        <div class="upload-data">
          <div class="program-video">
            {{ descriptionVideo.videos_id ? descriptionVideo.videos_name : '영상을 등록하세요' }}
            <div class="button-wrapper remove-mt">
              <label v-if="descriptionVideo.videos_id" class="button sm-button red" @click="deleteDescriptionVideo()">제거</label>
              <label class="button sm-button" @click="loadVideoList(101)">{{ descriptionVideo.videos_id ? '변경' : '등록' }}</label>
            </div>
          </div>
        </div>
      </div>
      <!-- // 준비운동 -->
      <div class="upload-row">
        <div class="upload-title">
          준비운동
        </div>
        <div class="upload-data">
          <div class="bg-white pa-4 flex flex-col">
            <div class="flex">
              <button class="ml-auto mb-4 p-2 border" @click="deleteWarmUpVideo">
                준비운동 제거
              </button>
              <button class="ml-4 mb-4 p-2 border" @click="addWarmupVideo">
                준비운동 추가
              </button>
            </div>
            <div v-for="(item, i) in warmupVideoList" :key="i" class="program-video border mb-2">
              {{ item.videos_id ? item.videos_name : '영상을 등록하세요' }}
              <div class="button-wrapper remove-mt">
                <label v-if="item.videos_id" class="button sm-button red" @click="deleteWarmupVideoinList(i)">제거</label>
                <label class="button sm-button" @click="loadVideoListForWarmup(i)">{{ item.videos_id ? '변경' : '등록' }}</label>
              </div>
            </div>

            <!--<div class="program-video border mb-2">
              {{ warmupVideo.videos_id ? warmupVideo.videos_name : '영상을 등록하세요' }}
              <div class="button-wrapper remove-mt">
                <label v-if="warmupVideo.videos_id" class="button sm-button red" @click="deleteWarmupVideo()">제거</label>
                <label class="button sm-button" @click="loadVideoList(100)">{{ warmupVideo.videos_id ? '변경' : '등록' }}</label>
              </div>
            </div>-->
          </div>
        </div>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          영상 갯수
        </div>
        <select v-model="count" class="upload-data" @change="onChangeCount($event)">
          <option v-for="c in videoCount" :key="c.id" :value="c">
            {{ c }}
          </option>
        </select>
      </div>
      <div class="upload-row row-sm-mg">
        <div class="upload-title">
          세트갯수
        </div>
        <select v-model="selectedSetCount" class="upload-data" @change="changeSetCount($event)">
          <option v-for="c in setCountList" :key="c" :value="c">
            {{ c }}
          </option>
        </select>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          영상목록
        </div>
        <div class="upload-data" style="width: 450px !important">
          <div v-for="(set, setIndex) in setListInProgram" :key="setIndex" class="program-set">
            <div class="set-title">
              {{ (setIndex + 1) + '세트' }}
            </div>
            <div class="set-attr">
              <div class="upload-row row-sm-mg">
                <button class="ml-auto border p-2" style="background-color:#E53935; color: #fff" @click="deleteSetAttributes(setIndex)">
                  세트 삭제
                </button>
                <button class="ml-4 border p-2" style="background-color:#1E88E5; color: #fff" @click="cloningSetAttributes(set)">
                  세트 복제
                </button>
              </div>
              <div class="upload-row row-sm-mg">
                <div class="upload-title">
                  세트 재생횟수
                </div>
                <input v-model="set.setPlayCount" type="number" min="1" class="set-attr-input">
              </div>
              <div class="upload-row row-sm-mg">
                <div class="upload-title">
                  운동시간(초)
                </div>
                <input v-model="set.workoutTimeSeconds" type="number" min="1" class="set-attr-input">
              </div>
              <div class="upload-row row-sm-mg">
                <div class="upload-title ">
                  운동 후 대기시간(초)
                </div>
                <input v-model="set.workoutTermSeconds" type="number" min="1" class="set-attr-input">
              </div>
              <div class="upload-row row-sm-mg">
                <div class="upload-title">
                  세트 후 쉬는시간(초)
                </div>
                <input v-model="set.breakTimeSeconds" type="number" min="1" class="set-attr-input">
              </div>
              <div class="upload-row row-sm-mg">
                <div class="upload-title">
                  세트 후 이미지
                </div>
                <img :src="set.setFinishImageID ? set.url : '/breaktime.jpeg'" class="set-breaktime-img" @click="loadImageListInSet('SET_BREAK', setIndex)">
              </div>
            </div>
            <div v-for="(item, index) in set.workouts" :key="index" class="program-video-wrapper">
              <div class="program-video">
                {{ item.videoID ? `${index + 1}번째 영상: ` + item.videos_name : (index + 1) + '번째 영상을 등록하세요' }}
                <div class="button-wrapper remove-mt">
                  <label v-if="item.videoID" class="button sm-button red" @click="deleteVideoInSetInProgram(setIndex, index)">제거</label>
                  <label class="button sm-button" @click="loadVideoList2(index, setIndex, index)">{{ item.videoID ? '변경' : '등록' }}</label>
                </div>
              </div>
              <div class="upload-row norow" style="padding: 8px 16px">
                <div class="upload-title">
                  운동 후 이미지
                </div>
                <img :src="item.workoutFinishImageID ? item.url : '/'" class="workout-breaktime-img" style="border: 1px solid #ccc" @click="loadImageListInVideoInSet('WORKOUT_BREAK', setIndex, index)">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-wrapper" style="margin-top: 32px;">
        <label class="button" @click="loadProgramList">불러오기</label>
        <label class="button" @click="randomizeProgram">랜덤</label>
        <label v-if="programID" class="button" @click="uploadProgram">수정</label>
        <label v-else class="button" @click="uploadProgram">등록</label>
        <label class="button" @click="closeProgramLaylout">취소</label>
      </div>
    </div>
    <div v-if="!video && !program" class="main">
      <h1>관리자용 프로그램</h1>
      <p>
        <br>
        프로그램관리: 일반사용자들이 사용할 프로그램을 수정,삭제 합니다.<br>
        스케줄관리: 일반사용자들이 사용할 프로그램 일정을 추가,삭제 합니다.<br>
        회원관리: 회원 유형, 구독정보, 구독기간을 관리합니다.<br>
        <br>
        버프소식관리: 버프소식을 추가, 삭제 수정합니다. <br>
        언론보도추가: 보도자료를 업로드합니다.<br>
        매장관리: 매장 정보를 추가, 삭제 업데이트합니다.<br>
        에셋추가: 프로그램에 들어갈 도구, 운동타입, 운동부위를 추가합니다.<br>
        이미지올리기: 프로그램에 들어갈 이미지를 업로드합니다.<br>
        <br>
        프로그램만들기: 운동 프로그램을 만듭니다.<br>
        영상올리기: 운동영상을 업로드합니다.<br>
      </p>
      <div style="margin: 24px 0 0 0; margin-left: auto !important; display: flex;">
        <nuxt-link class="button2" to="/program-manage">
          프로그램관리
        </nuxt-link>
        <nuxt-link class="button2" to="/schedule">
          스케줄관리
        </nuxt-link>
        <nuxt-link class="button2" to="/user-manage">
          회원관리
        </nuxt-link>
      </div>
      <div style="margin: 0 0 24px 0; margin-left: auto !important; display: flex;">
        <nuxt-link class="button2" to="/notice">
          버프소식관리
        </nuxt-link>
        <nuxt-link class="button2" to="/article">
          언론보도추가
        </nuxt-link>
        <nuxt-link class="button2" to="/gym">
          매장관리
        </nuxt-link>
        <nuxt-link class="button2" to="/add-menu">
          에셋추가
        </nuxt-link>
        <nuxt-link class="button2" to="/image">
          이미지올리기
        </nuxt-link>
      </div>
      <div class="main-content">
        <div class="button-wrapper">
          <label class="button" @click="setProgramLayout(true)">프로그램만들기</label>
          <label class="button" for="input-video">영상올리기</label>
          <input
            id="input-video"
            ref="video"
            type="file"
            name="video"
            style="display: none;"
            accept="video/*"
            @change="selectVideo"
          >
        </div>
        <div class="flex py-2" style="align-items: center">
          <input v-model="searchQuery" placeholder="영상 이름을 입력하세요" class="ml-auto border py-1 px-2">
          <button class="ml-2 py-1 px-2 border" style="background-color: #fff;" @click="filterVideos()">
            검색
          </button>
          <button class="ml-2 py-1 px-2" style="border: 1px solid #ef4444; background-color: #ef4444; color: #fff;" @click="resetVideos()">
            초기화
          </button>
        </div>
        <div class="video-list-wrapper">
          <div v-for="(item, index) in videos" :key="index" class="d-flex items-center border p-1 mb-4">
            <div class="text-lg text-center">
              {{ item.videos_name }}
              <video
                controls
                muted
                :src="item.videos_filePath"
                style="width: 400px;"
                class="upload-title mt-4"
              />
            </div>
            <span style="margin-left: auto">{{ toDateString(item.videos_createdDate) }}  </span>
            <button class="ml-1 border bg-red-500 text-white px-2 py-1" @click="hideVideo(item)">
              삭제
            </button>
          </div>
        </div>
        <div class="d-flex">
          <div v-for="(page, index) in pages" :key="index" class="my-1 mx-4 p-2 bg-white" :style="currentPage==page ? 'font-size: 18px; font-weight: bold' : ''" @click="pagination(page)">
            {{ page + 1 }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="video && !program" class="wrapper upload">
      <div class="upload-row">
        <div class="upload-title">
          파일이름
        </div>
        <input v-model="videoName" class="upload-data">
      </div>
      <div class="d-flex flex-col mt-4" style>
        <div class="upload-title justify-center">
          미리보기
        </div>
        <!-- <span class="text-red-700">미리보기 영상이 나오지 않는다면 지원하지 않는 인코딩 형식입니다.</span> -->

        <video
          id="video-preview"
          controls
          loop
          muted
          autoplay
          :src="videoSrc"
          class="upload-title"
        />
      </div>
      <div class="upload-row">
        <div class="upload-title">
          카테고리
        </div>
        <select v-model="category" class="upload-data">
          <option v-for="c in categoryListWithoutRandom" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          운동부위
        </div>
        <select v-model="part" class="upload-data">
          <option v-for="p in partListWithoutRandom" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>
      <div class="upload-row">
        <div class="upload-title">
          준비운동
        </div>
        <input v-model="isWarmup" class="upload-data" type="checkbox">
      </div>
      <div class="button-wrapper">
        <label class="button" @click="upload">등록</label>
        <label class="button" @click="cancelUpload">취소</label>
      </div>
    </div>
    <div v-if="modal" class="modal-wrapper">
      <div class="modal">
        <div class="modal-container">
          <div v-if="loadedVideoList" class="modal-video-list-wrapper">
            <div style="text-align: center; margin-bottom: 24px; font-weight: bold;">
              전체 운동영상 목록
            </div>
            <div class="flex mb-1">
              <input v-model="searchQuery" placeholder="영상이름을 입력하세요" class="ml-auto border">
              <button class="border px-2 py-1" style="background-color: #fff;">
                검색
              </button>
            </div>
            <div v-if="searchProgramByName.length">
              <div v-for="(item, index) in searchProgramByName" :key="index" class="video">
                {{ item.videos_name }}  <span class="ml-auto">{{ toDateString(item.videos_createdDate) }}  </span>
                <div class="" style="margin-top: 0;">
                  <label class="button green" style="margin-bottom: 0;" @click="warmupPopup ? selectWarmpupVideo(item) : setVideoInProgram(item, index)">등록</label>
                </div>
              </div>
            </div>
            <div v-else>
              추가할 수 있는 운동 영상이 없습니다.
            </div>
          </div>
          <div v-if="loadedProgramList" class="modal-video-list-wrapper">
            <div style="text-align: center; margin-bottom: 24px; font-weight: bold;">
              전체 프로그램 목록
            </div>
            <div v-for="(item, index) in loadedProgramList" :key="index" class="video">
              <span class="bg-blue-400 px-1 text-white mr-1 rounded text-sm">{{ item.preferCategory.name }}</span>
              <span class="bg-green-400 px-1 text-white mr-2 rounded text-sm">{{ item.preferPart.name }}</span>
              {{ item.name }}
              <div class="button-wrapper" style="margin-top: 0;">
                <label class="button green" style="margin-bottom: 0;" @click="loadProgram(item)">선택</label>
              </div>
            </div>
          </div>
          <div v-if="loadedImageList" class="modal-video-list-wrapper">
            이미지 목록
            <div v-for="(item, index) in loadedImageList" :key="index" class="video">
              {{ item.name }}  <span>{{ item.createdDate }}  </span>
              <div class="button-wrapper" style="margin-top: 0;">
                <label class="button green" style="margin-bottom: 0;" @click="setImage(item)">등록</label>
              </div>
            </div>
          </div>
          <div class="button-wrapper">
            <label class="button red" @click="toggleModal(false)">닫기</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import dayjs from 'dayjs'

export default {
  components: {
    DatePicker
  },
  middleware: ['admin'],

  async asyncData ({ $axios, route }) {
    let programName = null
    let setBreakTimeSeconds = null
    let setCount = null
    let workoutBreakTimeSeconds = null
    let workoutTimeSeconds = null
    let category = '랜덤'
    let part = '랜덤'
    let count = 1
    let selectedSetCount = 1
    let programID = null

    let WORKOUT_COVER = {
      id: null,
      name: '',
      thumbnailPath: ''
    }

    let WORKOUT_BREAK = {
      id: null,
      name: '',
      thumbnailPath: ''
    }
    let SET_BREAK = {
      id: null,
      name: '',
      thumbnailPath: ''
    }

    let WARMUP_BREAK = {
      id: null,
      name: '',
      thumbnailPath: ''
    }

    let startDate = null
    let endDate = null
    let toolIDList = []

    let warmupVideo = {
      videos_id: null,
      videos_name: null
    }

    let descriptionVideo = {
      videos_id: null,
      videos_name: null
    }

    // 준비운동
    let warmupVideoList = [{
      videos_id: null,
      videos_name: null
    }]

    let warmupTimeSeconds = null
    let warmupBreakTimeSeconds = null
    let isProgram = false

    let setListInProgram = Array.from({ length: 1 }, () => {
      return {
        workoutTimeSeconds: null,
        workoutTermSeconds: null,
        breakTimeSeconds: null,
        setFinishImageID: null,
        url: null,
        setPlayCount: 1,
        workouts: Array.from({ length: 1 }, () => {
          return {
            videoID: null,
            workoutFinishImageID: null,
            videos_name: '--'
          }
        })
      }
    })
    let editProgram = false

    if (route.query.programID) {
      programID = route.query.programID

      const program = (await $axios.get(`/admin/programs/${programID}`)).data
      if (program) {
        editProgram = true
        programName = program.name
        setBreakTimeSeconds = program.setBreakTimeSeconds
        setCount = program.setCount
        workoutBreakTimeSeconds = program.workoutBreakTimeSeconds
        workoutTimeSeconds = program.workoutTimeSeconds
        category = program.preferCategory.id
        part = program.preferPart.id
        count = program.workoutSets[0].workouts.length
        selectedSetCount = program.workoutSets.length

        WORKOUT_COVER = {
          id: program.coverImage.id,
          name: program.coverImage.name,
          thumbnailPath: program.coverImage.thumbnailPath
        }

        WORKOUT_BREAK = program.workoutBreakTimeImage
        SET_BREAK = program.setBreakTimeImage
          ? prograom.setBreakTimeImage
          : {
              id: null,
              name: '',
              thumbnailPath: ''
            }

        WARMUP_BREAK = program.warmupBreakTimeImage

        startDate = program.openDate
        endDate = program.closeDate
        toolIDList = []
        for (const tool of program.workoutTools) {
          this.toolIDList.push(tool.id)
        }
        warmupVideo = {
          videos_id: program.warmUpVideo?.id,
          videos_name: program.warmUpVideo?.name
        }

        // 준비운동
        warmupVideoList = program.warmUpVideos
          ? program.warmUpVideos.map((v) => {
            return {
              videos_id: v.id,
              videos_name: v.name
            }
          })
          : [{ videos_id: null, videos_name: null }]

        warmupTimeSeconds = program.warmupTimeSeconds
        warmupBreakTimeSeconds = program.warmupBreakTimeSeconds

        descriptionVideo = {
          videos_id: program.descriptionVideo?.id,
          videos_name: program.descriptionVideo?.name
        }

        setListInProgram = program.workoutSets.map((set) => {
          set.workouts = set.workouts.map((workout) => {
            workout.videoID = workout.workoutVideo.id
            workout.videos_name = workout.workoutVideo.name
            workout.workoutFinishImageID = workout.coverImage ? workout.coverImage.id : null
            workout.url = workout.coverImage ? workout.coverImage.filePath : null

            return workout
          })
          return set
        })
        isProgram = true
      }
    }
    const result = (await $axios.get('/admin/videos/form')).data

    const videoList = (await $axios.get('/admin/videos', {
    })).data

    const pagenationResult = (await $axios.get('/admin/videos_pagenation', {
      params: {
        // preferPartID: 1,
        // preferCategoryID: 1,
        limit: 10,
        offset: 0
      }
    })).data
    const types = (await $axios.get('/admin/types')).data

    return {
      categoryList: result.category,
      partList: result.part,

      // category: result.category.length ? result.category[result.category.length - 1].id : 0,
      // part: result.part.length ? result.part[result.part.length - 1].id : 0,

      toolList: types.tools,
      videoList,

      videoOffset: 10,
      videos: pagenationResult.videos,
      currentPage: 0,
      pages: pagenationResult.pages,

      // 프로그램 수정 시
      editProgram,
      programName,
      setBreakTimeSeconds,
      setCount,
      workoutBreakTimeSeconds,
      workoutTimeSeconds,
      category,
      part,
      count,
      selectedSetCount,
      WORKOUT_COVER,
      WORKOUT_BREAK,
      SET_BREAK,
      WARMUP_BREAK,
      startDate,
      endDate,
      toolIDList,
      warmupVideo,
      // 준비운동
      warmupVideoList,
      descriptionVideo,
      warmupTimeSeconds,
      warmupBreakTimeSeconds,
      setListInProgram,
      program: isProgram,
      programID
    }
  },
  data () {
    const videoListInProgram = Array.from({ length: 1 }, () => {
      return {
        videos_name: '23',
        videos_id: null
      }
    })
    const setListInProgram = Array.from({ length: 1 }, () => {
      return {
        workoutTimeSeconds: null,
        workoutTermSeconds: null,
        breakTimeSeconds: null,
        setFinishImageID: null,
        url: null,
        setPlayCount: 1,
        workouts: Array.from({ length: 1 }, () => {
          return {
            videoID: null,
            workoutFinishImageID: null,
            videos_name: '--'
          }
        })
      }
    })
    return {
      // 영상
      video: null,
      videoName: '',
      isWarmup: false,

      // 공통
      videoList: null,
      categoryList: null,
      category: '랜덤',
      partList: null,
      part: '랜덤',
      selectedModalIndex: null,

      startDate: null,
      endDate: null,
      // 프로그램
      videoCount: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      selectedSetCount: 1,
      setCountList: Array.from({ length: 100 }, (_, i) => i + 1),
      videoListInProgram,
      count: 1,
      programName: null,
      workoutBreakTimeSeconds: null,

      WORKOUT_COVER: {
        id: null,
        name: '',
        thumbnailPath: ''
      },
      WARMUP_BREAK: {
        id: null,
        name: '',
        thumbnailPath: ''
      },
      WORKOUT_BREAK: {
        id: null,
        name: '',
        thumbnailPath: ''
      },
      SET_BREAK: {
        id: null,
        name: '',
        thumbnailPath: ''
      },

      // Nullable
      warmupVideo: {
        videos_id: null,
        videos_name: null
      },
      // Nullable
      descriptionVideo: {
        videos_id: null,
        videos_name: null
      },

      // 세트 목록 (프로그램)
      setListInProgram,

      selectedSetIndex: undefined,
      selectedVideoIndexInSet: undefined,

      warmupTimeSeconds: null,
      warmupBreakTimeSeconds: null,

      imageType: null,
      setBreakTimeSeconds: null,
      workoutTimeSeconds: null,
      setCount: null,
      openDateMillis: null,
      closeDateMillis: null,
      toolIDList: [],
      loadedVideoList: null,
      loadedProgramList: null,
      loadedImageList: null,
      modal: false,

      videoSrc: '',
      codecCheck: false,

      loading: false,
      searchQuery: '',

      // 준비운동
      warmupPopup: false,
      warmupIndex: 0
    }
  },
  computed: {
    programListremovedDuplicate () {
      // const result = this.loadedVideoList.filter(a => !this.videoListInProgram.some(b => a.videos_id === b.videos_id))

      // return result
      return this.loadedVideoList
    },
    categoryListWithoutRandom () {
      const categorylist = this.categoryList.filter(c => c.name !== '랜덤')
      return categorylist
    },
    partListWithoutRandom () {
      const partList = this.partList.filter(c => c.name !== '랜덤')
      return partList
    },
    searchProgramByName () {
      if (!this.searchQuery.length) {
        return this.loadedVideoList
      }
      const videoList = []
      this.loadedVideoList.forEach((item) => {
        const isExist = item.videos_name.indexOf(this.searchQuery)
        if (isExist !== -1) {
          videoList.push(item)
        }
      })

      return videoList
    }
  },

  watch: {
    '$route.query.program' (toggle) {
      if (!toggle) {
        this.program = false
      }
    },

    '$route.query.uploadVideo' (toggle) {
      if (!toggle) {
        this.video = false
        this.program = false
      }
    }
  },

  methods: {
    toDateString (date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    onChangeCount (event) {
      this.setListInProgram.forEach((element) => {
        element.workouts = Array.from({ length: event.target.value }, () => {
          return {
            videos_name: '--',
            videos_id: null
          }
        })
      })
    },
    changeSetCount (event) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.setListInProgram = Array.from({ length: event.target.value }, (item, index) => {
        const exist = this.setListInProgram[index]
        if (exist) {
          let workouts = Array.from({ length: this.count }, () => {
            return {
              videoID: null,
              workoutFinishImageID: null,
              videos_name: '--'
            }
          })
          if (exist.workouts) {
            workouts = []
            exist.workouts.forEach((item) => {
              workouts.push(item)
            })
          }
          return {
            workoutTimeSeconds: exist.workoutTimeSeconds,
            workoutTermSeconds: exist.workoutTermSeconds,
            breakTimeSeconds: exist.breakTimeSeconds,
            setFinishImageID: exist.setFinishImageID,
            url: exist.url,
            setPlayCount: exist.setPlayCount,
            workouts
          }
        }
        return {
          workoutTimeSeconds: null,
          workoutTermSeconds: null,
          breakTimeSeconds: null,
          setFinishImageID: null,
          url: null,
          setPlayCount: 1,
          workouts: Array.from({ length: this.count }, () => {
            return {
              videoID: null,
              workoutFinishImageID: null,
              videos_name: '--'
            }
          })
        }
      })
      this.selectedSetCount = Number(event.target.value)
    },
    setProgramLayout (bool) {
      this.program = bool
      this.$router.push('/manage?program=true')
    },
    selectVideo (e) {
      const file = e.target.files[0]
      if (!file) {
        this.video = null
        this.videoName = ''
        return
      }
      const reader = new FileReader()

      const videoSrc = URL.createObjectURL(file)
      this.videoSrc = videoSrc
      this.video = file
      this.videoName = file.name
      reader.readAsText(file)
      this.$router.push('/manage?uploadVideo=true')
    },
    async upload () {
      if (this.loading) {
        return
      }
      if (!this.videoName || !this.videoName.length || !this.videoName.trim().length) {
        alert('파일이름을 입력해주세요')
        return
      }
      this.loading = true
      const data = new FormData()

      data.append('name', this.videoName)
      data.append('filepath', this.videoName)
      data.append('isWarmup', this.isWarmup)
      data.append('categoryID', this.category)
      data.append('partID', this.part)

      data.append('file', this.video)
      const result = await this.$axios.post('/admin/videos/upload', data, {
        headers: { 'content-type': 'multipart/form-data' }
      })

      let alertMsg = '영상 등록 '
      if (result.status === 201) {
        alertMsg += '성공'
      } else {
        alertMsg += '실패'
      }

      if (window) {
        window.alert(alertMsg)
      }
      this.loading = false
      this.video = null
      this.videoName = ''
      this.videoSrc = ''
    },
    cancelUpload () {
      this.video = null
      this.videoName = ''
      this.videoSrc = ''
    },
    async loadProgram (item) {
      const program = (await this.$axios.get(`/admin/programs/${item.id}`)).data

      this.programName = program.name
      this.setBreakTimeSeconds = program.setBreakTimeSeconds
      this.setCount = program.setCount
      this.workoutBreakTimeSeconds = program.workoutBreakTimeSeconds
      this.workoutTimeSeconds = program.workoutTimeSeconds
      this.category = program.preferCategory.id
      this.part = program.preferPart.id
      // 운동영상 갯수
      this.count = program.workoutSets[0].workouts.length
      // 세트 갯수
      this.selectedSetCount = program.workoutSets.length

      this.WORKOUT_COVER.id = program.coverImage.id
      this.WORKOUT_COVER.name = program.coverImage.name
      this.WORKOUT_COVER.thumbnailPath = program.coverImage.thumbnailPath

      this.WORKOUT_BREAK = program.workoutBreakTimeImage
      this.SET_BREAK = program.setBreakTimeImage
        ? prograom.setBreakTimeImage
        : {
            id: null,
            name: '',
            thumbnailPath: ''
          }

      this.WARMUP_BREAK = program.warmupBreakTimeImage

      this.startDate = program.openDate
      this.endDate = program.closeDate
      this.toolIDList = []
      for (const tool of program.workoutTools) {
        this.toolIDList.push(tool.id)
      }
      // 준비운동
      this.warmupVideo.videos_id = program.warmUpVideo?.id
      this.warmupVideo.videos_name = program.warmUpVideo?.name

      // 준비운동 목록
      this.warmupVideoList = program.warmUpVideos
        ? program.warmUpVideos.map((v) => {
          return {
            videos_id: v.id,
            videos_name: v.name
          }
        })
        : [{ videos_id: null, videos_name: null }]

      // 준비운동 시간
      this.warmupTimeSeconds = program.warmupTimeSeconds
      this.warmupBreakTimeSeconds = program.warmupBreakTimeSeconds

      // // 설명영상
      this.descriptionVideo.videos_id = program.descriptionVideo?.id
      this.descriptionVideo.videos_name = program.descriptionVideo?.name

      this.setListInProgram = program.workoutSets.map((set) => {
        set.workouts = set.workouts.map((workout) => {
          workout.videoID = workout.workoutVideo.id
          workout.videos_name = workout.workoutVideo.name
          workout.workoutFinishImageID = workout.coverImage ? workout.coverImage.id : null
          workout.url = workout.coverImage ? workout.coverImage.filePath : null

          return workout
        })
        return set
      })
      this.toggleModal(false)
    },
    async randomizeProgram () {
      const videos = (await this.$axios.get(`/admin/randomize?count=${this.count}&setCount=${this.selectedSetCount}&categoryID=${this.category}&partID=${this.part}`)).data
      if (videos) {
        for (let i = 0; i < videos.length; i++) {
          if (this.videoListInProgram.length > i) {
            this.videoListInProgram[i] = videos[i]
          }
        }
        this.videoListInProgram = this.videoListInProgram.filter(i => i)
        const newVideos = []
        while (videos.length) {
          newVideos.push(videos.splice(0, this.count))
        }
        for (let i = 0; i < this.setListInProgram.length; i++) {
          for (let j = 0; j < this.setListInProgram[i].workouts.length; j++) {
            if (newVideos[i] && newVideos[i][j]) {
              const body = this.setListInProgram[i].workouts[j]
              body.videoID = newVideos[i][j].videos_id
              body.videos_name = newVideos[i][j].videos_name
            }
          }
        }
      }
    },
    async uploadProgram () {
      const programName = this.programName ? this.programName.trim() : null

      if (this.loading) {
        return
      }
      if (!programName || !programName.length) {
        window.alert('프로그램 이름을 적어주세요')
        return null
      }
      if (!this.startDate) {
        window.alert('시작날짜를 입력해주세요')
        return null
      }
      if (!this.endDate) {
        window.alert('종료날짜를 입력해주세요')
        return null
      }
      if (!this.WORKOUT_COVER.id) {
        window.alert('커버 이미지를 선택해주세요')
        return null
      }

      for (let i = 0; i < this.setListInProgram.length; i++) {
        const set = this.setListInProgram[i]
        if (!set.workoutTimeSeconds) {
          alert(`${i + 1}세트 운동시간을 입력해주세요`)
          return null
        }

        const workouts = this.setListInProgram[i].workouts
        for (let j = 0; j < workouts.length; j++) {
          if (!workouts[j].videoID) {
            window.alert(`${i + 1}세트 ${j + 1}번째 운동영상 없음`)
            return null
          }
        }
      }
      this.loading = true
      let result = null

      const warmUpVideoIds = []
      for (const item of this.warmupVideoList) {
        if (item.videos_id) {
          warmUpVideoIds.push(item.videos_id)
        }
      }

      const body = {
        name: programName,
        descriptionVideoID: this.descriptionVideo.videos_id,
        toolIDs: this.toolIDList,
        preferCategoryID: this.category,
        preferPartID: this.part,
        coverImageID: this.WORKOUT_COVER.id,

        workoutSets: this.setListInProgram,

        warmUpImageID: this.WARMIP_BREAK ? this.WARMUP_BREAK.id : null,
        workoutBreakTimeImageID: this.WORKOUT_BREAK ? this.WORKOUT_BREAK.id : null,
        setBreakTimeImageID: this.SET_BREAK.id ? this.SET_BREAK.id : null,
        workoutBreakTimeSeconds: this.workoutBreakTimeSeconds,
        setBreakTimeSeconds: this.setBreakTimeSeconds,
        workoutTimeSeconds: this.workoutTimeSeconds,
        warmUpVideoId: this.warmupVideo.videos_id,
        warmupTimeSeconds: this.warmupTimeSeconds,
        warmupBreakTimeSeconds: this.warmupBreakTimeSeconds,

        warmUpVideo: {
          id: this.warmupVideo.videos_id
        },
        warmUpVideoIds,
        setCount: this.selectedSetCount,
        openDateMillis: (new Date(this.startDate)).getTime(), // this.openDateMillis, // 시작시간
        closeDateMillis: (new Date(this.endDate)).getTime() // this.closeDateMillis // 만료시간
      }
      if (this.programID) {
        body.id = this.programID
        result = (await this.$axios.patch('/admin/programs', body))
      } else {
        result = (await this.$axios.post('/admin/programs', body))
      }

      let alertMsg = '프로그램 등록 '
      if (result.status === 201 || result.status === 200) {
        this.initProgram()
        alertMsg += '완료'
      } else {
        alertMsg += '실패'
      }

      if (window) {
        window.alert(alertMsg)
      }
      this.loading = false
      this.$router.push('/manage')
    },
    closeProgramLaylout () {
      this.initProgram()
      this.$router.push('/manage')
    },
    deleteVideoFromProgram (index) {
      if (index <= this.videoListInProgram.length - 1) {
        this.videoListInProgram[index] = { videos_name: '', videos_id: null }
        this.videoListInProgram = this.videoListInProgram.filter(i => i)
      }
    },
    deleteVideoInSetInProgram (setIndex, index) {
      this.setListInProgram[setIndex].workouts[index].videoID = undefined
      this.setListInProgram[setIndex].workouts[index].videos_name = ''
    },
    setVideoInProgram (video) {
      if (this.selectedModalIndex === 100) {
        this.warmupVideo.videos_name = video.videos_name
        this.warmupVideo.videos_id = video.videos_id
      } else if (this.selectedModalIndex === 101) {
        this.descriptionVideo.videos_name = video.videos_name
        this.descriptionVideo.videos_id = video.videos_id
      } else {
        this.videoListInProgram[this.selectedModalIndex] = video

        this.setListInProgram[this.selectedSetIndex].workouts[this.selectedVideoIndexInSet].videoID = video.videos_id
        this.setListInProgram[this.selectedSetIndex].workouts[this.selectedVideoIndexInSet].videos_name = video.videos_name
        this.setListInProgram = this.setListInProgram.filter(i => i)
        this.selectedModalIndex = null
      }
      this.loadedVideoList = null
      this.toggleModal(false)
    },

    // 준비운동
    selectWarmpupVideo (video) {
      this.warmupVideoList[this.warmupIndex] = video
      this.modal = false
      this.warmupPopup = false
    },
    addWarmupVideo () {
      this.warmupVideoList.push({
        videos_id: null,
        videos_name: ''
      })
    },
    deleteWarmUpVideo () {
      if (this.warmupVideoList.length > 0) {
        this.warmupVideoList.pop()
      }
    },
    initProgram () {
      this.program = null
      this.programName = null
      this.setListInProgram = Array.from({ length: 1 }, () => {
        return {
          workoutTimeSeconds: null,
          workoutTermSeconds: null,
          breakTimeSeconds: null,
          setFinishImageID: null,
          url: null,
          setPlayCount: 1,
          workouts: Array.from({ length: 1 }, () => {
            return {
              videoID: null,
              workoutFinishImageID: null,
              videos_name: '--'
            }
          })
        }
      })
      this.selectedSetIndex = undefined
      this.selectedVideoIndexInSet = undefined
      this.editProgram = false
      this.programID = null
    },
    toggleModal (bool) {
      this.modal = bool
      this.warmupPopup = false
    },
    // 추가, 편집
    async loadVideoList (index) {
      this.resetLists()

      const videoList = (await this.$axios.get('/admin/videos', {
        data: {
          preferPartID: 1,
          preferCategoryID: 1
        }
      })).data

      this.loadedVideoList = videoList

      this.toggleModal(true)
      this.selectedModalIndex = index
    },

    async loadVideoList2 (index, setIndex, videoIndex) {
      this.resetLists()

      const videoList = (await this.$axios.get('/admin/videos', {
        data: {
          preferPartID: 1,
          preferCategoryID: 1
        }
      })).data

      this.loadedVideoList = videoList
      this.selectedSetIndex = setIndex
      this.selectedVideoIndexInSet = videoIndex
      this.toggleModal(true)
      this.selectedModalIndex = index
    },

    // 준비운동
    async loadVideoListForWarmup (index) {
      this.resetLists()

      const videoList = (await this.$axios.get('/admin/videos', {
        data: {
          preferPartID: 1,
          preferCategoryID: 1
        }
      })).data

      this.loadedVideoList = videoList

      this.toggleModal(true)
      this.warmupPopup = true
      this.warmupIndex = index
    },

    async loadProgramList () {
      this.resetLists()
      const programList = (await this.$axios.get('/programs', {
        data: {
          targetUserRole: 1
        }
      })).data
      this.loadedProgramList = programList

      this.toggleModal(true)
    },
    async loadImageList (type) {
      this.resetLists()
      this.imageType = type
      const imageList = (await this.$axios.get('/admin/images', {
        params: {
          type
        }
      })).data
      this.loadedImageList = imageList

      this.toggleModal(true)
    },
    async loadImageListInSet (type, index) {
      this.resetLists()
      this.imageType = type
      const imageList = (await this.$axios.get('/admin/images', {
        params: {
          type
        }
      })).data
      this.loadedImageList = imageList
      this.selectedSetIndex = index
      this.toggleModal(true)
    },
    async loadImageListInVideoInSet (type, setIndex, index) {
      this.resetLists()
      this.imageType = type
      const imageList = (await this.$axios.get('/admin/images', {
        params: {
          type
        }
      })).data
      this.loadedImageList = imageList
      this.selectedSetIndex = setIndex
      this.selectedVideoIndexInSet = index
      this.toggleModal(true)
    },
    setImage (image) {
      // 세트인덱스, 비디오인덱스
      if (this.selectedSetIndex !== undefined && this.selectedVideoIndexInSet !== undefined) {
        this.setVideoSetImage(image)
        return
      }
      // 세트 아이디만 있으면
      if (this.selectedSetIndex !== undefined) {
        this.setSetImage(image)
        return
      }

      this[this.imageType].id = image.id
      this[this.imageType].name = image.name

      this[this.imageType].thumbnailPath = image.thumbnailPath

      this.toggleModal(false)
    },
    setSetImage (image) {
      if (this.selectedSetIndex !== undefined) {
        this.setListInProgram[this.selectedSetIndex].setFinishImageID = image.id
        this.setListInProgram[this.selectedSetIndex].url = image.filePath
      }
      this.selectedSetIndex = undefined
      this.toggleModal(false)
    },
    setVideoSetImage (image) {
      if (this.selectedSetIndex !== undefined && this.selectedVideoIndexInSet !== undefined) {
        this.setListInProgram[this.selectedSetIndex].workouts[this.selectedVideoIndexInSet].workoutFinishImageID = image.id
        this.setListInProgram[this.selectedSetIndex].workouts[this.selectedVideoIndexInSet].url = image.filePath
      }
      this.selectedSetIndex = undefined
      this.selectedVideoIndexInSet = undefined
      this.toggleModal(false)
    },
    resetLists () {
      this.loadedVideoList = null
      this.loadedProgramList = null
      this.loadedImageList = null
      this.selectedModalIndex = null
    },
    // will not use
    deleteWarmupVideo () {
      this.warmupVideo.videos_name = ''
      this.warmupVideo.videos_id = null
    },

    deleteWarmupVideoinList (i) {
      const video = this.warmupVideoList[i]
      video.videos_name = ''
      video.videos_id = null
    },
    deleteDescriptionVideo () {
      this.descriptionVideo.videos_name = ''
      this.descriptionVideo.videos_id = null
    },
    async hideVideo (item) {
      await this.$axios.patch('/admin/video', {
        id: item.videos_id
      })

      const pagenationResult = (await this.$axios.get('/admin/videos_pagenation', {
        params: {
        // preferPartID: 1,
        // preferCategoryID: 1,
          limit: 10,
          offset: 0
        }
      })).data
      this.videoList = (await this.$axios.get('/admin/videos', {
      })).data
      this.videos = pagenationResult.videos
      this.currentPage = 0
      this.pages = pagenationResult.pages
      alert('삭제되었습니다.')
    },
    async pagination (offset) {
      const result = (await this.$axios.get('/admin/videos_pagenation', {
        params: {
        // preferPartID: 1,
        // preferCategoryID: 1,
          limit: 10,
          offset
        }
      })).data
      this.videos = result.videos
      this.currentPage = offset
      this.pages = result.pages
    },

    cloningSetAttributes (set) {
      this.selectedSetCount += 1
      this.setListInProgram.push({
        workoutTimeSeconds: set.workoutTimeSeconds,
        workoutTermSeconds: set.workoutTermSeconds,
        breakTimeSeconds: set.breakTimeSeconds,
        setFinishImageID: set.setFinishImageID,
        url: set.url,
        setPlayCount: set.setPlayCount,
        workouts: set.workouts.map((workout) => {
          const result = {}
          result.videoID = workout.videoID
          result.workoutFinishImageID = workout.workoutFinishImageID
          result.videos_name = workout.videos_name
          result.url = workout.url
          return result
        })
      })
    },

    deleteSetAttributes (index) {
      if (this.selectedSetCount === 1) {
        alert('삭제할 수 없습니다')
        return
      }
      this.selectedSetCount -= 1
      this.setListInProgram.splice(index, 1)
    },

    async filterVideos () {
      const result = (await this.$axios.get('/admin/videos_pagenation', {
        params: {
        // preferPartID: 1,
        // preferCategoryID: 1,
          limit: 10,
          offset: 0,
          query: this.searchQuery
        }
      })).data
      this.videos = result.videos
      this.currentPage = 0
      this.pages = result.pages
    },
    async resetVideos () {
      const result = (await this.$axios.get('/admin/videos_pagenation', {
        params: {
        // preferPartID: 1,
        // preferCategoryID: 1,
          limit: 10,
          offset: 0
        }
      })).data
      this.videos = result.videos
      this.currentPage = 0
      this.pages = result.pages
      this.searchQuery = ''
    }
  }
}
</script>
<style scoped>
.main {
  width: 800px !important;
  display: flex;
  flex-direction: column;
  margin: 16px auto;
}
.upload {
  width: 600px;
}
.main-content {
  display: flex;
  flex-direction: column;
  background-color: #ccc;
  padding: 16px;
  border: 1px solid #ccc;
}
.wrapper {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
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
  margin-bottom: 0;
  cursor: pointer;
}
.button2 {
  border: 1px solid #ddd;
  padding: 6px 24px;
  border-radius: 4px;
  margin: 8px;
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
  margin-top: 8px;
  background-color: #fff;
}
.upload-row {
  display: flex;
  margin-top: 32px;
}
.row-sm-mg {
  margin-top:8px !important;
}
.norow {
  margin-top: 0 !important;
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

.set-attr-input {
width: 150px;
  text-align: center;
  margin-left: auto;
  padding: 4px;
  background: #fff;
  border: 1px solid #ccc;
}
.program-set {
  border: 2px solid #ccc;
  margin-bottom: 16px;
}
.set-title {
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif !important;
}
.set-attr {
  padding: 8px 16px;
}
.set-breaktime-img {
  margin-left: auto;
  width: 100px;
  height: 100px;
}
.workout-breaktime-img {
  margin-left: auto;
  width: 70px;
  height: 70px;
}
.program-video {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif !important;
  cursor: pointer;
}
.program-video-wrapper {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-left: none;
  border-right: none;
  margin-bottom: 4px;
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
  background-color: #f7f7f7;
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
  background-color: #fff;
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
.thumbnail {
  width: 128px;
  height: 128px;
}
</style>
