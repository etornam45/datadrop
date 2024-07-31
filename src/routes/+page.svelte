<script>
	import { goto } from '$app/navigation';
	import Button from './../lib/components/ui/button/button.svelte';
	// import { onMount } from 'svelte';
	// import { api } from '$lib';
	// import { Button } from '../';

	function handleloginroute() {
		goto('/login');
	}
	function handleregisterroute() {
		goto('/register');
	}
	function handleGetStarted() {
		goto('/dashboard');
	}
</script>

<div class="header">
	<div class="first">
		<div class="logo">datadrop</div>
		<nav>
			<div class="inner">
				<a href="#">Features</a>
				<a href="#">Pricing</a>
			</div>
		</nav>
	</div>
	<div class="second">
		<span><a href="#" on:click = {handleloginroute}>Login</a></span>
		<span><a href="#" on:click = {handleregisterroute}>Register</a></span>
	</div>
</div>

<div class="main">
	<div class="top">
		<div class="main-text">
			<h1>Upload, Extract, Analyse</h1>
			<p>Extract relevant data from your documents in seconds.</p>
			<button on:click = {handleGetStarted} >Get Started</button>
		</div>
		<div class="partners">
			<img src="../../images/client-databiz.svg" alt="Databiz" />
			<img src="../../images/client-audiophile.svg" alt="Audiophile" />
			<img src="../../images/client-meet.svg" alt="Meet" />
			<img src="../../images/client-maker.svg" alt="Maker" />
		</div>
	</div>
	<div class="main-image">
		<img class="page_img" src="../../images/image-hero-desktop.png" alt="Person working remotely" />
	</div>
</div>

<main>
	<div class="intro-email">
		<h5>Get early access today</h5>
		<p>
			It only takes a minute to sign up and our free starter tier is extremely generous. If you have
			any questions, our support team would be happy to help you
		</p>
		<div class="input-container">
			<input type="email" name="email" placeholder="email@example.com" required />
			<div class="get-started">
				<a class="see-how-text" href="#">Get Started For Free</a>
				<a href="#">
					<i class="fa-solid fa-arrow-right"></i>
					<span class="ruler"></span>
				</a>
			</div>
		</div>
	</div>
</main>

<footer>
	<div class="footer-container">
		<div class="address">
			<div class="footer-logo">
				<h1>datadrop</h1>
			</div>
			<div class="locate">
				<i class="fa-solid fa-location-dot"></i>
				<p></p>
			</div>
		</div>
		<div class="contact">
			<p>
				<img src="../../images/icon-phone.svg" alt="Phone icon" class="contact-image" />+233 555
				6667
			</p>
			<p>
				<img
					src="../../images/icon-email.svg"
					alt="email icon"
					class="contact-image"
				/>example@gmail.com
			</p>
		</div>
		<div class="about-us">
			<h5>About us</h5>
			<a href="#">Job</a>
			<a href="#">Press</a>
			<a href="#">Blog</a>
		</div>
		<div class="contact-us">
			<h5>Contact Us</h5>
			<a href="#">Terms</a>
			<a href="#">Privacy</a>
		</div>
		<div class="social-icon">
			<a><i class="fa-brands fa-facebook-f"></i></a>
			<a><i class="fa-brands fa-twitter"></i></a>
			<a><i class="fa-brands fa-instagram"></i></a>
		</div>
	</div>
</footer>

<style>
	body {
		margin: 0;
		padding: 0;
		background-color: #f7f7f7;
		box-sizing: border-box;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 50px;
		background-color: white;
	}
	.header a {
		text-decoration: none;
		margin-left: 20px;
	}
	.first {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 500px;
	}
	.inner {
		margin: 0%;
		padding: 4%;
		width: 200px;
	}
	.inner a {
		color: hsl(0, 0%, 41%);
	}
	span a {
		border-bottom: 2px solid hsl(0, 0%, 8%);
		cursor: default;
		padding: 0.7em;
		color: hsl(0, 0%, 8%);
		font-weight: 700;
	}
	.inner,
	.second {
		font-size: 16px;
		font-family: 'Epilogue';
	}
	.second a:hover {
		color: #0000ff;
		border: 1px solid #0000ff;
		border-radius: 15px;
	}
	.main {
		display: flex;
		justify-content: space-between;
		padding: 50px;
		flex-direction: row;
	}
	.main-text {
		max-width: 500px;
	}
	.main-text h1 {
		font-size: 48px;
		margin-bottom: 20px;
		font-family: 'Epilogue';
		color: hsl(0, 0%, 8%);
	}
	.main-text p {
		font-size: 16px;
		margin-bottom: 20px;
		color: hsl(0, 0%, 41%);
		font-family: 'Epilogue';
	}
	.main-text button {
		padding: 15px 30px;
		background-color: black;
		color: white;
		border: none;
		cursor: pointer;
		font-size: 16px;
	}
	.page_img {
		max-width: 400px;
		object-fit: cover;
	}
	.top {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.partners {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20px 0;
	}
	.partners img {
		margin: 0 20px;
		filter: grayscale(100%) sepia(90%) saturate(500%) hue-rotate(180deg);
	}
	.logo {
		color: hsl(0, 0%, 8%);
		font-weight: 800;
		font-family: 'Epilogue';
		font-size: xx-large;
	}
	.intro-email {
		max-width: 90%;
		margin: 0 auto;
		background-color: hsl(0, 0%, 98%);
		position: relative;
		top: 200px;
		padding-top: 40px;
		padding-right: 30px;
		padding-left: 30px;
		padding-bottom: 40px;
		border-radius: 5px;
		font-family: 'Epilogue';
		box-shadow: 4px 2px 6px rgba(0, 0, 0, 0.3);
	}
	.intro-email h5 {
		font-size: 16px;
		color: hsl(0, 0%, 8%);
		font-weight: 700;
		text-align: center;
		font-family: 'Epilogue';
	}
	.intro-email p {
		font-size: 14px;
		color: hsl(0, 0%, 8%);
		opacity: 0.8;
		line-height: 1.5;
		margin: 20px 0 20px 0;
		text-align: center;
		font-family: 'Epilogue';
	}
	input[type='email'] {
		padding: 15px;
		width: 100%;
		border-radius: 50px;
		outline: none;
		border: none;
		width: 60%;
	}
	.see-how-text {
		text-decoration: none;
		color: hsl(0, 0%, 8%);
		font-family: 'Epilogue';
		margin: 0%;
		padding: 0%;
		max-width: fit-content;
	}
	.see-how-text:hover {
		color: hsl(176, 68%, 64%);
	}
	.fa-arrow-right {
		padding: 4px;
		background-color: hsl(0, 0%, 100%);
		margin-left: 4px;
		color: #333333;
		border-radius: 100px;
		font-size: 10px;
	}
	.fa-arrow-right:hover {
		color: #333333;
		background-color: hsl(176, 68%, 64%);
	}
	.ruler {
		width: 164px;
		height: 3px;
		margin: 5px 0 0 0;
		display: block;
		background-color: hsl(0, 0%, 0%);
		position: absolute;
		left: 27px;
	}
	.ruler:hover {
		background-color: hsl(176, 68%, 64%);
	}
	.get-started {
		display: flex;
		flex-direction: row;
	}
	footer {
		background-color: #f7f7f7;
		padding: 120px 0;
	}
	.footer-container {
		padding: 120px 0;
	}
	.footer-container {
		display: flex;
		justify-content: space-evenly;
	}
	.address {
		max-width: 400px;
		padding: 20px;
	}
	.footer-logo {
		max-width: 40% !important;
		padding: 10px;
		font-family: 'Epilogue';
	}
	.address p {
		font-size: 14px;
		color: hsl(0, 0%, 8%);
		line-height: 1.5;
		opacity: 0.8;
	}
	.contact-image {
		filter: invert(100%) grayscale(100%);
	}
	.locate {
		display: flex;
		margin-top: 30px;
		font-family: 'Epilogue';
	}
	.fa-location-dot {
		margin-right: 20px;
		color: hsl(0, 0%, 8%);
	}
	.contact {
		padding-left: 20px;
	}
	.contact p {
		color: hsl(0, 0%, 41%);
		line-height: 3;
		font-family: 'Epilogue';
	}
	.about-us {
		padding-left: 20px;
		font-family: 'Epilogue';
	}
	.about-us h5 {
		color: hsl(0, 0%, 8%);
		font-size: 14px;
		font-weight: 700;
		padding-top: 30px;
		font-family: 'Epilogue';
	}
	.about-us a {
		display: block;
		padding-top: 20px;
		font-size: 14px;
		font-family: 'Epilogue';
		text-decoration: none;
		color: hsl(0, 0%, 41%);
	}
	.contact-us {
		padding-left: 20px;
	}
	.contact-us h5 {
		color: hsl(0, 0%, 8%);
		font-size: 14px;
		font-weight: 700;
		padding-top: 30px;
		font-family: 'Epilogue';
	}
	.contact-us h5 {
		padding-top: 0;
	}
	.contact-us a {
		display: block;
		padding-top: 20px;
		font-size: 14px;
		font-family: 'Epilogue';
		text-decoration: none;
		color: hsl(0, 0%, 41%);
	}
	.social-icon {
		padding: 5px;
	}
	.social-icon a i {
		padding: 8px;
		border: 2px solid hsl(0, 0%, 8%);
		border-radius: 50px;
		font-size: 10px;
	}
	.social-icon a i:hover {
		border: 2px solid hsl(176, 68%, 64%);
	}
</style>
