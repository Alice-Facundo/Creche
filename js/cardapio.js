import { fetchAutenticado } from './auth.js';

export async function carregarCardapio() {
    const container = document.getElementById("cardapio-container");
    if (!container) return;

    container.innerHTML = "<p>Carregando cardápio mais recente...</p>";

    try {
        const resMeta = await fetch("https://crecheapi.onrender.com/cardapio/get_recente");
        if (!resMeta.ok) throw new Error('Nenhum cardápio encontrado.');
        
        const cardapioMeta = await resMeta.json();
        const cardapioId = cardapioMeta.id;
        
        const resPdf = await fetch(`https://crecheapi.onrender.com/cardapio/get_pdf_cardapio/${cardapioId}`);
        if (!resPdf.ok) throw new Error('Falha ao carregar o arquivo PDF.');

        const pdfBlob = await resPdf.blob();
        const pdfUrl = URL.createObjectURL(pdfBlob);

        container.innerHTML = `
            <iframe 
                src="${pdfUrl}" 
                width="100%" 
                height="800px" 
                style="border: 1px solid #ccc; border-radius: 8px;"
                title="Cardápio Semanal">
            </iframe>
        `;
        
    } catch (e) {
        container.innerHTML = "<p style='text-align: center;'>Nenhum cardápio disponível no momento.</p>";
        console.error("Erro ao carregar cardápio:", e);
    } finally {
        const token = localStorage.getItem('creche_token');
        if (token) {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'novo-cardapio-container'; 
            btnContainer.innerHTML = `<button class="btn-primary" onclick="abrirModalAdicionarCardapio()" id="btn-add-cardapio">+ Adicionar Novo Cardápio</button>`;
            container.appendChild(btnContainer);
        }
    }
}

// =================== CONTROLE DO MODAL ===================
export function fecharModalAdicionarCardapio() {
    const modal = document.getElementById('cardapio-modal');
    if (modal) modal.style.display = 'none';
}

export function abrirModalAdicionarCardapio() {
    const modal = document.getElementById('cardapio-modal');
    const form = document.getElementById('cardapio-form');
    if (!modal || !form) return;
    
    form.reset();
    form.onsubmit = handleAdicionarCardapio;
    modal.style.display = 'flex';
}

// =================== AÇÃO DE UPLOAD ===================
async function handleAdicionarCardapio(e) {
    e.preventDefault();
    e.preventDefault();
    const form = document.getElementById('cardapio-form');
    
    const dataInicio = document.getElementById('cardapio-data-inicio').value;
    const dataFim = document.getElementById('cardapio-data-fim').value;
    const pdfInput = document.getElementById('cardapio-pdf');

    if (!dataInicio || !dataFim || !pdfInput.files[0]) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const url = `https://crecheapi.onrender.com/cardapio/create?data_inicio=${dataInicio}&data_fim=${dataFim}`;

    const formData = new FormData();
    formData.append('pdf', pdfInput.files[0]);

    try {
        const response = await fetchAutenticado(url, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            throw new Error('Falha ao adicionar cardapio.');
        }

        alert('Cardapio adicionado com sucesso!');
        fecharModalAdicionarCardapio();
        await carregarCardapio(); 

    } catch (error) {
        console.error("Erro ao adicionar cardapio:", error);
        alert("Erro ao adicionar cardapio. Verifique a consola para mais detalhes.");
    }
}
