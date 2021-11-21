'use strict';

const interval = setInterval(() => {
    const app = document.getElementsByClassName('app')[0];
    const rules = document.getElementsByClassName('rules');
    if (app && rules.length > 0) {
        clearInterval(interval);
        prepareEditorLaunch(app, rules);
    }
}, 100);

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
            createEditor(app);
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
            toggleEditor(app, rules.length != 0);
            rulesLen = rules.length;
        }
    }, 100);
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


function createEditor(app) {
    app.style.gridTemplateRows = '1fr';
    app.children[0].style.gridArea = 'blocks'

    // Create the editor with the middle resize bar 
    let dragbarWidth = 3;
    const width = app.clientWidth - dragbarWidth
    let cols = [width / 2, dragbarWidth, width / 2];

    let newColDefn = cols.map(c => c.toString() + "px").join(" ");
    app.style.gridTemplateColumns = newColDefn;
    app.style.gridTemplateAreas = '"blocks bar editor"'

    let isDragging = false;
    const bar = document.createElement('div')
    bar.id = 'resize-bar'
    bar.setAttribute('style', 'width: 3px; height: 100%; cursor: col-resize; grid-area: bar;');
    bar.onmousedown = function(e) {
        isDragging = true;
        // When dragging add an invisible overlay on top of the editor iframe to prevent it
        // from capture mouse events
        const overlay = document.createElement('div')
        overlay.innerHTML = '&nbsp;'
        overlay.id = 'editor-resize-overlay'
        overlay.setAttribute('style', 'z-index: 1; width: 100%; height: 100%; grid-area: editor;');
        app.appendChild(overlay)
    }
    app.appendChild(bar)

    // Create the iframe containing the editor
    const iframe = document.createElement('iframe');
    iframe.id = 'unleashed-editor';
    iframe.setAttribute('src', chrome.runtime.getURL('editor/editor.html'));
    iframe.setAttribute('style', 'z-index: 0; border: 0px none; width: 100%; height: 100%; grid-area: editor;');
    app.appendChild(iframe);

    // Disable dragging, remove overlay if needed
    app.onmouseup = iframe.onmouseup = function(e) {
        isDragging = false;
        const overlay = document.getElementById('editor-resize-overlay')
        if (overlay) {
            app.removeChild(overlay)
        }
    }

    // On mouse movement apply changes if dragging
    app.onmousemove = iframe.onmousemove = function(e) {
        if (isDragging) {
            let cols = [
                e.clientX,
                dragbarWidth,
                app.clientWidth - e.clientX
            ];
            let newColDefn = cols.map(c => c.toString() + "px").join(" ");
            app.style.gridTemplateColumns = newColDefn;
            e.preventDefault()
        }
    }
}

let lastSize;
// Toggles the editor on/off
function toggleEditor(app, enable) {
    const bar = document.getElementById('resize-bar')
    const iframe = document.getElementById('unleashed-editor')
    if (enable) {
        app.style.gridTemplateColumns = lastSize;
        app.style.gridTemplateAreas = '"blocks bar editor"'
        bar.style.display = 'block'
        iframe.style.display = 'block'
    } else {
        lastSize = app.style.gridTemplateColumns
        app.style.gridTemplateColumns = '1fr';
        app.style.gridTemplateAreas = '"blocks"'
        bar.style.display = 'none'
        iframe.style.display = 'none'
    }
}