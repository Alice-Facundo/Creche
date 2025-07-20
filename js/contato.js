export async function carregarContato() {
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

export async function carregarDadosFooter() {
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