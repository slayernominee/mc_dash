#!/bin/bash
set -e

# Install frontend dependencies
echo "Installing frontend dependencies..."
pnpm install

# Build the backend
echo "Building the backend..."
(cd dash && cargo build --release)

# Build the frontend
echo "Building the frontend..."
pnpm run build

echo "Setup complete!"
