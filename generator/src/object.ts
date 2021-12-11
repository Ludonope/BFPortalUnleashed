import { Named } from './common'
import { Type } from './types'

export class BObject extends Named {
    type: Type
    deprecated: boolean

    constructor(json: any) {
        super(json)
        this.type = new Type(json.type)
        this.deprecated = json.deprecated
    }
}