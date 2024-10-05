const express = require('express');
const morgan = require('morgan');


const app = express();

//Config
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});