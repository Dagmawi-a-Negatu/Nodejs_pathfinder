
/**
 * Author: PUT YOUR NAME HERE.
 *
 * Describe this module here.
**/


const railway = require('./railway.js');

// Example of testing the readData function
//console.log(railway.readData('notional_ra.json')); // Should log the message from readData and return true


/**
 * Holds data for a station. On a graph this will represent the nodes of the graph.
 * Each station hold an array of links to other stations (these represent the edges 
 * of a graph).
 *@param stationID {number} The id number of the station (each station has a unique ID).
 * @param stationName {string} The name of the station.
 **/
function Station(stationID, stationName){

    this.stationName = stationName;
    this.stationID = stationID;
    this.links = [];
}//end station
 
/**
*This function adds a link to a station.
*@param {object} link The link object representing a link to another station.
**/
Station.prototype.addLink = function(link){
        this.links.push(link);
}


/**
 * Forms the links between one station and the next. This object is what allows 
 * the stations to become notes on a graph. Essentially in graph theory  the
 * stations are the nodes and the Link objects are the edges.
 **/

function Link(routeName, station, distance){
     this.routeName = routeName;
     this.distance = distance;
     this.station = station;
}//end link
 
 //THE REST OF YOUR CODE GOES BELOW HERE
 
 

function Journey() {
    this.stations = [];      // An array of all stations on this journey
    this.distance = 0;       // The total distance of the journey in miles
    this.text = "";          // Description of the journey
    this.success = false;    // Indicates if the destination was reached
    this.changes = 0;        // Number of route changes
}

// This function creates a shallow copy of the journey object and returns another instance of Journey.
Journey.prototype.copy = function() {
    let newJourney = new Journey();
    newJourney.stations = this.stations.slice()
    newJourney.distance = this.distance;
    newJourney.text = this.text; // Corrected typo from newJounrney to newJourney
    newJourney.success = this.success;
    newJourney.changes = this.changes;
    return newJourney; // Corrected from return copy; to return newJourney;
}

// Generates and displays a journey report
Journey.prototype.report = function() {
    let journeySummary = "Journey Summary\n===============\n";
    if (this.stations.length > 0) {
      journeySummary += `Embark at ${this.stations[0]} on ${this.text}\n`;
      for (let i = 1; i < this.stations.length - 1; i++) {
        journeySummary += `At ${this.stations[i]} change to next route\n`;
      }
      journeySummary += `Arrive at ${this.stations[this.stations.length - 1]}\n`;
    }
    journeySummary += `Total distance: ${this.distance}\n`;
    journeySummary += `Changes: ${this.changes}\n`;
    journeySummary += `Passing through: ${this.stations.join(", ")}\n`;
    console.log(journeySummary);
    return journeySummary; // Useful for testing
}

// Increments the distance of the journey
Journey.prototype.incDistance = function(amt) {
    if (typeof amt === 'number' && amt > 0) {
        this.distance += amt;
    }
}


 
function network(){
    let jsonData = railway.readData('notional_ra.json');
        
    let graph = {
                    stationArray : []   // graph object with stationArray property
                };

    /* Iterates through each route */
    for (let route of jsonData.routes) {
        let previousStation; // Store the next station for each route
        
        /* Iterates through each stop on each route */
        for (let stop of route.stops) {
            // Check if the station is in the graph, based on stationID
            let stationIndex = graph.stationArray.findIndex(station => station.stationID === stop.stationID);
            let currentStation;

            if (stationIndex === -1) {
                // If the station doesn't exist in the graph, create and add it
                currentStation = new Station(stop.stationID, stop.stationName);
                graph.stationArray.push(currentStation);
            } else {
                // Reference the existing station from the graph
                currentStation = graph.stationArray[stationIndex];
            }

            // Add links between current station and the next station
            if (previousStation) {
                // Assuming distanceToNext is from current to next, and distanceToPrev is from next to current
                let linkFromPreviousToCurrent = 
                new Link(route.name, previousStation, stop.distanceToNext || stop.distanceToPrev || 0); // if distanceToNext is undefined, default to 0
                let linkFromCurrentToPrevious
                = new Link(route.name, currentStation, stop.distanceToPrev || 0); // if distanceToPrev is undefined, default to 0
                
                currentStation.addLink(linkFromPreviousToCurrent);
                previousStation.addLink(linkFromCurrentToPrevious);
            }

            previousStation = currentStation;
        }
    }

    return graph; // Return the constructed graph
}

function getBestJourney(graph, origin, destination, max_results){

    let possibleJourneys = [];
    let originObject = graph.stationArray.find(i => i.stationName === origin);
    let destinationObject = graph.stationArray.find(i => i.stationName === destination);
    let currentJourney = new Journey();
    let initialRouteName = null;


    currentJourney.stations.push(originObject);
    
    initialRouteName = graph.stationArray.find(i => i.stationName === origin).links[0].routeName;

    doGetBestRoutes(graph, originObject, destinationObject, currentJourney, possibleJourneys, initialRouteName);


    // After doGetBestRoutes finishes, sort the possibleJourneys
    possibleJourneys.sort((a, b) => {
        if (a.changes < b.changes) return -1;
        if (a.changes > b.changes) return 1;
        return a.distance - b.distance;
    });

    // Slice the sorted array to get the top n results based on max_results
    let topNResults = possibleJourneys.slice(0, max_results);

    displayRoutes(topNResults); // Return the top n sorted journeys
}

    



getBestJourney(network(), "Tyson", "Tadcaster", 2);

function doGetBestRoutes(graph, origin, destination, currentJourney, routesFound, routeName) {
    // Check if we've reached the destination
      
    
    if (origin.stationName === destination.stationName ) {
 
        // Mark the journey as successful and store i
        currentJourney.success = true; // Indicates if the destination was reached successfully
        routesFound.push(currentJourney); // Push a clone to preserve the state at this endpoint
	return;
    }


     for (let link of origin.links) {
    	if (!currentJourney.stations.find(station => station.name === link.station.stationName)) {
            // Create a copy for this path
            currentJourney = currentJourney.copy();

            // Add the station along with the distance to it
                currentJourney.stations.push({ name: link.station.stationName, distance: link.distance });
        	currentJourney.distance += link.distance;
                // Potentially, add a placeholder or marker for a route change text
        	let previousText = currentJourney.text;
		let previousChanges = currentJourney.changes;
        	// Check for a route change and adjust the text and changes counter
    		if (link.routeName !== routeName) {
        		currentJourney.changes++; // Add a new checkpoint with an incremented change count
        		currentJourney.text += `At ${origin.stationName}, change to ${link.routeName}. `;
    		}

        	
		doGetBestRoutes(graph, link.station, destination, currentJourney, routesFound, link.routeName);

        	//Restore the text, stations, changes and distance before a failed explore
		if (!currentJourney.success && origin.links.length > 1) {
            		currentJourney.stations.pop();
			currentJourney.changes = previousChanges;
			currentJourney.text = previousText; 
			currentJourney.distance -= link.distance;
        	}

    	}
     }

}

function displayRoutes(topNResults) {
    console.log(`Routes found: ${topNResults.length}`);
    topNResults.forEach((journey, index) => {
        console.log(`${index + 1}:`);
        console.log(`Route Summary`);
        console.log(`==============`);
        // Embark message
        console.log(`Embark at ${journey.stations[0].name} on ${journey.stations[0].routeName}`);
        // Insert journey text which includes changes
        console.log(journey.text.trim());
        // Arrive message
        console.log(`Arrive at ${journey.stations[journey.stations.length - 1].name}`);
        // Total distance
        console.log(`Total distance :${journey.distance}`);
        // Number of changes
        console.log(`Changes :${journey.changes}`);
        // Passing through
        let stationNames = journey.stations.map(station => station.name).join(', ');
        console.log(`Passing through: ${stationNames}`);
        console.log(); // For spacing between routes
    });
}

    

/**
 * Prints the railway network graph in a readable format.
 * It iterates through each station in the graph and prints its connections (links) to other stations.
 */
function printNetworkGraph(graph) {
    console.log("Railway Network Graph:");
    console.log(graph.stationArray[0]);
    for (const station of graph.stationArray) {
        console.log(`Station: ${station.stationName} (ID: ${station.stationID})`);
        console.log("Links:");
        for (const link of station.links) {
            console.log(`  - To: ${link.station.stationName} (ID: ${link.station.stationID}), Distance: ${link.distance}, Route: ${link.routeName}`);
        }
        console.log(""); // Adds an empty line for better readability
    }
}

//printNetworkGraph(network());
