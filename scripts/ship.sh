#!/bin/bash
set -e

# Configuration
DROPLET_IP="134.199.156.190"
DROPLET_USER="root"
IMAGE_NAME="newsrumble"
DOMAIN="newsrumble.tw"
DATA_DIR="/opt/newsrumble-data"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}=== NewsRumble Deployment Script ===${NC}"

# Build Docker image locally (for amd64 Linux)
echo -e "${GREEN}[1/3] Building Docker image locally...${NC}"
docker build --platform linux/amd64 -t "$IMAGE_NAME" .

# Transfer image to droplet
echo -e "${GREEN}[2/3] Transferring image to droplet...${NC}"
ssh "$DROPLET_USER@$DROPLET_IP" 'docker image prune -af'
docker save "$IMAGE_NAME" | ssh "$DROPLET_USER@$DROPLET_IP" 'docker load'

# Set up and run container on droplet
echo -e "${GREEN}[3/3] Setting up container on droplet...${NC}"
ssh "$DROPLET_USER@$DROPLET_IP" bash << EOF
set -e

# Create data directory
mkdir -p "$DATA_DIR"

# Stop and remove existing container
docker stop "$IMAGE_NAME" 2>/dev/null || true
docker rm "$IMAGE_NAME" 2>/dev/null || true

# Run container
docker run -d \
    --name "$IMAGE_NAME" \
    --restart unless-stopped \
    --network caddy-net \
    -v "$DATA_DIR:/app/data" \
    "$IMAGE_NAME"

echo "NewsRumble container started"
echo ""
docker logs --tail 10 "$IMAGE_NAME"
EOF

echo ""
echo -e "${GREEN}=== Deployment complete! ===${NC}"
echo -e "App available at: ${GREEN}https://$DOMAIN${NC}"
