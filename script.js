// Variáveis do Jogo
let baralho = [];
let maoJogador = [];
let maoDealer = [];
let pontuacaoJogador = 0;
let pontuacaoDealer = 0;
let jogoEmAndamento = false;

// Elementos do DOM
const pontuacaoJogadorEl = document.getElementById('pontuacao-jogador');
const pontuacaoDealerEl = document.getElementById('pontuacao-dealer');
const cartasJogadorEl = document.getElementById('cartas-jogador');
const cartasDealerEl = document.getElementById('cartas-dealer');
const mensagemResultadoEl = document.getElementById('mensagem-resultado');

const btnPedir = document.getElementById('btn-pedir');
const btnParar = document.getElementById('btn-parar');
const btnNovoJogo = document.getElementById('btn-novo-jogo');

// Event Listeners para os botões
btnNovoJogo.addEventListener('click', iniciarJogo);
btnPedir.addEventListener('click', pedirCarta);
btnParar.addEventListener('click', turnoDealer);