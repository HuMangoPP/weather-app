import axios from 'axios'

export function getWeather(lat, lon, timezone) {
    return axios.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime", 
    {
        params: {
            latitude: lat,
            longitude: lon,
            timezone,
        }
    }).then(({data}) => {
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data),
        }
    })
}

const parseCurrentWeather = ({current_weather, daily}) => {
    const {
        time: time,
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
    } = current_weather
    
    const {
        temperature_2m_max: [highTemp],
        temperature_2m_min: [lowTemp],
        apparent_temperature_max: [highFeelslike],
        apparent_temperature_min: [lowFeelslike],
        precipitation_sum: [precip]
    } = daily
    
    return {
        time,
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(highTemp),
        lowTemp: Math.round(lowTemp),
        highFeelslike: Math.round(highFeelslike),
        lowFeelslike: Math.round(lowFeelslike),
        windSpeed: Math.round(windSpeed),
        precip: Math.round(precip*100)/100,
        iconCode,
    }
}

const parseDailyWeather = ({daily}) => {
    return daily.time.map((time, index) => {
        return {
            timestamp: time*1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index])
        }
    })
}

const parseHourlyWeather = ({hourly, current_weather}) => {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time*1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
        }
    }).filter(({timestamp}) => timestamp>=current_weather.time*1000).slice(0, 5)
}