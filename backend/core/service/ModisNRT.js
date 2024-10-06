const modisNRT = require("../models/ModisNRT");
const axios = require("axios");
const csv = require('csv-parser');
const { Readable } = require('stream');

class ModisNRTService {

    static async downloadCSV(url) {
        try {

            const response = await axios({url});

            const csvStream = Readable.from(response.data);

            csvStream
            .pipe(csv())
            .on('data', async (row) => {
                const record = new modisNRT(row);
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
            record.save();
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
}

module.exports = ModisNRTService;