const pool = require('../database')
const controladorHorario = {}
const moment = require('moment');

controladorHorario.habilitarHorario = async (req, res) => {
  try {
    const { horario, fk_idhcentrovv, fk_idhlineascvv, estatus } = req.body;
    if (!horario || !fk_idhcentrovv || !fk_idhlineascvv || estatus === undefined) {
      return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    const [result] = await pool.query(
      `UPDATE tbhorario SET estatus = ? 
       WHERE horario = ? AND fk_idhcentrovv = ? AND fk_idhlineascvv = ?`,
      [estatus, horario, fk_idhcentrovv, fk_idhlineascvv]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Horario no encontrado' });
    }

    res.json({ mensaje: `Horario ${estatus === 1 ? 'habilitado' : 'deshabilitado'} correctamente` });
  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


controladorHorario.obtenerHorario = async (req, res) => {
    const { fecha, centro, linea } = req.body;
    console.log('Fecha:', fecha, 'Centro:', centro, 'Linea:', linea);
    if (!fecha || !centro || !linea) {
        return res.status(400).json({ error: 'Faltan parámetros: fecha, centro y línea son requeridos' });
    }

    try {
        // Obtener día de la semana: 0 (Domingo) a 6 (Sábado)
        const diaSemana = moment(fecha).day();

        // Consultar horarios activos para centro y línea
        const sql = `
            SELECT horario FROM tbhorario
            WHERE fk_idhcentrovv = ? AND fk_idhlineascvv = ? AND estatus = 1
        `;
        const [rows] = await pool.query(sql, [centro, linea]);

        // Filtrar horarios según reglas:
        let horariosValidos = [];

        rows.forEach(({ horario }) => {
            const hora = moment(horario, "HH:mm:ss");
            let horaValida = false;

            if (diaSemana >= 1 && diaSemana <= 5) { // Lun-Vie
                if (centro === 30 || centro === 32) {
                    // horario entre 8:00 y 18:00
                    horaValida = hora.isBetween(moment("08:00", "HH:mm"), moment("18:00", "HH:mm"), null, '[)');
                } else {
                    // horario entre 8:00 y 20:00
                    horaValida = hora.isBetween(moment("08:00", "HH:mm"), moment("20:00", "HH:mm"), null, '[)');
                }
            } else if (diaSemana === 6) { // Sábado
                // horario entre 8:00 y 14:00
                horaValida = hora.isBetween(moment("08:00", "HH:mm"), moment("14:00", "HH:mm"), null, '[)');
            } else {
                // Domingo, no hay horarios válidos
                horaValida = false;
            }

            if (horaValida) {
                horariosValidos.push(horario);
            }
        });

        res.json({ horarios: horariosValidos });

    } catch (error) {
        console.error('Error al obtener horarios:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
};

module.exports = controladorHorario;