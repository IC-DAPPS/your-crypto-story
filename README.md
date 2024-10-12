
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
  npm run test:card
  ```

## Built With

- [Svelte](https://svelte.dev/) - The web framework used
- [Internet Computer](https://internetcomputer.org/) - Deployment platform
- [Playwright](https://playwright.dev/) - Testing framework


# Installation and Running Tests using pocket-ic inside container

## For macOS and Linux Users

### Using Docker

1. Install Docker Desktop:
   - macOS: Download and install from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - Linux: Follow the instructions for your specific distribution on [Docker's official documentation](https://docs.docker.com/engine/install/)

2. Ensure Docker Desktop is running on your laptop:
   - Open Docker Desktop application
   - Wait for the Docker engine to start (you'll see a green "Running" status)

3. Open a terminal or command prompt

4. Navigate to your project directory:
   ```
   cd path/to/your/project
   ```

5. Build the Docker image:
   ```
   npm run build:docker
   ```

6. Run the tests:
   ```
   npm run run:docker
   ```

Note: Make sure Docker Desktop is running before executing these commands. If you encounter any issues, check Docker Desktop's status and restart it if necessary.

### Using Podman (Linux only)

1. Install Podman:
   - For most Linux distributions, use your package manager. For example, on Ubuntu:
     ```
     sudo apt-get update
     sudo apt-get install -y podman
     ```

2. Build the Podman image:
   ```
   npm run build:podman
   ```

3. Run the tests:
   ```
   npm run run:podman
   ```

Note: Podman is not officially supported on macOS. If you're using macOS, we recommend using Docker.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

