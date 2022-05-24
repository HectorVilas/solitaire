let cardOrigin;
let cardDestination;

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
  for(let i = 0; i < table.tableau.length; i++){
    let quantity = i;
    for (let j = quantity+1; j > 0; j--) {
      table.tableau[i].push(cards[0])
      cards.shift()
    }
  }
  table.waste.push(cards[0])
  cards.shift()
  table.stock = cards
  cards = []
}

//adding divisions in wastepile and tableau
function domDivisions(){
  $tableaus.forEach((thisTableau, pile) => {
    for (let space = 0; space < 20; space++) {
      let separator = document.createElement("div")
      separator.classList.add("separator",`n${space}`)
      
      separator.addEventListener("mousedown", (e) => {
        clickAction("mousedown", pile, space)
        e.preventDefault()
      })
      separator.addEventListener("mouseup", (e) => {
        clickAction("mouseup", pile,space)
        e.preventDefault()
      })
      
      thisTableau.appendChild(separator)
    }
  })
}

function clickAction(action, pile, space){
  if(action === "mousedown"){
    cardOrigin = {pile: pile, space: space}
    console.log(cardOrigin)
  } else if(action === "mouseup"){
    cardDestination = {pile: pile, space: space}
    // if(cardOrigin.pile === cardDestination.pile){
    //   console.log("same pile");
    // }
    console.log(cardDestination)
    cardOrigin = undefined
    cardDestination = undefined
  }
}

//placing cards on each tableau pile's space
function placeCardsDom(){
  table.stock.forEach(card => $stock.innerText += ` ${card.suit} ${card.number}`)

  $wastepile.innerText = ` ${table.waste[0].suit} ${table.waste[0].number}`

  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < table.tableau[i].length; j++) {
      let space = document.querySelector(`.tab-${i} .n${j}`)
      space.innerText = `${table.tableau[i][j].suit} ${table.tableau[i][j].number}`
    }
  }
}



cardCreation()
shuffleCards()
layCards()
domDivisions()
placeCardsDom()