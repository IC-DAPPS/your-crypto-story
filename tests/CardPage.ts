// CardPage.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class CardPage {
  readonly page: Page;
  readonly card: Locator;
  readonly cardTitle: Locator;
  readonly cardSubtitle: Locator;
  readonly cardContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.card = page.locator('article.card');
    this.cardTitle = this.card.locator('h2[slot="start"]');
    this.cardSubtitle = this.card.locator('h3[slot="end"]');
    this.cardContent = this.card.locator('p');
  }

  async goto() {
    await this.page.goto('http://localhost:5173');
    // Adjust this URL as needed
  }

  async expectCardToBeVisible() {
    await expect(this.cardTitle).toBeVisible();
  }

  async expectCardContent() {
    await expect(this.cardTitle).toHaveText('Everything');
    await expect(this.cardSubtitle).toHaveText('on-chain');
    await expect(this.cardContent).toHaveText('Advanced smart contracts process HTTP requests, control other chains, and scale infinitely');
  }
}