#!/bin/bash

# This script sets up and runs the CyberShield full-stack application.
# Prerequisites: Python 3.11+ and Node.js 20+ (with pnpm) must be installed.

echo "Starting CyberShield Project Setup and Execution..."

# --- Backend Setup and Start ---
echo "\n--- Setting up Backend (Flask) ---"
cd cybershield-backend || { echo "Error: cybershield-backend directory not found."; exit 1; }

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start Flask backend in a background process
echo "Starting Flask backend..."
python src/main.py &
FLASK_PID=$!
echo "Flask backend started with PID: $FLASK_PID"
cd ..

# --- Frontend Setup and Start ---
echo "\n--- Setting up Frontend (React) ---"
cd cybershield-frontend || { echo "Error: cybershield-frontend directory not found."; exit 1; }

# Install Node.js dependencies
echo "Installing Node.js dependencies (using pnpm)..."
pnpm install

# Start React frontend in a background process
echo "Starting React frontend..."
pnpm run dev --host &
REACT_PID=$!
echo "React frontend started with PID: $REACT_PID"
cd ..

echo "\nCyberShield setup complete. Both backend and frontend are running."
echo "You can access the application at: http://localhost:5173"
echo "To stop the application, run: kill $FLASK_PID $REACT_PID"

# Keep the script running to keep the background processes alive
wait $FLASK_PID $REACT_PID

echo "CyberShield processes stopped."


