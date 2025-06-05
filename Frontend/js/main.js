document.addEventListener('DOMContentLoaded', function () {
  
  // Cargar headers y footer con manejo de errores
  const loadPartials = async () => {
    try {
      // Cargar header para usuarios
      const headerResponse = await fetch('/Frontend/partials/header.html');
      if (!headerResponse.ok) throw new Error('Header no encontrado');
      const headerData = await headerResponse.text();
      document.getElementById('header-container').innerHTML = headerData;

      // Cargar header para administración
      const headerAdminResponse = await fetch('/Frontend/partials/header_admin.html');
      if (!headerAdminResponse.ok) throw new Error('Header admin no encontrado');
      const headerAdminData = await headerAdminResponse.text();
      document.getElementById('header-container-admin').innerHTML = headerAdminData;

      // Cargar footer
      const footerResponse = await fetch('/Frontend/partials/footer.html');
      if (!footerResponse.ok) throw new Error('Footer no encontrado');
      const footerData = await footerResponse.text();
      document.getElementById('footer-container').innerHTML = footerData;
    
    } catch (error) {
      console.error('Error cargando partials:', error);
    };
  };

  loadPartials();

  // Elementos del DOM
  const centroAtencion = document.getElementById('centroAtencion');
  const fechaCita = document.getElementById('fechaCita');
  const horaCita = document.getElementById('horaCita');
  const placa = document.getElementById('placa');
  const numeroSerie = document.getElementById('numeroSerie');
  const tarjetaCirculacion = document.getElementById('tarjetaCirculacion');
  const modelo = document.getElementById('modelo');
  const marca = document.getElementById('marca');
  const anio = document.getElementById('anio');
  const tipoCombustible = document.getElementById('tipoCombustible');
  const nombrePropietario = document.getElementById('nombrePropietario');
  const nombreTramitante = document.getElementById('nombreTramitante');
  const email = document.getElementById('email');
  const voluntariaCheckbox = document.getElementById('voluntaria');
  const moralCheckbox = document.getElementById('moral');
  const cancelarCita = document.getElementById('cancelarCita');
  const confirmarCita = document.getElementById('confirmarCita');
  const estado = document.getElementById('estado');

  // Contenedores de pasos
  const paso2Container = document.getElementById('paso2-container');
  const paso3Container = document.getElementById('paso3-container');
  const paso4Container = document.getElementById('paso4-container');

  // Elementos de resumen
  const resumenCentro = document.getElementById('resumenCentro');
  const resumenFecha = document.getElementById('resumenFecha');
  const resumenHora = document.getElementById('resumenHora');

  // Modal de cancelación
  const cancelarModal = document.getElementById('cancelarModal');
  const cancelarNo = document.getElementById('cancelarNo');
  const cancelarSi = document.getElementById('cancelarSi');

  // Inicializar botón de confirmar como oculto y deshabilitado
  confirmarCita.classList.add('hidden');
  confirmarCita.disabled = true;

  // 1. Configuración inicial del acordeón (Paso 1 siempre visible)
  document.querySelector('[data-target="paso1"]').style.pointerEvents = 'none';
  document.getElementById('paso1').classList.remove('hidden');
  document.querySelector('[data-target="paso1"] svg').style.display = 'none';

  // 2. Generar horarios disponibles
  generarHorarios();

  // Configurar fechas permitidas (semana actual desde hoy, o próxima semana si es domingo)
  const hoy = new Date();
  const diaSemana = hoy.getDay(); // 0 (domingo) a 6 (sábado)

  // Si hoy es domingo (0), habilitamos la próxima semana completa
  if (diaSemana === 0) {
    const proxLunes = new Date(hoy);
    proxLunes.setDate(hoy.getDate() + 1); // Mañana es lunes

    const proxSabado = new Date(proxLunes);
    proxSabado.setDate(proxLunes.getDate() + 5);

    fechaCita.min = proxLunes.toISOString().split('T')[0];
    fechaCita.max = proxSabado.toISOString().split('T')[0];
  } else {
    // Para otros días, habilitamos desde hoy hasta el sábado de esta semana
    const lunesActual = new Date(hoy);
    lunesActual.setDate(hoy.getDate() - diaSemana + 1); // Lunes de esta semana

    const sabadoActual = new Date(lunesActual);
    sabadoActual.setDate(lunesActual.getDate() + 5); // Sábado de esta semana

    // Establecer mínimo como hoy (no días pasados)
    fechaCita.min = hoy.toISOString().split('T')[0];
    fechaCita.max = sabadoActual.toISOString().split('T')[0];
  }

  // Días inhábiles
  const diasInhabiles = [];

  // Función para deshabilitar días inhábiles en el input de fecha
  function configurarDiasInhabiles() {
    fechaCita.addEventListener('input', function () {
      const fechaSeleccionada = this.value;
      if (diasInhabiles.includes(fechaSeleccionada)) {
        alert('Este día no está disponible para agendar citas. Por favor seleccione otra fecha.');
        this.value = '';
      }
    });
  }

  // Llamar a la función para configurar días inhábiles
  configurarDiasInhabiles();

  // Event listeners para los acordeones (excepto paso 1)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    if (header.getAttribute('data-target') !== 'paso1') {
      header.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        const icon = this.querySelector('svg');
        targetContent.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
      });
    }
  });

  // Validación paso a paso
  centroAtencion.addEventListener('change', function () {
    if (this.value !== "0") {
      paso2Container.classList.remove('hidden');
      document.getElementById('paso2').classList.remove('hidden');
      document.querySelector('[data-target="paso2"] svg').classList.remove('rotate-180');

      resumenCentro.textContent = this.options[this.selectedIndex].text;
      resumenCentro.classList.remove('text-[#808080]');
      resumenCentro.classList.add('text-[#3C9B85]');
    } else {
      paso2Container.classList.add('hidden');
      paso3Container.classList.add('hidden');
      paso4Container.classList.add('hidden');
      resumenCentro.textContent = "No seleccionado";
      resumenCentro.classList.remove('text-[#3C9B85]');
      resumenCentro.classList.add('text-[#808080]');
    }
  });

  fechaCita.addEventListener('change', updateResumenFecha);
  horaCita.addEventListener('change', updateResumenFecha);

  function updateResumenFecha() {
    if (fechaCita.value && horaCita.value) {
      const fecha = new Date(fechaCita.value);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const fechaFormateada = fecha.toLocaleDateString('es-ES', options);
      const horaFormateada = horaCita.options[horaCita.selectedIndex].text;

      resumenFecha.textContent = fechaFormateada;
      resumenHora.textContent = horaFormateada;

      resumenFecha.classList.remove('text-[#808080]');
      resumenHora.classList.remove('text-[#808080]');
      resumenFecha.classList.add('text-[#3C9B85]');
      resumenHora.classList.add('text-[#3C9B85]');

      paso3Container.classList.remove('hidden');
      document.getElementById('paso3').classList.remove('hidden');
      document.querySelector('[data-target="paso3"] svg').classList.remove('rotate-180');
    } else {
      paso3Container.classList.add('hidden');
      paso4Container.classList.add('hidden');

      if (!fechaCita.value) {
        resumenFecha.textContent = "No seleccionado";
        resumenFecha.classList.remove('text-[#3C9B85]');
        resumenFecha.classList.add('text-[#808080]');
      }

      if (!horaCita.value) {
        resumenHora.textContent = "No seleccionado";
        resumenHora.classList.remove('text-[#3C9B85]');
        resumenHora.classList.add('text-[#808080]');
      }
    }
  }

  // Validación paso 3 (datos del vehículo)
  const camposVehiculo = [placa, numeroSerie, tarjetaCirculacion, modelo, marca, anio, tipoCombustible];
  camposVehiculo.forEach(campo => {
    campo.addEventListener('change', validarPaso3);
    campo.addEventListener('input', validarPaso3);
  });

  // Validar solo números y máximo 4 dígitos para año
  anio.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length > 4) {
      this.value = this.value.slice(0, 4);
    }
  });

  function validarPaso3() {
    const todosLlenos = camposVehiculo.every(campo => {
      if (campo === anio) {
        return campo.value.trim() !== '' && campo.value.length === 4;
      }
      return campo.value.trim() !== '';
    });

    if (todosLlenos) {
      paso4Container.classList.remove('hidden');
      document.getElementById('paso4').classList.remove('hidden');
      document.querySelector('[data-target="paso4"] svg').classList.remove('rotate-180');
      validarPaso4(); // Validar también el paso 4 por si ya hay datos
    } else {
      paso4Container.classList.add('hidden');
      confirmarCita.classList.add('hidden');
      confirmarCita.disabled = true;
    }
  }

  // Validación paso 4 (datos de contacto)
  const camposContacto = [nombrePropietario, email];
  camposContacto.forEach(campo => {
    campo.addEventListener('change', validarPaso4);
    campo.addEventListener('input', validarPaso4);
  });

  function validarPaso4() {
    const todosLlenos = camposContacto.every(campo => campo.value.trim() !== '');
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    const estadoValido = voluntariaCheckbox.checked ? estado.value !== 'Puebla' : true;

    if (todosLlenos && emailValido && estadoValido) {
      confirmarCita.disabled = false;
      confirmarCita.classList.remove('hidden');
    } else {
      confirmarCita.disabled = true;
      confirmarCita.classList.add('hidden');
    }
  }

  // Generar horarios disponibles cada 8 minutos
  function generarHorarios() {
    const select = document.getElementById('horaCita');
    select.innerHTML = '<option value="">Seleccionar horario</option>';

    const horaInicio = 8; // 8 AM
    const horaFin = 20; // 8 PM

    for (let h = horaInicio; h <= horaFin; h++) {
      for (let m = 0; m < 60; m += 8) {
        if (h === horaFin && m > 0) break;

        const hora = h.toString().padStart(2, '0');
        const minuto = m.toString().padStart(2, '0');
        const horaFormato12 = h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'PM' : 'AM';

        const option = document.createElement('option');
        option.value = `${hora}:${minuto}`;
        option.textContent = `${horaFormato12}:${minuto} ${ampm}`;
        select.appendChild(option);
      }
    }
  }

  // Verificación voluntaria (cambiar estado)
  voluntariaCheckbox.addEventListener('change', function() {
    estado.disabled = !this.checked;
    
    if (!this.checked) {
      // Forzar Puebla cuando no es voluntaria
      estado.value = 'Puebla';
    }
    validarPaso4(); // Revalidar el formulario
  });

  // Inicializar estado del campo estado
  estado.disabled = true;
  estado.value = 'Puebla';

  // Persona moral (cambiar placeholder)
  moralCheckbox.addEventListener('change', function() {
    const placeholder = this.checked ? "Razón social *" : "Nombre del Propietario *";
    nombrePropietario.placeholder = placeholder;
    
    // También actualizar el atributo placeholder directamente
    nombrePropietario.setAttribute('placeholder', placeholder);
  });

  // Modal de cancelación
  cancelarCita.addEventListener('click', function(e) {
    e.preventDefault();
    cancelarModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  cancelarNo.addEventListener('click', function() {
    cancelarModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  });

  cancelarSi.addEventListener('click', function() {
    cancelarModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    window.location.href = '/Frontend/views/index.html';
  });

  cancelarModal.addEventListener('click', function(e) {
    if (e.target === cancelarModal) {
      cancelarModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
});