
export interface Listener {
    name: string;
    callback: Function;
}

export interface EventMap {
    [event: string]: any;
}

export type TransitionEvent = {
    dir: 'in' | 'out';
    ready?: boolean;
}

export type ChangeRouteEvent = {
    route: string;
    data?: Record<string, any>;
}


export type EmitFunction<T extends keyof EventMap> = (eventName: T, data: EventMap[T]) => void;
export type EventType<T extends keyof EventMap> = (data: EventMap[T]) => void;
export type EventEmitterData = TransitionEvent | ChangeRouteEvent;


export class EventEmitter {
    listeners: Listener[] = [];

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
        this.listeners.length = 0;
    }
}

export const eventEmitter = new EventEmitter();