declare module "portal-unleashed" {
    class RuleBody {
        conditions: boolean[];
        actions: () => void;
    }

    // class Variable {
    //     get(): any;
    //     set(value: any);
    //     asArray(): ArrayVariable;
    // }
    interface Variable {}

    // class TrackableVariable implements Variable{
    //     get(): any;
    //     set(value: any);
    //     var(): any;
    //     asArray(): TrackableArrayVariable;
    // }

    // class ArrayVariable implements Variable{
    //     get(): Array;
    //     set(value: Array);
    //     // setAt(index: number, value: any): Array;
    //     push(value: any);
    // }

    // class TrackableArrayVariable implements Variable{
    //     get(): Array;
    //     set(value: Array);
    //     var(): any;
    //     // setAt(index: number, value: any): Array;
    //     push(value: any);
    // }

    class Mod {
        constructor();
        init();
        ongoing(ruleName: string, callback: () => RuleBody);
        ongoingPlayer(ruleName: string, callback: (eventPlayer: Player) => RuleBody);
        ongoingTeam(ruleName: string, callback: (eventTeam: TeamId) => RuleBody);
        newGlobalVar(): any;
        newArrayGlobalVar(): any;
        newTeamVar(): any;
        newArrayTeamVar(): any;
        newPlayerVar(): any;
        newArrayPlayerVar(): any;
        newTrackableGlobalVar(name: string): any;
        newTrackableArrayGlobalVar(name: string): any;
        newTrackableTeamVar(name: string): any;
        newTrackableArrayTeamVar(name: string): any;
        newTrackablePlayerVar(name: string): any;
        newTrackableArrayPlayerVar(name: string): any;
    }

    export const mod: Mod;

    class Array {
        constructor(children: any[]);
        length: number;
        first: any;
        last: any;
        append(element: any, ...elements: any): Array;
        slice(startIndex: number, count?: number): Array;
        filter(predicate: (v: any, i: number, a: Array) => boolean): Array;
        every(predicate: (v: any, i: number, a: Array) => boolean): boolean;
        any(predicate: (v: any, i: number, a: Array) => boolean): boolean;
        map(predicate: (v: any, i: number, a: Array) => any): Array;
        shuffled(): Array;
        randomValue(): any;
        sorted(predicate: (v: any) => number): Array;
        at(index: number): any;
        forEach(predicate: (v: any, i: number, a: Array) => any): void;
    }
}
