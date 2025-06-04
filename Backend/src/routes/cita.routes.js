const { Router } = require('express')
const controladorCita = require('../controllers/cita.controller')
const router = Router()

// Routes
router.get('/', controladorCita.obtenerCitas)
router.get('/:idCita', controladorCita.buscarCita)
router.post('/', controladorCita.agregarCitaCompleta)

module.exports = router