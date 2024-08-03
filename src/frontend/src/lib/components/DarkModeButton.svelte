<script lang="ts">
	import DarkMode from 'flowbite-svelte/DarkMode.svelte';

	export let btnClass = '';

	let particles: any[] = [];
	let darkMode = false;

	const createParticle = (x: any, y: any) => {
		const lightModeEmojis = ['🎉', '🌞', '🎊', '✨', '☀️', '🌟', '💥'];
		const darkModeEmojis = ['🌙', '🌌', '🌠', '⭐️', '🌟', '🪐', '💤'];
		const emojis = darkMode ? darkModeEmojis : lightModeEmojis;
		const emoji = emojis[Math.floor(Math.random() * emojis.length)];
		const id = Math.random();
		const angle = Math.random() * Math.PI * 2;
		const velocity = 2 + Math.random() * 3;
		const size = 10 + Math.random() * 20;

		return { id, x, y, emoji, angle, velocity, size };
	};

	const handleClick = (event: any) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = rect.width / 2;
		const y = rect.height / 2;

		const newParticles = Array.from({ length: 20 }, () => createParticle(x, y));
		particles = [...particles, ...newParticles];

		setTimeout(() => {
			particles = particles.filter((p) => !newParticles.includes(p));
		}, 1000);

		darkMode = !darkMode;
	};
</script>

<div class="button-container">
	<button on:click={handleClick}>
		<DarkMode {btnClass} />
	</button>

	{#each particles as { id, x, y, emoji, angle, velocity, size } (id)}
		<span
			class="particle"
			style="
          left: 50%;
          top: 50%;
          font-size: {size}px;
          --angle: {angle}rad;
          --velocity: {velocity};
        "
		>
			{emoji}
		</span>
	{/each}
</div>

<style>
	.button-container {
		position: relative;
		display: inline-block;
	}
	.particle {
		position: absolute;
		pointer-events: none;
		animation:
			fireworks 1s ease-out forwards,
			fade-out 1s ease-out forwards;
	}
	@keyframes fireworks {
		0% {
			transform: translate(-50%, -50%) scale(0.5);
		}
		100% {
			transform: translate(
					calc(var(--velocity) * 50px * cos(var(--angle))),
					calc(var(--velocity) * 50px * sin(var(--angle)))
				)
				scale(1);
		}
	}
	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
