import React from 'react';
import ReactDOM from 'react-dom'
import { mount,render, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Search } from '../index';
describe('Search', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render correctly', () => {
    const handlePrimarySearch = (value, event) => {
      console.log('primary search value and event', value, event)
  }

  const onChange = (value, event) => {
      console.log('primary search onChange', value, event)
  }
  const list = [
    { value: 'Badge', label: 'Badge' },
    { value: 'Dropdown with badge', label: 'Dropdown with badge' },
    { value: 'Modal with badge', label: 'Modal with badge', disabled: 'true' }
];

    const wrapper = render(
      <Search 
      data={list}
        onSearch={handlePrimarySearch}
        placeholder='this is the primary search'
        searchValue="ba"
        onChange={onChange}
        onClear={()=>{}}
        onSelect={()=>{}}
        onKeyDown={()=>{}}
        onClose={()=>{}}
        onOpen={()=>{}}
      />
    );
    const wrapperEmpty = render(
        <Search 
          onSearch={handlePrimarySearch}
          placeholder='this is the primary search'
          searchValue="ba"
          onChange={onChange}
          onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
        />
      );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(toJson(wrapperEmpty)).toMatchSnapshot();
  });

  it('render correctly', () => {
    const list = [
      { value: 'Badge', label: 'Badge' },
      { value: 'Dropdown with badge', label: 'Dropdown with badge' },
      { value: 'Modal with badge', label: 'Modal with badge', disabled: 'true' }
  ];

  const handleSearch = (value, event) => {
      console.log(value, event)
  }

    const wrapper = render(
      <div className='ap-field-demo-wrapper'>
        <Search
    data={list}
    searchType={"primary"}
    onSearch={handleSearch}
    onChange={v => { console.log('onChange', v) }}
    onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
/>
        </div>
    );

    const wrapperEmpty = render(
        <div className='ap-field-demo-wrapper'>
          <Search

      searchType={"primary"}
      onSearch={handleSearch}
      onChange={v => { console.log('onChange', v) }}
      onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
  />
          </div>
      );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(toJson(wrapperEmpty)).toMatchSnapshot();
  });

  it('render correctly', () => {
    const list = [
      { value: 'type1', label: 'Badge' },
      { value: 'type2', label: 'Dropdown with badge' },
      { value: 'type3', label: 'Modal with badge', disabled: 'true' }
  ];

  const handleSearch = (value, event) => {
      console.log(value, event)
  }

  const onSelect = (v, item, event) => {

  }

    const wrapper = render(
      <Search
                data={list}
                placeholder={'Search'}
                searchType={"secondary"}
                onSearch={handleSearch}
                onSelect={onSelect}
                onClear={() => { console.log('cleared') }}
                onChange={v => { console.log('onChange', v) }}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
            />
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render correctly', () => {

    const list = [
        { value: 'type1', label: 'Badge' },
        { value: 'type2', label: 'Dropdown with badge' },
        { value: 'type3', label: 'Modal with badge', disabled: 'true' }
    ];

    const handleSearch = (value, event) => {
        console.log(value, event)
    }
    localStorage.setItem(
      'searchKeywords',
      JSON.stringify([{value: 'type1', label: 'Badge'},
      {value: 'type2', label: 'Dropdown with badge'}])
    );

    const wrapper = mount(
      <Search
                data={list}
                placeholder={'Search'}
                searchType={"secondary"}
                onSearch={handleSearch}
                showHistory={true}
                onChange={v => { console.log('onChange', v) }}
                onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
            />
    );
    
    expect(wrapper.find('.ap-field-input').hostNodes().length).toBe(1);
    wrapper.find('.ap-field-input').at(0).simulate('focus');
    wrapper.find('.ap-field-input').at(0).simulate('keydown', { preventDefault(){}, key: 'b', keyCode: 66, which: 66 });
    wrapper.find('.ap-search-input').first().simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapper.find('.ap-field-input').at(0).simulate('focus');
    wrapper.find('.ap-field-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-field-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-field-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-field-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-search-input').at(0).simulate('keydown', { preventDefault(){}, key: 'Esc', keyCode: 27, which: 27 });
    wrapper.find('.ap-search-input').at(0).simulate('keydown', { preventDefault(){}, key: 'Esc', keyCode: 27, which: 27 });
    wrapper.find('.ap-option-item').at(0).simulate('click');

    wrapper.find('.ap-field-input').at(0).simulate('focus');
    wrapper.find('.ap-field-input').at(0).simulate('keydown', { preventDefault(){}, key: 'z', keyCode: 90, which: 66 });
    wrapper.find('.ap-search-input').first().simulate('keydown', {key: 'Enter', preventDefault(){}});
  });

  it('render correctly', () => {

    const list = [
        { value: 'type1', label: 'Badge' },
        { value: 'type2', label: 'Dropdown with badge' },
        { value: 'type3', label: 'Modal with badge', disabled: 'true' }
    ];

    const handleSearch = (value, event) => {
        console.log(value, event)
    }
    localStorage.setItem(
      'searchKeywords',
      JSON.stringify([])
    );

    const wrapper = mount(
      <Search
                data={list}
                placeholder={'Search'}
                searchType={"primary"}
                onSearch={handleSearch}
                showHistory={true}
                onChange={v => { console.log('onChange', v) }}
                onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
            />
    );
    const wrapperEnter = mount(
        <Search
                  data={list}
                  placeholder={'Search'}
                  searchType={"secondary"}
                  onSearch={handleSearch}
                  showHistory={true}
                  onChange={v => { console.log('onChange', v) }}
                  onClear={()=>{}}
                  onSelect={()=>{}}
                  onKeyDown={()=>{}}
                  onClose={()=>{}}
                  onOpen={()=>{}}
              />
      );
    
    expect(wrapper.find('.ap-field-input').hostNodes().length).toBe(1);
    wrapper.find('.ap-field-input').at(0).simulate('focus');
    wrapper.find('.ap-field-input').at(0).simulate('keydown', { preventDefault(){}, key: 'b', keyCode: 66, which: 66 });
    wrapper.find('.ap-field-input').at(0).simulate('keydown', { preventDefault(){}, key: 'a', keyCode: 65, which: 65 });
    wrapper.find('.ap-field-input').at(0).simulate('blur');
    // wrapper.find('.recent-delete-icon').at(0).simulate('click');
    // wrapper.find('.ap-option-item').at(0).simulate('click');
    wrapperEnter.find('.ap-field-input').at(0).simulate('focus');
    wrapperEnter.find('.ap-field-input').at(0).simulate('blur');
  });

  it('render correctly', () => {
    const handlePrimarySearch = (value, event) => {
      console.log('primary search value and event', value, event)
  }

  const onChange = (value, event) => {
      console.log('primary search onChange', value, event)
  }

  const list = [
    { value: 'type1', label: 'Badge' },
    { value: 'type2', label: 'Dropdown with badge' },
    { value: 'type3', label: 'Modal with badge', disabled: 'true' }
];

    const wrapper = mount(
      <Search
        data={list}
        onSearch={handlePrimarySearch}
        searchType={"primary"}
        placeholder='this is the primary search'
        searchValue="ba"
        onChange={onChange}
        onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
      />
    );
    const wrapperEnter = mount(
        <Search 
          data={list}
          onSearch={handlePrimarySearch}
          searchType={"secondary"}
          placeholder='this is the primary search'
          searchValue="ba"
          onChange={onChange}
          onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
        />
      );
      const wrapperEmpty = mount(
        <Search 
          onSearch={handlePrimarySearch}
          searchType={"secondary"}
          placeholder='this is the primary search'
          searchValue="ba"
          onChange={onChange}
          onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
        />
      );
    // wrapper.find('.ap-field-input').at(0).simulate('focus');
    // wrapper.find('.ap-search-input').at(0).simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapper.find('.ap-search-input').at(0).simulate('focus');
    wrapper.find('.ap-search-input').at(0).simulate('keydown', { preventDefault(){}, key: 'b', keyCode: 66, which: 66 });
    wrapper.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapper.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-search-input').first().simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapperEmpty.find('.ap-search-input').first().simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('focus');
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', { preventDefault(){}, key: 'b', keyCode: 66, which: 66 });
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowDown', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowUp', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowLeft', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').at(0).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
    wrapperEnter.find('.ap-search-input').first().simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapper.find('.ap-search-input').first().simulate('keydown', {key: 'Space', preventDefault(){}});
    wrapper.simulate('change', {
        target: {
            value: 'badge'
        }
    });
    wrapperEnter.simulate('change', {
        target: {
            value: 'badge'
        }
    });
    wrapperEnter.find('.ap-search-input').at(0).simulate('focus');
    console.log(wrapperEnter.find('.icon-circle-delete-outline').at(0));
    wrapperEnter.find('.icon-circle-delete-outline').first().simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should change value when onChange was called', () => {
    const onChange = jest.fn();
    const list = [
        { value: 'Badge', label: 'Badge' },
        { value: 'Dropdown with badge', label: 'Dropdown with badge' },
        { value: 'Modal with badge', label: 'Modal with badge', disabled: 'true' }
    ];
    const wrapper = mount(
<Search
data={list} 
        searchType={"primary"}
        placeholder='this is the primary search'
        onChange={onChange}
        onClear={()=>{}}
        onSelect={()=>{}}
        onKeyDown={()=>{}}
        onClose={()=>{}}
        onOpen={()=>{}}
        defaultValue="ba"
      />
    );
    const wrapperEnter = mount(
        <Search 
        data={list}
                searchType={"secondary"}
                placeholder='this is the primary search'
                onChange={onChange}
                onClear={()=>{}}
                onSelect={()=>{}}
                onKeyDown={()=>{}}
                onClose={()=>{}}
                onOpen={()=>{}}
              />
            );
    const event = {
            target: {
                value: 'Badge'
            }
        };
        const eventValue = {
            target: {
                value: 'value'
            }
        };
    const eventEmpty = {
        target: {
            value: ''
        }
    };
    wrapper.find('.ap-field-input').simulate('change', event);
    wrapper.find('.ap-field-input').simulate('change', eventValue);
    wrapper.find('.ap-field-input').simulate('focus');
    wrapper.find('.ap-field-input').simulate('blur');
    wrapper.find('.ap-field-input').simulate('change', eventEmpty);
    wrapperEnter.find('.ap-field-input').simulate('change', event);
    wrapperEnter.find('.ap-field-input').simulate('blur');
    wrapperEnter.find('.ap-field-input').simulate('focus');
    wrapperEnter.find('.ap-field-input').simulate('change', eventValue);
    wrapperEnter.find('.ap-field-input').simulate('change', eventEmpty);
    wrapper.find('.ap-field-input').simulate('focus');
    wrapperEnter.find('.ap-field-input').simulate('focus');
    wrapper.find('.ap-field-input').simulate('blur');
    wrapperEnter.find('.ap-field-input').simulate('blur');
})
})
