const { Router } = require("express");
const ModisNRT = require('../core/controller/ModisNRT')

const router = Router();

router.get("/modis_nrt", ModisNRT.list)

module.exports = router;