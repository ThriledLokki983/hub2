import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Button, ButtonGroup } from '../index';
describe('Button', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('render Button baseline', () => {
        const onClick = jest.fn();
        const wrapper = mount(

            <>
                <Button kind="primary" loading isLoading={true}>Label</Button>
                <Button kind="secondary" onClick={onClick}>label</Button>
                <Button kind="tertiary">Label</Button>
                <Button kind="text">Label</Button>
                <Button kind="negative">Label</Button>
                <Button kind='secondary' compact icon="icon-time-outline">Label</Button>
            </>
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-button').first().simulate('click');
        wrapper.find('.ap-button').first().simulate('blur');
        wrapper.find('.ap-button').first().simulate('keydown', { key: 'Tab', preventDefault() { } });
        wrapper.find('.ap-button').first().simulate('mouseDown');

    });

    it('render ButtonGroup baseline', () => {
        const onClick = jest.fn();
        const wrapper = mount(

            <>
                <ButtonGroup className='ap-group-buttons ap-menu-buttons'>

                </ButtonGroup>
            </>
        );
        expect(toJson(wrapper)).toMatchSnapshot();

    });


})
