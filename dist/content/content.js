const PortalUnleashed=function(){const e="portal-unleashed",t="splitscreen-right",n=.5,o="vs-dark",l='import { mod, gameplay, player, ui } from "portal-unleashed"\n\n// Always call mod.init before anything else\nmod.init()\n\nmod.onPlayerJoinGame("Welcome new player", (eventPlayer) => ({\n    conditions: [],\n    actions: () => {\n        ui.ShowEventGameModeMessage(ui.Message("Welcome", eventPlayer))\n    }\n}))';let i,s,r=void 0,a=void 0,d=6,c=void 0,p="empty",m=!1;function u(){let i=window.location.toString();if(-1!=i.indexOf("playgroundId=")){let e=i.split("?")[1].split("&").map(e=>e.split("="));p=e.find(e=>"playgroundId"==e[0])[1]}b("playgroundId",p);const u=g();var v,k;v=u.theme&&u||o,k=u.code&&u.code[p]||l,window.addEventListener("message",function(t){const n=t.data;var o,l;if(n.plugin===e)if("init"===n.type){const t={theme:v,code:k,filename:"main.ts"};o="init",l=t,a.contentWindow.postMessage({plugin:e,type:o,payload:l},"*")}else if("update-theme"===n.type)f(function(e){e.theme=n.payload});else if("update-mode"===n.type)h(n.payload);else if("execute"===n.type){const e=n.payload;f(function(t){t.code=t.code||{},t.code[p]=e});let t=`import * as __portal from "${c.getUrl("lib/portal-unleashed/dist/unleash.js")}"\n`+e.replaceAll("portal-unleashed",c.getUrl("lib/portal-unleashed/dist/unleash.js"));var i=document.createElement("script");i.type="module",i.innerHTML=`\n    import prettier from "https://unpkg.com/prettier@2.4.1/esm/standalone.mjs";\n    import parserBabel from "https://unpkg.com/prettier@2.4.1/esm/parser-babel.mjs";\n    import * as __portal from "${c.getUrl("lib/portal-unleashed/dist/unleash.js")}"\n    \n    const code = prettier.format(__portal.preprocess(${JSON.stringify(t)}, ${m}), {\n        parser: "babel",\n        plugins: [parserBabel],\n    })\n    PortalUnleashed.debugMessage("generated code:", code)\n    var s = document.createElement("script");\n    s.type = "module"\n    s.innerHTML = \`\${code}\n    \n    setTimeout(function() {\n        _Blockly.Xml.clearWorkspaceAndLoadFromXml(_Blockly.Xml.textToDom(mod.toXML()), _Blockly.mainWorkspace)\n    }, 0);\`\n    s.onload = function() {\n        this.remove()\n    };\n    (document.head || document.documentElement).appendChild(s);\n                `,i.onload=function(){this.remove()},(document.head||document.documentElement).appendChild(i)}}),s=u.ratio||n,function(){r.style.gridTemplateRows="1fr",r.children[0].style.gridArea="blocks";let e=!1;const t=document.createElement("div");t.id="resize-bar",t.setAttribute("style",`width: ${d}px; height: 100%; cursor: col-resize; grid-area: bar;`),t.onmousedown=function(){e=!0;const t=document.createElement("div");t.innerHTML="&nbsp;",t.id="editor-resize-overlay",t.setAttribute("style","z-index: 1; width: 100%; height: 100%; grid-area: editor"),r.appendChild(t)},r.appendChild(t),(a=document.createElement("iframe")).id="unleashed-editor",a.setAttribute("src",c.getUrl("editor/editor.html")),a.setAttribute("style","z-index: 0; border: 0px none; width: 100%; height: 100%; grid-area: editor;"),r.appendChild(a),r.onmouseup=a.onmouseup=function(){e=!1;const t=document.getElementById("editor-resize-overlay");t&&r.removeChild(t)},r.onmousemove=a.onmousemove=function(t){if(e){n=1-t.clientX/r.clientWidth,f(function(e){e.ratio=n});let e=[t.clientX-d,d,r.clientWidth-t.clientX-d],o=e.map(e=>e.toString()+"px").join(" ");r.style.gridTemplateColumns=o,t.preventDefault()}var n}}(),y(u.mode||t)}function y(e){i=e;const t=document.getElementById("resize-bar"),n=document.getElementById("unleashed-editor");if("fullscreen"===e)r.style.gridTemplateColumns="0 0 1fr",r.style.gridTemplateAreas="'blocks bar editor'",t.style.display="none",n.style.display="block";else if("splitscreen-left"===e){const e=r.clientWidth-d;let o=[e*(1-s),d,e*s].map(e=>e.toString()+"px").join(" ");r.style.gridTemplateColumns=o,r.style.gridTemplateAreas="'editor bar blocks'",t.style.display="block",n.style.display="block"}else if("splitscreen-right"===e){const e=r.clientWidth-d;let o=[e*(1-s),d,e*s].map(e=>e.toString()+"px").join(" ");r.style.gridTemplateColumns=o,r.style.gridTemplateAreas="'blocks bar editor'",t.style.display="block",n.style.display="block"}else r.style.gridTemplateColumns="1fr",r.style.gridTemplateAreas="'blocks'",t.style.display="none",n.style.display="none"}function g(){const t=localStorage.getItem(e);return t?JSON.parse(t):{}}function h(e){f(function(t){t.mode=e}),y(e)}function f(t){const n=g();t(n),localStorage.setItem(e,JSON.stringify(n))}function b(...e){m&&console.log.apply(this,e)}const v=function(){return{id:"toggleEditorBlockly",displayText:"Show Code Editor",scopeType:_Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,weight:99,preconditionFn:function(){return"disable"===i?"enabled":"hidden"},callback:function(){h("splitscreen-right")}}}();return function(){(c=BF2042Portal.Plugins.getPlugin(e))||BF2042Portal.Shared.logError("Failed to load Portal Unleashed!"),_Blockly.ContextMenuRegistry.registry.register(v);const t=setInterval(()=>{r=document.getElementsByClassName("app")[0];const e=document.getElementsByClassName("rules");r&&e.length>0&&(clearInterval(t),u())},100)}(),{debugMessage:b,toggleDebug:function(){m=!m}}}();