import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import UploadModal from '../UploadModal/UploadModal';
import { Modal } from '@appkit4/react-components/modal';
import { Badge } from '@appkit4/react-components/badge';
import { DropdownButton } from '../Vendor/Dropdown';
import { Header, HeaderOptionItem } from '../Vendor/Header'
import { List, ListItem } from '../Vendor/AppList';
import useUserApi from '../../hooks/api/useUserApi';
import ProjectTabs from '../HeaderTabs/ProjectTabs';
import { openWarnings } from '../../store/resources/activeProject';
import { LOGOUT_URL } from '../../configs/config';
import './Header.scss';

function renderCorrectSelHelp() {
    if (/Mac/.test(window.navigator.userAgent)) return 'Command (⌘)';
    return 'Ctrl';
}

const mapState = (state: any, props: any) => ({
    ...props,
    warnings: state.activeProject.activeProject?.warnings,
});

const openWarningsUpdate = () => {
    window.store.dispatch(openWarnings(true));
};

interface Props {
    warnings?: any;
}

const AppHeader = (props: any) => {
    const location = useLocation();
    const [visible, setVisible] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const { data: user } = useUserApi();

    const isProjectDetailsPage = location.pathname.includes('projects');
    const showWarningSymbol = props.warnings && props.warnings.length > 0;

    const handleCLick = () => {
        setVisible(true);
    }

    return (
        <Header
            className='custom-shadow'
            type="solid"
            subTitleTemplate={() => "Dynamic Organisational Chart Tool"}
            viewTabs={() => {
                     return props.warnings ? (
                         <ProjectTabs />
                    ) : null;
            }}
            optionsTemplate={() => {
                return <>
                    { showWarningSymbol || isProjectDetailsPage ? (
                        <>
                            <HeaderOptionItem iconName="notification-outline" label="Info" onClick={openWarningsUpdate}></HeaderOptionItem>
                            <HeaderOptionItem iconName="help-question-outline" label="Support" onClick={handleCLick}></HeaderOptionItem>
                            <Modal
                                visible={visible}
                                title={"Keyboard Combinations"}
                                onCancel={() => setVisible(false)}
                                modalStyle={{ width: '45rem', marginTop: '40px', maxHeight: '45rem' }}
                                footerStyle={{ 'paddingTop': '8px', 'marginTop': '-8px', 'minHeight': '64px' }}
                                bodyStyle={{ minHeight: '70px' }}
                                header={<Badge type="primary-outlined" value="Help" size='sm'></Badge>}
                            >
                                <KeyBindingInfo/>
                            </Modal>
                        </>
                    ) : null }
                </>;
            }}
            userTemplate={() => (
                <div className='group'>
                    { !showWarningSymbol && !isProjectDetailsPage ? (<UploadModal multiple={false} style={{}} className="header__upload-modal" />) : null }
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <DropdownButton
                            customTriggerNode={true}
                            customTriggerClassName="custom-node"
                            avatarInitials={getInitials(user)}
                            data={[
                                { value: 'user', label: getFullName(user), iconName: 'person-outline' },
                                { value: 'logouts', label: 'Logout' , iconName: 'lockclosed-locked-outline', url: LOGOUT_URL }
                            ]}
                            prefixTemplate={(item)=><span className={`Appkit4-icon icon-${item.iconName}`}></span>}
                        />
                    </div>
                </div>
            )}
        >
        </Header>
    );
}
export default connect(mapState)(AppHeader);

function KeyBindingInfo() {
    const data = [
        {
            id: "1",
            primary: "Selecting the node",
            description: "Left mouse click + node.",
        },
        {
            id: "2",
            primary: "Selecting multiple nodes",
            description: `Left mouse click + node + ${renderCorrectSelHelp()} key`,
        },
        {
            id: "3",
            primary: "Hiding the children of selected node(s), but not the node itself",
            description: "Selected node(s) + h key",
        },
        {
            id: "4",
            primary: "Hiding the selected node(s) and its children",
            description: "Selected node(s) + p key",
        },
        {
            id: "5",
            primary: "Unhide the selected node(s)",
            description: "Selected node(s) + u key",
        },
        {
            id: "6",
            primary: "Minimizing the selected node(s)",
            description: "Selected node(s) + m key",
        },
        {
            id: "7",
            primary: "Maximizing the selected minimized node(s)",
            description: "Selected node(s) + w key",
        },
        {
            id: "8",
            primary: "UnHide the incoming edges of the selected node(s)",
            description: "Selected node(s) + / key",
        },
        {
            id: "9",
            primary: "Press t key",
            description: "1. Remove emphasis, 2. Add emphasis on the edges, 3. Add emphasis on the relationship",
        },
        {
            id: "10",
            primary: "Undo previous action",
            description: "Press ctrl + z",
        },
        {
            id: "11",
            primary: "Change node styles",
            description: "Click on an edge to change the style of the incoming edges of all the selected node(s). There are 3 edge styles",
        },
    ];

    const [selectedId, setSelectedId] = React.useState("");
    const handleKeyDown = (event: React.KeyboardEvent, item: any) => {
        if (event.key === 'Enter') {
            setSelectedId(item.id);
        }
    }

    const renderItem = (item: any, index: number) => {
        const classes = ClassNames({ selected: item.id === selectedId })
        return (
            <ListItem
                key={index}
                title={item.primary}
                description={item.description}
                aria-selected={item.id === selectedId}
                className={classes}
                onClick={() => { setSelectedId(item.id) }}
                onKeyDown={(e) => { handleKeyDown(e, item) }}>
            </ListItem>
        )
    }
    return (<div className="sample11"><List itemKey='id' bordered={false} data={data} renderItem={renderItem} width={674} style={{ display: 'inline-block' }} /></div>)
}

function userExist(user: any) {
    if (user === null) return false;
    return user || user.username;
}

function getInitials(user: any) {
    if (!userExist(user)) return '';

    return user && (user.first_name.slice(0, 1).toUpperCase() ?? '') + (user.last_name.slice(0, 1).toUpperCase() ?? '');
}

function getFullName(user: any) {
    if (!userExist(user)) return '';

    const firstName = user.first_name ?? '';
    const lastName = user.last_name ?? '';

    return user && `${firstName} ${lastName}`;
}
