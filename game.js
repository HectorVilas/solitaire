let gameOver = false
let isMouseDown = false
let winX,winY //cursor position on viewport
let deckDesign = "traditional"
let from,to //which card is going to move over which one
let onDoubleClick = false
let cardsTotal

//storing DOM IDs for checks
const tabIDs = []
const foundIDs = []

let deck = [] //the full deck will be stored here

let table = {
  stock: [],
  waste: [],
  foundations: [[],[],[],[]],
  tableau: [[],[],[],[],[],[],[]],
}

//query selectors
//card piles related
const $stock = document.querySelector("#stock");
const $waste = document.querySelector("#waste");
const $infoSpace = document.querySelector("#info-space");
const $foundations = document.querySelectorAll(".foundation");
const $tableaus = document.querySelectorAll(".tableau");
//cards related
const $playArea = document.querySelector(".play-area")
const $movingCards = document.querySelector(".moving-cards")
//hud related
const $btnGear = document.querySelector(".btn-gear")
const $menu = document.querySelector(".menu")
const $btnRestart = document.querySelector(".btn-restart")
const $btnDesign = document.querySelector(".btn-design")
const $btnAbout = document.querySelector(".btn-about")
//prompt related
const $fullScreenContainer = document.querySelector(".full-screen-container")
const $btnClose = document.querySelector(".btn-close")
const $contentAbout = document.querySelector(".content-about")
const $contentWin = document.querySelector(".content-win")


$foundations.forEach(found => foundIDs.push(found.id))
$tableaus.forEach(tab => tabIDs.push(tab.id))

function cardCreation(){
  let suitsList = ["clubs", "diamonds", "spades", "hearts"]
  
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
  //asigning number for win condition
  cardsTotal = deck.length;
}

function shuffleCards(){
  for (let i = 0; i < 10; i++) {
    // deck.sort(() => Math.random() > 0.5)
    deck.sort(() => Math.random() > 0.5 ? 1 : -1) //fix for Chrome and Opera
  }
}

function layCards(){
  //removing any previous card for new game
  for (let i = 0; i < table.tableau.length; i++) table.tableau[i] = []
  table.waste = []
  for (let i = 0; i < table.foundations.length; i++) table.foundations[i] = []
  table.stock = []
  //laying cards
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
  //removing previous divisions for new game
  $tableaus.forEach(tab => tab.innerHTML = "")
  $foundations.forEach(fnd => fnd.innerHTML = "")
  $stock.innerHTML = ""
  $waste.innerHTML = ""

  //adding divisions
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

//space creation
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
    card = lastInPile(table.foundations[pile])
  }else if(place === "stock"){
    pileName = "stock"
    card = "empty"
  }else if(place === "waste"){
    pileName = "waste"
    card = lastInPile(table.waste)
  }
  if(card === undefined || card.length === 0) card = "empty"
  
  //what is going to pass to the origin and destiny variables
  let cardValue = {place, pile, space, pileName, card}

  //place card info in "from" or "to" depending mouse action
  if(action === "mousedown"){
    to = undefined // removing values to helper variables
    from = cardValue
    if(from.place === "stock"){
      stockToWaste()
      from = undefined
    }else if(tabIDs.includes(from.place) && table.tableau[from.pile][from.space]
    === lastInPile(table.tableau[from.pile])
    && table.tableau[from.pile].length > 0
    && lastInPile(table.tableau[from.pile]).isFlipped === false){
      lastInPile(table.tableau[from.pile]).isFlipped = true
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
    }
  }else if(from.place === "waste"){//from waste pile
    if(foundIDs.includes(to.place)){//+++++waste to foundation
      isValidMove({ascendingNumber:true,sameSuit:true,needsSameColor:true})
    }else if(tabIDs.includes(to.place)){//+++++waste to tableau piles
      isValidMove({ascendingNumber:false,sameSuit:false,needsSameColor:false})
    }
  }else if(foundIDs.includes(from.place)){ //from foundation
    if(tabIDs.includes(to.place)){//+++++foundation to tableau piles
      isValidMove({ascendingNumber:false,sameSuit:false,needsSameColor:false})
    }
  }
}

//function to check if move is valid
function isValidMove({ascendingNumber,sameSuit,needsSameColor}){
  if(from.card === undefined){
    return
  }

  let validNum = validSuit = validColor = theLastCard
  = differentPile = isLastCard = isFacingUp = false;

  if(to.card !== "empty"){
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
    if(to.pileName === "tableau"){
      let lastCard = lastInPile(table.tableau[to.pile])
      if(to.card === lastCard){
        isLastCard = true
      }
    } else {
      isLastCard = true
    }
    if(from.pileName === "tableau" && to.pileName === "tableau"){
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
  } else if(to.pileName === "foundation" && from.card.number === 1){
    moveCards() //when card is ace and space is empty
  } else if(to.pileName === "tableau" && from.card.number === 13){
    moveCards() //when tableau space is empty
  }
}

//move cards from one pile to another
function moveCards(){
  let fromHere = removeFromHere = toHere = undefined
  //declaring fromHere
  if(from.pileName === "tableau"){
    fromHere = table.tableau[from.pile][from.space]
    removeFromHere = table.tableau[from.pile]
  } else if(from.pileName === "foundation"){
    fromHere = lastInPile(table.foundations[from.pile])
    removeFromHere = table.foundations[from.pile]
  } else if(from.pileName === "waste"){
    fromHere = lastInPile(table.waste)
    removeFromHere = table.waste
  }
  if(fromHere !== undefined) fromHere.isFlipped = true
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
  let url = `./media/images/cards/${deckDesign}/`
  let unflippedImg = `${url}reverse.png`
  let emptyImg = `${url}empty.png`
  //clear existing cards
  document.querySelectorAll(".separator").forEach(sep => { sep.innerHTML = ""})
  //in stock
  if(table.stock.length > 0){
    for (let i = 0; i < table.stock.length; i+= 3) {
    let img = document.createElement("img")
      img.src = unflippedImg
      img.style.padding = `${i}px ${i}px 0 0`//with margin only works on Firefox
      img.classList.add("card","card-stock","not-animated")
      img.setAttribute("data-place","stock")
      $stock.firstChild.appendChild(img)
    }
  } else {
    let img = document.createElement("img")
    img.src = emptyImg
    img.classList.add("not-animated")
    img.classList.add("card","card-stock")
    img.setAttribute("data-place","stock")
    
    $stock.firstChild.appendChild(img)
  }
  //in waste
  img = document.createElement("img")
  if(table.waste.length > 0){
    let thisCard = lastInPile(table.waste)
    img.src = `${url}${thisCard.suit}${thisCard.number}.png`
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
      //flip last card after moving to other pile
      let lastCard = lastInPile(table.tableau[i])
      lastCard.isFlipped = true;
      
      for (let j = 0; j < table.tableau[i].length; j++) {
        let space = document.querySelector(`#tab-${i} .n${j}`)
        let img = document.createElement("img")
        if(table.tableau[i][j].isFlipped){
          let thisCard = table.tableau[i][j]
          img.src = `${url}${thisCard.suit}${thisCard.number}.png`
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
      let thisCard = lastInPile(table.foundations[i])
      img.src = `${url}${thisCard.suit}${thisCard.number}.png`
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
      $movingCards.style.marginLeft = `-${winX-card.x}px`
      $movingCards.style.marginTop = `-${winY-card.y}px`
      if(!gameOver){
        clickAction("mousedown", card.parentNode.parentNode.id,
        card.getAttribute("data-pile"),card.getAttribute("data-space"))
        doubleClick()
      }
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
  if(totalInFoundation == cardsTotal && !gameOver){
    gameOver = true
    // alert("YOU WIN! This is a temporal message")
    $fullScreenContainer.classList.remove("hidden")
    $contentWin.classList.remove("hidden")
  }
}

//card to foundation in double click
function doubleClick(){
  if(from === undefined || foundIDs.includes(from.place)) return
  
  if (onDoubleClick && from !== undefined) {
    done = false

    if(from.card.isFlipped === false) return //prevents duplication
    
    for (let i = 0; i < 4; i++) {
      let foundation = table.foundations[i]
      if(foundation.length > 0){
        if(from.card.suit === lastInPile(foundation).suit
          && lastInPile(foundation).number === from.card.number-1){
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

//last card
function lastInPile(loc){
  return loc[loc.length-1]
}

//first start and restarting game
function newGame(){
  gameOver = false
  cardCreation()
  preloadImages()
  shuffleCards()
  layCards()
  domDivisions()
  redrawCards()
  AnimatedNewGame()
}

//for moving cards
function draggedCardDom(dragging){
  if(gameOver) return

  if(dragging){
    //move the dragged card to the corner of the cursor
    setTimeout(() => {
      $movingCards.style.marginLeft = `.1em`
      $movingCards.style.marginTop = `.1em`
    }, 10);
    //showing all the dragged cards
    if(from !== undefined){
      let separatorHeight = document.querySelector(".separator.n1").clientHeight

      if(from.pileName === "tableau"
      && table.tableau[from.pile].length > 0
      && table.tableau[from.pile][from.space] !== undefined
      && table.tableau[from.pile][from.space].isFlipped){
        //show empty space if full pile is dragged
        if(from.space == 0){ //double equal because space is array
          let imgPlace = document.querySelector(`#${from.place}`)
          let url = `./media/images/cards/${deckDesign}/`
          let empty = document.createElement("img")
          empty.src = `${url}empty.png`
          empty.classList.add("card","placeholder")
          imgPlace.appendChild(empty)
        }
        //place cards in $movingCards separators
        for (let i = from.space; i < table.tableau[from.pile].length; i++) {
          let movingCard = document.querySelector(`#${from.place} .n${i}`).firstChild
          //hiding originals
          let hideThis = document.querySelector(`#${from.place} .n${i}`)
          hideThis.classList.add("invisible")
          //creating card image
          let DomMovingCard = document.createElement("img")
          let cardSize = document.querySelector(".card")
          DomMovingCard.src = movingCard.src
          DomMovingCard.width = cardSize.width
          DomMovingCard.height = cardSize.height
          DomMovingCard.classList.add("card")
          //creating separator
          let separator = document.createElement("div")
          separator.classList.add("separator",`n${i}`)
          separator.style.height = `${separatorHeight}px`
          //appending result
          separator.appendChild(DomMovingCard)
          $movingCards.appendChild(separator)
          if(movingCard !== null) $movingCards.classList.remove("hidden")
        }
      
      }else if((from.pileName === "waste" && table.waste.length > 0)
      || (from.pileName === "foundation" && table.foundations[from.pile].length > 0)){
        //place cards in $movingCards separators
        let movingCard = document.querySelector(`#${from.place} .n0`).firstChild
        //showing previous card or empty space
        let url = `./media/images/cards/${deckDesign}/`
        let imgPlace = document.querySelector(`#${from.place} .n0`)
        let previousCard = document.createElement("img")
        let length
        let penultimate
        if(from.pileName === "waste"){
          length = table.waste.length
          penultimate = table.waste[table.waste.length-2]
        }else if(from.pileName === "foundation"){
          length = table.foundations[from.pile].length
          penultimate = table.foundations[from.pile][table.foundations[from.pile].length-2]
        }
        //choosing between empty space or previous card in pile
        if(length === 1){
          previousCard.src = `${url}empty.png`
        } else {
          previousCard.src = `${url}${penultimate.suit}${penultimate.number}.png`
        }
        previousCard.classList.add("card","placeholder")
        imgPlace.appendChild(previousCard)
        //hiding originals
        let hideThis = document.querySelector(`#${from.place} .n0`).firstChild
        hideThis.classList.add("invisible")
        //creating card image
        let DomMovingCard = document.createElement("img")
        let cardSize = document.querySelector(".card")
        DomMovingCard.src = movingCard.src
        DomMovingCard.width = cardSize.width
        DomMovingCard.height = cardSize.height
        DomMovingCard.classList.add("card")
        //appending result
        $movingCards.appendChild(DomMovingCard)
        if(movingCard !== null) $movingCards.classList.remove("hidden")
      }
    }
  //when dragging is false (cards stopped being dragged)
  } else { 
    document.querySelectorAll(".invisible").forEach(space => {
      space.classList.remove("invisible")
    })
    let placeholder = document.querySelector(".placeholder")
    // placeholder.parentNode.removeChild(placeholder)
    if(placeholder !== null) placeholder.remove()
    from = undefined
    $movingCards.classList.add("hidden")
    $movingCards.innerHTML = ""
  }
}

//function for prompts
function promptAction(){
  $menu.classList.remove("menu-show")
  
  if(this.className.includes("btn-about")){
    $fullScreenContainer.classList.remove("hidden")
    $contentAbout.classList.remove("hidden")
    $contentWin.classList.add("hidden")
  } else if(this.className.includes("btn-close")){
    $fullScreenContainer.classList.add("hidden")
    $contentAbout.classList.add("hidden")
    $contentWin.classList.add("hidden")
  }
}

//preloading all the card images
function preloadImages(){
  const $preload = document.querySelector("#preload")
  for (let i = 0; i < 2; i++) {
    deck.forEach(card => {
      let img = document.createElement("img")
      let url = `./media/images/cards/${deckDesign}/`
      img.src = `${url}${card.suit}${card.number}.png`
      $preload.appendChild(img)
    })
    
    i === 0 ? deckDesign = "russian" : deckDesign = "traditional"
  }
  setTimeout(() => {
    $preload.innerHTML = ""
  }, 1000);
}

//animation for laying cards in table
function AnimatedNewGame(){
  gameOver = true
  const stockPile = document.querySelector("#stock .n0")
  const toAnimate = document.querySelectorAll(`.card:not(.not-animated)`)
  // hiding original cards
  toAnimate.forEach(card => card.classList.add("invisible"))
  //creating cards
  for (let i = 0; i < toAnimate.length; i++) {
    let newCard = document.createElement("img")
    newCard.src = `./media/images/cards/${deckDesign}/reverse.png`
    newCard.classList.add("card","animation-intro")
    stockPile.appendChild(newCard)
  }

  const animated = document.querySelectorAll(".animation-intro")
  
  animated.forEach(card => {
    card.style.left = `${stockPile.offsetLeft}px`
    card.style.top = `${stockPile.offsetTop}px`
  })
  
  for (let i = 0; i < animated.length; i++) {
    setTimeout(() => {
      animated[i].style.left = `${toAnimate[i].offsetLeft}px`
      animated[i].style.top = `${toAnimate[i].offsetTop}px`
    }, 100*(i+1));
  }
  //show original cards once the last card gets animated
  animated[animated.length-1].addEventListener("transitionend", (e) => {
    if(e.propertyName === "top"){
      toAnimate.forEach(card => card.classList.remove("invisible"))
      //deleting the animated cards
      setTimeout(() => {
        animated.forEach(card => {
          if(card.className.includes("animation-intro")){
            stockPile.removeChild(card)
          }
        })
      }, 100);
      
      gameOver = false
    }
  })
  
}



//DOM listeners
$btnGear.addEventListener("click", () => {
  $menu.classList.toggle("menu-show")
})

$btnRestart.addEventListener("click", () => {
  $menu.classList.toggle("menu-show")
  newGame()
})

$btnDesign.addEventListener("click", () =>{
  if(deckDesign === "traditional"){
    deckDesign = "russian"
  } else if(deckDesign === "russian"){
    deckDesign = "traditional"
  }
  redrawCards()
})

$btnAbout.addEventListener("click", promptAction)

$btnClose.addEventListener("click", promptAction)

//mouse events on window
window.onmousedown = () => {
  isMouseDown = true
  checkDeck()
}

window.onmouseup = () => {
  isMouseDown = false
  draggedCardDom(false)
}

window.onmousemove = (e) => {
  if(isMouseDown){
    isMouseDown = false
    draggedCardDom(true)
  }
  //storing cursor coordinates on move
  winX = e.x
  winY = e.y
  $movingCards.style.left = `${winX}px`
  $movingCards.style.top = `${winY}px`
}

//start a new game on page load
newGame()

// - - - - - - - - - - debugging tools - - - - - - - - - -

//check if a card disappeared or is duplicated
//enable function in "window.onmousedown" to use it
function checkDeck(){
  let fullDeck = []
  table.stock.forEach(card => {
    if(fullDeck.includes(card)){
      console.log(`duplicated card in deck: ${card.number} of ${card.suit}`)
    }
    fullDeck.push(card)
  })
  table.waste.forEach(card => {
    if(fullDeck.includes(card)){
      console.log(`duplicated card in waste: ${card.number} of ${card.suit}`)
    }
    fullDeck.push(card)
  })
  table.foundations.forEach(fnd => fnd.forEach(card => {
    if(fullDeck.includes(card)){
      console.log(`duplicated card in foundation: ${card.number} of ${card.suit}`)
    }
    fullDeck.push(card)
  }))
  table.tableau.forEach(tabl => tabl.forEach(card => {
    if(fullDeck.includes(card)){
      console.log(`duplicated card in tableau: ${card.number} of ${card.suit}`)
    }
    fullDeck.push(card)
  }))

  if(fullDeck.length < 52){
    console.log("there's missing cards: "+fullDeck.length+"/52 in total")
  } else if(fullDeck.length > 52){
    console.log("there's extra cards: "+fullDeck.length+"/52 in total")
  }
}