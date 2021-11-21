'use strict';

if (shouldLaunchEditor(document.body)) {
    const interval = setInterval(() => {
        const app = document.getElementsByClassName('app')[0];
        const rules = document.getElementsByClassName('rules');
        if (app && rules.length > 0) {
            clearInterval(interval);
            prepareEditorLaunch(app, rules);
        }
    }, 100);
}

const req = document.createElement('script')
req.src = 'require.js'
document.body.appendChild(req)

function prepareEditorLaunch(app, rules) {
    // Hide contents to avoid flickering while the rest of the script loads
    // asynchronously.
    // element.style.setProperty('display', 'none', '');
    chrome.storage.local.get('disabled', function(state) {
        if (state['disabled'] === 'true') {
            // element.style.removeProperty('display');
        } else {
            listenToEditorMessages(app);
            toggleEditor(app);
        }
    });
    // Notify the background to show the page action for the current tab.
    chrome.runtime.sendMessage({
        action: 'show_page_action'
    });

    let rulesLen = rules.length;
    setInterval(() => {
        const rules = document.getElementsByClassName('rules');
        if (rules.length != rulesLen) {
            const app = document.getElementsByClassName('app')[0];
            toggleEditor(app);
            rulesLen = rules.length;
        }
    }, 100);
}

function shouldLaunchEditor(body) {
    // Only handle documents with a unique <pre> element.
    return true;
    // return body && body.getElementsByTagName('pre').length === 1 && body.childNodes.length === 1;
}

function listenToEditorMessages(element) {
    window.addEventListener('message', function(message) {
        // Wait for editor frame to signal that it has loaded.
        if (message.data === 'loaded') {
            // element.parentNode.removeChild(element);
            const response = {
                code: `import { mod, gameplay, player, ui } from 'portal-unleashed'

// Always call mod.init before anything else
mod.init()

mod.onPlayerJoinGame('Welcome new player', (eventPlayer) => ({
    conditions: [],
    actions: () => {
        ui.ShowEventGameModeMessage(ui.Message("Welcome", eventPlayer))
    }
}))`,
                filename: 'main.ts'
            };
            message.source.postMessage(response, chrome.runtime.getURL(''));
        } else if (message.data === 'toggleEditor') {
            toggleEditor(app);
        } else if (message.data.startsWith('run+')) {
            console.log(message)
            let source = `import * as __portal from '${chrome.runtime.getURL('../lib/portal-unleashed/dist/unleash.js')}'\n` +
                message.data.substring(4).replaceAll("portal-unleashed", chrome.runtime.getURL('../lib/portal-unleashed/dist/unleash.js'))
            var s = document.createElement('script');
            s.type = 'module'
            s.innerHTML = `
import prettier from "https://unpkg.com/prettier@2.4.1/esm/standalone.mjs";
import parserBabel from "https://unpkg.com/prettier@2.4.1/esm/parser-babel.mjs";
import * as __portal from '${chrome.runtime.getURL('../lib/portal-unleashed/dist/unleash.js')}'

const code = prettier.format(__portal.preprocess(${JSON.stringify(source)}), {
    parser: "babel",
    plugins: [parserBabel],
})
console.log('generated code:', code)
var s = document.createElement('script');
s.type = 'module'
s.innerHTML = \`\${code}

setTimeout(function() {
    _Blockly.Xml.clearWorkspaceAndLoadFromXml(_Blockly.Xml.textToDom(mod.toXML()), _Blockly.mainWorkspace)
}, 0);\`
s.onload = function() {
    this.remove()
};
(document.head || document.documentElement).appendChild(s);
            `;
            s.onload = function() {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
        }
    });
}

function getFilename() {
    let filename = location.href;
    // Remove path.
    let index = filename.lastIndexOf('/');
    if (index !== -1) {
        filename = filename.substring(index + 1);
    }
    // Remove fragment identifier.
    index = filename.indexOf('#');
    if (index !== -1) {
        filename = filename.substring(0, index);
    }
    // Remove query parameters.
    index = filename.indexOf('?');
    if (index !== -1) {
        filename = filename.substring(0, index);
    }
    return filename;
}

function toggleEditor(app) {
    const checkMonaco = document.getElementById('unleashed-editor');
    console.log(`app ${app}`);
    console.log(`checkMonaco ${checkMonaco}`);
    if (checkMonaco) {
        app.style.gridTemplateColumns = '1fr';
        app.removeChild(checkMonaco);
    } else {
        app.style.gridTemplateColumns = '1fr 1fr';

        const iframe = document.createElement('iframe');
        iframe.id = 'unleashed-editor';
        iframe.setAttribute('src', chrome.runtime.getURL('editor/editor.html'));
        iframe.setAttribute('style', 'border: 0px none; width: 100%; height: 100%; grid-row: 1;');
        app.appendChild(iframe);
    }
}

// (function(history) {
//     var pushState = history.pushState;
//     history.pushState = function(state) {
//         if (typeof history.onpushstate == "function") {
//             history.onpushstate({ state: state });
//         }
//         // ... whatever else you want to do
//         // maybe call onhashchange e.handler
//         return pushState.apply(history, arguments);
//     };
// })(window.history);

// window.onpopstate = history.onpushstate = function(event) {
//     console.log(event)
// };
browser.webNavigation.onHistoryStateUpdated.addListener((e) => {
    console.log(e)
})