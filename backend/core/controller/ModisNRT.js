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
        const record = service.store(req.body);
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
}

module.exports = ModisNRTController