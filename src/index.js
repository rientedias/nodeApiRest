const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json())//entendendo as requisiçoes enviada em json
app.use(bodyParser.urlencoded({ extended: false}));//decodando parametros em URL

require('./controllers/authController')(app);

app.listen(3000);//Startando na Porta 3000.