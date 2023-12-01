<template>
  <div>
    <div class="py-4">
      <div class="container">
        <div class="row">
          <div class="col-xl-12">
            <div class="section_title text-center mb-73">
              <h3>BUF 프로그램</h3>
              <!-- <p>BUF는 고강도 써킷트레이닝으로 짧은시간에 유산소운동과 웨이트트레이닝을 할 수 있는 300여가지의 운동 세션을 보유하고 있습니다.<br></p> -->
            </div>
          </div>
        </div>
        <div class="row">
          <img class="program_img" src="/program/strong_espresso.png" alt="">
          <img class="program_img" src="/program/sparta.png" alt="">
          <img class="program_img" src="/program/victory_marine.png" alt="">
          <img class="program_img" src="/program/red_tiger.png" alt="">
          <img class="program_img" src="/program/vegas_fighter.png" alt="">
          <img class="program_img" src="/program/circus_circus.png" alt="">
          <img class="program_img" src="/program/mountain_rocky.png" alt="">
          <img class="program_img" src="/program/phuket_nakmuai.png" alt="">
          <img class="program_img" src="/program/field_day.png" alt="">
        </div>
        <div class="container mb-12">
          <h2 class="font-2 mb-1">
            1일체험
          </h2>
          <p class="sample-text text-gray-700 text-xl leading-9 pt-8">
            1일체험 문의는 아래에 톡상담을 이용해 주세요
          </p>
          <div style="margin: auto; display: flex; width: 110px; margin-top: 4px;">
            <a id="channel-chat-button" target="_blank" :href="'https://pf.kakao.com/_ZZddK/chat'">
              <img
                src="kakaoChannel.png"
              >
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- features_area_end  -->
</template>

<style scoped>
.wrapper {
  display: flex;
}
.program_img {
  max-width: 960px;
  margin: auto;
  margin-bottom: 48px;
}
@media screen and (max-width: 1080px) {
 .program_img {
     max-width: 768px;
 }
}

@media screen and (max-width: 768px) {
 .program_img {
     max-width: 540px;
 }
}

@media screen and (max-width: 540px) {
 .program_img {
     max-width: 360px;
 }
}
</style>
