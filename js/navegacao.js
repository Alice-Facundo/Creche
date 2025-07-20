export let currentPage = 'home';

export function navigateTo(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        updateActiveNavigation(page);
        updateFooterVisibility(page);
        window.scrollTo(0, 0);

        if (page === 'home' && typeof initHomePage === 'function') {
            initHomePage();
        }
    }
}

export function updateActiveNavigation(page) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');
}

export function updateFooterVisibility(page) {
    const footer = document.getElementById('footer');
    if (footer) {
        footer.style.display = (page === 'home') ? 'block' : 'none';
    }
}