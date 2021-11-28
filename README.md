# Battlefield Portal Unleashed
A Battlefield Portal scripting tool

Use pseudo-javascript in a VSCode editor straight into your browser to code the next Battlefield Portal experience.

Auto-completion™️ included.

# Build the extension

This will generate the `generator/portal-unleashed` folder containing the library bundled with Webpack.

```bash
cd generator
npm install
npm run build
```

This will build the Chromium extension.

```bash
cd extension
npm install
npm run build
```

# Development

In the `generator` you can generate the `portal-unleashed` typescript files without bundling it with Webpack using

```bash
npm run generate
```

# Portal experience example

Here is a basic example showing multiple features of `portal-unleashed`.

> Please note that right now the syntaxes are not very flexible, please try to follow a similar syntax as much as possible ;)
> Also note that for now errors are only displayed in the console, and probably not very explicit most of the time.

```js
import { mod, player, ui } from 'portal-unleashed'

// Important to always init first
mod.init()

const teamScore = mod.newTeamVar()
const playerScore = mod.newPlayerVar()

mod.onGameModeStarted('Set scores', () => ({
    conditions: [],
    actions: () => {
        teamScore(player.GetTeamId(0)).set(0)
        teamScore(player.GetTeamId(1)).set(0)
    }
}))

mod.onPlayerJoinGame('Set player score', (eventPlayer) => ({
    conditions: [],
    actions: () => {
        playerScore(eventPlayer).set(0)
    }
}))

mod.onPlayerDied('Reset player score', (eventPlayer, otherPlayer) => ({
    conditions: [
        eventPlayer != otherPlayer,
    ],
    actions: () => {
        teamScore(player.GetTeamId(otherPlayer)).set(teamScore(player.GetTeamId(otherPlayer)).get() + playerScore(eventPlayer).get())
        playerScore(eventPlayer).set(0)
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