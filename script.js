
let baralho = [];
let maoJogador = [];
let maoDealer = [];
let pontuacaoJogador = 0;
let pontuacaoDealer = 0;
let jogoEmAndamento = false;


const pontuacaoJogadorEl = document.getElementById('pontuacao-jogador');
const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasJogadorEl = document.getElementById('cartas-jogador');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-resultado');

const btnPedir = document.getElementById('btn-pedir');
const btnParar = document.getElementById('btn-parar');
const btnNovoJogo = document.getElementById('btn-novo-jogo');

btnNovoJogo.addEventListener('click', iniciarJogo);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', turnoDealer);

function criarBaralho() {
    const naipes = ['C', 'O', 'P', 'E'];
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    baralho = [];

    for (let naipe of naipes) {
        for (let valor of valores) {
            baralho.push({ valor: valor, naipe: naipe });
        }
    }
}

function embaralharBaralho() {
    for (let i = baralho.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
    }
}
function iniciarJogo() {
    jogoEmAndamento = true;
    criarBaralho();
    embaralharBaralho();


    maoJogador = [pegarCarta(), pegarCarta()];
    maoDealer = [pegarCarta(), pegarCarta()];

    
    mensagemResultadoEl.textContent = '';
    btnPedir.disabled = false;
    btnParar.disabled = false;

    renderizarJogo();
}

function pegarCarta() {
    return baralho.pop();
}
function renderizarJogo() {

    cartasJogadorEl.innerHTML = '';
    cartasDealerEl.innerHTML = '';


    maoJogador.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.png`;
        cartasJogadorEl.appendChild(imgCarta);
    });

    
    const primeiraCartaDealer = document.createElement('img');
    primeiraCartaDealer.src = `images/${maoDealer[0].naipe}${maoDealer[0].valor}.png`;
    cartasDealerEl.appendChild(primeiraCartaDealer);
    
    const cartaVirada = document.createElement('img');
    cartaVirada.src = 'images/verso.png'; 
    cartasDealerEl.appendChild(cartaVirada);


    calcularPontuacoes();
    pontuacaoJogadorEl.textContent = pontuacaoJogador;
    pontuacaoDealerEl.textContent = ''; 
}

function calcularPontuacao(mao) {
    let pontuacao = 0;
    let ases = 0;
    for (let carta of mao) {
        if (carta.valor === 'J' || carta.valor === 'Q' || carta.valor === 'K') {
            pontuacao += 10;
        } else if (carta.valor === 'A') {
            ases += 1;
            pontuacao += 11;
        } else {
            pontuacao += parseInt(carta.valor);
        }
    }
    
    while (pontuacao > 21 && ases > 0) {
        pontuacao -= 10;
        ases--;
    } 
    return pontuacao;
}

function calcularPontuacoes() {
    pontuacaoJogador = calcularPontuacao(maoJogador);
    pontuacaoDealer = calcularPontuacao(maoDealer);
}

function pedirCarta() {
    if (!jogoEmAndamento) return;
    
    maoJogador.push(pegarCarta());
    renderizarAposPedir(); 

    if (pontuacaoJogador > 21) {
        finalizarJogo('Você estourou! Dealer vence.');
    }
}

function renderizarAposPedir() {

    const novaCarta = maoJogador[maoJogador.length - 1];
    const imgCarta = document.createElement('img');
    imgCarta.src = `images/${novaCarta.naipe}${novaCarta.valor}.png`;
    cartasJogadorEl.appendChild(imgCarta);
    

    pontuacaoJogador = calcularPontuacao(maoJogador);
    pontuacaoJogadorEl.textContent = pontuacaoJogador;
}
function turnoDealer() {
    if (!jogoEmAndamento) return;
    

    cartasDealerEl.innerHTML = '';
    maoDealer.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.png`;
        cartasDealerEl.appendChild(imgCarta);
    });
    pontuacaoDealerEl.textContent = pontuacaoDealer;
    
    
    while (pontuacaoDealer < 17) {
        maoDealer.push(pegarCarta());
        pontuacaoDealer = calcularPontuacao(maoDealer);
    }
    
    
    cartasDealerEl.innerHTML = '';
    maoDealer.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.png`;
        cartasDealerEl.appendChild(imgCarta);
    });
    pontuacaoDealerEl.textContent = pontuacaoDealer;

    determinarVencedor();
}

function determinarVencedor() {
    if (pontuacaoDealer > 21) {
        finalizarJogo('Dealer estourou! Você venceu!');
    } else if (pontuacaoJogador > pontuacaoDealer) {
        finalizarJogo('Você venceu!');
    } else if (pontuacaoDealer > pontuacaoJogador) {
        finalizarJogo('Dealer venceu!');
    } else {
        finalizarJogo('Empate (Push)!');
    }
}

function finalizarJogo(mensagem) {
    jogoEmAndamento = false;
    mensagemResultadoEl.textContent = mensagem;
    btnPedir.disabled = true;
    btnParar.disabled = true;
}


iniciarJogo();