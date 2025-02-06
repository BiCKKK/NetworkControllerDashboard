#!/bin/bash

set -e # Exit immediately if any command exits with a non-zero status

# Function to display messages
function print_message {
    echo -e "\e[1;36m$1\e[0m"
}

# Cloning the application repository
print_message "Cloning NetworkControllerDashboard Repository..."
sudo apt-get install -y git
git clone https://github.com/BiCKKK/NetworkControllerDashboard.git
print_message "Repository cloned successfully!"

# Downloading dependencies and supporting tools
print_message "Installing System Dependencies..."
print_message "Installing tools required for compiling BPFabric..."
sudo apt-get install -y gcc-multilib protobuf-c-compiler protobuf-compiler libprotobuf-dev python3-protobuf python3-twisted clang python3-venv

# Install DPDK
print_message "Installing DPDK (Data Plane Development Kit)..."
if [ -f "/usr/local/bin/dpdk-devbind.py" ]; then
    print_message "DPDK appears to be already installed. Skipping DPDK installation."
else
    print_message "DPDK not found. Proceeding with download and installation..."
    sudo apt-get install -y build-essential meson ninja-build libnuma-dev pkg-config python3-pyelftools
    # Adjust the version as needed
    DPDK_VERSION="24.11.1"
    wget https://fast.dpdk.org/rel/dpdk-${DPDK_VERSION}.tar.xz
    tar xf dpdk-${DPDK_VERSION}.tar.xz
    cd dpdk-stable-${DPDK_VERSION}
    meson setup build
    ninja -C build
    sudo ninja -C build install
    sudo ldconfig
    
    cd ..
    print_message "DPDK installed successfully!"
    sudo rm -rf dpdk-${DPDK_VERSION}.tar.xz dpdk-stable-${DPDK_VERSION}
fi

# Setup pgAdmin
print_message "Setting up pgAdmin4 for inspecting PostgreSQL database operations..."
if dpkg -s pgadmin4-desktop >/dev/null 2>&1; then
    print_message "pgAdmin-desktop already installed. Skipping installation."
else
    curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
    sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
    sudo apt-get update
    sudo apt install -y pgadmin4-desktop
fi

print_message "Installing Nodejs and npm..."
sudo apt-get install -y nodejs npm
print_message "Nodejs and npm installed."

print_message "Installing PostgreSQL..."
sudo apt-get install -y postgresql postgresql-common postgresql-contrib
print_message "PostgreSQL installed successfully!"

print_message "Configuring PostgreSQL Database..."
# Start PostgreSQL service
sudo service postgresql start
# Prompt user for PostgreSQL credentials and database details
read -p "Enter PostgreSQL host (default: localhost): " PGHOST
PGHOST=${PGHOST:-localhost}
read -p "Enter PostgreSQL database name: " PGDATABASE
read -p "Enter PostgreSQL username: " PGUSER
read -sp "Enter PostgreSQL passowrd: " PGPASSWORD
echo ""

print_message "Creating PostgreSQL Database..."
sudo -u postgres psql -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD';" || true
sudo -u postgres psql -c "CREATE DATABASE $PGDATABASE OWNER $PGUSER;" || true
print_message "PostgreSQL user and database setup complete."

# Export environment variable so that flask application can use them
export PG_HOST="$PGHOST"
export PG_DATABASE="$PGDATABASE"
export PG_USER="$PGUSER"
export PG_PASSWORD="$PGPASSWORD"
# Also construct the DATABASE_URL environment variable
export DATABASE_URL="postgresql+psycopg://$PGUSER:$PGPASSWORD@$PGHOST:5432/$PGDATABASE"
print_message "Database Configuration Updated!"


# Build the react frontend
print_message "Setting up the React Frontend..."
cd NetworkControllerDashboard/frontend
npm install
# npm run build [THIS IS FOR PRODUCTION ENVIRONMENT]
print_message "Frontend Setup Complete!"
cd ..

# Setup the backend
print_message "Setting up the Flask Backend..."
cd backend
print_message "Compiling the backend..."
make

# Create a virtual environment for python backend operations (if not already present)
if [ ! -d "venv" ]; then
    print_message "Creating Python Vitual Environment for Backend..."
    python3 -m venv venv
    print_message "Activating Virtual Environment..."
    source venv/bin/activate
    print_message "Installing backend packages..."
    pip install -r requirements.txt
    print_message "Backend packages installed successfully."
    deactivate
else
    print_message "Virtual Environment already exists."
fi 

# Run database migration
print_message "Running Database migrations..."
source venv/bin/activate

# Re-export environment variables
export PG_HOST='$PGHOST'
export PG_DATABASE='$PGDATABASE'
export PG_USER='$PGUSER'
export PG_PASSWORD='$PGPASSWORD'
export DATABASE_URL="postgresql+psycopg://$PGUSER:$PGPASSWORD@$PGHOST:5432/$PGDATABASE"
export FLASK_APP=manage.py

echo "DATABASE_URL: $DATABASE_URL"

flask db init
flask db migrate -m "Models created"
flask db upgrade
deactivate
print_message "Database migrations successful, tables created!"

# Instructions about running applications
print_message "Setup Complete!"
echo ""
print_message "To start your applications, use the following commands:"
echo "1. Open three terminals"
echo "2. In first terminal, run cd NetworkControllerDashboard/backend/controller && ../venv/bin/python app.py"
echo "3. In second terminal, run cd NetworkControllerDashboard/backend/topologies && ../venv/bin/python app.py"
echo "4. In third terminal, run cd NetworkControllerDashboard/frontend && npm run dev"
echo "5. Click the link that will pop up in the third terminal"
