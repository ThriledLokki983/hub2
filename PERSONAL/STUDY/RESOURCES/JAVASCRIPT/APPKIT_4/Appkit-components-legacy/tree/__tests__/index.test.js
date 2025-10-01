import React from 'react';
import { mount, shallow } from 'enzyme';
import Tree from '../index';
import toJson from 'enzyme-to-json';
describe('Tree', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render correctly', () => {
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201',
                }, {
                    title: 'Presentation.key',
                    key: '202',
                }, {
                    title: 'Others',
                    key: '203',
                    expanded: true,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Presentation.key',
                key: '302',
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402',
            }]
        }
    ];
    const dataTreeMultiple = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101'
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201',
                }, {
                    title: 'Presentation.key',
                    key: '202',
                }, {
                    title: 'Others',
                    key: '203',
                    expanded: true,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'DocumentsArchive',
                key: '31',
                expanded: false,
                iconOpened: "icon-folder-closed-outline",
                iconClosed: "icon-folder-closed-outline",
                children: [{
                    title: 'DocumentsArchive DocumentsArchive',
                    key: '3131',
                    expanded: false,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [{
                        title: 'DocumentationDocumentation.pdf',
                        key: '313101',
                    }]
                }]
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402',
            }]
        }
    ];
    const wrapper = shallow(<Tree data={dataTree}></Tree>);
    const wrapperTwo = shallow(<Tree data={dataTreeMultiple}></Tree>);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(toJson(wrapperTwo)).toMatchSnapshot();
  });

  it('should be keydown', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201',
                }, {
                    title: 'Presentation.key',
                    key: '202',
                }, {
                    title: 'Others',
                    key: '203',
                    expanded: true,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Presentation.key',
                key: '302',
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402',
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);

    wrapper.find('.ap-files-fold').at(0).simulate('click');
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowLeft', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowLeft', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'Enter', preventDefault(){}});

    wrapper.find('.ap-files-fold').at(0).simulate('focus');
    wrapper.find('.ap-files-fold').at(0).simulate('blur');
    wrapper.find('.ap-files-fold').at(0).simulate('mouseenter');
    wrapper.find('.ap-files-fold').at(0).simulate('mouseleave');
    wrapper.find('.ap-files-fold').at(0).find('.ap-files-fold').at(0).simulate('mouseenter');
    wrapper.find('.ap-files-fold').at(0).find('.ap-files-fold').at(0).simulate('mouseleave');
   
    wrapper.unmount();
  });

  it('should be tab', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201',
                }, {
                    title: 'Presentation.key',
                    key: '202',
                }, {
                    title: 'Others',
                    key: '203',
                    expanded: true,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Presentation.key',
                key: '302',
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402',
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(0).simulate('mousedown');
    // wrapper.find('.ap-files-fold').at(0).simulate('focusout');
    wrapper.find('.ap-files-fold').at(0).simulate('click');
    wrapper.find('.ap-files-fold').at(0).find('.ap-files-fold').at(0).simulate('click');
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', { preventDefault(){}, key: 'a', keyCode: 65, which: 65 });
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', { preventDefault(){}, key: 'p', keyCode: 80, which: 80 });
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', { preventDefault(){}, key: 'p', keyCode: 80, which: 80 });
    var event = new KeyboardEvent('keyup', {key: 'Tab', preventDefault(){}});
    document.dispatchEvent(event);
    wrapper.find('.ap-tree').simulate('keydown', { preventDefault(){}, key: 'Tab'});
  });

  it('should be onClick', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201',
                }, {
                    title: 'Presentation.key',
                    key: '202',
                }, {
                    title: 'Others',
                    key: '203',
                    expanded: true,
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031',
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Presentation.key',
                key: '302',
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402',
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
  });

  it('should be search', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101'
            }]
        },
        {
            title: 'Appkit',
            key: '2',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [
                {
                    title: 'Documentation.pdf',
                    key: '201'
                }, {
                    title: 'Presentation.key',
                    key: '202'
                }, {
                    title: 'Others',
                    key: '203',
                    iconOpened: "icon-folder-closed-outline",
                    iconClosed: "icon-folder-closed-outline",
                    children: [
                        {
                            title: 'Screenshot.png',
                            key: '2031'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Documents',
            key: '3',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Presentation.key',
                key: '302',
            }]
        },
        {
            title: 'Dropbox',
            key: '4',
            expanded: false,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '402'
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
  });

  it('should be children', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: false,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline"
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(0).simulate('click');
  });

  it('should be up', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: true,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
                expanded: true
            }]
        },
        {
            title: 'Dropbox',
            key: '2',
            expanded: true,
            iconOpened: "icon-box-outline",
            iconClosed: "icon-box-outline",
            children: [{
                title: 'Presentation.key',
                key: '201'
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(2).simulate('click');
    wrapper.find('.ap-files-fold').at(2).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(2).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(2).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});

    wrapper.find('.ap-files-fold').at(1).simulate('click');
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
  });

  it('should be down', () => {
    const onClickEvent = jest.fn();
    const dataTree = [
        {
            title: 'Archive',
            key: '1',
            expanded: true,
            iconOpened: "icon-folder-closed-outline",
            iconClosed: "icon-folder-closed-outline",
            children: [{
                title: 'Documentation.pdf',
                key: '101',
                expanded: false
            }]
        }
    ];
    const wrapper = mount(<Tree data={dataTree} onClick={onClickEvent}></Tree>);
    expect(wrapper.find('.ap-tree').hostNodes().length).toBe(1);
    wrapper.find('.ap-files-fold').at(1).simulate('click');
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-files-fold').at(1).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
  });
})

