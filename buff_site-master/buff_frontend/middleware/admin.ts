import { Middleware } from '@nuxt/types'

const adminMiddleware: Middleware = (context) => {
  const user = context.store.state.user
  if (!user || user.role !== 'ADMIN') {
    return context.redirect('/')
  }
}

export default adminMiddleware
