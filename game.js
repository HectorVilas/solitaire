let cardFrom;
let cardTo;

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
//action to store the interacting cards
function clickAction(action, pile, space){
  if(action === "mousedown"){
    cardFrom = {pile: pile, space: space}
  } else if(action === "mouseup"){
    cardTo = {pile: pile, space: space}
    isValidMove()
    //removing values to helper variables
    cardFrom = undefined
    cardTo = undefined
  }
}
//check if card can be moved to another pile
function isValidMove(){
  let from = table.tableau[cardFrom.pile][cardFrom.space]
  let to = table.tableau[cardTo.pile][cardTo.space]
  //do nothing if origin or destination is an empty space
  if(from == undefined || to == undefined) return
  //check if card can be placed
  if(from.number === to.number-1
    && cardFrom.pile !== cardTo.pile
    // && to.isFlipped === true //disabled temporally
    //check if the destination is the last card in the pile
    && table.tableau[cardTo.pile][cardTo.space]
    === table.tableau[cardTo.pile][table.tableau[cardTo.pile].length-1]
    ){
    console.log("valid move");
  } else {
    console.log("NOT valid move");
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