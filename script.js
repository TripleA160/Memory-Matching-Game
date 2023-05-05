class match {
    constructor(totalTime, cards) {
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time');
        this.moved = document.getElementById('moves');
        this.matched = document.getElementById('matched');
    }

    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        this.countdown = this.startCountdown();
        this.busy = false;
        this.shuffle(this.cardsArray);
        this.hide();
        this.timer.innerText = this.timeRemaining;
        this.moved.innerText = this.totalClicks;
        this.matched.innerText = this.matchedCards.length;
        this.matched.parentElement.style.backgroundColor = "#ffffff40";
        this.matched.parentElement.style.backgroundImage = "none";;
    }

    hide() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    startCountdown() {
        return (
            setInterval(() => {
                this.timeRemaining--;
                this.timer.innerText = this.timeRemaining;
                if (this.timeRemaining === 0) {
                    this.gameOver();
                }
            }, 1000)
        )
    }

    gameOver() {
        clearInterval(this.countdown);
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory() {
        clearInterval(this.countdown);
        document.getElementById('victory-text').classList.add('visible');
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.totalClicks++;
            this.moved.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
            this.checkForMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }

    }

    checkForMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card, this.cardToCheck);
        } else {
            this.cardNotMatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        var matchedPercentage = ((this.matchedCards.length) / this.cardsArray.length) * 100;
        this.matched.innerText = this.matchedCards.length / 2;
        this.matched.parentElement.style.backgroundColor = "transparent";
        this.matched.parentElement.style.backgroundImage = "linear-gradient(to bottom right, #455a64fb " + matchedPercentage / 1.9 + "%, transparent " + matchedPercentage / 1.9 + "% 100%), linear-gradient(to top left, #455a64fb " + matchedPercentage / 1.9 + "%, #ffffff40 " + matchedPercentage / 1.9 + "% 100%)";;
        if (this.matchedCards.length === this.cardsArray.length) {
            setTimeout(() => {
                this.victory();
            }, 500);
            
        }
    }

    cardNotMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 700);
    }

    shuffle(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            cardsArray[randIndex].style.order = i;
            cardsArray[i].style.order = randIndex;
        }
    }

    getCardType(card) {
        return card.getElementsByClassName('card-image')[0].src;
    }

    canFlipCard(card) {
        return(!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new match(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    })
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}