import { Frame, Observable } from "@nativescript/core";

export class HomeViewModel extends Observable {
    constructor() {
        super();
    }

    register(){
        const name = this.get('name');
        Frame.topmost().navigate({
            animated:true,
            moduleName: 'game/main-scene',
            context: {
                name
            }
        });
    }
}
