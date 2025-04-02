#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
# Treat unset variables as an error when substituting.
# Pipeline return status is the value of the last command to exit with a non-zero status,
# or zero if no command exited with a non-zero status.
set -euo pipefail

# --- Utility Functions ---

# Log informational messages
log_info() {
  echo "[$(date +'%Y-%m-%dT%H:%M:%S%z')] INFO: $@"
}

# Log error messages
log_error() {
  echo >&2 "[$(date +'%Y-%m-%dT%H:%M:%S%z')] ERROR: $@"
}

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# --- Dependency Checks ---

check_dependencies() {
  log_info "Checking required dependencies (node, npm)..."
  local error_found=0

  if ! command_exists node; then
    log_error "Node.js is not installed or not found in PATH. Please install Node.js (version >= 20)."
    error_found=1
  else
    # Simple version check (basic comparison)
    local node_version
    node_version=$(node -v | cut -d'v' -f2)
    local major_version
    major_version=$(echo "$node_version" | cut -d'.' -f1)
    if [ "$major_version" -lt 20 ]; then
       log_error "Node.js version is $node_version. Version 20 or higher is required."
       error_found=1
    else
       log_info "Node.js version $node_version found."
    fi
  fi

  if ! command_exists npm; then
    log_error "npm is not installed or not found in PATH. Please install npm (usually comes with Node.js)."
    error_found=1
  else
    log_info "npm found."
  fi

  if [ "$error_found" -ne 0 ]; then
    log_error "Dependency check failed. Please install the required dependencies."
    exit 1
  fi
  log_info "All required dependencies found."
}


# --- Main Execution ---

# Ensure script is run from the project root (where the root package.json is)
if [ ! -f "package.json" ]; then
    log_error "This script must be run from the project root directory (containing the main package.json)."
    exit 1
fi

# Check for required tools
check_dependencies

# Install all dependencies using the script defined in the root package.json
log_info "Installing all dependencies..."
if ! npm run install-all; then
  log_error "Failed to install dependencies. See output above for details."
  exit 1
fi
log_info "Dependencies installed successfully."

# Start the development servers using the script defined in the root package.json
log_info "Starting client and server development servers..."
log_info "Press Ctrl+C to stop both servers."
# The 'npm run dev' command uses concurrently and will run in the foreground.
if ! npm run dev; then
  log_error "Failed to start development servers. This might happen if you stopped them immediately with Ctrl+C, or if there was an error during startup."
  # Exit code might be non-zero due to concurrently handling Ctrl+C, so don't necessarily exit 1 here unless we want to.
  # We'll let it exit naturally after the command finishes (even if killed).
fi

log_info "Development servers stopped."
exit 0