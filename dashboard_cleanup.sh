#!/bin/bash
set -e  # Exit immediately if any command fails

###############################################################################
# Function: print_message
# Description: Prints informational messages in bold cyan for clarity.
###############################################################################
function print_message {
    echo -e "\e[1;36m$1\e[0m"
}

###############################################################################
# Step 1: Confirm Cleanup Action with the User
###############################################################################
print_message "WARNING: This script will perform a cleanup of all components installed by the dashboard_setup.sh script."
echo "This includes:"
echo "  - Dropping the PostgreSQL database and user."
echo "  - Removing the cloned NetworkControllerDashboard repository."
echo "  - Deleting the global virtual environment in the backend directory."
read -p "Are you sure you want to proceed? (yes/no): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
    print_message "Cleanup aborted by the user."
    exit 0
fi

###############################################################################
# Step 2: Remove PostgreSQL Database and User
###############################################################################
print_message "Step 2: Removing PostgreSQL database and user..."

# Prompt the user for the PostgreSQL details that were used during setup
read -p "Enter the PostgreSQL database name to drop: " PGDATABASE
read -p "Enter the PostgreSQL username to drop: " PGUSER

print_message "Dropping database '$PGDATABASE' (if it exists)..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS \"$PGDATABASE\";" || true

print_message "Dropping user '$PGUSER' (if it exists)..."
sudo -u postgres psql -c "DROP USER IF EXISTS \"$PGUSER\";" || true

print_message "PostgreSQL database and user removed."

###############################################################################
# Step 3: Remove Cloned Repository
###############################################################################
print_message "Step 3: Removing the cloned repository..."

# Assuming the repository was cloned into the current directory
REPO_DIR="NetworkControllerDashboard"
if [ -d "$REPO_DIR" ]; then
    sudo rm -rf "$REPO_DIR"
    print_message "Repository '$REPO_DIR' has been removed."
else
    print_message "Repository '$REPO_DIR' not found; skipping removal."
fi

print_message "Cleanup complete! Your environment has been reset."
echo "You can now run the dashboard_setup.sh script again for testing."


