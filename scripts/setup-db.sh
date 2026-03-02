#!/bin/bash
set -e

DROPLET_IP="134.199.156.190"
DROPLET_USER="root"
DATA_DIR="/opt/newsrumble-data"

echo "Uploading database to droplet..."
ssh "$DROPLET_USER@$DROPLET_IP" "mkdir -p $DATA_DIR"
scp data/newsrumble.db "$DROPLET_USER@$DROPLET_IP:$DATA_DIR/newsrumble.db"
echo "Done! Database uploaded to $DATA_DIR/newsrumble.db"
