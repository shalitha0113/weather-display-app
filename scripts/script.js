const locationName = $("#locationName");

function searchBtnOnClick(){
    
   $.ajax({
      method : "GET",
      url: " http://api.weatherapi.com/v1/current.json?Key=28db3eb606154f67aec162526231909&q=Colombo",
      success : (resp) => {
         console.log(resp);
         locationName.text(resp.location.name);
      }
   });
   
}