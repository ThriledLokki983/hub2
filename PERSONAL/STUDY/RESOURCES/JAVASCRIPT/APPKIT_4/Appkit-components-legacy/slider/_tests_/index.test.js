import React from 'react';
import { mount } from 'enzyme';
import { Slider } from '../index';
import toJson from 'enzyme-to-json';

describe('Slider', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('single slider', () => {
        const onValueChange = jest.fn();
        const wrapper = mount(
            <Slider min={0} 
                max={256} 
                step={1} 
                value={0} 
                sliderId="singleSlider" 
                hasInterval 
                showIntervalTick 
                onValueChange={onValueChange}>

            </Slider>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'End', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'Home', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('mousedown', { key: 'Home', preventDefault() { }, target: {focus() {}} });
        wrapper.find('.ap-slider-handle').first().simulate('touchstart', { key: 'Home', preventDefault() { } });
    });

    it('range slider', () => {
        const onValueChange = jest.fn();
        const wrapper = mount(
            <Slider min={0} 
                max={256} 
                step={1} 
                value={[12, 16]} 
                sliderId="rangeSlider" 
                range
                onValueChange={onValueChange}>
                
            </Slider>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'End', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('keydown', { key: 'Home', preventDefault() { } });
        wrapper.find('.ap-slider-handle').first().simulate('mousedown', { key: 'Home', preventDefault() { }, target: {focus() {}} });
        wrapper.find('.ap-slider-handle').first().simulate('touchstart', { key: 'Home', preventDefault() { } });
    });

    it('single slider with disabled', () => {
        const onValueChange = jest.fn();
        const wrapper = mount(
            <Slider min={0} 
                max={256} 
                step={1.5} 
                value={[12, 16]} 
                sliderId="singleSliderWithDisabled" 
                disabled
                onValueChange={onValueChange}>
                
            </Slider>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})