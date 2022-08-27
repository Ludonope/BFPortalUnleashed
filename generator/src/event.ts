import { Named } from './common'
import * as morph from 'ts-morph'
import { BPayload } from './payload'

export class BEvent extends Named {
    parameters: BPayload[]
    deprecated: boolean

    constructor(json: any, payloads: BPayload[]) {
        super(json)
        this.parameters = json.parameters.map(param => payloads.find(p => p.parameter == param.name))
        this.deprecated = json.deprecated
    }

    eventInput(): morph.ClassDeclarationStructure {
        
        return {
            name: this.name + 'Body',
            kind: morph.StructureKind.Class,
            properties: [
                {
                    name: 'conditions',
                    type: 'BBoolean[]',
                },
                {
                    name: 'actions',
                    type: `(${this.parameters.map(p => p.pretty() + ': ' + p.type.wrapped).join(', ')}) => BVoid[]`,
                }
            ]
        }
    }

    definition(): morph.MethodDeclarationStructure {
        const objType = []
        if (this.name == 'Ongoing') {
            objType.push(  {
                name: 'objectType',
                type: 'string',
            })
        }
        const params = this.parameters
            .map(p => p.pretty() + ': ' + p.type.wrapped)
            .map(p => p == 'player' ? 'eventPlayer' : p)
            .join(', ')
        return {
            name: this.name[0].toLowerCase() + this.name.substring(1),
            kind: morph.StructureKind.Method,
            parameters: [
                {
                    name: 'ruleName',
                    type: 'string',
                },
                ...objType,
                {
                    name: 'callback',
                    type: `(${params}) => RuleBody | BVoid[]`
                }
            ],
            statements: (writer) => {
                writer.writeLine(`const body = callback(${this.parameters.map(p => `eventPayloads.${p.name}()`).join(', ')})`)
                    .writeLine(`const isRule = !Array.isArray(body)`)
                    .writeLine(`this.rules.push(new BRule(ruleName, '${this.name}', ${this.name == 'Ongoing' ? 'input.objectType' : 'undefined'}, isRule ? body.conditions : [], isRule ? body.actions() : body))`)
            }
        }
    }

    declaration(): morph.MethodDeclarationStructure {
        const objType = []
        if (this.name == 'Ongoing') {
            objType.push(  {
                name: 'objectType',
                type: 'string',
            })
        }
        const params = this.parameters
            .map(p => p.pretty() + ': ' + p.type.wrapped)
            .map(p => p == 'player' ? 'eventPlayer' : p)
            .join(', ')
        return {
            name: this.name[0].toLowerCase() + this.name.substring(1),
            kind: morph.StructureKind.Method,
            parameters: [
                {
                    name: 'ruleName',
                    type: 'string',
                },
                ...objType,
                {
                    name: 'callback',
                    type: `(${params}) => RuleBody | void`
                }
            ],
        }
    }
}
