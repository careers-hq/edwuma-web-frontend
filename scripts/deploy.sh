#!/bin/bash

# Deployment script for Edwuma Frontend
# This script should be run on the Linux server

set -e

# Configuration
DEPLOY_DIR="/opt/edwuma-frontend"
BACKUP_DIR="/opt/backups/edwuma-frontend"
LOG_FILE="/var/log/edwuma-frontend-deploy.log"
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if user is in docker group
    if ! groups $USER | grep -q docker; then
        error "User $USER is not in the docker group"
        exit 1
    fi
    
    log "Prerequisites check passed"
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    
    sudo mkdir -p $DEPLOY_DIR
    sudo mkdir -p $BACKUP_DIR
    sudo mkdir -p /var/log
    sudo mkdir -p $DEPLOY_DIR/nginx/conf.d
    sudo mkdir -p $DEPLOY_DIR/ssl
    
    # Set proper permissions
    sudo chown -R $USER:$USER $DEPLOY_DIR
    sudo chown -R $USER:$USER $BACKUP_DIR
    
    log "Directories created successfully"
}

# Backup current deployment
backup_current() {
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A $DEPLOY_DIR)" ]; then
        log "Creating backup of current deployment..."
        
        # Create backup
        sudo cp -r $DEPLOY_DIR $BACKUP_DIR/backup_$DATE
        
        # Keep only last 5 backups
        cd $BACKUP_DIR
        ls -t | tail -n +6 | xargs -r rm -rf
        
        log "Backup created: backup_$DATE"
    else
        log "No existing deployment to backup"
    fi
}

# Pull latest image
pull_image() {
    log "Pulling latest Docker image..."
    
    cd $DEPLOY_DIR
    
    # Login to GitHub Container Registry
    echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin
    
    # Pull the latest image
    docker pull ghcr.io/$GITHUB_REPOSITORY:$IMAGE_TAG
    
    log "Image pulled successfully"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    cd $DEPLOY_DIR
    
    # Stop existing containers
    docker-compose down || true
    
    # Update environment variables
    cat > .env.deploy << EOF
REGISTRY=ghcr.io
IMAGE_NAME=$GITHUB_REPOSITORY
IMAGE_TAG=$IMAGE_TAG
EOF
    
    # Start new containers
    docker-compose up -d
    
    # Wait for application to start
    log "Waiting for application to start..."
    sleep 30
    
    # Health check
    if curl -f http://localhost:3000/health; then
        log "Application deployed successfully"
    else
        error "Health check failed"
        # Rollback to previous version
        rollback
        exit 1
    fi
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."
    
    cd $DEPLOY_DIR
    
    # Stop current containers
    docker-compose down || true
    
    # Find the latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR | head -n1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        # Restore from backup
        sudo cp -r $BACKUP_DIR/$LATEST_BACKUP/* $DEPLOY_DIR/
        
        # Start containers
        docker-compose up -d
        
        log "Rollback completed to: $LATEST_BACKUP"
    else
        error "No backup found for rollback"
    fi
}

# Cleanup old images
cleanup() {
    log "Cleaning up old Docker images..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old images (keep last 3 versions)
    docker images --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}" | \
    grep $GITHUB_REPOSITORY | \
    tail -n +4 | \
    awk '{print $1}' | \
    xargs -r docker rmi || true
    
    log "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting deployment process..."
    
    check_root
    check_prerequisites
    setup_directories
    backup_current
    pull_image
    deploy_application
    cleanup
    
    log "Deployment completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    "rollback")
        rollback
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        main
        ;;
esac
