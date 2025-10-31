let somAtivo = true;

const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-bnt');
const saldobet = document.getElementById('saldojogador');
const apostaAtualEl = document.getElementById('bet-jogador');
const FOTO_1_URL = "url('images/Perfil1.jpg')";
const FOTO_2_URL = "url('images/Perfil2.jpg')";


const btnDividir = document.getElementById('btn-dividir');
const btnPedir = document.getElementById('btn-pedir');
const btnParar = document.getElementById('btn-parar');
const btnNovoJogo = document.getElementById('btn-novo-jogo');
const btnApostar = document.getElementById('bet');
const btnduplicar = document.getElementById('dubliar');
const btnFicha05 = document.getElementById('f05');
const btnFicha10 = document.getElementById('f10');
const btnFicha20 = document.getElementById('f20');
const btnFicha50 = document.getElementById('f50');
const btnFicha100 = document.getElementById('f100');
const btnretibet = document.getElementById('beti');
const somdaaposta = document.getElementById('somAposta');
const venifotosom = document.getElementById('mike');
const ParaNaipe = document.getElementById('paranaipe');
document.addEventListener('DOMContentLoaded', iniciarNeveNaipes);

const btnToggleSom = document.getElementById('btn-toggle-som');
const exemploPontuacaoEl = document.getElementById('exemplo-pontuacao');
const exemploCartasEl = document.getElementById('exemplo-cartas');


const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("dev")) {
    document.getElementById("qrcode").style.display = "flex";
} else {
    document.getElementById("qrcode").style.display = "none";
}
const btnFotoVeni = document.getElementById('fotodoveni');


btnFotoVeni.addEventListener('click', trocarFotoNoBotao);
ParaNaipe.addEventListener('click', pararNeveNaipes)
btnDividir.addEventListener('click', dividirMao);
btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', pararMaoAtual);
btnduplicar.addEventListener('click', duplicarAposta);
btnretibet.addEventListener('click', zeraaposta);

btnToggleSom.addEventListener('click', toggleSom);

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


//btndividir
function dividirMao() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Este botão especial aparece apenas quando suas duas primeiras cartas têm o mesmo valor (ex: dois 8, duas Rainhas). <br>" +
        "Ao clicar, sua mão é dividida em duas mãos separadas. <br>" +
        "Uma aposta igual à original é feita na segunda mão, e você jogará cada uma de forma independente, uma após a outra."

    let maoExemplo = [{ valor: '8', naipe: 'C' }, { valor: '8', naipe: 'P' }];
    renderizarExemplo(maoExemplo);
}

//btnPedir
function pedirCarta() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Use este botão para solicitar mais uma carta para a sua mão. <br>"
        + "O objetivo é chegar o mais perto possível de 21 sem ultrapassar. <br> Você pode pedir quantas cartas quiser, mas cuidado para não 'estourar'!"
}

//btnApostar
function iniciarJogo() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Use este botão para solicitar mais uma carta para a sua mão. <br>"
        + "O objetivo é chegar o mais perto possível de 21 sem ultrapassar. <br> Você pode pedir quantas cartas quiser, mas cuidado para não 'estourar'!"
}
//novo jogo
function prepararNovaRodada() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Este botão aparece quando a rodada termina.<br> Clique nele para limpar a mesa e começar a fase de apostas para uma nova mão."
}

//btnParar
function pararMaoAtual() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Quando estiver satisfeito com a sua pontuação e não quiser mais cartas, <br> clique em 'Parar'. <br> Você manterá sua mão atual e a vez passará para o dealer."

}
//btnduplicar
function duplicarAposta() {
    tocarSom(somdaaposta);

    mensagemResultadoEl.innerHTML = "Você dobra sua aposta, recebe apenas mais uma carta e sua vez termina. É uma jogada de alto risco e recompensa!";


    let maoExemplo = [{ valor: '7', naipe: 'C' }, { valor: '4', naipe: 'C' }];
    renderizarExemplo(maoExemplo);


    setTimeout(() => {
        mensagemResultadoEl.innerHTML = "Esse e um exemplo que pode acontecer em um jogo real.";
        const cartaFinal = { valor: 'K', naipe: 'E' };
        maoExemplo.push(cartaFinal);
        renderizarExemplo(maoExemplo);

    }, 3500);
}



function zeraaposta() {
    tocarSom(somdaaposta);
    limparExemplo();
    mensagemResultadoEl.innerHTML = "Apos clicar nele a aposta e zerada."
}

function limparExemplo() {
    exemploPontuacaoEl.textContent = '';
    exemploCartasEl.innerHTML = '';
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

function renderizarExemplo(mao) {
    limparExemplo();
    const pontuacao = calcularPontuacao(mao);
    exemploPontuacaoEl.textContent = `Pontuação: ${pontuacao}`;

    mao.forEach(carta => {
        const imgCarta = document.createElement('img');

        imgCarta.src = `images/${carta.naipe}${carta.valor}.webp`;
        exemploCartasEl.appendChild(imgCarta);
    });
}












const NAIPES = ['♦️', '♠️', '♣️', '♥️'];


const footerEl = document.querySelector('#helpbody');

let intervalIdNeve; 


function criarNaipeCaindo() {


    const naipeEl = document.createElement('span');
    
    
    const naipeAleatorio = NAIPES[Math.floor(Math.random() * NAIPES.length)];
    naipeEl.textContent = naipeAleatorio;

    
    naipeEl.classList.add('naipe-caindo');
    
    //total da tela que ta pegando
    const startX = Math.random() * 95;
    naipeEl.style.left = `${startX}vw`;

    //cria um random para que os naipes caim em tempos diferentes
    const duration = Math.random() * 8 + 5; 
    naipeEl.style.animationDuration = `${duration}s`;

    
    footerEl.appendChild(naipeEl);

        naipeEl.addEventListener('animationend', () => {
        naipeEl.remove();
    });
}



function iniciarNeveNaipes() {
    //intervalo que cria a cada naipe
    intervalIdNeve = setInterval(criarNaipeCaindo, 350); 
    

}

function pararNeveNaipes() {
    clearInterval(intervalIdNeve);
    
    document.querySelectorAll('.naipe-caindo').forEach(el => el.remove());
}























function trocarFotoNoBotao() {
    tocarSom(venifotosom);
    const currentBackground = btnFotoVeni.style.backgroundImage;
    if (currentBackground == FOTO_2_URL) {

        btnFotoVeni.style.backgroundImage = FOTO_1_URL;
    } else {

        btnFotoVeni.style.backgroundImage = FOTO_2_URL;
    }
}
