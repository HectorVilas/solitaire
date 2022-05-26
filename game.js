let from, to;
const tabIDs = ["tab-0","tab-1","tab-2","tab-3","tab-4","tab-5","tab-6"]
const foundIDs = ["fnd-0","fnd-1","fnd-2","fnd-3"]

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
  //for testing --------------------------------------------------
  table.foundations.forEach(foundation => {
    foundation.push(deck[0])
    deck.shift()
  })
  //for testing --------------------------------------------------
  table.stock = deck
  deck = []
}

//adding divisions in wastepile and tableau
function domDivisions(){
  $tableaus.forEach((thisTableau, pile) => {
    for (let space = 0; space < 20; space++) {
      createSpace(thisTableau,pile,space)
    }
  })
  createSpace($stock)
  createSpace($wastepile)
  $foundations.forEach((foundation,pile) => {
    createSpace(foundation,pile)
  })
}
//space creation with listener
function createSpace(appendTo, pile = 0, space = 0){
  let separator = document.createElement("div")
  separator.classList.add("separator",`n${space}`)
  
  separator.addEventListener("mousedown", () => {
    clickAction("mousedown", separator.parentNode.id, pile, space)
  })
  separator.addEventListener("mouseup", () => {
    clickAction("mouseup", separator.parentNode.id, pile, space)
  })

  appendTo.appendChild(separator)
}
//action to store the interacting cards
function clickAction(action, place, pile, space){
  let cardValue = {place,pile,space}
  if(action === "mousedown"){
    from = cardValue
    if(from.place === "stock"){
      stockPile()
      from = undefined
    }
  } else if(action === "mouseup"){
    to = cardValue
    // isValidMove()
    dragCard()
    // removing values to helper variables
    from = undefined
    to = undefined
  }
}
//checks origin and destination of card
function dragCard(){
  let cardOrigin, cardDestination
  if(from === undefined || to === undefined) return
  if(tabIDs.includes(from.place)){ //from tableau piles
    cardOrigin = "tableau"
    if(tabIDs.includes(to.place)){ //to tableau
      cardDestination = "tableau"
      moveCards(cardOrigin,cardDestination,"-")
    }else if(foundIDs.includes(to.place)){//to foundations
      cardDestination = "foundation"
      moveCards(cardOrigin,cardDestination,"+")
    } else {
      console.log("movement canceled")
    }
  }else if(from.place === "wastepile"){//from waste pile
    cardOrigin = "wastepile"
    if(foundIDs.includes(to.place)){ //to foundation
      cardDestination = "foundation"
      moveCards(cardOrigin,cardDestination,"+")
    }else if(tabIDs.includes(to.place)){ //to tableau piles
      cardDestination = "tableau"
      moveCards(cardOrigin,cardDestination,"-")
    } else {
      console.log("movement canceled")
    }
  }else if(foundIDs.includes(from.place)){ //from foundation
    cardOrigin = "foundation"
    if(tabIDs.includes(to.place)){ //to tableau piles
      cardDestination = "tableau"
      moveCards(cardOrigin,cardDestination,"-")
    } else {
      console.log("movement canceled")
    }
  }
}
//function to place one card in waste or return cards if empty
function stockPile(){
  console.log("pending action: move card to waste");
}
//check if card can be moved to another pile
function moveCards(origin, destination, direction){
  let isvalidNum = isValidSuit = isValidColor = isLastCard = false
  let fromCard, toCard
  origin === "tableau" ? fromCard = table.tableau[from.pile][from.space] :
  origin === "wastepile" ? fromCard = table.waste[from.pile] :
  origin === "foundation" ? fromCard = table.foundations[from.pile][from.space] :
  alert("origin card not assigned")

  destination === "tableau" ? toCard = table.tableau[to.pile][to.space] :
  destination === "foundation" ? toCard = table.foundations[to.pile][to.space] :
  alert("destination card not assigned")

  if(fromCard === undefined || toCard === undefined) return

  if(direction === "+" && fromCard.number === toCard.number+1){
    isvalidNum = true
  }else if(direction === "-" && fromCard.number === toCard.number-1){
    isvalidNum = true
  }
  
  if((origin === "wastepile" && destination === "foundation")
  || (origin === "tableau" && destination === "foundation")){
    if(fromCard.suit === toCard.suit){
      isValidSuit = true
    }
  } else {
    isValidSuit = true
  }
  
  console.log("validNum: "+isvalidNum, "validSuit: "+isValidSuit,
  "validColor: "+isValidColor, "lastCard"+isLastCard);
}
// function isValidMove(){
//   //prevent errors when dragging from invalid spaces
//   if(from === undefined || to === undefined) return;
//   //storing the card info
//   let cardFrom = table.tableau[from.pile][from.space]
//   let cardTo = table.tableau[to.pile][to.space]

//   if(cardFrom !== undefined && cardTo !== undefined //spaces have cards
//     &&cardFrom.number === cardTo.number-1 //valid numbers
//     && from.pile !== to.pile //different piles
//     // && to.isFlipped === true //disabled temporally
//     && table.tableau[to.pile][to.space] //destination is the last card -
//     === table.tableau[to.pile][table.tableau[to.pile].length-1] // - of pile
//     ){
//     console.log("valid move");
//     if(tabIDs.includes(from.place) && tabIDs.includes(to.place)){
//       console.log("tableau pile to tableau pile");
//     }

//   } else {
//     console.log("NOT valid move");
//   }
// }
//placing cards on each tableau pile's space
function placeCardsDom(){
  table.stock.forEach(card => $stock.firstChild.innerText += ` ${card.suit} ${card.number}`)

  $wastepile.firstChild.innerText = ` ${table.waste[0].suit} ${table.waste[0].number}`

  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < table.tableau[i].length; j++) {
      let space = document.querySelector(`#tab-${i} .n${j}`)
      space.innerText = `${table.tableau[i][j].suit} ${table.tableau[i][j].number}`
    }
  }
  //for testing --------------------------------------------------
  $foundations.forEach((foundation,i) => {
    foundation.firstChild.innerText = `${table.foundations[i][0].suit} ${table.foundations[i][0].number}`
  })
  //for testing --------------------------------------------------
}



cardCreation()
shuffleCards()
layCards()
domDivisions()
placeCardsDom()