# Railway Journey

## Overview

The Railway Journey is a command-line application designed to find the best routes between two railway stations within a given network. Leveraging a comprehensive railway network graph, the application calculates possible journeys from an origin to a destination station, taking into account the number of allowed transfers. 
## Features

- **Custom Railway Network Input**: Users can input their own railway network through a JSON file.
- **Origin to Destination Planning**: Given an origin and a destination station, the tool calculates possible routes.
- **Transfer Limitation**: Users can specify the maximum number of transfers allowed for the journey.
- **Detailed Journey Summaries**: For each found route, the application outputs a comprehensive summary, including the route's sequence of stations, total distance, and the number of route changes.

## Usage

To use the Railway Journey Planner, run the following command in your terminal, replacing the placeholders with your specific information:

- `<railtrack_file.json>`: Path to the JSON file containing the railway network graph.
- `<origin>`: The name of the origin station.
- `<destination>`: The name of the destination station.
- `<max_transfers>`: The maximum number of transfers allowed for the journey.

### Example

node network.js network.json "New York" "Los Angeles" 3

This command searches for routes from "New York" to "Los Angeles" with a maximum of 3 transfers, using the railway network defined in`network.json`.

