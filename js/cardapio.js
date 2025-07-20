export async function carregarCardapio() {
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