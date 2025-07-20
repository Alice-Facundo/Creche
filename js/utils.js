export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function isMobile() {
    return window.innerWidth <= 768;
}

export function adjustLayoutForViewport() {
    // Implemente se necessário
}