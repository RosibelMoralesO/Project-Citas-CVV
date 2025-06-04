const pool = require('../database')
const controladorCentrovv = {}

controladorCentrovv.obtenerCentrovv = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tbcentrovv');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener centros:', error); 
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
};

module.exports = controladorCentrovv