import React from 'react';
import { mount } from 'enzyme';
import { Progress } from '../index';
import toJson from 'enzyme-to-json';

describe('Progress', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('render with activeIndex 1', () => {
        const onActiveIndexChange = jest.fn();
        const wrapper = mount(
            <Progress
                activeIndex={2}
                onActiveIndexChange={onActiveIndexChange}
                steps={['Start', 'Mid', 'End']}
                space={120}
                orientation="horizontal"
                readonly={false}>
            </Progress>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-progress-mark-text').first().simulate('click');
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowRight', preventDefault() { } });
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowLeft', preventDefault() { } });
    });

    it('render with activeIndex 0', () => {
        const onActiveIndexChange = jest.fn();
        const wrapper = mount(
            <Progress
                activeIndex={0}
                onActiveIndexChange={onActiveIndexChange}
                steps={['Start', 'Mid', 'End']}
                space={120}
                orientation="horizontal"
                readonly={false}>
            </Progress>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-progress-mark-text').first().simulate('click');
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowRight', preventDefault() { } });
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowLeft', preventDefault() { } });
    });

    it('render with readonly', () => {
        const onActiveIndexChange = jest.fn();
        const wrapper = mount(
            <Progress
                activeIndex={0}
                onActiveIndexChange={onActiveIndexChange}
                steps={['Start', 'Mid', 'End']}
                space={120}
                orientation="horizontal"
                readonly={true}>
            </Progress>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-progress-mark-text').first().simulate('click');
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowRight', preventDefault() { } });
        wrapper.find('.ap-progress-mark').first().simulate('keydown', { key: 'ArrowLeft', preventDefault() { } });
    });
})