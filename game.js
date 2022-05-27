let deckDesign = "traditional"
let unflippedImg = "./media/images/cards/traditional/reverse.png"
let from, to;
const tabIDs = []
const foundIDs = []

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

$foundations.forEach(found => foundIDs.push(found.id))
$tableaus.forEach(tab => tabIDs.push(tab.id))

function cardCreation(){
  let suitsList = ["clubs", "diamonds", "spades", "hearts"]
  // let suitsList = ["♣", "♦", "♠", "♥"]
  
  for(let suitLoop = 0; suitLoop < 4; suitLoop++){
    for(let cardLoop = 1; cardLoop < 14; cardLoop++){
      let suit, number, color
      number = cardLoop
      suit = suitsList[suitLoop]
      url = `./media/images/cards/${deckDesign}/${suit}${cardLoop}.png`
      
      suitLoop%2 === 0 ? color = "black": color = "red"
      
      let card = { number, suit, color, isFlipped: false, url }
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
    if(from !== undefined || to !== undefined) dragCard()
    // removing values to helper variables
    from = undefined
    to = undefined
  }
}
//checks origin and destination of card
function dragCard(){
  if(from === undefined) return
  let fromCard, toCard

  if(tabIDs.includes(from.place)){ //from tableau piles
    fromCard = table.tableau[from.pile][from.space]
    if(tabIDs.includes(to.place)){//+++++tableau to tableau
      toCard = table.tableau[to.pile][to.space]
      isValidMove({fromCard,toCard,ascendingNumber:false,sameSuit:false,
        needsSameColor:false})
    }else if(foundIDs.includes(to.place)){//+++++tableau to foundations
      toCard = table.foundations[to.pile][to.space]
      isValidMove({fromCard,toCard,ascendingNumber:true,sameSuit:true,
        needsSameColor:true})
    } else {
      console.log("movement canceled")
    }
  }else if(from.place === "wastepile"){//from waste pile
    fromCard = table.waste[from.pile]
    if(foundIDs.includes(to.place)){//+++++waste to foundation
      toCard = table.foundations[to.pile][to.space]
      isValidMove({fromCard,toCard,ascendingNumber:true,sameSuit:true,
        needsSameColor:true})
    }else if(tabIDs.includes(to.place)){//+++++waste to tableau piles
      toCard = table.tableau[to.pile][to.space]
      isValidMove({fromCard,toCard,ascendingNumber:false,sameSuit:false,
        needsSameColor:false})
    } else {
      console.log("movement canceled")
    }
  }else if(foundIDs.includes(from.place)){ //from foundation
    fromCard = table.foundations[from.pile][from.space]
    if(tabIDs.includes(to.place)){//+++++foundation to tableau piles
      toCard = table.tableau[to.pile][to.space]
      isValidMove({fromCard,toCard,ascendingNumber:false,sameSuit:false,
        needsSameColor:false})
    } else {
      console.log("movement canceled")
    }
  }
}
//function to check if move is valid
function isValidMove({fromCard,toCard,ascendingNumber,sameSuit,
  needsSameColor}){
  if(fromCard === undefined || toCard === undefined) return
  let validNum = validSuit = validColor = theLastCard
  = differentPile = isLastCard = isFacingUp = false;
  if((ascendingNumber && fromCard.number === toCard.number+1)
  || (!ascendingNumber && fromCard.number === toCard.number-1)){
    validNum = true
  }
  if(sameSuit){
    if(fromCard.suit === toCard.suit){
      validSuit = true
    }
  }else{
    validSuit = true
  }
  if((needsSameColor && fromCard.color === toCard.color)
  || (!needsSameColor && fromCard.color !== toCard.color)){
    validColor = true
  }
  if(tabIDs.includes(to.place)){
    let lastCard = table.tableau[to.pile][table.tableau[to.pile].length-1]
    if(toCard === lastCard){
      isLastCard = true
    }
  } else {
    isLastCard = true
  }
  if(tabIDs.includes(from.place) && tabIDs.includes(to.place)){
    if(from.place !== to.place){
      differentPile = true
    }
  } else {
    differentPile = true
  }
  if(fromCard.isFlipped && toCard.isFlipped){
    isFacingUp = true
  }
  if(validNum && validSuit && validColor
    && isLastCard && isFacingUp && differentPile){
    moveCards(fromCard,toCard)
  }

  console.log("nmbr: "+validNum,"\n♥♦♣♠: "+validSuit,
  "\ncolr: "+validColor,"\nlast: "+isLastCard,
  "\nflip: "+isFacingUp,"\ndiff: "+differentPile);
}
//move cards from one pile to another
function moveCards(fromCard,toCard){
  console.log("cards must move now");
  console.log(fromCard,toCard);
}
//function to place one card in waste or return cards if empty
function stockPile(){
  console.log("pending action: move card to waste");
}
//placing cards on each tableau pile's space
function placeCardsDom(){
  table.stock.forEach(card => {
    $stock.firstChild.innerText += "[/////]"
  })
  
  $wastepile.firstChild.innerText = ` ${table.waste[0].suit} ${table.waste[0].number} ${table.waste[0].color}`

  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < table.tableau[i].length; j++) {
      let space = document.querySelector(`#tab-${i} .n${j}`)
      if(j === table.tableau[i].length-1){
        space.innerText = `${table.tableau[i][j].suit} ${table.tableau[i][j].number} ${table.tableau[i][j].color}`
        table.tableau[i][j].isFlipped = true
      } else {
        space.innerText = "[/////]"
      }
    }
  }
  //for testing --------------------------------------------------
  // $foundations.forEach((foundation,i) => {
  //   foundation.firstChild.innerText = `${table.foundations[i][0].suit} ${table.foundations[i][0].number} ${table.foundations[i][0].color}`
  // })
  //for testing --------------------------------------------------
}
//draw the card's image in page
function placeCards(){
  //in stock
  if(table.stock.length > 0){
    let img = document.createElement("img")
    img.src = unflippedImg
    img.classList.add("card")
    $stock.firstChild.appendChild(img)
  }
  //in waste
  if(table.waste.length > 0){
    let img = document.createElement("img")
    img.src = table.waste[table.waste.length-1].url
    img.classList.add("card")
    $wastepile.firstChild.appendChild(img)
  }
  //in tableau
  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < table.tableau[i].length; j++) {
      let space = document.querySelector(`#tab-${i} .n${j}`)
      let img = document.createElement("img")
      img.src = unflippedImg
      img.classList.add("card")
      
      space.appendChild(img)
    }
  }
  //in foundation
  // $foundations.forEach((foundation,i) => {
  //   if(table.foundations[i] > 0){
  //     console.log("<0");
  //   }
  // })
  for (let i = 0; i < table.foundations.length; i++) {
    if(table.foundations[i].length > 0){
      let img = document.createElement("img")
      img.src = table.foundations[i][table.foundations[i].length-1].url
      img.classList.add("card")
      $foundations[i].firstChild.appendChild(img)
    }
  }
}

cardCreation()
shuffleCards()
layCards()
domDivisions()
// placeCardsDom()
placeCards()