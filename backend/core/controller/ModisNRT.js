const service = require('../service/ModisNRT');
const response = require('../handler/JsonResponse')

class ModisNRTController {

    static async list(req, res) {
        try {
            const recordList = await service.list(req.body);
            return response.successResponse(
                res,
                200,
                "Success",
                recordList
            );

        } catch(error) {
            console.error(error)
        }
    }


    static async store(req, res) {
     try {
        const record = await service.store(req.body);
        return response.successResponse(
            res,
            201,
            "The record has been created",
            record
        );
     } catch(error) {
        console.error(error);
     }   
    }

    static async updateStatus(req,res) {
        try {
            
            const record = await service.updateStatus(req.params.id);

            return response.successResponse(
                res,
                200,
                "The record has been updated",
                record
            );

        } catch(error) {
            console.error(error)
        }
    }

}

module.exports = ModisNRTController