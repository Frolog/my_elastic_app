Elasticsearch + Flutter Full-Stack Project
1. Project Architecture (How it works)
This is a Full-Stack system consisting of three layers that communicate with each other:
Elasticsearch (The Engine): A powerful search database running inside a Docker container. It is isolated to avoid conflicts with your Linux system files.
Node.js (The Bridge): A backend server (v20) that acts as a mediator. It receives requests from Flutter, translates them for Elasticsearch, and returns the data.
Flutter (The Face): The user interface running in the browser (Web). It provides the search bar and displays results in a user-friendly way.
2. Project Structure
text
my_elastic_app/
├── mobile/                 # Flutter Frontend (UI, GET & POST logic)
│   ├── lib/main.dart       # Main Application Code
│   ├── pubspec.yaml        # Flutter dependencies (http package)
│   └── .gitignore          # Filters out heavy build/ files
├── server/                 # Node.js Backend (Express & Elastic Client)
│   ├── index.js            # API Logic & Connection settings
│   ├── package.json        # Node dependencies (express, cors, elastic)
│   └── .gitignore          # Filters out node_modules/
└── README.md               # Documentation


3. Environment Setup (One-time installation)
If you move to a new Linux machine, run these commands to prepare the tools:
# Update and install Git & Docker
sudo apt update
sudo apt install git docker.io -y
sudo systemctl enable --now docker
sudo usermod -aG docker $USER && newgrp docker
# Install Node.js v20 (Using NVM)
curl -o- raw.githubusercontent.com | bash
source ~/.bashrc
nvm install 20
# Install Flutter SDK manually
mkdir -p ~/Projects && cd ~/Projects
git clone github.com -b stable
echo 'export PATH="$PATH:$HOME/Projects/flutter/bin"' >> ~/.bashrc
source ~/.bashrc
4. Restoring Project from GitHub
To restore the app without the heavy "trash" folders:
# Clone the repository
cd ~/Projects
git clone github.com
cd my_elastic_app
# Restore the Server (Backend)
cd server
npm install
# Restore the App (Mobile)
cd ../mobile
flutter pub get
5. Running the Project (Daily Workflow)
To run the full stack, open 3 separate terminals:
Terminal 1: The Database (Elasticsearch)
Directory: Anywhere
Command: sudo docker start elasticsearch
Note: If the container doesn't exist, run:
sudo docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" docker.elastic.co/elasticsearch/elasticsearch:8.12.0
Terminal 2: The Backend Bridge (Node.js)
Directory: cd ~/Projects/my_elastic_app/server
Command: node index.js
Terminal 3: The Frontend (Flutter)
Directory: cd ~/Projects/my_elastic_app/mobile
Command: flutter run -d chrome
6. Troubleshooting & Fixes Implemented
Node.js v20: Required to solve the File is not defined error in the Elasticsearch library.
Compatibility Mode: Added enableCompatibilityMode: true in index.js to match the Node client with the Elasticsearch 8.x engine.
CORS: Added app.use(cors()) in the server to allow the Flutter Web app to communicate with the local server.
Flutter Clean: Used to shrink project size from 370MB to <5MB for Git backups.
7. Where to See Results?
UI Level: Use the Flutter App in Chrome. Fill "Name", "Description" and click "Add to Elastic".
API Level: Visit http://localhost:3000/search?q=Flutter to see raw JSON data.
Database Level: Run curl "localhost:9200/my_index/_search?q=*" in a terminal to see all stored documents.