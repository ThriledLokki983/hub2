import React from 'react';
import { Modal, ModalHeader, ModalBody } from '../Vendor/Modal';
import { Badge } from '../Vendor/AppBadge'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ProjectTabs from '../HeaderTabs/ProjectTabs';
import { openWarnings } from '../../store/resources/activeProject';
import { HeaderState, HeaderProps } from '../../util/interfaces';
import { MAIN_PAGE } from '../../configs/config';
import Button from '../Button/Button';
import './Header.css';

const mapState = (state: StoreState, props: HeaderProps): HeaderProps => ({
    ...props,
    warnings: state.activeProject.activeProject?.warnings,
});

const osVersionMac = /Mac/.test(window.navigator.userAgent);
/**
 * This function returns 'Ctrl' or 'Command' depending on the OS.
 * @returns 'Ctrl' or 'Command' string.
 */
function renderCorrectSelHelp() {
    if (osVersionMac) return 'Command (⌘)';
    return 'Ctrl';
}

/**
 * Dispatches action to open the warning modal
 */
const openWarningsUpdate = () => {
    window.store.dispatch(openWarnings(true));
};

/**
 * @class Renders the header in the main page.
 */
class DoctHeader extends React.Component<HeaderProps, HeaderState> {
    /**
     * Constructor
     * @param {*} props
     */
    constructor(props: HeaderProps) {
        super(props);

        this.state = {
            visible: false,
            redirect: false,
        };
    }

    /**
     * This method renders a header of the main page.
     * @returns A header of the main page.
     */
    render = () => {
        const showWarningSymbol = this.props.warnings && this.props.warnings.length > 0;

        return (
            <div className="header">
                <nav className={'a-header-wrapper header__nav'}>
                    <div className="a-brand-container">
                        <a href={MAIN_PAGE} className="a-pwc-logo-grid header__brand" />
                        <div className="a-divider" />
                        <span className="font-weight-medium text-nowrap">Dynamic Organisational Chart Tool</span>
                        <div className="a-divider-full" />
                    </div>
                    <ProjectTabs />
                    <div className="a-actions-container">
                        <div className="a-divider-full" />
                        {showWarningSymbol
                        && <button onClick={openWarningsUpdate} className="a-icon-container
                        d-none d-sm-flex a-btn-background-transparent">
                            <span className="Appkit4-icon icon-alert-outline"/>
                        </button>
                        }
                        <button onClick={this.handleClick()} className="a-icon-container
                        d-none d-sm-flex a-btn-background-transparent">
                            <span className="Appkit4-icon icon-help-question-outline" />
                        </button>
                    </div>
                    <div>
                        <Button
                            type='button'
                            variation="primary"
                            size="small"
                            url={MAIN_PAGE}
                            disabled={false}
                            onClick={this.setRedirect}
                        >
                        Home
                        </Button>
                        {this.goBack()}
                    </div>
                </nav>
                <Modal
                    className="form-modal"
                    visible={this.state.visible}
                    onCancel={this.closeModal()}
                >
                    <ModalHeader>
                        <div className="a-modal-example-header">
                            <div className="modal-title-left">
                                <Badge className="example-badge" type={'success'}>
                                    <span>HELP</span>
                                </Badge>
                            </div>
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <ul>
                                <li>Left mouse click + node : Selecting the node.</li>
                                <li>
                                    Left mouse click + node + {renderCorrectSelHelp()} key:
                                    Selecting multiple nodes.
                                </li>
                                <li>Selected node(s) + h key: Hiding the children of
                                selected node(s), but not the node itself</li>
                                <li>Selected node(s) + p key: Hiding the selected node(s) and its children.</li>
                                <li>Selected node(s) + u key: Unhiding the selected node(s).</li>
                                <li>Selected node(s) + m key: Minimizing the selected node(s).</li>
                                <li>Selected node(s) + w key: Maximizing the selected minimized node(s).</li>
                                <li>Selected node(s) + / key: (Un)Hiding the incoming edges of the selected node(s).
                                </li>
                                <li>
                                    Press t key: (1) remove emphasis, (2) add emphasis on the edges,
                                    (3) add emphasis on the relationship.
                                </li>
                                <li>
                                    Press ctrl + z: Undo previous action.
                                </li>
                                <li>
                                    Click on an edge to change the style of the
                                    incoming edges of all the selected node(s).
                             There are 3 edge styles.
                                </li>
                            </ul>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    };

    /**
     * This method sets redirect to true.
     */
    setRedirect = () => {
        this.setState({
            redirect: true,
        });
    };

    /**
     * This method redirects to the project page when called.
     */
    goBack = () => {
        if (this.state.redirect) {
            window.location.href = '/';
        }

        return undefined;
    };

    /**
     * This method handles the click of question button.
     */
    handleClick = () => () => {
        this.setModal(true);
    };

    /**
     * This method sets the state of the modal.
     * @param state If true - the modal is visible,
     * otherwise - hidden.
     */
    setModal = (state: boolean) => {
        this.setState({
            visible: state,
        });
    };

    /**
     * This method calls the setModal function when yes/no/x is pressed in the modal.
     */
    closeModal = () => () => {
        this.setModal(false);
    };
}

export default connect(mapState)(DoctHeader);
