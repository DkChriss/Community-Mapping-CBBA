const modisNRT = require("../models/ModisNRT");
const user = require("../models/User")
const axios = require("axios");
const csv = require('csv-parser');
const { Readable } = require('stream');



  

class ModisNRTService {

    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    static haversineDistance(coord1, coord2) {
        const R = 6371;
      
        const lat1 = this.toRadians(coord1.latitude);
        const lon1 = this.toRadians(coord1.longitude);
        const lat2 = this.toRadians(coord2.latitude);
        const lon2 = this.toRadians(coord2.longitude);
      
        const deltaLat = lat2 - lat1;
        const deltaLon = lon2 - lon1;
      
        const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        const distance = R * c;
        return distance;
    }

    static async downloadCSV(url) {
        try {

            const response = await axios({url});

            const csvStream = Readable.from(response.data);

            csvStream
            .pipe(csv())
            .on('data', async (row) => {
                const record = new modisNRT(row);
                record.brightness_c = record.brightness - 273.15;
                record.status = true;
                try {
                    await record.save();
                } catch (error) {
                    if (error.code === 11000) { 
                        console.log('Duplicate record, skipping:', row);
                    } else {
                        console.error('Error saving record:', error);
                    }
                }
            })
            .on('end', () => {
              console.log('Data successfully inserted into MongoDB');
            });
    

        } catch (error) {
            console.error('Error downloading the CSV:', error);
        }
    }

    static async store(data) {
        try {
            const record = new modisNRT(data);
            record.brightness_c = record.brightness - 273.15;
            record.save();
            this.verifyIfSomeoneIsNear(record.latitude, record.longitude)
            return record;
        } catch(error) {
            console.error(error);
        }
    }

    static async list(data) {
        try {
            const query = {
                acq_date: {
                  $gte: data.startDate,
                  $lte: data.endDate
                }
            };
            const results = await modisNRT.find(query);
            return results;

        } catch(error) {
            console.error(error);
        }
    }

    static async updateStatus(id) {
        try {
            const record = await modisNRT.findById(id);
            record.status = false;
            record.save();
            return record;
        } catch(error) {
            console.log(error)
        }
    }

    static async verifyIfSomeoneIsNear(lat, long) {
        try {
            const users = await user.find();
            
            users.map(user => {
                let userLocation = {
                    latitude: user.latitude,
                    longitude: user.longitude
                }

                let wildFireLocation = {
                    latitude: lat,
                    longitude: long
                }
                
                let distance = this.haversineDistance(userLocation, wildFireLocation);
                distance = distance.toFixed(2);
                console.log(distance)
                if(distance <= 0.30) {
                    let message =  `Se ha detectado un incendia cerca de su posicion, por favor resguardese hasta que las respectivas autoridades lleguen, este en calma por favor. Distancia del incendio ${distance} Km`
                    let number = user.phoneNumber;

                    const req = axios.post('http://localhost:3000/api/v1/send-alert',{
                        message: message,
                        number: number
                    })

                }

            })

        }catch(error) {
            console.log(error)
        }
    }

}

module.exports = ModisNRTService;