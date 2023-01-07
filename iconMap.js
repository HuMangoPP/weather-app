export const ICON_MAP = new Map()

const add_mapping = (values, icon) => {
    values.forEach(value => {
        ICON_MAP.set(value, icon)
    })
}

add_mapping([0, 1], 'sunny.jpg')
add_mapping([2], 'partly_cloudy.jpg')
add_mapping([3], 'overcast.jpg')
add_mapping([45, 48], 'cloudy.jpg')
add_mapping([51, 56, 61,     80], 'rain.jpg')
add_mapping([53,     63, 66, 81], 'moderate_rain.png')
add_mapping([55, 57, 65, 67, 82], 'heavy_rain.gif')
add_mapping([71, 73, 75], 'snowfall.jpg')
add_mapping([77, 85, 86], 'snow.gif')
add_mapping([95, 96, 99], 'thunderstorm.jpg')
