// CONFIGURACIÓN INICIAL
const PHONE_NUMBER = "7841068386";
let reparacionesCount = 0;
let configuracion = {
    notificaciones: true,
    sonido: false,
    idioma: "es",
    tema: "azul",
    reportes: "semanal"
};

// BASE DE DATOS DEL CHATBOT
const chatbotRespuestas = {
    "hola": ["¡Hola! ¿En qué puedo ayudarte hoy?", "¡Hola! Soy tu asistente técnico. ¿Qué problema tienes?"],
    "no enciende": [
        "Problema: Laptop no enciende. Posibles soluciones:\n1. Verifica que el cargador esté conectado\n2. Intenta un reset de energía (quitar batería y mantener power 30s)\n3. Prueba con otro cargador",
        "Si no enciende, podría ser:\n• Batería descargada\n• Problema de fuente\n• Fallo en placa madre"
    ],
    "lentitud": [
        "Para lentitud:\n1. Limpia archivos temporales\n2. Aumenta memoria RAM\n3. Cambia a SSD\n4. Desinstala programas no usados",
        "Limpieza de sistema recomendada. ¿Quieres que te guíe paso a paso?"
    ],
    "pantalla azul": [
        "Pantalla azul indica error crítico:\n1. Anota el código de error\n2. Desinstala drivers recientes\n3. Ejecuta Windows Memory Diagnostic\n4. Actualiza BIOS",
        "Error de sistema. Necesito el código exacto para ayudarte mejor."
    ],
    "sobrecalentamiento": [
        "Sobrecalentamiento:\n1. Limpia ventiladores\n2. Cambia pasta térmica\n3. Usa base refrigeradora\n4. Evita usar en superficies blandas",
        "Podría necesitar limpieza interna. ¿Hace cuánto no la limpias?"
    ],
    "batería": [
        "Problemas de batería:\n1. Calibra la batería\n2. Revisa estado con diagnóstico\n3. Considera reemplazo si tiene más de 2 años",
        "Batería agotada. Vida útil típica: 2-3 años con uso normal."
    ],
    "wifi": [
        "Problemas de WiFi:\n1. Reinicia router y laptop\n2. Actualiza drivers de red\n3. Verifica si funciona en otros dispositivos\n4. Cambia canal WiFi",
        "Podría ser driver desactualizado. ¿Qué sistema operativo usas?"
    ],
    "virus": [
        "Posible virus:\n1. Escaneo completo con antivirus\n2. Usa modo seguro\n3. Restaura sistema a punto anterior\n4. Considera formateo si es grave",
        "Recomiendo Malwarebytes o Windows Defender para escaneo."
    ],
    "gracias": ["¡De nada! ¿Algo más en lo que pueda ayudar?", "¡Gracias a ti! Recuerda mantener actualizado tu sistema."],
    "default": ["Entiendo. ¿Podrías darme más detalles del problema?", "Voy a necesitar más información para ayudarte mejor. ¿Qué modelo es tu laptop?"]
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    // Configurar toastr
    toastr.options = {
        positionClass: "toast-top-right",
        progressBar: true,
        timeOut: 3000
    };
    
    // Actualizar número de teléfono
    document.getElementById('phone-number').textContent = PHONE_NUMBER;
    
    // Configurar WhatsApp
    document.getElementById('whatsapp-btn').href = `https://wa.me/${PHONE_NUMBER}`;
    
    // Cargar configuración guardada
    cargarConfiguracion();
    
    // Inicializar eventos
    inicializarEventos();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        toastr.success('¡Sistema cargado correctamente!');
        actualizarEstadisticas();
    }, 1000);
});

// INICIALIZAR TODOS LOS EVENTOS
function inicializarEventos() {
    // Botones principales
    document.getElementById('diagnostico').addEventListener('click', () => abrirModal('diagnostico-modal'));
    document.getElementById('registrar').addEventListener('click', () => abrirModal('registro-modal'));
    document.getElementById('asistente').addEventListener('click', () => abrirModal('chatbot-modal'));
    document.getElementById('configuracion').addEventListener('click', () => abrirModal('config-modal'));
    
    // Historial
    document.getElementById('historial').addEventListener('click', mostrarHistorial);
    
    // Contacto
    document.getElementById('contacto').addEventListener('click', mostrarContacto);
    
    // Acciones rápidas
    document.getElementById('llamar').addEventListener('click', hacerLlamada);
    document.getElementById('ayuda').addEventListener('click', enviarSMS);
    
    // Chatbot
    document.getElementById('send-btn').addEventListener('click', enviarMensajeChatbot);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarMensajeChatbot();
    });
    
    // Formulario de registro
    document.getElementById('registro-form').addEventListener('submit', registrarEquipo);
    
    // Prioridad buttons
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('prioridad').value = this.dataset.priority;
        });
    });
    
    // Configuración
    document.getElementById('guardar-config').addEventListener('click', guardarConfiguracion);
    
    // Tema buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Diagnóstico
    document.getElementById('iniciar-diagnostico').addEventListener('click', iniciarDiagnostico);
    
    // Cerrar modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            cerrarModal(modalId);
        });
    });
    
    // Cerrar modal al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal(this.id);
            }
        });
    });
}

// FUNCIONES DE MODALES
function abrirModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// LLAMADA TELEFÓNICA REAL
function hacerLlamada() {
    toastr.info(`Llamando al ${PHONE_NUMBER}...`);
    
    // En dispositivo móvil abrirá el marcador
    // En web mostrará mensaje
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = `tel:${PHONE_NUMBER}`;
    } else {
        toastr.warning('En computadora, por favor marca manualmente: ' + PHONE_NUMBER);
    }
}

// ENVIAR SMS DE EMERGENCIA
function enviarSMS() {
    const mensaje = encodeURIComponent("🚨 ¡AYUDA URGENTE! Necesito asistencia técnica inmediata. Por favor contáctame.");
    
    toastr.info('Enviando SMS de emergencia...');
    
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = `sms:${PHONE_NUMBER}?body=${mensaje}`;
    } else {
        toastr.warning('En computadora, por favor envía un WhatsApp o llama.');
        window.open(`https://wa.me/${PHONE_NUMBER}?text=${mensaje}`, '_blank');
    }
}

// CHATBOT FUNCIONAL
function enviarMensajeChatbot() {
    const input = document.getElementById('user-input');
    const mensaje = input.value.trim().toLowerCase();
    
    if (!mensaje) return;
    
    // Agregar mensaje del usuario
    agregarMensajeChat(mensaje, 'user');
    input.value = '';
    
    // Buscar respuesta
    let respuesta = "No entiendo completamente. ¿Podrías reformular?";
    
    for (const [keyword, respuestas] of Object.entries(chatbotRespuestas)) {
        if (mensaje.includes(keyword)) {
            respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
            break;
        }
    }
    
    if (respuesta === "No entiendo completamente. ¿Podrías reformular?") {
        respuesta = chatbotRespuestas.default[Math.floor(Math.random() * chatbotRespuestas.default.length)];
    }
    
    // Respuesta con delay (simula procesamiento)
    setTimeout(() => {
        agregarMensajeChat(respuesta, 'bot');
    }, 1000);
}

function agregarMensajeChat(texto, tipo) {
    const chatMessages = document.getElementById('chat-messages');
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `message ${tipo}`;
    mensajeDiv.innerHTML = `<strong>${tipo === 'bot' ? 'Asistente:' : 'Tú:'}</strong> ${texto.replace(/\n/g, '<br>')}`;
    chatMessages.appendChild(mensajeDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// REGISTRAR EQUIPO CON ANÁLISIS
function registrarEquipo(e) {
    e.preventDefault();
    
    const cliente = document.getElementById('cliente').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const problema = document.getElementById('problema').value;
    const prioridad = document.getElementById('prioridad').value;
    
    // Simular análisis
    const resultadoDiv = document.getElementById('analisis-resultado');
    resultadoDiv.innerHTML = `
        <h4><i class="fas fa-spinner fa-spin"></i> Analizando equipo...</h4>
        <p>Por favor espera...</p>
    `;
    
    setTimeout(() => {
        const diagnosticos = [
            "Problema de software detectado",
            "Hardware en buen estado",
            "Necesita limpieza interna",
            "Driver desactualizado",
            "Batería con desgaste",
            "Sistema operativo estable"
        ];
        
        const soluciones = [
            "Reinstalación de sistema recomendada",
            "Limpieza de ventiladores necesaria",
            "Actualización de drivers requerida",
            "Cambio de pasta térmica sugerido",
            "Aumento de memoria RAM recomendado"
        ];
        
        const diagnosticoRandom = diagnosticos[Math.floor(Math.random() * diagnosticos.length)];
        const solucionRandom = soluciones[Math.floor(Math.random() * soluciones.length)];
        const tiempoEstimado = prioridad === 'alta' ? '2-4 horas' : prioridad === 'media' ? '1-2 días' : '3-5 días';
        const costoEstimado = prioridad === 'alta' ? '$80-120' : prioridad === 'media' ? '$50-80' : '$30-50';
        
        resultadoDiv.innerHTML = `
            <h4><i class="fas fa-check-circle" style="color:green"></i> Análisis Completado</h4>
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>Equipo:</strong> ${marca} ${modelo}</p>
            <p><strong>Diagnóstico:</strong> ${diagnosticoRandom}</p>
            <p><strong>Solución:</strong> ${solucionRandom}</p>
            <p><strong>Prioridad:</strong> <span style="color:${prioridad === 'alta' ? 'red' : prioridad === 'media' ? 'orange' : 'green'}">${prioridad.toUpperCase()}</span></p>
            <p><strong>Tiempo estimado:</strong> ${tiempoEstimado}</p>
            <p><strong>Costo aproximado:</strong> ${costoEstimado}</p>
            <p><strong>Estado:</strong> <span style="color:blue">Registrado y en espera</span></p>
        `;
        
        reparacionesCount++;
        actualizarEstadisticas();
        toastr.success('✅ Equipo registrado correctamente');
        
        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
            document.getElementById('registro-form').reset();
            resultadoDiv.innerHTML = '';
            document.querySelector('.priority-btn[data-priority="alta"]').classList.add('active');
            document.getElementById('prioridad').value = 'alta';
        }, 3000);
        
    }, 2000);
}

// CONFIGURACIÓN INTERACTIVA
function cargarConfiguracion() {
    const saved = localStorage.getItem('laptop-config');
    if (saved) {
        configuracion = JSON.parse(saved);
        
        // Aplicar configuración
        document.getElementById('notificaciones').checked = configuracion.notificaciones;
        document.getElementById('sonido').checked = configuracion.sonido;
        document.getElementById('idioma').value = configuracion.idioma;
        document.getElementById('reportes').value = configuracion.reportes;
        
        // Aplicar tema
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === configuracion.tema) {
                btn.classList.add('active');
            }
        });
    }
}

function guardarConfiguracion() {
    configuracion.notificaciones = document.getElementById('notificaciones').checked;
    configuracion.sonido = document.getElementById('sonido').checked;
    configuracion.idioma = document.getElementById('idioma').value;
    configuracion.reportes = document.getElementById('reportes').value;
    
    // Obtener tema activo
    const temaActivo = document.querySelector('.theme-btn.active');
    if (temaActivo) {
        configuracion.tema = temaActivo.dataset.theme;
        aplicarTema(configuracion.tema);
    }
    
    localStorage.setItem('laptop-config', JSON.stringify(configuracion));
    toastr.success('✅ Configuración guardada');
    
    setTimeout(() => {
        cerrarModal('config-modal');
    }, 1500);
}

function aplicarTema(tema) {
    const body = document.body;
    
    switch(tema) {
        case 'oscuro':
            body.style.background = 'linear-gradient(135deg, #121212, #333)';
            break;
        case 'claro':
            body.style.background = 'linear-gradient(135deg, #f5f5f5, #ddd)';
            break;
        default:
            body.style.background = 'linear-gradient(135deg, #1a2980, #26d0ce)';
    }
}

// DIAGNÓSTICO DEL SISTEMA
function iniciarDiagnostico() {
    const progressFill = document.getElementById('progress-fill');
    const statusText = document.getElementById('diagnostico-status');
    const resultadosDiv = document.getElementById('diagnostico-resultados');
    const boton = document.getElementById('iniciar-diagnostico');
    
    boton.disabled = true;
    boton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando...';
    resultadosDiv.innerHTML = '';
    
    const pasos = [
        {porcentaje: 10, texto: "Verificando hardware..."},
        {porcentaje: 25, texto: "Escaneando memoria RAM..."},
        {porcentaje: 40, texto: "Analizando disco duro..."},
        {porcentaje: 60, texto: "Revisando sistema operativo..."},
        {porcentaje: 80, texto: "Comprobando drivers..."},
        {porcentaje: 100, texto: "Generando reporte..."}
    ];
    
    let pasoActual = 0;
    
    function ejecutarPaso() {
        if (pasoActual >= pasos.length) {
            // Diagnóstico completado
            const problemas = [
                "✅ Sistema estable - No se encontraron problemas críticos",
                "⚠️ Alerta: Disco duro al 85% de capacidad",
                "⚠️ Alerta: Memoria RAM utilizada al 90%",
                "✅ Todos los drivers actualizados",
                "✅ Temperatura del sistema: Normal",
                "✅ Conexiones de red: Estables"
            ];
            
            resultadosDiv.innerHTML = `
                <h4><i class="fas fa-clipboard-check"></i> Resultados del Diagnóstico</h4>
                ${problemas.map(p => `<p>${p}</p>`).join('')}
                <p><strong>Recomendación:</strong> Realizar mantenimiento preventivo en los próximos 30 días.</p>
            `;
            
            statusText.textContent = "Diagnóstico completado";
            boton.disabled = false;
            boton.innerHTML = '<i class="fas fa-redo"></i> Realizar nuevo diagnóstico';
            
            toastr.success('Diagnóstico completado exitosamente');
            return;
        }
        
        const paso = pasos[pasoActual];
        progressFill.style.width = paso.porcentaje + '%';
        progressFill.textContent = paso.porcentaje + '%';
        statusText.textContent = paso.texto;
        
        pasoActual++;
        setTimeout(ejecutarPaso, 800);
    }
    
    ejecutarPaso();
}

// HISTORIAL
function mostrarHistorial() {
    const equipos = [
        {cliente: "Carlos Rodríguez", equipo: "Dell Inspiron", fecha: "15/10/2023", estado: "Completado"},
        {cliente: "María González", equipo: "MacBook Pro", fecha: "14/10/2023", estado: "En proceso"},
        {cliente: "Luis Martínez", equipo: "HP Pavilion", fecha: "13/10/2023", estado: "Completado"},
        {cliente: "Ana López", equipo: "Lenovo ThinkPad", fecha: "12/10/2023", estado: "Entregado"},
        {cliente: "Pedro Sánchez", equipo: "Asus ZenBook", fecha: "11/10/2023", estado: "Completado"}
    ];
    
    let historialHTML = `<h3><i class="fas fa-history"></i> Historial de Reparaciones</h3>`;
    
    equipos.forEach(equipo => {
        historialHTML += `
            <div class="historial-item">
                <p><strong>${equipo.cliente}</strong> - ${equipo.equipo}</p>
                <p>Fecha: ${equipo.fecha} | Estado: <span style="color:${equipo.estado === 'Completado' ? 'green' : 'orange'}">${equipo.estado}</span></p>
            </div>
        `;
    });
    
    toastr.info('Mostrando historial...');
    abrirModalConContenido('Historial', historialHTML);
}

// CONTACTO
function mostrarContacto() {
    const contactoHTML = `
        <h3><i class="fas fa-address-card"></i> Información de Contacto</h3>
        <p><strong><i class="fas fa-user"></i> Técnico:</strong> Angel Gabriel Vicente Pérez</p>
        <p><strong><i class="fas fa-phone"></i> Teléfono:</strong> ${PHONE_NUMBER}</p>
        <p><strong><i class="fas fa-envelope"></i> Email:</strong> angel@laptopinstructor.com</p>
        <p><strong><i class="fas fa-map-marker-alt"></i> Dirección:</strong> Calle Técnica #123, Centro</p>
        <p><strong><i class="fas fa-clock"></i> Horario:</strong> Lunes a Viernes: 8:00 AM - 6:00 PM</p>
        <p><strong><i class="fas fa-calendar"></i> Emergencias:</strong> 24/7 vía WhatsApp</p>
        
        <div class="redes-sociales">
            <button class="btn-action" onclick="window.open('https://facebook.com', '_blank')">
                <i class="fab fa-facebook"></i> Facebook
            </button>
            <button class="btn-action" onclick="window.open('https://instagram.com', '_blank')">
                <i class="fab fa-instagram"></i> Instagram
            </button>
        </div>
    `;
    
    abrirModalConContenido('Contacto', contactoHTML);
}

function abrirModalConContenido(titulo, contenido) {
    // Crear modal temporal
    const modalHTML = `
        <div class="modal" id="temp-modal" style="display:flex">
            <div class="modal-content">
                <span class="close-modal" onclick="document.getElementById('temp-modal').style.display='none'">&times;</span>
                <h3>${titulo}</h3>
                ${contenido}
            </div>
        </div>
    `;
    
    // Remover modal anterior si existe
    const modalAnterior = document.getElementById('temp-modal');
    if (modalAnterior) modalAnterior.remove();
    
    // Agregar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ESTADÍSTICAS
function actualizarEstadisticas() {
    document.getElementById('reparaciones-hoy').textContent = reparacionesCount;
    document.getElementById('satisfaccion').textContent = '98%';
    document.getElementById('tiempo-promedio').textContent = '45 min';
}