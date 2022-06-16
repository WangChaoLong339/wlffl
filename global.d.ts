import { ut } from "../assets/script/util";

declare global {

    var ut: ut

    namespace cc {
        export interface Node {
            // node active change to true
            onenter: Function,
            // node active change to false
            onleave: Function,

            PathChild(path: string, type?: any): cc.Node

            val: any,
            idx: number
        }

        export interface Color {
            VIOLET: cc.Color,
        }
    }

    interface Date {
        Format(mask: string, utc?: boolean, gmt?: boolean): string
    }
}