
<template>
  <div class="flex flex-col min-h-screen">
    <top-nav v-if="!isPlayer" />
    <nuxt style="flex: 1 1 auto; width: 100%;" />
    <bottom-foot v-if="!isPlayer" />
  </div>
</template>

<script>
/* eslint-disable no-unused-expressions */
import $ from 'jquery'
import TopNav from './top-nav'
import BottomFoot from './bottom-foot'

export default {
  components: {
    TopNav,
    BottomFoot
  },

  computed: {
    isPlayer () {
      return this.$route.name === 'training-id-player' || this.$route.name === 'training-id-controller'
    }
  },

  mounted () {
    $(window).on('scroll', function () {
      const scroll = $(window).scrollTop()
      if (scroll < 110) {
        $('#sticky-header').removeClass('sticky')
        $('#back-top').fadeIn(500)
      } else {
        $('#sticky-header').addClass('sticky')
        $('#back-top').fadeIn(500)
      }
    })
  }

}
</script>
