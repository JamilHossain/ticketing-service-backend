#!/bin/bash
set -e

echo "Deployment started ..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server !"

echo "Installing Dependencies...."
bun install --yes

echo "Creating Production Build..."
bun run build

echo "PM2 Reload"
pm2 reload feedback-backend

echo "Deployment Finished!!"