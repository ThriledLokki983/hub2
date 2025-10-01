import React from 'react';
import { mount } from 'enzyme';
import { Switch } from '../index';

describe('Switch', () => {

    function createSwitch(props = {}) {
        return mount(
            <Switch {...props} />,
        );
    }

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('Should be checked', () => {
        const instance = mount(<Switch checked />);
        expect(instance.find('.ap-switch-checked').length).toBe(1);
    });


    it('Should be disabled', () => {
        const instance = mount(<Switch disabled />);
        expect(instance.find('.ap-switch-disabled').length).toBe(1);
    });


    it('Should apply size class', () => {
        const instance = mount(<Switch size="lg" />);
        expect(instance.find('.ap-switch-lg').length).toBe(1);
    });

    it('should not toggle when clicked in a disabled state', () => {
        const onChange = jest.fn();
        const wrapper = createSwitch({ disabled: true, checked: true, onChange });
        wrapper.simulate('click');
        expect(onChange.mock.calls.length).toBe(0);
    });

    it('should support onClick', () => {
        const onChange = jest.fn();
        const wrapper = createSwitch({ onChange });
        wrapper.simulate('click');
        expect(onChange.mock.calls.length).toBe(1);
        wrapper.simulate('click');
        expect(onChange.mock.calls.length).toBe(2);
    });
})