const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-bnt');
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

btwin.addEventListener('click', alternarModoTeste);
btnDividir.addEventListener('click', dividirMao);
btnApostar.addEventListener('click', iniciarJogo);
btnNovoJogo.addEventListener('click', prepararNovaRodada);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', pararMaoAtual);
btnduplicar.addEventListener('click', duplicarAposta);
btnretibet.addEventListener('click', zeraaposta);

//btwin
function alternarModoTeste(){
    mensagemResultadoEl.innerHTML =
        "Ao colocar o parametro ?dev na url esse botão ira aparecer. <br>" + 
        "A função dele e criar um baralho alternativo para testar cenários e verificar aplicação de regras específicas.";
}

//btndividir
function dividirMao(){
    mensagemResultadoEl.innerHTML = "Este botão especial aparece apenas quando suas duas primeiras cartas têm o mesmo valor (ex: dois 8, duas Rainhas). <br>" +
    "Ao clicar, sua mão é dividida em duas mãos separadas. <br>" +
    "Uma aposta igual à original é feita na segunda mão, e você jogará cada uma de forma independente, uma após a outra."

}

//btnPedir
function pedirCarta(){
    mensagemResultadoEl.innerHTML = "Use este botão para solicitar mais uma carta para a sua mão. <br>"
    + "O objetivo é chegar o mais perto possível de 21 sem ultrapassar. <br> Você pode pedir quantas cartas quiser, mas cuidado para não 'estourar'!"
}

//btnApostar
function iniciarJogo(){
    mensagemResultadoEl.innerHTML = "Use este botão para solicitar mais uma carta para a sua mão. <br>"
    + "O objetivo é chegar o mais perto possível de 21 sem ultrapassar. <br> Você pode pedir quantas cartas quiser, mas cuidado para não 'estourar'!"
}
//novo jogo
function prepararNovaRodada(){
    mensagemResultadoEl.innerHTML = "Este botão aparece quando a rodada termina.<br> Clique nele para limpar a mesa e começar a fase de apostas para uma nova mão."
}

//btnParar
function pararMaoAtual(){
    mensagemResultadoEl.innerHTML = "Quando estiver satisfeito com a sua pontuação e não quiser mais cartas, <br> clique em 'Parar'. <br> Você manterá sua mão atual e a vez passará para o dealer."

}
//btnduplicar
function duplicarAposta(){
    mensagemResultadoEl.innerHTML = "Esta é uma jogada de risco e alta recompensa! <br> Ao clicar, você dobra o valor da sua aposta original, recebe exatamente mais uma carta e sua vez termina automaticamente. <br> Este botão aparece quando sua mão inicial soma 10 ou 11."

}

function zeraaposta(){
    mensagemResultadoEl.innerHTML = "Apos clicar nele a aposta e zerada."
}
