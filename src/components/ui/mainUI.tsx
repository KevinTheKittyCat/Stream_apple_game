import OptionMenu from "./Menu/OptionMenu";
import ApplesCounter from "./Score/ApplesCounter";
import Score from "./Score/Score";
import Timer from "./Score/Timer";





export default function MainUi() {
    return (
        <div className="main-ui" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
        }}>
            <OptionMenu/>
            <Score />
            <ApplesCounter />
            <Timer/>
        </div>
    );
}