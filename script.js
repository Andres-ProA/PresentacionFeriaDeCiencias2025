// ===== CONFIGURACIÓN DE PROYECTOS =====
const projectUrls = {
    'fitlife': 'https://antocastillo.github.io/fitlife/',
    'turnero': 'turnero-estrella.html',
    'fitgo': 'fitgo.html',
    'eco-oceano': 'https://brunoquialvo.github.io/eco_oceano/',
    'greenup': 'greenup.html',
    'basurar': 'basurar.html'
};

// ===== VARIABLES GLOBALES =====
let currentProject = null;
let browserHistory = [];
let historyIndex = -1;

// ===== ELEMENTOS DEL DOM =====
const browserOverlay = document.getElementById('browserOverlay');
const projectFrame = document.getElementById('projectFrame');
const currentUrlSpan = document.getElementById('currentUrl');
const loadingSpinner = document.getElementById('loadingSpinner');

// ===== FUNCIONES DE NAVEGACIÓN =====

/**
 * Navega al proyecto seleccionado en el navegador integrado
 * @param {string} projectName - Nombre del proyecto
 */
function navigateToProject(projectName) {
    const url = projectUrls[projectName];
    if (!url) {
        console.error(`URL no encontrada para el proyecto: ${projectName}`);
        return;
    }

    // Efecto visual en la tarjeta
    const card = event.target.closest('.project-card');
    if (card) {
        card.style.transform = 'scale(0.95)';
        card.style.opacity = '0.7';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.opacity = '';
        }, 300);
    }

    // Abrir en navegador integrado
    openInBrowser(url, projectName);
}

/**
 * Abre una URL en el navegador integrado
 * @param {string} url - URL a abrir
 * @param {string} projectName - Nombre del proyecto
 */
function openInBrowser(url, projectName) {
    currentProject = projectName;
    
    // Mostrar overlay del navegador
    browserOverlay.classList.remove('hidden');
    
    // Mostrar spinner de carga
    showLoadingSpinner();
    
    // Actualizar URL en la barra
    updateUrlBar(url);
    
    // Agregar a historial
    addToHistory(url, projectName);
    
    // Cargar contenido en iframe
    loadProjectInFrame(url);
    
    // Prevenir scroll en el body
    document.body.style.overflow = 'hidden';
}

/**
 * Carga un proyecto en el iframe
 * @param {string} url - URL del proyecto
 */
function loadProjectInFrame(url) {
    projectFrame.src = url;
    
    // Listener para cuando termine de cargar
    projectFrame.onload = function() {
        hideLoadingSpinner();
    };
    
    // Listener para errores de carga
    projectFrame.onerror = function() {
        hideLoadingSpinner();
        showError('Error al cargar el proyecto');
    };
    
    // Timeout para ocultar spinner después de un tiempo
    setTimeout(() => {
        hideLoadingSpinner();
    }, 10000);
}

/**
 * Cierra el navegador integrado
 */
function closeBrowser() {
    browserOverlay.classList.add('hidden');
    projectFrame.src = '';
    currentProject = null;
    document.body.style.overflow = '';
    
    // Limpiar historial
    browserHistory = [];
    historyIndex = -1;
}

/**
 * Navega hacia atrás en el historial
 */
function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        const previousItem = browserHistory[historyIndex];
        
        updateUrlBar(previousItem.url);
        showLoadingSpinner();
        loadProjectInFrame(previousItem.url);
        currentProject = previousItem.project;
    } else {
        // Si no hay historial, cerrar navegador
        closeBrowser();
    }
}

/**
 * Recarga la página actual
 */
function refreshPage() {
    if (projectFrame.src) {
        showLoadingSpinner();
        projectFrame.src = projectFrame.src;
    }
}

// ===== FUNCIONES DE UI =====

/**
 * Actualiza la barra de URL
 * @param {string} url - URL a mostrar
 */
function updateUrlBar(url) {
    const displayUrl = url.length > 50 ? url.substring(0, 47) + '...' : url;
    currentUrlSpan.textContent = displayUrl;
}

/**
 * Muestra el spinner de carga
 */
function showLoadingSpinner() {
    loadingSpinner.style.display = 'flex';
}

/**
 * Oculta el spinner de carga
 */
function hideLoadingSpinner() {
    loadingSpinner.style.display = 'none';
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            color: #ff5252;
            backdrop-filter: blur(10px);
        ">
            <h3>Error de Carga</h3>
            <p>${message}</p>
            <button onclick="refreshPage()" style="
                background: rgba(244, 67, 54, 0.2);
                border: 1px solid rgba(244, 67, 54, 0.3);
                color: #ff5252;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                cursor: pointer;
                margin-top: 1rem;
            ">Reintentar</button>
        </div>
    `;
    
    document.querySelector('.browser-content').appendChild(errorDiv);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Agrega una entrada al historial del navegador
 * @param {string} url - URL
 * @param {string} project - Nombre del proyecto
 */
function addToHistory(url, project) {
    // Si estamos en medio del historial, eliminar entradas posteriores
    if (historyIndex < browserHistory.length - 1) {
        browserHistory = browserHistory.slice(0, historyIndex + 1);
    }
    
    // Agregar nueva entrada
    browserHistory.push({ url, project });
    historyIndex = browserHistory.length - 1;
}

// ===== FUNCIONES DE ACCESIBILIDAD =====

/**
 * Maneja eventos de teclado en las tarjetas para accesibilidad
 * @param {KeyboardEvent} event - Evento de teclado
 * @param {string} projectName - Nombre del proyecto
 */
function handleCardKeydown(event, projectName) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigateToProject(projectName);
    }
}

/**
 * Maneja eventos de teclado globales
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleGlobalKeydown(event) {
    // ESC para cerrar navegador
    if (event.key === 'Escape' && !browserOverlay.classList.contains('hidden')) {
        closeBrowser();
    }
    
    // Alt + Left Arrow para ir atrás
    if (event.altKey && event.key === 'ArrowLeft' && !browserOverlay.classList.contains('hidden')) {
        event.preventDefault();
        goBack();
    }
    
    // F5 o Ctrl+R para recargar
    if ((event.key === 'F5' || (event.ctrlKey && event.key === 'r')) && !browserOverlay.classList.contains('hidden')) {
        event.preventDefault();
        refreshPage();
    }
}

// ===== EFECTOS VISUALES =====

/**
 * Crea una partícula animada mejorada
 */
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Colores aleatorios para las partículas
    const colors = [
        'rgba(124, 127, 200, 0.6)',
        'rgba(255, 119, 198, 0.6)',
        'rgba(120, 219, 255, 0.6)'
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomSize = Math.random() * 3 + 2;
    
    particle.style.background = randomColor;
    particle.style.width = randomSize + 'px';
    particle.style.height = randomSize + 'px';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(particle);
    
    // Eliminar después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 8000);
}

/**
 * Inicializar efectos visuales mejorados
 */
function initializeVisualEffects() {
    // Crear partículas con intervalo variable
    const createParticleWithRandomInterval = () => {
        createParticle();
        const randomInterval = Math.random() * 1000 + 800;
        setTimeout(createParticleWithRandomInterval, randomInterval);
    };
    
    // Iniciar después de que la página esté cargada
    setTimeout(createParticleWithRandomInterval, 2000);
}

/**
 * Añade animación de entrada a las tarjetas cuando se cargan
 */
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.project-card');
    
    // Observer para animaciones cuando entran en el viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Añade efectos de hover mejorados con seguimiento 3D
 */
function enhanceInteractivity() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        // Efecto de seguimiento del mouse 3D
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Efectos de ripple al hacer clic
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Precarga imágenes importantes para mejorar performance
 */
function preloadImages() {
    const imageUrls = [
        './logos/escuela.png',
        './logos/feria.png',
        './logos/fitlife.png',
        './logos/turneroestrella.jpg',
        './logos/fitgo.png',
        './logos/ecooceano.png',
        './logos/greenup.png',
        './logos/basurar.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

/**
 * Detecta el soporte para características modernas del navegador
 */
function detectBrowserCapabilities() {
    const capabilities = {
        intersectionObserver: 'IntersectionObserver' in window,
        backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
        webGL: !!document.createElement('canvas').getContext('webgl'),
        touch: 'ontouchstart' in window
    };
    
    // Aplicar clases CSS basadas en las capacidades
    Object.keys(capabilities).forEach(capability => {
        if (capabilities[capability]) {
            document.body.classList.add(`supports-${capability}`);
        }
    });
    
    console.log('Capacidades del navegador detectadas:', capabilities);
}

/**
 * Maneja el redimensionamiento de ventana para responsividad
 */
function handleResize() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Ajustar iframe si está abierto
            if (!browserOverlay.classList.contains('hidden')) {
                // Re-ajustar el tamaño del iframe si es necesario
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    document.body.style.overflow = 'hidden';
                }
            }
            
            console.log('Ventana redimensionada - Layouts actualizados');
        }, 250);
    });
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====

/**
 * Configura todos los event listeners necesarios
 */
function setupEventListeners() {
    // Listener global para teclado
    document.addEventListener('keydown', handleGlobalKeydown);
    
    // Listener para clics fuera del navegador (cerrar modal)
    browserOverlay.addEventListener('click', (e) => {
        if (e.target === browserOverlay) {
            closeBrowser();
        }
    });
    
    // Prevenir cierre accidental al hacer clic en el contenedor
    document.querySelector('.browser-container').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Listener para cambios en el iframe
    window.addEventListener('message', (e) => {
        // Manejar mensajes del iframe si es necesario
        console.log('Mensaje recibido del iframe:', e.data);
    });
}

// ===== INICIALIZACIÓN PRINCIPAL =====

/**
 * Función principal de inicialización
 */
function initialize() {
    console.log('🚀 Feria de Ciencias 4to Año - Inicializando aplicación...');
    
    try {
        // Detectar capacidades del navegador
        detectBrowserCapabilities();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Inicializar efectos visuales
        initializeVisualEffects();
        
        // Inicializar animaciones de tarjetas
        initializeCardAnimations();
        
        // Mejorar interactividad
        enhanceInteractivity();
        
        // Configurar redimensionamiento
        handleResize();
        
        // Añadir clase para indicar que JS está activo
        document.body.classList.add('js-loaded');
        
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
}

// ===== EJECUCIÓN =====

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Precargar imágenes cuando la página esté completamente cargada
window.addEventListener('load', preloadImages);

// ===== ESTILOS CSS DINÁMICOS PARA EFECTOS =====

// Agregar estilos para el efecto ripple
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        background-color: rgba(255, 255, 255, 0.3);
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);