// --- Funciones de control de ventanas ---

/**
 * Abre la ventana correspondiente a un ID.
 * @param {string} id - El sufijo del ID de la ventana (ej: 'about').
 */
function openWindow(id) {
    const windowEl = document.getElementById(`window-${id}`);
    windowEl.style.display = 'block';
    // Mueve la ventana al frente
    bringToFront(windowEl);
}

/**
 * Cierra la ventana.
 * @param {string} id - El sufijo del ID de la ventana.
 */
function closeWindow(id) {
    document.getElementById(`window-${id}`).style.display = 'none';
}

/**
 * Simulación de minimizar (la oculta por simplicidad)
 * @param {string} id - El sufijo del ID de la ventana.
 */
function minimizeWindow(id) {
    document.getElementById(`window-${id}`).style.display = 'none';
    // En un sistema real, se debería crear un ícono en la barra de tareas.
}

/**
 * Trae una ventana específica al frente (aumentando su z-index).
 * @param {HTMLElement} windowEl - El elemento de la ventana.
 */
function bringToFront(windowEl) {
    // Encuentra la máxima z-index actual
    let maxZ = 0;
    document.querySelectorAll('.window').forEach(win => {
        const z = parseInt(win.style.zIndex) || 0;
        maxZ = Math.max(maxZ, z);
        // Desactiva el borde de la ventana anterior
        win.classList.remove('active-window');
    });

    // Asigna la nueva z-index y la marca como activa
    windowEl.style.zIndex = maxZ + 1;
    windowEl.classList.add('active-window');
}


// --- Inicialización y Arrastre (Drag and Drop) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mostrar la hora en la barra de tareas
    const timeElement = document.getElementById('time');
    function updateTime() {
        const now = new Date();
        // Formato HH:MM AM/PM
        timeElement.textContent = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    updateTime();
    setInterval(updateTime, 1000); // Actualizar cada segundo


    // 2. Hacer las ventanas arrastrables
    document.querySelectorAll('.window').forEach(windowEl => {
        const titleBar = windowEl.querySelector('.title-bar');
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        // Al hacer clic en la ventana, traerla al frente
        windowEl.addEventListener('mousedown', (e) => {
            bringToFront(windowEl);
        });

        // Inicio del arrastre
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            // Calcular el desplazamiento inicial del clic dentro de la barra de título
            offset.x = e.clientX - windowEl.offsetLeft;
            offset.y = e.clientY - windowEl.offsetTop;
            
            // Previene la selección de texto
            e.preventDefault(); 
        });

        // Movimiento del ratón
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            // Restricción al escritorio
            const desktop = document.getElementById('desktop');
            const desktopRect = desktop.getBoundingClientRect();
            
            // Limitar X
            newX = Math.max(desktopRect.left, Math.min(newX, desktopRect.right - windowEl.offsetWidth));
            // Limitar Y (evitar que se mueva por debajo de la barra de tareas)
            newY = Math.max(desktopRect.top, Math.min(newY, desktopRect.bottom - windowEl.offsetHeight - 35)); 

            windowEl.style.left = `${newX}px`;
            windowEl.style.top = `${newY}px`;
        });

        // Fin del arrastre
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });
});