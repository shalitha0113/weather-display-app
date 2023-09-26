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
const cityInput = document.querySelector("#sec-input");


////////////////////////////////////////////////////
const map = L.map('map');
    map.setView([0, 0],13);

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
         url: `http://api.weatherapi.com/v1/current.json?Key=${apiKey}&q=${latitude},${longitude}`,
         success: (resp) => {
            console.log(resp);
            locationName.text(resp.location.name);
            imgWeather[0].src = resp.current.condition.icon;
            txtWeather.text(resp.current.condition.text);
            temp.text(resp.current.temp_c);
            humidity.text(resp.current.humidity);
            tempFeel.text(resp.current.feelslike_c);
            wind.text(resp.current.wind_kph);
            pressure.text(resp.current.pressure_mb);
            uv.text(resp.current.uv);
            visibility.text(resp.current.vis_km);

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
      map.setView([latitude,longitude],13);
      L.marker([latitude,longitude]).addTo(map);

      //Display Today's Weather

      $.ajax({
         method: "GET",
         url: `http://api.weatherapi.com/v1/forecast.json?key=28db3eb606154f67aec162526231909&q=${latitude},${longitude}&days=0`,
         success:(data)=>{
            for(let i=6;i<23;i++){
               if(i%3==0){
                  $(`#imgHour${i}`).attr("src", data.forecast.forecastday[0].day.condition.icon);
                  $(`#tempHour${i}`).html(data.forecast.forecastday[0].hour[i].temp_c+ "°C");
                  $(`#windHour${i}`).html(data.forecast.forecastday[0].hour[i].wind_kph+ "Km/h")
                  $(`#humHour${i}`).html(data.forecast.forecastday[0].hour[i].humidity + "%");
               }

            }
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
   checkWeather(city);
}



function searchBtnOnClick() {
   const cityName = cityInput.value.trim();
   

   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/current.json?Key=28db3eb606154f67aec162526231909&q=${cityName}`,
      success: (resp) => {
         console.log(resp);
         locationName.text(resp.location.name);
         imgWeather[0].src = resp.current.condition.icon;
         txtWeather.text(resp.current.condition.text);
         temp.text(resp.current.temp_c);
         humidity.text(resp.current.humidity);
         tempFeel.text(resp.current.feelslike_c);
         wind.text(resp.current.wind_kph);
         pressure.text(resp.current.pressure_mb);
         uv.text(resp.current.uv);
         visibility.text(resp.current.vis_km);
         const lt = resp.location.lat;
         const lng = resp.location.lon;
         map.setView([lt,lng],13);
         L.marker([lt,lng]).addTo(map);

      }
   });

   // Set Forecast Data
   $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/forecast.json?key=28db3eb606154f67aec162526231909&q=${cityName}&days=4`,
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

    //Display Today's Weather
    $.ajax({
      method: "GET",
      url: `http://api.weatherapi.com/v1/forecast.json?key=28db3eb606154f67aec162526231909&q=${cityName}&days=0`,
      success:(data)=>{
         for(let i=6;i<23;i++){
            if(i%3==0){
               $(`#imgHour${i}`).attr("src", data.forecast.forecastday[0].day.condition.icon);
               $(`#tempHour${i}`).html(data.forecast.forecastday[0].hour[i].temp_c+ "°C");
               $(`#windHour${i}`).html(data.forecast.forecastday[0].hour[i].wind_kph+ "Km/h")
               $(`#humHour${i}`).html(data.forecast.forecastday[0].hour[i].humidity + "%");
            }

         }
      }
   });

}

function historyBtnOnClick(){
   const inputDate=selectDate.value;
  

   $.ajax({
      method: "GET",
      url : `http://api.weatherapi.com/v1/history.json?key=28db3eb606154f67aec162526231909&q=Colombo&dt=${inputDate}`,
      success:(data)=>{
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

