import { useState, useReducer, useCallback, useEffect } from 'react';

import { camalize } from '../../utils';

import BREAKPOINTS_DATA from '../configs/breakpoints.json';

const BREAKPOINTS = BREAKPOINTS_DATA['breakpoint-map'];
const SCREENSIZE_BREAKPOINTS = ['tiny-phone', 'small-phone', 'phone', 'large-phone', 'tablet', 'small-desktop', 'laptop', 'desktop'];


export function useScreenSize () {
    const [matches, dispatchMatches] = useReducer(mediaMatchReducer, {});

    const updateMatchQuery = useCallback((breakpoint, matches) => {
        dispatchMatches({ breakpoint, matches, type: 'UPDATE' });
    }, []);

    const [[width, height], setViewportDimensions] = useState([window.innerWidth, window.innerHeight]);
    const onWindowResize = useCallback(() => {
        setViewportDimensions([ window.innerWidth, window.innerHeight ]);
    }, []);

    useEffect(() => {
        const queries = SCREENSIZE_BREAKPOINTS.map((bp) => ({
            name: bp,
            query: `(min-width: ${BREAKPOINTS[bp]}px)`
        }));

        queries.push({ name: 'print', query: 'print' });

        // breakpoint sizes
        queries.forEach(({ name, query }) => {
            const mql = window.matchMedia(query);
            updateMatchQuery(name, mql.matches);
            mql.onchange = ({ matches }) => { updateMatchQuery(name, matches); };
        });

        // window width and height
        window.onresize = onWindowResize;

        return () => {
            window.onresize = null;
        }
    }, [updateMatchQuery, onWindowResize]);

    return { ...matches, width, height };
}

export default useScreenSize;

function mediaMatchReducer (state, action) {
    const { type, breakpoint, matches } = action;

    switch (type) {
        case 'UPDATE': {
            const isKey = camalize(`is ${breakpoint}`);
            const isntKey = camalize(`isnt ${breakpoint}`);

            return {
                ...state,
                [isKey]: matches,
                [isntKey]: !matches
            };
        }
        default: {
            return state;
        }
    }
}
