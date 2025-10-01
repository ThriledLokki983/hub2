import * as React from 'react';
import ClassNames from 'classnames';
import { KEY_VALUES } from '../utils';
import mergeRefs from '../utils/mergeRefs';
export interface TreeNode {
    title: string,
    key: string,
    expanded?: boolean,
    iconOpened?: string,
    iconClosed?: string,
    selected?: boolean,
    parent?: string,
    icon?: string,
    children?: TreeNode[]
}
export interface DataLinkedItem {
    key: string,
    title: string,
    item: TreeNode,
    parent?: string
}
export interface TreeProps {
    data: TreeNode[],
    onClick?: (event: TreeNode) => void;
    isRoot?: boolean,
    className?: string,
    style?: React.CSSProperties,
    treeId?: string
}

const Tree = React.forwardRef<HTMLElement, TreeProps>(
    ({
        data,
        onClick,
        className,
        style,
        treeId
    }, ref) => {
        const treeRef = React.useRef<HTMLDivElement>(null);
        const shouldTab = React.useRef<boolean>(false);
        const isFirstTab = React.useRef<boolean>(true);
        const [dataTree, setDataTree] = React.useState(data);
        const treeClasses = ClassNames('ap-tree', className, {});
        const allDataLinkedList: DataLinkedItem[] = [];
        const isBranchNode = (node: TreeNode) => node.children != null && node.children.length > 0;

        const getParent = (data: DataLinkedItem[], id: string) => {
            return data.find(child => child.key === id)?.parent;
        };

        const getParentItem = (data: DataLinkedItem[], id: string) => {
            const parentId = getParent(data, id);
            return data.find(child => child.key === parentId)?.item;
        };

        const getSibling = (data: DataLinkedItem[], id: string, diff: number) => {
            if (id === '') return;
            const parentId = getParent(data, id);
            const parents = data.filter(child => child.parent === parentId);
            const index = parents?.findIndex((child: DataLinkedItem) => child.key === id);
            if ((parentId === undefined || parentId != null)) {
                const siblingIndex = index + diff;
                if (parents[siblingIndex]?.item) {
                    return parents[siblingIndex]?.item;
                } else {
                    return null;
                }
            }
            return null;
        };

        const getNextAccessible = (data: DataLinkedItem[], id: string) => {
            let node = data.find(child => child.key === id)?.item;
            let nodeId = node?.key;
            if (node && isBranchNode(node) && node?.expanded === true && node.children) {
                return node.children[0];
            }
            while (true) {
                const next = getSibling(data, nodeId || '', 1);
                if (next !== null) {
                    return next;
                }
                nodeId = getParent(data, nodeId || '');
                // reached the root so there is no next accessible node
                if (nodeId === null) {
                    return null;
                }
            }
        };

        const getPreviousAccessible = (data: DataLinkedItem[], id: string) => {
            if (data[0]?.item && id === data[0]?.item.key) {
                return null;
            }
            const previous = getSibling(data, id, -1);
            if (!previous) {
                return getParentItem(data, id);
            }
            return getLastAccessible(data, previous.key);
        };

        const getLastAccessible = (data: DataLinkedItem[], id: string) => {
            let node = data.find(child => child.key === id)?.item;
            if (!node) return;
            while (node.expanded === true && isBranchNode(node) && node.children) {
                node = node.children[node.children.length - 1];
            }
            return node;
        };

        const resetData = (data: TreeNode[]) => {
            data.forEach(child => {
                child.selected = false;
                if (child.children) {
                    resetData(child.children);
                }
            });
        }

        const contentShowEvent = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item: TreeNode) => {
            event?.stopPropagation();
            if (!item.children || !item.children?.length) {
                return;
            }
            resetData(data);
            item.expanded = !item.expanded;
            item.selected = true;
            onClick?.(item);
            setDataTree([...data]);
        }

        const hoverListItem = (event: React.MouseEvent<HTMLDivElement>, isHover: boolean) => {
            const fileTitleEle = (event.currentTarget as HTMLDivElement).querySelector('.ap-file-title');
            if (isHover) {
                fileTitleEle?.classList.add('ap-font-medium');
            } else {
                fileTitleEle?.classList.remove('ap-font-medium');
            }
        }

        const getNextNodeMatchesKey = (key: string, currentItem: TreeNode): TreeNode => {
            const currentId = currentItem.key;
            const currentNodeIndex = allDataLinkedList.findIndex(child => child.key === currentId);
            const isMatch = (item: DataLinkedItem): boolean => {
                const parentItem = getParentItem(allDataLinkedList, item.key);
                return (!parentItem || parentItem.expanded === true)
                    && item.title.trim().charAt(0).toLowerCase() === key;
            };
            const beforeNodes = [...allDataLinkedList].slice(0, currentNodeIndex + 1);
            const afterNodes = [...allDataLinkedList].slice(currentNodeIndex + 1);
            const firstMatchInAfterNode = afterNodes.filter(isMatch)[0];

            if (!firstMatchInAfterNode) {
                const firstMatchInBeforeNode = beforeNodes.filter(isMatch)[0];
                return firstMatchInBeforeNode ? firstMatchInBeforeNode.item : currentItem;
            }
            return firstMatchInAfterNode.item;
        };

        const alphabetEvent = (event: React.KeyboardEvent<HTMLElement>, item: TreeNode) => {
            if (event.keyCode > 64 && event.keyCode < 90) {
                const key = event.key;
                const nextNode = getNextNodeMatchesKey(key, item);
                resetData(data);
                nextNode.selected = true;
                shouldFirstTab(nextNode.key);
                setDataTree([...data]);
                return;
            }
        }

        const onKeydownFile = (event: React.KeyboardEvent<HTMLElement>, item: TreeNode) => {
            event.stopPropagation();
            if (!shouldTab.current)
                event.preventDefault();
            switch (event.key) {
                case KEY_VALUES.ENTER:
                    contentShowEvent(event, item);
                    break;
                case KEY_VALUES.DOWN:
                    downEventByItem(item);
                    break;
                case KEY_VALUES.UP:
                    upEventByItem(item);
                    break;
                case KEY_VALUES.LEFT:
                    leftEventByItem(item);
                    break;
                case KEY_VALUES.RIGHT:
                    rightEventByItem(item);
                    break;
            }
            alphabetEvent(event, item);
            const tree = (treeRef.current as HTMLElement);
            if (!shouldTab.current && Array.prototype.indexOf.call(tree.querySelectorAll('.ap-files-fold'), document.activeElement) === 0) {
                shouldTab.current = true;
                isFirstTab.current = true;
            }
        }

        const downEventByItem = (item: TreeNode) => {
            const nextItem = getNextAccessible(allDataLinkedList, item.key);
            if (nextItem) {
                resetData(data);
                nextItem.selected = true;
                setDataTree([...data]);
            }
        }

        const upEventByItem = (item: TreeNode) => {
            const prevItem = getPreviousAccessible(allDataLinkedList, item.key);
            if (prevItem) {
                resetData(data);
                prevItem.selected = true;
                setDataTree([...data]);
            }
        }

        const leftEventByItem = (item: TreeNode) => {
            resetData(data);
            if (item.children && item.expanded) {
                item.expanded = false;
                setDataTree([...data]);
            } else {
                let parentItem = getParentItem(allDataLinkedList, item.key);
                if (parentItem) {
                    parentItem.selected = true;
                    setDataTree([...data]);
                }
            }
        }

        const rightEventByItem = (item: TreeNode) => {
            if (item.children) {
                resetData(data);
                if (!item.expanded) {
                    item.expanded = true;
                    setDataTree([...data]);
                } else {
                    downEventByItem(item);
                }
            }
        }

        const focusItemEvent = (event: React.FocusEvent<HTMLElement>) => {
            event.target.firstElementChild?.classList.add('focus');
        }

        const blurItemEvent = (event: React.FocusEvent<HTMLElement>) => {
            event.target.firstElementChild?.classList.remove('focus');
        }

        const mouseDownEvent = () => {
            (treeRef.current as HTMLElement)?.classList.add('no-outline');
        }

        const keyupEvent = (event: KeyboardEvent) => {
            (treeRef.current as HTMLElement)?.classList.remove('no-outline');
            if (event.key === KEY_VALUES.TAB) {
                shouldTab.current = true;
                const tree = (treeRef.current as HTMLElement);
                if (tree && tree.contains(document.activeElement))
                    document.activeElement?.firstElementChild?.classList.add('focus');
            }
        }

        const blurTreeEvent = (event: FocusEvent) => {
            shouldTab.current = false;
            const blurKey = (event.target as HTMLElement).getAttribute('attr-key');
            // Prevent focusing the first element by default
            shouldFirstTab(blurKey);
        }

        const shouldFirstTab = (lastTabKey: string | null) => {
            if (allDataLinkedList[0].key !== lastTabKey) {
                isFirstTab.current = false;
            } else {
                isFirstTab.current = true;
            }
        }

        React.useEffect(() => {
            (treeRef.current as HTMLElement)?.addEventListener('mousedown', mouseDownEvent);
            (treeRef.current as HTMLElement)?.addEventListener("focusout", blurTreeEvent);
            document.addEventListener('keyup', keyupEvent);
            return () => {
                (treeRef.current as HTMLElement)?.removeEventListener('mousedown', mouseDownEvent);
                (treeRef.current as HTMLElement)?.removeEventListener('focusout', blurTreeEvent);
                document.removeEventListener('keyup', keyupEvent);
            }
        }, []);

        const renderChildren = (dataChildren: TreeNode[], isRoot: boolean, parentId?: string) => {
            return dataChildren.map((item: TreeNode, index: number) => {
                item.parent = parentId;
                allDataLinkedList.push({
                    key: item.key,
                    title: item.title,
                    item,
                    parent: parentId
                });
                const itemRef = (element: HTMLElement | null) => {
                    if (item?.selected && element) {
                        element.focus();
                    }
                };
                if (item.children)
                    return (
                        <div
                            className={ClassNames('ap-files-fold', { 'active': item.expanded, 'normal': !item.expanded })}
                            role="treeitem"
                            ref={itemRef}
                            key={item.key}
                            attr-key={item.key}
                            onFocus={(event) => focusItemEvent(event)}
                            onBlur={(event) => blurItemEvent(event)}
                            onClick={(event) => contentShowEvent(event, item)}
                            onMouseEnter={(event) => hoverListItem(event, true)}
                            onMouseLeave={(event) => hoverListItem(event, false)}
                            tabIndex={((isRoot && index === 0 && isFirstTab.current) || item.selected) ? 0 : -1} onKeyDown={(event) => onKeydownFile(event, item)}
                            aria-expanded={item.expanded}
                            aria-selected={item.selected}>
                            <div className={ClassNames("ap-fold-name")}>
                                {item.expanded && <span className={`Appkit4-icon ${item.iconOpened}`} aria-hidden={"true"}></span>}
                                {!item.expanded && <span className={`Appkit4-icon ${item.iconClosed}`} aria-hidden={"true"}></span>}
                                <span className={"ap-file-title"}>{item.title}</span>
                            </div>
                            <div className={ClassNames('ap-tree-list animated', { 'fadeOutUp': !item.expanded, 'fadeInDown': item.expanded })} role="group">
                                {renderChildren(item.children, false, item.key)}
                            </div>
                        </div>
                    )

                return (
                    <div
                        className={"ap-files-fold"}
                        onMouseEnter={(event) => hoverListItem(event, true)}
                        onMouseLeave={(event) => hoverListItem(event, false)}
                        onClick={(event) => contentShowEvent(event, item)}
                        ref={itemRef}
                        key={item.key}
                        attr-key={item.key}
                        onFocus={(event) => focusItemEvent(event)}
                        onBlur={(event) => blurItemEvent(event)}
                        tabIndex={((isRoot && index === 0 && isFirstTab.current) || item.selected) ? 0 : -1} role="treeitem" onKeyDown={(event) => onKeydownFile(event, item)}
                        aria-expanded={item.expanded}
                    >
                        <div className={ClassNames("ap-tree-list-item")} aria-selected={item.selected}>
                            <span className={`Appkit4-icon ${item.icon ? item.icon : 'icon-paper-outline'}`} aria-hidden={"true"}></span>
                            <span className={"ap-file-title"}>{item.title}</span>
                        </div>
                    </div>
                )
            }
            )
        }

        return (
            <div id={treeId} className={treeClasses} style={style} role="tree" ref={mergeRefs(ref, treeRef)} aria-label={'file tree'}>
                {renderChildren(dataTree, true)}
            </div>
        );
    });

Tree.displayName = 'Tree';

export default Tree;
