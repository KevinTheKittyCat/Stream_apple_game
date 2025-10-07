import { usePortalStore } from "@/stores/PortalState";
import { useEffect, useRef } from "react";
import { FPSCounter } from "./Utils/FPSCounter";

// MAKE THIS INTO THEME LATER
export default function UIWrapper({children}: {children?: React.ReactNode}) {
    const {setPortalRef} = usePortalStore();
    const portalDivRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        setPortalRef(portalDivRef);
    }, [portalDivRef]);
    

    return (
        <div className="main-ui" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '0.5em',
        }}>
            <div className="main-ui-inner" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div className="portal-ui" style={{}} ref={portalDivRef} />
                <FPSCounter />
                {children}
            </div>
        </div>
    );
}