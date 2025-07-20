// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar ícones Lucide
    lucide.createIcons();
    
    // Configurar navegação
    setupNavigation();
    
    // Configurar formulários
    setupForms();
    
    // Configurar outros eventos
    setupEventListeners();
    
    // Mostrar página inicial
    navigateTo('home');
});

// Sistema de navegação
let currentPage = 'home';

function navigateTo(page) {
    // Esconder todas as páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => {
        p.classList.remove('active');
    });
    
    // Mostrar página selecionada
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        
        // Atualizar navegação ativa
        updateActiveNavigation(page);
        
        // Mostrar/esconder footer baseado na página
        updateFooterVisibility(page);
        
        // Scroll para o topo
        window.scrollTo(0, 0);
    }
}

function updateActiveNavigation(page) {
    // Remover classe active de todos os links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe active ao link atual
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateFooterVisibility(page) {
    const footer = document.getElementById('footer');
    if (page === 'home') {
        footer.style.display = 'block';
    } else {
        footer.style.display = 'none';
    }
}

function setupNavigation() {
    // Configurar links de navegação que já têm onclick definido no HTML
    // Não é necessário adicionar eventos adicionais aqui
    
    // Configurar links do footer
    const footerLinks = document.querySelectorAll('.footer-links a[onclick]');
    // Os links já têm onclick definido no HTML
}

// Configuração de formulários
function setupForms() {
    // Formulário de login admin
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Toggle de senha
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }
    
    // Formulário de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const submitButton = newsletterForm.querySelector('.btn-primary');
        if (submitButton) {
            submitButton.addEventListener('click', handleNewsletterSubmit);
        }
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    if (!usuario || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('https://crecheapi.onrender.com/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: usuario, password: senha })
        });

        if (!response.ok) {
            alert('Usuário ou senha inválidos.');
            return;
        }

        const data = await response.json();
        const token = data.access_token;

        alert('Login realizado com sucesso!');
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';

        // Armazena o token no localStorage (ou variável global)
        localStorage.setItem('creche_token', token);

        // Carregar alunos
        await carregarAlunos(token);

    } catch (err) {
        console.error('Erro no login:', err);
        alert('Erro ao fazer login. Tente novamente.');
    }
}

function togglePasswordVisibility() {
    const senhaInput = document.getElementById('senha');
    const toggleIcon = document.querySelector('.password-toggle i');
    
    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        senhaInput.type = 'password';
        toggleIcon.setAttribute('data-lucide', 'eye');
    }
    
    // Recriar ícones
    lucide.createIcons();
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email && isValidEmail(email)) {
        alert('Obrigado! Você foi inscrito na nossa newsletter.');
        emailInput.value = '';
    } else {
        alert('Por favor, digite um e-mail válido.');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Configuração de outros eventos
function setupEventListeners() {
    // Botões de CTA
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
        if (!button.onclick && !button.type) { // Evitar botões que já têm ação
            button.addEventListener('click', handleCTAClick);
        }
    });
    
    // Botões de "Saiba Mais" dos programas
    const saibaMaisButtons = document.querySelectorAll('.btn-outline');
    saibaMaisButtons.forEach(button => {
        button.addEventListener('click', handleSaibaMaisClick);
    });
    
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.btn-mobile-menu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

function handleCTAClick(e) {
    const buttonText = e.target.textContent.trim();
    
    if (buttonText.includes('Agende') || buttonText.includes('Visita')) {
        showAgendarVisitaModal();
    } else if (buttonText.includes('Conheça') || buttonText.includes('Tour')) {
        showTourVirtualModal();
    } else {
        alert('Funcionalidade em desenvolvimento. Entre em contato conosco!');
    }
}

function handleSaibaMaisClick(e) {
    e.preventDefault();
    const card = e.target.closest('.programa-card');
    const programaTitle = card.querySelector('h3').textContent;
    
    alert(`Mais informações sobre ${programaTitle} em breve! Entre em contato para detalhes.`);
}

function toggleMobileMenu() {
    // Implementar menu mobile
    alert('Menu mobile em desenvolvimento!');
}

// Modais e popups
function showAgendarVisitaModal() {
    const nome = prompt('Qual seu nome?');
    if (nome) {
        const telefone = prompt('Qual seu telefone?');
        if (telefone) {
            alert(`Obrigado, ${nome}! Entraremos em contato no número ${telefone} para agendar sua visita.`);
        }
    }
}

function showTourVirtualModal() {
    alert('Tour virtual em desenvolvimento! Em breve você poderá conhecer nossa creche online.');
}

// Utilitários
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Carregando...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Animações e efeitos
function animateOnScroll() {
    const elements = document.querySelectorAll('.programa-card'); // Removed diferencial-card
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Funcionalidades específicas por página
function initHomePage() {
    // Animar estatísticas
    animateCounters();
    
    // Configurar animações
    animateOnScroll();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 16);
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC para fechar modais
    if (e.key === 'Escape') {
        closeModals();
    }
    
    // Navegação por teclado
    if (e.altKey) {
        switch(e.key) {
            case '1':
                navigateTo('home');
                break;
            case '2':
                navigateTo('infraestrutura');
                break;
            case '3':
                navigateTo('equipe');
                break;
            case '4':
                navigateTo('cardapio');
                break;
            case '0':
                navigateTo('admin');
                break;
        }
    }
});

function closeModals() {
    // Fechar quaisquer modais abertos
    // Para implementação futura quando tivermos modais reais
}

// Detecção de dispositivo
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Otimizações de performance
function debounce(func, wait) {
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

// Redimensionamento da janela
window.addEventListener('resize', debounce(function() {
    // Recriar ícones se necessário
    lucide.createIcons();
    
    // Ajustar layout se necessário
    adjustLayoutForViewport();
}, 250));

function adjustLayoutForViewport() {
    // Ajustes específicos para diferentes tamanhos de tela
    if (isMobile()) {
        // Ajustes para mobile
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'desktop');
    } else if (isTablet()) {
        // Ajustes para tablet
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'desktop');
    } else {
        // Ajustes para desktop
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'tablet');
    }
}

// Inicializar ajustes de viewport
adjustLayoutForViewport();

// Error handling
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    // Em produção, enviar para serviço de monitoramento
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Registrar service worker se disponível
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Acessibilidade
document.addEventListener('keydown', function(e) {
    // Tab navigation enhancements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Lazy loading para imagens (se necessário)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar quando tudo estiver carregado
window.addEventListener('load', function() {
    // Inicializar página home se estivermos nela
    if (currentPage === 'home') {
        initHomePage();
    }
    
    // Configurar lazy loading
    setupLazyLoading();
    
    // Remover loading screen se existir
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

// Utilitário para logs em desenvolvimento
function log(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Creche Feliz] ${message}`, data || '');
    }
}

// Exportar funções principais para uso global
window.navigateTo = navigateTo;
window.showAgendarVisitaModal = showAgendarVisitaModal;
window.showTourVirtualModal = showTourVirtualModal;

// Log de inicialização
log('Sistema inicializado com sucesso!');

async function carregarAlunos(token) {
    try {
        const response = await fetch('https://crecheapi.onrender.com/alunos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar alunos');
        }

        const alunos = await response.json();
        console.log('Lista de alunos:', alunos);

        // Aqui você pode adaptar para renderizar os alunos no HTML futuramente

    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        alert('Erro ao carregar alunos.');
    }
}

// Novas funções de carregamento de dados e observer
async function carregarInfraestrutura() {
    const container = document.getElementById("infraestrutura-grid");
    container.innerHTML = "<p>Carregando...</p>";

    try {
        const res = await fetch("https://crecheapi.onrender.com/infraestrutura");
        const imagens = await res.json();

        container.innerHTML = "";
        imagens.forEach(imagem => {
            const card = document.createElement("div");
            card.className = "diferencial-card";
            card.innerHTML = `
                <div class="programa-image">
                    <img src="${imagem.url}" alt="Imagem infraestrutura" style="border-radius: var(--radius-xl); width: 100%; height: 200px; object-fit: cover;">
                </div>
                <h3>${imagem.nome || "Espaço"}</h3>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar infraestrutura.</p>";
        console.error(e);
    }
}

async function carregarEquipe() {
    const container = document.getElementById("equipe-grid");
    container.innerHTML = "<p>Carregando equipe...</p>";

    try {
        const res = await fetch("https://crecheapi.onrender.com/professor/get_all");
        const equipe = await res.json();

        container.innerHTML = "";
        equipe.forEach(pessoa => {
            const card = document.createElement("div");
            card.className = "diferencial-card";
            card.innerHTML = `
                <div class="programa-image">
                    <img src="${pessoa.foto}" alt="Foto do professor" style="border-radius: var(--radius-xl); width: 100%; height: 200px; object-fit: cover;">
                </div>
                <h3>${pessoa.nome}</h3>
                <p><strong>Cargo:</strong> ${pessoa.cargo}</p>
                <p>${pessoa.descricao}</p>
                <p><strong>Email:</strong> <a href="mailto:${pessoa.email}">${pessoa.email}</a></p>
                <p><strong>Telefone:</strong> <a href="tel:${pessoa.telefone}">${pessoa.telefone}</a></p>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar equipe.</p>";
        console.error(e);
    }
}

// Carregar conteúdo quando a aba for ativada
const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
        if (m.target.id === 'page-infraestrutura' && m.target.classList.contains('active')) carregarInfraestrutura();
        if (m.target.id === 'page-equipe' && m.target.classList.contains('active')) carregarEquipe();
    });
});

observer.observe(document.getElementById('page-infraestrutura'), { attributes: true });
observer.observe(document.getElementById('page-equipe'), { attributes: true });