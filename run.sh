#!/bin/bash
set -e

# Function to handle script exit
cleanup() {
    echo ""
    echo "Shutting down..."
    if [ -n "$BACKEND_PID" ]; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
}

# Trap signals to ensure cleanup
trap cleanup SIGINT SIGTERM EXIT

# 1. Build and Prepare Backend
echo "=== Setting up Backend ==="
cd dash
if ! command -v cargo &> /dev/null; then
    echo "Error: cargo (Rust) is not installed."
    exit 1
fi

echo "Building release binary..."
cargo build --release

echo "Preparing binary..."
cp target/release/dash dash.bin
chmod +x dash.bin
cd ..

# 2. Build and Prepare Frontend
echo "=== Setting up Frontend ==="
if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed."
    exit 1
fi

echo "Installing dependencies..."
pnpm install

echo "Building Next.js application..."
pnpm build

# 3. Run Services
echo "=== Starting Services ==="

# Start Backend
echo "Starting Backend Server..."
cd dash
./dash.bin &
BACKEND_PID=$!
cd ..
echo "Backend started with PID $BACKEND_PID"

# Give backend a moment to initialize
sleep 2

# Start Frontend
echo "Starting Frontend Server..."
pnpm start &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

echo "=== All systems operational ==="
echo "Press Ctrl+C to stop both servers."

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
