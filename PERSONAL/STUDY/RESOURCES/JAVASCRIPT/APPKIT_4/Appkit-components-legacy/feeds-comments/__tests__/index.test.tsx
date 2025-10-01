import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { FeedsComments } from '../index';
describe('feedsComments', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render feed correctly', () => {
    const commentList = [
      {
        shortName: 'JS',
        shortNameBgColor: '#415385',
        fullName: 'Jamie Sutton',
        commentsTime: '3 hours ago',
        commentsContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mattis urna mauris,
          at laoreet nisl placerat eu. Aenean varius libero at enim finibus tristique.`
      }, {
        shortName: 'EL',
        shortNameBgColor: '#d04a02',
        fullName: 'Ernesto Laborda',
        commentsTime: '28 min ago',
        likesCount: 24,
        liked: true,
        commentsCount: 8,
        commentsContent: `Nunc feugiat vitae leo at molestie. Donec feugiat nunc a aliquet dignissim.
        Proin ut euismod urna, id pulvinar erat.`
      }, {
        shortName: 'VR',
        shortNameBgColor: '#252525',
        fullName: 'Victor Rouco',
        commentsTime: 'Just now',
        images: ['../../styles/images/logo-gray-lg.png'],
        likesCount: 3,
        liked: false,
        commentsCount: 1,
        commentsContent: `Aenean non mi porta, dignissim tortor sed, fringilla magna.`
      }];
    const onLikeStatusChange = jest.fn();
    const onCommentClick = jest.fn();
    const wrapper = mount(
      <FeedsComments
        type={'comments'}
        commentList={commentList}
        onLikeStatusChange={onLikeStatusChange}
        onCommentClick={onCommentClick}
      ></FeedsComments>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.comments-action-like').first().simulate('click');
    wrapper.find('.comments-action-like').at(1).simulate('keydown', { key: 'Enter', preventDefault() { } });
    wrapper.find('.comments-action-comment').first().simulate('click');
    wrapper.find('.comments-action-comment').at(1).simulate('keydown', { key: 'Enter', preventDefault() { } });
    wrapper.find('.image').first().simulate('dblclick');
    const backBoxElement = document.body.getElementsByClassName('shadowDiv')[0] as HTMLElement;
    backBoxElement.click();
    wrapper.find('.image').first().simulate('dblclick');
    wrapper.find('.comments-action-comment').at(1).simulate('keydown', { key: 'Esc', preventDefault() { } });

  });
  it('render feed2 correctly', () => {
    const commentList = [
      {
        shortName: 'VR',
        shortNameBgColor: '#252525',
        fullName: 'Victor Rouco',
        commentsTime: 'Just now',
        images: ['../../styles/images/logo-gray-lg.png'],
        likesCount: 3,
        liked: false,
        commentsCount: 1,
        commentsContent: `Aenean non mi porta, dignissim tortor sed, fringilla magna.`
      }];
    const onLikeStatusChange = jest.fn();
    const onCommentClick = jest.fn();
    const wrapper = mount(
      <FeedsComments
        type={'comments'}
        commentList={commentList}
        onLikeStatusChange={onLikeStatusChange}
        onCommentClick={onCommentClick}
      ></FeedsComments>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.image').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
    const backBoxElement = document.body.getElementsByClassName('shadowDiv')[0] as HTMLElement;
    setTimeout(() => {
      var event = new KeyboardEvent('keydown', { 'keyCode': 27 })
      backBoxElement.dispatchEvent(event);
    }, 200);

  });

  it('render comment correctly', () => {
    const moreClick = jest.fn();
    const addComments = jest.fn();
    const closeModal = jest.fn();
    const setCommentsContent = jest.fn();
    const file = new File([new ArrayBuffer(1)], 'file.jpg');
    const file2 = new File([new ArrayBuffer(2)], 'file2.jpg');
    const wrapper = mount(
      <FeedsComments
        type={'addCommentPanel'}
        commentsContent={"commentsContent"}
        onCloseClick={closeModal}
        onAddClick={addComments}
        onMoreClick={moreClick}
        showAttachment={true}
        onCommentContentChange={setCommentsContent}
      ></FeedsComments>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.more').first().simulate('click');
    wrapper.find('.close').first().simulate('click');
    wrapper.find('.ap-field-input').first().simulate('change', { key: 's', preventDefault() { } });
    wrapper.find('.ap-feeds-comments-footer-attach').simulate('change', { target: { files: [file] } });
    wrapper.find('.ap-feeds-comments-footer-attach').simulate('change', { target: { files: [file2] } });
    setTimeout(() => {
      wrapper.find('.ap-feeds-comments-footer-buttons .ap-button').first().simulate('click');
    }, 200);
  });

  it('render comment2 correctly', () => {
    const setCommentsContent = jest.fn();
    const wrapper = mount(
      <FeedsComments
        type={'addCommentPanel'}
        commentsContent={""}
        showAttachment={false}
        onCommentContentChange={setCommentsContent}
      ></FeedsComments>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-field-input').first().simulate('change', { key: 's', preventDefault() { } });
  });
})
