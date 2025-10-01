import React from 'react';
import { StaticModal as Modal } from './Modal';
// import Button from '../Button/Button';
import { Button } from '../AppkitButton';
import { ReactDOMType } from '../../../util/helpers';

interface IModalProps {
    content?: string | React.ReactNode,
    okText?: string,
    cancelText?: string,
    closable?: boolean,
    cancelshow?: boolean,
    okshow?: boolean,
    visible?: boolean,
    maskCloseable?: boolean,
    onNo?: Function,
    onOk?: Function,
    title?: string,
    wrapperStyle?: React.CSSProperties;
    wrapperClassName?: string;
    children?: React.ReactNode,
    footer?: React.ReactNode,
    zIndex?: number,
    onOpen?: Function,
    onClose?: Function
    backdropStyle?: object,
    placement?: string,
    confirm?: Function,
    appModalId?: string,
    closeOnPressEscape?: boolean,
    header?: React.ReactNode;
    icons?: React.ReactNode;
    ariaCloseIconLabel?: string;
    bodyStyle?: React.CSSProperties;
    modalStyle?: React.CSSProperties;
    footerStyle?: React.CSSProperties;
    cnode?: any
}

export interface ModalConfirmProps extends React.HTMLAttributes<HTMLDivElement>,
    IModalProps { }

export const ModalRender = (props: ModalConfirmProps) => {
    const {
        content,
        onOk,
        okText = 'OK',
        cancelText = 'Cancel',
        closable = true,
        cancelshow = true,
        okshow = true,
        modalStyle = { width: '33.75rem' },
        cnode,
        footerStyle,
        ...otherProps
    } = props;

    const [visible, setvisible] = React.useState(false);

    const destroy = () => {
        setvisible(false);
        setTimeout(() => {
            // eslint-disable-next-line no-unused-expressions
            document.body && document.body.removeChild(cnode);
        }, 500);
    };

    React.useEffect(() => {
        setTimeout(() => {
            setvisible(true);
        }, 100);
    }, []);

    const close = () => {
        if (props.onNo) {
            // eslint-disable-next-line no-unused-expressions
            !props.onNo(props) && destroy();
            return;
        }
        destroy();
    };

    const ok = () => {
        if (props.onOk) {
            // eslint-disable-next-line no-unused-expressions
            !props.onOk(props) && destroy();
            return;
        }
        destroy();
    };

    const footerCont = (cancelshow || okshow) && (
        <>
            {cancelshow && <Button kind="secondary" onClick={() => { close(); }}>{cancelText}</Button>}
            {okshow && <Button onClick={() => { ok(); }}>{okText}</Button>}
        </>
    );

    return (
        <Modal
            onCancel={() => { close(); }}
            footer={footerCont}
            closable={closable}
            visible={visible}
            modalStyle={modalStyle}
            footerStyle={footerStyle}
            {...otherProps}
        >
            {content}
        </Modal>
    );
};

export const confirm = (props: ModalConfirmProps) => {
    const cnode: HTMLDivElement = document.createElement('div');
    // eslint-disable-next-line no-unused-expressions
    document.body && document.body.appendChild(cnode);
    // const renderDom = createRoot(cnode);
    const render = () => {
        // ReactDOM.render(<ModalRender cnode={cnode} {...props} />, cnode)
        ReactDOMType(cnode, <ModalRender cnode={cnode} {...props} />);
    };

    const update = (curProps: ModalConfirmProps) => {
        props = {
            ...props,
            ...curProps,
        };
        render();
    };

    render();

    return {
        update,
    };
};
