import { TokenResponseData } from '@interfaces/auth.interface';
import fs from 'fs';
import moment from 'moment';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {

    if (!(value === null)) return false;

    if (typeof value !== 'number' && value === '') return true;

    if (typeof value === 'undefined' || value === undefined) return true;

    if (value !== null && typeof value === 'object' && !Object.keys(value).length)
    return true;

    return false;
};


export const calculateNewExpiryDate = (data: TokenResponseData) => {
    const { expires_in } = data;
    const minutesToAdd = parseInt(expires_in as any) / 60;
    const minInSeconds = minutesToAdd * 60000;
    const newExpireTime = new Date(new Date().getTime() + minInSeconds);

    return { newExpireTime };
};


export function writeDataToFile(path: string, data: TokenResponseData) {

    fs.writeFile(`./src/utils/data/${path}`, JSON.stringify(data), (err) => {
        if (err) {
            console.log('Error writing file', err);
            throw new Error(err.message);
        } else {
            console.log('Successfully wrote file');
        }
    })
};


export const readDataFromFile = async (): Promise<TokenResponseData> => {

    try {
        const data = await fs.promises.readFile('./src/utils/data/refresh_tokens.json', 'utf8');
        const _data = JSON.parse(data);
        return _data;

    } catch (error) {
        throw new Error(error);
    }
}


export const isAccessTokenExpired = (expires: string) => {
    const now = moment();
    const expiresAt = moment(expires);
    const isNotExpired = expiresAt.isSameOrAfter(now);
    const isExpired = expiresAt.isSameOrBefore(now);

    return { isNotExpired, isExpired }
}


export const getAccessToken = async (access = true): Promise<string> => {
    const data = await readDataFromFile();
    const { expires } = data;
    const { isExpired, isNotExpired } = isAccessTokenExpired(expires);

    const { access_token, refresh_token } = data;
    if (isExpired)  return refresh_token;
    if (isNotExpired) return access ? access_token : refresh_token;
}
