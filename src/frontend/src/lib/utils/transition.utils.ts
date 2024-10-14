import { type TransitionConfig } from 'svelte/transition';
import { cubicInOut } from 'svelte/easing';

export const smoothFly = (
	node: Element,
	{
		delay = 0,
		duration = 600,
		y = 30,
		opacity = 0
	}: {
		delay?: number;
		duration?: number;
		y?: number;
		opacity?: number;
	}
): TransitionConfig => {
	return {
		delay,
		duration,
		css: (t: number) => {
			const eased = cubicInOut(t);
			return `
                opacity: ${opacity + (1 - opacity) * eased};
                transform: 
                    translateY(${(1 - eased) * y}px)
                    scale(${0.95 + eased * 0.05});
            `;
		}
	};
};
