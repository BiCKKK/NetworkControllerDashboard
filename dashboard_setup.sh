#!/bin/bash

# Function to display messages
function print_message {
    echo -e "\e[1;36m$1\e[0m"
}

# Cloning the application repository
print_message {Cloning NetworkControllerDashboard Repository...}
sudo apt-get install git

git clone https://github.com/BiCKKK/NetworkControllerDashboard.git
print_message {Repository cloned successfully!}

# Downloading dependencies and supporting tools
print_message {Downloading Dependencies and Supporting tools...}


print_message {Installing tools required for compiling BPFabric...}
sudo apt-get install gcc-multilib protobuf-c-compiler protobuf-compiler libprotobuf-dev python3-protobuf python3-twisted clang


print_message {Downloading pgAdmin4 for inspecting PostgreSQL database operations...}
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'
sudo apt install pgadmin4-desktop


print_message {Downloading Nodejs and npm...}
sudo apt install nodejs npm

print_message {Downloading PostgreSQL...}
sudo apt-get install postgresql postgresql-common postgresql-contrib

