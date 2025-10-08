#!/bin/bash

# Server setup script for Edwuma Frontend deployment
# This script should be run on a fresh Linux server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        error "This script must be run as root"
        exit 1
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    
    # Update package lists
    apt-get update
    
    # Upgrade existing packages
    apt-get upgrade -y
    
    # Install essential packages
    apt-get install -y \
        curl \
        wget \
        git \
        unzip \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        htop \
        vim \
        ufw \
        fail2ban
    
    log "System packages updated"
}

# Install Docker
install_docker() {
    log "Installing Docker..."
    
    # Remove old Docker versions
    apt-get remove -y docker docker-engine docker.io containerd runc || true
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Update package lists
    apt-get update
    
    # Install Docker
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Add current user to docker group
    usermod -aG docker $SUDO_USER
    
    log "Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    log "Installing Docker Compose..."
    
    # Download Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make it executable
    chmod +x /usr/local/bin/docker-compose
    
    # Create symlink
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    log "Docker Compose installed successfully"
}

# Configure firewall
configure_firewall() {
    log "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH
    ufw allow ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow Docker daemon (if needed)
    ufw allow 2376/tcp
    
    log "Firewall configured"
}

# Configure fail2ban
configure_fail2ban() {
    log "Configuring fail2ban..."
    
    # Create jail.local configuration
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
EOF
    
    # Start and enable fail2ban
    systemctl start fail2ban
    systemctl enable fail2ban
    
    log "Fail2ban configured"
}

# Create deployment user
create_deployment_user() {
    log "Creating deployment user..."
    
    # Create user
    useradd -m -s /bin/bash edwuma-deploy || true
    
    # Add to docker group
    usermod -aG docker edwuma-deploy
    
    # Create SSH directory
    mkdir -p /home/edwuma-deploy/.ssh
    chmod 700 /home/edwuma-deploy/.ssh
    
    # Set ownership
    chown -R edwuma-deploy:edwuma-deploy /home/edwuma-deploy/.ssh
    
    log "Deployment user created: edwuma-deploy"
    warning "Please add SSH keys to /home/edwuma-deploy/.ssh/authorized_keys"
}

# Setup monitoring
setup_monitoring() {
    log "Setting up basic monitoring..."
    
    # Install htop for system monitoring
    apt-get install -y htop iotop nethogs
    
    # Create log rotation for application logs
    cat > /etc/logrotate.d/edwuma-frontend << EOF
/var/log/edwuma-frontend-deploy.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 edwuma-deploy edwuma-deploy
}
EOF
    
    log "Monitoring setup completed"
}

# Create deployment directories
create_directories() {
    log "Creating deployment directories..."
    
    # Create main deployment directory
    mkdir -p /opt/edwuma-frontend
    mkdir -p /opt/backups/edwuma-frontend
    mkdir -p /var/log
    
    # Set permissions
    chown -R edwuma-deploy:edwuma-deploy /opt/edwuma-frontend
    chown -R edwuma-deploy:edwuma-deploy /opt/backups
    chown -R edwuma-deploy:edwuma-deploy /var/log
    
    log "Directories created"
}

# Install SSL certificate tools
install_ssl_tools() {
    log "Installing SSL certificate tools..."
    
    # Install certbot for Let's Encrypt
    apt-get install -y certbot python3-certbot-nginx
    
    log "SSL tools installed"
    info "Run 'certbot --nginx' to obtain SSL certificates"
}

# Main setup function
main() {
    log "Starting server setup for Edwuma Frontend..."
    
    check_root
    update_system
    install_docker
    install_docker_compose
    configure_firewall
    configure_fail2ban
    create_deployment_user
    setup_monitoring
    create_directories
    install_ssl_tools
    
    log "Server setup completed successfully!"
    
    echo ""
    info "Next steps:"
    echo "1. Add SSH keys to /home/edwuma-deploy/.ssh/authorized_keys"
    echo "2. Configure GitHub secrets for deployment"
    echo "3. Run 'certbot --nginx' to obtain SSL certificates"
    echo "4. Test deployment with GitHub Actions"
}

# Run main function
main
