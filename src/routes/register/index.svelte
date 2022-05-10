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
  import { goto } from '$app/navigation'

  let error = ''

  async function register(event: SubmitEvent) {
    const form = event.target as HTMLFormElement
    const data = new FormData(form)

    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { accept: 'application/json' },
    })
    const body = await response.json()

    if (!response.ok) {
      if (body.error) {
        error = body.error
      }
      return
    }

    await goto('/')
  }
</script>

<form
  on:submit|preventDefault={register}
  action="/auth/register"
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

  <button type="submit">Sign Up</button>
</form>

<style>
  .error {
    color: tomato;
  }
</style>
