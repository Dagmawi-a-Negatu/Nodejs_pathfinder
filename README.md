# Railway Application

## Overview
Welcome to the Railway Journey! This command-line application is designed to find the best routes between two railway stations within a given network. Leveraging a comprehensive railway network graph, the application calculates possible journeys from an origin to a destination station, taking into account the number of allowed transfers.


![Railway Networks](https://github.com/Dagmawi-a-Negatu/UK-Railway-Networks/assets/117816205/944664ba-c353-4c46-b47e-e5b967d7bb2a)

## Getting Started

### Prerequisites

Node.js
A terminal or command line interface
### Installation
Download and install Node.js from nodejs.org.

### Setup the Development Enviroment
Clone the repository: git clone https://github.com/yourusername/railway-journey.git
cd railway-journey
Install dependencies:
npm install

## Project Structure
project-root
│
├── app
│
├── data
│   ├── in_error.json
│   ├── notional_ra.json
│   ├── railtrack_uk.json
│   ├── simpleton_railway.json
│   └── smokey_mountain.json
│
├── src
│   ├── network.js
│   └── railway.js
│
├── .gitignore
├── package.json
├── README.md
.

## Basic Folder Structure
app/: Contains the main application logic.
data/: Contains various JSON files representing different railway networks.
src/: Contains the main scripts for running the network analysis.
network.js: Main script to run the network analysis.
railway.js: Core logic for the railway network.
Root Directory:
.gitignore: Git ignore file.
package.json: Node.js project metadata and dependencies.
README.md: Project README file.

## Usage
To use the Railway Journey Planner, run the following command in your terminal, replacing the placeholders with your specific information:
node src/network.js <data/railtrack_file.json> <origin> <destination> <max_transfers>
<data/railtrack_file.json>: Path to the JSON file containing the railway network graph.
<origin>: The name of the origin station.
<destination>: The name of the destination station.
<max_transfers>: The maximum number of transfers allowed for the journey.

## Example
node src/network.js data/railtrack_uk.json "Edinburgh" "London" 3
This command searches for routes from "Edinburgh" to "London" with a maximum of 3 transfers, using the railway network defined in data/railtrack_uk.json.

## Acknowledgments
Inspired by various railway systems and algorithms. Special thanks to all viewers.

## Contact
For any issues, please reach out to dagmawi.negatu@gmail.com.

