## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- npm (usually comes with Node.js)
- dfx (Internet Computer SDK)

### Setting up the project

1. Clone the repository:

   ```
   git clone https://github.com/IC-DAPPS/rust-svelte-gix
   cd rust-svelte-gix
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Install playwright:
   ```
   npx playwright install --save-dev
   ```

### Running the application locally

1. Start the Internet Computer local network:
   ```
   dfx start --clean
   ```

### Running tests

In a new terminal, you can run the tests:

To run all tests:

```
npm run test
```

To run specific tests:

- For card component:
  ```
  npm run test:card
  ```

## Built With

- [Svelte](https://svelte.dev/) - The web framework used
- [Internet Computer](https://internetcomputer.org/) - Deployment platform
- [Playwright](https://playwright.dev/) - Testing framework

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
