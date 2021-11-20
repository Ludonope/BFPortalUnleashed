import { BAction } from './action.js'
import { BEvent } from './event.js'
import { BPayload } from './payload.js'
import { BEnum } from './enum.js'

const ignoreActions = ['If', 'ElseIf', 'Else']
export class Config {
    actions: BAction[]
    events: BEvent[]
    payloads: BPayload[]
    values: BAction[]
    enums: BEnum[]

    constructor(json: any) {
        this.actions = json.actions.map(a => new BAction(a)).filter(a => !ignoreActions.includes(a.name))
        this.events = json.events.map(e => new BEvent(e))
        this.payloads = json.objects.map(o => new BPayload(o))
        this.values = json.values.map(v => new BAction(v))
        this.enums = json.selectionLists.map(l => new BEnum(l))
    }

    getAllTypes(): string[] {
        const except = ["BVoid[]", "BArray", "BMessage"]
        const set = {
            'BVoid': null,
            'BEnumValue': null,
        }
        const actions = this.actions.map(a => a.functionSignatures.map(s => s.parameterTypes.map(p => p.parameterTypes)))
        const values = this.values.map(a => a.functionSignatures.map(s => s.parameterTypes.map(p => p.parameterTypes)))
        const all = [actions, values].flat(4)
        for (const t of all) {
            if (!except.includes(t.wrapped)) {
                set[t.wrapped] = null
            }
        }
        return Object.keys(set)
    }

    getAllRealTypes(): string[] {
        const except = ["Array", "void", "string", "number", "boolean", "any"]
        const set = {}
        const actions = this.actions.map(a => a.functionSignatures.map(s => s.parameterTypes.map(p => p.parameterTypes)))
        const values = this.values.map(a => a.functionSignatures.map(s => s.parameterTypes.map(p => p.parameterTypes)))
        const all = [actions, values].flat(4)
        for (const t of all) {
            if (!except.includes(t.real)) {
                set[t.real] = null
            }
        }
        return Object.keys(set)
    }
}