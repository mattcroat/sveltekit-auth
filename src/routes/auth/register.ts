import type { RequestHandler } from '@sveltejs/kit'
import * as bcrypt from 'bcrypt'

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
      headers: { location: '/register' },
    }
  }

  if (!username || !password) {
    return {
      status: 303,
      body: {
        error: 'Username and password is required.',
      },
      headers: { location: '/register' },
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
      status: 303,
      body: {
        error: 'User already exists.',
      },
      headers: { location: '/register' },
    }
  }

  return {
    status: 301,
    headers: { location: '/' },
  }
}
