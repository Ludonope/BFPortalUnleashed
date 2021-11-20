import { create } from "xmlbuilder2";
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
// import * as prettier from "prettier";
// import * as babelParser from "babel-prettier-parser";

export interface IBlock {
    type: string;
    isAny: boolean
    toXML(): any;
    setNext(next: IBlock);
}

abstract class ABlock implements IBlock {
    type: string;
    nameAttr: string;
    name: string;
    valueType: string;
    children: IBlock[];

    constructor(type: string, nameAttr: string, name: string, valueType: string, children: IBlock[]) {
        this.type = type
        this.nameAttr = nameAttr
        this.name = name
        this.valueType = valueType
        this.children = children
    }

    get isAny(): boolean {
        return this.valueType == 'BAny'
    }

    toXML(): any {
        const out = {}
        out["@"+this.nameAttr] = this.name
        // Filtering children, when conditions are empty it might contain an undefined, no idea why
        for (const child of this.children.filter(c => c)) {
            console.log(child.type)
            console.log(child)
            if (out[child.type]) {
                out[child.type] = [out[child.type], child.toXML()]
            } else {
                out[child.type] = child.toXML()
            }
        }
        return out
    }

    setNext(next: IBlock) {
        this.children.push(new Next(next))
    }
}

class Block extends ABlock {
    constructor(name: string, valueType: string, children: IBlock[]) {
        super("block", "type", name, valueType, children)
    }
}

class Statement extends ABlock {
    constructor(name: string, children: IBlock[]) {
        children.forEach((child, i) => {
            if (i == children.length - 1) return;
            child.setNext(children[i+1])
        })
        super("statement", "name", name, "statement", [children[0]])
    }
}

class Value extends ABlock {
    constructor(name: string, children: IBlock[]) {
        children.forEach((child, i) => {
            if (i == children.length - 1) return;
            child.setNext(children[i+1])
        })
        super("value", "name", name, "value", [children[0]])
    }
}

class Field implements IBlock {
    type: string;
    name: string;
    value: ABString;
    isAny: boolean = false;
    entries: Entry[]

    constructor(name: string, value: ABString, entries?: Entry[]) {
        this.type = "field"
        this.name = name
        this.value = value
        this.entries = entries || []
    }

    toXML(): any {
        const field = {"@name": this.name, "#text": this.value.toXML()}
        this.entries.forEach(e => {
            field["@"+e.name] = e.value
        })
        return field
    }

    setNext(_: IBlock) {
        throw "setNext(...) called on a Field block"
    }
}

class Entry {
    name: string
    value: any
}

class Mutation implements IBlock {
    type: string;
    entries: Entry[]
    isAny: boolean = false;

    constructor(entries: Entry[]) {
        this.type = "mutation"
        this.entries = entries
    }

    toXML(): any {
        const mut = {mutation: []}
        this.entries.forEach(e => {
            mut["@"+e.name] = e.value
        })
        return mut
    }

    setNext(_: IBlock) {
        throw "setNext(...) called on a Mutation block"
    }
}

class Next implements IBlock {
    type: string;
    child: IBlock;
    isAny: boolean = false;

    constructor(child: IBlock) {
        this.type = "next"
        this.child = child
    }

    toXML(): any {
        const out = {}
        out[this.child.type] = this.child.toXML()
        return out
    }

    setNext(_: IBlock) {
        throw "setNext(...) called on a Next block"
    }
}

export class BMessage extends Block {
    constructor(name: string, children: IBlock[]) {
        super(name, "Message", children)
    }
}

export class BAny extends Block {
    constructor(name: string, children: IBlock[]) {
        super(name, "BAny", children)
    }
}

export class BBoolean extends ABBoolean {
    constructor(value: boolean) {
        super("Boolean", [new Field("BOOL", new RawBBoolean(value))])
    }
}

export class BNumber extends ABNumber {
    constructor(value: number) {
        super("Number", [new Field("NUM", new RawBNumber(value))])
    }
}

export class BString extends ABString {
    constructor(value: string) {
        super("Text", [new Field("TEXT", new RawBString(value))])
    }
}

export class RawBBoolean extends ABBoolean {
    value: boolean
    constructor(value: boolean) {
        super("Boolean", [])
        this.value = value
    }

    toXML(): any {
        return this.value ? "TRUE" : "FALSE"
    }
}

export class RawBNumber extends ABNumber {
    value: number
    constructor(value: number) {
        super("Number", [])
        this.value = value
    }

    toXML(): any {
        return this.value
    }
}

export class RawBString extends ABString {
    value: string
    constructor(value: string) {
        super("Number", [])
        this.value = value
    }

    toXML(): any {
        return this.value
    }
}


export class BArray extends Block {
    constructor(name: string, children: IBlock[]) {
        super(name, "BArray", children)
    }

    push(element: IBlock): BArray {
        return arrays.AppendToArray(this, element)
    }

    slice(startIndex: ABNumber, count: ABNumber): BArray {
        return arrays.ArraySlice(this, startIndex, count)
    }

    get length(): ABNumber {
        return arrays.CountOf(this)
    }

    filter(predicate: (v: IBlock, i: ABNumber, a: BArray) => ABBoolean): BArray {
        const pred = predicate(
            arrays.CurrentArrayElement(),
            convenience.IndexOfArrayValue(this, arrays.CurrentArrayElement()),
            this
        )
        return arrays.FilteredArray(this, pred)
    }

    get first(): IBlock {
        return arrays.FirstOf(this)
    }

    every(predicate: (v: IBlock, i: ABNumber, a: BArray) => ABBoolean): ABBoolean {
        const pred = predicate(
            arrays.CurrentArrayElement(),
            convenience.IndexOfArrayValue(this, arrays.CurrentArrayElement()),
            this
        )
        return arrays.IsTrueForAll(this, pred)
    }

    any(predicate: (v: IBlock, i: ABNumber, a: BArray) => ABBoolean): ABBoolean {
        const pred = predicate(
            arrays.CurrentArrayElement(),
            convenience.IndexOfArrayValue(this, arrays.CurrentArrayElement()),
            this
        )
        return arrays.IsTrueForAny(this, pred)
    }

    get last(): IBlock {
        return arrays.LastOf(this)
    }

    map(predicate: (v: IBlock, i: ABNumber, a: BArray) => IBlock): BArray {
        const pred = predicate(
            arrays.CurrentArrayElement(),
            convenience.IndexOfArrayValue(this, arrays.CurrentArrayElement()),
            this
        )
        return arrays.MappedArray(this, pred)
    }

    shuffled(): BArray {
        return arrays.RandomizedArray(this)
    }

    randomValue(): IBlock {
        return arrays.RandomValueInArray(this)
    }

    sorted(predicate: (v: IBlock) => ABNumber): BArray {
        return arrays.SortedArray(this, predicate(arrays.CurrentArrayElement()))
    }

    get(index: ABNumber): IBlock {
        return arrays.ValueInArray(this, index)
    }

    set(index: ABNumber, value: IBlock): BVoid {
        return arrays.SetVariableAtIndex(this, index, value)
    }
}


export class Array extends BArray {
    constructor() {
        super("Array", [])
    }
}

class convenience {
    static IndexOfArrayValue(param0: BArray, param1: IBlock): ABNumber {
        return new ABNumber(
            'IndexOfArrayValue', [
            new Value("VALUE-0", [param0]),
            new Value("VALUE-1", [param1]),
        ])
    }

    static ArrayContains(param0: BArray, param1: IBlock): ABBoolean {
        return new ABBoolean(
            'ArrayContains', [
            new Value("VALUE-0", [param0]),
            new Value("VALUE-1", [param1]),
        ])
    }

    static RemoveFromArray(param0: BArray, param1: IBlock): BArray {
        return new BArray(
            'RemoveFromArray', [
            new Value("VALUE-0", [param0]),
            new Value("VALUE-1", [param1]),
        ])
    }
}

class ifLogic {
    static If(param0: ABBoolean, param1: BVoid[], param2: BVoid[], param3: BVoid | undefined): BVoid {
        const mut = []
        if (param2.length > 0 || param3) {
            const entries = []
            if (param2.length > 0) {
                entries.push({name: "elseif", value: param2.length})
            } 
            if (param3) {
                entries.push({name: "else", value: 1})
            }
            mut.push(new Mutation(entries))
        }
        const children = [
            ...mut,
            new Value("VALUE-0", [param0]),
            new Statement("DO", param1),
        ]

        param2.forEach(elseif => {
            children.push(...elseif.children)
        })
        if (param3) {
            children.push(...param3.children)
        }
        return new BVoid('If', children)
    }

    static ElseIf(param0: ABBoolean, param1: number, param2: BVoid[]): BVoid {
        return new BVoid(
            'ElseIf', [
            new Value(`IF${param1}`, [param0]),
            new Statement(`DO${param1}`, param2),
        ])
    }

    static Else(param2: BVoid[]): BVoid {
        return new BVoid(
            'Else', [
            new Statement(`ELSE`, param2),
        ])
    }
}

class RuleBody {
    conditions: BBoolean[];
    actions: () => BVoid[];
}

type SubroutineBody = RuleBody;

class BRule extends Block {
    constructor(name: string, event: string, objectType: string | undefined, conditions: BBoolean[], actions: BVoid[]) {
        const children: IBlock[] = [
            new Mutation([{
                name: "isOnGoingEvent", value: event == "Ongoing"
            }]),
            new Field("NAME", new RawBString(name)),
            new Field("EVENTTYPE", new RawBString(event)),
        ]
        if (event == "Ongoing") {
            children.push(new Field("OBJECTTYPE", new RawBString(objectType)))
        }
        const conditionBlocks = conditions.map(c => {
            return new Block("conditionBlock", "conditionBlock", [new Value("CONDITION", [c])])
        })
        children.push(new Statement("CONDITIONS", conditionBlocks))
        children.push(new Statement("ACTIONS", actions))
        super("ruleBlock", "ruleBlock", children)
    }
}

class BSubroutine extends Block {
    constructor(name: string, conditions: BBoolean[], actions: BVoid[]) {
        const children: IBlock[] = [
            new Field("SUBROUTINE_NAME", new RawBString(name)),
        ]
        const conditionBlocks = conditions.map(c => {
            return new Block("conditionBlock", "conditionBlock", [new Value("CONDITION", [c])])
        })
        children.push(new Statement("CONDITIONS", conditionBlocks))
        children.push(new Statement("ACTIONS", actions))
        super("subroutineBlock", "subroutineBlock", children)
    }
}

class BVariable {
    type: string
    name: string
    id: string
    object?: any
    index: ABNumber
    
    constructor(name: string, type: string, id: string, object: any | null, index: number) {
        this.type = type
        this.name = name
        this.id = id
        this.object = object
        this.index = new BNumber(index)
    }

    get(): IBlock {
        const obj = []
        if (this.object) {
            obj.push(new Value("OBJECT", [this.object]))
        }
        return arrays.ValueInArray(
            new BArray("GetVariable", [
                new Value("VALUE-0", [
                    new Block("variableReferenceBlock", "variableReferenceBlock", [
                        new Mutation([{name: "isObjectVar", value: this.object != null}]),
                        new Field("OBJECTTYPE", new RawBString(this.type)),
                        new Field("VAR", new RawBString(this.name), [
                            {name: "id", value: this.id},
                            {name: "variabletype", value: this.type},
                        ]),
                        ...obj,
                    ])
                ]),
            ]),
            this.index,
        )
    }

    set(value: any): IBlock {
        const obj = []
        if (this.object) {
            obj.push(new Value("OBJECT", [this.object]))
        }
        return arrays.SetVariableAtIndex(
            new Block("variableReferenceBlock", "variableReferenceBlock", [
                new Mutation([{name: "isObjectVar", value: this.object != null}]),
                new Field("OBJECTTYPE", new RawBString(this.type)),
                new Field("VAR", new RawBString(this.name), [
                    {name: "id", value: this.id},
                    {name: "variabletype", value: this.type},
                ]),
                ...obj,
            ]),
            this.index,
            value,
        )
    }
}

function makeID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]`,./|:';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
class Mod {
    rules: BRule[];
    subroutines: BSubroutine[];
    globalVarCount: number;
    globalVarId: string;
    teamVarCount: number;
    teamVarId: string;
    playerVarCount: number;
    playerVarId: string;

    constructor() {
        this.globalVarId = makeID(20)
        this.teamVarId = makeID(20)
        this.playerVarId = makeID(20)
        this.init()
    }

    init() {
        this.rules = []
        this.subroutines = []
        this.globalVarCount = 0;
        this.teamVarCount = 0;
        this.playerVarCount = 0;
    }

    toXML(): string {
        const m: any = {
            "@xmlns": "https://developers.google.com/blockly/xml",
        }
        
        const variables = []
        if (this.globalVarCount > 0) {
            variables.push({
                "@type": "Global",
                "@id": this.globalVarId,
                "#text": "globalVar",
            })
        }
        if (this.teamVarCount > 0) {
            variables.push({
                "@type": "TeamId",
                "@id": this.teamVarId,
                "#text": "teamVar",
            })
        }
        if (this.playerVarCount > 0) {
            variables.push({
                "@type": "Player",
                "@id": this.playerVarId,
                "#text": "playerVar",
            })
        }
        if (variables.length > 0) {
            m.variables = {
                variable: variables
            }
        }

        const statement = new Statement("RULES", this.rules)
        m["block"] = [
            {
                "@type": "modBlock",
                "@deletable": "false",
                "@x": "250",
                "@y": "150",
                statement: statement.toXML(),
            },
            ...this.subroutines.map(s => s.toXML()),
        ]
        const xml = create({xml: m})
        console.log(xml.end({prettyPrint: true, headless: true, allowEmptyTags: true}))
        return xml.end({headless: true, allowEmptyTags: true})
    }

    ongoing(ruleName: string, objectType: string, callback: () => RuleBody) {
        const body = callback()
        this.rules.push(new BRule(ruleName, 'Ongoing', objectType, body.conditions, body.actions()))
    }

    newSubroutine(name: string, callback: () => SubroutineBody) {
        const body = callback()
        this.subroutines.push(new BSubroutine(name, body.conditions, body.actions()))
    }

    callSubroutine(name: string) {
        return new Block(
            "subroutineInstanceBlock",
            "subroutineInstanceBlock", [
                new Field("SUBROUTINE_NAME", new RawBString(name))
            ])
    }

    newGlobalVar(): BVariable {
        return new BVariable("globalVar", "Global", this.globalVarId, null, this.globalVarCount++)
    }

    newTeamVar(): (team: TeamId) => BVariable {
        const index = this.teamVarCount++
        return (team) => new BVariable("teamVar", "TeamId", this.teamVarId, team, index)
    }

    newPlayerVar(): (player: Player) => BVariable {
        const index = this.playerVarCount++
        return (player) => new BVariable("playerVar", "Player", this.playerVarId, player, index)
    }
}

export const mod = new Mod()

import { inspect } from "util"
function preprocessSubroutine(ast: any) {
    const subroutines = []
    traverse(ast, {
        enter(path) {
            if (path.isFunctionDeclaration()) {
                const n = path.node
                if (path.parentPath.node.type != 'Program') {
                    return;
                }
                subroutines.push(n.id.name)
                path.replaceWith(t.callExpression(
                    t.memberExpression(t.identifier('mod'), t.identifier('newSubroutine')),
                    [
                        t.identifier(`"${n.id.name}"`),
                        t.arrowFunctionExpression(
                            [],
                            n.body,
                        )
                    ]
                ))
            }
        },
    })

    console.log(subroutines)
    traverse(ast, {
        enter(path) {
            if (path.isCallExpression()) {
                const n = path.node
                if (n.callee.type != 'Identifier' || !subroutines.includes(n.callee.name)) {
                    return;
                }
                path.replaceWith(t.callExpression(
                    t.memberExpression(t.identifier('mod'), t.identifier('callSubroutine')),
                    [
                        t.identifier(`"${n.callee.name}"`),
                    ]
                ))
            }
        },
    })
}

// Not ready yet, need to revise the syntax, maybe go with bracket instead of function call
function preprocessVariables(ast: any) {
    const globalVars = []
    const objectVars = []
    
    traverse(ast, {
        enter(path) {
            if (path.isVariableDeclaration()) {
                const n = path.node
                if (path.parentPath.node.type != 'Program') {
                    return;
                }
                const ctors = ['newGlobalVar', 'newTeamVar', 'newPlayerVar'];
                const init = n.declarations[0].init
                if (init.type != 'CallExpression' ||
                    init.callee.type != 'MemberExpression' ||
                    init.callee.object.name != 'mod' ||
                    !ctors.includes(init.callee.property.name)) {
                        return
                    }

                if (init.callee.property.name == 'newGlobalVar') {
                    globalVars.push(n.declarations[0].id.name)
                } else {
                    objectVars.push(n.declarations[0].id.name)
                }
            }
        },
    })

    traverse(ast, {
        enter(path) {
            if (path.isAssignmentExpression()) {
                const n = path.node
                console.log(inspect(n, {depth: 7}))
                // if (n.callee.type != 'Identifier' || !subroutines.includes(n.callee.name)) {
                //     return;
                // }
                // path.replaceWith(t.callExpression(
                //     t.memberExpression(t.identifier('mod'), t.identifier('callSubroutine')),
                //     [
                //         t.identifier(`"${n.callee.name}"`),
                //     ]
                // ))
            }
        },
    })
}

export function preprocess(source: string): string {
    const ast = parser.parse(source, {
        sourceType: 'module',
    })

    preprocessSubroutine(ast)
    // preprocessVariables(ast)

    const done = []
    traverse(ast, {
        enter(path) {
            if (path.isIfStatement()) { 
                const n = path.node
                const stack = []
                let p = n.alternate
                while (p && p.type == 'IfStatement') {
                    stack.push(p)
                    p = p.alternate
                }

                const el = []
                if (p) {
                    el.push(t.callExpression(
                        t.memberExpression(t.identifier('__portal.ifLogic'), t.identifier('Else')),
                        [
                            t.arrayExpression(p.body.map(s => s.expression)),
                        ]
                    ))
                }
                path.replaceWith(t.callExpression(
                    t.memberExpression(t.identifier('__portal.ifLogic'), t.identifier('If')),
                    [
                        n.test,
                        t.arrayExpression(n.consequent.body.map(s => s.expression)),
                        t.arrayExpression(stack.map((e, i) => t.callExpression(
                            t.memberExpression(t.identifier('__portal.ifLogic'), t.identifier('ElseIf')),
                            [
                                e.test,
                                t.identifier(`${i + 1}`),
                                t.arrayExpression(e.consequent.body.map(s => s.expression)),
                            ]
                        ))),
                        ...el,
                    ]
                ))
            }
        },
        exit(path) {
            if (done.includes(path)) return
            done.push(path)

            if (path.isBinaryExpression()) {
                const opMap = {
                    '==': 'logic.Equals',
                    '===': 'logic.Equals',
                    '!=': 'logic.NotEqualTo',
                    '!==': 'logic.NotEqualTo',
                    '<': 'logic.LessThan',
                    '<=': 'logic.LessThanEqualTo',
                    '>': 'logic.GreaterThan',
                    '>=': 'logic.GreaterThenEqualTo',
                    '+': 'math.Add',
                    '-': 'math.Subtract',
                    '*': 'math.Multiply',
                    '/': 'math.Divide',
                    '%': 'math.Modulo',
                    '**': 'math.RaiseToPower'
                }
                const n = path.node;
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier('__portal'),
                        t.identifier(opMap[n.operator]),
                    ),
                    [
                        n.left,
                        n.right,
                    ]
                ))
            } else if (path.isLogicalExpression()) {
                const opMap = {
                    '&&': 'And',
                    '||': 'Or',
                }
                const n = path.node;
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier('__portal.logic'),
                        t.identifier(opMap[n.operator]),
                    ),
                    [
                        n.left,
                        n.right,
                    ]
                ))
            } else if (path.isUnaryExpression()) {
                const opMap = {
                    '!': 'Not',
                }
                const n = path.node;
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier('__portal.logic'),
                        t.identifier(opMap[n.operator]),
                    ),
                    [
                        n.argument,
                    ]
                ))
            } else if (path.isConditionalExpression()) {
                const n = path.node
                path.replaceWith(t.callExpression(
                    t.memberExpression(
                        t.identifier('__portal.logic'),
                        t.identifier('IfThenElse'),
                    ), [
                        n.test,
                        n.consequent,
                        n.alternate,
                    ]
                ))
            } else if (path.isBooleanLiteral()) {
                const n = path.node
                path.replaceWith(t.newExpression(
                    t.identifier('__portal.BBoolean'),
                    [t.identifier(`${n.value}`)],
                ))
            } else if (path.isNumericLiteral()) {
                const n = path.node
                path.replaceWith(t.newExpression(
                    t.identifier('__portal.BNumber'),
                    [t.identifier(`${n.value}`)],
                ))
            } else if (path.isStringLiteral()) {
                const n = path.node
                if (path.parentPath.isImportDeclaration()) return
                if ((path.parentPath.node.type == 'CallExpression' && path.parentPath.node.callee.object.name == 'mod')) return;
                path.replaceWith(t.newExpression(
                    t.identifier('__portal.BString'),
                    [t.identifier(`"${n.value}"`)],
                ))
            } else if (path.isWhileStatement()) {
                const n = path.node
                path.replaceWith(t.callExpression(
                    t.memberExpression(t.identifier('__portal.logic'), t.identifier('While')),
                    [
                        n.test,
                        t.arrayExpression(n.body.body.map(s => s.expression)),
                    ]
                ))
            } else if (path.isArrowFunctionExpression()) {
                if (path.parentPath.node.type == 'CallExpression' && path.parentPath.node.callee.object.name == 'mod') {
                    return;
                }
                let fn;
                if (path.parentPath.node.type == 'CallExpression' && path.parentPath.node.callee.type == 'MemberExpression') {
                    fn = path.parentPath.node.callee.property.name
                }
                const ignore = ['push', 'slice', 'filter', 'every', 'any', 'map', 'shuffled', 'randomValue', 'sorted', 'get', 'set']
                if (ignore.includes(fn)) {
                    return;
                }
                const n = path.node
                path.replaceWith(t.arrowFunctionExpression(
                    n.params,
                    t.arrayExpression(n.body.body.map(s => s.expression))
                ))
            }
        },
    })

    return generate(ast, {retainLines: true}).code
}