import type { RequestHandler } from '@sveltejs/kit'
import * as bcrypt from 'bcrypt'
import * as cookie from 'cookie'

import { db } from '$lib/database'

export const post: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json()

  if (!username || !password) {
    return {
      status: 400,
      body: {
        error: 'Username and password is required.',
      },
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
      status: 401,
      body: {
        error: 'You entered the wrong credentials.',
      },
    }
  }

  return {
    status: 201,
    body: { message: 'Success.' },
    headers: {
      'Set-Cookie': cookie.serialize('session', user.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      }),
    },
  }
}
