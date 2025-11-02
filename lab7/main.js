let produtos = [];
let cesto = [];

// === Inicializar LocalStorage ===
function initLocalStorage() {
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }
  cesto = JSON.parse(localStorage.getItem("produtos-selecionados"));
}

// === Atualizar LocalStorage ===
function atualizarLocalStorage() {
  localStorage.setItem("produtos-selecionados", JSON.stringify(cesto));
}

// === Criar artigo do produto na loja ===
function criarProduto(produto) {
  const article = document.createElement("article");
  article.classList.add("produto");

  const img = document.createElement("img");
  img.src = produto.image || produto.imagem || "https://via.placeholder.com/150";
  img.alt = produto.title || produto.name || "Produto";

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title || produto.name || "Sem nome";

  const descricao = document.createElement("p");
  descricao.textContent = produto.description || produto.descricao || "Sem descrição disponível.";

  const preco = document.createElement("p");
  preco.classList.add("preco");
  preco.textContent = produto.price ? produto.price.toFixed(2) + " €" : "Preço indisponível";

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  botao.addEventListener("click", () => {
    cesto.push(produto);
    atualizarLocalStorage();
    atualizaCesto();
  });

  article.append(img, titulo, descricao, preco, botao);
  return article;
}

// === Criar artigo no cesto ===
function criaProdutoCesto(produto, index) {
  const article = document.createElement("article");
  article.classList.add("produto-cesto");

  const nome = document.createElement("h4");
  nome.textContent = produto.title || produto.name;

  const preco = document.createElement("p");
  preco.textContent = produto.price.toFixed(2) + " €";

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", () => {
    cesto.splice(index, 1);
    atualizarLocalStorage();
    atualizaCesto();
  });

  article.append(nome, preco, botaoRemover);
  return article;
}

// === Atualizar visual do cesto ===
function atualizaCesto() {
  const sec = document.getElementById("cesto");
  sec.innerHTML = "";

  let total = 0;

  if (cesto.length === 0) {
    sec.innerHTML = "<p>Cesto vazio.</p>";
  } else {
    cesto.forEach((p, i) => {
      sec.appendChild(criaProdutoCesto(p, i));
      total += p.price;
    });
  }

  const totalElem = document.createElement("p");
  totalElem.id = "total";
  totalElem.textContent = `Total: ${total.toFixed(2)} €`;
  sec.appendChild(totalElem);
}

// === Função principal: mostrar produtos na loja ===
function mostrarProdutos(lista) {
  const sec = document.getElementById("produtos");
  sec.innerHTML = "";

  if (!lista || lista.length === 0) {
    sec.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach(p => sec.appendChild(criarProduto(p)));
}

// === Obter campo de categoria de forma genérica ===
function getCategoryField(prod) {
  if (!prod) return "";
  const keys = ["category", "categoria", "type"];
  for (const k of keys) if (prod[k]) return String(prod[k]).toLowerCase();
  return "";
}

// === Preencher select de categorias ===
function preencherCategorias() {
  const select = document.getElementById("categorias");
  const cats = new Set(produtos.map(p => getCategoryField(p)).filter(Boolean));
  select.innerHTML = `<option value="todas">Todas as categorias</option>`;
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    select.appendChild(opt);
  });
}

// === Filtrar, ordenar e pesquisar ===
function filtrarProdutos() {
  const categoria = document.getElementById("categorias").value;
  const ordem = document.getElementById("ordenar").value;
  const pesquisa = document.getElementById("pesquisa").value.toLowerCase().trim();

  let lista = produtos.slice();

  if (categoria !== "todas") {
    lista = lista.filter(p => getCategoryField(p) === categoria);
  }

  if (pesquisa) {
    lista = lista.filter(p => (p.title || "").toLowerCase().includes(pesquisa));
  }

  if (ordem === "asc") lista.sort((a, b) => a.price - b.price);
  else if (ordem === "desc") lista.sort((a, b) => b.price - a.price);

  mostrarProdutos(lista);
}

// === Função de compra ===
async function finalizarCompra() {
  const cupao = document.getElementById("cupao").value;
  const estudante = document.getElementById("estudante").checked;

  if (cesto.length === 0) {
    alert("O cesto está vazio!");
    return;
  }

  const produtosIds = cesto.map(p => p.id);
  const dados = {
    products: produtosIds,
    coupon: cupao || null,
    is_student: estudante
  };

  try {
    const resp = await fetch("https://deisishop.pythonanywhere.com/api/buy/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    if (!resp.ok) {
      alert("Erro ao contactar o servidor.");
      return;
    }

    const resultado = await resp.json();
    alert(
      `Compra realizada!\nReferência: ${resultado.reference}\nTotal: ${resultado.total.toFixed(
        2
      )} €`
    );

    cesto = [];
    atualizarLocalStorage();
    atualizaCesto();
  } catch (e) {
    console.error("Erro:", e);
    alert("Ocorreu um erro ao contactar o servidor.");
  }
}

// === Inicialização ===
document.addEventListener("DOMContentLoaded", async () => {
  initLocalStorage();
  atualizaCesto();

  try {
    const resp = await fetch("https://deisishop.pythonanywhere.com/products/");
    produtos = await resp.json();

    preencherCategorias();
    filtrarProdutos();

    document.getElementById("categorias").addEventListener("change", filtrarProdutos);
    document.getElementById("ordenar").addEventListener("change", filtrarProdutos);
    document.getElementById("pesquisa").addEventListener("input", filtrarProdutos);

    document.getElementById("btn-comprar").addEventListener("click", finalizarCompra);
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
    document.getElementById("produtos").innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
});
