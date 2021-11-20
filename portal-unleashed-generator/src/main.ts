import { promises as fs } from 'fs';
import { Config } from './config.js'
import * as morph from "ts-morph";
import * as types from './types.js';
import { category } from './common.js';

(async () => {
    // Load blocks config
    const data = await fs.readFile("./res/config.json")
    const config = new Config(JSON.parse(data.toString()));

    // Create ts file with pregenerated content
    const pregen = await fs.readFile("./res/pre_generated.ts")
    const pregenDts = await fs.readFile("./res/pre_generated.d.ts")
    const proj = new morph.Project()
    const ts = proj.createSourceFile("portal-unleashed/src/unleash.ts", pregen.toString(), {overwrite: true})
    ts.insertStatements(0, [
        '//',
        '// THIS FILE HAS BE AUTO GENERATED, DO NOT EDIT',
        '//',
        '// ANY CHANGE HERE WILL BE OVERRIDEN',
        '//',
        '// LONG LIVE BATTLEFIELD PORTAL',
        '//\n',
    ])
    const index = ts.getClass('Next').getChildIndex() + 1

    // Generate classes for each types from the config
    config.getAllTypes().forEach((t, i) => ts.insertClass(index + i, types.makeBlockType(t)));
    // ts.insertClasses(index, allTypes.map(t => types.makeBlockType(t)))

    // Generate functions
    const funcs = [
        ...config.actions,
        ...config.values,
    ]
    funcs
        .map(a => category(a.category || 'Other'))
        .filter((v, i, a) => a.indexOf(v) === i)
        .forEach(c => {
            ts.addModule({
                name: c,
                isExported: true,
                declarationKind: morph.ModuleDeclarationKind.Namespace,
            })
        })
    funcs.forEach(f => {
        // ts.getModule(category(f.category || 'Other')).addFunctions(f.definition())
        const ns = ts.getModule(category(f.category || 'Other'))
        f.definition().forEach(d => ns.addFunction(d))
    })


    // Create enums
    const enumsNS = ts.addModule({
        name: "enums",
        declarationKind: morph.ModuleDeclarationKind.Namespace,
        isExported: true,
    })
    config.enums.forEach(e => enumsNS.addModule(e.definition()))
    
    config.events.forEach(e => ts.addClass(e.eventInput()))
    const rules = ts.getClass('Mod')
    config.events.forEach(e => rules.addMethod(e.definition()))

    await ts.save()

    // Create d.ts declaration file
    const dts = proj.createSourceFile("portal-unleashed/src/unleash.d.ts", pregenDts.toString(), {overwrite: true})
    const mod = dts.getModule('"portal-unleashed"')
    const modClass = mod.getClass('Mod')
        
    // Generate definition for each event method
    config.events.forEach(e => modClass.addMethod(e.declaration()))

    // Generate classes for each types from the config
    config.getAllRealTypes().forEach(t => mod.addClass(types.makeBlockDefinition(t)))
    const skipActions = [
        "And", "Equals", "GreatherThan", "GreaterThanEqualTo", "LessThan", "LessThanEqualTo",
        "Not", "NotEqualTo", "Or", "Add", "Subtract", "Multiply", "Divide", "Modulo",
        "RaiseToPower", "GlobalVariable", "ObjectVariable", "GetVariable", "SetVariable"
    ]

    funcs
    .map(a => category(a.category || 'Other'))
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter(c => !skipActions.includes(c))
    .forEach(c => {
        mod.addModule({
            name: c,
            isExported: true,
            declarationKind: morph.ModuleDeclarationKind.Namespace,
        })
    })
    funcs.forEach(f => {
        const ns = mod.getModule(category(f.category || 'Other'))
        f.declarations().forEach(d => ns.addFunction(d))
    })

    const enumsDtsNS = mod.addModule({
        name: "enums",
        declarationKind: morph.ModuleDeclarationKind.Namespace,
        isExported: true,
    })
    config.enums.forEach(e => enumsDtsNS.addModule(e.declaration()))

    await dts.save()
})()
