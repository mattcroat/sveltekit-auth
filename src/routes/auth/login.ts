import type { RequestHandler } from '@sveltejs/kit'
import * as bcrypt from 'bcrypt'
import * as cookie from 'cookie'

import { db } from '$lib/database'

export const post: RequestHandler = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (
    typeof username !== 'string' ||
    typeof password !== 'string'
  ) {
    return {
      status: 303,
      body: {
        error: 'Something went horribly wrong.',
      },
      headers: { location: '/login' },
    }
  }

  if (!username || !password) {
    return {
      status: 303,
      body: {
        error: 'Username and password is required.',
      },
      headers: { location: '/login' },
    }
  }

  const user = await db.user.findUnique({
    where: { username },
  })
  const passwordMatch =
    user &&
    (await bcrypt.compare(password, user.passwordHash))

  if (!user || !passwordMatch) {
    return {
      status: 303,
      body: {
        error: 'You entered the wrong credentials.',
      },
      headers: { location: '/login' },
    }
  }

  return {
    // has to return 3xx status code for redirect
    status: 301,
    body: {
      // this is only because $session = body.user
      // so we can set the session and navigate to `/protected`
      // look at `/login/index.svelte`
      user: {
        user: { username },
      },
      message: 'Success.',
    },
    headers: {
      'Set-Cookie': cookie.serialize('session', user.id, {
        // send cookie for every page
        path: '/',
        // server side only cookie so you can't use `document.cookie`
        httpOnly: true,
        // only requests from same site can send cookies
        // and serves to protect from CSRF
        // https://developer.mozilla.org/en-US/docs/Glossary/CSRF
        sameSite: 'strict',
        // only sent over HTTPS
        secure: process.env.NODE_ENV === 'production',
        // set cookie to expire after a month
        maxAge: 60 * 60 * 24 * 30,
      }),
      // javascript disabled
      location: '/protected',
    },
  }
}
