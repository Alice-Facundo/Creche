export function setButtonFeedback(buttonId, message, isSuccess) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const originalText = button.dataset.originalText || button.textContent;
    button.dataset.originalText = originalText;

    button.textContent = message;
    button.style.backgroundColor = isSuccess ? 'var(--success)' : 'var(--danger)';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.disabled = false;
    }, 2500);
}

export function updateLoginStatus() {
    const token = localStorage.getItem('creche_token');
    const adminButton = document.getElementById('btn-header-admin');
    const adminButtonText = document.getElementById('btn-header-admin-text');
    const adminButtonIcon = document.getElementById('btn-header-admin-icon');

    if (!adminButton || !adminButtonText || !adminButtonIcon) return;

    if (token) {
        adminButtonText.textContent = 'Sair';
        adminButtonIcon.setAttribute('data-lucide', 'log-out');
        adminButton.classList.add('logged-in');
    } else {
        adminButtonText.textContent = 'Admin';
        adminButtonIcon.setAttribute('data-lucide', 'lock');
        adminButton.classList.remove('logged-in');
    }
    if (window.lucide) {
        lucide.createIcons();
    }
}

export function handleHeaderAdminClick() {
    const token = localStorage.getItem('creche_token');
    if (token) {
        localStorage.removeItem('creche_token');
        alert('Você saiu do sistema.');
        updateLoginStatus();
        window.navigateTo('home');
    } else {
        window.navigateTo('admin');
    }
}

export async function handleAdminLogin(e) {
    e.preventDefault();

    const loginButton = document.getElementById('btn-login');
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');

    if (!loginButton.dataset.originalText) {
        loginButton.dataset.originalText = loginButton.textContent;
    }

    const usuario = usuarioInput.value;
    const senha = senhaInput.value;

    if (!usuario || !senha) {
        setButtonFeedback('btn-login', 'Preencha os campos', false);
        return;
    }

    loginButton.textContent = 'Entrando...';
    loginButton.disabled = true;

    try {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', usuario);
        formData.append('password', senha);
        formData.append('scope', '');
        formData.append('client_id', '');
        formData.append('client_secret', '');

        const response = await fetch('https://crecheapi.onrender.com/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Usuário ou senha inválidos.');
        }

        const data = await response.json();
        const token = data.access_token;

        setButtonFeedback('btn-login', 'Sucesso!', true);

        localStorage.setItem('creche_token', token);

        usuarioInput.value = '';
        senhaInput.value = '';

        updateLoginStatus();

        setTimeout(() => window.navigateTo('home'), 1000);

    } catch (err) {
        console.error('Erro no login:', err.message);
        setButtonFeedback('btn-login', 'Falhou! Tente novamente', false);
    }
}

export function togglePasswordVisibility() {
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

export async function fetchAutenticado(url, options = {}) {
    const token = localStorage.getItem('creche_token');

    if (!token) {
        console.error("Nenhum token de autenticação encontrado. Faça o login primeiro.");
        window.navigateTo('admin');
        return Promise.reject(new Error("Token não encontrado."));
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    return fetch(url, {
        ...options, 
        headers,  
    });
}