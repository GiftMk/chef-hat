<script lang="ts">
import '../app.css'
import Logo from '$lib/components/Logo.svelte'
let { children } = $props()
</script>

<main class="w-full h-full max-w-5xl flex p-16 justify-center m-auto">
	<Logo />
{@render children()}
</main>
