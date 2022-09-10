

let mainOutput = document.querySelector("#mainOutput");
let mainInput = document.querySelector("#mainInput");
let btnSearch = document.querySelector("#btnSearch");

class Weather {
    constructor(url) {
        this.url = url;
        this.mainObj = undefined;
        this.tempK = undefined;
        this.tempC = undefined;
        this.tempF = undefined;
        this.cityName = undefined;
        this.clouds = undefined;
        this.cloudsDescription = undefined;
    }

    takeMainObject() {
        fetch(this.url)
            .then(response => response.json())
            .then(json => {
                this.mainObj = json;
                this.cityName = this.mainObj.name;
                this.clouds = this.mainObj.clouds.all;
                this.cloudsDescription = this.mainObj.weather[0].description;
                this.windSpead = this.mainObj.wind.speed;

            })
            .then(after => this.createInHTML());
    }

    createInHTML() {
        // console.log(this.mainObj);
        this.calculateTemp();
        let mainDiv = document.createElement("div");
        mainDiv.classList.add("mainDiv");

        let helpDivTemp = document.createElement("div");
        helpDivTemp.classList.add("helpDivTemp");

        let pName = document.createElement("p");
        pName.textContent = this.cityName;

        let pTemp = document.createElement("p");
        pTemp.innerHTML = this.tempC + "&#8451";

        let divTemp = document.createElement("div");
        divTemp.classList.add("divTemp");

        let btnC = document.createElement("button");
        btnC.innerHTML = "&#8451";

        let btnF = document.createElement("button");
        btnF.innerHTML = "&#8457";

        let divBtns = document.createElement("div");
        divBtns.append(btnC);
        divBtns.append(btnF);
        divBtns.classList.add("divBtns");

        divTemp.append(pTemp);
        divTemp.append(divBtns);

        divBtns.addEventListener("click", function (e) {
            if (e.target.textContent === "℉")
            {
                console.log(this.tempF);
                pTemp.innerHTML = this.tempF + "&#8457";
            }
            else if (e.target.textContent === "℃")
            {
                pTemp.innerHTML = this.tempC + "&#8451";
            }


        })

        let pClouds = document.createElement("p");
        pClouds.textContent = this.clouds + "% " + this.cloudsDescription;

        let pWindSpeed = document.createElement("p");
        pWindSpeed.textContent = this.windSpead + " metre/sec";

        let img = document.createElement("img");
        img.src = this.getImg();

        helpDivTemp.append(pClouds);

        mainDiv.append(pName);
        mainDiv.append(divTemp);
        mainDiv.append(helpDivTemp);
        mainDiv.append(pWindSpeed);
        mainDiv.append(img);

        mainOutput.append(mainDiv);
    }

    calculateTemp() {
        this.tempK = this.mainObj.main.temp;
        this.tempC = Math.round(this.tempK - 273.15);
        this.tempF = Math.round(1.8 * this.tempC + 32);
    }

    getImg() {
        let codeImg = this.mainObj.weather[0].icon;
        let urlImg = `http://openweathermap.org/img/wn/${codeImg}@2x.png`;
        return urlImg;
    }

}

class urlService {
    constructor(cityName) {
        this.cityName = cityName;
        this.lon = undefined;
        this.lat = undefined;
        this.id = undefined;
    }

    getLatLonCity() {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=d59a0c78a31e2f2917a6b6b76f643510`)
            .then(response => response.json())
            .then(json => {
                this.lat = json[0].lat;
                this.lon = json[0].lon;
                this.getIdCity();
            })
    }

    getIdCity() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=d59a0c78a31e2f2917a6b6b76f643510`)
            .then(response => response.json())
            .then(json => {
                this.id = json.id;
                // this.getHistoryWeather();
                this.create();
            })
    }

    getHistoryWeather() {
        fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=44.34&lon=10.99&appid=bf35cac91880cb98375230fb443a116f`)
            .then(response => response.json())
            .then(json => console.log(json));
    }

    create() {
        let cityWeather = new Weather(`http://api.openweathermap.org/data/2.5/weather?id=${this.id}&appid=bf35cac91880cb98375230fb443a116f`);
        cityWeather.takeMainObject();
    }

}

let london = new urlService("London");
london.getLatLonCity();
let kyiv = new urlService("Kyiv");
kyiv.getLatLonCity();
let newYork = new urlService("New York");
newYork.getLatLonCity();

btnSearch.addEventListener("click", function () {
    let newUrl = new urlService(mainInput.value);
    newUrl.getLatLonCity();
})
