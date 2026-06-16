const apiURL = "9e8e0d35aa664ef93dbd765651b77c97";
let miasto = "";

function pobierzDane() {
    miasto = document.getElementById("miasto").value;
    if (!miasto) return;

    document.getElementById("current-weather").innerHTML = "";
    document.getElementById("forecast-weather").innerHTML = "";
    
    obecnaPogoda();
    dniowaPogoda();
}

function obecnaPogoda() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${miasto}&appid=${apiURL}&units=metric&lang=pl`, false);
    xhr.send();
    
    if (xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        const container = document.getElementById("current-weather");
        
        const date = new Date(data.dt * 1000);
        const formattedTime = date.toLocaleTimeString();

        container.innerHTML = `
            <div class="weather-card current">
                <h2>Obecna pogoda: ${data.name}</h2>
                <div class="details">
                    <p><strong>Pogoda:</strong> ${data.weather[0].description}</p>
                    <p><strong>Godzina:</strong> ${formattedTime}</p>
                    <p class="temp">${data.main.temp.toFixed(1)}°C</p>
                </div>
            </div>
        `;
    }
}

function dniowaPogoda() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${miasto}&appid=${apiURL}&units=metric&lang=pl`)
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        const container = document.getElementById("forecast-weather");
        container.innerHTML = "<h3>Prognoza na najblizsze dni:</h3><div class='forecast-grid'></div>";
        const grid = container.querySelector(".forecast-grid");

        data.list.forEach((element, index) => {
            
                const forecastDiv = document.createElement("div");
                forecastDiv.className = "forecast-item";
                forecastDiv.innerHTML = `
                    <p class="date">${element.dt_txt}</p>
                    <p class="temp">${element.main.temp.toFixed(1)}°C</p>
                    <p>${element.weather[0].description}</p>
                `;
                grid.appendChild(forecastDiv);
        });
    });
}
