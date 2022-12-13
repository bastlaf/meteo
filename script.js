document.querySelector('.SearchInput').addEventListener('keydown', (event) => {
  if (event.keyCode === 13) {
    document.querySelector('.SearchButton').click();
  }
});

// Récupérez votre clé API OpenWeather depuis votre compte OpenWeather
const API_KEY = "a20cce61f7e56fcd391c0830c44ba0fc";

const LIEGELAT = 50.6412;
const LIEGELONG = 5.5718;
const HOUFFALAT = 50.1334;
const HOUFFALONG = 5.7888;

// Définissez les éléments HTML que vous allez utiliser
const cityInput = document.getElementById("cityInput");
const submitButton = document.getElementById("submitButton");
const weatherDisplay = document.getElementById("weatherDisplay");



//-------------------------------------------RECHERCHE---------------------------------------------
function research() {  
  
  // Ajoutez un gestionnaire d'événements pour l'événement "click" sur le bouton de soumission
  submitButton.addEventListener("click", () => {
    
    let loader = document.querySelector(".loader");
    loader.style.display = "block";

    setTimeout(function() {
      loader.style.display = "none";
    }, 2000);

    // Récupérez la ville saisie par l'utilisateur
    let city = cityInput.value;
    
    // Récupérez les éléments HTML avec les classes "LocationSearch", "currentTemp", "currentDesc", "dem" et "iconSearch"
    const locationNameElement = document.querySelector(".LocationSearch");
    const currentTempElement = document.querySelector(".currentTemp");
    const currentDescElement = document.querySelector(".currentDesc");
    const demElement = document.querySelector(".dem");
    const iconElement = document.getElementById("iconSearch");
    
    const dayElementSearch = document.querySelector(".dayTomorrowSearch");
    const maxTempElementSearch = document.querySelector(".max-tempTomorrowSearch");
    const minTempElementSearch = document.querySelector(".min-tempTomorrowSearch");
    const iconTomorrowSearch2 =  document.getElementById("iconTomorrowSearch");

    const errorElement = document.getElementById("error");
        
    
    // Définissez le contenu de ces éléments sur des valeurs vides
    locationNameElement.innerHTML = "";
    currentTempElement.innerHTML = "";
    currentDescElement.innerHTML = "";
    demElement.innerHTML = "";
    iconElement.src = "";
    
    dayElementSearch.innerHTML = "";
    maxTempElementSearch.innerHTML = "";
    minTempElementSearch.innerHTML = "";
    iconTomorrowSearch2.src = "";

  
    errorElement.innerHTML = "";
    
    // Transformez la ville en minuscules
    city = city.toLowerCase();
    // Transformez la première lettre de la ville en majuscule
    city = city.charAt(0).toUpperCase() + city.slice(1);
    
    
  function tempsActuel() {
      
    //------------- TEMPS ACTUEL -------------------
    
    // Envoyez une requête à l'API en utilisant la ville saisie par l'utilisateur
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`
      )
      .then(response => response.json())
      .then(data => {
        // Vérifiez si la ville saisie est vide
        
        if (city === "") {
          // Définissez le contenu de l'élément sur un message d'erreur approprié
          errorElement.innerHTML = "Veuillez saisir une ville avant de soumettre.";
          // Vérifiez si l'objet `data` contient un champ `cod` ayant une valeur autre que 200
        } else if (city !== "" & data.cod !== 200) {

          // Définissez le contenu de l'élément sur un message d'erreur approprié
          errorElement.innerHTML = "Ville introuvable. Veuillez vérifier l'orthographe et réessayer.";
          
          // Sortez de la fonction pour éviter d'afficher des données incorrectes
        return;
        }
        // Définissez l'URL de l'icône en fonction de l'icône du temps
        let iconeCurrent = data.weather[0].icon;
        let iconeCurrent2 = "http://openweathermap.org/img/wn/" + iconeCurrent + "@2x.png";
        // Récupérer la température en degrés Celsius
        const temperatureCelsius = data.main.temp;
        
        // Récupérer les conditions météorologiques
        const currentWeather = data.weather[0].description;
        
        // Affichez les données météorologiques de la ville choisie par l'utilisateur, en degrés Celsius et les conditions météorologiques
        let locationNameSearch = document.querySelector(".LocationSearch");
        locationNameSearch.innerHTML = city;
        document.getElementById("iconSearch").src = iconeCurrent2;
        let locationTempSearch = document.querySelector(".currentTemp");
        locationTempSearch.innerHTML = `${temperatureCelsius.toFixed(1)}°C`;
        let locationDescSearch = document.querySelector(".currentDesc");
        locationDescSearch.innerHTML = currentWeather;
        let demDescSearch = document.querySelector(".dem");
        demDescSearch.innerHTML = "Demain";
        // Récupérez l'élément HTML avec l'ID "error"
        // Définissez le contenu de l'élément sur un message vide (pour vider le champ)
        errorElement.innerHTML = "";
      });
  }  
  
  function tempsDemain() {
    
      //--------------------TEMPS LENDEMAIN -----------------------
      
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${API_KEY}`
        )
        .then(response => {
          // Transformez la réponse en JSON
       return response.json();
      })
      .then(data => {
        
        // Obtenir la date d'aujourd'hui
        let today = new Date();
        
        // Trouver toutes les prévisions météorologiques pour la journée suivante
        let searchtomorrowForecasts = data.list.filter(forecast => {
          let forecastDate = new Date(forecast.dt_txt);
          return forecastDate.getDate() > today.getDate();
        });
        
        // Récupérez la description du temps pour demain midi
        let searchtomorrowForecast = searchtomorrowForecasts[4];
        let searchDayWeather = searchtomorrowForecast.weather[0].description;
        
        // Définissez l'URL de l'icône en fonction de l'icône du temps
        let iconTomorrowSearch = searchtomorrowForecast.weather[0].icon;
        let iconTomorrowSearch2 = "http://openweathermap.org/img/wn/" + iconTomorrowSearch + "@2x.png";
        
        // Récupérez les températures maximale et minimale pour les 8 premières entrées de la journée suivante
        let searchTempForecasts = searchtomorrowForecasts.slice(0, 9);
        let tempMax = Math.max(...searchTempForecasts.map(forecast => forecast.main.temp_max));
        let tempMin = Math.min(...searchTempForecasts.map(forecast => forecast.main.temp_min));
        console.log(searchTempForecasts)
        
        // Affichez les températures en degrés Celsius
        let tempMaxCelsiusSearch ="Maxima : " + (tempMax).toFixed(1) + "\u00b0C";
        let tempMinCelsiusSearch ="Minima : " + (tempMin).toFixed(1) + "\u00b0C";
        
        let dayElementSearch = document.querySelector(".dayTomorrowSearch");
        dayElementSearch.innerHTML = searchDayWeather;
        let maxTempElementSearch = document.querySelector(".max-tempTomorrowSearch");
        maxTempElementSearch.innerHTML = tempMaxCelsiusSearch;
        let minTempElementSearch = document.querySelector(".min-tempTomorrowSearch");
        minTempElementSearch.innerHTML = tempMinCelsiusSearch;
        
        // Affichez l'icône du temps sur votre page web
        document.getElementById("iconTomorrowSearch").src = iconTomorrowSearch2;
      });
  }
  
  setTimeout(tempsActuel, 2000);
  setTimeout(tempsDemain, 2000);
    
  });
}



//-----------------------------------------------------------------HOUFFALIZE-----------------------------------------------------------------------------
function Houffalaize() {
  
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${HOUFFALAT}&lon=${HOUFFALONG}&units=metric&lang=fr&appid=${API_KEY}`
    )
    .then(response => response.json())
    .then(data => {
      // Définissez l'URL de l'icône en fonction de l'icône du temps
      let iconeCurrentHouffalize1 = data.weather[0].icon;
      let iconeCurrentHouffalize2 = "http://openweathermap.org/img/wn/" + iconeCurrentHouffalize1 + "@2x.png";
      // Récupérer la température en degrés Kelvin
      const temperatureHouffalizeCelsius = data.main.temp;
      
      // Récupérer les conditions météorologiques
      const weather = data.weather[0].description;
      
      // Affichez l'icône du temps sur votre page web
      document.getElementById("iconCurrentHouffalize").src = iconeCurrentHouffalize2;
      // Afficher les données météorologiques de Houffalize, en degrés Celsius et les conditions météorologiques
      const currentTemperatureHouffalize = document.querySelector('.currentTempHouffalize');
      currentTemperatureHouffalize.innerHTML = `${temperatureHouffalizeCelsius.toFixed(1)}°C`;
      const CurrentDescriptionHouffalize = document.querySelector('.currentDescHouffalize');
      CurrentDescriptionHouffalize.innerHTML = `${weather}`;
    });
    
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${HOUFFALAT}&lon=${HOUFFALONG}&units=metric&lang=fr&appid=${API_KEY}`
      )
      .then(response => {
        // Transformez la réponse en JSON
        return response.json();
      })
      .then(data => {
        
        // Récupérez le nom de la localisation
        let locationNameHouffalize = data.city.name;
        
        // Obtenir la date d'aujourd'hui
        let today = new Date();
        
        // Trouver toutes les prévisions météorologiques pour la journée suivante
        let tomorrowForecasts = data.list.filter(forecast => {
      let forecastDate = new Date(forecast.dt_txt);
      return forecastDate.getDate() > today.getDate();
    });
    
    // Récupérez la description du temps pour demain midi
    let tomorrowForecast = tomorrowForecasts[4];
    let dayWeather = tomorrowForecast.weather[0].description;
    
    // Définissez l'URL de l'icône en fonction de l'icône du temps
    let iconHouffalize = tomorrowForecast.weather[0].icon;
    let icone1 = "http://openweathermap.org/img/wn/" + iconHouffalize + "@2x.png";
    
    // Récupérez les températures maximale et minimale pour les 8 premières entrées de la journée suivante
    let tempForecasts = tomorrowForecasts.slice(0, 9);
    let tempMax = Math.max(...tempForecasts.map(forecast => forecast.main.temp_max));
    let tempMin = Math.min(...tempForecasts.map(forecast => forecast.main.temp_min));
    console.log(tempForecasts)
    
    // Affichez les températures en degrés Celsius
    let tempMaxCelsius ="Maxima : " + (tempMax).toFixed(1) + "\u00b0C";
    let tempMinCelsius ="Minima : " + (tempMin).toFixed(1) + "\u00b0C";
    
    // Affichez les données dans la page HTML
    let locationNameElement = document.querySelector(".locationHouffalize");
    locationNameElement.innerHTML = locationNameHouffalize;
    let dayElement = document.querySelector(".dayHouffalize");
    dayElement.innerHTML = dayWeather;
    let maxTempElement = document.querySelector(".max-tempHouffalize");
    maxTempElement.innerHTML = tempMaxCelsius;
    let minTempElement = document.querySelector(".min-tempHouffalize");
    minTempElement.innerHTML = tempMinCelsius;
    
    // Affichez l'icône du temps sur votre page web
    document.getElementById("iconHouffalize").src = icone1;
  });
  
  

}



//-----------------------------------------------------------------LIEGE-----------------------------------------------------------------------------
function Liege() {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${LIEGELAT}&lon=${LIEGELONG}&units=metric&lang=fr&appid=${API_KEY}`
    )
    .then(response => response.json())
    .then(data => {
      // Définissez l'URL de l'icône en fonction de l'icône du temps
      let iconeCurrentLiege1 = data.weather[0].icon;
      let iconeCurrentLiege2 = "http://openweathermap.org/img/wn/" + iconeCurrentLiege1 + "@2x.png";
      // Récupérer la température en degrés Kelvin
      const temperatureLiegeCelsius = data.main.temp;
      
      // Récupérer les conditions météorologiques
      const weatherLiege = data.weather[0].description;
      
      // Affichez l'icône du temps sur votre page web
      document.getElementById("iconCurrentLiege").src = iconeCurrentLiege2;
      // Afficher les données météorologiques de Liege, en degrés Celsius et les conditions météorologiques
      const currentTemperatureLiege = document.querySelector('.currentTempLiege');
      currentTemperatureLiege.innerHTML = `${temperatureLiegeCelsius.toFixed(1)}°C`;
      const CurrentDescriptionLiege = document.querySelector('.currentDescLiege');
      CurrentDescriptionLiege.innerHTML = `${weatherLiege}`;
    });
    
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LIEGELAT}&lon=${LIEGELONG}&units=metric&lang=fr&appid=${API_KEY}`
      )
      .then(response => {
        // Transformez la réponse en JSON
        return response.json();
      })
      .then(data => {
        
        // Récupérez le nom de la localisation
        let locationNameLiege = data.city.name;
        
        // Obtenir la date d'aujourd'hui
        let today = new Date();
        
        // Trouver toutes les prévisions météorologiques pour la journée suivante
        let tomorrowForecasts = data.list.filter(forecast => {
          let forecastDate = new Date(forecast.dt_txt);
          return forecastDate.getDate() > today.getDate();
        });
        
        // Récupérez la description du temps pour demain midi
        let tomorrowForecast = tomorrowForecasts[4];
        let dayWeather = tomorrowForecast.weather[0].description;
        
    // Définissez l'URL de l'icône en fonction de l'icône du temps
    let iconLiege = tomorrowForecast.weather[0].icon;
    let icone1 = "http://openweathermap.org/img/wn/" + iconLiege + "@2x.png";
    
    // Récupérez les températures maximale et minimale pour les 8 premières entrées de la journée suivante
    let tempForecasts = tomorrowForecasts.slice(0, 9);
    let tempMax = Math.max(...tempForecasts.map(forecast => forecast.main.temp_max));
    let tempMin = Math.min(...tempForecasts.map(forecast => forecast.main.temp_min));
    
    // Affichez les températures en degrés Celsius
    let tempMaxCelsius ="Maxima : " + (tempMax).toFixed(1) + "\u00b0C";
    let tempMinCelsius ="Minima : " + (tempMin).toFixed(1) + "\u00b0C";
    
    // Affichez les données dans la page HTML
    let locationNameElement = document.querySelector(".locationLiege");
    locationNameElement.innerHTML = locationNameLiege;
    let dayElement = document.querySelector(".dayLiege");
    dayElement.innerHTML = dayWeather;
    let maxTempElement = document.querySelector(".max-tempLiege");
    maxTempElement.innerHTML = tempMaxCelsius;
    let minTempElement = document.querySelector(".min-tempLiege");
    minTempElement.innerHTML = tempMinCelsius;
    
    // Affichez l'icône du temps sur votre page web
    document.getElementById("iconLiege").src = icone1;
  });
  
}



research();
Houffalaize();
Liege();



// Récupérer l'élément input
const toggleButton = document.querySelector("#dn");

// Récupérer l'élément body
const body = document.querySelector("body");
const cards = document.querySelectorAll('.card');
const btn = document.querySelector(".SearchButton");
const loader2 = document.querySelector(".loader");
// Écouter l'événement change sur l'élément input
toggleButton.addEventListener("change", event => {
  // Si l'input est coché, ajouter la classe dark-mode à l'élément body
  if (event.target.checked) {
    body.classList.add("dark-mode-body");
    btn.classList.add("dark-mode-btn");
    loader2.classList.add("dark-mode-loader");
    for (const card of cards) {
      card.classList.add('dark-mode');
    }

  } else {
    // Sinon, supprimer la classe dark-mode de l'élément body
    body.classList.remove("dark-mode-body");
    btn.classList.remove("dark-mode-btn");
    loader2.classList.remove("dark-mode-loader");
    for (const card of cards) {
      card.classList.remove('dark-mode');
    }

  }
});
