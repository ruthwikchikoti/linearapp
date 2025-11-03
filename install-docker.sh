#!/bin/bash

# Docker Installation Script for Ubuntu/Debian
# Run with: sudo bash install-docker.sh

set -e

echo "🐳 Installing Docker and Docker Compose..."

# Update package index
echo "📦 Updating package index..."
apt-get update

# Install prerequisites
echo "📦 Installing prerequisites..."
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
echo "🔑 Adding Docker's official GPG key..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo "📝 Setting up Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
echo "📦 Updating package index with Docker repository..."
apt-get update

# Install Docker Engine, CLI, and Docker Compose
echo "🚀 Installing Docker Engine, CLI, and Docker Compose..."
apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# Add current user to docker group (if not root)
if [ "$SUDO_USER" ]; then
    echo "👤 Adding $SUDO_USER to docker group..."
    usermod -aG docker $SUDO_USER
    echo "✅ User $SUDO_USER added to docker group"
    echo "⚠️  You may need to log out and log back in, or run: newgrp docker"
fi

# Start Docker service
echo "🚀 Starting Docker service..."
systemctl start docker
systemctl enable docker

# Create docker-compose alias for backward compatibility
echo "🔗 Creating docker-compose alias..."
if [ ! -f /usr/local/bin/docker-compose ]; then
    cat > /usr/local/bin/docker-compose << 'EOF'
#!/bin/bash
docker compose "$@"
EOF
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Created docker-compose alias"
fi

# Verify installation
echo "✅ Verifying installation..."
docker --version
docker compose version
docker-compose --version

echo ""
echo "✅ Docker and Docker Compose installed successfully!"
echo ""
echo "📝 Next steps:"
if [ "$SUDO_USER" ]; then
    echo "   1. Log out and log back in (or run: newgrp docker)"
    echo "   2. Then run: docker-compose up --build"
else
    echo "   1. Run: docker-compose up --build"
fi
echo ""
echo "💡 Note: Both 'docker compose' and 'docker-compose' commands work!"
echo ""

