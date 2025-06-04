const { Router } = require('express')
const router = Router()
const controladorCentrovv = require("../controllers/centrovv.controller")

// Routes
router.get('/', controladorCentrovv.obtenerCentrovv)

module.exports = router