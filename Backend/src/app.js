const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//Settings
app.set('port', process.env.PORT || 3000)

const whitelist = ['http://localhost:3000']
const options = {
    origin: (origin, callback) => {
        if(whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('No permitido'))
        }
    }
}

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}));
app.use('/api/centrovv', require('./routes/centrovv.routes'));
app.use('/api/horario', require('./routes/horario.routes'));
app.use('/api/login', require('./routes/login.routes'));
app.use('/api/citas', require('./routes/cita.routes'));

module.exports = app