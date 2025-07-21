import { fetchAutenticado } from './auth.js';

// =================== ELEMENTOS DO DOM (referências ao modal) ===================
const modal = document.getElementById('professor-modal');
const form = document.getElementById('professor-form');
const modalTitle = document.getElementById('modal-title');
const professorIdField = document.getElementById('professor-id');

// =================== FUNÇÃO PRINCIPAL DE CARREGAMENTO ===================
export async function carregarEquipe() {
    const container = document.getElementById("equipe-grid");
    if (!container) return;

    // Limpa tudo!
    container.innerHTML = '';

    // Adiciona o botão "Novo Professor" se o admin estiver logado
    const token = localStorage.getItem('creche_token');
    if (token) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'novo-professor-container';
        btnContainer.innerHTML = `<button class="btn-primary" onclick="abrirModalNovoProfessor()">+ Adicionar Novo Professor</button>`;
        container.appendChild(btnContainer);
    }

    // Adiciona a mensagem de carregamento
    const loadingP = document.createElement('p');
    loadingP.textContent = 'Carregando equipe...';
    container.appendChild(loadingP);

    try {
        const res = await fetch("https://crecheapi.onrender.com/professor/get_all");
        if (!res.ok) throw new Error(`Erro ao buscar a equipe: ${res.status}`);
        const equipe = await res.json();

        // Limpa tudo de novo, para garantir que não duplique
        container.innerHTML = '';
        if (token) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'novo-professor-container';
            btnContainer.innerHTML = `<button class="btn-primary" onclick="abrirModalNovoProfessor()">+ Adicionar Novo Professor</button>`;
            container.appendChild(btnContainer);
        }

        if (!Array.isArray(equipe) || equipe.length === 0) {
            container.innerHTML += "<p>Nenhum membro da equipe encontrado.</p>";
            return;
        }

        equipe.forEach(pessoa => {
            if (pessoa.id) {
                container.appendChild(renderEquipeCard(pessoa));
            }
        });

    } catch (e) {
        container.innerHTML = "<p>Erro ao carregar a equipe.</p>";
        console.error("Erro detalhado ao carregar equipe:", e);
    }
}

// =================== RENDERIZAÇÃO DO CARD ===================
function renderEquipeCard(pessoa) {
    const isAdmin = !!localStorage.getItem('creche_token');
    const card = document.createElement("div");
    card.className = "diferencial-card";

    // Cria o conteúdo principal do card
    const content = `
        <div class="programa-image">
            <img src="https://crecheapi.onrender.com/professor/get_foto_professor/${pessoa.id}" alt="Foto de ${pessoa.nome}" onerror="this.onerror=null;this.src='https://placehold.co/600x400/E2E8F0/475569?text=Sem+Foto';">
        </div>
        <h3>${pessoa.nome || 'Nome não informado'}</h3>
        <p><strong>Cargo:</strong> ${pessoa.cargo || 'Não informado'}</p>
        ${pessoa.descricao ? `<p>${pessoa.descricao}</p>` : ''}
    `;
    card.innerHTML = content;

    // Se for admin, cria os botões e adiciona os event listeners
    if (isAdmin) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'button-group admin-actions';

        const btnAtualizar = document.createElement('button');
        btnAtualizar.className = 'btn-primary';
        btnAtualizar.id = 'btn-att-prof';
        btnAtualizar.textContent = 'Atualizar';
        btnAtualizar.addEventListener('click', () => abrirModalAtualizarProfessor(pessoa.id));

        const btnApagar = document.createElement('button');
        btnApagar.className = 'btn-primary';
        btnApagar.id = 'btn-apagar-prof';
        btnApagar.textContent = 'Apagar';
        btnApagar.addEventListener('click', () => apagarProfessor(pessoa.id));

        actionsContainer.appendChild(btnAtualizar);
        actionsContainer.appendChild(btnApagar);
        card.appendChild(actionsContainer);
    }

    return card;
}

// =================== CONTROLE DO MODAL ===================
export function fecharModalProfessor() {
    const modal = document.getElementById('professor-modal');
    if (modal) modal.style.display = 'none';
}

export async function abrirModalAtualizarProfessor(id) {
    const modal = document.getElementById('professor-modal');
    const form = document.getElementById('professor-form');
    const modalTitle = document.getElementById('modal-title');
    const professorIdField = document.getElementById('professor-id');

    if (!modal || !form) return;
    form.reset();
    modalTitle.textContent = 'Atualizar Professor';
    professorIdField.value = id;

    try {
        const response = await fetch(`https://crecheapi.onrender.com/professor/get_by_id/${id}`);
        if (!response.ok) throw new Error('Falha ao buscar dados do professor.');
        const prof = await response.json();
        document.getElementById('professor-nome').value = prof.nome;
        document.getElementById('professor-cargo').value = prof.cargo;
        document.getElementById('professor-email').value = prof.email || '';
        // LINHA DO TELEFONE REMOVIDA
        document.getElementById('professor-descricao').value = prof.descricao;
    } catch (error) {
        alert("Não foi possível carregar os dados do professor.");
        return;
    }

    // Remove listeners antigos para evitar duplicidade
    form.onsubmit = null;
    form.addEventListener('submit', handleUpdateProfessor, { once: true });
    modal.style.display = 'flex';
}

export function abrirModalNovoProfessor() {
    const modal = document.getElementById('professor-modal');
    const form = document.getElementById('professor-form');
    const modalTitle = document.getElementById('modal-title');
    const professorIdField = document.getElementById('professor-id');

    if (!modal || !form) return;
    form.reset();
    modalTitle.textContent = 'Adicionar Novo Professor';
    professorIdField.value = '';
    form.onsubmit = null;
    form.addEventListener('submit', handleCreateProfessor, { once: true });
    modal.style.display = 'flex';
}

// =================== AÇÕES (CRUD) ===================
export async function apagarProfessor(id) {
    if (!confirm('Tem certeza que deseja apagar este professor?')) return;
    try {
        const response = await fetchAutenticado(`https://crecheapi.onrender.com/professor/delete/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao apagar professor');
        alert('Professor apagado com sucesso!');
        carregarEquipe();
    } catch (e) {
        alert('Falha ao apagar professor.');
        console.error(e);
    }
}

async function handleCreateProfessor(e) {
    e.preventDefault();
    const fotoInput = document.getElementById('professor-foto');
    
    if (!fotoInput.files || fotoInput.files.length === 0) {
        alert('Por favor, selecione uma foto para o novo professor.');
        return;
    }
    
    const formData = new FormData();
    formData.append('nome', document.getElementById('professor-nome').value);
    formData.append('cargo', document.getElementById('professor-cargo').value);
    formData.append('email', document.getElementById('professor-email').value);
    formData.append('descricao', document.getElementById('professor-descricao').value);
    formData.append('foto', fotoInput.files[0]);

    try {
        const response = await fetchAutenticado('https://crecheapi.onrender.com/professor/create', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            throw new Error('Falha ao criar professor.');
        }
        
        alert('Professor criado com sucesso!');
        fecharModalProfessor();
        await carregarEquipe();
    } catch (error) {
        console.error("Erro ao criar professor:", error);
        alert("Erro ao criar professor. Verifique o console para mais detalhes.");
    }
}

async function handleUpdateProfessor(e) {
    e.preventDefault();
    const id = document.getElementById('professor-id').value;
    
    const formData = new FormData();
    formData.append('nome', document.getElementById('professor-nome').value);
    formData.append('cargo', document.getElementById('professor-cargo').value);
    formData.append('email', document.getElementById('professor-email').value);
    formData.append('descricao', document.getElementById('professor-descricao').value);

    const fotoInput = document.getElementById('professor-foto');
    if (fotoInput.files.length > 0) {
        formData.append('foto', fotoInput.files[0]);
    }

    try {
        const response = await fetchAutenticado(`https://crecheapi.onrender.com/professor/update/${id}`, {
            method: 'PATCH',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            throw new Error('Falha ao atualizar professor.');
        }

        alert('Professor atualizado com sucesso!');
        fecharModalProfessor();
        await carregarEquipe();
    } catch (error) {
        console.error("Erro ao atualizar professor:", error);
        alert("Erro ao atualizar professor. Verifique o console para mais detalhes.");
    }
}
