import React from 'react';
import ClassNames from 'classnames';
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    type?: string,
    hasLogo?: boolean,
    onClickLogo?: (event: React.MouseEvent<HTMLElement>) => void,
    titleTemplate?: () => React.ReactNode,
    viewTabs?: () => React.ReactNode,
    subTitleTemplate?: () => React.ReactNode,
    contentTemplate?: () => React.ReactNode,
    optionsTemplate?: () => React.ReactNode,
    userTemplate?: () => React.ReactNode,
    style?: React.CSSProperties,
    className?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
        type = 'transparent',
        hasLogo = true,
        onClickLogo = () => window.location.href = '/',
        titleTemplate,
        subTitleTemplate,
        viewTabs,
        contentTemplate,
        optionsTemplate,
        userTemplate,
        style,
        className
    },
    ref
  ) => {
    const classes = ClassNames('ap-header', className, {
        'solid': type === 'solid'
      });

    return (
      <header style={style} className={classes} ref={ref}>
        <div className="ap-header-heading">
          {hasLogo && <div className="ap-header-logo" onClick={onClickLogo}></div>}
          {
            titleTemplate && <div className="ap-header-title">
              {titleTemplate()}
            </div>
          }
          {
            subTitleTemplate && <div className="ap-header-subtitle">
              <div className="ap-header-subtitle-divider"></div>
              {subTitleTemplate()}
            </div>
          }
          {
              viewTabs ? (
                  <div className="ap-header-subtitle">
                      <div className="ap-header-subtitle-divider"></div>
                      {viewTabs()}
                  </div>
              ) : null

          }
        </div>
        {
          contentTemplate && <div className="ap-header-content">
            {contentTemplate()}
          </div>
        }
        {
          (optionsTemplate || userTemplate) && <div className="ap-header-options">
            {optionsTemplate?.()}
            {userTemplate?.()}
          </div>
        }
      </header>
    )
  });

Header.displayName = 'Header';

export default Header
