/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:${1337}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const restaurants = JSON.parse(xhr.responseText);
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    console.log("Fetching by ID")
    // fetch all restaurants with proper error handling.
    DBHelper.fetchJSON(id,callback);


  }


  static fetchJSON(id,callback) {
    console.log("Fetching JSON!")
    var db;

    var openRequest = indexedDB.open("ResponsDB", 1);

    openRequest.onupgradeneeded = function (e) {
      var thisDB = e.target.result;

      if (!thisDB.objectStoreNames.contains("restaurant")) {
        thisDB.createObjectStore("restaurant");
      }
    }

    openRequest.onsuccess = function (e) {
      console.log("running onsuccess");
      db = e.target.result;

      var transaction = db.transaction(["restaurant"], "readwrite");
      var store = transaction.objectStore("restaurant");

      var request = store.get(String(id));

      request.onsuccess = function (e) {
        var rest = e.target.result;
        if (rest==undefined) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', DBHelper.DATABASE_URL + "/" + id);
          xhr.onload = function () {
            const restaurant = JSON.parse(xhr.responseText);
            if (restaurant) { // Got the restaurant
              DBHelper.storeJSON(restaurant, id);
              callback(null, restaurant);
            } else { // Restaurant does not exist in the database
              callback('Restaurant does not exist', null);
            }
          }
          xhr.send();
        }
        else{
          console.log("using IndexDB instead of sending a request!")
          callback(null, rest);
        }
      }
    }

  }


  static storeJSON(json, id) {
  var db;

  var openRequest = indexedDB.open("ResponsDB", 1);

  openRequest.onupgradeneeded = function (e) {
    var thisDB = e.target.result;

    if (!thisDB.objectStoreNames.contains("restaurant")) {
      thisDB.createObjectStore("restaurant");
    }
  }

  openRequest.onsuccess = function (e) {
    db = e.target.result;

    var transaction = db.transaction(["restaurant"], "readwrite");
    var store = transaction.objectStore("restaurant");
    store.add(json, id);
  }




}

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
  // Fetch all restaurants  with proper error handling
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Filter restaurants to have only given cuisine type
      const results = restaurants.filter(r => r.cuisine_type == cuisine);
      callback(null, results);
    }
  });
}

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
  // Fetch all restaurants
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Filter restaurants to have only given neighborhood
      const results = restaurants.filter(r => r.neighborhood == neighborhood);
      callback(null, results);
    }
  });
}

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
  // Fetch all restaurants
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      let results = restaurants
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }
      callback(null, results);
    }
  });
}

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
  // Fetch all restaurants
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Get all neighborhoods from all restaurants
      const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
      // Remove duplicates from neighborhoods
      const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
      callback(null, uniqueNeighborhoods);
    }
  });
}

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
  // Fetch all restaurants
  DBHelper.fetchRestaurants((error, restaurants) => {
    if (error) {
      callback(error, null);
    } else {
      // Get all cuisines from all restaurants
      const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
      // Remove duplicates from cuisines
      const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
      callback(null, uniqueCuisines);
    }
  });
}

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
  return (`./restaurant.html?id=${restaurant.id}`);
}

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
  return (`/img/${restaurant.photograph}.jpg`);
}

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
  // https://leafletjs.com/reference-1.3.0.html#marker  
  const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
    {
      title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
    })
  marker.addTo(newMap);
  return marker;
}
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}

