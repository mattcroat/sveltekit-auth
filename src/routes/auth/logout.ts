import type { RequestHandler } from '@sveltejs/kit'
import * as cookie from 'cookie'

export const post: RequestHandler = async () => {
  return {
    status: 303,
    headers: {
      'Set-Cookie': cookie.serialize('session', '', {
        path: '/',
        // this says this should have expired yesterday
        expires: new Date(0),
      }),
      location: '/',
    },
  }
}
