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


let maoJogador2 = [];
let pontuacaoJogador2 = 0;
let aposta2 = 0;
let emModoSplit = false;
let maoAtivaIndex = 1;


const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-resultado');
const saldobet = document.getElementById('saldojogador');
const apostaAtualEl = document.getElementById('bet-jogador');


const btnDividir = document.getElementById('btn-dividir');
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
const btnretibet = document.getElementById('beti');


btnDividir.addEventListener('click', dividirMao);
btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada,);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', pararMaoAtual);
btnduplicar.addEventListener('click', duplicarAposta);
btnretibet.addEventListener('click', zeraaposta)
btnFicha05.addEventListener('click', function () { adicionarAposta(5) });
btnFicha10.addEventListener('click', function () { adicionarAposta(10) });
btnFicha20.addEventListener('click', function () { adicionarAposta(20) });
btnFicha50.addEventListener('click', function () { adicionarAposta(50) });
btnFicha100.addEventListener('click', function () { adicionarAposta(100) });


function pararMaoAtual() {
    if (emModoSplit && maoAtivaIndex === 1) {
        maoAtivaIndex = 2;
        renderizarMaos();
    } else {
        turnoDealer();
    }
}

function dividirMao() {
    if (betsaldo < apostaAtual) {
        mensagemResultadoEl.textContent = "Saldo insuficiente para dividir!";
        return;
    }

    emModoSplit = true;
    maoAtivaIndex = 1;

    betsaldo -= apostaAtual;

    apostaAtual = apostaAtual * 2;
    atualizarSaldoNaTela();
    atualizarApostaNaTela();


    maoJogador2 = [maoJogador.pop()];
    maoJogador.push(pegarCarta());
    maoJogador2.push(pegarCarta());

    btnDividir.hidden = true;
    btnduplicar.hidden = true;

    renderizarMaos();
}

function zeraaposta() {
    if (!jogoEmAndamento) {
        betsaldo += apostaAtual;
        apostaAtual = 0;
        atualizarApostaNaTela();
        atualizarSaldoNaTela();
    }
}


function prepararNovaRodada() {
    pararAnimacao();
    apostaAtual = 0;
    jogadorTemBlackjack = false;
    jogoEmAndamento = false;


    emModoSplit = false;
    maoJogador = [];
    maoJogador2 = [];
    pontuacaoJogador2 = 0;
    aposta2 = 0;
    maoAtivaIndex = 1;


    cartasDealerEl.innerHTML = '';
    pontuacaoDealerEl.textContent = '';

    mensagemResultadoEl.textContent = 'Faça sua aposta...';
    apostaAtualEl.textContent = '0';
    document.getElementById('mao-2-container').hidden = true;
    document.getElementById('mao-1-container').classList.remove('mao-ativa');
    document.getElementById('fichas').style.display = 'flex';
    btnApostar.hidden = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnNovoJogo.hidden = true;
    btnduplicar.hidden = true;
    btnDividir.hidden = true;

    document.getElementById('area-dealer').hidden = true;
    document.getElementById('area-jogador').hidden = true;
    document.getElementById('area-jogador').style.display = 'none';
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
    document.getElementById('area-jogador').style.display = 'flex';
    maoJogador = [pegarCarta(), pegarCarta()];
    maoDealer = [pegarCarta(), pegarCarta()];

    mensagemResultadoEl.textContent = '';
    renderizarMaos();



    const podeDividir = maoJogador.length === 2 && maoJogador[0].valor === maoJogador[1].valor;
    if (podeDividir && betsaldo >= apostaAtual) {
        btnDividir.hidden = false;

    }

    if (pontuacaoJogador === 10 || pontuacaoJogador === 11) {
        btnduplicar.hidden = false;
    }

    if (pontuacaoJogador === 21) {
        jogadorTemBlackjack = true;
        mensagemResultadoEl.textContent = "Blackjack!";
        setTimeout(turnoDealer, 1500);
    }
}

function finalizarJogo() {
    let mensagemFinal = '';


    let valorGanho1 = 0;
    if (pontuacaoJogador > 21) {
        mensagemFinal += 'Mão 1: Você estourou!<br>';
    } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
        valorGanho1 = apostaAtual;
        betsaldo += apostaAtual * 2;
        mensagemFinal += `Mão 1: Você venceu! +${valorGanho1}<br>`;
    } else if (pontuacaoDealer > pontuacaoJogador) {
        mensagemFinal += 'Mão 1: Dealer venceu!<br>';
    } else {
        betsaldo += apostaAtual;
        mensagemFinal += 'Mão 1: Empate!<br>';
    }


    if (emModoSplit) {
        let valorGanho2 = 0;
        if (pontuacaoJogador2 > 21) {
            mensagemFinal += 'Mão 2: Você estourou!<br>';
        } else if (pontuacaoDealer > 21 || pontuacaoJogador2 > pontuacaoDealer) {
            valorGanho2 = aposta2;
            betsaldo += aposta2 * 2;
            mensagemFinal += `Mão 2: Você venceu! +${valorGanho2}<br>`;
        } else if (pontuacaoDealer > pontuacaoJogador2) {
            mensagemFinal += 'Mão 2: Dealer venceu!<br>';
        } else {
            betsaldo += aposta2;
            mensagemFinal += 'Mão 2: Empate!<br>';
        }
    }

    mensagemResultadoEl.innerHTML = mensagemFinal;
    atualizarSaldoNaTela();
    jogoEmAndamento = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnNovoJogo.hidden = false;
    btnDividir.hidden = true;
    btnduplicar.hidden = true;
}


function turnoDealer() {
    jogoEmAndamento = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnduplicar.hidden = true;
    btnDividir.hidden = true;
    mensagemResultadoEl.textContent = "Turno do Dealer...";

    renderizarMaoDealer(true);
    setTimeout(puxarCartaDealer, 1500);
}

function renderizarMaoDealer(mostrarTudo) {
    cartasDealerEl.innerHTML = '';
    if (!maoDealer || maoDealer.length === 0) return;

    if (mostrarTudo) {
        pontuacaoDealer = calcularPontuacao(maoDealer);
        pontuacaoDealerEl.textContent = pontuacaoDealer;
        maoDealer.forEach(carta => {
            const imgCarta = document.createElement('img');
            imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
            cartasDealerEl.appendChild(imgCarta);
        });
    } else {
        pontuacaoDealerEl.textContent = calcularPontuacao([maoDealer[0]]);
        const primeiraCarta = document.createElement('img');
        primeiraCarta.src = `images/${maoDealer[0].naipe}${maoDealer[0].valor}.webp`;
        cartasDealerEl.appendChild(primeiraCarta);

        const cartaVirada = document.createElement('img');
        cartaVirada.src = 'images/verso.webp';
        cartasDealerEl.appendChild(cartaVirada);
    }
}


function puxarCartaDealer() {
    pontuacaoDealer = calcularPontuacao(maoDealer);
    if (pontuacaoDealer < 17) {
        mensagemResultadoEl.textContent = "Dealer está jogando...";
        maoDealer.push(pegarCarta());
        renderizarMaoDealer(true);
        setTimeout(puxarCartaDealer, 1500);
    } else {
        mensagemResultadoEl.textContent = "";
        finalizarJogo();
    }
}



function pedirCarta() {
    if (!jogoEmAndamento) return;
    btnduplicar.hidden = true;
    btnDividir.hidden = true;

    if (emModoSplit) {
        if (maoAtivaIndex === 1) {
            maoJogador.push(pegarCarta());
        } else {
            maoJogador2.push(pegarCarta());
        }
    } else {
        maoJogador.push(pegarCarta());
    }

    renderizarMaos();

    let pontuacaoAtiva;
    if (emModoSplit) {
        pontuacaoAtiva = (maoAtivaIndex === 1) ? pontuacaoJogador : pontuacaoJogador2;
    } else {
        pontuacaoAtiva = pontuacaoJogador;
    }

    if (pontuacaoAtiva > 21) {
        pararMaoAtual();
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
/* function pegarCarta() {
    if (baralhoDeTeste.length > 0) {
        return baralhoDeTeste.shift(); 
    } else {
        console.log("Baralho de teste acabou!");
        return { valor: 'A', naipe: 'E' };
    }
} */

const baralhoDeTeste = [
    
    { valor: '8', naipe: 'C' },  
    { valor: '8', naipe: 'P' },  
    
 
    { valor: 'A', naipe: 'E' },  
    { valor: '3', naipe: 'O' },  

 
    { valor: '10', naipe: 'C' }, 
    { valor: 'K', naipe: 'P' }   
];

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

function atualizarSaldoNaTela() {
    saldobet.textContent = betsaldo;
}

function atualizarApostaNaTela() {
    apostaAtualEl.textContent = apostaAtual;
}

function renderizarMaos() {
    pontuacaoJogador = calcularPontuacao(maoJogador);
    if (emModoSplit) {
        pontuacaoJogador2 = calcularPontuacao(maoJogador2);
    }


    const mao1Container = document.getElementById('mao-1-container');
    const cartas1El = document.getElementById('cartas-jogador-1');
    cartas1El.innerHTML = '';
    maoJogador.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartas1El.appendChild(imgCarta);
    });
    document.getElementById('pontuacao-jogador-1').textContent = pontuacaoJogador;



    const mao2Container = document.getElementById('mao-2-container');
    if (emModoSplit) {
        mao2Container.hidden = false;
        const cartas2El = document.getElementById('cartas-jogador-2');
        cartas2El.innerHTML = '';
        maoJogador2.forEach(carta => {
            const imgCarta = document.createElement('img');
            imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
            cartas2El.appendChild(imgCarta);
        });
        document.getElementById('pontuacao-jogador-2').textContent = pontuacaoJogador2;

    }



    mao1Container.classList.toggle('mao-ativa', emModoSplit && maoAtivaIndex === 1);
    mao2Container.classList.toggle('mao-ativa', emModoSplit && maoAtivaIndex === 2);

    renderizarMaoDealer(false);
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
    btnDividir.hidden = true;

    maoJogador.push(pegarCarta());
    renderizarMaos();

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

