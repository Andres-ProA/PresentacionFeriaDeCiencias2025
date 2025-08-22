// URLs de los proyectos
const projectUrls = {
    'fitlife': 'https://antocastillo.github.io/fitlife/',
    'turnero': 'turnero-estrella.html',
    'fitgo': 'fitgo.html',
    'eco-oceano': 'https://brunoquialvo.github.io/eco_oceano/',
    'greenup': 'greenup.html',
    'basurar': 'basurar.html'
};

/**
 * Navega al proyecto seleccionado
 * @param {string} projectName - Nombre del proyecto
 */
function navigateToProject(projectName) {
    // Mensaje temporal mientras no existen las páginas
    //alert(`Navegando a ${projectName.toUpperCase()}...\nPróximamente disponible en: ${projectUrls[projectName]}`);
    
    // Cuando tengas las páginas, descomenta esta línea y comenta el alert
    window.location.href = projectUrls[projectName];
}

/**
 * Crea una partícula animada que cae desde arriba
 */
function createParticle() {
    const particle = document.createElement('div');
    
    // Configurar estilos de la partícula
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(255,255,255,0.6)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '-10px';
    particle.style.pointerEvents = 'none';
    particle.style.animation = 'fall 8s linear forwards';
    
    // Añadir al DOM
    document.body.appendChild(particle);
    
    // Eliminar después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 8000);
}

/**
 * Inicializar efectos visuales
 */
function initializeVisualEffects() {
    // Crear partículas cada cierto tiempo
    setInterval(createParticle, 500);
}

/**
 * Configurar event listeners y inicializar la aplicación
 */
function initialize() {
    // Inicializar efectos visuales
    initializeVisualEffects();
    
    console.log('Feria de Ciencias 4to Año - Aplicación inicializada');
}

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initialize);