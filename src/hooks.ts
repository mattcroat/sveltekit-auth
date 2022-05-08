import type { GetSession, Handle } from '@sveltejs/kit'
import * as cookie from 'cookie'

export const handle: Handle = async ({
  event,
  resolve,
}) => {
  const cookieHeader = event.request.headers.get('cookie')
  const cookies = cookie.parse(cookieHeader || '')

  // todo
  event.locals.user = { username: 'test' }

  return await resolve(event)
}

export const getSession: GetSession = ({ locals }) => {
  return {
    user: locals.user && {
      username: locals.user.username,
    },
  }
}
