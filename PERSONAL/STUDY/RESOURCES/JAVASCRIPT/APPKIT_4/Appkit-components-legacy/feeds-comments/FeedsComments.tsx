import classNames from "classnames";
import * as React from "react";
import { Button } from "../button";
import { TextArea } from "..//field";
import { Avatar } from "../avatar";
import { KEY_VALUES, useControlled } from "../utils";
import ClassNames from "classnames";

export type ValueType = string | number;
export interface commentListItem {
    shortName?: string | undefined,
    shortNameBgColor?: string | undefined,
    fullName?: string | undefined,
    commentsTime?: string | undefined,
    images?: string[] | undefined,
    likesCount?: number | undefined,
    liked?: boolean | undefined,
    commentsCount?: number | undefined,
    commentsContent?: string | undefined
};
export interface IFeedsCommentsProps {
    type: 'comments' | 'addCommentPanel';
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    commentList?: commentListItem[];
    maxLength?: number | undefined;
    children?: React.ReactNode;
    showCounter?: boolean;
    showAttachment?: boolean;
    disabled?: boolean;
    placeholderWithContent?: string;
    placeholderWithoutContent?: string;
    commentsContent?: string;
    addBtnName?: string;
    onLikeStatusChange?: (commentListItem: commentListItem) => void;
    onCommentClick?: (commentListItem: commentListItem) => void;
    onCloseClick?: () => void;
    onAddClick?: (event: any) => void;
    onMoreClick?: () => void;
    onPreviewImage?: (event: boolean) => void;
    onCommentContentChange?: (commentsContent: string) => void;
}

export type FeedsCommentsProps = IFeedsCommentsProps &
    React.HTMLAttributes<HTMLDivElement>;

const FeedsComments = React.forwardRef<HTMLDivElement, FeedsCommentsProps>(
    (props, ref) => {
        const {
            type,
            className,
            children,
            commentList,
            maxLength,
            title = "Add a new comment",
            onLikeStatusChange,
            onCommentClick,
            showAttachment = false,
            placeholderWithContent = "Your comment",
            placeholderWithoutContent = "Write a comment...",
            commentsContent: commentsContentProp,
            disabled,
            addBtnName = "Add comment",
            onCloseClick,
            onAddClick,
            onMoreClick,
            onCommentContentChange,
            onPreviewImage,
            ...otherProps
        } = props;

        let backBoxElement: any = null;
        const safariAgent = navigator.userAgent.indexOf("Safari") > -1 && navigator.vendor.indexOf("Apple") > -1;
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const [commentsContent, setCommentsContent] = useControlled(commentsContentProp, "");

        const showImage = (imgSrc: string) => {
            const backBox = document.createElement('div');
            backBox.classList.add('shadowDiv');
            backBox.style.display = 'none';

            const bigImg = document.createElement('img');
            bigImg.classList.add('imgCur');
            bigImg.src = imgSrc;
            backBox.appendChild(bigImg);
            document.body.appendChild(backBox);
            zoomInImage();
            onPreviewImage?.(true);
        }

        const zoomInImage = () => {
            backBoxElement = document.body.getElementsByClassName('shadowDiv')[0] as HTMLElement;
            let bigImg = document.body.getElementsByClassName('imgCur')[0] as HTMLElement;
            backBoxElement.classList.add('backBox');
            backBoxElement.style.display = 'block';
            bigImg.classList.add('bigImg');
            document.body.classList.add('none-scroll');
            document.addEventListener('keydown', hideShadow);

            backBoxElement.onclick = (event: any) => {
                event.preventDefault();
                if (event.target != bigImg) {
                    backBoxElement.style.display = 'none';
                    document.removeEventListener('keydown', hideShadow);
                    backBoxElement = null;
                    onPreviewImage?.(false);
                }
            }
        }

        const hideShadow = (event: any) => {
            event.preventDefault();
            if (event.key === KEY_VALUES.ESC && backBoxElement) {
                backBoxElement.style.display = 'none';
                document.removeEventListener('keydown', hideShadow);
                backBoxElement = null;
                onPreviewImage?.(false);
            }
        }

        const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, img: any) => {
            if (event.key === KEY_VALUES.ENTER) {
                showImage(img)
            }
        };

        const switchLikeStatus = (item: commentListItem) => {
            onLikeStatusChange?.(item);
        };

        const showComments = (item: commentListItem) => {
            onCommentClick?.(item);
        }

        const onCommentsKeydown = (event: React.KeyboardEvent<HTMLDivElement>, type: string, item: any) => {
            if (event.key === KEY_VALUES.ENTER || event.key === KEY_VALUES.SPACE) {
                event.preventDefault();
                if (type === 'like')
                    switchLikeStatus(item);
                else if (type === 'comment')
                    showComments(item);
            }
        };


        const handleCommentChange = (value: string) => {
            setCommentsContent(value);
            onCommentContentChange?.(value);
        }

        const handleOnMoreClick = () => {
            onMoreClick?.();
        }

        const handleOnAddClick = () => {
            onAddClick?.({
                commentsContent,
                uploadedFiles,
                fileImageUrls
            });
            setFileImageUrls([]);
            setUploadedFiles([]);
            setCommentsContent("");
            onCommentContentChange?.("");
        }

        const handleOnCloseClick = () => {
            onCloseClick?.();
        }

        const attach = () => {
            //@ts-ignore

            fileInputRef?.current?.click();
        }


        const imgList = [1, 2, 3, 4];
        const [fileImageUrls, setFileImageUrls] = React.useState([] as any);
        const [uploadedFiles, setUploadedFiles] = React.useState([] as any);
        const [target, setTarget] = React.useState(null);
        const handleChange = (event: any): void => {

            const newTarget = event.target || event.srcElement;
            let imageFile = event.target.files[0];
            if (imageFile) {
                let imgUrl = window.URL.createObjectURL(imageFile);
                const _fileImageUrls = [...fileImageUrls, imgUrl];
                const _uploadedFiles = [...uploadedFiles, imageFile]
                setFileImageUrls(_fileImageUrls);
                setUploadedFiles(_uploadedFiles);
                newTarget.value = '';
            }
            setTarget(newTarget);
        }

        const deleteImg = (index: number, event?: any) => {
            if (event && event.key !== KEY_VALUES.ENTER)
                return
            const _fileImageUrls = [...fileImageUrls];
            _fileImageUrls.splice(index, 1);
            const _uploadedFiles = [...uploadedFiles];
            _uploadedFiles.splice(index, 1);
            setFileImageUrls(_fileImageUrls);
            setUploadedFiles(_uploadedFiles);
        }

        if (type === 'comments')
            return (
                <div ref={ref} className={ClassNames("comments-wrapper", className)}  {...otherProps}>
                    {commentList?.map((item, index) => {
                        return <div className="comments" key={index}>
                            <div className="comments-short-name">
                                <Avatar label={item.shortName} bgColor={item.shortNameBgColor}></Avatar>
                            </div>
                            <div className="comments-detail">
                                <div className="comments-info">
                                    <div className="comments-name">{item.fullName}</div>
                                    <div className="comments-time">{item.commentsTime}</div>
                                </div>
                                <div className="comments-content">{item.commentsContent}</div>
                                <div className="comments-images">
                                    {item?.images?.length && item.images.map((img, imgIndex) => {
                                        return <div className="image" key={imgIndex} tabIndex={0} onDoubleClick={(e) => { showImage(img) }} onKeyDown={(e) => { handleKeyDown(e, img) }}>
                                            <img src={img} alt={`comment image ` + imgIndex + 1} />
                                        </div>
                                    })}
                                </div>
                                <div className="comments-likes">
                                    {item.likesCount && (
                                        <div className="comments-action comments-action-like" role="button" tabIndex={0}
                                            aria-label={item.likesCount + ' likes'}
                                            onClick={(e) => switchLikeStatus(item)}
                                            onKeyDown={(e) => onCommentsKeydown(e, 'like', item)} >
                                            <span className={classNames("Appkit4-icon", {
                                                "icon-thumb-up-outline": !item.liked,
                                                "icon-thumb-up-fill": item.liked
                                            })} aria-hidden="true"></span>
                                            <span className="comments-action-text">{item.likesCount} likes</span>
                                        </div>
                                    )}
                                    {item.commentsCount && (
                                        <div className="comments-action  comments-action-comment" role="button" tabIndex={0}
                                            onClick={(e) => showComments(item)}
                                            onKeyDown={(e) => onCommentsKeydown(e, 'comment', item)}>
                                            <span className="Appkit4-icon icon-comment-outline" aria-hidden="true"></span>
                                            <span className="comments-action-text">{item.commentsCount} comments</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    })
                    }
                </div >
            )
        else
            return (
                <div ref={ref} className={ClassNames("ap-feeds-comments", className)}  {...otherProps}>
                    <div className="ap-feeds-comments-header">
                        <div className="ap-feeds-comments-header-title">{title}</div>
                        <div className="ap-feeds-comments-header-action">
                            <button aria-label="More info" type="button" className="more" onClick={handleOnMoreClick}>
                                <span aria-hidden="true" className="Appkit4-icon icon-horizontal-more-outline"></span>
                            </button>
                            <button aria-label="cancel" type="button" className="close" onClick={handleOnCloseClick}>
                                <span aria-hidden="true" className="Appkit4-icon icon-close-outline"></span>
                            </button>
                        </div>
                    </div>
                    <div className="ap-feeds-comments-body">
                        <TextArea
                            maxLength={maxLength}
                            title={commentsContent.length > 0 ? placeholderWithContent : placeholderWithoutContent}
                            value={commentsContent}
                            onChange={handleCommentChange}
                            disabled={disabled}></TextArea>
                    </div>
                    <div className="ap-feeds-comments-footer">
                        {showAttachment && (
                            <div className="ap-feeds-comments-footer-attach" tabIndex={1} aria-label="attach link" role="button">
                                <span aria-hidden="true" className="Appkit4-icon icon-paperclip-outline"></span>
                                <input
                                    className="ap-feeds-comments-footer-attach-input"
                                    aria-label="attach link"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    aria-hidden="true"
                                    tabIndex={undefined}
                                    onChange={e => handleChange(e)}
                                />
                            </div>
                        )}
                        {!showAttachment && (
                            <span></span>
                        )}
                        <div className="ap-feeds-comments-footer-buttons">
                            <Button kind='primary' disabled={(!commentsContent && (showAttachment && !fileImageUrls.length)) || (!commentsContent && !showAttachment)} onClick={handleOnAddClick}>{addBtnName}</Button>
                        </div>
                    </div>
                    {
                        fileImageUrls.length > 0 && (
                            <div className="uploaded-images">
                                <div className="uploaded-images-placeholder">
                                    {imgList.map((item: any, index: number) => {
                                        return (
                                            <div key={index} className={ClassNames("uploaded-images-placeholder-item", { "rimless": index >= fileImageUrls.length })}>
                                            </div>)
                                    })
                                    }
                                </div>
                                {fileImageUrls.map((item: any, index: number) => {
                                    return (
                                        <div key={index} className="image-wrapper">
                                            <img src={item} alt={"'uploaded-image '+(index+1)"} />
                                            <span className="Appkit4-icon icon-circle-delete-outline"
                                                onClick={e => deleteImg(index)}
                                                onKeyDown={e => deleteImg(index, e)}
                                                tabIndex={0} role="button"
                                                aria-label={"'Delete image '+(index+1)"}></span>
                                        </div>)
                                })
                                }
                            </div >
                        )
                    }
                </div>
            )
    });

export default FeedsComments;