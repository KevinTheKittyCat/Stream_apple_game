import { useFPS } from "@/hooks/useFPSCounter";

export function FPSCounter() {
    const fps = useFPS();

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            padding: '4px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: fps < 30 ? 'red' : fps < 50 ? 'yellow' : 'green',
            fontFamily: 'monospace',
            fontSize: '14px',
            borderRadius: '4px',
            zIndex: 9999
        }}>
            FPS: {fps}
        </div>
    );
}