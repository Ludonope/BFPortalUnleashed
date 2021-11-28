# Battlefield Portal Unleashed

A Battlefield Portal scripting tool

Use pseudo-javascript in a VSCode editor straight into your browser to code the next Battlefield Portal experience.

Auto-completion™️ included.

## Install

1. Install the BF2042-Portal-Extensions
    - Chrome: https://chrome.google.com/webstore/detail/bf2042-portal-extensions/ojegdnmadhmgfijhiibianlhbkepdhlj
    - Firefox: https://addons.mozilla.org/en-US/firefox/addon/bf2042-portal-extensions/
2. Pin the extension to be able to click on it
3. Click on the extension icon > `Options`
4. Click on `Add plugin` and enter the following url

```txt
https://ludonope.github.io/BFPortalUnleashed/dist/manifest.json
```

Now when you go to the Battlefield Portal rules editor you should see the text editor popup after a few seconds :)

To convert the code into blocks press `Ctrl+S` or `Cmd+S`.

If nothing appens, you can open the browser console with `F12` and check the error, it might be a syntax issue or a problem with Portal Unleashed itself.

## **IMPORTANT**

The files are saved localy in your browser, it is **HIGHLY** encouraged to save your work regularly until cloud saving is setup.

You can save your code by right clicking in the editor and select `Export content`.

You will lose the data if:
- You delete the extension
- You uninstall your browser
- You delete your browser data

> Please be safe, there is no way to recover any of that at all if any of this happen.

## Known issues

### Some Functions have a different name as in the editor

There isn't much I can do about this. The editor is localized so the names will be different depending on your browser's language.

The names used here are the underlying ones.

### Warnings on player state boolean checks

There is a warning for some reasons as the linter seems to get some overloads wrong. The code will still compile tho, you can safely ignore it.

## I still have a problem

Please open an issue, it's the best way to track it for everyone: https://github.com/Ludonope/BFPortalUnleashed/issues

If you would like to contribute see the **Contribute** section at the end.

## Documentation

### Sample experience

Here is a basic example showing multiple features of `portal-unleashed`.

> Please note that right now the syntaxes are not very flexible, please try to follow a similar syntax as much as possible ;)
> Also note that for now errors are only displayed in the console, and probably not very explicit most of the time.

```js
import { mod, player, ui } from 'portal-unleashed'

// Important to always init first
mod.init()

let teamScore = mod.newTeamVar()
let playerScore = mod.newPlayerVar()

mod.onGameModeStarted('Set scores', () => ({
    conditions: [],
    actions: () => {
        teamScore[player.GetTeamId(0)] = 0
        teamScore[player.GetTeamId(1)] = 0
    }
}))

mod.onPlayerJoinGame('Set player score', (eventPlayer) => ({
    conditions: [],
    actions: () => {
        playerScore = 0
    }
}))

mod.onPlayerDied('Reset player score', (eventPlayer, otherPlayer) => ({
    conditions: [
        eventPlayer != otherPlayer,
    ],
    actions: () => {
        teamScore[player.GetTeamId(otherPlayer)] = playerScore + 1
        playerScore = 0
        mySubroutine()
    }
}))

// Subroutines must be defined at top-level and return an object with array `conditions` and lambda `actions`
// similar to the events return object
function mySubroutine() {
    return {
        conditions: [],
        actions: () => {
            ui.ClearAllCustomNotificationMessages()
        }
    }
}
```

### Import

You can import different object and namespaces to access the various functionnalities of Portal Unleashed.

```js
import {
    mod, // The mod object, used to create variables and rules
    eventPayloads, // Access event payloads from subroutines (EventPlayer, EventOtherPlayer, EventTeam)
    enums, // All the selection lists

    // Same categories as in the portal editor
    player,
    ui,
    arrays,
    gameplay,
    logic,
    math,
} from 'portal-unleashed'
```

> Note: don't forget to call `mod.init()` right after the import, else it will break down fairly quickly.

### Create a rule

The `mod` object can be used to create a new rule, overall it follows this syntax:

```js
// This is not a real event, just showcasing the syntax
mod.onSomething('My rule name whatever', (eventPlayer) => ({
    conditions: [
        // ...
    ],
    actions: () => {
        // ...
    }
}))
```

> Note: please follow that syntax for now as the preprocessing is not very flexible yet
> Also, don't forget the parenthesis around the object in `(eventPlayer) => ({ ... })`

The event will provide the different payloads, depending on the event type you will get the following objects:

```js
(eventPlayer) => ({ ... }) // For events involving 1 player, such as onPlayerDeployed
(eventPlayer, otherPlayer) => ({ ... }) // For events involving 2 players, such as onPlayerDied
(eventTeam) => ({ ... }) // For events involving a team, such as ongoingTeam
```

The `ongoing` event has been declined into three events to directly get the corresponding payloads:

```js
mod.ongoing('Global ongoing', () => ({ ... }))
mod.ongoingPlayer('Player ongoing', (eventPlayer) => ({ ... }))
mod.ongoingTeam('Team ongoing', (eventTeam) => ({ ... }))
```

The object returned by the function **MUST** have those two fields:

```js
{
    conditions: [],
    actions: () => {
        // ...
    }
}
```

`conditions` is a list of `boolean`.
`actions` is a function which doesn't return anything.

### Subroutines

To create a subroutine you simply need to create a top-level `function` using this syntax.
The object returned is the same as in the rules just above.

```js
function mySubroutine() {
    return {
        conditions: [
            // ...
        ],
        actions: () => {
            // ...
        }
    }
}
```

> Note: you cannot pass any parameter to subroutines as this is not supported by the Portal Editor itself.

To call your subroutine you simply call the function where you need it.

```js
mod.ongoing('I like chocolate', () => ({
    conditions: [],
    actions: () => {
        mySubroutine()
    }
}))
```

### Variables

> **IMPORTANT**: the syntax for variables is subject to changes very soon as it is not very practical yet in a lot of scenarios

You can create variables using the `mod` object.

```js
let globalVariable = mod.newGlobalVar()
let playerVariable = mod.newPlayerVar()
let teamVariable = mod.newTeamVar()
```

> You can use an arbitrary number of these variables, **HOWEVER** you cannot use them to track over time.
>
> They are not real variables as they are all stored in a single array (one for each type: `global`, `player` and `team`).
>
> See the following section to use "real" variables.

You can then use them normally in your rules or subroutines

```js
mod.ongoing('I like chocolate', () => ({
    conditions: [],
    actions: () => {
        globalVariable = 0
        if (globalVariable < 10) {
            // ...
        }
    }
}))
```

To use `player` or `team` variables you can specify the object using brackets

```js
mod.onPlayerDied('I hate banana', (eventPlayer, otherPlayer) => ({
    conditions: [],
    actions: () => {
        playerVariable[otherPlayer] = playerVariable[eventPlayer]
        playerVariable[eventPlayer] = 0
    }
}))

mod.ongoingTeam('Pasta is great', (eventTeam) => ({
    conditions: [],
    actions: () => {
        teamVariable[eventTeam] = "Hello team"
    }
}))
```

**Syntactic sugar:** since most of the time the `player` or `team` variables will use the current event payload, in those cases you can omit the object itself

The previous example then becomes:

```js
mod.onPlayerDied('I hate banana', (eventPlayer, otherPlayer) => ({
    conditions: [],
    actions: () => {
        playerVariable[otherPlayer] = playerVariable
        playerVariable = 0
    }
}))

mod.ongoingTeam('Pasta is great', (eventTeam) => ({
    conditions: [],
    actions: () => {
        teamVariable = "Hello team"
    }
}))
```

### Trackable variables

The trackable variables creates a real variable in the Portal Editor.

You can use 15 of each at most.

> Note: you can only use 15 (instead of 16) as the first one is the array used to store variables from the above section.

```js
let trackGlobal = mod.newTrackableGlobalVar("trackGlobal")
let trackPlayer = mod.newTrackablePlayerVar("trackPlayer")
let trackTeam = mod.newTrackableTeamVar("trackTeam")
```

> For now you need to specify the actual variable name as a parameter, this will change soon.

You can use those variables in the same way as normal variables, but when you want to track it you will have to call `.var()` to get the reference itself.

```js
logic.ChaseVariableAtRate(globalVariable.var(), 1, 5)
```

### Arrays

> **IMPORTANT**: the syntax for arrays is subject to changes very soon as it is not very practical yet in a lot of scenarios

To get the item at a certain index:

```js
player.AllPlayers().at(2)
```

Array includes a few helpers which allow to use them in a *somewhat* similar way to javascript.

```js
player.AllPlayers()
    .filter((p) => p !== eventPlayer)
    .forEach((v) => {
        playerScore[p] += 1                    
    })
```

Here is the complete list:

```ts
class Array {
    length: number; // CountOf the array
    first: any; // First element
    last: any; // Last element
    
    at(index: number): any; // Item at `index`
    randomValue(): any; // Returns a random value in the array
    
    filter(predicate: (v: any, i: number, a: Array) => boolean): Array; // Returns a FilteredArray
    map(predicate: (v: any, i: number, a: Array) => any): Array; // Returns a MappedArray
    shuffled(): Array; // Returns a shuffled version of the array
    sorted(predicate: (v: any) => number): Array; // Returns a sorted version of the array, ascendant order based on number returned by predicate
    
    every(predicate: (v: any, i: number, a: Array) => boolean): boolean; // Check if condition is true for every element
    any(predicate: (v: any, i: number, a: Array) => boolean): boolean; // Check if condition is true for at least 1 element
    
    append(element: any, ...elements: any): Array; // Returns a new array with elements appended to it
    slice(startIndex: number, count?: number): Array; // Returns a slice of the array, if count is not defined it will include everything after `startIndex`

    forEach(predicate: (v: any, i: number, a: Array) => any): void; // Loop on the array
}    
```

> Note: the `a` parameter for predicates is only here for convenience but you should avoid using it, especially when chaining calls as it will duplicate the whole parameter and make the generated "blocks" very bloated

### Array variables

> **IMPORTANT**: the syntax for array variables is subject to changes very soon as it is not very practical yet in a lot of scenarios

For every type of variable, there is also an `Array` version which is very useful every time you use an array as variable.

```js
let globalVariable = mod.newArrayGlobalVar()
let playerVariable = mod.newArrayPlayerVar()
let teamVariable = mod.newArrayTeamVar()
let trackGlobal = mod.newTrackableArrayGlobalVar("trackGlobal")
let trackPlayer = mod.newTrackableArrayPlayerVar("trackPlayer")
let trackTeam = mod.newTrackableArrayTeamVar("trackTeam")
```

You can use them like regular variables with the `Array` functionnalities, but you also get an additionnal helper:

```js
globalVariable.push(0, 1, 2)
```

With `.push` you can append items to the variable itself.

> Note: there is no autocompletion on those variable types yet, this should come in the future!

### Logic structures

You can use the following structures:

```js
if (...) {
    // ...
} else if (...) {
    // ...
} else {
    // ...
}

while (...) {
    continue;
    // or
    break;
}
```

The `for` loops are not supported for now.

## Contributing

### Build the extension

This will generate the `generator/portal-unleashed` folder containing the library bundled with Webpack.

```bash
cd generator
npm install
npm run build
§```

This will build the Chromium extension.

```bash
cd extension
npm install
npm run build
```

### Development

In the `generator` you can generate the `portal-unleashed` typescript files without bundling it with Webpack using

```bash
npm run generate
```

## Roadmap

- Improve typing for `Array` and `Variable`
- Add error "window" to help debugging rather than having to open the browser console
- Add generated documentation for the library
- Make convertion from blocks to code possible
- Cloud saves (optionnal)
- Meta programmation
