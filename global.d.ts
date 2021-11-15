declare global {

    namespace cc {
        export interface Node {
            // node active change to true
            onenter: Function,
            // node active change to false
            onleave: Function,

            PathChild: Function,
            EachChild: Function,
        }

        export interface Color {
            VIOLET: cc.Color,
        }
    }
}