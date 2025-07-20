// =================== INICIALIZAÇÃO ===================
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    setupNavigation();
    setupForms();
    setupEventListeners();
    navigateTo('home');
    carregarDadosFooter();
});

// =================== NAVEGAÇÃO ===================
let currentPage = 'home';

function navigateTo(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        updateActiveNavigation(page);
        updateFooterVisibility(page);
        window.scrollTo(0, 0);
    }
}

function updateActiveNavigation(page) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');
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
    // Links já têm onclick no HTML
    const footerLinks = document.querySelectorAll('.footer-links a[onclick]');
    // Links do footer já têm onclick
}

// =================== FORMS ===================
function setupForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);

    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) passwordToggle.addEventListener('click', togglePasswordVisibility);

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const submitButton = newsletterForm.querySelector('.btn-primary');
        if (submitButton) submitButton.addEventListener('click', handleNewsletterSubmit);
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
            headers: { 'Content-Type': 'application/json' },
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
        localStorage.setItem('creche_token', token);
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

// =================== UTILITÁRIOS ===================
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function log(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[Creche Feliz] ${message}`, data || '');
    }
}

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

function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// =================== ANIMAÇÕES ===================
function animateOnScroll() {
    const elements = document.querySelectorAll('.programa-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(element => observer.observe(element));
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

// =================== FUNCIONALIDADES POR PÁGINA ===================
function initHomePage() {
    animateCounters();
    animateOnScroll();
}

// =================== ACESSIBILIDADE E PERFORMANCE ===================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModals();
    if (e.altKey) {
        switch(e.key) {
            case '1': navigateTo('home'); break;
            case '2': navigateTo('infraestrutura'); break;
            case '3': navigateTo('equipe'); break;
            case '4': navigateTo('cardapio'); break;
            case '0': navigateTo('admin'); break;
        }
    }
});

window.addEventListener('resize', debounce(function() {
    lucide.createIcons();
    adjustLayoutForViewport();
}, 250));

function adjustLayoutForViewport() {
    if (isMobile()) {
        document.body.classList.add('mobile');
        document.body.classList.remove('tablet', 'desktop');
    } else if (isTablet()) {
        document.body.classList.add('tablet');
        document.body.classList.remove('mobile', 'desktop');
    } else {
        document.body.classList.add('desktop');
        document.body.classList.remove('mobile', 'tablet');
    }
}
adjustLayoutForViewport();

window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    // Em produção, enviar para serviço de monitoramento
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
});
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// =================== LAZY LOADING ===================
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

window.addEventListener('load', function() {
    if (currentPage === 'home') initHomePage();
    setupLazyLoading();
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) loadingScreen.style.display = 'none';
});

// =================================================== API =======================================================================

// ================================ INFRAESTRUTURA =================================
async function carregarInfraestrutura() {
    const container = document.getElementById("infraestrutura-grid");
    if (!container) return;

    container.innerHTML = "<p>Carregando fotos da infraestrutura...</p>";

    try {
        const resIds = await fetch("https://crecheapi.onrender.com/creche/get_id_fotos");
        const ids = await resIds.json();

        // Mapeia os IDs para buscar cada foto como um arquivo (blob)
        const fotoPromises = ids.map(id =>
            fetch(`https://crecheapi.onrender.com/creche/get_foto_creche/${id}`)
                .then(res => res.blob())
                .then(blob => URL.createObjectURL(blob)) // Cria uma URL local para a imagem
        );

        const urlsDasFotos = await Promise.all(fotoPromises);
        
        container.innerHTML = "";
        urlsDasFotos.forEach(url => {
            const card = document.createElement("div");
            card.className = "diferencial-card";
            card.innerHTML = `
                <div class="programa-image">
                    <img src="${url}" alt="Foto da infraestrutura" style="border-radius: var(--radius-xl); width: 100%; object-fit: cover;">
                </div>
                <h3>Nosso Espaço</h3>
            `;
            container.appendChild(card);
        });

    } catch (e) {
        container.innerHTML = "<p style='color: red;'>Erro ao carregar a infraestrutura.</p>";
        console.error("Erro ao carregar infraestrutura:", e);
    }
}

// ================================ CONTATO =============================================
async function carregarContato() {
    const enderecoEl = document.getElementById("contato-endereco");
    const telefoneEl = document.getElementById("contato-telefone");
    const emailEl = document.getElementById("contato-email");
    const horarioEl = document.getElementById("contato-horario");

    try {
        const res = await fetch("https://crecheapi.onrender.com/creche/get");
        if (!res.ok) {
            throw new Error(`Erro na API: ${res.status}`);
        }
        const data = await res.json();

        if (enderecoEl) enderecoEl.textContent = data.endereco;
        if (horarioEl) horarioEl.textContent = data.horario_funcionamento;

        if (telefoneEl) {
            const telLink = data.telefone.replace(/\D/g, '');
            telefoneEl.innerHTML = `<a href="tel:+55${telLink}">${data.telefone}</a>`;
        }
        if (emailEl) {
            emailEl.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
        }

    } catch (e) {
        const errorMsg = "Não foi possível carregar as informações.";
        if (enderecoEl) enderecoEl.textContent = errorMsg;
        if (telefoneEl) telefoneEl.textContent = errorMsg;
        if (emailEl) emailEl.textContent = errorMsg;
        if (horarioEl) horarioEl.textContent = errorMsg;
        console.error("Erro ao carregar dados de contato:", e);
    }
}

// ================================ EQUIPE =============================================
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
        // Exibe uma mensagem de erro clara no container
        container.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar o cardápio. Por favor, tente novamente mais tarde.</p>";
        console.error("Erro detalhado:", e);
    }
}

// =================== OBSERVERS ===================
const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
        if (m.target.classList.contains('active')) {
            switch (m.target.id) {
                case 'page-infraestrutura':
                    carregarInfraestrutura();
                    break;
                case 'page-equipe':
                    carregarEquipe();
                    break;
                case 'page-contato':
                    carregarContato();
                    break;
            }
        }
    });
});

observer.observe(document.getElementById('page-infraestrutura'), { attributes: true });
observer.observe(document.getElementById('page-equipe'), { attributes: true });
observer.observe(document.getElementById('page-cardapio'), { attributes: true });


// =================== EXPORTS GLOBAIS ===================
window.navigateTo = navigateTo;
window.showAgendarVisitaModal = showAgendarVisitaModal;
window.showTourVirtualModal = showTourVirtualModal;

// =================== LOG DE INICIALIZAÇÃO ===================
log('Sistema inicializado com sucesso!');