import EventEmitter from 'eventemitter3';
export class Canceler extends EventEmitter{


    constructor() {
        super();
    }

    cancel(key:string){
        this.emit('CallCancel',key);
    }
    cancelAll(){
        this.emit('CallCancelAll');
    }

}
