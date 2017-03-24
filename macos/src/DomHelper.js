const listeners = {};

export default {
    on(evt,index) {
        const callback = listeners["index"+index];
        if(callback) {
            callback(evt);
        }
    },
    listen(callback, index) {
        if(listeners["index"+index]) delete listeners["index"+index];
        listeners["index"+index] = callback;
    },
    remove(index) {
        delete listeners["index"+index];
    }
}