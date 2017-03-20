# RPS Multiplayer

## Live Link
 - https://yoonslee.github.io/RPS-Multiplayer/

## Requirements

- Make a Rock, Paper, Scissors game that uses Firebase as a real-time database
- Have players enter and leave the game at will, resulting in changes to the UI
- Keep track of wins and losses in the database
- Implement a working chat function where players can talk to each other

## Technologies Used
- jQuery for DOM manipulation
- Firebase for real-time database
- HTML/CSS
- Boostrap

## Code Explanation
- Nearly every aspect of the game is saved as an object in Firebase, including player names, presence of those players, choices, wins/losses, and all chat messages
- The game logic is implemented via Firebase event listeners, which detect changes or children added/removed
- The UI is also dynamically changed according to changes in the database
- HTML sets up the basic structure, and the CSS determines the look (we used Bootstrap here to make things easier)
- JavaScript (and jQuery) detects user clicks and typed input to correctly store data or operate on that information, resulting a smooth game experience