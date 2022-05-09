<script lang="ts">
  import { session } from '$app/stores'
  import { goto } from '$app/navigation'

  async function logout() {
    await fetch('/auth/logout', { method: 'post' })

    // required to update the user interface
    $session = {}
    await goto('/')
  }
</script>

<nav>
  {#if !$session.user}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}

  {#if $session.user}
    <form
      on:submit|preventDefault={logout}
      action="/auth/logout"
      method="post"
    >
      <button type="submit">Log out</button>
    </form>
  {/if}
</nav>

<slot />
