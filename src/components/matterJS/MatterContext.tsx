import React, { createContext, useContext, useRef } from 'react';



export type GameContextType = {

};

export const MatterContext = createContext<GameContextType | null>(null);

export function MatterContextProvider({ children }: { children: React.ReactNode }) {
    const matterRef = useRef<GameContextType | null>(null);
    return (
        <MatterContext.Provider value={{ matterRef}}>
            {children}
        </MatterContext.Provider>
    );
}

export const useMatterContext = () => {
    const context = useContext(MatterContext);
    if (!context) {
        throw new Error('useMatterContext must be used within a MatterContextProvider');
    }

    return context;
}