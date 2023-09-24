const locationName = $("#locationName");
const imgWeather= $("#imgWeather");
// const  localtime= $("#localTime");
const txtWeather= $("#txtWeather");
const temp=$("#temp");
const humidity= $("#humidity");
const tempFeel = $("#tempFeel");
const wind= $("#wind");
const pressure= $("#pressure");
const uv=$("#uv");
const visibility = $("#visibility");
const cityInput=document.querySelector("#sec-input");


function searchBtnOnClick(){
    const cityName=cityInput.value.trim();
    
   $.ajax({
      method : "GET",
      url: `http://api.weatherapi.com/v1/current.json?Key=28db3eb606154f67aec162526231909&q=${cityName}`,
      success : (resp) => {
         console.log(resp);
         locationName.text(resp.location.name);
         imgWeather[0].src=resp.current.condition.icon;
         // localtime.text(resp.location.localtime);
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
   
}