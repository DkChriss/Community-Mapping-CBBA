const { Router } = require("express");
const ModisNRT = require('../core/controller/ModisNRT')

const router = Router();

router.get("/modis_nrt", ModisNRT.list);
router.post("/modis_nrt", ModisNRT.store);
router.put("/modis_nrt/:id", ModisNRT.updateStatus);

module.exports = router;