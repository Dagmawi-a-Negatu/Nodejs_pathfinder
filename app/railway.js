
/**
 * CS 253 Project 1 - Railway Network Data Structure Manipulation.
 *
 * This project is designed to process and manipulate data structures
 * representing railway networks. It involves receiving a JSON file containing
 * details of a Railway Network and constructing a manipulable data structure 
 * from it. The main functionalities include processing the railway 
 * network's name, manipulating route objects, adding distances to routes,
 * generating summaries of the network or individual routes, searching for
 * specific routes by name, calculating the longest route and the total number
 * of unique stations across a route, and organizing routes by name or distance
 * in acsending and descending orders.
 *
 * Contributions:
 * @author Andrew Scott: Initial creation of the project.
 * @data 2019
 * @author Michael Hudson, Dagmawi Negatu
 * @date (2/25/2023):
 * Complete development and introduction of new functionalities that 
 * includes more route manipulation and search operations.
 */





/**
 * Constructs a Railway Network Data Structure from a JSON File
 *
 * Given the file name and path of a JSON file, this function reads the file
 * and constructs an object representing the railway network. The resulting
 * data structure includes details such as the name of the railway network,
 * the routes within the network, and the stops along each route.
 *
 * @param {string} fileName - 
 * The name and path of the JSON file to be processed.
 * @returns {object} jsonData - 
 * An object representing the railway network.
 * This object includes the network's name, its routes,
 * and the stops for each route.
 */
function readData(fileName) {
    // Import the fs (File System) module to work within computer's file system.
    const fs = require('fs');

    let jsonData = null; // Variable to hold the parsed JavaScript object.

    try {
        // Attempt to read the contents of the file.
        const fileContent = fs.readFileSync(fileName, "utf-8");

        try {
            // Attempt to parse the JSON content of the file.
            jsonData = JSON.parse(fileContent);
            //Add distance property to each route
            addDistances(jsonData);
        } catch (jsonError) {
            // Log an error message if JSON parsing fails.
            console.log("Error parsing JSON from " + fileName);
	    process.exit(1);
        }
    } catch (fileError) {
        // Log an error message if reading the file fails.
        console.log("Error loading" + fileName + " from directory");
        process.exit(1);
    }

    return jsonData;
}




/**
 * Returns the Name of a Railway Network
 *
 * Returns the name of a railway network from a provided data structure. 
 * If the data structure is not properly initialized (i.e., it is null),
 * the function will return null,
 * demonstrartign that the operation cannot be performed.
 *
 * @param {object} dataStrucure - 
 * The data structure containing details of the railway network.
 * @returns {string|null}
 * The name of the railway network if available, or null if the 
 * data structure is uninitialized.
 */
function getNetworkName(dataStructure) {
    // Check for uninitialized or null data structure
    if (dataStructure === null) {
        // Data structure not initialized, return null
        return null;
    }

    // Data structure is initialized, return the railway network name
    return dataStructure.networkName;
}




/**
 * Returns the names of routes from the railway network data structure.
 * @param {Object} data - 
 * The railway network data structure.
 * @returns {string[]|null}
 * An array of strings containing the names of the routes, 
 * or null if input is invalid.
 */
function getRouteNames(dataStructure){

    // First, check if the input data is null or undefined.
    if(!dataStructure){
        return null;
    }

    // Call the getRoutes function to access the array of route objects
    let routes = getRoutes(dataStructure);

    let routeNames = [];    // The names of each route

    /* Iterates through each route */
    for(let i = 0; i < routes.length; i++){

        /* Adds the name of each route */
        routeNames.push(routes[i].name);
    }
    // After all route names have been accessed, return the array of names.
    return routeNames;
}




/**
 * Access All Routes from a Railway Network Data Structure
 *
 * This functio returns an array of route objects from a provided
 * railway network data structure. If the input data structure is not properly
 * initialized (i.e., it is null), the function returns an empty array,
 * indicating that there are no routes to return.
 *
 * @param {object} dataStructure - The data structure containing the railway
 * network information. Expected to have a 'routes' property that is an array
 * of route objects.
 * @returns {Array.<Object>} An array of route objects from the railway network.
 * If the input data structure is null, returns an empty array.
 */
function getRoutes(dataStructure) {
    // Check for uninitialized or null data structure
    if (dataStructure === null) {
        // Data structure not initialized; return an empty array
        return [];
    }

    // Return the routes from the data structure
    return dataStructure.routes;
}




/**
 * Formats and returns a string listing each route name on a new line,
 * separated by commas, from the given railway network data structure.
 * @param {Object} data - The railway network data structure.
 * @returns {string|null} A formatted string containing the names of the routes,
 * or null if input is invalid.
 */
function routeNamesToString(dataStructure) {
  // Checks if the input data is null
  if (!dataStructure) {
    return null;
  }

  // Access route names using the getRouteNames function.
  const routes = getRouteNames(dataStructure);

  //Joins array of route names into a single string, with name separated by ",\n".
  const result = routes.join(",\n");

  return result;
}




/**
 * Finds and returns the route object matching the specified name within
 * the railway network data structure.
 * @param {Object} data -
 * The railway network data structure.
 * @param {String} routeName - 
 * The name of the route to search for.
 * @returns {Object|null}
 * The corresponding route object with its properties, 
 * or null if not found or data is invalid.
 */
function getRoute(data, routeName) {
  // Checks if the input data is null or undefined.
  if (!data) {
    return null;
  }

  // Retrieves the routes from the railway network data.
  const routes = getRoutes(data);

  // Find the first route that matches the routeName.
  let foundRoute = null;
   /* Iterates through the routes */
    for(let item of routes){

        /* If the current route is the same as the given route */
        if(item.name === routeName){

            /* The route is added to be returned */
            foundRoute = item;
        }
    }

  // Returns the found route, or null if no match is found 
  return foundRoute;
}



/**
 * Constructs a descriptive string for a route, including its name, color,
 * each stop with distance from the start, and the total route distance.
 * @param {Object} route - The route object.
 * @returns {string|null}
 * A formatted string describing the route, or null if the route is invalid.
 */
function routeToString(route) {
  // Validate the route object
  if (!route) {
    return null;
  }

  // Initialize the result string with the route name and color
  let result = `ROUTE: ${route.name} (${route.color})\nSTATIONS:\n`;

  // Initialize total distance
  let distance = 0;

  // Iterate through each stop using a standard for loop
  for (let i = 0; i < route.stops.length; i++) {
    let stop = route.stops[i];
    distance += stop.distanceToPrev; // Accumulate distance
    result += `${stop.stop} ${stop.stationName} ${distance} miles\n`;
  }

  // Append the total distance to the result string
  result += `Total Route Distance: ${distance} miles`;

  return result;
}



/**
 * Calculates the total distance of a route in miles,
 * from the first stop to the last.
 * @param {Object} route - The route object.
 * @return {number}
 * The total distance of the route in miles, or 0 if the route is invalid.
 */
function routeDistance(route) {
  // Validate the route object
  if (!route || !route.stops) {
    return 0;
  }

  let totalDistance = 0; // Initialize total distance

  // Iterate through each stop using a for of loop
  for (const stop of route.stops) {
    totalDistance += stop.distanceToNext; // Add distance to total
  }

  return totalDistance;
}



/**
 * Generates a summary of all routes within the given railway network data.
 * For each route, it lists the route name followed by the names of the
 * first and last stops. If a route has no stops, "N/A" is used to indicate the 
 * absence of stop information.
 * @param {Object} data - The railway network data structure 
 * containing routes and their stops.
 * @returns {string|null} A string containing the summary of all routes or
 * null if the input data is invalid.
 */

function routeSummary(data) {

  // Validate the input data
  if (!data) {
    return null;
  }

  let result = "Routes Summary\n==============\n"; // Header for the summary
  let routes = getRoutes(data); // Extract routes from the data

  // Iterate through each route to append its summary to the result string
  for (let route of routes) {
    // Safely access the first and last stop names
    let firstStopName = "N/A";
    let lastStopName = "N/A";
    if (route.stops.length > 0) {
      firstStopName = route.stops[0].stationName; // Name of the first stop
      lastStopName = route.stops[route.stops.length - 1].stationName; // Name of the last stop
    }

    // Add the name, first stop, last stop, and distance for each route
    result += `${route.name.padEnd(25, " ")}- ${firstStopName.padEnd(15, " ")} ` +
    `to ${lastStopName.padEnd(15, " ")} -  ${routeDistance(route)} miles\n`;

  }

  return result;
}



/**
 * Sorts the routes by name within the railway network data structure.
 *
 * This function organizes the routes by their names in either ascending or descending
 * order based on the provided boolean flag. It validates if the input data structure
 * is initialized. If not, it returns null to indicate failure. Otherwise, it sorts
 * the routes according to the specified order.
 *
 * @param {Object} data - The railway network data structure containing routes.
 * @param {boolean} asc -
 *  Determines the sort order: true for ascending, false for descending.
 * @returns {Array.<Object>|null}
 * The sorted array of route objects, or null if the input data is invalid.
 */
function sortRoutesByName(data, asc) {
    if (data === null) {
        console.log("Data structure is not initialized.");
        return null;
    }

    let routes = data.routes; // Assuming getRoutes(data) returns data.routes

    // Sorting logic with a more standard approach
    routes.sort((a, b) => {
        //uppercase for case-insensitive comparison
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();

        // Determine sort order using an if-else structure
        if (asc) {
            // Ascending order
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        } else {
            // Descending order
            if (nameB < nameA) return -1;
            if (nameB > nameA) return 1;
            return 0;
        }
    });

    return routes; // return the sorted routes for chaining or further use
}




/**
 * Sorts the routes in the railway network data structure by their length.
 * The sorting can be performed in either ascending or descending order based
 * on the asc parameter. This function modifies the original data structure
 * to have the sorted order of routes. It is designed to first validate the
 * input data structure before attempting the sort operation.
 *
 * @param {Object} data -
 * The railway network data structure containing an array of routes.
 * @param {boolean} asc - 
 * Determines the order of sorting: true for ascending, false for descending.
 * @returns {void} -
 * The data structure is modified in place; nothing is returned.
 */
function sortRoutesByLength(data, asc){

    /* Cannot initalize data structure */
    if(data === null)  return null;
    let routes = getRoutes(data);   // The routes in the railway network
    /* Sorts the routes */
    routes.sort((a, b) => {
        /* Sorts the routes in ascending order */
        if(asc){
            /* Compares the distances */
            if(a.distance < b.distance){
                return -1;
            }
            if(b.distance > a.distance){
                return 1;
            }
            return 0;
         } else {
            /* Sorts the routes in descending order */
             if(b.distance < a.distance){
                 return -1;
             }
             if(a.distance > b.distance){
                 return 1;
                 }
             return 0;
         }
    }
    );
}




/**
 * Adds each route in the railway network data structure by adding a
 * distance property that represents the calculated distance of the route.
 *
 * This function iterates over each route in the provided data structure, calculates
 * the distance for each route using a the routeDistance function, and
 * assigns this calculated value as a new property of the route. It checks the
 * data structure is valid before proceeding to prevent errors.
 *
 * @param {Object} data - The railway network data structure containing an array of routes.
 * @returns {void} - Changes the input data structure in place without returning a value.
 */
function addDistances(data) {
    // The data structure is initialized and valid
    if (!data) {
        console.error("Invalid data structure provided to addDistances.");
        return;
    }

    // Iterate over each route using a standard for loop
    for (let i = 0; i < data.routes.length; i++) {
        // Calculate the distance for the current route
        const distance = routeDistance(data.routes[i]);

        // Assign the calculated distance to the route
        data.routes[i].distance = distance;
    }
}




/**
 * Returns the route object with the longest distance in miles from start to
 * end when given the railway network data structure.
 * @param {Object} data - The railway network data structure.
 * @returns {Array.<Object>} longestRoute - The longest route in the railway
 * network.
 */
function findLongestRoute(data){

    /* Cannot initalize data structure */
    if(data === null){
        return null;
    }

    let longestRoute = [];      // The longest route to be returned

    let routes = getRoutes(data);   // The routes in the railway network

    /* Iterates through the routes to find the longest route */
    for(let i = 0; i < routes.length; i++){

        /* If the current routes distance is greater than the last */
        if((routes[i]).distance > longestRoute){

            /* Sets the current route as the longest route */
            longestRoute = (routes[i]);
        }
    }
    return longestRoute;
}




/**
 * Calculates the total number of unique stations across all routes in the railway network.
 * This function avoids counting any station more than once, ensuring an accurate total count.
 * The railway network data structure must be properly initialized and passed as an argument.
 *
 * @param {Object} data - 
 * The railway network data structure containing routes and their respective stops.
 * @returns {number} -
 * The total number of unique stations across all routes.
 */
function totalStations(data) {
    // Validate the input data structure.
    if (data === null) {
        console.error("Invalid data structure provided to totalStations.");
        return 0;
    }

    // Initialize a Set to store unique station names.
    let uniqueStations = new Set();

    // Access the routes from the data structure for clarity.
    let routes = data.routes;

    // Iterate through each route in the railway network.
    for (let i = 0; i < routes.length; i++) {
        // Iterate through each stop in the current route.
        let stops = routes[i].stops;
        for (let j = 0; j < stops.length; j++) {
            // Add the station name to the Set of unique stations.
            uniqueStations.add(stops[j].stationName);
        }
    }

    // The total count of unique stations by accessing the size of the Set.
    return uniqueStations.size;
}



// Extra Credit:  3 Bonus Marks
/**
 * This function is designed to identify and return details about a specific
 * route within a railway network, given the starting and ending stops. It will
 * retrive the information such as the route's name, the starting and
 * ending stops' names, the total number of stops in between these two points
 * (including the destination stop), and the overall distance in miles.
 * @param {Object} data - Represents the data structure of the railway network.
 * @param {String} from - The name of the initial stop.
 * @param {String} to - The name of the final stop.
 * @returns {String} result - A string detailing the route's name, names of the
 * initial and final stops, the count of stops from start to finish, and the
 * total distance in miles.
 */

function findRoute(data, from, to) {
    if (data === null) { //Validate if the route can be initialized.
        return "Data is null.";
    }
    //We have not found the rout in this railway network system yet	
    let result = "Route not found in this railway network System from passed two stops.";
    for (let i = 0; i < data.routes.length; i++) {
        let route = data.routes[i];// From data, access each route.
        let fromIndex = -1;// Default that the index of the starting stop not found.
        let toIndex = -1;//Defualt that index of the desintation stop not found.

        for (let j = 0; j < route.stops.length; j++) {//Go through each stop in each route within railway.
            if (route.stops[j].stationName === from) {//Checks if the starting stop has been found.
                fromIndex = j;// Index of starting stop.
            }
            if (route.stops[j].stationName === to) {//Checks if the destination stop has been found.
                toIndex = j;// Index of desitnation stop
            }
        }

        if (fromIndex !== -1 && toIndex !== -1) {//Checks if we have found our starting and destination stops.
            let distance = calculateDistance(route.stops, fromIndex, toIndex);//Helper function calcuating distance between stops.
            let stopsCount = Math.abs(toIndex - fromIndex);//How many stops been start and destinations stops.
           result = `Found: ${route.name}: ${from} to ${to}, \
           ${stopsCount} stops and ${distance} miles.`;

        }//Assigns the journey between the starting and destination stops.
    }

    return (result);
}


/**
 * Calculates the total distance between two stops in a railway stops array. It sums up
 * the distances between sequential stops from the start index to the end index.
 * 
 * @param {Array} stops - Array of stop objects with distanceToNext property.
 * @param {Number} fromIndex - Index of the starting stop in the array.
 * @param {Number} toIndex - Index of the ending stop in the array.
 * @returns {Number} Total distance between the starting and ending stops.
 */

function calculateDistance(stops, fromIndex, toIndex) {
    
    let distance = 0;//Holds the distance between the starting and ending stops
    let startIndex = Math.min(fromIndex, toIndex);//Validates Starting index
    let endIndex = Math.max(fromIndex, toIndex);//Validates Ending index

    for (let i = startIndex; i < endIndex; i++) {
        distance += stops[i].distanceToNext; 
	//Adds the distance between the two stops
    }

    //Returns the complete distance between the passed indexes	
    return distance;
}



/**
 * Conduct a range of tests on the functions developed
 *@param fileName {String} The name and path of the JSON file to load.
 *@param lineName {String} The name of line to looke for in test 5.
 **/
function main (fileName, lineName){

    //Load the railway data structure from rom file.
    let data = readData(fileName);

    //Test route name
   console.log("===TEST=1=NETWORK=NAME==="); 
   console.log( getNetworkName(data) );

   //Test getting routes
   console.log("\nTEST=2=GETTING=ROUTES=ARRAY");
   console.log("There are " + getRoutes(data).length + "routes on this network");
   console.log("The typeof the routes is " + typeof getRoutes(data));
   
   //Test getting route names
   console.log("\n===TEST=3=ROUTE=NAMES===");
   console.log(getRouteNames(data));

   //Test getting route names formated as a String
   console.log("\n===TEST=4=ROUTE=NAMES=TOSTRING===");
    console.log(routeNamesToString(data));

    //Test getting data for one route
    console.log("\n===TEST=5=GET=ROUTE===")
    let route =getRoute(data, lineName);
    if(route != null)
         console.log( "Found: " + route.name);
    else
          console.log("Route not found");

    //Test route toString
    console.log("\n===TEST=6=ROUTE=TO=STRING===");
    console.log(routeToString(route));

    //Test route distance calculation
    console.log("\n===TEST=7=ROUTE=DISTANCE===");
    var dist = routeDistance(route);
    console.log("Distance of Line as calculated: " + dist);   

    //Test the routeSummay function
    console.log("\n===TEST=8=ROUTE=SUMMARY===");
    console.log(routeSummary(data));

    //Test sorting routes by name in ascending order
    console.log("\n===TEST=9=SORT=ROUTE=BY=NAME===");
    sortRoutesByName(data, true);
    console.log(routeSummary(data));

    //Test sorting routes by name in descending order
    console.log("\n===TEST=10=SORT=ROUTE=BY=NAME=(DESC)===");
    sortRoutesByName(data);
    console.log(routeSummary(data));

    //Test sorting in assending order
    console.log("\n===TEST=11=SORT=ROUTE=BY=LENGTH=(ASC)===");
    sortRoutesByLength(data, true);
    console.log(routeSummary(data));
    
    //Test sorting in descending order
    console.log("\n===TEST=12=SORT=ROUTE=BY=LENGTH=(DESC)===");
    sortRoutesByLength(data, false);
    console.log(routeSummary(data));
    
    //Test finding the longest route
    console.log("\n===TEST=13=FIND=LONGEST=ROUTE===");
    route = findLongestRoute(data);
    console.log("Longest route is: "  +routeToString(route) + "\n");

    //Test routeDistance
    console.log("\n===TEST=14=Total_Stations===");
    let n = totalStations(data);
    console.log("There are " + n + " stations in this network.");

    //TEst finding route from to.
    console.log("\n====(OPTIONAL) TEST=BONUS1=FIND=FROM=TO===");
    let str = findRoute(data, "Cardiff","Reading");
    console.log(">>END>>"+ str);

}//end main


//Call the main function
if (require.main === module){

	// Check if the correct number of arguments is provided (including the node command and script name)
	if (process.argv.length !== 4) {
   		console.error('Usage: node <script.js> <file.json> <"Route/Line name">');
    		process.exit(1);
	}
	
	//main("railtrack_uk.json","West Coast Main Line");
	main(process.argv[2],process.argv[3]);//uncomment to use command line arguments.
	
}
   

    
