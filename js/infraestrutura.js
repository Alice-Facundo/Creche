import { fetchAutenticado } from './auth.js';

// =================== FUNÇÃO PRINCIPAL DE CARREGAMENTO ===================
export async function carregarInfraestrutura() {
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

        // Lógica para adicionar o botão se for admin
        const token = localStorage.getItem('creche_token');
        if (token) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'novo-infra-container'; // Classe para estilização
            btnContainer.innerHTML = `<button class="btn-primary" onclick="abrirModalAdicionarFotoInfra()">+ Adicionar Foto</button>`;
            container.appendChild(btnContainer);
        }

    } catch (e) {
        container.innerHTML = "<p style='color: red;'>Erro ao carregar a infraestrutura.</p>";
        console.error("Erro ao carregar infraestrutura:", e);
    }
}

// =================== CONTROLE DO MODAL ===================
export function fecharModalAdicionarFotoInfra() {
    // Busca o modal no momento do clique
    const modal = document.getElementById('infra-foto-modal');
    if (modal) modal.style.display = 'none';
}

export function abrirModalAdicionarFotoInfra() {
    // Busca o modal e o formulário no momento do clique
    const modal = document.getElementById('infra-foto-modal');
    const form = document.getElementById('infra-foto-form');
    
    if (!modal || !form) {
        console.error("Modal ou formulário da infraestrutura não encontrado no DOM.");
        return;
    }
    form.reset();
    form.onsubmit = handleAdicionarFotoInfra;
    modal.style.display = 'flex';
}

// =================== AÇÃO DE UPLOAD ===================
async function handleAdicionarFotoInfra(e) {
    e.preventDefault();
    const fotoInput = document.getElementById('infra-foto-arquivo');
    
    if (!fotoInput.files || fotoInput.files.length === 0) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
    }

    const formData = new FormData();
    formData.append('foto', fotoInput.files[0]); // Adiciona apenas o arquivo

    try {
        const response = await fetchAutenticado('https://crecheapi.onrender.com/creche/create_fotos', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            throw new Error('Falha ao adicionar foto.');
        }

        alert('Foto adicionada com sucesso!');
        fecharModalAdicionarFotoInfra();
        await carregarInfraestrutura(); // Recarrega a galeria

    } catch (error) {
        console.error("Erro ao adicionar foto:", error);
        alert("Erro ao adicionar foto. Verifique o console para mais detalhes.");
    }
}
