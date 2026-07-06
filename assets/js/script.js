/* =========================
   VARIÁVEIS GERAIS
========================= */
const form = document.getElementById("gpricingForm");
const modal = document.getElementById("modalConfirmacao");
const modalTexto = document.getElementById("modalTexto");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnFechar = document.getElementById("btnFechar");

const codigoCliente = document.getElementById("codigoCliente");
const cnpjCpf = document.getElementById("cnpjCpf");
const razaoSocial = document.getElementById("razaoSocial");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

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
   FORMATAÇÃO DE MOEDA
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

  if (!valor) {
    input.value = "R$ 0,00";
    return;
  }

  valor = (Number(valor) / 100).toFixed(2);
  input.value = formatarMoeda(valor);
}

/* =========================
   CAMPOS DE MOEDA
========================= */
const camposMoeda = [
  "cgDianteiroMichelin",
  "cgDianteiroVipal",
  "cgTraseiroMichelin",
  "cgTraseiroVipal",
  "brosDianteiroMichelin",
  "brosDianteiroVipal",
  "brosTraseiroMichelin"
];

camposMoeda.forEach(id => {
  const campo = document.getElementById(id);

  if (!campo) return;

  campo.value = "R$ 0,00";

  campo.addEventListener("input", () => {
    formatarCampoMoeda(campo);
  });

  campo.addEventListener("blur", () => {
    if (!campo.value) {
      campo.value = "R$ 0,00";
    }
  });
});

/* =========================
   CARREGAR CLIENTES
========================= */
async function carregarArquivo() {
  try {
    const response = await fetch("assets/data/data.txt");

    if (!response.ok) {
      throw new Error("Não foi possível carregar o arquivo.");
    }

    const texto = await response.text();

    const linhas = texto
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    linhas.shift();

    dadosClientes = linhas.map(linha => {

      const [
        codigo_cliente,
        cnpjCpf,
        razao_social,
        cidade,
        estado
      ] = linha.split(",").map(c => c.trim());

      return {
        codigo_cliente,
        cnpjCpf,
        razao_social,
        cidade,
        estado
      };
    });

  } catch (erro) {
    console.error("Erro ao carregar clientes:", erro);
  }
}

carregarArquivo();

/* =========================
   BUSCA CLIENTE
========================= */
codigoCliente.addEventListener("change", function () {

  const codigo = this.value.trim();

  const cliente = dadosClientes.find(
    c => c.codigo_cliente === codigo
  );

  if (!cliente) {
    alert("Cliente não encontrado.");
    return;
  }

  cnpjCpf.value = cliente.cnpjCpf;
  razaoSocial.value = cliente.razao_social;
  cidade.value = cliente.cidade.toUpperCase();
  estado.value = cliente.estado.toUpperCase();
});

/* =========================
   SUBMIT
========================= */
form.addEventListener("submit", function (e) {

  e.preventDefault();

  const get = id => document.getElementById(id).value;

  resumoEmail = `
DATA DA PESQUISA: ${get("dataAtual")}

CÓDIGO DO CLIENTE: ${get("codigoCliente")}
CNPJ/CPF: ${get("cnpjCpf")}
RAZÃO SOCIAL: ${get("razaoSocial")}
CIDADE: ${get("cidade")}
ESTADO: ${get("estado")}

PREÇOS INFORMADOS

110/80 X14 TRAS BIZ POP (Larga) - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("cgDianteiroMichelin")))}

3.00 X14 TRAS BIZ100/125 POP100 - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("cgDianteiroVipal")))}

2.50 X17 DIANT BIZ100/125 POP / CRYPTON - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("cgTraseiroMichelin")))}

110/90 X17 TRAS BROS125/150/FALCON/XT660 - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("cgTraseiroVipal")))}

3.00 X18 DIANT/TRAS YBR125/FACTOR/TITAN125/150/FAN - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("brosDianteiroMichelin")))}

4.10 X18 CBX200/DT/TORNADO/NX150/NX250/XR200/XRE - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("brosDianteiroVipal")))}

90/90 X19 DIANT BROS150 - Câmara de AR - Borracha Natural
${formatarMoeda(limparMoeda(get("brosTraseiroMichelin")))}
`;

  modalTexto.textContent = resumoEmail;
  modal.style.display = "flex";
});

/* =========================
   CONFIRMAR ENVIO
========================= */
btnConfirmar.addEventListener("click", () => {

  const assunto = encodeURIComponent("Pesquisa de Preços - GPricing");

  const corpo = encodeURIComponent(resumoEmail);

  window.location.href =
    `mailto:aprovacaodetabela@grupogagliardi.com?subject=${assunto}&body=${corpo}`;

  modal.style.display = "none";
});

/* =========================
   CANCELAR
========================= */
btnFechar.addEventListener("click", () => {
  modal.style.display = "none";
});

/* =========================
   FECHAR MODAL CLICANDO FORA
========================= */
window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
