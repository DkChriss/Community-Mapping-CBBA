class ModisNRTDto {

    latitude;
    longitude;
    date;
    time;
    brightness;
    brightness_c;
    
    constructor(latitude, longitude, date, time, brightness, brightness_c) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.time = time;
        this.brightness = brightness;
        this.brightness_c = brightness_c;
    }
    
}

module.exports = ModisNRTDto