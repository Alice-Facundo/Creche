import { fetchAutenticado } from './auth.js';

export async function carregarEquipe() {
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
            container.appendChild(renderEquipeCard(pessoa));
        });
        if (localStorage.getItem('creche_token')) {
            const btnNovo = document.createElement('button');
            btnNovo.textContent = 'Novo Professor';
            btnNovo.onclick = abrirModalNovoProfessor;
            container.appendChild(btnNovo);
        }
    } catch (e) {
        container.innerHTML = "<p style='color: red; text-align: center;'>Erro ao carregar a equipe.</p>";
        console.error("Erro detalhado ao carregar equipe:", e);
    }
}

export async function apagarProfessor(id) {
    if (!confirm('Tem certeza que deseja apagar este professor?')) return;
    try {
        const res = await fetchAutenticado(`https://crecheapi.onrender.com/professor/delete/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Erro ao apagar professor');
        alert('Professor apagado com sucesso!');
        carregarEquipe();
    } catch (e) {
        alert('Falha ao apagar professor.');
        console.error(e);
    }
}

export async function atualizarProfessor(id, dadosAtualizados) {
    try {
        const res = await fetchAutenticado(`https://crecheapi.onrender.com/professor/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosAtualizados)
        });
        if (!res.ok) throw new Error('Erro ao atualizar professor');
        alert('Professor atualizado!');
        carregarEquipe();
    } catch (e) {
        alert('Falha ao atualizar professor.');
        console.error(e);
    }
}

export async function criarProfessor(dadosNovo) {
    try {
        const res = await fetchAutenticado('https://crecheapi.onrender.com/professor/create', {
            method: 'POST',
            body: JSON.stringify(dadosNovo)
        });
        if (!res.ok) throw new Error('Erro ao criar professor');
        alert('Professor criado!');
        carregarEquipe();
    } catch (e) {
        alert('Falha ao criar professor.');
        console.error(e);
    }
}

export function abrirModalAtualizarProfessor(id) {
    alert('Abrir modal de atualização para o professor ' + id);
}

export function abrirModalNovoProfessor() {
    alert('Abrir modal para criar novo professor');
}

function renderEquipeCard(pessoa) {
    const isAdmin = !!localStorage.getItem('creche_token');
    const card = document.createElement("div");
    card.className = "diferencial-card";
    card.innerHTML = `
        <div class="programa-image">
            <img src="https://crecheapi.onrender.com/professor/get_foto_professor/${pessoa.id}" alt="Foto de ${pessoa.nome}" style="border-radius: var(--radius-xl); width: 100%; height: 200px; object-fit: cover;" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E2E8F0/475569?text=Sem+Foto';">
        </div>
        <h3>${pessoa.nome || 'Nome não informado'}</h3>
        <p><strong>Cargo:</strong> ${pessoa.cargo || 'Não informado'}</p>
        ${pessoa.descricao ? `<p>${pessoa.descricao}</p>` : ''}
        ${pessoa.email ? `<p><strong>Email:</strong> <a href="mailto:${pessoa.email}">${pessoa.email}</a></p>` : ''}
        ${pessoa.telefone ? `<p><strong>Telefone:</strong> <a href="tel:${pessoa.telefone}">${pessoa.telefone}</a></p>` : ''}
        ${isAdmin ? `
            <div class="admin-actions">
                <button onclick="apagarProfessor('${pessoa.id}')">Apagar</button>
                <button onclick="abrirModalAtualizarProfessor('${pessoa.id}')">Atualizar</button>
            </div>
        ` : ''}
    `;
    return card;
}