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

        if (page === 'home') {
            initHomePage();
        }
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
    if (footer) {
        // Mostra o footer somente em home
        footer.style.display = (page === 'home') ? 'block' : 'none';
    }
}

// =================== FORMS ===================
async function handleAdminLogin(e) {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    if (!usuario || !senha) {
        console.error('Por favor, preencha todos os campos.');
        return;
    }
    try {
        const response = await fetch('https://crecheapi.onrender.com/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usuario, password: senha })
        });
        if (!response.ok) {
            console.error('Usuário ou senha inválidos.');
            return;
        }
        const data = await response.json();
        const token = data.access_token;
        console.log('Login realizado com sucesso!');
        document.getElementById('usuario').value = '';
        document.getElementById('senha').value = '';
        localStorage.setItem('creche_token', token);
        // await carregarAlunos(token); // Descomente quando a função existir
    } catch (err) {
        console.error('Erro no login:', err);
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
        console.log('Obrigado! Você foi inscrito na nossa newsletter.');
        emailInput.value = '';
    } else {
        console.error('Por favor, digite um e-mail válido.');
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =================== UTILITÁRIOS E HELPERS ===================
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

function adjustLayoutForViewport() {
}

// =================== API ===================
async function carregarInfraestrutura() {
    const container = document.getElementById("infraestrutura-grid");
    if (!container) return;
    container.innerHTML = "<p>Carregando fotos da infraestrutura...</p>";
    try {
        const resIds = await fetch("https://crecheapi.onrender.com/creche/get_id_fotos");
        const ids = await resIds.json();
        const fotoPromises = ids.map(id =>
            fetch(`https://crecheapi.onrender.com/creche/get_foto_creche/${id}`)
            .then(res => res.blob())
            .then(blob => URL.createObjectURL(blob))
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

async function carregarContato() {
    const enderecoEl = document.getElementById("contato-endereco");
    const telefoneEl = document.getElementById("contato-telefone");
    const emailEl = document.getElementById("contato-email");
    const horarioEl = document.getElementById("contato-horario");
    try {
        const res = await fetch("https://crecheapi.onrender.com/creche/get");
        if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
        const data = await res.json();
        if (enderecoEl) enderecoEl.textContent = data.endereco;
        if (horarioEl) horarioEl.textContent = data.horario_funcionamento;
        if (telefoneEl) {
            telefoneEl.innerHTML = `<a href="tel:+55${data.telefone.replace(/\D/g, '')}">${data.telefone}</a>`;
        }
        if (emailEl) {
            emailEl.innerHTML = `<a href="mailto:${data.email}">${data.email}</a>`;
        }
    } catch (e) {
        const errorMsg = "Não foi possível carregar.";
        if (enderecoEl) enderecoEl.textContent = errorMsg;
        console.error("Erro ao carregar dados de contato:", e);
    }
}

async function carregarCardapio() {
    const container = document.getElementById("cardapio-container");
    if (!container) return;
    container.innerHTML = "<p>Carregando cardápio...</p>";
    try {
        const resMeta = await fetch("https://crecheapi.onrender.com/cardapio/get_recente");
        if (!resMeta.ok) throw new Error('Falha ao buscar metadados do cardápio.');
        const cardapioMeta = await resMeta.json();
        const resPdf = await fetch(`https://crecheapi.onrender.com/cardapio/get_pdf_cardapio/${cardapioMeta.id}`);
        if (!resPdf.ok) throw new Error('Falha ao carregar o arquivo PDF.');
        const pdfBlob = await resPdf.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        container.innerHTML = `<iframe src="${pdfUrl}" width="100%" height="800px" style="border: 1px solid #ccc; border-radius: 8px;" title="Cardápio Semanal"></iframe>`;
    } catch (e) {
        container.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar o cardápio.</p>";
        console.error("Erro detalhado:", e);
    }
}

async function carregarEquipe() {
    const container = document.getElementById("equipe-grid");
    if (!container) return;
    container.innerHTML = "<p>Carregando equipe...</p>";
    try {
        const res = await fetch("https://crecheapi.onrender.com/professor/get_all");
        if (!res.ok) throw new Error(`Erro ao buscar a equipe: ${res.status}`);
        const equipe = await res.json();
        container.innerHTML = "";
        if (!Array.isArray(equipe)) throw new Error("A resposta da API para a equipe não é um array.");
        equipe.forEach(pessoa => {
            if (!pessoa.id) return;
            const fotoUrl = `https://crecheapi.onrender.com/professor/get_foto_professor/${pessoa.id}`;
            const card = document.createElement("div");
            card.className = "diferencial-card";
            card.innerHTML = `
                <div class="programa-image">
                    <img src="${fotoUrl}" alt="Foto de ${pessoa.nome}" style="border-radius: var(--radius-xl); width: 100%; height: 200px; object-fit: cover;" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E2E8F0/475569?text=Sem+Foto';">
                </div>
                <h3>${pessoa.nome || 'Nome não informado'}</h3>
                <p><strong>Cargo:</strong> ${pessoa.cargo || 'Não informado'}</p>
                ${pessoa.descricao ? `<p>${pessoa.descricao}</p>` : ''}
                ${pessoa.email ? `<p><strong>Email:</strong> <a href="mailto:${pessoa.email}">${pessoa.email}</a></p>` : ''}
                ${pessoa.telefone ? `<p><strong>Telefone:</strong> <a href="tel:${pessoa.telefone}">${pessoa.telefone}</a></p>` : ''}
            `;
            container.appendChild(card);
        });
    } catch (e) {
        container.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar a equipe.</p>";
        console.error("Erro detalhado ao carregar equipe:", e);
    }
}

async function carregarDadosFooter() {
    try {
        const res = await fetch("https://crecheapi.onrender.com/creche/get");
        if (!res.ok) return;
        const data = await res.json();
        const enderecoEl = document.getElementById("footer-endereco");
        const telefoneEl = document.getElementById("footer-telefone");
        const emailEl = document.getElementById("footer-email");
        const horarioEl = document.getElementById("footer-horario");
        if (enderecoEl) enderecoEl.innerHTML = data.endereco.replace(/\s-\s/g, '<br>');
        if (telefoneEl) {
            telefoneEl.href = `tel:+55${data.telefone.replace(/\D/g, '')}`;
            telefoneEl.textContent = data.telefone;
        }
        if (emailEl) {
            emailEl.href = `mailto:${data.email}`;
            emailEl.textContent = data.email;
        }
        if (horarioEl) horarioEl.textContent = data.horario_funcionamento;
    } catch (e) {
        console.error("Erro ao carregar dados do footer:", e);
    }
}

// =================== PLACEHOLDERS (Funções que faltavam) ===================
function setupEventListeners() { }
function showAgendarVisitaModal() { console.log("Função showAgendarVisitaModal chamada."); }
function showTourVirtualModal() { console.log("Função showTourVirtualModal chamada."); }
function closeModals() { console.log("Função closeModals chamada."); }

function setupForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);

    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) passwordToggle.addEventListener('click', togglePasswordVisibility);

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);
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

// INICIALIZAÇÃO PRINCIPAL
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    setupForms();
    setupEventListeners();
    setupObservers();
    adjustLayoutForViewport();
    carregarDadosFooter();
    navigateTo('home'); 
});

// LISTENERS GLOBAIS
window.addEventListener('resize', debounce(adjustLayoutForViewport, 250));
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModals();
});

window.navigateTo = navigateTo;
window.showAgendarVisitaModal = showAgendarVisitaModal;
window.showTourVirtualModal = showTourVirtualModal;

console.log('Sistema inicializado com sucesso!');
