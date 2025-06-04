const pool = require('../database')
const controladorLogin = {}

controladorLogin.obtenerLogin = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tblogin')
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener login: ', error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
};

module.exports = controladorLogin