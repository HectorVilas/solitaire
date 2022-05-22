let cards = []

let table = {
  stock: [],
  waste: [],
  foundations: { pile1: [1], pile2: [2], pile3: [3], pile4: [4] },
  tableau: {pile1: [], pile2: [], pile3: [], pile4: [],
    pile5: [], pile6: [], pile7: [] },
}

//creating cards
let suitsList = ["club", "diamonds", "spades", "hearts"]

for(let suitLoop = 0; suitLoop < 4; suitLoop++){
  for(let cardLoop = 1; cardLoop < 14; cardLoop++){
    let suit, number, color
    suit = suitsList[suitLoop]
    number = cardLoop
    
    suitLoop%2 === 0 ? color = "black": color = "red"
    
    let card = { suit, number, color, isFlipped: false }
    cards.push(card)
  }
}