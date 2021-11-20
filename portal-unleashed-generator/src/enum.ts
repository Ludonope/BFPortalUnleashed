import * as morph from 'ts-morph'
import { Named, sanitize } from './common'
import { Type } from './types'

const nameRepl = {
    'Alexandria': 'BF3',
    'Grafton': 'BF1942',
    'Rumney': 'BFBC2',
    'Kingston': 'BF2042'
}

export class BEnum extends Named {
    listType: Type
    values: BEnumValue[]
    returnType: Type
    prettyName: string

    constructor(json: any) {
        super(json)
       
        this.prettyName = this.name
        Object.entries(nameRepl).forEach(([n, r]) => {
            this.prettyName = this.prettyName.replace(n, r)
        })
        this.listType = new Type(json.listType)
        this.values = json.selectionValues.map(v => new BEnumValue(v))
        this.returnType = new Type(json.returnType)
    }

    definition(): morph.ModuleDeclarationStructure {
        return {
            name: this.prettyName,
            kind: morph.StructureKind.Module,
            declarationKind: morph.ModuleDeclarationKind.Namespace,
            isExported: true,
            statements: this.values.map((v): morph.VariableStatementStructure => {
                return {
                    declarations: [{
                        name: sanitize(v.prettyName),
                        type: this.returnType.real,
                        initializer: `other.${this.listType.wrapped}Item(new RawBString("${this.name}"), new RawBString("${v.name}"))`
                    }],
                    isExported: true,
                    kind: morph.StructureKind.VariableStatement,
                    declarationKind: morph.VariableDeclarationKind.Const,
                }
            }),
        }
    }

    declaration(): morph.ModuleDeclarationStructure {
        return {
            name: this.prettyName,
            kind: morph.StructureKind.Module,
            declarationKind: morph.ModuleDeclarationKind.Namespace,
            isExported: true,
            statements: this.values.map((v): morph.VariableStatementStructure => {
                return {
                    declarations: [{
                        name: sanitize(v.name),
                        type: this.returnType.real,
                    }],
                    isExported: true,
                    kind: morph.StructureKind.VariableStatement,
                    declarationKind: morph.VariableDeclarationKind.Const,
                }
            }),
        }
    }
}

export class BEnumValue extends Named {
    prettyName: string

    constructor(json: any) {
        super(json)
        this.prettyName = this.name
        Object.entries(nameRepl).forEach(([n, r]) => {
            this.prettyName = this.prettyName.replace(n, r)
        })
    }
}