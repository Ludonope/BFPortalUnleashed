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
        ongoing(ruleName: string, callback: () => RuleBody | void);
        ongoingPlayer(ruleName: string, callback: (eventPlayer: Player) => RuleBody | void);
        ongoingTeam(ruleName: string, callback: (eventTeam: TeamId) => RuleBody | void);
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
        onCapturePointCaptured(ruleName: string, callback: (capturePoint: CapturePoint) => RuleBody | void);
        onCapturePointCapturing(ruleName: string, callback: (capturePoint: CapturePoint) => RuleBody | void);
        onCapturePointLost(ruleName: string, callback: (capturePoint: CapturePoint) => RuleBody | void);
        onGameModeEnding(ruleName: string, callback: () => RuleBody | void);
        onGameModeStarted(ruleName: string, callback: () => RuleBody | void);
        onMandown(ruleName: string, callback: (player: Player, otherPlayer: Player) => RuleBody | void);
        onPlayerDeployed(ruleName: string, callback: (player: Player) => RuleBody | void);
        onPlayerDied(ruleName: string, callback: (player: Player, otherPlayer: Player, deathType: DeathType, weaponUnlock: WeaponUnlock) => RuleBody | void);
        onPlayerEarnedKill(ruleName: string, callback: (player: Player, otherPlayer: Player, deathType: DeathType, weaponUnlock: WeaponUnlock) => RuleBody | void);
        onPlayerEnterVehicle(ruleName: string, callback: (player: Player, vehicle: Vehicle) => RuleBody | void);
        onPlayerEnterVehicleSeat(ruleName: string, callback: (player: Player, vehicle: Vehicle, seat: ABNumber) => RuleBody | void);
        onPlayerExitVehicle(ruleName: string, callback: (player: Player, vehicle: Vehicle) => RuleBody | void);
        onPlayerExitVehicleSeat(ruleName: string, callback: (player: Player, vehicle: Vehicle, seat: ABNumber) => RuleBody | void);
        onPlayerIrreversiblyDead(ruleName: string, callback: (player: Player) => RuleBody | void);
        onPlayerJoinGame(ruleName: string, callback: (player: Player) => RuleBody | void);
        onPlayerLeaveGame(ruleName: string, callback: () => RuleBody | void);
        onRevived(ruleName: string, callback: (player: Player, otherPlayer: Player) => RuleBody | void);
        onTimeLimitReached(ruleName: string, callback: () => RuleBody | void);
        onVehicleDestroyed(ruleName: string, callback: (vehicle: Vehicle) => RuleBody | void);
        onVehicleSpawned(ruleName: string, callback: (vehicle: Vehicle) => RuleBody | void);
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

    class Player {
        constructor(children: any[]);
    }

    class Enum_PrimaryWeapons {
        constructor(children: any[]);
    }

    class Enum_SecondaryWeapons {
        constructor(children: any[]);
    }

    class Enum_OpenGadgets {
        constructor(children: any[]);
    }

    class Enum_CharacterGadgets {
        constructor(children: any[]);
    }

    class Enum_Throwables {
        constructor(children: any[]);
    }

    class Enum_MeleeWeapons {
        constructor(children: any[]);
    }

    class Enum_MedGadgetTypes {
        constructor(children: any[]);
    }

    class TeamId {
        constructor(children: any[]);
    }

    class Enum_CustomMessages {
        constructor(children: any[]);
    }

    class Vehicle {
        constructor(children: any[]);
    }

    class Message {
        constructor(children: any[]);
    }

    class Enum_RestrictedInputs {
        constructor(children: any[]);
    }

    class CapturePoint {
        constructor(children: any[]);
    }

    class Enum_InventorySlots {
        constructor(children: any[]);
    }

    class Enum_ResupplyTypes {
        constructor(children: any[]);
    }

    class Enum_SoldierKits {
        constructor(children: any[]);
    }

    class Vector {
        constructor(children: any[]);
    }

    class Enum_CapturePoints {
        constructor(children: any[]);
    }

    class Enum_Vehicles {
        constructor(children: any[]);
    }

    class Enum_VehicleTypes {
        constructor(children: any[]);
    }

    class DeathType {
        constructor(children: any[]);
    }

    class Enum_PlayerDeathTypes {
        constructor(children: any[]);
    }

    class WeaponUnlock {
        constructor(children: any[]);
    }

    class Enum_SoldierStateNumber {
        constructor(children: any[]);
    }

    class Enum_SoldierStateBool {
        constructor(children: any[]);
    }

    class Enum_SoldierStateVector {
        constructor(children: any[]);
    }

    class Enum_VehicleStateVector {
        constructor(children: any[]);
    }

    class Enum_Maps {
        constructor(children: any[]);
    }

    class Enum_Factions {
        constructor(children: any[]);
    }

    class Object {
        constructor(children: any[]);
    }

    export namespace logic {
        export function Abort(): void;

        export function AbortIf(param0: boolean): void;

        export function Break(): void;

        export function CallSubroutine(param0: number): void;

        export function ChaseVariableAtRate(param0: any, param1: number, param2: number): void;

        export function ChaseVariableOverTime(param0: any, param1: number, param2: number): void;

        export function Continue(): void;

        export function End(): void;

        export function ForVariable(param0: any, param1: number, param2: number, param3: number, param4: void): void;

        export function Skip(param0: number): void;

        export function SkipIf(param0: number, param1: boolean): void;

        export function StopChasingVariable(param0: any): void;

        export function Wait(param0: number): void;

        export function WaitUntil(param0: number, param1: boolean): void;

        export function While(param0: boolean, param1: void): void;

        export function And(param0: boolean, param1: boolean): boolean;

        export function Equals(param0: any, param1: any): boolean;

        export function GreaterThan(param0: number, param1: number): boolean;

        export function GreaterThanEqualTo(param0: number, param1: number): boolean;

        export function IfThenElse(param0: boolean, param1: any, param2: any): any;

        export function LessThan(param0: number, param1: number): boolean;

        export function LessThanEqualTo(param0: number, param1: number): boolean;

        export function Not(param0: boolean): boolean;

        export function NotEqualTo(param0: any, param1: any): boolean;

        export function Or(param0: boolean, param1: boolean): boolean;

        export function Xor(param0: boolean, param1: boolean): boolean;
    }

    export namespace player {
        export function AddSoldierWeapon(param0: Player, param1: Enum_PrimaryWeapons): void;

        export function AddSoldierWeapon(param0: Player, param1: Enum_SecondaryWeapons): void;

        export function AddSoldierWeapon(param0: Player, param1: Enum_OpenGadgets): void;

        export function AddSoldierWeapon(param0: Player, param1: Enum_CharacterGadgets): void;

        export function AddSoldierWeapon(param0: Player, param1: Enum_Throwables): void;

        export function AddSoldierWeapon(param0: Player, param1: Enum_MeleeWeapons): void;

        export function ApplyMedGadget(param0: Player, param1: Enum_MedGadgetTypes): void;

        export function EnableAllInputRestrictions(param0: Player, param1: boolean): void;

        export function EnableInputRestriction(param0: Player, param1: Enum_RestrictedInputs, param2: boolean): void;

        export function ForceManDown(param0: Player): void;

        export function ForceRevive(param0: Player): void;

        export function ForceSwitchInventory(param0: Player, param1: Enum_InventorySlots): void;

        export function Resupply(param0: Player, param1: Enum_ResupplyTypes): void;

        export function SetHeal(param0: Player, param1: number): void;

        export function SetHeal(param0: Player, param1: number, param2: Player): void;

        export function SetInventoryAmmo(param0: Player, param1: Enum_InventorySlots, param2: number): void;

        export function SetInventoryMagazineAmmo(param0: Player, param1: Enum_InventorySlots, param2: number): void;

        export function SetPlayerDamage(param0: Player, param1: number): void;

        export function SetPlayerDamage(param0: Player, param1: number, param2: Player): void;

        export function SetPlayerKit(param0: Player, param1: Enum_SoldierKits): void;

        export function SetPlayerMaxHealth(param0: Player, param1: number): void;

        export function SkipManDown(param0: Player, param1: boolean): void;

        export function Teleport(param0: Player, param1: Vector, param2: number): void;

        export function Teleport(param0: Vehicle, param1: Vector, param2: number): void;

        export function AllPlayers(): Array;

        export function ClosestPlayerTo(param0: Vector): Player;

        export function ClosestPlayerTo(param0: Vector, param1: TeamId): Player;

        export function EventDeathTypeCompare(param0: DeathType, param1: Enum_PlayerDeathTypes): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_PrimaryWeapons): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_SecondaryWeapons): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_OpenGadgets): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_CharacterGadgets): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_Throwables): boolean;

        export function EventWeaponCompare(param0: WeaponUnlock, param1: Enum_MeleeWeapons): boolean;

        export function FarthestPlayerFrom(param0: Vector): Player;

        export function FarthestPlayerFrom(param0: Vector, param1: TeamId): Player;

        export function GetInventoryAmmo(param0: Player, param1: Enum_InventorySlots): number;

        export function GetInventoryMagazineAmmo(param0: Player, param1: Enum_InventorySlots): number;

        export function GetPlayerDeaths(param0: Player): number;

        export function GetPlayerKills(param0: Player): number;

        export function GetSoldierState(param0: Player, param1: Enum_SoldierStateNumber): number;

        export function GetSoldierState(param0: Player, param1: Enum_SoldierStateBool): boolean;

        export function GetSoldierState(param0: Player, param1: Enum_SoldierStateVector): Vector;

        export function GetTeamId(param0: Player): TeamId;

        export function GetTeamId(param0: number): TeamId;

        export function HasInventory(param0: Player, param1: Enum_PrimaryWeapons): boolean;

        export function HasInventory(param0: Player, param1: Enum_SecondaryWeapons): boolean;

        export function HasInventory(param0: Player, param1: Enum_OpenGadgets): boolean;

        export function HasInventory(param0: Player, param1: Enum_CharacterGadgets): boolean;

        export function HasInventory(param0: Player, param1: Enum_Throwables): boolean;

        export function HasInventory(param0: Player, param1: Enum_MeleeWeapons): boolean;

        export function IsInventorySlotActive(param0: Player, param1: Enum_InventorySlots): boolean;

        export function IsPlayerValid(param0: Player): boolean;

        export function IsUsingKit(param0: Player, param1: Enum_SoldierKits): boolean;
    }

    export namespace ui {
        export function ClearAllCustomNotificationMessages(): void;

        export function ClearAllCustomNotificationMessages(param0: Player): void;

        export function ClearAllCustomNotificationMessages(param0: TeamId): void;

        export function ClearCustomNotificationMessage(param0: Enum_CustomMessages): void;

        export function ClearCustomNotificationMessage(param0: Enum_CustomMessages, param1: Player): void;

        export function ClearCustomNotificationMessage(param0: Enum_CustomMessages, param1: TeamId): void;

        export function DisplayCustomNotificationMessage(param0: Message, param1: Enum_CustomMessages, param2: number): void;

        export function DisplayCustomNotificationMessage(param0: Message, param1: Enum_CustomMessages, param2: number, param3: Player | TeamId): void;

        export function SendErrorReport(param0: Message): void;

        export function ShowEventGameModeMessage(param0: Message): void;

        export function ShowEventGameModeMessage(param0: Message, param1: Player | TeamId): void;

        export function ShowHighlightedGameModeMessage(param0: Message): void;

        export function ShowHighlightedGameModeMessage(param0: Message, param1: Player | TeamId): void;

        export function ShowNotificationMessage(param0: Message): void;

        export function ShowNotificationMessage(param0: Message, param1: Player | TeamId): void;

        export function Message(param0: string | number | Player): Message;

        export function Message(param0: string | number | Player, param1: string | number | Player): Message;

        export function Message(param0: string | number | Player, param1: string | number | Player, param2: string | number | Player): Message;

        export function Message(param0: string | number | Player, param1: string | number | Player, param2: string | number | Player, param3: string | number | Player): Message;
    }

    export namespace vehicle {
        export function DestroyVehicle(param0: Vehicle): void;

        export function ForceExitAllPlayerInVehicle(param0: Vehicle): void;

        export function ForcePlayerExitVehicle(param0: Player, param1: Vehicle): void;

        export function ForcePlayerToSeat(param0: Player, param1: Vehicle, param2: number): void;

        export function SetVehicleMaxHealthMultiplier(param0: Vehicle, param1: number): void;

        export function AllVehicles(): Array;

        export function CompareVehicleName(param0: Vehicle, param1: Enum_Vehicles): boolean;

        export function CompareVehicleName(param0: Vehicle, param1: Enum_VehicleTypes): boolean;

        export function GetAllPlayersInVehicle(param0: Vehicle): Array;

        export function GetPlayerFromVehicleSeat(param0: Vehicle, param1: number): Player;

        export function GetPlayerVehicleSeat(param0: Player): number;

        export function GetVehicleFromPlayer(param0: Player): Vehicle;

        export function GetVehicleSeatCount(param0: Vehicle): number;

        export function GetVehicleState(param0: Vehicle, param1: Enum_VehicleStateVector): Vector;

        export function GetVehicleTeamId(param0: Vehicle): TeamId;

        export function IsVehicleOccupied(param0: Vehicle): boolean;

        export function IsVehicleSeatOccupied(param0: Vehicle, param1: number): boolean;
    }

    export namespace gameplay {
        export function EnableDefaultScoring(param0: boolean): void;

        export function EnableDefaultWinCondition(param0: boolean): void;

        export function EnablePlayerSpawning(param0: boolean): void;

        export function EnableVOMessaging(param0: boolean): void;

        export function EndRound(param0: TeamId): void;

        export function EndRound(param0: Player): void;

        export function ForceSpawnAllPlayers(): void;

        export function Kill(param0: Player): void;

        export function PauseRoundTime(param0: boolean): void;

        export function ResetRoundTime(): void;

        export function SetGamemodeScore(param0: TeamId, param1: number): void;

        export function SetGamemodeScore(param0: Player, param1: number): void;

        export function SetRedeployTime(param0: Player, param1: number): void;

        export function SetRoundTimeLimit(param0: number): void;

        export function SetSpawnOverride(param0: Player, param1: boolean): void;

        export function SetTargetScore(param0: number): void;

        export function SetTeam(param0: Player, param1: TeamId): void;

        export function SpawnPlayer(param0: Player): void;

        export function SpotTarget(param0: Player, param1: number): void;

        export function SpotTargetForPlayer(param0: Player, param1: Player, param2: number): void;

        export function UnspawnAllPlayers(): void;

        export function UnspawnPlayer(param0: Player): void;

        export function UnspotTarget(param0: Player): void;

        export function GetGamemodeScore(param0: Player): number;

        export function GetGamemodeScore(param0: TeamId): number;

        export function GetGameModeTimeElapsed(): number;

        export function GetMatchTimeElapsed(): number;

        export function GetRoundTime(): number;

        export function GetTargetScore(): number;

        export function IsCurrentMap(param0: Enum_Maps): boolean;

        export function IsFaction(param0: TeamId, param1: Enum_Factions): boolean;
    }

    export namespace objectives {
        export function EnableObjective(param0: CapturePoint, param1: boolean): void;

        export function AllCapturePoints(): Array;

        export function CompareCapturePoint(param0: CapturePoint, param1: Enum_CapturePoints): boolean;

        export function GetCapturePoint(param0: Enum_CapturePoints): CapturePoint;

        export function GetCaptureProgress(param0: CapturePoint): number;

        export function GetCurrentOwnerTeamID(param0: CapturePoint): TeamId;

        export function GetOwnerProgressTeamID(param0: CapturePoint): TeamId;

        export function GetPreviousOwnerTeamID(param0: CapturePoint): TeamId;
    }

    export namespace other {
        export function SetVariable(param0: any, param1: any): void;

        export function CapturePointsItem(param0: string, param1: string): Enum_CapturePoints;

        export function CharacterGadgetsItem(param0: string, param1: string): Enum_CharacterGadgets;

        export function CustomMessagesItem(param0: string, param1: string): Enum_CustomMessages;

        export function FactionsItem(param0: string, param1: string): Enum_Factions;

        export function GetPlayersOnPoint(param0: CapturePoint): Array;

        export function GetVariable(param0: any): void;

        export function GlobalVariable(param0: number): any;

        export function InventorySlotsItem(param0: string, param1: string): Enum_InventorySlots;

        export function MapsItem(param0: string, param1: string): Enum_Maps;

        export function MedGadgetTypesItem(param0: string, param1: string): Enum_MedGadgetTypes;

        export function MeleeWeaponsItem(param0: string, param1: string): Enum_MeleeWeapons;

        export function ObjectVariable(param0: Object, param1: number): any;

        export function OpenGadgetsItem(param0: string, param1: string): Enum_OpenGadgets;

        export function PlayerDeathTypesItem(param0: string, param1: string): Enum_PlayerDeathTypes;

        export function PrimaryWeaponsItem(param0: string, param1: string): Enum_PrimaryWeapons;

        export function RestrictedInputsItem(param0: string, param1: string): Enum_RestrictedInputs;

        export function ResupplyTypesItem(param0: string, param1: string): Enum_ResupplyTypes;

        export function SecondaryWeaponsItem(param0: string, param1: string): Enum_SecondaryWeapons;

        export function SoldierKitsItem(param0: string, param1: string): Enum_SoldierKits;

        export function SoldierStateBoolItem(param0: string, param1: string): Enum_SoldierStateBool;

        export function SoldierStateNumberItem(param0: string, param1: string): Enum_SoldierStateNumber;

        export function SoldierStateVectorItem(param0: string, param1: string): Enum_SoldierStateVector;

        export function ThrowablesItem(param0: string, param1: string): Enum_Throwables;

        export function VehiclesItem(param0: string, param1: string): Enum_Vehicles;

        export function VehicleStateVectorItem(param0: string, param1: string): Enum_VehicleStateVector;

        export function VehicleTypesItem(param0: string, param1: string): Enum_VehicleTypes;
    }

    export namespace arrays {
        export function SetVariableAtIndex(param0: any, param1: number, param2: any): void;

        export function AppendToArray(param0: Array, param1: any): Array;

        export function ArraySlice(param0: Array, param1: number, param2: number): Array;

        export function CountOf(param0: Array): number;

        export function CurrentArrayElement(): any;

        export function EmptyArray(): Array;

        export function FilteredArray(param0: Array, param1: any): Array;

        export function FirstOf(param0: Array): any;

        export function IndexOfFirstTrue(param0: Array, param1: any): number;

        export function IsTrueForAll(param0: Array, param1: any): boolean;

        export function IsTrueForAny(param0: Array, param1: any): boolean;

        export function LastOf(param0: Array): any;

        export function MappedArray(param0: Array, param1: any): Array;

        export function RandomizedArray(param0: Array): Array;

        export function RandomValueInArray(param0: Array): any;

        export function SortedArray(param0: Array, param1: number): Array;

        export function ValueInArray(param0: Array, param1: number): any;
    }

    export namespace math {
        export function AbsoluteValue(param0: number): number;

        export function Add(param0: number, param1: number): number;

        export function Add(param0: Vector, param1: Vector): Vector;

        export function AngleBetweenVectors(param0: Vector, param1: Vector): number;

        export function AngleDifference(param0: number, param1: number): number;

        export function ArccosineInDegrees(param0: number): number;

        export function ArccosineInRadians(param0: number): number;

        export function ArcsineInDegrees(param0: number): number;

        export function ArcsineInRadians(param0: number): number;

        export function ArctangentInDegrees(param0: number): number;

        export function ArctangentInRadians(param0: number): number;

        export function BackwardVector(): Vector;

        export function CosineFromDegrees(param0: number): number;

        export function CosineFromRadians(param0: number): number;

        export function CreateVector(param0: number, param1: number, param2: number): Vector;

        export function CrossProduct(param0: Vector, param1: Vector): Vector;

        export function DirectionFromAngles(param0: number, param1: number): Vector;

        export function DirectionTowards(param0: Vector, param1: Vector): Vector;

        export function DistanceBetween(param0: Vector, param1: Vector): number;

        export function Divide(param0: number, param1: number): number;

        export function Divide(param0: Vector, param1: number): Vector;

        export function DotProduct(param0: Vector, param1: Vector): number;

        export function DownVector(): Vector;

        export function ForwardVector(): Vector;

        export function LeftVector(): Vector;

        export function LocalPositionOf(param0: Vector, param1: Player): Vector;

        export function LocalVectorOf(param0: Vector, param1: Player): Vector;

        export function Max(param0: number, param1: number): number;

        export function Modulo(param0: number, param1: number): number;

        export function Multiply(param0: number, param1: number): number;

        export function Multiply(param0: Vector, param1: number): Vector;

        export function Normalize(param0: Vector): Vector;

        export function RaiseToPower(param0: number, param1: number): number;

        export function RandomReal(param0: number, param1: number): number;

        export function RightVector(): Vector;

        export function RoundToInteger(param0: number): number;

        export function SineFromDegrees(param0: number): number;

        export function SineFromRadians(param0: number): number;

        export function SquareRoot(param0: number): number;

        export function Subtract(param0: number, param1: number): number;

        export function Subtract(param0: Vector, param1: Vector): Vector;

        export function TangentFromDegrees(param0: number): number;

        export function TangentFromRadians(param0: number): number;

        export function UpVector(): Vector;

        export function VectorTowards(param0: Vector, param1: Vector): Vector;

        export function WorldPositionOf(param0: Vector, param1: Player): Vector;

        export function WorldVectorOf(param0: Vector, param1: Player): Vector;

        export function XComponentOf(param0: Vector): number;

        export function YComponentOf(param0: Vector): number;

        export function ZComponentOf(param0: Vector): number;
    }

    export namespace eventPayloads {
        export function EventCapturePoint(): CapturePoint;

        export function EventDeathType(): DeathType;

        export function EventOtherPlayer(): Player;

        export function EventPlayer(): Player;

        export function EventSeat(): number;

        export function EventTeam(): TeamId;

        export function EventVehicle(): Vehicle;

        export function EventWeapon(): WeaponUnlock;
    }

    export namespace enums {
        export namespace Airplane {
            export const B_17Bomber: Enum_Vehicles;
            export const BF109: Enum_Vehicles;
            export const F35B: Enum_Vehicles;
            export const FA18Hornet: Enum_Vehicles;
            export const Spitfire: Enum_Vehicles;
            export const Stuka: Enum_Vehicles;
            export const SU35BME: Enum_Vehicles;
            export const SU57: Enum_Vehicles;
        }

        export namespace BF1942_GER {
            export const GERAntiTankGRA: Enum_SoldierKits;
            export const GERAssaultGRA: Enum_SoldierKits;
            export const GEREngineerGRA: Enum_SoldierKits;
            export const GERMedicGRA: Enum_SoldierKits;
            export const GERScoutGRA: Enum_SoldierKits;
        }

        export namespace BF1942_UK {
            export const UKAntiTankGRA: Enum_SoldierKits;
            export const UKAssaultGRA: Enum_SoldierKits;
            export const UKEngineerGRA: Enum_SoldierKits;
            export const UKMedicGRA: Enum_SoldierKits;
            export const UKScoutGRA: Enum_SoldierKits;
        }

        export namespace BF1942_US {
            export const USAntiTankGRA: Enum_SoldierKits;
            export const USAssaultGRA: Enum_SoldierKits;
            export const USEngineerGRA: Enum_SoldierKits;
            export const USMedicGRA: Enum_SoldierKits;
            export const USScoutGRA: Enum_SoldierKits;
        }

        export namespace BF2042 {
            export const Bravo: Enum_SoldierKits;
            export const Charlie: Enum_SoldierKits;
            export const Delta: Enum_SoldierKits;
            export const Foxtrot: Enum_SoldierKits;
            export const India: Enum_SoldierKits;
            export const Juliet: Enum_SoldierKits;
            export const Kilo: Enum_SoldierKits;
            export const Lima: Enum_SoldierKits;
        }

        export namespace BF3_RU {
            export const RUAssaultALX: Enum_SoldierKits;
            export const RUEngineerALX: Enum_SoldierKits;
            export const RUReconALX: Enum_SoldierKits;
            export const RUSupportALX: Enum_SoldierKits;
        }

        export namespace BF3_US {
            export const USAssaultALX: Enum_SoldierKits;
            export const USEngineerALX: Enum_SoldierKits;
            export const USReconALX: Enum_SoldierKits;
            export const USSupportALX: Enum_SoldierKits;
        }

        export namespace BFBC2_RU {
            export const RUAssaultRUM: Enum_SoldierKits;
            export const RUEngineerRUM: Enum_SoldierKits;
            export const RUMedicRUM: Enum_SoldierKits;
            export const RUReconRUM: Enum_SoldierKits;
        }

        export namespace BFBC2_US {
            export const USAssaultRUM: Enum_SoldierKits;
            export const USEngineerRUM: Enum_SoldierKits;
            export const USMedicRUM: Enum_SoldierKits;
            export const USReconRUM: Enum_SoldierKits;
        }

        export namespace CapturePoints {
            export const A1: Enum_CapturePoints;
            export const B1: Enum_CapturePoints;
            export const C1: Enum_CapturePoints;
            export const D1: Enum_CapturePoints;
            export const E1: Enum_CapturePoints;
        }

        export namespace CharacterGadgetsBF3 {
            export const AmmoBag_ALX: Enum_CharacterGadgets;
            export const MedicBag_ALX: Enum_CharacterGadgets;
            export const RepairTool_ALX: Enum_CharacterGadgets;
            export const TUGS: Enum_CharacterGadgets;
        }

        export namespace CharacterGadgetsBF1942 {
            export const Binoculars: Enum_CharacterGadgets;
            export const MedKit_GRA: Enum_CharacterGadgets;
            export const RepairTool_GRA: Enum_CharacterGadgets;
        }

        export namespace CharacterGadgetsBF2042 {
            export const ARScanner: Enum_CharacterGadgets;
            export const AutoTurret: Enum_CharacterGadgets;
            export const BallisticShield: Enum_CharacterGadgets;
            export const ConstructionKit: Enum_CharacterGadgets;
            export const GrappleGun: Enum_CharacterGadgets;
            export const ReconDrone: Enum_CharacterGadgets;
            export const SignalHacker: Enum_CharacterGadgets;
            export const SmartExplosives: Enum_CharacterGadgets;
            export const StimPistol: Enum_CharacterGadgets;
            export const SupplyBag: Enum_CharacterGadgets;
            export const TVMissile: Enum_CharacterGadgets;
        }

        export namespace CharacterGadgetsBFBC2 {
            export const AmmoBox_RUM: Enum_CharacterGadgets;
            export const MedKit: Enum_CharacterGadgets;
            export const MotionSensor: Enum_CharacterGadgets;
            export const RepairTool_RUM: Enum_CharacterGadgets;
        }

        export namespace CustomMessages {
            export const HeaderText: Enum_CustomMessages;
            export const MessageText1: Enum_CustomMessages;
            export const MessageText2: Enum_CustomMessages;
            export const MessageText3: Enum_CustomMessages;
            export const MessageText4: Enum_CustomMessages;
        }

        export namespace Factions {
            export const Alexandria_RU: Enum_Factions;
            export const Alexandria_US: Enum_Factions;
            export const Grafton_GER: Enum_Factions;
            export const Grafton_UK: Enum_Factions;
            export const Grafton_US: Enum_Factions;
            export const Kingston_RU: Enum_Factions;
            export const Kingston_US: Enum_Factions;
            export const Rumney_RU: Enum_Factions;
            export const Rumney_US: Enum_Factions;
        }

        export namespace Heavy {
            export const AAV_7A1: Enum_Vehicles;
            export const M1_Abrams: Enum_Vehicles;
            export const M10Wolverine: Enum_Vehicles;
            export const M1A2Abrams: Enum_Vehicles;
            export const T14Armata: Enum_Vehicles;
            export const T90: Enum_Vehicles;
            export const Tiger_I: Enum_Vehicles;
        }

        export namespace Helicopter {
            export const AH6: Enum_Vehicles;
            export const AH64D: Enum_Vehicles;
            export const Apache: Enum_Vehicles;
            export const Condor: Enum_Vehicles;
            export const KA_X_Hannibal: Enum_Vehicles;
            export const KA52_Alligator: Enum_Vehicles;
            export const LittleBird: Enum_Vehicles;
            export const Mi24_KIN: Enum_Vehicles;
            export const Mi28: Enum_Vehicles;
            export const Shoshone: Enum_Vehicles;
            export const UH60: Enum_Vehicles;
            export const Z11W: Enum_Vehicles;
        }

        export namespace InventorySlots {
            export const CharacterGadget: Enum_InventorySlots;
            export const MeleeWeapon: Enum_InventorySlots;
            export const OpenGadget: Enum_InventorySlots;
            export const PrimaryWeapon: Enum_InventorySlots;
            export const SecondaryWeapon: Enum_InventorySlots;
            export const Throwable: Enum_InventorySlots;
        }

        export namespace Light {
            export const GAZ_Vodnik: Enum_Vehicles;
            export const GrowlerITV: Enum_Vehicles;
            export const HDTStorm: Enum_Vehicles;
            export const Kubelwagen: Enum_Vehicles;
            export const M1114_ALX: Enum_Vehicles;
            export const M1114_RUM: Enum_Vehicles;
            export const Pickup: Enum_Vehicles;
            export const Polaris: Enum_Vehicles;
            export const Quad_RUM: Enum_Vehicles;
            export const RHIB: Enum_Vehicles;
            export const TukTuk: Enum_Vehicles;
            export const VDV_Buggy: Enum_Vehicles;
            export const WillysJeep: Enum_Vehicles;
        }

        export namespace Maps {
            export const Discarded: Enum_Maps;
            export const Frost: Enum_Maps;
            export const Harbor: Enum_Maps;
            export const Hourglass: Enum_Maps;
            export const Irreversible: Enum_Maps;
            export const Kaleidoscope: Enum_Maps;
            export const Lighthouse: Enum_Maps;
            export const LongHaul: Enum_Maps;
            export const Oasis: Enum_Maps;
            export const Orbital: Enum_Maps;
            export const Port: Enum_Maps;
            export const Ridge: Enum_Maps;
            export const Rural: Enum_Maps;
            export const TheWall: Enum_Maps;
        }

        export namespace MedGadgetTypes {
            export const MedicCrate: Enum_MedGadgetTypes;
            export const MedKit: Enum_MedGadgetTypes;
        }

        export namespace Medium {
            export const _9k22Tunguska: Enum_Vehicles;
            export const BMP_2: Enum_Vehicles;
            export const Bolte: Enum_Vehicles;
            export const Christy_Hovercraft: Enum_Vehicles;
            export const FNSS_ZAHA: Enum_Vehicles;
            export const Halftrack_Hanomag: Enum_Vehicles;
            export const HalftrackM3: Enum_Vehicles;
            export const Jaguar: Enum_Vehicles;
            export const LAV25: Enum_Vehicles;
            export const LAVAD: Enum_Vehicles;
            export const M3A3: Enum_Vehicles;
            export const M4Sherman: Enum_Vehicles;
            export const Panzer__IV: Enum_Vehicles;
        }

        export namespace MeleeBF3 {
            export const Knife_BF3: Enum_MeleeWeapons;
        }

        export namespace MeleeBF1942 {
            export const Knife_1942: Enum_MeleeWeapons;
        }

        export namespace MeleeBF2042 {
            export const ACB90Knife: Enum_MeleeWeapons;
            export const Hatchet: Enum_MeleeWeapons;
            export const SkeletonizedKnife: Enum_MeleeWeapons;
            export const SurvivalKnife: Enum_MeleeWeapons;
            export const TacticalFoldingKnife: Enum_MeleeWeapons;
        }

        export namespace MeleeBFBC2 {
            export const Knife_BC2: Enum_MeleeWeapons;
        }

        export namespace OpenGadgetsBF3 {
            export const ATMine_ALX: Enum_OpenGadgets;
            export const C4_ALX: Enum_OpenGadgets;
            export const Defibrillator_ALX: Enum_OpenGadgets;
            export const EODBot: Enum_OpenGadgets;
            export const FGM148Javelin: Enum_OpenGadgets;
            export const FIM92Stinger: Enum_OpenGadgets;
            export const M18Claymore: Enum_OpenGadgets;
            export const RadioBeacon: Enum_OpenGadgets;
            export const SA18IGLA: Enum_OpenGadgets;
            export const SMAW: Enum_OpenGadgets;
            export const SOFLAM_ALX: Enum_OpenGadgets;
        }

        export namespace OpenGadgetsBF1942 {
            export const Landmine: Enum_OpenGadgets;
        }

        export namespace OpenGadgetsBF2042 {
            export const AmmoCrate: Enum_OpenGadgets;
            export const ArmorPiece: Enum_OpenGadgets;
            export const ATMine: Enum_OpenGadgets;
            export const C4: Enum_OpenGadgets;
            export const CarlGustav: Enum_OpenGadgets;
            export const CZ805G1: Enum_OpenGadgets;
            export const HealthCrate: Enum_OpenGadgets;
            export const RepairTool: Enum_OpenGadgets;
            export const SelfHeal: Enum_OpenGadgets;
            export const SOFLAM: Enum_OpenGadgets;
            export const SpawnBeacon: Enum_OpenGadgets;
            export const Stinger: Enum_OpenGadgets;
        }

        export namespace OpenGadgetsBFBC2 {
            export const ATMine_RUM: Enum_OpenGadgets;
            export const C4_RUM: Enum_OpenGadgets;
            export const Defibrillator_RUM: Enum_OpenGadgets;
            export const M136AT4: Enum_OpenGadgets;
            export const MortarStrike: Enum_OpenGadgets;
            export const RPG7_RUM: Enum_OpenGadgets;
        }

        export namespace PlayerDeathTypes {
            export const Debris: Enum_PlayerDeathTypes;
            export const Deserting: Enum_PlayerDeathTypes;
            export const Drowning: Enum_PlayerDeathTypes;
            export const Explosion: Enum_PlayerDeathTypes;
            export const Fall: Enum_PlayerDeathTypes;
            export const Fire: Enum_PlayerDeathTypes;
            export const Gas: Enum_PlayerDeathTypes;
            export const Headshot: Enum_PlayerDeathTypes;
            export const Melee: Enum_PlayerDeathTypes;
            export const Penetration: Enum_PlayerDeathTypes;
            export const Redeploy: Enum_PlayerDeathTypes;
            export const Roadkill: Enum_PlayerDeathTypes;
            export const Weapon: Enum_PlayerDeathTypes;
        }

        export namespace PrimaryWeaponsBF3 {
            export const A_91: Enum_PrimaryWeapons;
            export const ACW_R: Enum_PrimaryWeapons;
            export const AKS_74u_ALX: Enum_PrimaryWeapons;
            export const AN94_ALX: Enum_PrimaryWeapons;
            export const ASVal: Enum_PrimaryWeapons;
            export const DAO_12: Enum_PrimaryWeapons;
            export const G3A3: Enum_PrimaryWeapons;
            export const M16A3: Enum_PrimaryWeapons;
            export const M240B: Enum_PrimaryWeapons;
            export const M39EMR: Enum_PrimaryWeapons;
            export const M416_ALX: Enum_PrimaryWeapons;
            export const M60E4: Enum_PrimaryWeapons;
            export const M98B: Enum_PrimaryWeapons;
            export const P90: Enum_PrimaryWeapons;
            export const PP2000_ALX: Enum_PrimaryWeapons;
            export const SCAR_H: Enum_PrimaryWeapons;
            export const SPAS12_ALX: Enum_PrimaryWeapons;
            export const SVD: Enum_PrimaryWeapons;
            export const Type88_ALX: Enum_PrimaryWeapons;
        }

        export namespace PrimaryWeaponsBF1942 {
            export const BAR1918: Enum_PrimaryWeapons;
            export const Bazooka: Enum_PrimaryWeapons;
            export const K98: Enum_PrimaryWeapons;
            export const K98_Sniper: Enum_PrimaryWeapons;
            export const LeeEnfieldNo4: Enum_PrimaryWeapons;
            export const M1_GRA: Enum_PrimaryWeapons;
            export const MP40: Enum_PrimaryWeapons;
            export const Panzerschreck: Enum_PrimaryWeapons;
            export const STG44: Enum_PrimaryWeapons;
            export const Thompson_GRA: Enum_PrimaryWeapons;
        }

        export namespace PrimaryWeaponsBF2042 {
            export const AC74: Enum_PrimaryWeapons;
            export const AK12: Enum_PrimaryWeapons;
            export const Chukavin: Enum_PrimaryWeapons;
            export const CobraR9: Enum_PrimaryWeapons;
            export const DDM4: Enum_PrimaryWeapons;
            export const DSR1: Enum_PrimaryWeapons;
            export const Keltec: Enum_PrimaryWeapons;
            export const KrissVector: Enum_PrimaryWeapons;
            export const LAMG: Enum_PrimaryWeapons;
            export const Marlin: Enum_PrimaryWeapons;
            export const MP9: Enum_PrimaryWeapons;
            export const NTW20: Enum_PrimaryWeapons;
            export const Pecheneg: Enum_PrimaryWeapons;
            export const PP_19_Bizon: Enum_PrimaryWeapons;
            export const Remington870: Enum_PrimaryWeapons;
            export const Saiga12: Enum_PrimaryWeapons;
            export const SCAR_MK17: Enum_PrimaryWeapons;
            export const SLX_Spear: Enum_PrimaryWeapons;
            export const SMG45: Enum_PrimaryWeapons;
            export const TRGM10: Enum_PrimaryWeapons;
            export const VSSVintorez: Enum_PrimaryWeapons;
        }

        export namespace PrimaryWeaponsBFBC2 {
            export const AKS_74u_RUM: Enum_PrimaryWeapons;
            export const AN94_RUM: Enum_PrimaryWeapons;
            export const G3: Enum_PrimaryWeapons;
            export const GOL: Enum_PrimaryWeapons;
            export const M1_RUM: Enum_PrimaryWeapons;
            export const M16A2: Enum_PrimaryWeapons;
            export const M24: Enum_PrimaryWeapons;
            export const M416_RUM: Enum_PrimaryWeapons;
            export const M60: Enum_PrimaryWeapons;
            export const PP2000_RUM: Enum_PrimaryWeapons;
            export const SPAS12_RUM: Enum_PrimaryWeapons;
            export const Thompson_RUM: Enum_PrimaryWeapons;
            export const Type88_RUM: Enum_PrimaryWeapons;
            export const XM8: Enum_PrimaryWeapons;
            export const XM8C: Enum_PrimaryWeapons;
            export const XM8L: Enum_PrimaryWeapons;
        }

        export namespace RestrictedInputs {
            export const CameraPitch: Enum_RestrictedInputs;
            export const CameraYaw: Enum_RestrictedInputs;
            export const Crouch: Enum_RestrictedInputs;
            export const CycleAbilityDown: Enum_RestrictedInputs;
            export const CycleAbilityUp: Enum_RestrictedInputs;
            export const CycleFire: Enum_RestrictedInputs;
            export const CyclePrimary: Enum_RestrictedInputs;
            export const CycleSecondary: Enum_RestrictedInputs;
            export const FireWeapon: Enum_RestrictedInputs;
            export const Interact: Enum_RestrictedInputs;
            export const Jump: Enum_RestrictedInputs;
            export const MoveForwardBack: Enum_RestrictedInputs;
            export const MoveLeftRight: Enum_RestrictedInputs;
            export const Prone: Enum_RestrictedInputs;
            export const Reload: Enum_RestrictedInputs;
            export const SelectCharacterGadget: Enum_RestrictedInputs;
            export const SelectMelee: Enum_RestrictedInputs;
            export const SelectOpenGadget: Enum_RestrictedInputs;
            export const SelectPrimary: Enum_RestrictedInputs;
            export const SelectSecondary: Enum_RestrictedInputs;
            export const SelectThrowable: Enum_RestrictedInputs;
            export const Sprint: Enum_RestrictedInputs;
            export const Zoom: Enum_RestrictedInputs;
        }

        export namespace ResupplyTypes {
            export const AmmoBox: Enum_ResupplyTypes;
            export const AmmoCrate: Enum_ResupplyTypes;
            export const SupplyBag: Enum_ResupplyTypes;
        }

        export namespace SecondaryWeaponsBF3 {
            export const M1911_ALX: Enum_SecondaryWeapons;
            export const M93R_ALX: Enum_SecondaryWeapons;
            export const MP412REX_ALX: Enum_SecondaryWeapons;
            export const MP443_ALX: Enum_SecondaryWeapons;
        }

        export namespace SecondaryWeaponsBF1942 {
            export const M1911_GRA: Enum_SecondaryWeapons;
            export const P38: Enum_SecondaryWeapons;
        }

        export namespace SecondaryWeaponsBF2042 {
            export const Glock17: Enum_SecondaryWeapons;
            export const MP17: Enum_SecondaryWeapons;
            export const Taurus: Enum_SecondaryWeapons;
        }

        export namespace SecondaryWeaponsBFBC2 {
            export const M1911_RUM: Enum_SecondaryWeapons;
            export const M93R_RUM: Enum_SecondaryWeapons;
            export const MP412REX_RUM: Enum_SecondaryWeapons;
            export const MP443_RUM: Enum_SecondaryWeapons;
            export const TracerDart: Enum_SecondaryWeapons;
        }

        export namespace SoldierStateBool {
            export const IsAISoldier: Enum_SoldierStateBool;
            export const IsAlive: Enum_SoldierStateBool;
            export const IsBeingRevived: Enum_SoldierStateBool;
            export const IsCrouching: Enum_SoldierStateBool;
            export const IsDead: Enum_SoldierStateBool;
            export const IsFiring: Enum_SoldierStateBool;
            export const IsInAir: Enum_SoldierStateBool;
            export const IsInteracting: Enum_SoldierStateBool;
            export const IsInVehicle: Enum_SoldierStateBool;
            export const IsInWater: Enum_SoldierStateBool;
            export const IsJumping: Enum_SoldierStateBool;
            export const IsManDown: Enum_SoldierStateBool;
            export const IsOnGround: Enum_SoldierStateBool;
            export const IsParachuting: Enum_SoldierStateBool;
            export const IsProne: Enum_SoldierStateBool;
            export const IsReloading: Enum_SoldierStateBool;
            export const IsReviving: Enum_SoldierStateBool;
            export const IsSprinting: Enum_SoldierStateBool;
            export const IsStanding: Enum_SoldierStateBool;
            export const IsVaulting: Enum_SoldierStateBool;
            export const IsZooming: Enum_SoldierStateBool;
        }

        export namespace SoldierStateNumber {
            export const CurrentHealth: Enum_SoldierStateNumber;
            export const CurrentWeaponAmmo: Enum_SoldierStateNumber;
            export const CurrentWeaponMagazineAmmo: Enum_SoldierStateNumber;
            export const MaxHealth: Enum_SoldierStateNumber;
            export const NormalizedHealth: Enum_SoldierStateNumber;
            export const Speed: Enum_SoldierStateNumber;
        }

        export namespace SoldierStateVector {
            export const EyePosition: Enum_SoldierStateVector;
            export const GetFacingDirection: Enum_SoldierStateVector;
            export const GetLinearVelocity: Enum_SoldierStateVector;
            export const GetPosition: Enum_SoldierStateVector;
        }

        export namespace Stationary {
            export const _40MM_Bofors: Enum_Vehicles;
            export const Centurion_CRAM: Enum_Vehicles;
            export const Flak38: Enum_Vehicles;
            export const KORD: Enum_Vehicles;
            export const Kornet: Enum_Vehicles;
            export const M2_Browning: Enum_Vehicles;
            export const M220_TOW: Enum_Vehicles;
            export const MG42: Enum_Vehicles;
            export const Pantsir_S1: Enum_Vehicles;
        }

        export namespace ThrowablesBF3 {
            export const M67: Enum_Throwables;
        }

        export namespace ThrowablesBF1942 {
            export const Dynamite: Enum_Throwables;
            export const FragGrenadeMkII: Enum_Throwables;
            export const StickGrenade: Enum_Throwables;
        }

        export namespace ThrowablesBF2042 {
            export const EMPGrenade: Enum_Throwables;
            export const FragGrenade: Enum_Throwables;
            export const IncendiaryGrenade: Enum_Throwables;
            export const MotionMine: Enum_Throwables;
            export const SmokeGrenade: Enum_Throwables;
        }

        export namespace ThrowablesBFBC2 {
            export const FragGrenade_RUM: Enum_Throwables;
        }

        export namespace VehicleStateVector {
            export const FacingDirection: Enum_VehicleStateVector;
            export const LinearVelocity: Enum_VehicleStateVector;
            export const VehiclePosition: Enum_VehicleStateVector;
        }

        export namespace VehicleTypes {
            export const Airplane: Enum_VehicleTypes;
            export const Heavy: Enum_VehicleTypes;
            export const Helicopter: Enum_VehicleTypes;
            export const Light: Enum_VehicleTypes;
            export const Medium: Enum_VehicleTypes;
            export const Stationary: Enum_VehicleTypes;
        }
    }
}
