#!/bin/bash

# ArchScope Project Setup Script
set -e

echo "Setting up ArchScope project environment..."

# Update system packages
sudo apt-get update -y > /dev/null 2>&1

# Install Java 17 (required by the project)
echo "Installing Java 17..."
sudo apt-get install -y openjdk-17-jdk > /dev/null 2>&1

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> $HOME/.profile

# Install Maven
echo "Installing Maven..."
sudo apt-get install -y maven > /dev/null 2>&1

# Install Node.js and npm (for frontend)
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - > /dev/null 2>&1
sudo apt-get install -y nodejs > /dev/null 2>&1

# Verify installations
echo "Verifying installations..."
java -version
mvn -version
node --version
npm --version

# Navigate to project directory
cd /mnt/persist/workspace

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd arch-scope-frontend
npm install > /dev/null 2>&1
cd ..

# Build the parent project first to install all modules
echo "Building parent project..."
mvn clean install -DskipTests -q

echo "Setup completed successfully!"