'use strict';

const { body } = document;
const btnLocation = body.querySelector('.material-icons');
const inputSearch = body.querySelector('#searchLocation');
const temp = body.querySelector('#temp-data h2');
const tmax = body.querySelector('#tMax');
const tmin = body.querySelector('#tMin');
const iconTemp = body.querySelector('#icon');
const dateData = document.querySelector('#currentDate');
const timeData = document.querySelector('#timer');
const backgroundVideo = document.querySelector('#theVideo');
const cityName = body.querySelector('#location h1');
let time;

//Adds arrays
const summerAdds = [
  '../adds/01_sum_leroy.mp4',
  // '../adds/02_sum_once.mp4',
  // '../adds/03_sum_Cocacola.mp4',
];
const winterAdds = [
  '../adds/01_win_colacao.mp4',
  // '../adds/02_win_pizza.mp4',
  '../adds/03_win_starbucks.mp4',
  // '../adds/04_win_McDonalds.mp4',
  '../adds/05_win_GALLINA BLANCA.mp4',
];

//Get current month to select Add array
const datenow = new Date();
const month = datenow.getMonth();
let videosSeason;
//Copy activated array
if (month < 4 || month > 9) videosSeason = [...winterAdds];
else videosSeason = [...summerAdds];

//Length array and declare index for array (i)
const videoCount = videosSeason.length;
let i = 0;

//Event Listener current video play at end
document.querySelector('#add').addEventListener('ended', playVideos);

//Start playing 1º video
playAdd(0);

//Reset index (i) when reach last video
function playVideos() {
  const videoAdd = document.querySelector('#add');
  videoAdd.classList.remove('transition-in');
  i++;
  if (i === videoCount) {
    i = 0;
    playAdd(i);
  } else {
    playAdd(i);
  }
}

//Play video selected src
function playAdd(numAdd) {
  const videoAdd = document.querySelector('#add');
  videoAdd.setAttribute('src', videosSeason[numAdd]);
  setTimeout(() => {
    let test = (videoAdd.duration - 1) * 1000;
    setTimeout(() => {
      videoAdd.classList.add('transition-in');
    }, test);
  }, 50);
  videoAdd.autoplay = true;
}

//

//Get localstorage value if exists else default value 'Coruña'
let weatherLocation = localStorage.getItem('weatherLocation');
weatherLocation = weatherLocation ? weatherLocation : 'A Coruña, ES';

//Select dayparting from ico describe day (d) /night (n)
let dayParting = '01d';

//INFO API
const api = {
  key: '2ad566c839ede1eaf20067101ffbf686',
  base: 'https://api.openweathermap.org/data/2.5/',
};

//When DOM is loaded
window.addEventListener('DOMContentLoaded', () => getResults(weatherLocation));

//Show input to change city
btnLocation.addEventListener('click', () => {
  inputSearch.classList.toggle('hiden');
  inputSearch.focus();
});

//Change city and hiden input after press [enter]
inputSearch.addEventListener('keypress', (e) => {
  if (e.keyCode === 13 && !inputSearch.classList.contains('hiden')) {
    weatherLocation = inputSearch.value;
    getResults(weatherLocation);
    inputSearch.value = '';
    inputSearch.classList.toggle('hiden');
  }
});

//Query API after X time
const timer = setInterval(() => {
  getResults(weatherLocation);
}, 600000);

//Ask to API city values
function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((response) => response.json())
    .then((data) => {
      const { temp: tempe, temp_max, temp_min, humidity } = data.main;
      const { icon, main } = data.weather[0];
      dayParting = icon.slice(-1);
      //If error
      if (data.cod === '404' || data.cod === '400')
        cityName.textContent = data.message;
      else {
        localStorage.setItem('weatherLocation', weatherLocation);
        cityName.textContent = data.name;
        temp.textContent = `${tempe.toFixed(1)} ℃`;
        iconTemp.innerHTML = `<img src='http://openweathermap.org/img/wn/${icon}@4x.png'>`;
        tmax.textContent = `Temp. Máxima: ${Math.floor(temp_max)} ºC`;
        tmin.textContent = `Temp. Mínima: ${Math.floor(temp_min)} ºC`;
      }
    });
}

//Lapse time to show date
const currentDate = setInterval(() => {
  const date = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  dateData.innerHTML = date.toUpperCase();
}, 1000);

//Lapse time to show time
const currentTime = setInterval(() => {
  const date = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (dayParting === 'd') {
    if (backgroundVideo.getAttribute('src') !== './img/bg2dia.mp4') {
      backgroundVideo.setAttribute('src', './img/bg2dia.mp4');
    }
  } else {
    if (backgroundVideo.getAttribute('src') !== './img/bg2noche.mp4') {
      backgroundVideo.setAttribute('src', './img/bg2noche.mp4');
    }
  }
  timeData.innerHTML = date.toUpperCase();
}, 1000);

//CALL intervals
timer;
currentDate;
currentTime;
