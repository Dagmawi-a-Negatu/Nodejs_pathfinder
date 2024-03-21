
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
 
 function Journey(){

    this.stations = [];      // An array of all stations on this journey
    this.distance = 0;       // The total distance of the journey in miles
    this.text = "";          // Description of the journey
    this.success = false; //Indicates if the destination was reached
    this.changes = 0; //Number of route changes
}

//--------------------Object Journey Functions----------------------


/**
 * This function creates a shallow copy of the journey object and returns
 * another instance of Journey.
 */
Journey.prototype.copy = function(){

    let newJourney = new Journey();

    newJourney.stations = this.stations.slice();
    newJourney.distance = this.distance;
    newJounrney.text = this.text;
    newJourney.success = this.success;
    newJourney.changes = this.changes;

    return copy;
}

// Generates and displays a journey report
journey.prototype.report = function() {
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
}

// Increments the distance of the journey
  incDistance(amt) {
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
                new Link(route.name, previousStation, stop.distanceToNext || 0); // if distanceToNext is undefined, default to 0
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

printNetworkGraph(network());
