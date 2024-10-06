const service = require('../service/User')
const response = require('../handler/JsonResponse');

class UserController {

    static async store(req,res){
        try {

            const user = await service.store(req.body);

            return response.successResponse(
                res,
                201,
                "User has been created",
                user
            )

        } catch(error) {
            console.log(error)
        }
    }
}

module.exports = UserController