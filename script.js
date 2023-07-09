
const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
card1 = wrapper.querySelector(".card1"),
card2 = wrapper.querySelector(".card2"),
wIcon = card1.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ 
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=d54aa83d814092d3cfb28995c61ed2ba`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d54aa83d814092d3cfb28995c61ed2ba`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });

    /*//testing
    fetch('demo_API.json').then(response => response.json()).then(data => {
        // Use the data from the JSON file here
        console.log(data);
        // Delaying the execution to simulate API latency
        setTimeout(() => {
        weatherDetails(data);
      },1000);
    })
    .catch(error => {
        console.error('Error:', error);
    });*/
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const {country, sunrise, sunset} = info.sys;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        const visibility = info.visibility;
        const {speed,deg} = info.wind;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        function getCurrentDateTime() {
            const now = new Date();
        
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const day = days[now.getDay()];
        
            const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        
            return { day, time };
        }
        
        function updateTimeAndDay() {
            const { day, time } = getCurrentDateTime();
        
            const timeElement = document.getElementById("time");
            const dayElement = document.getElementById("day");
        
            timeElement.textContent = time;
            dayElement.textContent = day;
        }
        setInterval(updateTimeAndDay, 1000);
        updateTimeAndDay();
        
        function convertTimeTo12HourFormat(time) {
            let date = new Date(time * 1000);
            let hour = date.getHours();
            let minute = date.getMinutes();
            let ampm = hour >= 12 ? "pm" : "am";
            hour = hour % 12;
            hour = hour ? hour : 12;
            hour = hour < 10 ? "0" + hour : hour;
            minute = minute < 10 ? "0" + minute : minute;
            let strTime = hour + ":" + minute + " " + ampm;
            return strTime;
          }
         
          function getWindDirection(deg) {
            const directions = [
                'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE','S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
            ];
          
            const index = Math.round(deg / 22.5) % 16;
            return directions[index];
          }

          let sunriseTime = convertTimeTo12HourFormat(sunrise);
          let sunsetTime = convertTimeTo12HourFormat(sunset);
          let dir = getWindDirection(deg);

        card1.querySelector(".temp .numb").innerText = Math.floor(temp);
        card2.querySelector(".weather").innerText = description;
        card1.querySelector(".location span").innerText = `${city}, ${country}`;
        card2.querySelector(".humidity span").innerText = `${humidity}%`;
        card2.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        card2.querySelector(".visibility span").innerText = `${visibility/100}%`;
        card2.querySelector(".speed span").innerText = `${speed} Km/h`;
        card2.querySelector(".dir span").innerText = `${dir}`;
        card2.querySelector(".rise span").innerText = `${sunriseTime}`;
        card2.querySelector(".set span").innerText = `${sunsetTime}`;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");


        const element = document.querySelector('.body');
        const icons = document.querySelectorAll(".fa-solid");
        const logo = document.querySelector('.logo');
        console.log(element);
        console.log(icons);
        if (temp < 10) {
        element.classList.add('cold');
        icons.forEach((icon) => {
            icon.classList.add("icons-cold");
        
        });
        logo.classList.add("cold-logo");
        } else if (temp >= 10 && temp <= 35) {
        element.classList.add('moderate');
        icons.forEach((icon) => {
            icon.classList.add("icons-moderate");
        });
        logo.classList.add("moderate-logo");
        } else {
        element.classList.add('hot');
        icons.forEach((icon) => {
            icon.classList.add("icons-hot");
        });
        logo.classList.add("hot-logo");
        }

        arrowBack.addEventListener("click", ()=>{
            wrapper.classList.remove("active");
        
            element.classList.remove('cold', 'moderate', 'hot');
            icons.forEach((icon) => {
                icon.classList.remove("icons-cold","icons-moderate","icons-hot");
            });
            logo.classList.remove("cold-logo","moderate-logo","hot-logo");
        
        });

    }
}



