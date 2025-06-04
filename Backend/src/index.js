const pool = require('./database')
const app = require('./app.js')

app.listen(app.get('port'), ()=>{
    console.log('Server on port 3000')
})