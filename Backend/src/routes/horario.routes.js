const { Router } = require('express')
const router = Router()
const controladorHorario = require('../controllers/horario.controller')

// Routes
router.get('/', controladorHorario.obtenerHorario);
router.post('/habilitar', controladorHorario.habilitarHorario);

module.exports = router