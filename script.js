function modeChange(){
   var element=document.body;
   element.dataset.bsTheme= element.dataset.bsTheme=="light"? "dark":"light";
}


// ------------------
const apiKey = "28db3eb606154f67aec162526231909";

const locationName = $("#locationName");
const imgWeather = $("#imgWeather");
const txtWeather = $("#txtWeather");
const temp = $("#temp");
const humidity = $("#humidity");
const tempFeel = $("#tempFeel");
const wind = $("#wind");
const pressure = $("#pressure");
const uv = $("#uv");
const visibility = $("#visibility");
const cityInput = document.querySelector("#inpSearch");
const selectDate = document.querySelector("#selectDate");
const btnHistoryId = $("#btnHistoryId");


////////////////////////////////////////////////////
const map = L.map('map');
map.setView([0, 0], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
L.marker([0, 0]).addTo(map);


/////////////////////////////////////////////////////////


if (navigator.geolocation) {
   // Get the current position
   navigator.geolocation.getCurrentPosition(function (position) {
      // Retrieve latitude and longitude
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      // Display the current location
      console.log("Latitude: " + latitude + ", Longitude: " + longitude);

      $.ajax({
         method: "GET",
         url: `http://api.weatherapi.com/v1/current.json?Key=28db3eb606154f67aec162526231909&q=${latitude},${longitude}`,
         success: (resp) => {
            console.log(resp);
            locationName.text(resp.location.name);
            imgWeather[0].src = resp.current.condition.icon;
            txtWeather.text(resp.current.condition.text);
            temp.text(resp.current.temp_c+ " °C");
            humidity.text(resp.current.humidity + "%");
            tempFeel.text(resp.current.feelslike_c+ " °C");
            wind.text(resp.current.wind_kph+ " Km/h");
            pressure.text(resp.current.pressure_mb+" hPa");
            uv.text(resp.current.uv + "%");
            visibility.text(resp.current.vis_km +" Km");

         }
      });


      //Display Forcast data
      $.ajax({
         method: "GET",
         url: `http://api.weatherapi.com/v1/forecast.json?key=28db3eb606154f67aec162526231909&q=${latitude},${longitude}&days=4`,
         success: (data) => {
            for (let index = 1; index < data.forecast.forecastday.length; index++) {
               $(`#forecastDay${index}`).html(data.forecast.forecastday[index].date);
               $(`#imgForcastD${index}`).attr("src", data.forecast.forecastday[index].day.condition.icon);
               $(`#tempForecastD${index}`).html(data.forecast.forecastday[index].day.avgtemp_c + "°C");
               $(`#conditionForecastD${index}`).html(data.forecast.forecastday[index].day.condition.text);
               $(`#maxTempForecastD${index}`).html(data.forecast.forecastday[index].day.maxtemp_c + "°C");
               $(`#minTempForecastD${index}`).html(data.forecast.forecastday[index].day.mintemp_c + "°C");
               $(`#humForecastD${index}`).html(data.forecast.forecastday[index].day.avghumidity + "%");
               $(`#rainForecstD${index}`).html(data.forecast.forecastday[index].day.daily_chance_of_rain + "%");
               $(`#snowForecastD${index}`).html(data.forecast.forecastday[index].day.daily_chance_of_snow + "%");
            }
         }
      });
      map.setView([latitude, longitude], 13);
      L.marker([latitude, longitude]).addTo(map);

      //Display Today's Weather

      $.ajax({
         method: "GET",
         url: `http://api.weatherapi.com/v1/forecast.json?key=28db3eb606154f67aec162526231909&q=${latitude},${longitude}&days=0`,
         success: (data) => {
            for (let i = 6; i < 23; i++) {
               if (i % 3 == 0) {
                  $(`#imgHour${i}`).attr("src", data.forecast.forecastday[0].day.condition.icon);
                  $(`#tempHour${i}`).html(data.forecast.forecastday[0].hour[i].temp_c + "°C");
                  $(`#windHour${i}`).html(data.forecast.forecastday[0].hour[i].wind_kph + "Km/h")
                  $(`#humHour${i}`).html(data.forecast.forecastday[0].hour[i].humidity + "%");
               }

            }
         }
      });


      btnHistoryId.on("click", () => {
         const inputDate = $("#selectDate").val(); // Get the date input value from an input field
         if (inputDate && cityInput.value.trim()) {
            const cityName = cityInput.value.trim();
            getHistoryData(cityName, inputDate);

         } else if (inputDate){
            //getHistoricalDataForCurrentLocation(inputDate);
            if (navigator.geolocation) {
               navigator.geolocation.getCurrentPosition(function (position) {
                  // Retrieve latitude and longitude
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;

                  // Make an AJAX request to fetch the city name based on coordinates
                  $.ajax({
                     method: "GET",
                     url: `http://api.weatherapi.com/v1/history.json?Key=28db3eb606154f67aec162526231909&q=${latitude},${longitude}&dt=${inputDate}`,
                     success: (data) => {
                        //const city = resp.location.name;
                        $(`#historyDate`).html(data.forecast.forecastday[0].date);
                        $(`#historyImg`).attr("src", data.forecast.forecastday[0].day.condition.icon);
                        $(`#historyTemp`).html(data.forecast.forecastday[0].day.avgtemp_c + "°C");
                        $(`#historyCondition`).html(data.forecast.forecastday[0].day.condition.text);
                        $(`#historyMaxTemp`).html("Max temp "+data.forecast.forecastday[0].day.maxtemp_c + "°C");
                        $(`#historyMinTemp`).html("Min temp "+data.forecast.forecastday[0].day.mintemp_c + "°C");
                        $(`#historyHumidity`).html("Humidity "+data.forecast.forecastday[0].day.avghumidity + "%");

                     },
                  });
               });
            } else {
               console.error("Geolocation is not supported by this browser.");
            }
         } else {
            alert("Please enter a date to retrieve historical weather data.");
         }
      });




   }, function (error) {
      // Handle errors (e.g. user denied location access)
      console.error("Error getting current location: " + error.message);
   });
} else {
   console.error("Geolocation is not supported by this browser.");
}



async function fetchText(lat, long) {
   const alt = lat;
   const ln = long;
   console.log("Show", alt, ln);

   const search = await fetch(searchUrl + alt.toString() + "," + ln.toString());
   const cityData = await search.json();

   city = cityData[0].name;

   console.log(city);
}



btnSearch.addEventListener('click', e => {
   e.preventDefault();

   currentWeather();
   forecastWeather();
   currentDayWeather();
   cityInput.value = "";

});

async function currentWeather() {
   const cityName = cityInput.value.trim();
   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/current.json?Key=${apiKey}&q=${cityName}`,
      success: (resp) => {
         console.log(resp);
         locationName.text(resp.location.name);
         imgWeather[0].src = resp.current.condition.icon;
         txtWeather.text(resp.current.condition.text);
         temp.text(resp.current.temp_c+ " °C");
         humidity.text(resp.current.humidity+ " %");
         tempFeel.text(resp.current.feelslike_c+ " °C");
         wind.text(resp.current.wind_kph+ " Km/h");
         pressure.text(resp.current.pressure_mb+ " hPa");
         uv.text(resp.current.uv+ " %");
         visibility.text(resp.current.vis_km+ " km");
         const lt = resp.location.lat;
         const lng = resp.location.lon;
         map.setView([lt, lng], 13);
         L.marker([lt, lng]).addTo(map);

      }
   });

}

async function forecastWeather() {
   const cityName = cityInput.value.trim();

   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=4`,
      success: (data) => {
         for (let index = 1; index < data.forecast.forecastday.length; index++) {
            $(`#forecastDay${index}`).html(data.forecast.forecastday[index].date);
            $(`#imgForcastD${index}`).attr("src", data.forecast.forecastday[index].day.condition.icon);
            $(`#tempForecastD${index}`).html(data.forecast.forecastday[index].day.avgtemp_c + "°C");
            $(`#conditionForecastD${index}`).html(data.forecast.forecastday[index].day.condition.text);
            $(`#maxTempForecastD${index}`).html(data.forecast.forecastday[index].day.maxtemp_c + "°C");
            $(`#minTempForecastD${index}`).html(data.forecast.forecastday[index].day.mintemp_c + "°C");
            $(`#humForecastD${index}`).html(data.forecast.forecastday[index].day.avghumidity + "%");
            $(`#rainForecstD${index}`).html(data.forecast.forecastday[index].day.daily_chance_of_rain + "%");
            $(`#snowForecastD${index}`).html(data.forecast.forecastday[index].day.daily_chance_of_snow + "%");
         }
      }
   });
}

async function currentDayWeather() {
   const cityName = cityInput.value.trim();

   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=0`,
      success: (data) => {
         for (let i = 6; i < 23; i++) {
            if (i % 3 == 0) {
               $(`#imgHour${i}`).attr("src", data.forecast.forecastday[0].day.condition.icon);
               $(`#tempHour${i}`).html(data.forecast.forecastday[0].hour[i].temp_c + "°C");
               $(`#windHour${i}`).html(data.forecast.forecastday[0].hour[i].wind_kph + "Km/h")
               $(`#humHour${i}`).html(data.forecast.forecastday[0].hour[i].humidity + "%");
            }

         }
      }
   });
}



async function getHistoryData(cityName, inputDate) {

   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${cityName}&dt=${inputDate}`,
      success: (data) => {
         $(`#historyDate`).html(data.forecast.forecastday[0].date);
         $(`#historyImg`).attr("src", data.forecast.forecastday[0].day.condition.icon);
         $(`#historyTemp`).html(data.forecast.forecastday[0].day.avgtemp_c + "°C");
         $(`#historyCondition`).html(data.forecast.forecastday[0].day.condition.text);
         $(`#historyMaxTemp`).html(data.forecast.forecastday[0].day.maxtemp_c + "°C");
         $(`#historyMinTemp`).html(data.forecast.forecastday[0].day.mintemp_c + "°C");
         $(`#historyHumidity`).html(data.forecast.forecastday[0].day.avghumidity + "%");

      }
   });
}


