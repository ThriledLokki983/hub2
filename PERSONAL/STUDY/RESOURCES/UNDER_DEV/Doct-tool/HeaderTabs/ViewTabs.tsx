// import { Tabs, Tab } from '../../Vendor/AppTab';
// import { Button } from '../../Vendor/AppkitButton';
// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { generateUUID } from '../../../util/generateUUID';
// import { cloneView } from '../../../store/helpers/cloneView';
// import {
//     newTab,
//     removeTab,
//     selectActiveTab,
//     Tab as TabType,
//     SavedTab,
//     updateTabViewData,
// } from '../../../store/resources/viewTabs';
// import { CurrentView, getCurrentView } from '../../../store/selectors/getCurrentView';
// import './HeaderTabs.css';
//
// interface ViewTabsOwnProps {}
// interface ViewTabsMappedProps {
//     activeTab: number;
//     currentView?: CurrentView,
//     tabs: TabType[];
// }
//
// type ViewTabsAllProps = ViewTabsOwnProps & ViewTabsMappedProps;
//
// interface ViewTabsState {
//     justClosed: boolean;
// }
//
// /**
//  * This method changes the active tab.
//  * @param {number} v Index of the selected tab.
//  */
// const changeTab = (v: number) => {
//     window.store.dispatch(selectActiveTab(v));
// };
//
// /**
//  * This method stops propagation of event for use in onMouseDown on the inner close buttons
//  * in tabs.
//  */
// const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     e.stopPropagation();
// };
//
// /**
//  * This method closes a tab and updates the tab array.
//  * @param {number} index The index of a tab to be closed.
//  */
// const close = (index: number) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     e.stopPropagation();
//
//     window.store.dispatch(removeTab(index));
// };
//
// /**
//  * Selects the part of the data from the store that the connected component needs.
//  * @param state The store state of redux.
//  * @param props The props this component has received.
//  */
//
// type NewProps = {
//     projectName: string,
// } & ViewTabsAllProps;
//
// const mapState = (state: StoreState, props: ViewTabsOwnProps): NewProps => ({
//     ...props,
//     activeTab: state.viewTabs.active,
//     currentView: getCurrentView(state),
//     tabs: state.viewTabs.tabs,
//     projectName: state.activeProject.pName!,
// });
//
// /**
//  * @class Renders the view for the view tabs.
//  */
// export default connect(mapState)(class HeaderTabs extends Component<ViewTabsAllProps, ViewTabsState> {
//     private newTabIndex: number;
//
//     /**
//      * Constructor
//      * @param {*} props
//      */
//     constructor(props: ViewTabsAllProps) {
//         super(props);
//         this.newTabIndex = 1;
//         this.state = {
//             justClosed: false,
//         };
//     }
//
//     /**
//      * This method renders the view of the tabs container with an add button.
//      * @returns A rendered view of the tabs and an add button.
//      */
//     render = () =>
//         <div className="header-tab-bar customize-display-layout">
//             {this.renderTabs()}
//             <Button add icon="icon-plus-outline" onClick={this.addNewTab} compact>Label</Button>
//         </div>;
//
//     /**
//      * This method checks if the component has been updated.
//      * @param {ViewTabsAllProps} prevProps Previous properties of the component.
//      */
//     componentDidUpdate = (prevProps: ViewTabsAllProps) => {
//         if (this.props.tabs !== prevProps.tabs) {
//             this.setState({
//                 justClosed: true,
//             });
//
//             // Fixes an issue where the tabs would not scale properly when one was closed
//             setTimeout(() => {
//                 this.setState({
//                     justClosed: false,
//                 });
//             }, 0);
//         }
//     };
//
//     /**
//      * This method adds a new tab to the tab array.
//      */
//     addNewTab = () => {
//         this.newTabIndex += 1;
//         const activeTab = `Untitled view ${this.newTabIndex}`;
//
//         if (this.props.currentView === undefined) {
//             throw new Error('Unexpected undefined currentView - This should never happen');
//         }
//
//         const newViewData = {
//             ...cloneView(this.props.currentView.view),
//             id: generateUUID(),
//         };
//
//         window.store.dispatch(newTab({
//             title: activeTab,
//             hasNewNodes: false,
//             view: newViewData,
//             emphasisToggle: 'hierarchy',
//         }));
//     };
//
//     /**
//      * This method renders the view of the tabs.
//      * @returns A rendered view of the tabs.
//      */
//     renderTabs = () => {
//         let disabled = false;
//         if (this.props.tabs.length < 2) {
//             disabled = true;
//         }
//
//         return (
//             <Tabs
//                 // label={this.props.activeTab}
//                 onTabChange={(i: number) => {
//                     changeTab(i);
//                 }}
//                 type="underline"
//             >
//                 {this.props.tabs.map((t: TabType, i: number) => (
//                     <Tab
//                         key={i}
//                         label={
//                             <div className="header-tab-content">
//                                 <span
//                                     className={
//                                         (t as SavedTab).saved !== undefined
//                                             ? 'header-tab-saved'
//                                             : 'header-tab-unsaved'
//                                     }
//                                 >
//                                     {t.title}
//                                 </span>
//                                 <Button
//                                     kind='text'
//                                     onClick={close(i) as any}
//                                     onMouseDown={stopPropagation as any}
//                                     disabled={disabled}
//                                 >
//                                     <span className="Appkit4-icon icon-close-fill"></span>
//                                 </Button>
//                             </div>
//                         }
//                     />
//                 ))}
//             </Tabs>
//         );
//     };
// });

export {};
