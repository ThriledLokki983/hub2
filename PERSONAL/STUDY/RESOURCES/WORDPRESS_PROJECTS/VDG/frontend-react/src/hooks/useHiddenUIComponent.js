import { useState, useCallback /*, useEffect */ } from 'react';

const useHiddenUIComponent = (onShow = () => void 0, onHide = () => void 0, initializeVisible = false) => {

    const [hidden, setHidden] = useState(!initializeVisible);
    const [visible, setVisible] = useState(initializeVisible);

    const open = useCallback((delay = false) => {
        setHidden(false);
        if (delay) {
            setTimeout(() => {
                setVisible(true);
                onShow();
            }, 0);
        } else {
            setVisible(true);
            onShow();
        }
    }, [onShow]);

    const close = useCallback(() => {
        setVisible((c) => c ? false : c);
    }, []);

    const hide = useCallback(() => {
        if (!visible) {
            onHide();
            setHidden(true);
        }
    }, [onHide, visible]);


    return {
        open,
        close,
        hide,
        hidden,
        visible,
    };
};

export default useHiddenUIComponent;
