// API METEO (Open-Meteo)

const cities = {
    paris: { latitude: 48.8566, longitude: 2.3522 },
    lille: { latitude: 50.6292, longitude: 3.0573 },
    bordeaux: { latitude: 44.8378, longitude: -0.5792 },
    lyon: { latitude: 45.764, longitude: 4.8357 },
    marseille: { latitude: 43.2965, longitude: 5.3698 }
};

function getApiUrl(city) {
    const { latitude, longitude } = cities[city];
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
}

function getWeatherEmojiAndDescription(code) {
    const weatherMapping = {
        0: { emoji: "☀️", description: "Ciel dégagé" },
        1: { emoji: "🌤️", description: "Principalement dégagé" },
        2: { emoji: "🌥️", description: "Partiellement nuageux" },
        3: { emoji: "☁️", description: "Couvert" },
        45: { emoji: "🌫️", description: "Brouillard" },
        48: { emoji: "🌫️", description: "Brouillard givrant" },
        51: { emoji: "🌦️", description: "Bruine légère" },
        53: { emoji: "🌧️", description: "Bruine modérée" },
        55: { emoji: "🌧️", description: "Bruine dense" },
        56: { emoji: "🌧️❄️", description: "Bruine verglaçante légère" },
        57: { emoji: "🌧️❄️", description: "Bruine verglaçante dense" },
        61: { emoji: "🌧️", description: "Pluie légère" },
        63: { emoji: "🌧️", description: "Pluie modérée" },
        65: { emoji: "🌧️", description: "Pluie forte" },
        66: { emoji: "🌧️❄️", description: "Pluie verglaçante légère" },
        67: { emoji: "🌧️❄️", description: "Pluie verglaçante forte" },
        71: { emoji: "❄️", description: "Chute de neige légère" },
        73: { emoji: "❄️", description: "Chute de neige modérée" },
        75: { emoji: "❄️", description: "Chute de neige forte" },
        77: { emoji: "🌨️", description: "Grains de neige" },
        80: { emoji: "🌦️", description: "Averses de pluie légères" },
        81: { emoji: "🌦️", description: "Averses de pluie modérées" },
        82: { emoji: "⛈️", description: "Averses de pluie violentes" },
        85: { emoji: "🌨️", description: "Averses de neige légères" },
        86: { emoji: "🌨️", description: "Averses de neige fortes" },
        95: { emoji: "⛈️", description: "Orage léger ou modéré" },
        96: { emoji: "⛈️❄️", description: "Orage avec grêle légère" },
        99: { emoji: "⛈️❄️", description: "Orage avec grêle forte" }
    };
    return weatherMapping[code] || { emoji: "🌤️", description: "Conditions inconnues" };
}

async function fetchWeather() {
    const citySelect = document.getElementById('citySelect');
    const selectedCity = citySelect.value;

    if (selectedCity === "Sélectionner une ville") {
        document.getElementById('weather').innerHTML = `<p>Veuillez sélectionner une ville.</p>`;
        return;
    }

    try {
        const response = await fetch(getApiUrl(selectedCity));
        if (!response.ok) throw new Error("Erreur lors du chargement des données météo.");
        const data = await response.json();

        const weatherDiv = document.getElementById('weather');
        const temperature = data.current_weather.temperature;
        const weatherCode = data.current_weather.weathercode;

        const { emoji, description } = getWeatherEmojiAndDescription(weatherCode);

        weatherDiv.innerHTML = `
            <h1>${capitalizeFirstLetter(selectedCity)}<br/>${emoji} ${temperature}°C</h1>
        `;
    } catch (error) {
        document.getElementById('weather').innerHTML = `<p>${error.message}</p>`;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchWeather();

//API AGIFY

async function fetchAge() {
    const nameInput = document.getElementById('nameInput').value.trim();
    const ageDiv = document.getElementById('age');

    if (nameInput === "") {
        ageDiv.innerHTML = `<p>Entrez un prénom</p>`;
        return;
    }

    const apiUrl = `https://api.agify.io/?name=${nameInput}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erreur lors du chargement des données.");
        const data = await response.json();

        if (data.age === null) {
            ageDiv.innerHTML = `<p>Âge non trouvé pour le prénom "${nameInput}".</p>`;
        } else {
            ageDiv.innerHTML = `<p>L'âge estimé pour "${nameInput}" est ${data.age} ans.</p>`;
        }
    } catch (error) {
        ageDiv.innerHTML = `<p>${error.message}</p>`;
    }
}

//API Pays (REST Countries)

async function fetchCountryInfo() {
    const countrySelect = document.getElementById('countrySelect').value;
    const countryInfoDiv = document.getElementById('countryInfo');

    if (countrySelect === "") {
        countryInfoDiv.innerHTML = `<p>Sélectionnez un pays pour afficher les informations.</p>`;
        return;
    }

    const apiUrl = `https://restcountries.com/v3.1/name/${countrySelect}?fullText=true`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Erreur lors du chargement des données.");
        const data = await response.json();
        const countryData = data[0];

        const flag = countryData.flags.svg;
        const currency = Object.values(countryData.currencies)[0].name;
        const capital = countryData.capital[0];
        const population = countryData.population;
        const region = countryData.region;

        countryInfoDiv.innerHTML = `
            <img src="${flag}" alt="Drapeau de ${countrySelect}" width="40">
            <p><strong>Capitale :</strong> ${capital}</p>
            <p><strong>Population :</strong> ${population.toLocaleString()}</p>
            <p><strong>Région :</strong> ${region}</p>
            <p><strong>Monnaie :</strong> ${currency}</p>
        `;
    } catch (error) {
        countryInfoDiv.innerHTML = `<p>${error.message}</p>`;
    }
}