let mainInput = document.querySelector("#mainInput");
let btnSearch = document.querySelector("#btnSearch");
let btnNavigation = document.querySelector("#navigation");
let clientTimeHour = document.querySelector(".hour");
let clientTimeMonth = document.querySelector(".month");
let weatherToday = document.querySelector("#todayWeather");
let futureWeather = document.querySelector("#futureWeather");
let placeCity = document.querySelector("#city");
let placeCountry = document.querySelector("#country");

class Weather {
    constructor(mainObj) {
        this.mainObj = mainObj;
        this.tempC = undefined;
    }

    calculateTemp() {
        this.tempC = this.mainObj.main.temp - 273.15;
    }

    createInHTML() {
        // console.log(this.mainObj);

        this.calculateTemp();

        let img = document.createElement("img");
        img.src = this.getImg();

        let helpDivTemp = document.createElement("div");
        helpDivTemp.classList.add("helpDivTemp");

        let pDay = document.createElement("p");

        let pTemp = document.createElement("p");
        pTemp.innerHTML = Math.round(this.tempC) + "&#8451";

        if (weatherToday.childElementCount < 1) {
            pDay.textContent = "TODAY";

            helpDivTemp.append(pDay);
            helpDivTemp.append(pTemp);

            weatherToday.append(img);
            weatherToday.append(helpDivTemp);
        }
        else {
            let time = new Date(this.mainObj.dt_txt);
            let arrTime = time.toString().split(" ");
            pDay.textContent = arrTime[0];

            helpDivTemp.append(pDay);
            helpDivTemp.append(img);
            helpDivTemp.append(pTemp);

            futureWeather.append(helpDivTemp);
        }
    }

    getImg() {
        let codeImg = this.mainObj.weather[0].icon;
        let urlImg = `http://openweathermap.org/img/wn/${codeImg}@2x.png`;
        return urlImg;
    }
}

class urlService {
    constructor(cityName, lon, lat) {
        this.cityName = cityName;
        this.lon = undefined;
        this.lat = undefined;
        this.id = undefined;
        this.country = undefined;
        if (lon && lat) {
            this.lon = lon;
            this.lat = lat;
            this.getIdCity();
        }

    }

    getLatLonCity(e) {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=d59a0c78a31e2f2917a6b6b76f643510`)
            .then(response => response.json())
            .then(json => {
                // console.log(json);
                this.cityName = json[0].name;
                this.country = json[0].state;

                this.lat = json[0].lat;
                this.lon = json[0].lon;

                    this.getIdCity();
            })
    }

    getIdCity() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=d59a0c78a31e2f2917a6b6b76f643510`)
            .then(response => response.json())
            .then(json => {
                if (this.cityName === undefined) {
                    this.cityName = json.name;
                    this.getLatLonCity();
                } else {
                    console.log(json);
                    this.id = json.id;
                    this.getWeatherList();
                }
            })
    }

    getWeatherList() {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=d59a0c78a31e2f2917a6b6b76f643510`)
            .then(response => response.json())
            .then(json => {
                // console.log(json);
                let time = new clientDate();
                time.setTimeNow();
                let monthNumber = time.month + 1;
                let dayNumber = time.day + 1;
                let arr = [];
                arr.push(json.list[0]);
                if (monthNumber < 10) {monthNumber = "0" + monthNumber;}
                if (dayNumber < 10) {dayNumber = "0" + dayNumber;}

                json.list.forEach(weatherDay => {
                    let neededDate = time.year + "-" + monthNumber + "-" + dayNumber + " 12:00:00";
                    if (futureWeather.childElementCount < 6) {
                        if (weatherDay.dt_txt === neededDate) {
                            dayNumber = dayNumber + 1;
                            arr.push(weatherDay);
                        }
                    }
                    else return;
                })

                placeCity.textContent = this.cityName;
                placeCountry.textContent = this.country;

                arr.forEach(day => {
                    let cityWeather = new Weather(day);
                    // this.consoleUrlService();
                    cityWeather.createInHTML();
                })

            });
    }

    consoleUrlService() {
        console.log(`======consoleUrlService==========Start==========`);

        console.log(`this.cityName = ${this.cityName}`);
        console.log(`this.lon = ${this.lon}`);
        console.log(`this.lat = ${this.lat}`);
        console.log(`this.id = ${this.id}`);

        console.log(`======consoleUrlService==========Finish==========`);
    }
}

class clientDate {
    constructor() {
        this.today = undefined;
        this.year = undefined;
        this.month = undefined;
        this.day = undefined;
        this.hour = undefined;
        this.minute = undefined;
        this.second = undefined;
        this.millisecond = undefined;
        this.monthName = undefined;
        this.dayName = undefined;
        this.timeHourMinSecMillSec = undefined;
        this.timeDayMonthYear = undefined;
    }

    setTimeNow() {
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth();
        let day = time.getUTCDate();
        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        let millisecond = time.getMilliseconds();

        this.today = time;
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.millisecond = millisecond;

        this.getMonthName();
        this.getDayName();

        this.createTimeHourAndMinutes();
        this.createTimeDayMonthYear();

        //Виводить все із класу в консоль
        // this.consoleTime();
    }

    getMonthName() {
        let allMonth = ["January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"];
        this.monthName = allMonth[this.month];
    }

    getDayName() {
        let arrTime = this.today.toString().split(" ");
        if (arrTime[0] === "Mon") this.dayName = "Monday";
        else if (arrTime[0] === "Tue") {this.dayName = "Tuesday";}
        else if (arrTime[0] === "Wed") {this.dayName = "Wednesday";}
        else if (arrTime[0] === "Thu") {this.dayName = "Thursday";}
        else if (arrTime[0] === "Fri") {this.dayName = "Friday";}
        else if (arrTime[0] === "Sat") {this.dayName = "Saturday";}
        else if (arrTime[0] === "Sun") {this.dayName = "Sunday";}
    }

    createTimeHourAndMinutes() {
        this.timeHourMinSecMillSec = `${this.hour}:${this.minute}:${this.second}:${this.millisecond}`;
    }

    getTimeHourAndMinutes() {
        this.setTimeNow();
        return this.timeHourMinSecMillSec;
    }

    createTimeDayMonthYear() {
        this.timeDayMonthYear = `${this.dayName}, ${this.day} ${this.monthName} ${this.year}`;
    }

    getTimeDayMonthYear() {
        this.setTimeNow();
        return this.timeDayMonthYear;
    }

    consoleTime() {
        console.log(`this.today = ${this.today}`);
        console.log(`this.year = ${this.year}`);
        console.log(`this.month = ${this.month}`);
        console.log(`this.day = ${this.day}`);
        console.log(`this.hour = ${this.hour}`);
        console.log(`this.minute = ${this.minute}`);
        console.log(`this.second = ${this.second}`);
        console.log(`this.millisecond = ${this.millisecond}`);
        console.log(`this.dayName = ${this.dayName}`);
        console.log(`this.monthName = ${this.monthName}`);
        console.log(`this.timeHourMinSecMillSec = ${this.timeHourMinSecMillSec}`);
        console.log(`this.timeDayMonthYear = ${this.timeDayMonthYear}`);
    }
}

setInterval(function () {
    let date = new clientDate();
    let timeMessageHour = date.getTimeHourAndMinutes();
    let timeMessageMonth = date.getTimeDayMonthYear();
    clientTimeHour.innerHTML = "";
    clientTimeMonth.innerHTML = "";
    clientTimeHour.innerHTML = timeMessageHour;
    clientTimeMonth.innerHTML = timeMessageMonth;
}, 1)

function startAPI() {
    weatherToday.innerHTML = "";
    futureWeather.innerHTML = "";
    let newUrl = new urlService(mainInput.value);
    newUrl.getLatLonCity();
    mainInput.value = "";
}

btnSearch.addEventListener("click", function () {
    console.log(mainInput.value.length);
    if (mainInput.value.length > 0) {
        startAPI();
    }
})

btnNavigation.addEventListener("click", function () {
    let x = navigator.geolocation.getCurrentPosition(start, f);
    function start(e) {
        weatherToday.innerHTML = "";
        futureWeather.innerHTML = "";
        let newUrl = new urlService(undefined, e.coords.longitude, e.coords.latitude);
        mainInput.value = "";
    }

    function f() {
        console.log("error");
    }
})

document.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && mainInput.value.length > 0) {
        startAPI();
    }
})

let london = new urlService("London");
london.getLatLonCity();
