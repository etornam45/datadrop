<script async script lang="ts">
	export let user: {
		id: string;
		name: string;
		email: string;
	} | null = null;
</script>

<header>
	<nav class="flex justify-between items-center py-2 px-6 bg-gray-800 text-white">
		<ul class="flex items-center justify-between w-full">
			<div class="flex gap-4">
				<li><a href="/">Home</a></li>
				<li><a href="/dashboard">Dashboard</a></li>
			</div>
			{#if user}
				<li class="flex items-start flex-col justify-start">
					Welcome, {user.name} <br />
				</li>
			{/if}

			{#if !user}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</nav>
</header>
