import React from 'react';
import { mount } from 'enzyme';
import { Badge } from '../index';

describe('Badge', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be warning', () => {
        const wrapper = mount(<Badge type="warning" />);
        expect(wrapper.find('.ap-badge-warning').length).toBe(1);
    });
    it('should be primary', () => {
        const wrapper = mount(<Badge type="primary" value='567' role='button' />);
        expect(wrapper.find('.ap-badge').length).toBe(1);
        wrapper.find('.ap-badge').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-badge').first().simulate('keydown', { key: 'Space', preventDefault() { } });
    });
    it('should be primary2', () => {
        const onClick = jest.fn();
        const wrapper = mount(<Badge type="primary" value='我们' role='link' onClick={onClick} />);
        expect(wrapper.find('.ap-badge').length).toBe(1);
        wrapper.find('.ap-badge').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-badge').first().simulate('keydown', { key: 'Space', preventDefault() { } });
    });
})