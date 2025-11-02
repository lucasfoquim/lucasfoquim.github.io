// — Cria a chave "produtos-selecionados" se ainda não existir
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// — Quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);  // mostra os produtos disponíveis
  atualizaCesto();              // mostra os produtos já no cesto
});

// — Cria os produtos normais da loja
function carregarProdutos(produtos) {
  const secProdutos = document.getElementById("produtos");

  produtos.forEach(produto => {
    const artigo = criarProduto(produto);
    secProdutos.appendChild(artigo);
  });
}

// — Cria o <article> de um produto da loja
function criarProduto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h2");
  titulo.textContent = produto.title;

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;
  imagem.width = 150;

  const preco = document.createElement("p");
  preco.textContent = `Preço: €${produto.price.toFixed(2)}`;

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";

  // Quando o botão for clicado → adiciona o produto ao localStorage
  botao.addEventListener("click", () => {
    adicionarProdutoAoCesto(produto);
    atualizaCesto(); // Atualiza a secção do cesto
  });

  artigo.append(titulo, imagem, preco, botao);
  return artigo;
}

// — Adiciona produto ao localStorage
function adicionarProdutoAoCesto(produto) {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
  lista.push(produto);
  localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
}

// — Atualiza o cesto (cria os artigos no DOM)
function atualizaCesto() {
  const secCesto = document.getElementById("cesto");
  secCesto.innerHTML = "<h2>Produtos Selecionados</h2>";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  if (lista.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "O cesto está vazio.";
    secCesto.appendChild(vazio);
    return;
  }

  let total = 0;

  lista.forEach(produto => {
    const artigo = criaProdutoCesto(produto);
    secCesto.appendChild(artigo);
    total += produto.price;
  });

  // Mostra o preço total
  const precoTotal = document.createElement("h3");
  precoTotal.textContent = `Total: €${total.toFixed(2)}`;
  secCesto.appendChild(precoTotal);
}

// — Cria o <article> de um produto dentro do cesto
function criaProdutoCesto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h4");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = `€${produto.price.toFixed(2)}`;

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";

  // Ao clicar → remove o produto e atualiza o localStorage
  botaoRemover.addEventListener("click", () => {
    removerProdutoDoCesto(produto.id);
    atualizaCesto(); // Atualiza visualmente o cesto
  });

  artigo.append(titulo, preco, botaoRemover);
  return artigo;
}

// — Remove o produto do localStorage
function removerProdutoDoCesto(idProduto) {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

  // Usa filter para criar uma nova lista sem o produto a remover
  const novaLista = lista.filter(produto => produto.id !== idProduto);

  // Guarda novamente no localStorage
  localStorage.setItem("produtos-selecionados", JSON.stringify(novaLista));
}
