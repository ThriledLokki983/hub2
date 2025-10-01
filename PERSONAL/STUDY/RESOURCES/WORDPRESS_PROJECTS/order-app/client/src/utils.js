import COLORS from './configs/colours.json';
import ENV_COLORS from './configs/env_colours.json';

export function getProductData() {
    return fetch('http://localhost:4001/api/products/bulk')
        .then(res => res.json())
}

export function getCustomers(){
    return fetch('http://localhost:4001/api/customers/')
        .then(res => res.json())
}

/* * * * * * * * * * *
 * CAMALIZE STRINGS  *
** * * * * * * * * * */
export function camalize (str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/* * * * * * * * * * * * * * * * *
 * GET CORRECT ENVIRONMENT COLOR *
** * * * * * * * * * * * * * * * */
export function getColor (key, environment = 'STUDENT', fallback = '#000000') {
    if (COLORS[key]) {
        return COLORS[key];
    }

    const envColors = {
        ...ENV_COLORS._DEFAULT_,
        ...ENV_COLORS[environment]
    };

    const validKeys = Object.keys(envColors);

    if (!validKeys.includes(key)) {
        return fallback;
    }

    return COLORS[envColors[key]];
};
