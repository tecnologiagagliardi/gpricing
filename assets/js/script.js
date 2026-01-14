/* =========================
   VARIÁVEIS GERAIS
========================= */
const form = document.getElementById("gpricingForm");
const modal = document.getElementById("modalConfirmacao");
const modalTexto = document.getElementById("modalTexto");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnFechar = document.getElementById("btnFechar");

let dadosClientes = [];
let resumoEmail = "";

/* =========================
   DATA ATUAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dataAtual").value =
    new Date().toLocaleDateString("pt-BR");
});

/* =========================
   FORMATAÇÕES
========================= */
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function limparMoeda(valor) {
  return Number(
    valor.replace(/[R$\s.]/g, "").replace(",", ".")
  ) || 0;
}

function formatarCampoMoeda(input) {
  let valor = input.value.replace(/\D/g, "");
  valor = (Number(valor) / 100).toFixed(2);
  input.value = formatarMoeda(valor);
}

/* =========================
   APLICA MÁSCARA
========================= */
const camposMoeda = [
  "cgDianteiroMichelin", "cgDianteiroVipal",
  "cgTraseiroMichelin", "cgTraseiroVipal",
  "brosDianteiroMichelin", "brosDianteiroVipal",
  "brosTraseiroMichelin", "brosTraseiroVipal"
];

camposMoeda.forEach(id => {
  const campo = document.getElementById(id);
  campo.value = "R$ 0,00";

  campo.addEventListener("input", () => formatarCampoMoeda(campo));
  campo.addEventListener("blur", () => {
    if (!campo.value) campo.value = "R$ 0,00";
  });
});

/* =========================
   CARREGAR CLIENTES
========================= */
async function carregarArquivo() {
  const response = await fetch("assets/data/data.txt");
  const texto = await response.text();
  const linhas = texto.split("\n").map(l => l.trim()).filter(Boolean);
  linhas.shift();

  dadosClientes = linhas.map(l => {
    const [codigo_cliente, cnpjCpf, razao_social, cidade, estado] =
      l.split(",").map(c => c.trim());
    return { codigo_cliente, cnpjCpf, razao_social, cidade, estado };
  });
}
carregarArquivo();

/* =========================
   BUSCA CLIENTE
========================= */
codigoCliente.addEventListener("change", function () {
  const cliente = dadosClientes.find(c => c.codigo_cliente === this.value);
  if (!cliente) return alert("Cliente não encontrado.");

  cnpjCpf.value = cliente.cnpjCpf;
  razaoSocial.value = cliente.razao_social;
  cidade.value = cliente.cidade.toUpperCase();
  estado.value = cliente.estado.toUpperCase();
});

/* =========================
   SUBMIT → MODAL
========================= */
form.addEventListener("submit", e => {
  e.preventDefault();

  const get = id => document.getElementById(id).value;

  resumoEmail = `
DATA DA PESQUISA: ${get("dataAtual")}

CÓDIGO DO CLIENTE: ${get("codigoCliente")}
CNPJ/CPF: ${get("cnpjCpf")}
RAZÃO SOCIAL: ${get("razaoSocial")}
CIDADE: ${get("cidade")}
ESTADO: ${get("estado")}

CG 125 / 150 / 160
- Dianteiro Michelin 2.75-18: ${formatarMoeda(limparMoeda(get("cgDianteiroMichelin")))}
- Dianteiro Vipal 2.75-18: ${formatarMoeda(limparMoeda(get("cgDianteiroVipal")))}
- Traseiro Michelin 90/90-18: ${formatarMoeda(limparMoeda(get("cgTraseiroMichelin")))}
- Traseiro Vipal 90/90-18: ${formatarMoeda(limparMoeda(get("cgTraseiroVipal")))}

BROS 150 / 160
- Dianteiro Michelin 90/90-19: ${formatarMoeda(limparMoeda(get("brosDianteiroMichelin")))}
- Dianteiro Vipal 90/90-19: ${formatarMoeda(limparMoeda(get("brosDianteiroVipal")))}
- Traseiro Michelin 110/90-17: ${formatarMoeda(limparMoeda(get("brosTraseiroMichelin")))}
- Traseiro Vipal 110/90-17: ${formatarMoeda(limparMoeda(get("brosTraseiroVipal")))}
`;

  modalTexto.textContent = resumoEmail;
  modal.style.display = "flex";
});

/* =========================
   CONFIRMAR EMAIL
========================= */
btnConfirmar.onclick = () => {
  window.location.href =
    `mailto:aprovacaodetabela@grupogagliardi.com?subject=` +
    encodeURIComponent("Pesquisa de preço Pirelli") +
    `&body=${encodeURIComponent(resumoEmail)}`;
  modal.style.display = "none";
};

btnFechar.onclick = () => modal.style.display = "none";