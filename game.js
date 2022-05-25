let from, to;
const tabIDs = ["tab-0","tab-1","tab-2","tab-3","tab-4","tab-5","tab-6"]

let deck = []

let table = {
  stock: [],
  waste: [],
  foundations: [[],[],[],[]],
  tableau: [[],[],[],[],[],[],[]],
}

const $stock = document.querySelector("#stock");
const $wastepile = document.querySelector("#wastepile");
const $infoSpace = document.querySelector("#info-space");
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
      deck.push(card)
    }
  }
}

function shuffleCards(){
  for (let i = 0; i < 10; i++) {
    deck.sort(() => Math.random() > 0.5)
  }
}

function layCards(){
  for(let i = 0; i < table.tableau.length; i++){
    let quantity = i;
    for (let j = quantity+1; j > 0; j--) {
      table.tableau[i].push(deck[0])
      deck.shift()
    }
  }
  table.waste.push(deck[0])
  deck.shift()
  table.stock = deck
  deck = []
}

//adding divisions in wastepile and tableau
function domDivisions(){
  $tableaus.forEach((thisTableau, pile) => {
    for (let space = 0; space < 20; space++) {
      let separator = document.createElement("div")
      separator.classList.add("separator",`n${space}`)
      
      separator.addEventListener("mousedown", () => {
        clickAction("mousedown", separator.parentNode.id, pile, space)
      })
      separator.addEventListener("mouseup", () => {
        clickAction("mouseup", separator.parentNode.id, pile, space)
      })

      thisTableau.appendChild(separator)
    }
  })
}
//action to store the interacting cards
function clickAction(action, place, pile, space){
  let cardValue = {place,pile,space}
  if(action === "mousedown"){
    from = cardValue
  } else if(action === "mouseup"){
    to = cardValue
    isValidMove()
    // removing values to helper variables
    from = undefined
    to = undefined
  }
}
//check if card can be moved to another pile
function isValidMove(){
  //prevent errors when dragging from invalid spaces
  if(from === undefined || to === undefined) return;
  //storing the card info
  let cardFrom = table.tableau[from.pile][from.space]
  let cardTo = table.tableau[to.pile][to.space]

  if(cardFrom !== undefined && cardTo !== undefined //spaces have cards
    &&cardFrom.number === cardTo.number-1 //valid numbers
    && from.pile !== to.pile //different piles
    // && to.isFlipped === true //disabled temporally
    && table.tableau[to.pile][to.space] //destination is the last card -
    === table.tableau[to.pile][table.tableau[to.pile].length-1] // - of pile
    ){
    console.log("valid move");
    if(tabIDs.includes(from.place) && tabIDs.includes(to.place)){
      console.log("tableau pile to tableau pile");
    }

  } else {
    console.log("NOT valid move");
  }
}
//placing cards on each tableau pile's space
function placeCardsDom(){
  // table.stock.forEach(card => $stock.innerText += ` ${card.suit} ${card.number}`)

  // $wastepile.innerText = ` ${table.waste[0].suit} ${table.waste[0].number}`

  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < table.tableau[i].length; j++) {
      let space = document.querySelector(`#tab-${i} .n${j}`)
      space.innerText = `${table.tableau[i][j].suit} ${table.tableau[i][j].number}`
    }
  }
}



cardCreation()
shuffleCards()
layCards()
domDivisions()
placeCardsDom()