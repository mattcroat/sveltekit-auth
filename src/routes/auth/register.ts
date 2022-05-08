import type { RequestHandler } from '@sveltejs/kit'
import * as bcrypt from 'bcrypt'

import { db } from '$lib/database'

export const post: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json()

  if (!username || !password) {
    return {
      status: 400,
      body: {
        message: 'Username and password is required.',
      },
    }
  }

  try {
    await db.user.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(password, 10),
      },
    })
  } catch (error) {
    return {
      status: 400,
      body: {
        message: 'User already exists.',
      },
    }
  }

  return {
    status: 200,
    headers: { location: '/' },
  }
}
