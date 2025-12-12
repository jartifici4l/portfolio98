// --- Funciones de control de ventanas ---

/**
 * Abre la ventana correspondiente a un ID.
 */
function openWindow(id) {
    const windowEl = document.getElementById(`window-${id}`);
    windowEl.style.display = 'flex'; // Usamos flex para mantener el layout vertical
    bringToFront(windowEl);
}

/**
 * Cierra la ventana.
 */
function closeWindow(id) {
    document.getElementById(`window-${id}`).style.display = 'none';
}

/**
 * Minimizar (oculta)
 */
function minimizeWindow(id) {
    document.getElementById(`window-${id}`).style.display = 'none';
}

/**
 * Alternar Maximizar / Restaurar
 */
function toggleMaximize(id) {
    const windowEl = document.getElementById(`window-${id}`);
    
    // Si ya está maximizada, la restauramos
    if (windowEl.classList.contains('maximized')) {
        windowEl.classList.remove('maximized');
    } else {
        // Si no, la maximizamos
        windowEl.classList.add('maximized');
        bringToFront(windowEl);
    }
}

/**
 * Trae una ventana específica al frente.
 */
function bringToFront(windowEl) {
    let maxZ = 0;
    document.querySelectorAll('.window').forEach(win => {
        const z = parseInt(win.style.zIndex) || 10;
        maxZ = Math.max(maxZ, z);
        win.classList.remove('active-window');
    });

    windowEl.style.zIndex = maxZ + 1;
    windowEl.classList.add('active-window');
}


// --- Inicialización y Arrastre (Drag and Drop) ---

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Reloj
    const timeElement = document.getElementById('time');
    function updateTime() {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    updateTime();
    setInterval(updateTime, 1000);


    // 2. Arrastre de ventanas
    document.querySelectorAll('.window').forEach(windowEl => {
        const titleBar = windowEl.querySelector('.title-bar');
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        // Al hacer clic, traer al frente
        windowEl.addEventListener('mousedown', () => {
            bringToFront(windowEl);
        });

        // Inicio arrastre
        titleBar.addEventListener('mousedown', (e) => {
            // No arrastrar si está maximizada
            if (windowEl.classList.contains('maximized')) return;

            // Evitar conflicto con los botones de control (cerrar/max/min)
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            offset.x = e.clientX - windowEl.offsetLeft;
            offset.y = e.clientY - windowEl.offsetTop;
            e.preventDefault(); 
        });

        // Movimiento
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            const desktop = document.getElementById('desktop');
            const desktopRect = desktop.getBoundingClientRect();
            
            // Límites simples
            // Permitimos que la ventana se salga un poco, pero no totalmente
            // Limitar X
            // newX = Math.max(0, Math.min(newX, desktopRect.width - windowEl.offsetWidth));
            
            // Limitar Y (Respetar barra de tareas abajo)
            // newY = Math.max(0, Math.min(newY, desktopRect.height - 30)); 

            windowEl.style.left = `${newX}px`;
            windowEl.style.top = `${newY}px`;
        });

        // Fin arrastre
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });
});
