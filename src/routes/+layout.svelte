<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<main class="my-10 flex flex-wrap justify-center">
	<div class="container px-4">
		{@render children()}
	</div>
</main>
