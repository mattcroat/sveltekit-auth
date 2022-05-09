<script lang="ts">
  import { goto } from '$app/navigation'

  let username = ''
  let password = ''
  let error = ''

  async function handleSubmit() {
    error = ''

    const response = await fetch('/auth/register', {
      method: 'post',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const message = await response.json()
      error = message.error ? message.error : ''
      return
    }

    await goto('/')
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  action="/auth/register"
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

  <button type="submit">Sign Up</button>
</form>

<style>
  .error {
    color: tomato;
  }
</style>
