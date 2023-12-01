<template>
  <div>
    <div class="relative overflow-hidden main">
      <video
        class="absolute w-screen object-cover filter brightness-50 contrast-110 main"
        loop
        :src="require('~/assets/main.mp4')"
        muted
        autoplay
      />
      <div class="container relative h-full p-4 flex items-center justify-center">
        <div class="flex flex-col items-center text-center p-4 max-w-full" style="width: 600px">
          <h4 class="mb-12 text-white text-2xl lg:text-4xl bg-black bg-opacity-50 px-1 font-1">
            BUF에 오신 것을 환영합니다
          </h4>
          <p class="lg:text-2xl text-xl text-white bg-black bg-opacity-50 px-1 font-1">
            온라인 트레이닝 프로그램이 준비되어 있습니다.
          </p>
          <p class="lg:text-2xl text-xl text-white bg-black bg-opacity-50 mb-8 px-1 font-1">
            운동을 시작해 건강하고 완벽한 몸매를 만들어보세요.
          </p>
          <nuxt-link
            v-if="!$store.state.user"
            to="/join"
            style="background-color: #a79479;"
            class="text-white lg:text-xl p-3 inline-block font-2"
          >
            지금 가입 해보세요!
          </nuxt-link>
        </div>
      </div>
    </div>
    <!-- Start Sample Area -->
    <section class="py-24">
      <div class="container">
        <h3 class="text-3xl mb-12">
          BUF란?
        </h3>
        <div>
          <h4 class="text-2xl mb-6">
            버프는 파이팅 히트트레이닝 스튜디오짐입니다.
          </h4>
          <p class="text-gray-500 text-xl leading-loose mb-16">
            365일 4500가지가 넘는 다양한 히트트레이닝 동작이 당신의 숨어있는 근육들을 찾아 깨워줄 것입니다. 몸은 올바로 알고 제대로 쓰는 것이 중요합니다. 기초가 되는 움직임을 익히고 나면, 그 어떤 운동도 쉽게 익힐 수 있습니다. 세상에 좋은 운동은 많습니다. 하지만 BUF를 먼저 익힌다면, 세상 어디에 있던 어떤 상황이던 1평의 공간만 있다면 당신은 어떤 운동도 할 수 있을 것입니다.
          </p>
          <h4 class="text-2xl mb-6">
            운동 초보라구요?
          </h4>
          <p class="text-gray-500 text-xl leading-loose mb-16">
            첫 날은 샤워만 하고 가셔도 좋습니다. 처음이라 동작이 어렵다구요? 팀 트레이닝 후 교정시간에 참여해 보세요. 바빠서 시간을 맞출 수 없다구요? 그럼 편한 시간에 오세요. 버프의 코치들이 당신에게 미션과 함께 포인트레슨을 진행 할 것입니다. 버프와 함께라면 어느 순간 운동을 즐기는 자신을 발견하게 될 것입니다. 우리는 당신을 위한 모든 준비가 되어 있습니다.
          </p>
          <p class="text-black text-2xl font-bold leading-loose">
            쉽고! 재미있고! 효과적으로!
          </p>
        </div>
      </div>
    </section>
    <!-- End Sample Area -->

    <!-- meun_start -->
    <div class="main_bannerarea">
      <div class="main_banneractive owl-carousel">
        <div class="main-banner banner d-flex align-items-center main_bannerbg_1 overlay">
          <div class="container">
            <div class="row align-items-center justify-content-center">
              <div class="col-xl-12">
                <div class="main_bannertext text-center">
                  <span class="font-2">쉽고 재미있고 효과적인</span>
                  <h3 class="font-2">
                    운동프로그램
                  </h3>
                  <p class="font-2">
                    EASY! FUN! FUNCTIONAL!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- main_bannerarea_end -->

    <!-- features_area_start  -->
    <div class="features_area">
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="section_title text-center mb-73">
              <h3>BUF의 효과는 확실합니다</h3>
              <p>처음이라 동작이 어렵다구요? 팀 트레이닝 후 교정시간에 참여해 보세요. 바빠서 시간을 맞출 수 없다구요? 그럼 편한 시간에 오세요. 버프의 코치들이 당신에게 미션과 함께 포인트레슨을 진행 할 것입니다.</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-3 col-md-6">
            <div class="single_feature text-center mb-73">
              <div class="icon flex justify-center">
                <img src="/svg_icon/1.svg" alt="">
              </div>
              <h4>탄탄한 근육</h4>
              <p>There are many variations of passages of lorem Ipsum available.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single_feature text-center">
              <div class="icon flex justify-center">
                <img src="/svg_icon/2.svg" alt="">
              </div>
              <h4>다이어트</h4>
              <p>There are many variations of passages of lorem Ipsum available.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single_feature text-center">
              <div class="icon flex justify-center">
                <img src="/svg_icon/3.svg" alt="">
              </div>
              <h4>스트레스 해소</h4>
              <p>There are many variations of passages of lorem Ipsum available.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="single_feature text-center">
              <div class="icon flex justify-center">
                <img src="/svg_icon/4.svg" alt="">
              </div>
              <h4>훌륭한 코치진</h4>
              <p>There are many variations of passages of lorem Ipsum available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- features_area_end  -->
  </div>
</template>

<style scoped lang="scss">
.main {
  height: 700px;

  @media screen and (max-width: 600px) {
    height: 400px;
  }
}

.main-banner {
  background-image: url('~/assets/main-banner.jpeg');
}

</style>
