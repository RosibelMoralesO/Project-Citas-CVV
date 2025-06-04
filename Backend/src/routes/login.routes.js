const { Router } = require('express')
const controladorLogin = require('../controllers/login.controller')
const router = Router()

//Routes
router.get('/', controladorLogin.obtenerLogin)

module.exports = router