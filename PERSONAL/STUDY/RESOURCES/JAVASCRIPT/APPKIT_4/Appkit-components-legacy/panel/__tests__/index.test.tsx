import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Panel } from '../index';
import { Tabs, Tab } from '../../tabs'
import { Button } from '../../button';
describe('Panel', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('render Panel baseline', () => {
        const extraNode = (
            <div className='ap-extra-template-container' style={{ display: 'flex' }}>
                <Tabs type="filled">
                    <Tab icon="icon-grid-view-outline"></Tab>
                    <Tab icon="icon-menu-outline"></Tab>
                </Tabs>
                <button type="button" aria-label="Close" className="ap-modal-header-icon ap-modal-header-close">
                    <span className="Appkit4-icon icon-close-outline height ap-font-medium"></span>
                </button>
            </div>
        );

        const footer = (
            <Button kind='primary'>Lorem</Button>
        );
        const wrapper = mount(

            <Panel title="Lorem ipsum dolor sit" extra={extraNode} footer={footer}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedos eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
            </Panel>
        );
        expect(toJson(wrapper)).toMatchSnapshot();


    });



})
