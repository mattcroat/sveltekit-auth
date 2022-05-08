<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ session }) => {
    if (!session.user) {
      return {
        status: 302,
        redirect: '/login',
      }
    }

    // todo
    return {}
  }
</script>

<h1>Protected route</h1>
