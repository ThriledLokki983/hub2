import React, { useMemo } from 'react';
import isHexcolor from 'is-hexcolor';
import { hexToCSSFilter } from 'hex-to-css-filter';
import { camalize } from '../../utils';
import Bem from 'react-better-bem';

import { getColor } from '../../utils';

import styles from './Icon.module.scss';
import icons from '../../assets/icons';

const VALID_SIZES = ['default', 'extra-small', 'small', 'medium', 'large', 'extra-large'];

const VALID_CURSORS = ['pointer'];

const Icon = React.forwardRef(({
    src,
    type = '',
    color,
    alt = '',
    size = 'default',
    valign = false,
    inline = false,
    float = false,
    cursor: _cursor = false,
    internship = false,
    ...props
}, ref) => {

    const cssProps = useMemo(() => {
        const filterColor = isHexcolor(color) ? color : getColor(color, 'default');

        if (isHexcolor(filterColor)) {
            const filter = hexToCSSFilter(filterColor).filter.replace(';', '');
            return { filter };
        }

        return {};
    }, [color]);

    const icon = useMemo(() => {
        if (src) {
            return src;
        }
        const camelType = camalize(type);
        return icons[camelType];
    }, [src, type]);

    if (!icon) {
        // we need to return something because of forwardRef, so
        // we can not just return `null`
        return <React.Fragment ref={ref} />; // 🧙‍♂️
    }

    const iconSize = VALID_SIZES.includes(size) ? size : VALID_SIZES[0];
    const cursor = VALID_CURSORS.includes(_cursor) ? _cursor : false;

    return (
        <Bem style={styles}>
            <img
                src={icon}
                el="icon"
                mod={{ size: iconSize, valign, inline, cursor, float }}
                alt={alt}
                style={!internship ? cssProps : null }
                ref={ref}
                {...props}
            />
        </Bem>
    );
});

export default Icon;
