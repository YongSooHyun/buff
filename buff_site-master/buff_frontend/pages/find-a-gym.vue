
<template>
  <div class="container flex flex-col py-4">
    <div class="flex flex-col md:flex-row">
      <div class="flex-1 md:mr-6 mb-6">
        <div id="map" class="w-full" />
      </div>
      <div class="flex-1 max-w-full md:max-w-sm">
        <div class="flex">
          <div class="h-full w-full flex flex-col border border-gray-300">
            <div class="bg-white text-lg text-indigo-500 px-3 py-2 border-b">
              BUF 지점 리스트
            </div>

            <div id="journal-scroll" class="w-full h-full overflow-auto bg-white">
              <div
                v-for="gym in gymList"
                :key="gym.name"
                class="relative transform scale-100 text-md py-2 px-3 border-b border-blue-100 hover:bg-gray-100 cursor-pointer"
                @click="panTo(gym.latitude, gym.longitude)"
              >
                <h3 class="text-xl">
                  {{ gym.name }}
                </h3>
                <p class="text-sm mb-1">
                  {{ gym.address }}
                </p>
                <p class="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a :href="'tel:' + gym.phoneNumber1">
                    {{ gym.phoneNumber1 }}
                  </a>
                </p>
                <div>
                  <a
                    v-if="gym.bookingLink"
                    :href="gym.bookingLink"
                    target="_blank"
                    class="text-white font-2 booking-button bg-blue-500"
                  >
                    예약하기
                  </a>
                  <a
                    v-if="gym.kakaoLink"
                    :href="gym.kakaoLink"
                    target="_blank"
                    class="text-black font-2 booking-button bg-yellow-300"
                  >
                    카카오톡문의
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
  async asyncData ({ $axios }) {
    const result = (await $axios.get('/gyms')).data
    console.log(result, 'z')
    return {
      gymList: result
    }
  },
  data () {
    return {
      map: null
    }
  },
  mounted () {
    const KAKAO_MAP_LIB_URL = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey'
    const API_KEY = 'd08642f95d877165be15da6353026dc7'

    if (window.kakao && window.kakao.maps) {
      this.initMap()
    } else {
      const script = document.createElement('script')

      script.onload = () => kakao.maps.load(this.initMap)
      script.src = `${KAKAO_MAP_LIB_URL}=${API_KEY}`
      document.head.appendChild(script)
    }
  },
  methods: {
    getCoordinates () {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    async initMap () {
      const mapContainer = document.getElementById('map')

      let lat = 37.4802658
      let lng = 127.126618
      // 해당 좌표에서 가장 가까운 매장 서버에서 가져오기
      if (navigator.geolocation) {
        try {
          const position = await this.getCoordinates()

          const x = position.coords.latitude
          const y = position.coords.longitude

          // const result = await set(x, y)

          // lat = result.lat
          // lng = result.lng
          lat = x
          lng = y
        } catch (e) {

        }
      }
      const mapOption = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 2,
        mapTypeId: kakao.maps.MapTypeId.ROADMAP
      }

      this.map = new kakao.maps.Map(mapContainer, mapOption)

      const zoomControl = new kakao.maps.ZoomControl()
      // 지도의 우측에 확대 축소 컨트롤을 추가한다
      // map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

      for (const gym of this.gymList) {
        const markerPosition = new kakao.maps.LatLng(gym.latitude, gym.longitude)

        const marker = new kakao.maps.Marker({ position: markerPosition })

        marker.setMap(this.map)

        const content = `<div style="padding: 5px;">${gym.name}</div>`
        const removable = true

        const infoWindow = new kakao.maps.InfoWindow({
          content,
          removable
        })

        kakao.maps.event.addListener(marker, 'click', () => {
          infoWindow.open(this.map, marker)
        })
      }
    },
    panTo (lat, lng) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      const moveLatLng = new kakao.maps.LatLng(lat, lng)
      this.map.panTo(moveLatLng)
    }
  }
}
</script>

<style lang="scss" scoped>
#journal-scroll::-webkit-scrollbar {
width: 4px;
cursor: pointer;

}
#journal-scroll::-webkit-scrollbar-track {
background-color: rgba(229, 231, 235, var(--bg-opacity));
cursor: pointer;
}
#journal-scroll::-webkit-scrollbar-thumb {
cursor: pointer;
background-color: #a0aec0;
}
#map {
  height: 720px;

  @media screen and (max-width: 768px) {
    height: 400px;
  }
}
.booking-button {
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  width: 120px;
  display: flex;
  justify-content: center;
  &:hover {
    background-color: #978469;
  }
}
</style>
