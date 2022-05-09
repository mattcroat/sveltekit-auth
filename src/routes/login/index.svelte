<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ session }) => {
    if (session.user) {
      return {
        status: 302,
        redirect: '/',
      }
    }

    return {}
  }
</script>

<script lang="ts">
  import { session } from '$app/stores'
  import { goto } from '$app/navigation'

  let username = ''
  let password = ''
  let error = ''

  async function login() {
    error = ''

    const response = await fetch('/auth/login', {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const body = await response.json()

    if (!response.ok) {
      if (body.error) {
        error = body.error
      }
      return
    }

    // this is required to redirect to `/protected` otherwise it's `{}`
    $session = body.user

    await goto('/protected')
  }
</script>

<form
  on:submit|preventDefault={login}
  action="/auth/login"
  method="post"
>
  <div>
    <label for="username">Username</label>
    <input
      bind:value={username}
      id="username"
      name="username"
      type="username"
      required
    />
  </div>

  <div>
    <label for="password">Password</label>
    <input
      bind:value={password}
      id="password"
      name="password"
      type="password"
      required
    />
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button type="submit">Sign In</button>
</form>

<style>
  .error {
    color: tomato;
  }
</style>
