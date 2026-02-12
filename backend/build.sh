#!/bin/bash
# Render build script — installs dependencies and seeds the database
set -e

echo ">>> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ">>> Seeding database..."
python seed_data.py

echo ">>> Build complete!"
