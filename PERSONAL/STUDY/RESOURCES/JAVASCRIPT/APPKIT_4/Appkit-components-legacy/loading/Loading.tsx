import * as React from 'react';
import ClassNames from 'classnames';

interface ILoadingProps {
    loadingType?: 'linear' | 'circular',
    indeterminate?: boolean,
    compact?: boolean,
    loadingId?: string,
    stopPercent?: any,
    className?: string,
    style?: React.CSSProperties,
    linearWidth?: string,
    circularWidth?: string
};

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement>,
    ILoadingProps { }

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, ref) => {
    const {
        loadingType = 'linear',
        indeterminate = false,
        compact = false,
        className,
        style,
        loadingId,
        linearWidth = '148px',
        stopPercent = 75,
        circularWidth = "24px",
    } = props;

    const [animation, setAnimation] = React.useState(false);
    const loadingRef: any = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        if (loadingType === 'linear') {
            loadingRef.current.style.width = linearWidth;
            loadingRef.current.style.setProperty("--linearLoadingWidth", linearWidth);
        }
        if (loadingType === 'circular') {
            const calcDeg: string = stopPercent * 1.8 + 'deg';
            const circleNode: any = loadingRef.current.childNodes[0];
            const oneBar = circleNode.querySelector('.ap-circular-full');
            oneBar.style.transform = `rotate(${calcDeg})`;
            const secBar = circleNode.querySelectorAll('.progress-bar');
            secBar[0].style.transform = `rotate(${calcDeg})`;
            secBar[1].style.transform = `rotate(${calcDeg})`;
            let DefValue = parseInt(circularWidth.split('px')[0]);
            let compactValue = DefValue / 1.5 + 'px';
            loadingRef.current.style.setProperty("--rotateDegree", calcDeg);
            loadingRef.current.style.setProperty("--circularLoadingWidth", circularWidth);
            loadingRef.current.style.setProperty("--circularLoadingCompactWidth", compactValue);
        }
        startStopAnimation();
    }, [])

    const startStopAnimation = () => {
        setAnimation(true);
    }

    const loadingClasses: string = ClassNames("ap-loading", className);
    const linearClasses: string = ClassNames("ap-loading-linear", {
        'bounces': indeterminate && animation,
        'compact': compact,
    });
    const circularClasses: string = ClassNames("ap-loading-circular", {
        'animation': indeterminate,
        'compact': compact,
        'loading': animation
    });
    return <div ref={ref}>
        <div ref={loadingRef} className={loadingClasses} id={loadingId} style={style}>
            {
                loadingType === 'linear' && <div className={linearClasses}>
                    <div className="linear-bar-inner"></div>
                    <div className="linear-bar-bg"></div>
                </div>
            }
            {
                loadingType === 'circular' && <div className={circularClasses} >
                    <div className="circle">
                        <div className="mask ap-circular-full">
                            <div className="progress-bar"></div>
                        </div>
                        <div className="mask ap-circular-half">
                            <div className="progress-bar"></div>
                        </div>
                        <div className="inside-circle"></div>
                    </div>
                </div>
            }

        </div>
    </div>
})

export default Loading;