// card.spec.ts
import { test, expect } from '@playwright/test';
import { CardPage } from './CardPage';

test.describe('Card Component', () => {
	test('renders correctly', async ({ page }) => {
		const cardPage = new CardPage(page);

		await cardPage.goto();

		// Optional: Wait for network idle
		await page.waitForLoadState('networkidle');

		// Take a screenshot for debugging
		await page.screenshot({ path: 'screenshot.png', fullPage: true });

		// Check if the Card component is visible
		await cardPage.expectCardToBeVisible();

		// Check the content of the Card
		await cardPage.expectCardContent();
	});
});
