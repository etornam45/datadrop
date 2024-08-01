<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib';

	let email = '';
	let password = '';

	function handleLogin() {
    api.post('/user/login', { email, password })
      .then((response) => {
        localStorage.setItem('authToken', response.data.token);
        
        goto('/dashboard');
        console.log('Login successful:', response);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }
</script>

<main class="flex h-screen bg-gray-100">
	<div class="m-auto bg-white rounded-lg shadow-md flex">
		<!-- Left side: Login form -->
		<div class="p-8 w-96">
			<h1 class="text-3xl font-bold mb-6">Welcome back!</h1>
			<p class="mb-6 text-gray-600">
				Simplify your workflow and boost your productivity with our Data Extraction App.
			</p>

			<form on:submit|preventDefault={handleLogin}>
				<div class="mb-4">
					<input
						bind:value={email}
						type="text"
						placeholder="Email"
						class="w-full p-2 border rounded"
					/>
				</div>
				<div class="mb-4">
					<input
						bind:value={password}
						type="password"
						placeholder="Password"
						class="w-full p-2 border rounded"
					/>
				</div>
				<button type="submit" class="w-full bg-black text-white p-2 rounded">Login</button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-600">
				Not a member? <a href="/register" class="text-blue-600">Register now</a>
			</p>
		</div>

		<!-- Right side: Illustration -->
		<div class="bg-green-100 p-8 w-96 flex items-center justify-center">
			<svg class="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<!-- Person -->
				<circle cx="100" cy="70" r="50" fill="#4ade80" />
				<circle cx="100" cy="60" r="30" fill="#bbf7d0" />
				<!-- Arms -->
				<path d="M50 100 Q75 80 100 100" stroke="#4ade80" stroke-width="10" fill="none" />
				<path d="M150 100 Q125 80 100 100" stroke="#4ade80" stroke-width="10" fill="none" />
				<!-- Legs -->
				<path d="M85 150 L100 100 L115 150" stroke="#4ade80" stroke-width="10" fill="none" />
				<!-- Heart -->
				<path
					d="M90 90 Q100 80 110 90 T130 90 Q120 70 100 85 Q80 70 70 90 Q80 100 90 90"
					fill="white"
				/>
			</svg>
		</div>
	</div>
</main>

<style>
	/* Add any additional styles here */
</style>
