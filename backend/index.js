const express = require('express');
const morgan = require('morgan');
const service = require('../backend/core/service/ModisNRT');
const cors = require('cors');
const db = require('./config/mongoConfig')
const app = express();

//ROUTER
const router = require("./routes/index")

app.use(cors())
//Config
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

db();
//service.downloadCSV("https://firms.modaps.eosdis.nasa.gov/api/country/csv/f3b08242c742d92cac5e2a660c4e8eaf/MODIS_NRT/BOL/1")


app.use("/api/v1", router)


app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});