document.addEventListener("DOMContentLoaded", function () {
    const codigoInput = document.getElementById("codigo");
    const cnpjInput = document.getElementById("cnpj");
    const razaoInput = document.getElementById("razao");
    const estadoInput = document.getElementById("estado");
    const cidadeInput = document.getElementById("cidade");
    const marcaInput = document.getElementById("marca");
    const clienteForm = document.getElementById("clienteForm");

    function transformarMaiusculas(event) {
        event.target.value = event.target.value.toUpperCase();
    }

    codigoInput.addEventListener("input", transformarMaiusculas);
    cnpjInput.addEventListener("input", transformarMaiusculas);
    razaoInput.addEventListener("input", transformarMaiusculas);
    estadoInput.addEventListener("input", transformarMaiusculas);
    cidadeInput.addEventListener("input", transformarMaiusculas);

    let clientesCache = null;
    const TAMANHO_CODIGO = 6;

    async function carregarClientes() {
        if (!clientesCache) {
            const response = await fetch("assets/txt/baseclientes.txt");
            const data = await response.text();
            clientesCache = data.split("\n").map(linha => linha.trim());
        }
    }

    codigoInput.addEventListener("input", async function () {
        await carregarClientes();
        const codigo = codigoInput.value.trim().toUpperCase();
        if (codigo.length < TAMANHO_CODIGO) {
            limparCampos();
            return;
        }

        const cliente = clientesCache.find(linha => linha.split(",")[0] === codigo);
        if (cliente) {
            const detalhes = cliente.split(",");
            if (detalhes.length >= 5) {
                cnpjInput.value = detalhes[1].trim();
                razaoInput.value = detalhes[2].trim();
                estadoInput.value = detalhes[3].trim();
                cidadeInput.value = detalhes[4].trim();
            }
        } else {
            limparCampos();
        }
    });

    function limparCampos() {
        cnpjInput.value = "";
        razaoInput.value = "";
        estadoInput.value = "";
        cidadeInput.value = "";
    }

    window.limparFormulario = function () {
        clienteForm.reset();
    };

    clienteForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const destinatario = "aprovacaodetabela@grupogagliardi.com";
        const emailBody = `
            Código do Cliente: ${codigoInput.value}
            CNPJ/CPF: ${cnpjInput.value}
            Razão Social: ${razaoInput.value}
            Estado: ${estadoInput.value}
            Cidade: ${cidadeInput.value}
            Preço KIT TITAN 125 CC: ${document.getElementById("preco1").value}
            Preço KIT TITAN 125 CC 2009: ${document.getElementById("preco2").value}
            Preço KIT BROS 150 CC: ${document.getElementById("preco3").value}
            Preço KIT BROS 160 CC: ${document.getElementById("preco4").value}
            Preço KIT POP 125 CC: ${document.getElementById("preco5").value}
            Preço KIT BIZ 125 CC: ${document.getElementById("preco6").value}
            Marca mais vendida:\n ${document.getElementById("marca").value}
        `;
        window.location.href = `mailto:${destinatario}?subject=Pesquisa de Preço&body=${encodeURIComponent(emailBody)}`;
    });
});
