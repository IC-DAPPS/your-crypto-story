#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting deployment process..."

# Pull Internet Identity as a dependency from the mainnet and deploy locally
echo "Pulling and deploying Internet Identity..."
dfx deps pull
dfx deps init --argument '(null)' internet-identity
dfx deps deploy

# Run Cargo tests to generate Candid file
echo "Running Cargo tests to generate Candid file..."
cargo test
sleep 5
# Deploy Backend Canister
echo "Deploying Backend Canister..."
dfx deploy backend
sleep 15

# Generate declarations
echo "Generating declarations..."
dfx generate backend

# deploy frontend
# echo "Deploying frontend..."
# npm install
# dfx deploy frontend

# Inform the user that the deployment completed successfully
echo "Deployment completed successfully. Now you can start your local development server by running 'npm run dev'"
