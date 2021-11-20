import { ClassDeclarationStructure, InterfaceDeclarationStructure, StructureKind } from "ts-morph"
import { Named } from "./common"

const abstractExceptions = ['Boolean', 'Number', 'String']
const exceptions = ['Array', 'Object', 'Message']
export function wrapType(t: string | null): string | null {
  if (t == 'any') {
    return 'IBlock'
  }
  if (abstractExceptions.includes(t)) {
    return 'AB' + t
  }
  return exceptions.includes(t) ? 'B' + t : t
}

function unwrapType(t: string): string | null {
  return exceptions.includes(t.substring(1)) ? t.substring(1) : t
}

export class Type {
  real: string
  wrapped: string

  constructor(type: string | undefined, wrappedType?: string) {
    this.real = type || "void"
    
    if (abstractExceptions.includes(type)) {
      this.real = type.toLowerCase()
    }
    if (type == "Variable") {
      this.real = 'any'
    }
    this.wrapped = wrappedType || wrapType(type) || "BVoid"
  }

  get isEnum(): boolean {
    return this.real.startsWith('Enum_')
  }

  get isAny(): boolean {
    return this.real == 'any'
  }
}

export class Block extends Named {
  inputs: Block[]
  constructor(name: string, SID: string, inputs: Block[]) {
    super({name, SID})
    this.inputs = inputs
  }
}

// Properties of the interface block
const iparams = [
  {name: 'type', type: 'string'},
]

// Parameters to contruct a block
const bparams = [
  {name: 'name', type: 'string'},
  {name: 'children', type: 'IBlock[]'}
]
// Parameters/properties of an abstract block
const aparams = [
  ...iparams,
  {name: 'nameAttr', type: 'string'},
  ...bparams,
]

export function makeBlockType(t: string): ClassDeclarationStructure {
  return {
    name: t,
    kind: StructureKind.Class,
    extends: 'Block',
    ctors: [
        {
            parameters: bparams,
            statements: `super(name, "${t}", children)`
        }
    ]
  }
}

export function makeBlockDefinition(t: string): ClassDeclarationStructure {
  return {
    name: t,
    kind: StructureKind.Class,
    ctors: [{
      parameters: [
        // {name: 'name', type: 'string'},
        {name: 'children', type: 'any[]'}
      ],
    }]
  }
}