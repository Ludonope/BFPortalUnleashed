import { Named } from './common'
import { Type } from './types'

export class BPayload extends Named {
    type: Type
    parameter: string
    deprecated: boolean

    constructor(json: any) {
        super(json)
        this.type = new Type(json.functionSignatures[0].returnType)
        this.parameter = json.eventParameter
        this.deprecated = json.deprecated
    }

    pretty(): string {
        return this.parameter[0].toLowerCase() + this.parameter.substring(1)
    }
}