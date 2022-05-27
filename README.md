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

> experimental function to place card names on table

I finally have something to show. I'm happy I made it work:

![gif](./media/images/READMEmd/progress01.gif)

I wrote a function to visualize the name of the cards in the table. There's a lot of work to do, but at least now I can have something visual. Since it's going to be removed once the cards are drawn, here is the code fragment:

```javascript
function placeCardsDom(){
  table.stock.forEach(card => $stock.innerText += ` ${card.suit} ${card.number}`)
  $wastepile.innerText = ` ${table.waste[0].suit} ${table.waste[0].number}`
  for(let i = 0; i < table.tableau.length; i++){
    table.tableau[i].forEach(pile => {
      $tableaus[i].innerText += `${pile.suit} ${pile.number}\n`
    })
  }
}
```

> added divs for each tableau pile

> each card name is now placed on each division

![Tableau with divisions](./media/images/READMEmd/progress02.png)

> function to store moving card and destination card

> function to check if movement is valid

It was a little hard, but I managed to make a function to check if a movement is valid (or "legal"). This is how it works:
- when a space receives a "mousedown", it's card will be stored in an auxiliary variable
- same with "mouseup" but in another auxiliary variable
- if those two spaces have a card, another function will run to check movement validation

The movement will be valid if:
- the two cards are in different piles
- the destination card is the last card in the pile
- the dragged card is one number less than the destination card

Here is a little gif showing in console if the movement is valid:
![gif](./media/images/READMEmd/progress03.gif)

It still needs to check if those two cards aren't the same color and if the destination card is flipped, but I think I can work with this as is and leave it for later.

The next step should be to move those cards when the validation function confirms that the move is valid.

> space creation moved to function

> detect valid card moves from pile to pile

I almost delete everything and start from scratch, because I forgot a few important things, like the cards don't only move from tableau pile to tableau pile! Also didn't find a way to place a child to all the other divs in the table, but after testing and testing found a way to make it work.

So I left the validation function alone and wrote another one to check if the card can be moved to another pile. If the movement is valid, it will show a message in the console. NOW is when I should check if the card can be moved over another.

The rules change depending the pile. Descending numbers on tableau, ascending numbers on foundation, moving out and not in from the waste pile, etc. This will be my next step, now that I can detect the kind of movement is being made.

![gif](./media/images/READMEmd/progress04.gif)

> check if movement is valid based on number only

> depending the pile, the number must be one bigger or smaller

I think I'm figuring it out how to make all the checks. Maybe, instead of nesting `if`s or making it complicated to read with lots of conditions, I should use a few auxiliar variable to store the matches (number, color and suit) and then proceed to check those 3 values to determine if the card can finally be moved.

Here's a little demo, showing how the movements are valid or not based on numbers only:

![gif](./media/images/READMEmd/progress05.gif)

> moved and adapted code from unnecesary function to another

> created another function to check all the neccesary conditions to allow movement

> color validation depending pile destination

> temporal facing down cards not showing it's content

> isFlipped condition to allow movement

The game received a few more conditions before allowing card movement. At this point I noticed how bad I started coding everything. Somethimes I'm adding stuff that should be applied before, and make it's implementation a little harder, or requires code rewriting. Another lesson learned: write down the problem solving before doing anything.

> image URL in cards

> exported card sheet as individual images

I downloaded a svg file with a full card deck.

Deck images by OpenClipart-Vectors from Pixabay ([url](https://pixabay.com/vectors/card-deck-deck-cards-playing-cards-161536/))

I'll give the proper credits to the author in the page itself when it's ready, also the same credits are inside the "resources" folder in CREDITS.txt with the svg file.

I may create my own cards in the future, depending on what I'm going to do with each card. If I want to animate them with rotations and other effects, making cards with divs doesn't feel like the proper way to do it. I think there's a function to convert divs and it's content to images, maybe it could be a better solution.