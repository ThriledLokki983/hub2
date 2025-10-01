import * as React from "react";
import Notification, { NotificationProps } from "./Notification";

export interface NoticeProps extends NotificationProps {
    showNotice?: boolean;
}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
    (props, ref) => {
        const notificationProps = {
            showNotice: true,
            ...props
        }
        return (
            <Notification {...notificationProps}></Notification>
        )
    })


export default Notice;