import * as cookieparser from 'cookieparser'
import cookie from 'js-cookie'
import base64url from 'base64url'

export const state = () => {
  return {
    buf_token: undefined,
    user: undefined
  }
}

export const mutations = {
  setUser (state, token) {
    cookie.set('buf_token', token.accessToken)
    state.buf_token = token
    state.user = token ? JSON.parse(base64url.decode(token.accessToken.split('.')[1])) : undefined
  },
  logout (state) {
    cookie.remove('buf_token')
    state.buf_token = undefined
    state.user = undefined
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const cookie = req.headers.cookie
    try {
      const token = cookieparser.parse(cookie)

      if (token.buf_token) {
        commit('setUser', { accessToken: token.buf_token })
      }
    } catch (e) {}
  }
}
