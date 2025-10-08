#!/bin/bash

# Health check script for Edwuma Frontend
# This script can be used for monitoring and alerting

set -e

# Configuration
HEALTH_URL="http://localhost:3000/api/health"
TIMEOUT=10
RETRIES=3
LOG_FILE="/var/log/edwuma-health-check.log"

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

# Health check function
check_health() {
    local attempt=1
    
    while [ $attempt -le $RETRIES ]; do
        log "Health check attempt $attempt/$RETRIES"
        
        if curl -f -s --max-time $TIMEOUT "$HEALTH_URL" > /dev/null; then
            log "Health check passed"
            return 0
        else
            warning "Health check failed (attempt $attempt/$RETRIES)"
            attempt=$((attempt + 1))
            sleep 5
        fi
    done
    
    error "Health check failed after $RETRIES attempts"
    return 1
}

# Detailed health check
detailed_health_check() {
    log "Running detailed health check..."
    
    # Check if container is running
    if ! docker ps | grep -q edwuma-frontend; then
        error "Edwuma frontend container is not running"
        return 1
    fi
    
    # Check container health
    local container_health=$(docker inspect --format='{{.State.Health.Status}}' edwuma-frontend 2>/dev/null || echo "unknown")
    if [ "$container_health" != "healthy" ] && [ "$container_health" != "starting" ]; then
        warning "Container health status: $container_health"
    fi
    
    # Check application response
    local response=$(curl -s --max-time $TIMEOUT "$HEALTH_URL" || echo "failed")
    if [ "$response" = "failed" ]; then
        error "Application is not responding"
        return 1
    fi
    
    # Parse health response
    local status=$(echo "$response" | jq -r '.status' 2>/dev/null || echo "unknown")
    if [ "$status" != "healthy" ]; then
        error "Application status: $status"
        return 1
    fi
    
    log "Detailed health check passed"
    return 0
}

# System resource check
check_resources() {
    log "Checking system resources..."
    
    # Check memory usage
    local memory_usage=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$memory_usage > 90" | bc -l) )); then
        warning "High memory usage: ${memory_usage}%"
    fi
    
    # Check disk usage
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        warning "High disk usage: ${disk_usage}%"
    fi
    
    # Check Docker resources
    local docker_containers=$(docker ps -q | wc -l)
    log "Running containers: $docker_containers"
    
    log "Resource check completed"
}

# Container restart function
restart_container() {
    log "Restarting Edwuma frontend container..."
    
    cd /opt/edwuma-frontend
    docker-compose restart edwuma-frontend
    
    # Wait for container to start
    sleep 30
    
    # Check if restart was successful
    if check_health; then
        log "Container restart successful"
    else
        error "Container restart failed"
        return 1
    fi
}

# Alert function (customize based on your alerting system)
send_alert() {
    local message="$1"
    log "ALERT: $message"
    
    # Example: Send to Slack
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 Edwuma Frontend Alert: $message\"}" \
            "$SLACK_WEBHOOK_URL" || true
    fi
    
    # Example: Send email
    if [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "Edwuma Frontend Alert" "$ALERT_EMAIL" || true
    fi
}

# Main health check function
main() {
    log "Starting health check for Edwuma Frontend..."
    
    # Basic health check
    if check_health; then
        # Detailed health check
        if detailed_health_check; then
            # Resource check
            check_resources
            log "All health checks passed"
            exit 0
        else
            error "Detailed health check failed"
            send_alert "Detailed health check failed"
            exit 1
        fi
    else
        error "Basic health check failed"
        
        # Try to restart container
        if restart_container; then
            log "Container restarted successfully"
            send_alert "Container was restarted due to health check failure"
        else
            error "Container restart failed"
            send_alert "CRITICAL: Container restart failed"
            exit 1
        fi
    fi
}

# Handle script arguments
case "${1:-}" in
    "restart")
        restart_container
        ;;
    "resources")
        check_resources
        ;;
    "detailed")
        detailed_health_check
        ;;
    *)
        main
        ;;
esac
