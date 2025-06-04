const pool = require('../database')
const controladorCita = {}

controladorCita.obtenerCitas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tbcita');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener citas; ', error)
        res.status(500).json({ error: 'Error al consultar la base de datos' })
    }
};

controladorCita.buscarCita = async (req, res) => {
    try {
        const idCita = req.params.idCita;
        const [row] = await pool.query('SELECT * FROM tbcita WHERE idCita = ?', [idCita]);

        if (!row || row.length === 0) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }
        return res.status(200).json(row[0]);
    } catch (error) {
        console.error('Error al buscar la cita:', error);
        if (!res.headersSent) {
            return res.status(500).json({ mensaje: 'Error del servidor' });
        }
    }
};

controladorCita.agregarCitaCompleta = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      idCita,
      fecha,
      hora,
      numModificacion,
      duracion,
      estatus,
      usuario,
      vehiculo,
      idCentroVV,
      idTramite,
      idLineaCVV
    } = req.body;

    await connection.beginTransaction();

    // Insertar o recuperar Usuario
    const [usuarioExistente] = await connection.query(
      'SELECT idUsuario FROM tbusuario WHERE email = ?',
      [usuario.email]
    );

    let idUsuario;
    if (usuarioExistente.length > 0) {
      idUsuario = usuarioExistente[0].idUsuario;
    } else {
      const [resultUsuario] = await connection.query(
        `INSERT INTO tbusuario (nombre, email, razonSocial, nomPerTramite, fk_idtipousuario)
         VALUES (?, ?, ?, ?, ?)`,
        [usuario.nombre, usuario.email, usuario.razonSocial, usuario.nomPerTramite, usuario.fk_idtipousuario]
      );
      idUsuario = resultUsuario.insertId;
    }

    // Insertar o recuperar Vehículo
    const [vehiculoExistente] = await connection.query(
      'SELECT idVehiculo FROM tbvehiculo WHERE numSerie = ?',
      [vehiculo.numSerie]
    );

    let idVehiculo;
    if (vehiculoExistente.length > 0) {
      idVehiculo = vehiculoExistente[0].idVehiculo;
    } else {
      const [resultVehiculo] = await connection.query(
        `INSERT INTO tbvehiculo (placa, numSerie, marca, modelo, anio, combustible, color, entidad, numTarjCirc)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [vehiculo.placa, vehiculo.numSerie, vehiculo.marca, vehiculo.modelo, vehiculo.anio,
         vehiculo.combustible, vehiculo.color, vehiculo.entidad, vehiculo.numTarjCirc]
      );
      idVehiculo = resultVehiculo.insertId;
    }

    // Insertar Cita
    await connection.query(
      `INSERT INTO tbcita (
         idCita, fecha, hora, numModificacion, duracion, estatus,
         fk_idcusuario, fk_idcvehiculo, fk_idccentrovv, fk_idctramite, fk_idclineascvv
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idCita, fecha, hora, numModificacion, duracion, estatus,
       idUsuario, idVehiculo, idCentroVV, idTramite, idLineaCVV]
    );

    // Deshabilitar el horario correspondiente
    await connection.query(
      `UPDATE tbhorario
       SET estatus = 0
       WHERE horario = ? AND fk_idhcentrovv = ? AND fk_idhlineascvv = ?`,
      [hora, idCentroVV, idLineaCVV]
    );

    // Confirmar transacción
    await connection.commit();
    res.status(201).json({ mensaje: 'Cita agendada correctamente' });

  } catch (error) {
    await connection.rollback();
    console.error('Error al agendar cita:', error);
    res.status(500).json({ mensaje: 'Error al agendar cita' });
  } finally {
    connection.release();
  }
};

module.exports = controladorCita