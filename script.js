let baralho = [];
let maoJogador = [];
let maoDealer = [];
let pontuacaoJogador = 0;
let pontuacaoDealer = 0;
let betsaldo = 1000;
let apostaAtual = 0;
let jogadorTemBlackjack = false;
let jogoEmAndamento = false;
let animationFrameId;
let intervalId;
let valorGanho = 0;

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
const btnduplicar = document.getElementById('dubliar')
const btnFicha05 = document.getElementById('f05');
const btnFicha10 = document.getElementById('f10');
const btnFicha20 = document.getElementById('f20');
const btnFicha50 = document.getElementById('f50');
const btnFicha100 = document.getElementById('f100');

btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada,);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', turnoDealer);
btnduplicar.addEventListener('click', duplicarAposta);
btnFicha05.addEventListener('click', function () { adicionarAposta(5) });
btnFicha10.addEventListener('click', function () { adicionarAposta(10) });
btnFicha20.addEventListener('click', function () { adicionarAposta(20) });
btnFicha50.addEventListener('click', function () { adicionarAposta(50) });
btnFicha100.addEventListener('click', function () { adicionarAposta(100) });



function prepararNovaRodada() {
    apostaAtual = 0;
    jogadorTemBlackjack = false;
    jogoEmAndamento = false;
    pararAnimacao();

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
    btnduplicar.hidden = true;
    
    document.getElementById('area-dealer').hidden = true;
    document.getElementById('area-jogador').hidden = true;
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
    document.getElementById('area-dealer').hidden = false;
    document.getElementById('area-jogador').hidden = false;
    btnApostar.hidden = true;
    btnPedir.hidden = false;
    btnParar.hidden = false;

    criarBaralho();
    embaralharBaralho();

    maoJogador = [pegarCarta(), pegarCarta()];
    maoDealer = [pegarCarta(), pegarCarta()];

    mensagemResultadoEl.textContent = '';
    renderizarJogo();

    if ( pontuacaoJogador === 10 || pontuacaoJogador === 11) {
        btnduplicar.hidden = false;
    }
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
        valorGanho = apostaAtual * 1.5;
        betsaldo += apostaAtual * 2.5;
        mensagem = `Blackjack! Você Venceu! +${valorGanho}`;
    } else if (resultado === 'vitoria') {
        
        betsaldo += apostaAtual * 2;
        valorGanho = apostaAtual;
        mensagem = `Você venceu! Você ganhou: +${valorGanho}`;
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

    jogoEmAndamento = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnduplicar.hidden = true;
    mensagemResultadoEl.textContent = "Turno encerrado vez do Dealer";

    renderizarMaoDealer();

    if (maoJogador < maoDealer) {
        determinarVencedor
    }
    else {
        setTimeout(puxarCartaDealer, 1500);
    }
}

function renderizarMaoDealer() {
    cartasDealerEl.innerHTML = '';
    maoDealer.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartasDealerEl.appendChild(imgCarta);
    });
    pontuacaoDealer = calcularPontuacao(maoDealer);
    pontuacaoDealerEl.textContent = pontuacaoDealer;
}

function puxarCartaDealer() {

    if (pontuacaoDealer <= 17) {
        mensagemResultadoEl.textContent = "Dealer está jogando...";


        maoDealer.push(pegarCarta());


        renderizarMaoDealer();


        setTimeout(puxarCartaDealer, 2500);
    } else {

        mensagemResultadoEl.textContent = "";
        determinarVencedor();

    }
}

function determinarVencedor() {
    if (pontuacaoJogador > 21) {

        finalizarJogo('Você estourou! Dealer vence.', 'derrota');
        iniciarAnimacaoDerrota();
    } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
        finalizarJogo('Você venceu!', 'vitoria');
        vitoriajogador();
        vitoriafirework();
    } else if (pontuacaoDealer > pontuacaoJogador) {
        finalizarJogo('Dealer venceu!', 'derrota');
        iniciarAnimacaoDerrota();
    } else {
        finalizarJogo('Empate (Push)!', 'empate');
    }
}

function pedirCarta() {
    if (!jogoEmAndamento) return;
    btnduplicar.hidden = true;
   
    maoJogador.push(pegarCarta());
    renderizarAposPedir();

    if (pontuacaoJogador > 21) {
        iniciarAnimacaoDerrota();
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

function duplicarAposta() {
    
    if (betsaldo < apostaAtual) {
        mensagemResultadoEl.textContent = "Saldo insuficiente para duplicar a aposta!";
        return;
    }

    
    betsaldo -= apostaAtual;
    apostaAtual *= 2; 
    atualizarSaldoNaTela();
    atualizarApostaNaTela();

    
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnduplicar.hidden = true; 

    maoJogador.push(pegarCarta());
    renderizarAposPedir();

        
    setTimeout(turnoDealer, 1500);
    
}

function iniciarAnimacaoDerrota() {
    var duration = 1 * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    (function frame() {
        var timeLeft = animationEnd - Date.now();
        var ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 10,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                y: (Math.random() * skew) - 0.2
            },

            colors: ['#FF4136', '#85144b', '#B10DC9'],
            shapes: ['circle'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });

        if (timeLeft > 0) {
            animationFrameId = requestAnimationFrame(frame);
        }
    }());
}

function vitoriajogador() {
    var end = Date.now() + (40 * 1000);


    var colors = ['#D3AF37',
        '#a31704ff',

        '#ffffffff',
        '#039203ff'


    ];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            animationFrameId = requestAnimationFrame(frame);
        }
    }());
}

function vitoriafirework() {
    var duration = 50 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    var coresDaVitoria = ['#D3AF37',
        '#a31704ff',

        '#ffffffff',
        '#039203ff'
    ];

    intervalId = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(intervalId);
        }

        var particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults, particleCount,
            colors: coresDaVitoria,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults, particleCount,
            colors: coresDaVitoria,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);


}
function pararAnimacao() {

    if (animationFrameId) {

        cancelAnimationFrame(animationFrameId);

        animationFrameId = null;
    }
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

atualizarSaldoNaTela();
prepararNovaRodada();