declare module "portal-unleashed" {
    class RuleBody {
        conditions: boolean[];
        actions: () => void;
    }

    class Variable {
        get(): any;
        set(value: any);
    }

    class Mod {
        constructor();
        init();
        ongoing(ruleName: string, objectType: string, callback: () => RuleBody);
        newGlobalVar(): Variable;
        newTeamVar(): (team: TeamId) => Variable;
        newPlayerVar(): (player: Player) => Variable;
    }

    export const mod: Mod;

    class Array {
        constructor(children: any[]);
        length: number;
        first: any;
        last: any;
        push(element: any): Array;
        slice(startIndex: number, count: number): Array;
        filter(predicate: (v: any, i: number, a: Array) => boolean): Array;
        every(predicate: (v: any, i: number, a: Array) => boolean): boolean;
        any(predicate: (v: any, i: number, a: Array) => boolean): boolean;
        map(predicate: (v: any, i: number, a: Array) => any): Array;
        shuffled(): Array;
        randomValue(): any;
        sorted(predicate: (v: any) => number): Array;
        get(index: number): any;
        set(index: number, value: any);
    }
}
