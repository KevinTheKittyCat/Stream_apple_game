export class EventEmitter {
    listeners = [];

    emit(eventName: string, data: any) {
        this.listeners
            .filter(({ name }) => name === eventName)
            .forEach(
                ({ callback }) => queueMicrotask(
                    () => callback.apply(this, Array.isArray(data) ? [...data] : [data])
                )
            );
        this.listeners
            .filter(({ name }) => name === '*' || name === 'all')
            .forEach(
                ({ callback }) => queueMicrotask(
                    () => callback.apply(this, Array.isArray(data) ? [...data] : [data])
                )
            );
    }
    on(name: string, callback: Function) {
        if (
            typeof callback === 'function'
            && typeof name === 'string'
        ) {
            this.listeners.push({ name, callback });
        }
    }
    off(eventName: string, callback: Function) {
        this.listeners = this.listeners.filter(
            listener => !(listener.name === eventName &&
                listener.callback === callback)
        );
    }
    destroy() {
        this.listener.length = 0;
    }
}

export const eventEmitter = new EventEmitter();