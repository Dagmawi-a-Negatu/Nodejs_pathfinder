/**
 * CS 253 Project 2 - Optimal Railway Route Finder.
 *
 * This project extends the capabilities of railway network data manipulation
 * by introducing an optimal route finder. It leverages a given JSON file
 * containing railway network details to construct a graph-like data structure.
 * Main features include finding the most efficient routes between two stations
 * considering limitations on the number of transfers, calculating the shortest 
 * path in terms of distance, and providing detailed journey descriptions 
 * including transfer stations and total distance. The project aims to build 
 * railway network analysis and planning with route finding functionalities.
 *
 * Contributions:
 * @author Andrew Scott
 * @date 2019
 * @author Dagmawi Negatu
 * @date (3/27/2024):
 * Advanced development introducing optimal route finding based on constraints
 * such as maximum transfers, integrating detailed route descriptions, and
 * improving user interaction through command-line interface.
 */



// Imports the railway module, providing access to its functionalities (functions).
const railway = require('./railway.js');


/**
 * The main entry point for the Railway Route Finder program.
 * It processes command-line arguments to determine the
 * source file for the railway network data, origin and destination stations, 
 * and the maximum number of transfers allowed.
 * It then finds the best journey(s) based on these parameters and displays
 * the journey details.
 * 
 * Usage:
 *  nodejs network.js <railtrack_file.json> <origin> <destination> <max_transfers>
 * 
 * @function main
 * - Expects 5 command-line arguments: the script name, JSON file containing
 *   railway network, origin station name, destination station name,
 *   and the maximum  number of transfers allowed.
 * - Validates the input arguments for correct length and data types.
 * - Constructs the railway network graph from the input JSON file.
 * - Searches for the optimal route(s) from the origin to 
 *   the destination withthe constraints provided.
 * - Displays the found routes and relevant journey details
 *   such as total distance and changes required.
 * 
 * @throws Will exit the process with a status code of 1 if
 * - The incorrect number of arguments are provided.
 * - The `max_transfers` argument is not a number.
 * - Either the origin or destination station is not found within this network.
 */

function main() {
    
    // Check if the correct number of arguments are passed
    if (process.argv.length !== 6) {
        console.log
        ('Usage: nodejs network.js <railtrack_file.json> <origin> <destination> <max>');
        process.exit(1);
    }

    //Short hand notation I learned for processing several command line arguments.
    const [,, filename, origin, destination, maxTransfers] = process.argv;

    // Build the railway network graph from the provided file
    let graph = network(filename);

    // Check maxTransfers is a number
    if (isNaN(maxTransfers)) {
        console.error('The max transfers argument must be a number.');
        process.exit(1);
    }

    // Find origin and destination objects in the graph	
    const originObject = 
	graph.stationArray.find(station => station.stationName === origin);
    const destinationObject = 
	graph.stationArray.find(station => station.stationName === destination);

    // Check if both origin and destination exist in the network
    if (!originObject || !destinationObject) {
        console.error('One or more station cannot be found on this network \n\nRoutes found: 0');
	process.exit(1);
    }

    // Find the best possible journey(s) given the parameters
    const possibleJourneys = getBestJourney(graph, origin, destination, maxTransfers);
    
    // Display found Journeys 
    displayRoutes(possibleJourneys);
}

/**
 * Adds a connection link to this station.
 * 
 * Appends a link object to the station's list of links, 
 * each representing a route to another station.
 * 
 * @param {Object} link The link to add,
 * containing destination and other routing details.
 */
Station.prototype.addLink = function(link){
        this.links.push(link);
}


/**
 * Holds data for a station. On a graph this will
 * represent the nodes of the graph.
 * Each station hold an array of links to
 * other stations (these represent the edges of a graph).
 * @param stationID {number} The id number of the station
 * (each station has a unique ID).
 * @param stationName {string} The name of the station.
 **/
function Station(stationID, stationName){

    this.stationName = stationName;
    this.stationID = stationID;
    this.links = [];
}//end station
 


/**
 * Forms the links between one station and the next. This object is what allows 
 * the stations to become notes on a graph. Essentially in graph theory the
 * stations are the nodes and the Link objects are the edges.
 **/

function Link(routeName, station, distance){
     this.routeName = routeName;
     this.distance = distance;
     this.station = station;
}//end link

 
/**
 * Represents a journey between two or more railway stations.
 *
 * This constructor initializes a new journey object,
 * setting up the initial structure to track the journey's stations, 
 * total distance, descriptive text, success status,
 * and the number of changes (transfers) involved.
 */
function Journey() {
    this.stations = [];// An array of all stations on this journey
    this.distance = 0;// The total distance of the journey in miles
    this.text = "";// Description of the journey
    this.success = false;// Indicates if the destination was reached
    this.changes = 0;// Number of route changes
}


/**
 * Creates and returns a shallow copy of this Journey instance.
 * 
 * This method duplicates the current journey's properties
 * (stations, distance, text, success status, and number of changes)
 * into a new Journey instance. It ensures that the list of stations
 * is a shallow copy, preserving the original journey's state.
 * 
 * Note: This is a shallow copy, so changes to non-primitive properties
 * (e.g., objects within the stations array) in the copied journey
 * will affect the original journey.
 * 
 * @returns {Journey} A new Journey instance with properties from the original.
 */
Journey.prototype.copy = function() {
    let newJourney = new Journey();// new Journey for cloning
    newJourney.stations = this.stations.slice()// Add station to cloned journey
    newJourney.distance = this.distance;// Add total distance to cloned jouney
    newJourney.text = this.text; // Add current route information to cloned journey
    newJourney.success = this.success;//Set the current status of pathfiding
    newJourney.changes = this.changes;//Copy of route changes to cloned journey
    return newJourney; // Shallow cloned Journey
}

/**
 * Increments the total distance of the journey by a specified amount.
 * 
 * This method allows incrementing the journey's distance
 * if the provided amount is a positive number.
 * It's designed to be used when a new leg is added to the journey,
 * contributing to the total distance covered.
 * 
 * @param {number} amt - The amount by which to increase the
 * journey's distance. Must be a positive number.
 */
Journey.prototype.incDistance = function(amt) {
    if (typeof amt === 'number' && amt > 0) {
        this.distance += amt;
    }
}




/**
 * Constructs a network graph from a railway data file.
 *
 * This function reads a JSON file containing railway data, 
 * constructs a network graph where each node represents a station,
 * and each edge represents a route between stations. It iterates
 * through all routes and stops within the given data, 
 * ensuring that each station is uniquely added to the graph and
 * appropriately linked to its neighboring stations based on the route
 * information provided. Links between stations take into account
 * the distance between them, allowing for the calculation of
 * journey metrics such as total distance.
 *
 * @param {string} fileName The name of the file containing the
 * railway data in JSON format.
 * @returns {Object} A graph object with a `stationArray` property, where
 * each entry represents a station and its connections within the railway network.
 */

function network(fileName){
     let jsonData = railway.readData(fileName);

    let graph = {
                    stationArray : []   // graph object with stationArray property
                };

    /* Iterates through each route */
    for (let route of jsonData.routes) {
        let previousStation; // Store the previous station for each route
        
        /* Iterates through each stop on each route */
        for (let stop of route.stops) {
            // Check if the station is in the graph, based on stationID
            let stationIndex = 
	    graph.stationArray.findIndex
		(station => station.stationID === stop.station);
            let currentStation;// The current station we are at

            if (stationIndex === -1) {
                // If the station doesn't exist in the graph, create and add it
                currentStation = new Station(stop.stationID, stop.stationName);
                graph.stationArray.push(currentStation);
            } else {
                //Reference the existing station from the graph if non existant
                currentStation = graph.stationArray[stationIndex];
            }

            // Add links between current station and the previous station
            if (previousStation) {  
		// This link represents connection from previous to current station
                let linkFromPreviousToCurrent = 
                new Link(route.name, previousStation, stop.distanceToPrev || 0);
		//This link reprsents connection from current station to previous
                let linkFromCurrentToPrevious
                = new Link(route.name, currentStation, stop.distanceToPrev || 0);
                
		//Add links to their respective stations
                currentStation.addLink(linkFromPreviousToCurrent);
                previousStation.addLink(linkFromCurrentToPrevious);
            }

            //Allows us to have in memory the previous station 
	    previousStation = currentStation;
        }
    }

    return graph;//Return the constructed graph
}


/**
 * Finds the best journey(s) between two stations within a railway graph
 * based on a specified number of results.
 *
 * This function initiates the search for the optimal journey(s) from
 * the origin to the destination station within the provided graph. 
 * It leverages the `doGetBestRoutes` function to explore all possible paths,
 * taking into accountthe limitations such as the maximum 
 * number of results to return. The possible journeys are first collected
 * and then sorted based on the number of changes required to reach
 * the destination, with a secondary sort on the total distance of the journey 
 * for journeys requiring an equal number of changes.
 * This allows for sorting of journeys
 * with fewer changes and shorter distances.
 * Finally, the function slices the sorted array of journeys to return the
 * top N results as specified by the `max_results` parameter.
 *
 * @param {Object}
 * graph The railway graph object containing an array of stations and their links.
 * @param {string} 
 * origin The name of the origin station from where the journey starts.
 * @param {string}
 * destination The name of the destination station where the journey ends.
 * @param {number} 
 * max_results The maximum number of best journey results to return.
 * @returns {Array}
 * An array of Journey objects representing the top N best journeys from the
 * origin to the destination,sorted primarily by the least number of changes
 * required and secondarily by the shortest distance.
 */

function getBestJourney(graph, origin, destination, max_results){

    let possibleJourneys = [];//Array of possible journeys
    //Origing object from consructed graph
    let originObject = graph.stationArray.find(i => i.stationName === origin);
    //Destination object from constructed graph
    let destinationObject = graph.stationArray.find(i => i.stationName === destination);
    //Journey for saving routes along all possible journeys
    let currentJourney = new Journey();
    let initialRouteName = null;

    //The intial routename for the origin station
    initialRouteName =
	  graph.stationArray.find(i => i.stationName === origin).links[0].routeName;
   
    //Recursive function where the journeys are discovered and populated
    doGetBestRoutes(graph, originObject, destinationObject, currentJourney,
	  possibleJourneys, initialRouteName);


    // After doGetBestRoutes finishes, sort the possibleJourneys
    possibleJourneys.sort((a, b) => {
        if (a.changes < b.changes) return -1;
        if (a.changes > b.changes) return 1;
        return a.distance - b.distance;
    });

    // Slice the sorted array to get the top n results based on max_results
    let topNResults = possibleJourneys.slice(0, max_results);

    //Top possible journeys in this network
    return (topNResults);
}




/**
 * Finds all possible routes from an origin to a destination station
 * within a railway network graph.This function implements a depth-first search
 * algorithm to explore all possible paths from the origin to the destination
 * station. The search avoids cycles by keeping track of visited stations 
 * in a journey object, which is updated as the search progresses.
 * When a destination is reached, the current journey object is cloned 
 * and stored in an array of successful routes. This method 
 * allows for the discovery of multiple paths and their details,
 * such as the stations visited and the total distance traveled.
 *
 * @param {Object} graph - 
 * The graph representing the railway network, where nodes are stations 
 * and edges are the links between them.
 * @param {Object} origin - The starting station node for the search.
 * @param {Object} destination - The target station node to reach.
 * @param {Object} currentJourney 
 * - An object that tracks the current path being explored, including 
 * stations visited, total distance, and other relevant journey details.
 * @param {Array} routesFound -
 * An array to store all successful journey objects that reach the destination.
 * @param {String} routeName - 
 * The name of the current route being explored. This is used to update 
 * the journey object with the correct route information.
 *
 * The function recursively explores all links from the current station (origin),
 * updating the journey object and cloning it as needed to explore different paths
 * without altering the state of other explorations. 
 * When the destination station is found, the journey is marked as successful, 
 * cloned, and added to the routesFound array.
 * The function also implements optimization checks 
 * to avoid unnecessary cloning and to handle failed explorations when a path
 * does not lead to the destination. 
 *
 */
    

function doGetBestRoutes(graph, origin, destination, currentJourney, routesFound, routeName) {
    
    // BASE CASE the current station is the destination station.
    if (origin.stationName === destination.stationName) {
        // Mark the journey as successful
	currentJourney.success = true;
	// Clone the current journey to safe guard riginal object and
	    // push it to the routes found.
        routesFound.push(currentJourney.copy());
        //Allows to report a discovered journey and mark end of this exploriation
        return;
    }

    
    // Iterate over all links (connections) from the current station to linked stations.
    for (let link of origin.links) {
	// Check station at end of current link has not been visited in this journey.
        if (!currentJourney.stations.find(station => station.name === link.station.stationName)) {
            // Clone explore this new path without altering the original journey
	    let tempJourney = currentJourney.copy();

            // Store previous journey state to revert changes if the exploration fails.
	    let journeyUpdate = {
                previousText: tempJourney.text,// Previous route description.
                previousChanges: tempJourney.changes// Preiouvs route changes
            };

            // Update the temporary journey object with information
		// from the current exploration step.
	    updateCurrentJourney(tempJourney, origin, link, routeName, journeyUpdate);

            // Recursively call the function to explore the next station in the path.
	    doGetBestRoutes(graph, link.station, destination, tempJourney, routesFound, link.routeName);

            // If the exploration from this link did not lead to a successful journey
		// and there are multiple links to explore upon each station
            // revert any changes made during the failed exploration.
	     if (!tempJourney.success && origin.links.length > 1) {
                handleFailedExploration(tempJourney, journeyUpdate);
            }
        }
    }
}


/**
 * Updates the current journey object with new station and distance information.
 * This function is called each time a new station is reached in the journey.
 * It adds the new station to the journey's path,
 * updates the total distance traveled, and handles
 * route changes if necessary.
 * 
 * @param {Object} 
 * currentJourney -
 * The journey object being updated. Contains details of the journey so far.
 * @param {Object} origin
 * - The station object from which the current leg of the journey begins.
 * @param {Object} link - 
 * The link object representing the connection from the origin to the next station.
 * @param {String} routeName - 
 * The name of the route currently being followed.
 * @param {Object} journeyUpdate - 
 * An object to store information about the journey before this update.
 */

function updateCurrentJourney(currentJourney, origin, link, routeName, journeyUpdate) {
    
    //If this is the first station in the journey,
	//add it as the starting point with a distance of 0.
    if (currentJourney.stations.length === 0) {
        currentJourney.stations.push({ name: origin.stationName, distance: 0 });
    }

    //Add the new station reached via the link, 
	//along with the distance from the previous station.
    currentJourney.stations.push({ name: link.station.stationName, distance: link.distance });
    currentJourney.distance += link.distance;

    // If this is the journey's first exploriation, 
	// append the starting route information to the journey's text description
    if (currentJourney.stations.length === 2) {
        currentJourney.text += `Embark at ${origin.stationName} on ${link.routeName}. \n`;
    }
    // If the route changes (excluding the first station and the initial route), 
	// increment the change count and update the journey's text description.
     if (link.routeName !== routeName && currentJourney.stations.length > 2) {
        currentJourney.changes++;
        currentJourney.text += `At ${origin.stationName}, change to ${link.routeName}. `;
    }
}

/**
 * Reverts the current journey object to its state before
 * the last failed exploration attempt.
 * This function is invoked when an exploration path is
 * determined to be unexplorable, leading to a dead end
 * or cycle without reaching the intended destination.
 * It rolls back the last step taken in the journey,
 * removing the last visited station and reverting
 * changes made during that exploriation step.
 * 
 * @param {Object} currentJourney -
 * The journey object being updated.
 *  Contains the current state of the journey.
 * @param {Object} journeyUpdate - 
 * An object containing the state of the journey before the last update.
 * Used to restore the journey's previous state.
 */

function handleFailedExploration(currentJourney, journeyUpdate) {
    // Remove the last station added to journey due to the failed exploration.
    let failedStation = currentJourney.stations.pop();
    // Revert route changes to its previous value before the failed exploration.
    currentJourney.changes = journeyUpdate.previousChanges;
    // Reset the journey's text to its state before the failed exploration.
    currentJourney.text = journeyUpdate.previousText;
    // Subtract the distance associated with the failed exploration step
    currentJourney.distance -= failedStation.distance;
}



/**
 * Displays a summary for each route in the provided list of top N results. 
 * Each route's summary includes the route order, a detailed journey text 
 * describing the embarkation point, any changes along the way, and the 
 * arrival station. It also lists the total distance traveled, the number 
 * of changes made, and all stations passed through during the journey.
 * 
 * @param {Array} topNResults -
 * An array containing the top N journey objects to display. 
 * Each journey object should contain the journey's text description, 
 * list of stations, total distance, and number of changes.
 */    
function displayRoutes(topNResults) {
    console.log(`Routes found: ${topNResults.length}`);
    topNResults.forEach((journey, index) => {
        console.log(`${index + 1}:`);
        console.log(`Route Summary`);
        console.log(`==============`);
        // Embark message
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


main();
