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

  let error = ''

  async function login(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const data = new FormData(form)

    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { accept: 'application/json' },
    })
    const body = await response.json()

    form.reset()

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
      id="username"
      name="username"
      type="username"
      required
    />
  </div>

  <div>
    <label for="password">Password</label>
    <input
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
