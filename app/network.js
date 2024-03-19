
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
