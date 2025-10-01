import React from 'react';
import ClassNames from 'classnames';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  type?: string,
  links?: Array<{ name: string, href: string }>,
  content: string,
  style?: React.CSSProperties,
  className?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      type = 'text',
      links,
      content,
      style,
      className
    },
    ref
  ) => {
    const classes = ClassNames('ap-footer', className);
    return (
      <footer className={classes} style={style} ref={ref}>
        <div className="ap-footer-content" dangerouslySetInnerHTML={{ __html: content }}></div>
        <div className="ap-footer-link-group">
          {
            (type === 'links' && links && links.length) && links.map((item, index) => {
              return (
                <div className="ap-footer-link" key={index}>
                  <a className="ap-link" href={item.href}>{item.name}</a>
                  {index !== links.length - 1 && <span className="ap-footer-divider">|</span>}
                </div>
              )
            })
          }
        </div >
      </footer >
    )
  });

Footer.displayName = 'Footer';

export default Footer