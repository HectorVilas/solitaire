# solitaire
Welcome to my new project! This time I'm making something I wanted to create since I started learning about DOM methods: a classic klondike Solitaire. I've been prototyping a little before creating this repository, and I think I came with a good enough way to recreate this game.

## play the game:
# https://hectorvilas.github.io/solitaire/

## roadmap

### basics
- a new object will be created with the following:
- ✅ an array for stock
- ✅ an array for wastepile
- ✅ 4 arrays for foundations
- ✅ 7 arrays for tableau

### cards
- ✅ create an array with all the necessary cards (52)
- each card must be an object:
- ✅ objects must contain suit, number, color, isFlipped
- ❌ image url (maybe won't be necessary)
- ❌ 1 will be ace card and number > 10 will be a court card, in code will still be a number

### DOM
- ❌ the play area will be divided in 2 rows and 7 columns
- the first row will contain:
- ❌ first cell for stock
- ❌ second cell for wastepile
- ❌ empty or info cell
- ❌ 4 cells for foundation
- the second row will contain:
- ❌ 7 tableaus

### starting a new game
- ❌ the cards array will be shuffled with `array.sort(random>0.5)`
- ❌ in the play area, the first card will be placed face down in the first tableau, the second tableau will receive 2 cards, the third one 3 cards... the last tableau will receive 7 cards
- ❌ a facing-up card will be placed in wastepile
- ❌ the remaining cards will be placed face down in the stock
- ❌ all the last cards on the tableau will be flipped automatically

### playing
- ❌ "mousedown" on facing down card will "flip" the card
- "mousedown" on facing up card will:
- ❌ store in "cardFrom" which cell has been pressed and the clicked card in that pile
- "mouseup" will:
- ❌ store in "cardDestination" which cell is under the mouse cursor and the last card in the pile
- ❌ run a function to check if the movement is valid
- ❌ clear the cadrFrom and cardDestination variables

- the validating function will:
- in tableaus the validating function:
- if cardFrom number == cardDestination number+1 && cardFrom color != cardDestination color:
- - ❌ remove last cards from the cardFrom column
- - ❌ add cardFrom card or cards to cardDestination
- ❌ in the foundations, the same will happen but with ascending numbers and only with same suit type
- check for win condition:
- ❌ if all same-suit piled up cards contains 13 cards, the game is over

### other ideas
- ❌ spanish card deck to replace design
- ❌ button to switch language (english-spanish)
- ❌ sounds
- ❌ visual representation of options instead of text
- ❌ more game modes
- ❌ draw the cards with divs instead of using a full image for each one

# updates
> the play-area has been drawn with grid.

First time using grid, and I like how intuitive it is. [This guide](https://css-tricks.com/snippets/css/complete-guide-grid/) was really good to understand the basics, same with [this educational game](https://cssgridgarden.com/).

I've also been reading about Klondike on Wikipedia and learned how those spaces in the table are called, it will make the code more comfy to write and will look less ignorant if somebody reads it.

I'm a little nervous with this project, this is the first time I even think how I will make something like this. Will I success? The logic part will be challenging but I think I figured it out. The visual part will be more challenging, because I need to learn a lot more about `CSS`.

> card generator

This little piece of code will generate each necessary card and store them in an array.

```javascript
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
```
> card shuffling and laying

After trying some stuff, I modified the original table object and replaced the pile1, pile2... pile7 keys with a simple 2D array, for better code. Thanks to this, I can place the cards in the tableau with a few lines of code:

```javascript
for(let i = 0; i < table.tableau.length; i++){
  let quantity = i;
  for (let j = quantity+1; j > 0; j--) {
    table.tableau[i].push(cards[0])
    cards.shift()
  }
}
```
This will place the corresponding cards in each tableau pile. For each card placed, the same card is removed from the deck, to prevent duplications.