
/**
 * Author: PUT YOUR NAME HERE.
 *
 * Describe this module here.
 **/


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
 
 //THE REST OF YOUR CODE GOES BELOW HERE.


