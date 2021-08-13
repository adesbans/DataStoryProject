/*
 * Basic example of accessing JSON data via an API.
 * 
 * Uses current fetch call with built-in promise.
 *
 * @author Alex Desbans
 */

 // location of the factbook data
const FACTBOOK_URL = 'https://compsci290_2021spring.dukecs.io/resources/data/countries/';

//this will hold all of the circles I display on the map
let circles = [];

//initialize the map
let map = L.map('map').setView([0,0], 2);

L.tileLayer('images/tiles/{z}/{x}/{y}.png', { //the tiles folder holds the images that build the map, these are from Leaflet
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //tileSize: 512,
    minZoom: 2,
    maxZoom: 2
}).addTo(map);


//this function will compare a country's real growth rate to its unemployment rate
async function compareToGrowthRate () {
    //first clear out any previous circles on the map
    clearMap();
    //fetch data from factbook
    let response = await fetch(`${FACTBOOK_URL}/factbook.json`);
    let jsonData = await response.json();
    //iterate through each country to get necessary data
    Object.entries(jsonData.countries).forEach(c => {
        console.log(jsonData.countries[c[0]].data.economy);
        //skip over world data
        if(c[0] == 'world') {
            return;
        }
        //these if statements ensure that the data I need exists in the country I'm on
        if (jsonData.countries[c[0]].data.economy.unemployment_rate == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.economy.gdp.real_growth_rate == undefined){
            return;
        }
        if (jsonData.countries[c[0]].data.economy.gdp.real_growth_rate.annual_values == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.economy.unemployment_rate.annual_values == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.geography.geographic_coordinates == undefined) {
            return;
        }
        //calculate ratio of real growth rate to unemployment rate ratio
        let num = (jsonData.countries[c[0]].data.economy.gdp.real_growth_rate.annual_values[0].value)/(jsonData.countries[c[0]].data.economy.unemployment_rate.annual_values[0].value);
        //intialize latitude and logitude
        let lat = 'fail';
        let lon = 'fail';
        //these if statements ensure that the latitude/longitude are in the right hemispheres
        if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere !== 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere !== 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 *jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        //these if statements create a circle based on the calculated ratio
        if (num > 1.5) {
            console.log("good");
            let circle = L.circle([lat, lon], {
                radius: 500000,
                color: 'green',
                fillColor: '#0f0',
                fillOpacity: 0.5
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of real growth rate to unemployment rate is ' + num + '.');
            circle.addTo(map);  
            //adds new circle to array of circles
            circles.push(circle);
        }

        else if (num > 0) {
            console.log("medium");
            let circle = L.circle([lat, lon], {
                radius: 250000,
                color: 'yellow',
                fillColor: '#ff0',
                fillOpacity: 0.5,
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of real growth rate to unemployment rate is ' + num + '.');
            circle.addTo(map); 
            
            circles.push(circle);
        }

        else {
            console.log("bad");
            let circle = L.circle([lat, lon], {
                radius: 125000,
                color: 'red',
                fillColor: '#f00',
                fillOpacity: 0.5,
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of real growth rate to unemployment rate is ' + num + '.');
            circle.addTo(map);  

            circles.push(circle);

        }
    });
}

//this function will compare a country's population growth rate to its unemployment rate
async function compareToPopulationGrowthRate () {
    //first clear out any previous circles on the map
    clearMap();
    //fetch data from factbook
    let response = await fetch(`${FACTBOOK_URL}/factbook.json`);
    let jsonData = await response.json();
    //iterate through each country to get necessary data
    Object.entries(jsonData.countries).forEach(c => {
        //skip over world data
        if(c[0] == 'world') {
            return;
        }
        //these if statements ensure that the data I need exists in the country I'm on
        if (jsonData.countries[c[0]].data.economy.unemployment_rate == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.people.population_growth_rate == undefined){
            return;
        }
        if (jsonData.countries[c[0]].data.economy.unemployment_rate.annual_values == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.geography.geographic_coordinates == undefined) {
            return;
        }
        //calculate ratio of population growth rate to unemployment rate ratio
        let num = (jsonData.countries[c[0]].data.people.population_growth_rate.growth_rate)/(jsonData.countries[c[0]].data.economy.unemployment_rate.annual_values[0].value);
        //intialize latitude and logitude
        let lat = 'fail';
        let lon = 'fail';
        //these if statements ensure that the latitude/longitude are in the right hemispheres
        if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere !== 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere !== 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 *jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }

        //these if statements create a circle based on the calculated ratio
        if (num > 0.3) {
            console.log("good");
            let circle = L.circle([lat, lon], {
                radius: 500000,
                color: 'green',
                fillColor: '#0f0',
                fillOpacity: 0.5
            })
            circle.addTo(map);  
            circle.bindPopup('In ' + c[0] + ', the ratio of population growth rate to unemployment rate is ' + num + '.');
            //adds new circle to array of circles
            circles.push(circle);
        }

        else if (num > 0) {
            console.log("medium");
            let circle = L.circle([lat, lon], {
                radius: 250000,
                color: 'yellow',
                fillColor: '#ff0',
                fillOpacity: 0.5,
            })
            circle.addTo(map);  
            circle.bindPopup('In ' + c[0] + ', the ratio of population growth rate to unemployment rate is ' + num + '.');
            circles.push(circle);
        }

        else {
            console.log("bad");
            let circle = L.circle([lat, lon], {
                radius: 125000,
                color: 'red',
                fillColor: '#f00',
                fillOpacity: 0.5,
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of population growth rate to unemployment rate is ' + num + '.');
            circle.addTo(map);  

            circles.push(circle);
        }
    });
}
//this function will compare a country's literacy rate to its unemployment rate
async function compareToLiteracyRate () {
    //first clear out any previous circles on the map
    clearMap();
    //fetch data from factbook
    let response = await fetch(`${FACTBOOK_URL}/factbook.json`);
    let jsonData = await response.json();
    //iterate through each country to get necessary data
    Object.entries(jsonData.countries).forEach(c => {
        //skip over world data
        if(c[0] == 'world') {
            return;
        }
        //these if statements ensure that the data I need exists in the country I'm on
        if (jsonData.countries[c[0]].data.economy.unemployment_rate == undefined) {
            return;
        }
        if (jsonData.countries[c[0]].data.people.literacy == undefined){
            return;
        }
        //calculate ratio of literacy rate to unemployment rate ratio
        let num = (jsonData.countries[c[0]].data.people.literacy.total_population.value)/(jsonData.countries[c[0]].data.economy.gdp.real_growth_rate.annual_values[0].value);
        //intialize latitude and logitude
        let lat = 'fail';
        let lon = 'fail';
        //these if statements ensure that the latitude/longitude are in the right hemispheres
        if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere === 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere !== 'E') {
            lat = jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else if (jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.hemisphere !== 'N' && jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.hemisphere === 'E') {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        else {
            lat = -1 * jsonData.countries[c[0]].data.geography.geographic_coordinates.latitude.degrees;
            lon = -1 *jsonData.countries[c[0]].data.geography.geographic_coordinates.longitude.degrees;
        }
        //these if statements create a circle based on the calculated ratio
        if (num > 50) {
            let circle = L.circle([lat, lon], {
                radius: 500000,
                color: 'green',
                fillColor: '#0f0',
                fillOpacity: 0.5
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of literacy rate to unemployment rate is ' + num + '.');
            circle.addTo(map); 
            //adds new circle to array of circles
            circles.push(circle); 
        }

        else if (num > 15) {
            let circle = L.circle([lat, lon], {
                radius: 250000,
                color: 'yellow',
                fillColor: '#ff0',
                fillOpacity: 0.5,
            })
            circle.bindPopup('In ' + c[0] + ', the ratio of literacy rate to unemployment rate is ' + num + '.');
            circle.addTo(map);  
            circles.push(circle);
        }

        else {
            let circle = L.circle([lat, lon], {
                radius: 125000,
                color: 'red',
                fillColor: '#f00',
                fillOpacity: 0.5,
            })  
            circle.bindPopup('In ' + c[0] + ', the ratio of literacy rate to unemployment rate is ' + num + '.');
            circle.addTo(map);
            circles.push(circle);
        }
        
    });
}

async function clearMap () {
    //go throufh circles array and remove all circles
    circles.forEach(x => x.remove());
    //initialize the array to be empty again
	circles = [];
}


