let deckDesign = "traditional"
let unflippedImg = "./media/images/cards/traditional/reverse.png"
let emptyImg = "./media/images/cards/traditional/empty.png"
let from,to
let onDoubleClick = false
let cardsTotal
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
const $waste = document.querySelector("#waste");
const $infoSpace = document.querySelector("#info-space");
const $foundations = document.querySelectorAll(".foundation");
const $tableaus = document.querySelectorAll(".tableau");
const $playArea = document.querySelector(".play-area")

$foundations.forEach(found => foundIDs.push(found.id))
$tableaus.forEach(tab => tabIDs.push(tab.id))

function cardCreation(){
  let suitsList = ["clubs", "diamonds", "spades", "hearts"]
  
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
  //asigning number for win condition
  cardsTotal = deck.length;
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
  deck[0].isFlipped = true
  table.waste.push(deck[0])
  deck.shift()
  table.stock = deck
  deck = []

  //flip cards
  for(let i = 0; i < table.tableau.length; i++)
  table.tableau[i][i].isFlipped = true
}

//adding divisions in wastepile and tableau
function domDivisions(){
  $tableaus.forEach((thisTableau, pile) => {
    for (let space = 0; space < 20; space++) {
      createSpace(thisTableau,pile,space)
    }
  })
  createSpace($stock)
  createSpace($waste)
  $foundations.forEach((foundation,pile) => {
    createSpace(foundation,pile)
  })
}

//space creation with listener
function createSpace(appendTo, pile = 0, space = 0){
  let separator = document.createElement("div")
  separator.classList.add("separator",`n${space}`)
  
  appendTo.appendChild(separator)
}

//action to store the interacting cards
function clickAction(action, place, pile, space){
  //adding "pileName" and "card"
  let pileName, card
  if(tabIDs.includes(place)){
    pileName = "tableau"
    card = table.tableau[pile][space]
  }else if(foundIDs.includes(place)){
    pileName = "foundation"
    card = table.foundations[pile]
  }else if(place === "stock"){
    pileName = "stock"
    card = "stock"
  }else if(place === "waste"){
    pileName = "waste"
    card = table.waste[table.waste.length-1]
  }
  
  //what is going to pass to the origin and destiny variables
  let cardValue = {place, pile, space, pileName, card}

  console.log(cardValue);

  //place card info in "from" or "to" depending mouse action
  if(action === "mousedown"){
    to = undefined // removing values to helper variables
    from = cardValue
    if(from.place === "stock"){
      stockToWaste()
      from = undefined
    }else if(tabIDs.includes(from.place) && table.tableau[from.pile][from.space]
    === table.tableau[from.pile][table.tableau[from.pile].length-1] //is last card
    && table.tableau[from.pile].length > 0){
      table.tableau[from.pile][table.tableau[from.pile].length-1].isFlipped = true
      redrawCards()
    }
  } else if(action === "mouseup"){
    to = cardValue
    
    if(from !== undefined || to !== undefined) dragCard()

    from = undefined // removing values to helper variables
  }
}

//checks origin and destination of card
function dragCard(){
  if(from === undefined) return

  if(tabIDs.includes(from.place)){ //from tableau piles
    if(tabIDs.includes(to.place)){//+++++tableau to tableau
      isValidMove({ascendingNumber:false,sameSuit:false,needsSameColor:false})
    }else if(foundIDs.includes(to.place)){//+++++tableau to foundations
      isValidMove({ascendingNumber:true,sameSuit:true,needsSameColor:true})
    } else {
      console.log("movement canceled")
    }
  }else if(from.place === "waste"){//from waste pile
    if(foundIDs.includes(to.place)){//+++++waste to foundation
      isValidMove({ascendingNumber:true,sameSuit:true,needsSameColor:true})
    }else if(tabIDs.includes(to.place)){//+++++waste to tableau piles
      isValidMove({ascendingNumber:false,sameSuit:false,needsSameColor:false})
    } else {
      console.log("movement canceled")
    }
  }else if(foundIDs.includes(from.place)){ //from foundation
    if(tabIDs.includes(to.place)){//+++++foundation to tableau piles
      isValidMove({ascendingNumber:false,sameSuit:false,needsSameColor:false})
    } else {
      console.log("movement canceled")
    }
  }
}

//function to check if move is valid
function isValidMove({ascendingNumber,sameSuit,
  needsSameColor}){
  if(from.card === undefined){
    return
  }

  let validNum = validSuit = validColor = theLastCard
  = differentPile = isLastCard = isFacingUp = false;

  if(to.card !== undefined){
    if((ascendingNumber && from.card.number === to.card.number+1)
    || (!ascendingNumber && from.card.number === to.card.number-1)){
      validNum = true
    }
    if(sameSuit){
      if(from.card.suit === to.card.suit){
        validSuit = true
      }
    }else{
      validSuit = true
    }
    if((needsSameColor && from.card.color === to.card.color)
    || (!needsSameColor && from.card.color !== to.card.color)){
      validColor = true
    }
    if(tabIDs.includes(to.place)){
      let lastCard = table.tableau[to.pile][table.tableau[to.pile].length-1]
      if(to.card === lastCard){
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
    if(from.card.isFlipped && to.card.isFlipped){
      isFacingUp = true
    }
    if(validNum && validSuit && validColor
      && isLastCard && isFacingUp && differentPile){
      moveCards()
    }
  } else if(foundIDs.includes(to.place) && from.card.number === 1){
    to.card = "empty"
    moveCards()
  } else if(tabIDs.includes(to.place)){
    to.card = "empty"
    moveCards()
  }
}

//move cards from one pile to another
function moveCards(){
  let fromHere = removeFromHere = toHere = undefined
  //declaring fromHere
  if(tabIDs.includes(from.place)){
    fromHere = table.tableau[from.pile][from.space]
    removeFromHere = table.tableau[from.pile]
  } else if(foundIDs.includes(from.place)){
    fromHere = table.foundations[from.pile][table.foundations[from.pile].length-1]
    removeFromHere = table.foundations[from.pile]
  } else if(from.place === "waste"){
    fromHere = table.waste[table.waste.length-1]
    removeFromHere = table.waste
  }
  fromHere.isFlipped = true
  //declaring toHere
  if(foundIDs.includes(to.place)){
    toHere = table.foundations[to.pile]

  }else if(tabIDs.includes(to.place)){
    toHere = table.tableau[to.pile]
  }
  toHere.isFlipped = true

  //move piles
  let fromIndex = removeFromHere.findIndex(card => card === fromHere)
  let howMany = removeFromHere.length - fromIndex
  let cardsToMove = removeFromHere.slice(fromIndex)

  cardsToMove.forEach(card => toHere.push(card))
  
  for (let i = howMany; i > 0; i--) {
    removeFromHere.pop()
  }

  redrawCards()
}

//function to place one card in waste or return cards if empty
function stockToWaste(){
  if(table.stock.length > 0){
    table.stock[0].isFlipped = true
    table.waste.push(table.stock[0])
    table.stock.shift()
  } else if(table.waste.length > 0){
    table.stock = table.waste
    table.waste = []
  }

  redrawCards()
}

//draw the card's image in page
function redrawCards(){
  //clear existing cards
  document.querySelectorAll(".separator").forEach(sep => { sep.innerHTML = ""})
  //in stock
  let img = document.createElement("img")
  if(table.stock.length > 0){
    img.src = unflippedImg
  } else {
    img.src = emptyImg
    img.classList.add("not-animated")
  }
    img.classList.add("card","card-stock")
    img.setAttribute("data-place","stock")

    $stock.firstChild.appendChild(img)
  //in waste
  img = document.createElement("img")
  if(table.waste.length > 0){
    img.src = table.waste[table.waste.length-1].url
  } else {
    img.src = emptyImg
    img.classList.add("not-animated")
  }
    img.classList.add("card","card-waste")
    img.setAttribute("data-place","waste")
    img.setAttribute("data-pile",0)
    img.setAttribute("data-space",0)

    $waste.firstChild.appendChild(img)
  //in tableau
  for(let i = 0; i < table.tableau.length; i++){
    if(table.tableau[i].length !== 0){
      for (let j = 0; j < table.tableau[i].length; j++) {
        let space = document.querySelector(`#tab-${i} .n${j}`)
        let img = document.createElement("img")
        if(table.tableau[i][j].isFlipped){
          img.src = table.tableau[i][j].url
        } else {
          img.src = unflippedImg
        }
        img.classList.add("card")
        img.setAttribute("data-place","tableau")
        img.setAttribute("data-pile",i)
        img.setAttribute("data-space",j)
        
        space.appendChild(img)
      }
    } else {
      let space = document.querySelector(`#tab-${i} .n${0}`)
        let img = document.createElement("img")
        img.src = emptyImg
        img.classList.add("not-animated")
        img.classList.add("card")
        img.setAttribute("data-place","tableau")
        img.setAttribute("data-pile",i)
        img.setAttribute("data-space",0)
        
        space.appendChild(img)
    }
  }
  //in foundations
  for (let i = 0; i < table.foundations.length; i++) {
    let img = document.createElement("img")
    img.classList.add("card","card-foundation")
    img.setAttribute("data-place","foundation")
    img.setAttribute("data-pile",i)
    img.setAttribute("data-space",0)
    if(table.foundations[i].length > 0){
      img.src = table.foundations[i][table.foundations[i].length-1].url
    } else {
      img.src = emptyImg
      img.classList.add("not-animated")
    }

    $foundations[i].firstChild.appendChild(img)
  }
  addListeners()
  adjustSeparators()
  checkWinCondition()
}

//add listeners to cards
function addListeners(){
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mousedown", (e) => {
      clickAction("mousedown", card.parentNode.parentNode.id,
      card.getAttribute("data-pile"),card.getAttribute("data-space"))
      doubleClick()
      e.preventDefault()
    })

    card.addEventListener("mouseup", () => {
      clickAction("mouseup", card.parentNode.parentNode.id,
      card.getAttribute("data-pile"),card.getAttribute("data-space"))
    })
  })
}

//hide unused separators
function adjustSeparators(){
  let longest = 0;
  table.tableau.forEach((tab) => {
    if(longest < tab.length){
      longest = tab.length
    }
  })

  for(let i = 0; i < table.tableau.length; i++){
    for (let j = 0; j < 20; j++) {
      let space = document.querySelector(`#tab-${i} .n${j}`)
      if(j > longest){
        space.classList.add("sep-hidden")
        space.classList.remove("separator")
      }else {
        space.classList.remove("sep-hidden")
        space.classList.add("separator")
      }
    }
  }
}

//game is over when the 4 foundations have all the 13 cards
function checkWinCondition(){
  let totalInFoundation = table.foundations[0].length
  + table.foundations[1].length
  + table.foundations[2].length
  + table.foundations[3].length
  if(totalInFoundation == cardsTotal){
    alert("YOU WIN! This is a temporal message")
  }
}

//card to foundation in double click
function doubleClick(){
  if(from === undefined || foundIDs.includes(from.place)) return
  
  if (onDoubleClick && from !== undefined) {
    done = false

    if(from.card === undefined) return
    
    for (let i = 0; i < 4; i++) {
      let foundation = table.foundations[i]
      if(foundation.length > 0){
        if(from.card.suit === foundation[foundation.length-1].suit
          && foundation[foundation.length-1].number === from.card.number-1){
            if(from.pileName === "tableau" && !done){
              foundation.push(from.card)
              table.tableau[from.pile].pop()
              done = true
              redrawCards()
            } else if(from.pileName === "waste" && !done){
              foundation.push(from.card)
              table.waste.pop()
              done = true
              redrawCards()
            }
        }
      } else if(from.card.number === 1 && !done){
        if(from.pileName === "tableau"){
          foundation.push(from.card)
          table.tableau[from.pile].pop()
          done = true
        } else if(from.pileName === "waste"){
          foundation.push(from.card)
          table.waste.pop()
          done = true
        }
        redrawCards()
      }
    }
  }

  onDoubleClick = true
  setTimeout(() => {
    onDoubleClick = false
  }, 250)
}

//hud listeners
$btnGear = document.querySelector(".btn-gear")
$menu = document.querySelector(".menu")
$btnGear.addEventListener("click", () => {
  $menu.classList.toggle("menu-show")
})

cardCreation()
shuffleCards()
layCards()
domDivisions()
redrawCards()