import React from 'react';
import { mount } from 'enzyme';
import { Filter } from '../index';
import toJson from 'enzyme-to-json';

describe('Filter', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be Filter single', () => {
        const data = [
            { label: 'Blue', value: 1, desc: '128' },
            { label: 'Green', value: 2, desc: '48', },
            { label: 'Indigo', value: 3, desc: '256', disabled: false }
        ];
        const wrapper = mount(
            <Filter
                title={"Single selection Normal"}
                multiple={false}
                data={data}
                defaultValue={2}
                valueKey={"value"}
                labelKey={"label"}
                expand={true}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-filter').first().simulate('keydown', { keyCode: 66, preventDefault() { } });
        wrapper.find('.ap-filter').first().simulate('keydown', { keyCode: 67, preventDefault() { } });
        wrapper.find('.ap-filter').first().simulate('keydown', { keyCode: 99, preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('click');
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { keyCode: 32, preventDefault() { } });
        wrapper.find('.ap-filter-button').first().simulate('click');
        wrapper.find('.ap-filter-button').first().simulate('click');
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
    });
    it('should be Filter multi 1', () => {
        const onSelect = jest.fn();
        const data = [
            { label: 'Completed', value: 1, desc: '128', status: 'complete', disabled: true },
            { label: 'In-progress', value: 2, desc: '48', status: 'inprogress', disabled: false },
            { label: 'Error', value: 3, desc: '256', status: 'error', disabled: false },
            { label: 'Draft', value: 4, desc: '16', status: 'draft', disabled: true }
        ];
        const wrapper = mount(
            <Filter
                title={"Multiple selection Normal"}
                multiple={true}
                data={data}
                defaultValue={["3"]}
                valueKey={"value"}
                labelKey={"label"}
                expand={true}
                onSelect={onSelect}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-filter').first().simulate('keydown', { key: 'F4', preventDefault() { } });
        wrapper.find('.ap-filter').first().simulate('keydown', { key: 'T', preventDefault() { } });
        wrapper.find('.ap-filter').first().simulate('keydown', { key: 'a', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('click');
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: '', preventDefault() { } });
    });

    it('should be Filter multi no data', () => {
        const onSelect = jest.fn();
        const data = undefined as any;
        const wrapper = mount(
            <Filter
                title={"Multiple selection Normal"}
                multiple={true}
                data={data}
                defaultValue={["3"]}
                valueKey={"value"}
                labelKey={"label"}
                expand={true}
                onSelect={onSelect}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();

    });

    it('should be Filter multi 2', () => {
        const onSelect = jest.fn();
        const data = [
            { label: 'Completed', value: 1, desc: '128', status: 'complete', disabled: false },
            { label: 'In-progress', value: 2, desc: '48', status: 'inprogress', disabled: false },
            { label: 'Error', value: 3, desc: '256', status: 'error', disabled: false },
            { label: 'Draft', value: 4, desc: '16', status: 'draft', disabled: false }
        ];
        const wrapper = mount(
            <Filter
                title={"Multiple selection Normal"}
                multiple={true}
                data={data}
                defaultValue={["1"]}
                valueKey={"value"}
                labelKey={"label"}
                expand={false}
                onSelect={onSelect}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('click');
        wrapper.find('.ap-filter-button').first().simulate('keydown', { key: 'Alt', preventDefault() { } });
    });
    it('should be Filter multi 2', () => {
        const onSelect = jest.fn();
        const data = [
            { label: 'Completed', value: 1, desc: '128', status: 'complete', disabled: false },
            { label: 'In-progress', value: 2, desc: '48', status: 'inprogress', disabled: false },
            { label: 'Error', value: 3, desc: '256', status: 'error', disabled: false },
            { label: 'Draft', value: 4, desc: '16', status: 'draft', disabled: false }
        ];
        const wrapper = mount(
            <Filter
                title={"Multiple selection Normal"}
                multiple={true}
                data={data}
                defaultValue={["2"]}
                valueKey={"value"}
                labelKey={"label"}
                expand={false}
                onSelect={onSelect}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-filter-item-container').first().simulate('click');
    });

    it('should be Filter multi 3', () => {
        const onSelect = jest.fn();
        const data = [
            { label: 'Completed', value: 1, desc: '128', status: 'complete', disabled: false }
        ];
        const wrapper = mount(
            <Filter
                title={"Multiple selection Normal"}
                multiple={true}
                data={data}
                defaultValue={["1"]}
                valueKey={"value"}
                labelKey={"label"}
                expand={true}
                onSelect={onSelect}
            >
            </Filter>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-filter-item-container').first().simulate('focus');
        wrapper.find('.ap-filter-item-container').first().simulate('click');
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-filter-item-container').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
    });
})