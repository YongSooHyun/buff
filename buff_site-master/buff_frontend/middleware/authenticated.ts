import { Middleware } from '@nuxt/types'

const myMiddleware: Middleware = (context) => {
  const user = context.store.state.user

  if (!user) {
    if (process.server) {
      return context.redirect('/login')
    }

    if (process.client) {
      alert('로그인이 필요한 페이지입니다.')
      return context.redirect('/login')
    }
  }
}

export default myMiddleware
