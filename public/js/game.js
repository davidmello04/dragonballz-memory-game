document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector(".grid");
    const spanPlayer = document.querySelector(".player");
    const timer = document.querySelector(".timer");
    const btnMenu = document.querySelector(".btn-main");
    const restartBtn = document.querySelector(".restart");
    const restartBtn2 = document.querySelector(".restart2");

    // Botão Voltar ao menu
    const handleBtnMenu = (event) => {
        event.preventDefault();
        window.location = "../index.html";
    };

    // Botão Reiniciar Partida
    const handleBtnRestart = () => {
        window.location = "./game.html";
    };

    // Eventos dos botões Menu e Reiniciar
    btnMenu.addEventListener("click", handleBtnMenu);
    restartBtn.addEventListener("click", handleBtnRestart);
    restartBtn2.addEventListener("click", handleBtnRestart);

    // Personagens dos Cards
    const characters = [
        "android-17",
        // "vegeta",
        // "bulma",
        // "cell",
        // "Trunks",
        // "freeza",
        // "Gohan-Super-Saiyan",
        // "goku",
        // "kuririn",
        // "goten",
        // "MajinBuu",
        // "piccolo",
        // "mestre-kame",
        // "chichi",
        // "raditz",
        // "sr-kaioh",
    ];

    // Função para criar um elemento com classe
    const createElement = (tag, className) => {
        const element = document.createElement(tag);
        element.className = className;
        return element;
    };

    let firstCard = "";
    let secondCard = "";

    // Função para checar os cards
    const checkCards = () => {
        const firstCharacter = firstCard.getAttribute("data-character");
        const secondCharacter = secondCard.getAttribute("data-character");

        if (firstCharacter === secondCharacter) {
            firstCard.firstChild.classList.add("disabled-card");
            secondCard.firstChild.classList.add("disabled-card");

            firstCard = "";
            secondCard = "";

            const audio = new Audio(
                "../audio/dragon-ball-z-golpe-soco-forte-luta-strongpunch.mp3"
            );
            audio.play();

            checkEndGame();
        } else {
            setTimeout(() => {
                firstCard.classList.remove("reveal-card");
                secondCard.classList.remove("reveal-card");
                firstCard = "";
                secondCard = "";
            }, 500);
        }
    };

    // Função para capitalizar o nome do player
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Função para checar o fim do jogo
    const checkEndGame = () => {
        const disabledCards = document.querySelectorAll(".disabled-card");

        setTimeout(() => {
            if (disabledCards.length === characters.length * 2) {
                if (tempo) {
                    clearInterval(tempo);
                }

                audioStopGame();
                audioPlayGame(audioWin);

                // Modal para mostrar tempo e pontuação após a finalização
                const modal = document.getElementById("modal");
                const modalPlayerName =
                    document.getElementById("modalPlayerName");
                const modalTimer = document.getElementById("modalTimer");
                const modalCloseBtn = document.getElementById("modalCloseBtn");
                const modalRecord = document.getElementById("modalRecord");

                modalPlayerName.innerText = spanPlayer.innerHTML;
                modalTimer.innerText = timer.innerHTML;
                modalRecord.innerHTML = scorePoints;

                modal.style.display = "flex";
                btnMenu.style.display = "none";

                modalCloseBtn.addEventListener("click", () => {
                    modal.style.display = "none";
                    window.location = "../index.html";
                });

                finalScore();
            }
        }, 1000);
    };

    //Função para revelar o card clicado
    const revealCard = ({ target }) => {
        if (target.parentNode.className.includes("reveal-card")) {
            return;
        }

        if (firstCard === "") {
            target.parentNode.classList.add("reveal-card");
            firstCard = target.parentNode;
        } else if (secondCard === "") {
            target.parentNode.classList.add("reveal-card");
            secondCard = target.parentNode;

            checkCards();
        }
    };

    // Função para criar o card
    const createCard = (character) => {
        const card = createElement("div", "card");
        const front = createElement("div", "face front");
        const back = createElement("div", "face back");

        front.style.backgroundImage = `url('../images/${character}.png')`;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener("click", revealCard);
        card.setAttribute("data-character", character);

        return card;
    };

    // Função para carregar os elementos e randomizar e criar os cards
    const loadGame = () => {
        const duplicateCharacter = [...characters, ...characters];

        const shuffleArray = duplicateCharacter.sort(() => Math.random() - 0.5);

        shuffleArray.forEach((character) => {
            const card = createCard(character);
            grid.appendChild(card);
        });

        currentTimerPoints();
    };

    // Função para crônometrar
    let tempo;

    const cronTimer = () => {
        let sec = 0;
        let min = 0;
        let hr = 0;

        tempo = setInterval(() => {
            sec++;
            if (sec == 60) {
                min++;
                sec = 0;
            }
            if (min >= 60) {
                min = 0;
                hr++;
            }
            if (hr == 24) {
                hr = 0;
            }

            startTimer();
        }, 1000);

        const startTimer = () => {
            const currentTimer = timer;
            currentTimer.innerText = `${
                hr > 0 ? String(hr).padStart(2, "0") + ":" : ""
            }${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        };

        startTimer();
    };

    // Função de Pontuação
    let maxScore = 500;
    let scorePoints = 0;
    let keysAll = Object.keys(localStorage);
    let key = 0;

    const lowerScore = () => {
        maxScore--;
        scorePoints = maxScore;
    };

    const currentTimerPoints = () => setInterval(lowerScore, 1000);

    // Função para organizar ranking
    let ranking = [];

    const rankingScores = () => {
        for (let i = 0; i < keysAll.length; i++) {
            let key = keysAll[i];
            if (key !== "player") {
                let playerName = key;
                let score = localStorage.getItem(key);
                score = parseInt(score);
                ranking.push({ playerName, score });
            }
        }
        ranking.sort((a, b) => b.score - a.score);
        console.log(ranking);
    };

    // Função para listar scores
    const scoresList = () => {
        let final = 0;

        rankingScores();

        for (let i = 0; i < ranking.length; i++) {
            let key = ranking[i];

            let pos = ranking.indexOf(ranking[i]) + 1;
            final = pos + "º " + key.playerName + " - " + key.score + " pts";
            newRecord(final);
        }
    };

    // Função para criar novo Recorde
    function newRecord(text) {
        const insertScores = document.getElementById("listScores");
        const record = document.createElement("span");
        record.className = "scores-player";
        insertScores.appendChild(record);
        record.innerHTML = text;
    }

    // Função para calcular scores e verificar se entra no ranking
    const finalScore = () => {
        if (keysAll.length - 1 < 5) {
            localStorage.setItem(spanPlayer.innerHTML, scorePoints);
        } else if (keysAll.length - 1 >= 5) {
            for (let i = 0; i < keysAll.length; i++) {
                key = keysAll[i];

                if (key !== "player") {
                    pont = parseInt(localStorage.getItem(key));

                    if (scorePoints > pont) {
                        topScores();
                    }
                }
            }
        }
    };

    // Função para controlar o top 5 recordes
    const topScores = () => {
        let indexCalc = ranking.length - 1;
        let index = ranking[indexCalc];
        localStorage.removeItem(index.playerName);
        localStorage.setItem(spanPlayer.innerHTML, scorePoints);
    };

    // Audios do game
    let audioGame = new Audio("../audio/1-02 - Prologue & Subtitle 1.mp3");
    audioGame.loop = true;

    let audioWin = new Audio("../audio/3-04 - We Were Angels.mp3");
    audioWin.loop = true;

    const audioPlayGame = (audio) => {
        audio.play();
    };

    const audioStopGame = () => {
        audioGame.pause();
        audioGame.currentTime = 0;
    };

    // Carregar o jogo e captar o nome do player, iniciando o jogo e o tempo
    window.onload = () => {
        const playerName = localStorage.getItem("player");
        const capitalizedPlayerName = capitalizeFirstLetter(playerName);
        spanPlayer.innerHTML = capitalizedPlayerName;

        audioPlayGame(audioGame);

        scoresList();

        cronTimer();
        loadGame();
    };
});
