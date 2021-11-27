"use strict";
const supportedLocales = ["de", "es", "fr", "hu", "it", "ja", "ko", "pr-br", "ru", "tr", "zh-cn", "zh-tw"];

let editor;
let theme;

document.onkeydown = function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key == "s") {
        e.preventDefault();

        const code = editor.getValue();
        postMessageToPortal("execute", code);
    }
};

window.addEventListener("message", function (event) {
    const message = event.data;

    if (!message) {
        return;
    }

    if (message.type === "init") {
        if (message.payload.theme) {
            theme = message.payload.theme;
        }

        require.config({
            paths: {
                vs: "../lib/monaco-editor/min/vs",
            },
        });

        const userLocale = getUserLocale();

        if (userLocale !== null) {
            require.config({
                "vs/nls": {
                    availableLanguages: {
                        "*": userLocale,
                    },
                },
            });
        }

        require(["vs/editor/editor.main"], function () {
            prepareAndLaunchEditor(message);

            //Based on: https://github.com/microsoft/monaco-editor/issues/1567
            require(["vs/platform/actions/common/actions"], function (actions) {
                let menus = actions.MenuRegistry._menuItems;

                let contextMenuEntry = [...menus].find(entry => {
                    return entry[1].find(f => f.group == "navigation");
                });

                let contextMenuLinks = contextMenuEntry[1];

                let removeIds = [
                    "editor.action.clipboardCopyAction", 
                    "editor.action.clipboardCutAction"
                ];

                for(let i = 0; i < contextMenuLinks.length;) {
                    const item = contextMenuLinks[i];

                    if(item.command && removeIds.indexOf(item.command.id) !== -1) {
                        contextMenuLinks.splice(i, 1);

                        continue;
                    }

                    i++;
                }
            });
        });
    }
});

function init() {
    postMessageToPortal("init");
}

function getUserLocale() {
    const languageTag = window.navigator.language.toLowerCase();

    // Extract ISO 639-1 language abbreviation.
    const languageCode = languageTag.substr(0, languageTag.indexOf("-"));

    if (supportedLocales.indexOf(languageCode) >= 0) {
        return languageCode;
    } else if (supportedLocales.indexOf(languageTag) >= 0) {
        return languageTag;
    }

    return null;
}

function prepareAndLaunchEditor(message) {
    const mappedLanguage = getLanguageForFilename(message.payload.filename);

    launchEditor(message.payload.code, mappedLanguage, theme);
}

function getLanguageForFilename(filename) {
    for (const language of monaco.languages.getLanguages()) {
        for (const monacoExtension of language.extensions) {
            if (filename.endsWith(monacoExtension)) {
                return language.id;
            }
        }
    }

    return null;
}

function errorHandler(err) {
    console.error(err);
}

function launchEditor(code, inferredLanguage, theme) {
    editor = monaco.editor.create(document.getElementById("container"), {
        value: code,
        scrollBeyondLastLine: false,
        language: inferredLanguage,
        cursorBlinking: "smooth",
        dragAndDrop: true,
        mouseWheelZoom: true,
        theme: theme,
    });

    addMenuItems();

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowNonTsExtensions: true
    });

    var url = "../lib/portal-unleashed/dist/unleash.d.ts";
    fetch(url)
        .then((response) => response.text())
        .then((text) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(text, "");
        }).catch(errorHandler);

    // Avoid using Monaco's automaticLayout option for better performance.
    window.addEventListener("resize", function () {
        editor.layout();
    });

    editor._actions = {};
}

function addMenuItems() {
    editor.addAction({
        id: "export",
        label: "Export content",
        contextMenuGroupId: "portal_0",
        contextMenuOrder: 1,
        run: function () {
            const script = editor.getValue();
            const dataUri = `data:text/javascript;charset=utf-8,${encodeURIComponent(script)}`;

            const linkElement = document.createElement("a");
            linkElement.setAttribute("href", dataUri);
            linkElement.setAttribute("download", "script.js");
            linkElement.style.display = "none";

            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        }
    });

    editor.addAction({
        id: "modeFullscreen",
        label: "Fullscreen",
        contextMenuGroupId: "portal_1",
        contextMenuOrder: 1,
        run: function () {
            updateMode("fullscreen");
        }
    });

    editor.addAction({
        id: "modeSplitScreenLeft",
        label: "Splitscreen (Left)",
        contextMenuGroupId: "portal_1",
        contextMenuOrder: 2,
        run: function () {
            updateMode("splitscreen-left");
        }
    });

    editor.addAction({
        id: "modeSplitScreenRight",
        label: "Splitscreen (Right)",
        contextMenuGroupId: "portal_1",
        contextMenuOrder: 3,
        run: function () {
            updateMode("splitscreen-right");
        }
    });

    editor.addAction({
        id: "modeDisable",
        label: "Disable",
        contextMenuGroupId: "portal_1",
        contextMenuOrder: 4,
        run: function () {
            updateMode("disable");
        }
    });

    editor.addAction({
        id: "themeLight",
        label: "Light Theme",
        contextMenuGroupId: "portal_2",
        contextMenuOrder: 1,
        run: function () {
            updateTheme("vs");
        }
    });

    editor.addAction({
        id: "themeDark",
        label: "Dark Theme",
        contextMenuGroupId: "portal_2",
        contextMenuOrder: 2,
        run: function () {
            updateTheme("vs-dark");
        }
    });

    editor.addAction({
        id: "themeHighContrast",
        label: "High Contrast Theme",
        contextMenuGroupId: "portal_2",
        contextMenuOrder: 3,
        run: function () {
            updateTheme("hc-black");
        }
    });
}

function updateMode(mode) {
    postMessageToPortal("update-mode", mode);
}

function updateTheme(theme) {
    monaco.editor.setTheme(theme);

    postMessageToPortal("update-theme", theme);
}

function postMessageToPortal(type, payload) {
    window.parent.postMessage({
        plugin: "portal-unleashed",
        type: type,
        payload: payload
    }, "*");
}

init();