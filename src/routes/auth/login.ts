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
        // todo use body.errors
        message: 'Username and password is required.',
      },
    }
  }

  const user = await db.user.findUnique({
    where: { username },
  })
  const isPasswordMatch =
    user &&
    (await bcrypt.compare(password, user.passwordHash))

  if (!user || !isPasswordMatch) {
    return {
      status: 400,
      body: {
        message: 'You entered the wrong credentials.',
      },
    }
  }

  return {
    status: 201,
    body: { message: 'Success.' },
    headers: {
      'Set-Cookie': cookie.serialize(
        'session',
        user.username,
        {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30,
        }
      ),
    },
  }
}
