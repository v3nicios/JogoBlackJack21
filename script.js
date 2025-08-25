let baralho = [];
let maoJogador = [];
let maoDealer = [];
let pontuacaoJogador = 0;
let pontuacaoDealer = 0;
let betsaldo = 1000;
let apostaAtual = 0;
let jogadorTemBlackjack = false;
let jogoEmAndamento = false;

const pontuacaoJogadorEl = document.getElementById('pontuacao-jogador');
const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasJogadorEl = document.getElementById('cartas-jogador');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-resultado');
const saldobet = document.getElementById('saldojogador');
const apostaAtualEl = document.getElementById('bet-jogador');

const btnPedir = document.getElementById('btn-pedir');
const btnParar = document.getElementById('btn-parar');
const btnNovoJogo = document.getElementById('btn-novo-jogo');
const btnApostar = document.getElementById('bet');
const btnFicha05 = document.getElementById('f05');
const btnFicha10 = document.getElementById('f10');
const btnFicha20 = document.getElementById('f20');
const btnFicha50 = document.getElementById('f50');
const btnFicha100 = document.getElementById('f100');

btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', turnoDealer);
btnFicha05.addEventListener('click', function () { adicionarAposta(5)});
btnFicha10.addEventListener('click', function () { adicionarAposta(10)});
btnFicha20.addEventListener('click', function () { adicionarAposta(20)});
btnFicha50.addEventListener('click', function () { adicionarAposta(50)});
btnFicha100.addEventListener('click', function () { adicionarAposta(100)});

function prepararNovaRodada() {
    apostaAtual = 0;
    jogadorTemBlackjack = false;
    jogoEmAndamento = false;

    cartasJogadorEl.innerHTML = '';
    cartasDealerEl.innerHTML = '';
    pontuacaoJogadorEl.textContent = '';
    pontuacaoDealerEl.textContent = '';
    mensagemResultadoEl.textContent = 'Faça sua aposta...';
    apostaAtualEl.textContent = '0';

    document.getElementById('fichas').style.display = 'flex';
    btnApostar.hidden = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnNovoJogo.hidden = true;
}

function adicionarAposta(valor) {
    if (!jogoEmAndamento && betsaldo >= valor) {
        apostaAtual += valor;
        betsaldo -= valor;
        atualizarApostaNaTela();
        atualizarSaldoNaTela();
    } else if (betsaldo < valor) {
        mensagemResultadoEl.textContent = "Saldo insuficiente para esta ficha !";
    }
}

function iniciarJogo() {
    if (apostaAtual === 0) {
        mensagemResultadoEl.textContent = "Você precisa apostar para jogar!";
        return;
    }

    jogoEmAndamento = true;

    document.getElementById('fichas').style.display = "none";
    btnApostar.hidden = true;
    btnPedir.hidden = false;
    btnParar.hidden = false;

    criarBaralho();
    embaralharBaralho();

    maoJogador = [pegarCarta(), pegarCarta()];
    maoDealer = [pegarCarta(), pegarCarta()];

    mensagemResultadoEl.textContent = '';
    renderizarJogo();

    if (pontuacaoJogador === 21) {
        jogadorTemBlackjack = true;
        mensagemResultadoEl.textContent = "Blackjack!";
        btnPedir.disabled = true;
        btnParar.disabled = true;
        setTimeout(turnoDealer, 1500);
    } else {
        jogadorTemBlackjack = false;
        btnPedir.disabled = false;
        btnParar.disabled = false;
    }
}

function finalizarJogo(mensagem, resultado) {
    if (resultado === 'vitoria' && jogadorTemBlackjack) {
        betsaldo += apostaAtual * 2.5;
        mensagem = "Blackjack! Você Venceu!";
    } else if (resultado === 'vitoria') {
        betsaldo += apostaAtual * 2;
    } else if (resultado === 'empate') {
        betsaldo += apostaAtual;
    }

    atualizarSaldoNaTela();
    jogoEmAndamento = false;
    mensagemResultadoEl.textContent = mensagem;

    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnNovoJogo.hidden = false;
}

function turnoDealer() {
    if (!jogoEmAndamento && maoJogador.length < 2) return;
    
    jogoEmAndamento = false;

    cartasDealerEl.innerHTML = '';
    maoDealer.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartasDealerEl.appendChild(imgCarta);
    });
    pontuacaoDealer = calcularPontuacao(maoDealer);
    pontuacaoDealerEl.textContent = pontuacaoDealer;

    while (pontuacaoDealer < 17) {
        maoDealer.push(pegarCarta());
        pontuacaoDealer = calcularPontuacao(maoDealer);
    }
    
    cartasDealerEl.innerHTML = '';
    maoDealer.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartasDealerEl.appendChild(imgCarta);
    });
    pontuacaoDealerEl.textContent = pontuacaoDealer;

    determinarVencedor();
}

function determinarVencedor() {
    if (pontuacaoJogador > 21) {
        finalizarJogo('Você estourou! Dealer vence.', 'derrota');
    } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
        finalizarJogo('Você venceu!', 'vitoria');
    } else if (pontuacaoDealer > pontuacaoJogador) {
        finalizarJogo('Dealer venceu!', 'derrota');
    } else {
        finalizarJogo('Empate (Push)!', 'empate');
    }
}

function pedirCarta() {
    if (!jogoEmAndamento) return;

    maoJogador.push(pegarCarta());
    renderizarAposPedir();

    if (pontuacaoJogador > 21) {
        finalizarJogo('Você estourou! Dealer vence.', 'derrota');
    } else if (pontuacaoJogador === 21) {
        turnoDealer();
    }
}

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

function pegarCarta() {
    return baralho.pop();
}

function calcularPontuacao(mao) {
    let pontuacao = 0;
    let ases = 0;
    for (let carta of mao) {
        if (['J', 'Q', 'K'].includes(carta.valor)) {
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

function atualizarSaldoNaTela() {
    saldobet.textContent = betsaldo;
}

function atualizarApostaNaTela() {
    apostaAtualEl.textContent = apostaAtual;
}

function renderizarJogo() {
    cartasJogadorEl.innerHTML = '';
    maoJogador.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartasJogadorEl.appendChild(imgCarta);
    });

    cartasDealerEl.innerHTML = '';
    const primeiraCartaDealer = document.createElement('img');
    primeiraCartaDealer.src = `images/${maoDealer[0].naipe}${maoDealer[0].valor}.webp`;
    cartasDealerEl.appendChild(primeiraCartaDealer);

    const cartaVirada = document.createElement('img');
    cartaVirada.src = 'images/verso.webp';
    cartasDealerEl.appendChild(cartaVirada);

    calcularPontuacoes();
    pontuacaoJogadorEl.textContent = pontuacaoJogador;

    const pontuacaoVisivelDealer = calcularPontuacao([maoDealer[0]]);
    pontuacaoDealerEl.textContent = pontuacaoVisivelDealer;
}

function renderizarAposPedir() {
    const novaCarta = maoJogador[maoJogador.length - 1];
    const imgCarta = document.createElement('img');
    imgCarta.src = `images/${novaCarta.naipe}${novaCarta.valor}.webp`;
    cartasJogadorEl.appendChild(imgCarta);

    pontuacaoJogador = calcularPontuacao(maoJogador);
    pontuacaoJogadorEl.textContent = pontuacaoJogador;
}

atualizarSaldoNaTela();
prepararNovaRodada();