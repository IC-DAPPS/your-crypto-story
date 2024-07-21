<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import { authStore } from '$lib/stores/auth.store';

	let input = '';
	let disabled = false;
	let greeting = '';

	let whoami = '';
	import { Card, Input } from '@dfinity/gix-components';
</script>

<main>
	<br />
	<br />
	<div class="flex-center">
		<div class="width">
			<Card>
				<Input
					name="name"
					inputType="text"
					bind:value={input}
					{disabled}
					placeholder="Enter your name"
					><label for="name" slot="start">Enter your name:</label></Input
				>
				<button
					class="primary"
					on:click={async () => {
						greeting = await $authStore.actor.greet(input);
					}}
					type="submit">Click Me!</button
				>
			</Card>
		</div>
	</div>

	<section class="width" id="greeting">
		{greeting}
	</section>

	<br />
	<br />

	<section class="width" style="text-align: center;">
		<Auth />
		<button
			class="danger"
			on:click={async () => {
				whoami = await $authStore.actor.whoami();
			}}>Who ami</button
		>
		<p class="whoami-style">{whoami}</p>
	</section>
	<div class="flex-center">
		<div class="width">
			<Card>
				<h2 slot="start">Everything</h2>
				<h3 slot="end">on-chain</h3>

				<p>
					Advanced smart contracts process HTTP requests, control other chains, and scale infinitely
				</p>
			</Card>
		</div>
	</div>
</main>

<style lang="scss">
	@use '@dfinity/gix-components/dist/styles/mixins/card';
	@use '@dfinity/gix-components/dist/styles/mixins/media';
	.flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.width {
		width: 100%;
	}
	@include media.min-width(small) {
		.width {
			width: 70%;
		}
	}
	@include media.min-width(medium) {
		.width {
			width: 55%;
		}
	}

	@include media.min-width(large) {
		.width {
			width: 50%;
		}
	}

	.forming {
		width: fit-content;
	}
	.whoami-style {
		margin: 10px auto;
		padding: 10px 60px;
		border: 1px solid #e01717;
	}

	form {
		display: flex;
		justify-content: center;
		gap: 0.5em;
		flex-flow: row wrap;
		max-width: 40vw;
		margin: auto;
		align-items: baseline;
		font-family: sans-serif;
		font-size: 1.5rem;
	}

	button[type='submit'] {
		padding: 5px 20px;
		margin: 10px auto;
		float: right;
	}

	#greeting {
		margin: 10px auto;
		padding: 10px 60px;
		border: 1px solid #222;
	}

	#greeting:empty {
		display: none;
	}
</style>
