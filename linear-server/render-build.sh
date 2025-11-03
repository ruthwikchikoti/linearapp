#!/usr/bin/env bash
# Build script for Render deployment

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Build completed successfully!"
