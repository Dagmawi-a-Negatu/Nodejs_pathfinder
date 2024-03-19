
/**
 * Author: PUT YOUR NAME HERE.
 *
 * Describe this module here.
 **/


const railway = require('./railway.js');

// Example of testing the readData function
console.log(railway.readData('notional_ra.json')); // Should log the message from readData and return true


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
     this.linklName = station.stationName;
 }//end link
 
 //THE REST OF YOUR CODE GOES BELOW HERE

function network(fileName){
    let jsondata = railway.readData(fileName);
    let routes = jsonData.routes;
        
    let graph = {
                    stationArray : []   // graph object with stationArray property
                };
    /* initializes current station */
    let currentStation;


    /* Iterates through each route */
    for (let route of jsonData.routes) {
        let nextStation; // Store the previous station for each route
        let secondPrevious;
        /* Iterates through each stop on each route */
        for (let stop of route.stops) {
            // Check if the station is in the graph, based on stationID
            let currentStation = graph.stationArray.find(station => station.stationID === stop.stationID);

            if (!currentStation) {
                // If the station doesn't exist in the graph, create and add it
                currentStation = new Station(stop.stationID, stop.stationName);
                graph.stationArray.push(currentStation);
            }

            // Now that the current station is in the graph, you can add links
            if (nextStation) {
                let link1 = new Link(route.name, nextStation, stop.distanceToPrev);
                currentStation.addLink(link1);
            }

            nextStation = currentStation;

        }
    }

}



