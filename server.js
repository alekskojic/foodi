// initialize Express in project
const express = require('express');
const app = express();
const request = require("request");

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/error', (req, res) => {
    res.render('pages/error');
})

app.get('/search_results/:location', (req, res) => {
  let location = req.params.location;
  const options = { method: 'GET', //options for get request to yelp search API
  url: 'https://api.yelp.com/v3/businesses/search',
  qs: 
   { term: 'food',
     location: location,
     limit: 50,
     sort_by: 'rating',
     price: '1,2' },
  headers: 
   { 'postman-token': '86930658-dc1c-db03-8681-430aa6e5b9ea',
     'cache-control': 'no-cache',
     authorization: 'Bearer 87E7mZqhILDQR5kgbfagkx-HZAEGD0Dd3xgXWhrdVB5KC977E5QjwMveI58LFIwrFJ-OJ-z6X5NPND_Ix4d7iHRP30-oEoDWtI_XpHhtcbL5IUeHddQh2SC5yHkKWHYx' } };

  request(options, function (error, response, body) { //get request to yelp API and parse JSON object into searched_results
    if (JSON.parse(body).error) {
      res.render('pages/error', {error: JSON.parse(body)});
    } else {
      let search_results = JSON.parse(body);
      let restaurants = search_results.businesses;
      let total_results = search_results.total;
      for (restaurant of restaurants) {
        let str = restaurant.name + ', ' + restaurant.location.city + ', ' + restaurant.location.zip_code;
        let directions_url = concatinateWithPlus(str);
        restaurant.directions = directions_url;
      };
      res.render('pages/search_results', {restaurants: restaurants, location: location, total_results: total_results});
    };
  });
});

app.get('/current_location/:lat&:long', (req, res) => {
  const options = { method: 'GET', //options for get request to yelp search API
  url: 'https://api.yelp.com/v3/businesses/search',
  qs: 
   { term: 'food',
     latitude: req.params.lat, // lat and long of Current Location passed in as a parameter from Geolocation on client side
     longitude: req.params.long,
     radius: 500,
     limit: 50,
     sort_by: 'rating',
     price: '1,2' },
  headers: 
   { 'postman-token': '86930658-dc1c-db03-8681-430aa6e5b9ea',
     'cache-control': 'no-cache',
     authorization: 'Bearer 87E7mZqhILDQR5kgbfagkx-HZAEGD0Dd3xgXWhrdVB5KC977E5QjwMveI58LFIwrFJ-OJ-z6X5NPND_Ix4d7iHRP30-oEoDWtI_XpHhtcbL5IUeHddQh2SC5yHkKWHYx' } };

  request(options, function (error, response, body) { //get request to yelp API and parse JSON object into searched_results
    if (JSON.parse(body).error) {
      res.render('pages/error', {error: JSON.parse(body)});
    } else {
      let search_results = JSON.parse(body);
      let restaurants = search_results.businesses;
      let total_results = search_results.total;
      for (restaurant of restaurants) {
        let str = restaurant.name + ', ' + restaurant.location.city + ', ' + restaurant.location.zip_code;
        let directions_url = concatinateWithPlus(str);
        restaurant.directions = directions_url;
      };
      res.render('pages/current_location', {restaurants: restaurants, total_results: total_results});
    };
  });
});

app.use(express.static('public'));

// start Express on port 8080
app.listen(8080, () => {
	console.log('Server Started on http://localhost:8080');
	console.log('Press CTRL + C to stop server');
});

function concatinateWithPlus(str) {
  let concatinated_string = str.split(' ').join('+');
  let directions_url = 'https://www.google.com/maps/place/' + concatinated_string + '/';
  return directions_url;
}