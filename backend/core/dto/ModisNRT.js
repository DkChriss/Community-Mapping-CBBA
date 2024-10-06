class ModisNRTDto {

    latitude;
    longitude;
    date;
    time;
    brightness
    
    constructor(latitude, longitude, date, time, brightness) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.date = date;
        this.time = time;
        this.brightness = brightness;
    }
    
}

module.exports = ModisNRTDto