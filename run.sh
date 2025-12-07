#!/bin/bash
set -e

# Start the backend in the background
echo "Starting the backend..."
(cd dash && ./target/release/dash) &

# Start the frontend
echo "Starting the frontend..."
pnpm start
