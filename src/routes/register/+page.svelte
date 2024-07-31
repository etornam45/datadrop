<script>
	import { goto } from '$app/navigation';
	import { api } from '$lib';

let name = '';
  let email = '';
  let password = '';
  let successMessage = '';
  let errorMessage = '';

  function handleRegister() {
    api.post('/user/register', { name, email, password })
      .then((response) => {
        localStorage.setItem('user', JSON.stringify({ name, email }));
        
        
        successMessage = 'Registration successful! Redirecting to login page...';

        setTimeout(() => {
          goto('/login');
        }, 1000); 
        
      })
      .catch((error) => {
        errorMessage = 'Registration failed. Please try again.';
        console.error('Registration failed:', error);
      });
    
    console.log('Registering:', { name, email, password });
  }
</script>



<main class="flex h-screen bg-gray-100">
	<div class="m-auto bg-white rounded-lg shadow-md flex">
		<!-- Left side: Registration form -->
		<div class="p-8 w-96">
			<h1 class="text-3xl font-bold mb-6">Create an account</h1>
			<p class="mb-6 text-gray-600">
				Join us to simplify your workflow and boost your productivity with our Data Extraction App.
			</p>

			<form on:submit|preventDefault={handleRegister}>
				<div class="mb-4">
					<input
						bind:value={name}
						type="text"
						placeholder="Full Name"
						class="w-full p-2 border rounded"
						required
					/>
				</div>
				<div class="mb-4">
					<input
						bind:value={email}
						type="email"
						placeholder="Email"
						class="w-full p-2 border rounded"
						required
					/>
				</div>
				<div class="mb-4">
					<input
						bind:value={password}
						type="password"
						placeholder="Password"
						class="w-full p-2 border rounded"
						required
					/>
				</div>
				<button type="submit" class="w-full bg-black text-white p-2 rounded">Register</button>
			</form>
			{#if successMessage}
			<div class="success-message">{successMessage}</div>
			{/if}
	
			{#if errorMessage}
			<div class="error-message">{errorMessage}</div>
			{/if}
			<p class="mt-6 text-center text-sm text-gray-600">
				Already have an account? <a href="/login" class="text-blue-600">Login</a>
			</p>
		</div>


		<!-- Right side: Illustration -->
		<div class="bg-blue-100 p-8 w-96 flex items-center justify-center">
			<svg class="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<!-- Stylized data extraction illustration -->
				<rect x="40" y="40" width="120" height="120" fill="#93c5fd" rx="20" />
				<circle cx="100" cy="100" r="40" fill="#white" />
				<path
					d="M80 100 L120 100 M100 80 L100 120"
					stroke="#1d4ed8"
					stroke-width="8"
					stroke-linecap="round"
				/>
				<path
					d="M60 60 L80 60 M60 80 L80 80 M60 100 L80 100"
					stroke="#1d4ed8"
					stroke-width="4"
					stroke-linecap="round"
				/>
				<path
					d="M120 120 L140 120 M120 140 L140 140 M140 120 L140 140"
					stroke="#1d4ed8"
					stroke-width="4"
					stroke-linecap="round"
				/>
			</svg>
		</div>
	</div>
	
</main>

<style>
	/* Add any additional styles here */
</style>
