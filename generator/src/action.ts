import * as morph from 'ts-morph'
import { Named } from './common'
import { Type } from './types'

const hasBody = ["If", "Else", "While", "ForVariable"]

export class BAction extends Named {
    category: string
    subCategory?: string
    deprecated: boolean
    dataIndex: number
    functionSignatures: BSignature[]

    constructor(json: any) {
        super(json)
        this.category = json.category
        this.subCategory = json.subCategory
        this.deprecated = json.deprecated
        this.dataIndex = json.dataIndex
        this.functionSignatures = json.functionSignatures
            .map(s => new BSignature(s, hasBody.includes(this.name)))
            .map((s: BSignature) => {
                if ((this.category == 'Arrays' &&
                    (
                        s.parameterTypes.length == 0 ||
                        (
                            s.parameterTypes.length > 0 &&
                            s.parameterTypes[0].parameterTypes[0].wrapped == 'BArray'
                        )
                    ) &&
                    s.returnType.wrapped == 'BVoid') || this.name == 'IfThenElse') {
                    s.returnType = new Type('any')
                    s.returnType.wrapped = 'BAny'
                }
                return s
            })
        this.functionSignatures.sort((a, b) => a.parameterTypes.length - b.parameterTypes.length)

        if (this.functionSignatures.length == 0) {
            this.functionSignatures.push(new BSignature({
                parameterTypes: [],
            }, false))
        }
    }

    definition() : morph.FunctionDeclarationStructure[] {
        if (this.functionSignatures.length < 2) {
            return this.functionSignatures.map(sig => {
                const def = sig.definition(this.name, false)
                def.statements = sig.statements(this.name)
                return def
            })
        }
        // const funcs = this.functionSignatures.map(sig => sig.definition(this.name, true))
        const funcs = []

        // Compute combined parameters for the actual implementation
        const params = this.functionSignatures.map(sig => sig.parameterTypes.map(p => p.anyType ? ['IBlock'] : p.parameterTypes.map(t => t.wrapped)))
        const longest = params.map(p => p.length).reduce((a, b) => a > b ? a : b)
        // const n = longest > params.length ? longest : params.length;
        const transposed = []
        for (let i = 0; i < longest; i++) {
            const line = []
            for (let j = 0; j < params.length; j++) {
                line.push(params[j] ? params[j][i] : undefined)
            }
            transposed.push(line.flat(1).filter(l => l).filter((v, i, a) => a.indexOf(v) === i))
        }
        const minParamCount = this.functionSignatures
            .map(s => s.parameterTypes.length)
            .reduce((a, b) => a < b ? a : b)

        // Compute the return type
        const returnTypes = this.functionSignatures
            .map(sig => sig.returnType)
            .filter(s => s)
            .filter((v, i, a) => a.indexOf(v) === i)
        // const optionnalReturn = returnTypes.length != this.functionSignatures.length

        funcs.push({
            name: this.name,
            // isStatic: true,
            isExported: true,
            kind: morph.StructureKind.Function,
            // hasQuestionToken: returnTypes.length != 0 && optionnalReturn,
            overloads: this.functionSignatures.map(sig => sig.definition(this.name, true)),
            returnType: returnTypes.length == 0 ? null : returnTypes.map(t => t.wrapped).join(' | '),
            parameters: transposed.map((t, i) => ({
                name: `param${i}`,
                type: t.join(' | '),
                hasQuestionToken: i >= minParamCount,
            })),
            statements: (writer) => {
                for (let i = 0; i < this.functionSignatures.length; i++) {
                    const sig = this.functionSignatures[i]
                    const p = sig.parameterTypes.map(v => v.anyType ? 'IBlock' : v.parameterTypes.map(t => t.wrapped).join(' | '))
                    writer.write('if (')
                    for (let n = 0; n < transposed.length; n++) {
                        const pList = (p[n] || 'undefined').split(' | ').map(v => `"${v}"`).join(', ')
                        if (n > 0) {
                            writer.write(' && \n')
                        }
                        if (p[n]) {
                            writer.indent(n > 0 ? 1 : 0).write(`(param${n}.isAny || [${pList}].includes(param${n}.valueType))`)
                        } else {
                            writer.indent(n > 0 ? 1 : 0).write(`(typeof param${n} == 'undefined')`)
                        }
                    }
                    writer.write(') ')
                        .inlineBlock(() => {
                            sig.statements(this.name)(writer)
                        })
                        .write(' else ')
                }
                writer.inlineBlock(() => {
                    const call = transposed.map((_, i) => {
                        return `\${param${i} ? param${i}.valueType : 'undefined'}`
                    }).join(', ')
                    writer.writeLine(`throw \`Invalid function signature called ${this.name}(${call})\``)
                })
            }
        })
        return funcs
    }

    declarations() : morph.FunctionDeclarationStructure[] {
        return this.functionSignatures.map(sig => sig.declaration(this.name))
    }
}


export class BSignature {
    parameterTypes: BParameterType[]
    returnType?: Type
    hasBody: boolean

    constructor(json: any, hasBody: boolean) {
        this.parameterTypes = json.parameterTypes.map(param => new BParameterType(param))
        this.returnType = new Type(json.returnType)
        this.hasBody = hasBody
        if (hasBody) {
            const t = new Type('BVoid[]')
            t.real = "void"
            this.parameterTypes.push({anyType: false, parameterTypes: [t]})
        }
        if (this.returnType.isEnum) {
            const ndx = this.parameterTypes.length - 1
            const last = this.parameterTypes[ndx]
            if (!last.anyType && last.parameterTypes.length == 1 && last.parameterTypes[0].wrapped == 'ABNumber') {
                last.parameterTypes = [new Type('string', 'ABString')]
            }
        }
    }

    definition(name: string, isAbstract: boolean): morph.FunctionDeclarationStructure {
        return {
            name: name,
            kind: morph.StructureKind.Function,
            isExported: true,
            parameters: this.parameterTypes.map((p, i) => ({
                name: `param${i}`,
                type: p.anyType ? 'IBlock' : p.parameterTypes.map(t => t.wrapped).join(' | '),
            })),
            returnType: this.returnType.wrapped,
        }
    }

    statements(name: string): morph.WriterFunction {
        return (writer) => {
            const retType = this.returnType.wrapped
            writer.writeLine(`return new ${retType}(`)
                .indent(1).write(`'${name}', [\n`)
            this.parameterTypes.forEach((_, i) => {
                let decl = `new Value("VALUE-${i}", [param${i}]),\n`
                if (this.returnType.isEnum) {
                    decl = `new Field("VALUE-${i}", param${i}),\n`
                } else if (this.hasBody && i == this.parameterTypes.length - 1) {
                    decl = `new Statement("DO", param${i}),\n`
                }
                writer.indent(1).write(decl)
            })
            writer.writeLine('])')
        }
    }

    declaration(name: string): morph.FunctionDeclarationStructure {
        return {
            name: name,
            kind: morph.StructureKind.Function,
            isExported: true,
            parameters: this.parameterTypes.map((p, i) => ({
                name: `param${i}`,
                type: p.anyType ? 'any' : p.parameterTypes.map(t => t.real).join(' | '),
            })),
            returnType: this.returnType.real,
        }
    }
}

export class BParameterType {
    anyType: boolean
    parameterTypes: Type[]

    constructor(json: any) {
        this.anyType = json.anyType || false
        this.parameterTypes = json.parameterTypes.map(t => new Type(t))
    }
}