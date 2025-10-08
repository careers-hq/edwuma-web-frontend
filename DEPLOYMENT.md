# Edwuma Frontend - CI/CD Deployment Guide

This guide covers the complete CI/CD pipeline setup for deploying the Edwuma frontend application to a Linux server using GitHub Actions, Docker, and Nginx.

## 🏗️ Architecture Overview

```
GitHub Repository
       ↓
GitHub Actions (CI/CD)
       ↓
Docker Registry (GHCR)
       ↓
Linux Server (Production)
       ↓
Nginx (Reverse Proxy)
       ↓
Next.js Application (Container)
```

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 2GB, Recommended 4GB+
- **CPU**: Minimum 2 cores
- **Storage**: Minimum 20GB free space
- **Network**: Public IP with ports 80, 443, 22 open

### Software Requirements
- Docker 20.10+
- Docker Compose 2.0+
- Nginx 1.18+
- Git
- SSH access

## 🚀 Quick Setup

### 1. Server Preparation

Run the automated setup script on your Linux server:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/your-org/edwuma-web-frontend/main/scripts/setup-server.sh | sudo bash
```

Or manually execute:

```bash
sudo chmod +x scripts/setup-server.sh
sudo ./scripts/setup-server.sh
```

### 2. GitHub Repository Configuration

#### Required GitHub Secrets

Add these secrets to your GitHub repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `HOST` | Server IP address or domain | `192.168.1.100` |
| `USERNAME` | SSH username | `edwuma-deploy` |
| `SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `PORT` | SSH port (optional) | `22` |
| `SLACK_WEBHOOK_URL` | Slack notifications (optional) | `https://hooks.slack.com/...` |

#### SSH Key Setup

1. Generate SSH key pair on your local machine:
```bash
ssh-keygen -t ed25519 -C "deployment@edwuma.com" -f ~/.ssh/edwuma_deploy
```

2. Add public key to server:
```bash
ssh-copy-id -i ~/.ssh/edwuma_deploy.pub edwuma-deploy@your-server-ip
```

3. Add private key to GitHub secrets as `SSH_KEY`

### 3. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d edwuma.com -d www.edwuma.com

# Auto-renewal (already configured)
sudo systemctl status certbot.timer
```

#### Option B: Custom SSL Certificate

1. Place your certificate files in `/opt/edwuma-frontend/ssl/`:
   - `edwuma.com.crt` (certificate)
   - `edwuma.com.key` (private key)

2. Update Nginx configuration if needed

### 4. Environment Configuration

1. Copy environment template:
```bash
cp env.example .env.production
```

2. Update production environment variables:
```bash
nano .env.production
```

3. Key variables to configure:
   - `NEXT_PUBLIC_API_URL`: Your API endpoint
   - `NEXTAUTH_SECRET`: Random secret for authentication
   - `NEXTAUTH_URL`: Your domain URL

## 🔄 Deployment Process

### Automatic Deployment

The deployment is triggered automatically when:

- **Push to `main` branch**: Deploys to production
- **Push to `develop` branch**: Deploys to staging
- **Pull Request to `main`**: Runs tests and builds (no deployment)

### Manual Deployment

To trigger deployment manually:

1. Go to GitHub Actions tab
2. Select "Deploy to Linux Server" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Deployment Steps

1. **Lint and Test**: ESLint, TypeScript check, build test
2. **Build Docker Image**: Multi-stage build with optimizations
3. **Push to Registry**: GitHub Container Registry (GHCR)
4. **Deploy to Server**: SSH connection and container update
5. **Health Check**: Verify application is running
6. **Cleanup**: Remove old images and containers

## 🐳 Docker Configuration

### Multi-stage Build

The Dockerfile uses a multi-stage build for optimization:

1. **Dependencies stage**: Install production dependencies
2. **Builder stage**: Build the Next.js application
3. **Runner stage**: Minimal runtime with only necessary files

### Container Features

- **Health checks**: Built-in health monitoring
- **Non-root user**: Security best practices
- **Optimized layers**: Reduced image size
- **Production ready**: Optimized for production use

## 🌐 Nginx Configuration

### Features

- **SSL/TLS termination**: HTTPS with modern ciphers
- **Rate limiting**: API and auth endpoint protection
- **Static asset caching**: Optimized asset delivery
- **Security headers**: XSS, CSRF, and other protections
- **Load balancing**: Ready for multiple instances

### Security Headers

```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

## 📊 Monitoring and Logging

### Health Checks

- **Endpoint**: `https://edwuma.com/health`
- **Response**: JSON with system status
- **Monitoring**: Uptime, memory usage, environment info

### Log Files

- **Deployment logs**: `/var/log/edwuma-frontend-deploy.log`
- **Nginx logs**: `/var/log/nginx/`
- **Application logs**: Docker container logs

### Monitoring Commands

```bash
# Check application status
curl -f https://edwuma.com/health

# View deployment logs
tail -f /var/log/edwuma-frontend-deploy.log

# Check Docker containers
docker ps
docker logs edwuma-frontend

# Check Nginx status
sudo systemctl status nginx
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Deployment Fails

**Symptoms**: GitHub Actions workflow fails
**Solutions**:
- Check SSH key permissions
- Verify server connectivity
- Check Docker daemon status
- Review deployment logs

#### 2. Application Won't Start

**Symptoms**: Container exits immediately
**Solutions**:
- Check environment variables
- Verify port availability
- Check application logs
- Validate Docker image

#### 3. SSL Certificate Issues

**Symptoms**: HTTPS not working
**Solutions**:
- Verify certificate files
- Check Nginx configuration
- Test certificate validity
- Check firewall rules

#### 4. Performance Issues

**Symptoms**: Slow response times
**Solutions**:
- Check server resources
- Optimize Nginx configuration
- Review application logs
- Monitor Docker resources

### Debug Commands

```bash
# Check system resources
htop
df -h
free -h

# Check Docker status
docker system df
docker system prune

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx

# Check application logs
docker logs -f edwuma-frontend
```

## 🔄 Rollback Procedure

### Automatic Rollback

The deployment script includes automatic rollback on health check failure.

### Manual Rollback

```bash
# SSH into server
ssh edwuma-deploy@your-server-ip

# Navigate to deployment directory
cd /opt/edwuma-frontend

# Run rollback script
./scripts/deploy.sh rollback
```

### Rollback Options

1. **Previous version**: Automatic rollback to last successful deployment
2. **Specific version**: Deploy specific Docker image tag
3. **Emergency stop**: Stop all containers and services

## 🔒 Security Considerations

### Server Security

- **Firewall**: UFW configured with minimal open ports
- **Fail2ban**: Protection against brute force attacks
- **SSH**: Key-based authentication only
- **Updates**: Regular security updates

### Application Security

- **HTTPS**: SSL/TLS encryption
- **Headers**: Security headers configured
- **Rate limiting**: API protection
- **Non-root**: Containers run as non-root user

### Secrets Management

- **Environment variables**: Sensitive data in environment files
- **GitHub secrets**: Secure storage of deployment credentials
- **SSH keys**: Secure key management
- **SSL certificates**: Proper certificate handling

## 📈 Performance Optimization

### Docker Optimizations

- **Multi-stage builds**: Reduced image size
- **Layer caching**: Faster builds
- **Health checks**: Automatic recovery
- **Resource limits**: Prevent resource exhaustion

### Nginx Optimizations

- **Gzip compression**: Reduced bandwidth
- **Static caching**: Faster asset delivery
- **Keep-alive**: Connection reuse
- **Rate limiting**: Protection against abuse

### Application Optimizations

- **Next.js optimizations**: Built-in performance features
- **Image optimization**: Automatic image optimization
- **Code splitting**: Reduced bundle size
- **Caching**: Strategic caching implementation

## 🚀 Scaling Considerations

### Horizontal Scaling

- **Load balancer**: Multiple application instances
- **Session management**: Stateless application design
- **Database**: Separate database server
- **CDN**: Static asset delivery

### Vertical Scaling

- **Server resources**: CPU, RAM, storage upgrades
- **Docker resources**: Container resource limits
- **Nginx workers**: Worker process optimization
- **Caching**: Redis or Memcached integration

## 📞 Support

### Getting Help

1. **Check logs**: Review application and deployment logs
2. **GitHub Issues**: Create issue in repository
3. **Documentation**: Review this guide and README
4. **Community**: Join development community discussions

### Emergency Contacts

- **System Administrator**: [admin@edwuma.com]
- **Development Team**: [dev@edwuma.com]
- **Infrastructure**: [infra@edwuma.com]

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Edwuma Development Team
