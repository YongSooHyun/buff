export default {
  computed: {
    sessionID () {
      return this.$route.query.session
    },

    programID () {
      return this.$route.params.id
    }
  },

  methods: {
    async validate () {
      const { session } = this.$route.query

      const currentSession = await this.$axios.get(`/session/${session}`)

      if (!currentSession.data) {
        alert('생성되지 않았거나 만료된 운동 세션입니다.')
        return this.$router.replace('/training')
      }
    }
  }
}
