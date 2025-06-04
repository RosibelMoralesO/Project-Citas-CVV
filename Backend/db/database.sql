CREATE DATABASE db_citas;
USE db_citas;

CREATE TABLE `tblogin`(
`idLogin` TINYINT(2) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`usuario` VARCHAR(50) NOT NULL,
`password` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbtipousuario`(
`idTipoUsuario` TINYINT(1) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`descripción` VARCHAR(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbusuario`(
`idUsuario` INTEGER(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`nombre` VARCHAR(250) NOT NULL,
`email` VARCHAR(150) NOT NULL,
`razonSocial` VARCHAR(150) NULL,
`nomPerTramite` VARCHAR(250) NOT NULL,
`fk_idtipousuario` TINYINT(1) UNSIGNED NOT NULL,
CONSTRAINT `fk_idtipousuario` FOREIGN KEY (`fk_idtipousuario`) REFERENCES `tbtipousuario`(`idTipoUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbvehiculo`(
`idVehiculo` INTEGER(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`placa` VARCHAR(10) NOT NULL,
`numSerie` VARCHAR(30) NOT NULL,
`marca` VARCHAR(20) NOT NULL,
`modelo` VARCHAR(30) NOT NULL,
`anio` TINYINT(4) NOT NULL,
`combustible` VARCHAR(20) NOT NULL,
`color` VARCHAR(20) NOT NULL,
`entidad` VARCHAR(50) NOT NULL,
`numTarjCirc` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbtramite`(
`idTramite` TINYINT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`nombre` VARCHAR(150) NOT NULL,
`descripcion` VARCHAR(255) NOT NULL,
`url` VARCHAR(255) NOT NULL,
`informacion` VARCHAR(255) NOT NULL,
`estatus` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbrequisitos`(
`idRequisito` TINYINT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`descripcion` VARCHAR(150) NOT NULL,
`estatus` TINYINT(1) NOT NULL,
`nivel` TINYINT(1) NOT NULL,
`fk_idrtramite` TINYINT(3) UNSIGNED NOT NULL,
CONSTRAINT `fk_idrtramite` FOREIGN KEY (`fk_idrtramite`) REFERENCES `tbtramite`(`idTramite`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbcentrovv`(
`idCentroVV` TINYINT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`nombre` VARCHAR(150) NOT NULL,
`numCentroVV` TINYINT(3) NOT NULL,
`direccion` VARCHAR(200) NOT NULL,
`municipio` VARCHAR(50) NOT NULL,
`telefono` VARCHAR(10) NOT NULL,
`estatus` TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tblineascvv`(
`idLineasCVV` INTEGER(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
`descripcion` TINYINT(1) NOT NULL,
`estatus` TINYINT(1) NOT NULL ,
`fk_idlcentrovv` TINYINT(3) UNSIGNED NOT NULL,
CONSTRAINT `fk_idlcentrovv` FOREIGN KEY (`fk_idlcentrovv`) REFERENCES `tbcentroVV`(`idCentroVV`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbhorario`(
`horario` TIME NOT NULL,
`estatus` TINYINT(1) NOT NULL,
`fk_idhcentrovv` TINYINT(3) UNSIGNED NOT NULL,
`fk_idhlineascvv` INTEGER(5) UNSIGNED NOT NULL,
CONSTRAINT `fk_idhcentrovv` FOREIGN KEY (`fk_idhcentrovv`) REFERENCES `tbcentroVV`(`idCentroVV`),
CONSTRAINT `fk_idhlineascvv` FOREIGN KEY (`fk_idhlineascvv`) REFERENCES `tblineascvv`(`idLineasCVV`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;

CREATE TABLE `tbcita`(
`idCita` VARCHAR(16) PRIMARY KEY,
`fecha` DATE NOT NULL,
`hora` TIME NOT NULL,
`numModificacion` TINYINT(2) NOT NULL,
`duracion` TIME NOT NULL,
`estatus` TINYINT(1) NOT NULL,
`fk_idcusuario` INTEGER(10) UNSIGNED NOT NULL,
`fk_idcvehiculo` INTEGER(10) UNSIGNED NOT NULL,
`fk_idccentrovv` TINYINT(3) UNSIGNED NOT NULL,
`fk_idctramite` TINYINT(3) UNSIGNED NOT NULL,
`fk_idclineascvv` INTEGER(5) UNSIGNED NOT NULL,
CONSTRAINT `fk_idcusuario` FOREIGN KEY (`fk_idcusuario`) REFERENCES `tbusuario`(`idUsuario`),
CONSTRAINT `fk_idcvehiculo` FOREIGN KEY (`fk_idcvehiculo`) REFERENCES `tbvehiculo`(`idVehiculo`),
CONSTRAINT `fk_idccentrovv` FOREIGN KEY (`fk_idccentrovv`) REFERENCES `tbcentrovv`(`idCentroVV`),
CONSTRAINT `fk_idctramite` FOREIGN KEY (`fk_idctramite`) REFERENCES `tbtramite`(`idTramite`),
CONSTRAINT `fk_idclineascvv` FOREIGN KEY (`fk_idclineascvv`) REFERENCES `tblineasCVV`(`idLineasCVV`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;