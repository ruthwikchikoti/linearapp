#!/bin/bash

echo "🚀 Starting Linear Clone Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null && [ "$MONGODB_URL" != *"atlas"* ]; then
  echo "⚠️  Warning: MongoDB doesn't appear to be running locally"
  echo "   Make sure MongoDB is running or update .env with MongoDB Atlas URL"
fi

# Start backend
echo "📦 Starting backend server..."
cd linear-server
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../linear-client
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Application starting!"
echo "   Backend:  http://localhost:3001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait

