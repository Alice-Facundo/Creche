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
    } catch (e) {
        container.innerHTML = "<p style='color: red;'>Erro ao carregar a infraestrutura.</p>";
        console.error("Erro ao carregar infraestrutura:", e);
    }
}