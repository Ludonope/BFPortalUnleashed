import { Named } from './common'
import * as morph from 'ts-morph'

export class BEvent extends Named {
    parameters: string[]
    deprecated: boolean

    constructor(json: any) {
        super(json)
        this.parameters = json.parameters
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
                    type: `(${this.parameters.map(p => p[0].toLowerCase() + p.substring(1) + ': Player').join(', ')}) => BVoid[]`,
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
            .map(p => p[0].toLowerCase() + p.substring(1) + ': Player')
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
                    type: `(${params}) => RuleBody`
                }
            ],
            statements: (writer) => {
                writer.writeLine(`const body = callback(${this.parameters.map(p => `eventPayloads.Event${p}()`).join(', ')})`)
                    .writeLine(`this.rules.push(new BRule(ruleName, '${this.name}', ${this.name == 'Ongoing' ? 'input.objectType' : 'undefined'}, body.conditions, body.actions()))`)
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
            .map(p => p[0].toLowerCase() + p.substring(1) + ': Player')
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
                    type: `(${params}) => RuleBody`
                }
            ],
        }
    }
}
