import { Tabs, Tab } from '../Vendor/AppTab';
import { Button } from '../Vendor/AppkitButton';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { generateUUID } from '../../util/generateUUID';
import { cloneView } from '../../store/helpers/cloneView';
import {
    newTab,
    removeTab,
    selectActiveTab,
    Tab as TabType,
    SavedTab,
    updateTabViewData,
} from '../../store/resources/viewTabs';
import { CurrentView, getCurrentView } from '../../store/selectors/getCurrentView';
import './ViewTabs.css';

interface ViewTabsOwnProps {}
interface ViewTabsMappedProps {
    activeTab: number;
    currentView?: CurrentView,
    tabs: TabType[];
}

type ViewTabsAllProps = ViewTabsOwnProps & ViewTabsMappedProps;

interface ViewTabsState {
    justClosed: boolean;
}

type NewProps = {
    projectName: string,
} & ViewTabsAllProps;

const mapState = (state: StoreState, props: ViewTabsOwnProps): NewProps => ({
    ...props,
    activeTab: state.viewTabs.active,
    currentView: getCurrentView(state),
    tabs: state.viewTabs.tabs,
    projectName: state.activeProject.pName!,
});

const changeTab = (v: any) => {
    window.store.dispatch(selectActiveTab(v));
};

const stopPropagation = (e: any) => {
    e.stopPropagation();
};

const close = (index: any) => (e: any) => {
    e.stopPropagation();
    window.store.dispatch(removeTab(index));
};

const ProjectTabs = (props: any) => {
    const [justClosed, setJustClosed] = useState(false);
    const [newTabIndex, setNewTabIndex] = useState(1);

    useEffect(() => {
        if (justClosed) {
            setTimeout(() => {
                setJustClosed(false);
            }, 0);
        }
    }, [props.tabs]);

    const addNewTab = () => {
        setNewTabIndex(newTabIndex + 1);
        const activeTab = `Untitled view ${newTabIndex + 1}`;

        if (props.currentView === undefined) {
            throw new Error('Unexpected undefined currentView - This should never happen');
        }

        const newViewData = {
            ...cloneView(props.currentView.view),
            id: generateUUID(),
        };

        window.store.dispatch(
            newTab({
                title: activeTab,
                hasNewNodes: false,
                view: newViewData,
                emphasisToggle: 'hierarchy',
            })
        );
    };

    const renderTabs = () => {
        let disabled = false;
        if (props.tabs.length < 2) {
            disabled = true;
        }

        return (
            <Tabs
                onTabChange={(i) => {
                    changeTab(i);
                }}
                type="underline"
            >
                {
                    props.tabs.map((t: TabType, i: number) => (
                        <Tab
                            key={i}
                            label={
                                <div className="header-tab-content">
                                <span
                                    className={
                                        (t as SavedTab).saved !== undefined
                                            ? 'header-tab-saved'
                                            : 'header-tab-unsaved'
                                    }
                                >
                                    {t.title}
                                </span>
                                    <Button
                                        kind='text'
                                        onClick={close(i) as any}
                                        onMouseDown={stopPropagation as any}
                                        disabled={disabled}
                                    >
                                        <span className="Appkit4-icon icon-close-fill"></span>
                                    </Button>
                                </div>
                            }
                        />
                    ))
                }
            </Tabs>
        );
    };

    return (
        <div className="header-tab-bar customize-display-layout">
            {renderTabs()}
            <Button add icon="icon-plus-outline" onClick={addNewTab} compact>
                Label
            </Button>
        </div>
    );

}

export default connect(mapState)(ProjectTabs);
