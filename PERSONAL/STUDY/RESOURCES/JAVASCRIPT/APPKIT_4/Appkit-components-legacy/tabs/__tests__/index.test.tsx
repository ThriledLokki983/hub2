import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Tabs, Tab } from '../index';
describe('Tabs', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('render tabs baseline underline', () => {
        const wrapper = mount(

            < Tabs tabsetId="tabs" type={'underline'} defaultActiveIndex={0} >
                <Tab label="Mailsxxx" tabId="tab" icon='email-outline'>Mailsxxx</Tab>
                <Tab label="Archive" icon='icon-archive-outline' disabled={true}>Archive</Tab>
                <Tab label="Trash" icon='delete-outline' disabled={true}>Trash</Tab>
                <Tab label="Junk" icon='junk-outline' disabled={true} >Junk</Tab>
            </Tabs >
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-tabset-toggle').first().simulate('click');
        expect(wrapper.find('.ap-tabset-toggle').first()).toBe(true);
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 37, preventDefault() { } });

        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 39, preventDefault() { } });

    });
    it('render tabs baseline icon', () => {
        const wrapper = mount(

            <>
                < Tabs tabsetId="ddxxx" type={'underline'} defaultActiveIndex={1} >
                </Tabs >
            </>
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-tabset-toggle').first().simulate('click');
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 37, preventDefault() { } });
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 39, preventDefault() { } });

    });
    it('render tabs baseline label', () => {
        const wrapper = mount(

            <>
                < Tabs tabsetId="ddxxx" type={'underline'} defaultActiveIndex={2} >

                    <Tab label="Mailsxxx">Mailsxxx</Tab>
                    <Tab label="Archive">Archive</Tab>
                    <Tab label="Trash">Trash</Tab>
                    <Tab label="Junk" >Junk</Tab>
                </Tabs >
            </>
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-tabset-toggle').first().simulate('click');
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 37, preventDefault() { } });

        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 39, preventDefault() { } });

    });
    it('render tabs disabled', () => {
        const wrapper = mount(

            < Tabs tabsetId="ddxxx" type={'underline'} defaultActiveIndex={0} >

                <Tab label="Mailsxxx" icon='email-outline'>Mailsxxx</Tab>
                <Tab label="Archive" icon='icon-archive-outline'>Archive</Tab>
                <Tab label="Trash" icon='delete-outline'>Trash</Tab>
                <Tab label="Junk" icon='junk-outline' disabled={true}>Junk</Tab>
            </Tabs >
        );
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-tabset-toggle').first().simulate('click');
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 37, preventDefault() { } });
        wrapper.find('.ap-tabset-toggle').first().simulate('keydown', { keyCode: 39, preventDefault() { } });

    });



})
