// eslint-disable-next-line no-unused-vars
const PortalUnleashed = (function () {
    const pluginName = "portal-unleashed";

    const defaultMode = "splitscreen-right";
    const defaultRatio = 0.5;
    const defaultTheme = "vs-dark";
    const defaultCode = `import { mod, gameplay, player, ui } from "portal-unleashed"

// Always call mod.init before anything else
mod.init()

mod.onPlayerJoinGame("Welcome new player", (eventPlayer) => ({
    conditions: [],
    actions: () => {
        ui.ShowEventGameModeMessage(ui.Message("Welcome", eventPlayer))
    }
}))`;

    let appElement = undefined;
    let editorElement = undefined;
    let dragbarWidth = 6;
    let currentMode;
    let currentRatio;
    let plugin = undefined;
    let playgroundId = "empty";
    let debug = false;

    function prepareEditorLaunch() {
        let url = window.location.toString();

        if (url.indexOf("playgroundId=") != -1) {
            let urlParams = url.split("?")[1].split("&").map(p => p.split("="));
            playgroundId = urlParams.find(p => p[0] == "playgroundId")[1];
        }

        debugMessage("playgroundId", playgroundId);

        const storeData = getData();

        listenToEditorMessages(
            storeData.theme ? (storeData || defaultTheme) : defaultTheme,
            storeData.code ? (storeData.code[playgroundId] || defaultCode) : defaultCode
        );
        
        currentRatio = storeData.ratio || defaultRatio;
        
        createEditor();
        toggleEditor(storeData.mode || defaultMode);
    }

    function listenToEditorMessages(theme, code) {
        window.addEventListener("message", function (event) {
            const message = event.data;

            if (message.plugin !== pluginName) {
                return;
            }

            if (message.type === "init") {
                const response = {
                    theme: theme,
                    code: code,
                    filename: "main.ts"
                };

                postMessageToEditor("init", response);
            } else if (message.type === "update-theme") {
                updateData(function (storeData) {
                    storeData.theme = message.payload;
                });
            } else if (message.type === "update-mode") {
                updateMode(message.payload);
            } else if (message.type === "execute") {
                const code = message.payload;

                updateData(function (storeData) {
                    storeData.code = storeData.code || {};
                    storeData.code[playgroundId] = code;
                });

                let source = `import * as __portal from "${plugin.getUrl("lib/portal-unleashed/dist/unleash.js")}"\n` +
                code.replaceAll("portal-unleashed", plugin.getUrl("lib/portal-unleashed/dist/unleash.js"));
                var s = document.createElement("script");
                s.type = "module";
                s.innerHTML = `
    import prettier from "https://unpkg.com/prettier@2.4.1/esm/standalone.mjs";
    import parserBabel from "https://unpkg.com/prettier@2.4.1/esm/parser-babel.mjs";
    import * as __portal from "${plugin.getUrl("lib/portal-unleashed/dist/unleash.js")}"
    
    const code = prettier.format(__portal.preprocess(${JSON.stringify(source)}, ${debug}), {
        parser: "babel",
        plugins: [parserBabel],
    })
    PortalUnleashed.debugMessage("generated code:", code)
    var s = document.createElement("script");
    s.type = "module"
    s.innerHTML = \`\${code}
    
    setTimeout(function() {
        _Blockly.Xml.clearWorkspaceAndLoadFromXml(_Blockly.Xml.textToDom(mod.toXML()), _Blockly.mainWorkspace)
    }, 0);\`
    s.onload = function() {
        this.remove()
    };
    (document.head || document.documentElement).appendChild(s);
                `;
                s.onload = function () {
                    this.remove();
                };
                (document.head || document.documentElement).appendChild(s);
            }
        });
    }

    function createEditor() {
        appElement.style.gridTemplateRows = "1fr";
        appElement.children[0].style.gridArea = "blocks";

        let isDragging = false;
        const bar = document.createElement("div");
        bar.id = "resize-bar";
        bar.setAttribute("style", `width: ${dragbarWidth}px; height: 100%; cursor: col-resize; grid-area: bar;`);
        bar.onmousedown = function () {
            isDragging = true;
            // When dragging add an invisible overlay on top of the editor iframe to prevent it
            // from capture mouse events
            const overlay = document.createElement("div");
            overlay.innerHTML = "&nbsp;";
            overlay.id = "editor-resize-overlay";
            overlay.setAttribute("style", "z-index: 1; width: 100%; height: 100%; grid-area: editor");
            appElement.appendChild(overlay);
        };
        appElement.appendChild(bar);

        // Create the iframe containing the editor
        editorElement = document.createElement("iframe");
        editorElement.id = "unleashed-editor";
        editorElement.setAttribute("src", plugin.getUrl("editor/editor.html"));
        editorElement.setAttribute("style", "z-index: 0; border: 0px none; width: 100%; height: 100%; grid-area: editor;");
        appElement.appendChild(editorElement);

        // Disable dragging, remove overlay if needed
        appElement.onmouseup = editorElement.onmouseup = function () {
            isDragging = false;
            
            const overlay = document.getElementById("editor-resize-overlay");

            if (overlay) {
                appElement.removeChild(overlay);
            }
        };

        // On mouse movement apply changes if dragging
        appElement.onmousemove = editorElement.onmousemove = function (e) {
            if (isDragging) {
                updateRatio(1.0 - e.clientX / appElement.clientWidth);

                let cols = [
                    e.clientX - dragbarWidth,
                    dragbarWidth,
                    appElement.clientWidth - e.clientX - dragbarWidth
                ];
                let newColDefn = cols.map(c => c.toString() + "px").join(" ");
                appElement.style.gridTemplateColumns = newColDefn;
                e.preventDefault();
            }
        };
    }

    function toggleEditor(mode) {
        currentMode = mode;

        const bar = document.getElementById("resize-bar");
        const iframe = document.getElementById("unleashed-editor");

        if(mode === "fullscreen") {
            appElement.style.gridTemplateColumns = "0 0 1fr";
            appElement.style.gridTemplateAreas = "'blocks bar editor'";
            bar.style.display = "none";
            iframe.style.display = "block";
        }
        else if(mode === "splitscreen-left") {
            const width = appElement.clientWidth - dragbarWidth;
            let cols = [width * (1.0 - currentRatio), dragbarWidth, width * currentRatio];
            let newColDefn = cols.map(c => c.toString() + "px").join(" ");

            appElement.style.gridTemplateColumns = newColDefn;
            appElement.style.gridTemplateAreas = "'editor bar blocks'";
            bar.style.display = "block";
            iframe.style.display = "block";
        }
        else if(mode === "splitscreen-right") {
            const width = appElement.clientWidth - dragbarWidth;
            let cols = [width * (1.0 - currentRatio), dragbarWidth, width * currentRatio];
            let newColDefn = cols.map(c => c.toString() + "px").join(" ");

            appElement.style.gridTemplateColumns = newColDefn;
            appElement.style.gridTemplateAreas = "'blocks bar editor'";
            bar.style.display = "block";
            iframe.style.display = "block";
        }
        else {
            appElement.style.gridTemplateColumns = "1fr";
            appElement.style.gridTemplateAreas = "'blocks'";
            bar.style.display = "none";
            iframe.style.display = "none";
        }
    }

    function toggleDebug() {
        debug = !debug;
    }

    function getData() {
        const storeData = localStorage.getItem(pluginName);

        if (storeData) {
            return JSON.parse(storeData);
        }

        return {};
    }

    function updateMode(mode) {
        updateData(function (storeData) {
            storeData.mode = mode;
        });

        toggleEditor(mode);
    }

    function updateRatio(ratio) {
        updateData(function (storeData) {
            storeData.ratio = ratio;
        });
    }

    function updateData(callback) {
        const storeData = getData();

        callback(storeData);

        localStorage.setItem(pluginName, JSON.stringify(storeData));
    }

    function postMessageToEditor(type, payload) {
        editorElement.contentWindow.postMessage({
            plugin: pluginName,
            type: type,
            payload: payload
        }, "*");
    }

    function debugMessage(... args) {
        if(debug) {
            console.log.apply(this, args);
        }
    }

    const showCodeEditor = (function () {
        function precondition() {
            return currentMode === "disable" ? "enabled" : "hidden";
        }

        function callback() {
            updateMode("splitscreen-right");
        }

        return {
            id: "toggleEditorBlockly",
            displayText: "Show Code Editor",
            // eslint-disable-next-line no-undef
            scopeType: _Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
            weight: 99,
            preconditionFn: precondition,
            callback: callback
        };
    })();

    function init() {
        // eslint-disable-next-line no-undef
        plugin = BF2042Portal.Plugins.getPlugin(pluginName);

        if(!plugin) {
            // eslint-disable-next-line no-undef
            BF2042Portal.Shared.logError("Failed to load Portal Unleashed!");
        }

        // eslint-disable-next-line no-undef
        _Blockly.ContextMenuRegistry.registry.register(showCodeEditor);

        const interval = setInterval(() => {
            appElement = document.getElementsByClassName("app")[0];
            const rules = document.getElementsByClassName("rules");

            if (appElement && rules.length > 0) {
                clearInterval(interval);
                prepareEditorLaunch();
            }
        }, 100);
    }

    init();

    return {
        debugMessage: debugMessage,
        toggleDebug: toggleDebug
    };
})();