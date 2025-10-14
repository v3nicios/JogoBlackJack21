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
let intervalIdFogos;
let intervalIdNaipe;
let intervalidderrota;
let valorGanho = 0;
let apostaAtivaParaExibir;
let modoTesteAtivado = false;
let somAtivo = true;
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
const btwin = document.getElementById('teste');
const somdaaposta = document.getElementById('somAposta');
const somdaficha = document.getElementById('somdeficha');
const perdeu = document.getElementById('perdeu');
const venceu = document.getElementById('venceu');
const estouro = document.getElementById('estouro');
const smzinho = document.getElementById('smzinho');
const btnToggleSom = document.getElementById('btn-toggle-som');

//colocar ?dev na url pra ativar o modo desenvolverdor
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("dev")) {
    btwin.style.display = "inline-block";
} else {
    btwin.style.display = "none";
}
btnToggleSom.addEventListener('click', toggleSom);


btwin.addEventListener('click', alternarModoTeste);
btnDividir.addEventListener('click', dividirMao);
btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', pararMaoAtual);
btnduplicar.addEventListener('click', duplicarAposta);
btnretibet.addEventListener('click', zeraaposta);
btnFicha05.addEventListener('click', function () { adicionarAposta(5) });
btnFicha10.addEventListener('click', function () { adicionarAposta(10) });
btnFicha20.addEventListener('click', function () { adicionarAposta(20) });
btnFicha50.addEventListener('click', function () { adicionarAposta(50) });
btnFicha100.addEventListener('click', function () { adicionarAposta(100) });




function toggleSom() {
    somAtivo = !somAtivo;

    if (somAtivo) {
        btnToggleSom.textContent = '🔊';

    } else {
        btnToggleSom.textContent = '🔇';
    }
}

function tocarSom(elementoAudio) {
    if (somAtivo) {

        elementoAudio.currentTime = 0;
        elementoAudio.play().catch(e => console.log("Erro ao tocar áudio:", e));

    }
}


function pararMaoAtual() {
    tocarSom(somdaaposta);
    if (emModoSplit && maoAtivaIndex === 1) {
        maoAtivaIndex = 2;
        renderizarMaos();
    } else {
        turnoDealer();
    }
}

function dividirMao() {
    tocarSom(somdaaposta);
    if (betsaldo < apostaAtual) {
        mensagemResultadoEl.textContent = "Saldo insuficiente para dividir!";
        return;
    }

    emModoSplit = true;
    maoAtivaIndex = 1;

    betsaldo -= apostaAtual;

    aposta2 = apostaAtual;
    atualizarSaldoNaTela()

    atualizarApostaNaTela();
    const areaFichaContainer = document.querySelector('.area-ficha');


    const areaBet1 = document.getElementById('area-bet-1');
    if (!document.getElementById('label-mao-1')) {
        const labelMao1 = document.createElement('span');
        labelMao1.id = 'label-mao-1';
        labelMao1.className = 'bet-label';
        labelMao1.textContent = 'Mão 1';
        areaBet1.appendChild(labelMao1);
    }



    if (!document.getElementById('area-bet-2')) {
        const novaAreaBet = document.createElement('div');
        novaAreaBet.className = 'area-bet';
        novaAreaBet.id = 'area-bet-2';

        const novoBotaoFicha = document.createElement('button');
        novoBotaoFicha.className = 'fichinha';



        const novoSpanBet = document.createElement('span');
        novoSpanBet.id = 'bet-jogador-2';

        novoBotaoFicha.appendChild(novoSpanBet);
        novaAreaBet.appendChild(novoBotaoFicha);

        const labelMao2 = document.createElement('span');
        labelMao2.id = 'label-mao-2';
        labelMao2.className = 'bet-label';
        labelMao2.textContent = 'Mão 2';
        novaAreaBet.appendChild(labelMao2);

        areaFichaContainer.appendChild(novaAreaBet);

    }


    maoJogador2 = [maoJogador.pop()];
    maoJogador.push(pegarCarta());
    maoJogador2.push(pegarCarta());

    btnDividir.hidden = true;
    btnduplicar.hidden = true;

    renderizarMaos();


}

function zeraaposta() {
    tocarSom(somdaficha);
    if (!jogoEmAndamento) {
        betsaldo += apostaAtual;
        apostaAtual = 0;
        atualizarApostaNaTela();
        atualizarSaldoNaTela();
    }
}


function prepararNovaRodada() {
    tocarSom(somdaaposta);

    pararAnimacao();
    apostaAtual = 0;
    jogadorTemBlackjack = false;
    jogoEmAndamento = false;
    document.getElementById('black').style.display = "block";


    emModoSplit = false;
    maoJogador = [];
    maoJogador2 = [];
    pontuacaoJogador2 = 0;
    aposta2 = 0;
    maoAtivaIndex = 1;


    const areaBet2 = document.getElementById('area-bet-2');
    if (areaBet2) {
        areaBet2.remove();
    }

    const labelMao1 = document.getElementById('label-mao-1');
    if (labelMao1) {
        labelMao1.remove();
    }

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
    tocarSom(somdaficha);
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
    tocarSom(somdaaposta);

    if (apostaAtual === 0) {
        mensagemResultadoEl.textContent = "Você precisa apostar para jogar!";
        return;
    }

    jogoEmAndamento = true;

    document.getElementById('fichas').style.display = "none";
    document.getElementById('black').style.display = "none";
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



    /*  const podeDividir = maoJogador.length === 2 && maoJogador[0].valor === maoJogador[1].valor;
     if (podeDividir && betsaldo >= apostaAtual) {
         btnDividir.hidden = false;
 
     } */

    /*  if (pontuacaoJogador === 10 || pontuacaoJogador === 11) {
         btnduplicar.hidden = false;
     } */

    if (pontuacaoJogador === 21) {
        tocarSom(smzinho);
        jogadorTemBlackjack = true;
        mensagemResultadoEl.textContent = "Blackjack!";
        setTimeout(turnoDealer, 1500);
    }
}

function finalizarJogo() {
    let mensagemFinal = '';


    let valorGanho1 = 0;
    if (pontuacaoJogador > 21) {
        mensagemFinal += 'Você estourou!<br>';
        iniciarAnimacaoDerrota();
        tocarSom(estouro);

    } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
        valorGanho1 = apostaAtual;
        betsaldo += apostaAtual * 2;
        mensagemFinal += `Você venceu! +${valorGanho1}<br>`;
        tocarSom(venceu);
        vitoriafirework();
        vitoriajogador();
    } else if (pontuacaoDealer > pontuacaoJogador) {
        mensagemFinal += 'Dealer venceu!<br>';
        iniciarAnimacaoDerrota();
    } else {
        betsaldo += apostaAtual;
        mensagemFinal += 'Empate!<br>';
    }


    if (emModoSplit) {
        let valorGanho2 = 0;
        if (pontuacaoJogador2 > 21) {
            mensagemFinal += 'Mão 2: Você estourou!<br>';
            tocarSom(estouro);
            iniciarAnimacaoDerrota();


        } else if (pontuacaoDealer > 21 || pontuacaoJogador2 > pontuacaoDealer) {
            valorGanho2 = aposta2;
            betsaldo += aposta2 * 2;
            mensagemFinal += `Mão 2: Você venceu! +${valorGanho2}<br>`;
            tocarSom(venceu);
            vitoriafirework();
            vitoriajogador();
        } else if (pontuacaoDealer > pontuacaoJogador2) {
            mensagemFinal += 'Mão 2: Dealer venceu!<br>';
            iniciarAnimacaoDerrota();
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

function verificarAcoesPossiveis() {

    btnduplicar.hidden = true;
    btnDividir.hidden = true;


    if (!emModoSplit && maoJogador.length === 2 && maoJogador[0].valor === maoJogador[1].valor && betsaldo >= apostaAtual) {
        btnDividir.hidden = false;
    }


    let maoAtiva = emModoSplit ? (maoAtivaIndex === 1 ? maoJogador : maoJogador2) : maoJogador;
    let pontuacaoAtiva = emModoSplit ? (maoAtivaIndex === 1 ? pontuacaoJogador : pontuacaoJogador2) : pontuacaoJogador;
    let apostaAtiva = emModoSplit ? (maoAtivaIndex === 1 ? apostaAtual : aposta2) : apostaAtual;


    if (maoAtiva.length === 2 && (pontuacaoAtiva === 10 || pontuacaoAtiva === 11) && betsaldo >= apostaAtiva) {
        btnduplicar.hidden = false;
    }
}

function turnoDealer() {
    jogoEmAndamento = false;
    btnPedir.hidden = true;
    btnParar.hidden = true;
    btnduplicar.hidden = true;
    btnDividir.hidden = true;
    mensagemResultadoEl.textContent = "Turno do Dealer...";
    if (!emModoSplit && pontuacaoJogador > 21) {
        finalizarJogo();
        return;
    }

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
    tocarSom(somdaaposta);
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

    if (modoTesteAtivado) {

        console.log("%cMODO TESTE: Pegando carta do baralho de teste.", "color: orange; font-weight: bold;");
        if (baralhoDeTeste.length > 0) {
            return baralhoDeTeste.shift();
        } else {
            console.warn("Baralho de teste acabou!");
            return { valor: 'K', naipe: 'C' };
        }
    } else {

        return baralho.pop();
    }
}

function alternarModoTeste() {

    modoTesteAtivado = !modoTesteAtivado;
    console.log('Modo de Teste:', modoTesteAtivado ? 'ATIVADO' : 'DESATIVADO');
    btwin.textContent = modoTesteAtivado ? 'TESTE (ON)' : 'TESTE (OFF)';
    btwin.classList.toggle('teste-ativo', modoTesteAtivado);
}


const baralhoDeTeste = [

    { valor: 'K', naipe: 'C' },
    { valor: 'A', naipe: 'P' },


    { valor: 'A', naipe: 'E' },
    { valor: '3', naipe: 'O' },

    //O DEALER VAI PUXAR ESSA
    { valor: '5', naipe: 'C' },

    //PROXIMA COMBINAÇÃO DE CARTAS
    { valor: '6', naipe: 'P' },
    { valor: '6', naipe: 'C' },

    // DEALER
    { valor: '7', naipe: 'C' },
    { valor: '8', naipe: 'C' },

    //PROXIMA A SER PUXADA NO DIVIDIR
    { valor: '5', naipe: 'C' },
    { valor: '4', naipe: 'C' },

    //PROXIMA DO PEGAR CARTA
    { valor: 'K', naipe: 'P' },
    { valor: 'A', naipe: 'E' },
    { valor: '3', naipe: 'O' },

    //OPÇÕES
    { valor: '5', naipe: 'C' },
    { valor: '5', naipe: 'P' }
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

    apostaAtualEl.textContent = apostaAtual;

    if (emModoSplit) {

        const aposta2El = document.getElementById('bet-jogador-2');
        if (aposta2El) {
            aposta2El.textContent = aposta2;
        }
    }


    pontuacaoJogador = calcularPontuacao(maoJogador);
    if (emModoSplit) {
        pontuacaoJogador2 = calcularPontuacao(maoJogador2);
    }

    const mao1Container = document.getElementById('mao-1-container');
    const tituloMao1 = document.querySelector('#mao-1-container h2');
    const cartas1El = document.getElementById('cartas-jogador-1');
    cartas1El.innerHTML = '';
    maoJogador.forEach(carta => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        cartas1El.appendChild(imgCarta);
    });

    if (emModoSplit) {
        tituloMao1.innerHTML = `Mão 1: <span id="pontuacao-jogador-1">${pontuacaoJogador}</span>`;
    } else {
        tituloMao1.innerHTML = `Sua Mão: <span id="pontuacao-jogador-1">${pontuacaoJogador}</span>`;
    }

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



    verificarAcoesPossiveis();
    renderizarMaoDealer(false);
}
function duplicarAposta() {
    tocarSom(smzinho);
    if (emModoSplit) {

        let apostaAtiva = (maoAtivaIndex === 1) ? apostaAtual : aposta2;

        if (betsaldo < apostaAtiva) {
            mensagemResultadoEl.textContent = "Saldo insuficiente para duplicar!";
            return;
        }

        betsaldo -= apostaAtiva;

        if (maoAtivaIndex === 1) {
            apostaAtual *= 2;
            maoJogador.push(pegarCarta());
        } else {
            aposta2 *= 2;
            maoJogador2.push(pegarCarta());
        }

        atualizarSaldoNaTela();
        renderizarMaos();



        setTimeout(pararMaoAtual, 1000);

    } else {

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
}


function iniciarAnimacaoDerrota() {
    tocarSom(perdeu);
    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }


    function frame() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {

            return;
        }

        var ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        confetti({
            particleCount: 20,
            startVelocity: 0,
            ticks: ticks,
            origin: {
                x: Math.random(),
                y: (Math.random() * skew) - 0.2
            },
            colors: ['#FF4136', '#85144b', '#B10DC9'],
            shapes: ['square'],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4)
        });


        animationFrameId = requestAnimationFrame(frame);
    }

    frame();
}


function vitoriajogador() {
    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var scalar = 2;
    var paus = confetti.shapeFromText({ text: '♣️', scalar });
    var copas = confetti.shapeFromText({ text: '♥️', scalar });
    var espadas = confetti.shapeFromText({ text: '♠️', scalar });
    var ouros = confetti.shapeFromText({ text: '♦️', scalar });

    var varpaus = { spread: 360, ticks: 100, gravity: 0, decay: 0.96, startVelocity: 15, shapes: [paus], scalar };
    var varouros = { spread: 360, ticks: 300, gravity: 0, decay: 0.96, startVelocity: 20, shapes: [ouros], scalar };
    var varespadas = { spread: 360, ticks: 300, gravity: 0, decay: 0.96, startVelocity: 20, shapes: [espadas], scalar };
    var varcops = { spread: 360, ticks: 300, gravity: 0, decay: 0.96, startVelocity: 20, shapes: [copas], scalar };
    var varpaus = { spread: 360, ticks: 300, gravity: 0, decay: 0.96, startVelocity: 20, shapes: [paus], scalar };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    intervalIdNaipe = setInterval(function shoot() {

        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            return clearInterval(intervalIdNaipe);
        }

        var particleCount = 11 * (timeLeft / duration);

        confetti({
            ...varpaus,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...varcops,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
        confetti({
            ...varespadas,
            particleCount,
            origin: { x: randomInRange(0.9, 0.9), y: Math.random() - 0.2 }
        });
        confetti({
            ...varouros,
            particleCount,
            origin: { x: randomInRange(0.4, 0.3), y: Math.random() - 0.2 }
        });

    }, 250);
}

function vitoriafirework() {
    var duration = 4 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    var coresDaVitoria = ['#D3AF37',
        '#a31704ff', '#fcfcfcff'
    ];

    intervalIdFogos = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(intervalIdFogos);
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
        confetti({
            ...defaults, particleCount,
            colors: coresDaVitoria,
            origin: { x: randomInRange(0.3, 0.6), y: Math.random() - 0.2 }
        });


    }, 250);


}

function pararAnimacao() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (intervalIdFogos) {
        clearInterval(intervalIdFogos);
        intervalIdFogos = null;


    }
    if (intervalIdNaipe) {
        clearInterval(intervalIdNaipe);
        intervalIdNaipe = null;

    }
    confetti.reset();

}

atualizarSaldoNaTela();
prepararNovaRodada();



