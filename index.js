new Vue({
    el: '#app',
    created() {
        this.deck = this.createDeck()
        this.shuffle(this.deck)
        this.playerHand.push(this.draw(this.deck))
        this.playerHand.push(this.draw(this.deck))
        this.dealerHand.push(this.draw(this.deck))
    },
    data: {
        deck: null,
        card: null,
        playerHand: [],
        dealerHand: [],
        disabled: false,
        winner: null,
    },
    methods: {
        createDeck() {
            //Skapar kortleken och pushar in det i arrayen "deck"
            const deck = []
            suits = ['HEARTS', 'SPADES', 'DIAMONDS', 'CLUBS']
            for (let i = 0; i < 4; i++) {
                for (let ranks = 1; ranks < 14; ranks++) {
                    deck.push({
                        suit: suits[i],
                        value: ranks
                    })
                }
            }
            return deck
        },
        shuffle(deck) {
            //Fångar upp om deck inte än har blivit skapad så den inte shufflar en tom array
            if (deck === undefined) {
                return undefined
            }
            //Variabel som sen kommer generera ett slumpmässigt index mellan 0-52 till vilket kortleken ska byta plats med, "i" kommer sen att vara vilket kort i arrayen den står på i forEach:en
            let swap
            deck.forEach((card, i) => {
                swap = Math.floor(Math.random() * 52)
                let backup = deck[swap]
                deck[swap] = deck[i]
                deck[i] = backup
            })
        },
        //Ta bort ett kort från kortleken/deck-arrayen
        draw(deck) {
            return deck.pop()
        },
        score(card) {
            //Variabel temp löser problemet med att man vill att ett Ess ska både kunna vara en 1:a och en 11:a, x är bara den uträknade slutpoängen
            let value, x = 0,
                temp = 0
            for (let i = 0; i < card.length; i++) {
                value = card[i].value
                switch (value) {
                    case 1:
                        value = 1
                        temp = temp + 1
                        break
                    case 11:
                        value = 10
                        break
                    case 12:
                        value = 10
                        break
                    case 13:
                        value = 10
                        break
                }
                x = x + value
            }
            if (temp > 0 && x <= 11) {
                x = x + 10
            }
            return x
        },
        dealCard(card) {
            //Ger nytt kort och kollar samtidigt om playerScore har kommit över 21 vilket då ger dealer vinst 
            this.playerHand.push(card)
            this.playerScore = this.score(this.playerHand)
            if (this.playerScore > 21) {
                this.disabled = true
                this.winner = '😢Dealer Wins!😢'
            }
        },
        prettyCard(deck) {
            //Ger varje kort ett finare suit och korten med deck.value = 1, 10, 11, 12 eller 13 ett annat value.
            let value = deck.value
            let suit = deck.suit

            switch (deck.suit) {
                case "HEARTS":
                    suit = "♥️"
                    break;
                case "SPADES":
                    suit = "♠️"
                    break;
                case "DIAMONDS":
                    suit = "♦️"
                    break;
                case "CLUBS":
                    suit = "♣️"
                    break;
            }
            switch (deck.value) {
                case 1:
                    value = "A"
                    break;
                case 10:
                    value = "T"
                    break;
                case 11:
                    value = "J"
                    break;
                case 12:
                    value = "Q"
                    break;
                case 13:
                    value = "K"
                    break;
                default:
                    value = deck.value
            }
            return value + suit
        },
        stop() {
            //Om Player väljer att stanna ska den inte kunna göra något mer denna runda
            this.disabled = true
            //Om dealerScore är mindre än 17 så ska den be om ett till kort
            for (let i = 0; 17 > this.score(this.dealerHand); i++) {
                let card = this.draw(this.deck)
                this.dealerHand.push(card)
                this.dealerScore = this.score(this.dealerHand)
            }
            //Beroende på vem som vann spelet skriver den ut antingen a,b eller c...
            if (this.score(this.dealerHand) > this.score(this.playerHand) && this.score(this.dealerHand) < 22) {
                this.winner = '😢Dealer wins!😢'
            } else if (this.score(this.playerHand) === this.score(this.dealerHand)) {
                this.winner = '😡Its a tie, but the dealer wins!😡'
            } else {
                this.winner = '😀Player wins!😀'
            }

        },
        reset() {
            //Nollställ alla värden
            this.disabled = false
            this.winner = null
            this.deck = null
            this.card = null
            this.playerHand = []
            this.dealerHand = []

            this.createDeck()
            this.deck = this.createDeck()
            this.shuffle(this.deck)
            this.playerHand.push(this.draw(this.deck))
            this.playerHand.push(this.draw(this.deck))
            this.dealerHand.push(this.draw(this.deck))
        }
    }
});