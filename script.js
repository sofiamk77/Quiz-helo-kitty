// ============================
// VARIÁVEIS DO JOGO
// ============================
let levelSelecionado = "facil";
let nomeJogador = "Jogador";
let avatarSelecionado = "";
let vidas = 3;
let pontuacao = 0;
let xp = 0;
let indexPergunta = 0;
let tempo = 60;
let intervaloTimer;
let perguntas = [];

// ============================
// PERGUNTAS
// ============================
const perguntasPorNivel = {
    facil: [
        { p: "Qual é a cor favorita da Hello Kitty?", o: ["Rosa", "Azul", "Verde", "Amarelo"], c: 0 },
        { p: "Qual animal a Hello Kitty é?", o: ["Gato", "Coelho", "Cachorro", "Urso"], c: 0 },
        { p: "Quem é a amiga coelha?", o: ["My Melody", "Kuromi", "Cinnamoroll", "Purin"], c: 0 }
    ],
    medio: [
        { p: "Qual é o nome completo da Hello Kitty?", o: ["Kitty White", "Kitty Chan", "Maria Kitty", "Pink White"], c: 0 },
        { p: "Em que país ela nasceu?", o: ["Japão", "China", "Coreia", "EUA"], c: 0 },
        { p: "Qual é a irmã gêmea da Hello Kitty?", o: ["Mimmy", "Milly", "Molly", "Mimi"], c: 0 }
    ],
    dificil: [
        { p: "Qual é o aniversário da Hello Kitty?", o: ["1º de Novembro", "14 de Março", "7 de Julho", "10 de Maio"], c: 0 },
        { p: "Ano de criação da Hello Kitty?", o: ["1974", "1980", "1969", "1990"], c: 0 },
        { p: "Criadora da Hello Kitty?", o: ["Yuko Shimizu", "Sakura Tanaka", "Aiko Mori", "Mika Chan"], c: 0 }
    ]
};

// ============================
// ELEMENTOS HTML
// ============================
const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const telaFinal = document.getElementById("tela-final");

const inputNome = document.getElementById("input-nome");
const btnIniciar = document.getElementById("btn-iniciar");
const dificuldadeBtns = document.querySelectorAll(".dificuldade");

const perguntaEl = document.getElementById("pergunta");
const opcoesEl = document.getElementById("opcoes");
const playerName = document.getElementById("player-name");
const playerLives = document.getElementById("player-lives");
const scoreEl = document.getElementById("score");
const xpEl = document.getElementById("xp");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const rankingLista = document.getElementById("ranking");

const btnReiniciar = document.getElementById("btn-reiniciar");

// ============================
// SELETOR DE AVATAR
// ============================
const avatarOpcoes = document.querySelectorAll(".avatar-option");

avatarOpcoes.forEach(img => {
    img.addEventListener("click", () => {
        avatarOpcoes.forEach(a => a.classList.remove("selecionado"));
        img.classList.add("selecionado");
        avatarSelecionado = img.src; // agora pega o caminho correto
    });
});

// ============================
// SELECIONAR DIFICULDADE
// ============================
dificuldadeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        dificuldadeBtns.forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");
        levelSelecionado = btn.dataset.level;
    });
});

// ============================
// INICIAR JOGO
// ============================
btnIniciar.addEventListener("click", () => {
    nomeJogador = inputNome.value.trim() || "Jogador";

    perguntas = perguntasPorNivel[levelSelecionado];

    document.getElementById("player-avatar").src = avatarSelecionado;

    // Reset
    vidas = 3;
    xp = 0;
    pontuacao = 0;
    tempo = 60;
    indexPergunta = 0;

    telaInicial.style.display = "none";
    telaJogo.style.display = "block";

    playerName.textContent = nomeJogador;

    atualizarVidas();
    atualizarScore();
    atualizarXP();

    mostrarPergunta();
    iniciarTimer();
});

// ============================
// PERGUNTAS
// ============================
function mostrarPergunta() {
    if (indexPergunta >= perguntas.length) return finalizarJogo();

    let q = perguntas[indexPergunta];
    perguntaEl.textContent = q.p;

    opcoesEl.innerHTML = "";

    q.o.forEach((op, i) => {
        let btn = document.createElement("button");
        btn.className = "opcao kawaii";
        btn.textContent = op;
        btn.onclick = () => escolherResposta(i === q.c, btn);
        opcoesEl.appendChild(btn);
    });

    progressBar.style.width = (indexPergunta / perguntas.length) * 100 + "%";
}

// ============================
// ESCOLHER RESPOSTA
// ============================
function escolherResposta(correta, btn) {
    if (correta) {
        btn.classList.add("certo");
        pontuacao += 10;
        xp += 5;
        criarParticulas();
    } else {
        btn.classList.add("errado");
        vidas--;
    }

    atualizarVidas();
    atualizarScore();
    atualizarXP();

    indexPergunta++;

    setTimeout(() => {
        if (vidas <= 0) return finalizarJogo();
        mostrarPergunta();
    }, 800);
}

// ============================
// TIMER
// ============================
function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        tempo--;

        let m = Math.floor(tempo / 60);
        let s = tempo % 60;

        timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;

        if (tempo <= 0) finalizarJogo();

    }, 1000);
}

// ============================
// HUD
// ============================
function atualizarVidas() {
    playerLives.textContent = "❤".repeat(vidas);
}

function atualizarScore() {
    scoreEl.textContent = `Pontos: ${pontuacao}`;
}

function atualizarXP() {
    xpEl.textContent = `XP: ${xp}`;
}

// ============================
// FINALIZAR JOGO
// ============================
function finalizarJogo() {
    clearInterval(intervaloTimer);

    telaJogo.style.display = "none";
    telaFinal.style.display = "block";

    document.getElementById("resultado-jogador").textContent = `Jogador: ${nomeJogador}`;
    document.getElementById("resultado-pontuacao").textContent = `Pontuação: ${pontuacao}`;
    document.getElementById("resultado-xp").textContent = `XP ganho: ${xp}`;

    salvarRanking();
    mostrarRanking();
}

// ============================
// RANKING LOCAL
// ============================
function salvarRanking() {
    let ranking = JSON.parse(localStorage.getItem("rankingQuizHK")) || [];
    ranking.push({ nome: nomeJogador, pontos: pontuacao, xp: xp });
    ranking.sort((a, b) => b.pontos - a.pontos);
    ranking = ranking.slice(0, 10);
    localStorage.setItem("rankingQuizHK", JSON.stringify(ranking));
}

function mostrarRanking() {
    rankingLista.innerHTML = "";
    let ranking = JSON.parse(localStorage.getItem("rankingQuizHK")) || [];

    ranking.forEach(r => {
        let li = document.createElement("li");
        li.textContent = `${r.nome} — ${r.pontos} pts (XP: ${r.xp})`;
        rankingLista.appendChild(li);
    });
}

// ============================
// REINICIAR JOGO
// ============================
btnReiniciar.addEventListener("click", () => {
    telaFinal.style.display = "none";
    telaInicial.style.display = "block";
});

// ============================
// PARTÍCULAS DE GLITTER
// ============================
function criarParticulas() {
    const canvas = document.getElementById("particles");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 25; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let r = Math.random() * 6 + 2;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb6e6";
        ctx.fill();
    }
}

// ============================
// ESTRELAS CAINDO
// ============================
function criarEstrelas() {
    const container = document.createElement("div");
    container.id = "stars";
    document.body.appendChild(container);

    setInterval(() => {
        const star = document.createElement("div");
        star.classList.add("star");

        star.style.left = Math.random() * 100 + "vw";
        star.style.animationDuration = (3 + Math.random() * 4) + "s";
        star.style.opacity = Math.random() * 0.7 + 0.3;

        container.appendChild(star);

        setTimeout(() => star.remove(), 6000);
    }, 150);
}

criarEstrelas();
