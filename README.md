# solitaire
Welcome to my new project! This time I'm making something I wanted to create since I started learning about DOM methods: a classic klondike Solitaire. I've been prototyping a little before creating this repository, and I think I came with a good enough way to recreate this game.

# ❌✅roadmap✅❌

### basics
- a new object will be created with the following:
- - ❌ an array for the facing down cards to draw
- - ❌ an array for the drawn cards facing up
- - ❌ 4 arrays for the sorted cards
- - ❌ 7 arrays representing the columns in the table

### cards
- ❌ create an array with all the necessary cards (52)
- each card must be an object:
- - ❌ objects must contain suit, number, color, isFlipped, image url
- - ❌ number > 10 will be a court card and 1 will be ace card, in code will still be a number

### DOM
- ❌ the play area will be divided in 2 rows and 7 columns
- the first row will contain:
- - ❌ first cell will contain the faced down cards
- - ❌ second cell will contain the drawn cards from the left
- - ❌ empty or info cell:
- - ❌ 4 cells to pile up the same-suit cards
- the second row will contain:
- - ❌ 7 columns for the play area

### starting a new game
- ❌ the cards array will be shuffled with `array.sort(random>0.5)`
- ❌ in the play area, the first card will be placed face down in the first column, the second column will receive 2 cards, the third one 3 cards... the last column will receive 7 cards
- ❌ a facing-up card will be placed in the drawn cards in first row
- ❌ the remaining cards will be placed face down in the first cell
- ❌ all the last card on each column in the play area will be flipped automatically

### playing
- ❌ "mousedown" on facing down card will "flip" the card
- "mousedown" on facing up card will:
- - ❌ store in "cardFrom" which cell has been pressed and the clicked card in that pile
- "mouseup" will:
- - ❌ store in "cardDestination" which cell is under the mouse cursor and the last card in the pile
- - ❌ run a function to check if the movement is valid
- - ❌ clear the cadrFrom and cardDestination variables

- the validating function will:
- - in play area the validating function:
- - - if cardFrom number == cardDestination number+1 && cardFrom color != cardDestination color:
- - - - ❌ remove last cards from the cardFrom column
- - - - ❌ add cardFrom card or cards to cardDestination
- - ❌ in pile-up space on top, the same will happen but with ascending numbers and only with same suit type

- ❌ if all same-suit piled up cards contains 13 cards, the game is over

### other ideas
- ❌ spanish card deck to replace design
- ❌ button to switch language (english-spanish)
- ❌ sounds