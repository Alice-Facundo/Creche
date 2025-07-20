import { navigateTo, updateActiveNavigation, updateFooterVisibility } from './navegacao.js';
import { updateLoginStatus, handleAdminLogin, handleHeaderAdminClick, togglePasswordVisibility } from './auth.js';
import { carregarEquipe, apagarProfessor, atualizarProfessor, criarProfessor, abrirModalAtualizarProfessor, abrirModalNovoProfessor } from './equipe.js';
import { carregarInfraestrutura } from './infraestrutura.js';
import { carregarCardapio } from './cardapio.js';
import { carregarContato, carregarDadosFooter } from './contato.js';
import { debounce, adjustLayoutForViewport } from './utils.js';

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    if (window.lucide) lucide.createIcons();
    setupForms();
    setupEventListeners();
    setupObservers();
    adjustLayoutForViewport();
    carregarDadosFooter();
    updateLoginStatus();
    navigateTo('home');
});

function setupForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);

    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) passwordToggle.addEventListener('click', togglePasswordVisibility);

    // Adicione outros forms se necessário
}

function setupEventListeners() {
    const adminButton = document.getElementById('btn-header-admin');
    if (adminButton) adminButton.addEventListener('click', handleHeaderAdminClick);
}

function setupObservers() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            if (m.target.classList.contains('active')) {
                switch (m.target.id) {
                    case 'page-infraestrutura': carregarInfraestrutura(); break;
                    case 'page-equipe': carregarEquipe(); break;
                    case 'page-contato': carregarContato(); break;
                    case 'page-cardapio': carregarCardapio(); break;
                }
            }
        });
    });

    const pagesToObserve = ['page-infraestrutura', 'page-equipe', 'page-cardapio', 'page-contato'];
    pagesToObserve.forEach(pageId => {
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            observer.observe(pageElement, { attributes: true, attributeFilter: ['class'] });
        }
    });
}

// Listeners globais
window.addEventListener('resize', debounce(adjustLayoutForViewport, 250));
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModals();
});

// Exponha funções globais se necessário
window.navigateTo = navigateTo;
window.abrirModalAtualizarProfessor = abrirModalAtualizarProfessor;
window.abrirModalNovoProfessor = abrirModalNovoProfessor;

function closeModals() {
    // Implemente se necessário
}

console.log('Sistema inicializado com sucesso!');