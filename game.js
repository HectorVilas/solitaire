let cards = []

let table = {
  stock: [],
  waste: [],
  foundations: [[],[],[],[]],
  tableau: [[],[],[],[],[],[],[]],
}

const $stock = document.querySelector(".stock");
const $wastepile = document.querySelector(".wastepile");
const $infoSpace = document.querySelector(".info-space");
const $foundations = document.querySelectorAll(".foundation");
const $tableaus = document.querySelectorAll(".tableau");

function cardCreation(){
  // let suitsList = ["club", "diamonds", "spades", "hearts"]
  let suitsList = ["♣", "♦", "♠", "♥"]
  
  for(let suitLoop = 0; suitLoop < 4; suitLoop++){
    for(let cardLoop = 1; cardLoop < 14; cardLoop++){
      let suit, number, color
      number = cardLoop
      suit = suitsList[suitLoop]
      
      suitLoop%2 === 0 ? color = "black": color = "red"
      
      let card = { number, suit, color, isFlipped: false }
      cards.push(card)
    }
  }
}

function shuffleCards(){
  for (let i = 0; i < 10; i++) {
    cards.sort(() => Math.random() > 0.5)
  }
}

function layCards(){
  //tableau
  for(let i = 0; i < table.tableau.length; i++){
    let quantity = i;
    for (let j = quantity+1; j > 0; j--) {
      table.tableau[i].push(cards[0])
      cards.shift()
    }
  }
  //wastepile
  table.waste.push(cards[0])
  cards.shift()
  //stock
  table.stock = cards
  cards = [];
}

//experimental
function placeCardsDom(){
  table.stock.forEach(card => $stock.innerText += ` ${card.suit} ${card.number}`)
  $wastepile.innerText = ` ${table.waste[0].suit} ${table.waste[0].number}`
  for(let i = 0; i < table.tableau.length; i++){
    table.tableau[i].forEach(pile => {
      $tableaus[i].innerText += `${pile.suit} ${pile.number}\n`
    })
  }
}

cardCreation()
shuffleCards()
layCards()
placeCardsDom()