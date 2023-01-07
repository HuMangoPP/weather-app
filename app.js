import './style.css'
import { ICON_MAP } from './iconMap'
import { getWeather } from './weather'

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {weekday: 'long'})
const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: 'numeric'})
const TIME_FORMATTER = new Intl.DateTimeFormat(undefined, {timeStyle: 'medium'})

const setValue = (selector, value, {parent=document} = {}) => {
  parent.querySelector(`[data-${selector}]`).textContent = value
}

const getIconUrl = (temp, iconCode) => {
  if (temp>=40) {
    // heatwave temperatures
    return 'icons/heatwave.jpg'
  }
  if (temp>=30) {
    // really hot
    return 'icons/hot.gif'
  }
  if (temp<-30) {
    // really cold
    return 'icons/frozen.jpg'
  }
  return `icons/${ICON_MAP.get(iconCode)}`
}

const currentIcon = document.querySelector('[data-current-icon]')

const renderCurrentTime = () => {
  setValue('current-time', TIME_FORMATTER.format(Date.now()))
}

const renderCurrentWeather = (current) => {
  currentIcon.src = getIconUrl(current.currentTemp, current.iconCode)
  setValue('current-temp', current.currentTemp)
  setValue('current-high', current.highTemp)
  setValue('current-low', current.lowTemp)
  setValue('current-fl-high', current.highFeelslike)
  setValue('current-fl-low', current.lowFeelslike)
  setValue('current-wind', current.windSpeed)
  setValue('current-precip', current.precip)
}

const hourlySection = document.querySelector('[data-hourly-section')
const hourCardTemplate = document.getElementById('hour-card-template')

const renderHourlyWeather = (hourly) => {
  hourlySection.innerHTML = ""
  hourly.forEach(hour => {
    const element = hourCardTemplate.content.cloneNode(true)
    setValue('time', HOUR_FORMATTER.format(hour.timestamp), {parent: element})
    setValue('temp', hour.temp, {parent: element})
    element.querySelector('[data-icon]').src = getIconUrl(hour.temp, hour.iconCode)
    hourlySection.append(element)
  })
}

const dailySection = document.querySelector('[data-daily-section]')
const dayRowTemplate = document.getElementById('day-row-template')

const renderDailyWeather = (daily) => {
  dailySection.innerHTML = ""
  daily.forEach(day => {
    const element = dayRowTemplate.content.cloneNode(true)
    setValue('date', DAY_FORMATTER.format(day.timestamp), {parent: element})
    setValue('temp', day.maxTemp, {parent: element})
    element.querySelector('[data-icon]').src = getIconUrl(day.maxTemp, day.iconCode)
    dailySection.append(element)
  })
}

const renderWeather = ({current, daily, hourly}) => {
  renderCurrentWeather(current)
  renderHourlyWeather(hourly)
  renderDailyWeather(daily)
  document.getElementById("loader-wrapper").style.display = "none"
}

setInterval(renderCurrentTime, 10)

const positionSuccess = ({coords}) => {
  getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(e => {
    console.error(e)
    alert('error getting weather')
  })
}

const positionError = () => {
  alert('There was an error getting your location. Please allow us to use your location and refresh the page.')
}

navigator.geolocation.getCurrentPosition(positionSuccess, positionError)