<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ session }) => {
    if (!session.user) {
      return {
        status: 302,
        redirect: '/login',
      }
    }

    return {
      status: 200,
      props: {
        user: session.user.username,
      },
    }
  }
</script>

<script lang="ts">
  export let user: string

  // import { session } from '$app/stores'
  // console.log($session)
</script>

<h1>Protected route</h1>

<p>Welcome {user}!</p>
