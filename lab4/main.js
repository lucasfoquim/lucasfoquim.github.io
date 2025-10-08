function saudar() {
        alert('Olá!')
}

function mensagemDuploClique() {
    alert('Fizeste duplo clique!');
}

let counter = 0;
function count() {
    counter++;
    alert(counter);
}

function entrarCaixa() {
    const caixa = document.querySelector("#caixa");
    caixa.textContent = "Rato dentro!";
}

function sairCaixa() {
    const caixa = document.querySelector("#caixa");
    caixa.textContent = "Rato fora!";
}

