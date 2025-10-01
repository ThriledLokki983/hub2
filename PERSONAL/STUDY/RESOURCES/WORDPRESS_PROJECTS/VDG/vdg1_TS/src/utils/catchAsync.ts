/** @format */

import { Request, Response, NextFunction } from "express";
/**
 *
 * @param {Async function} fn - returns a promise and when there is an error, the catch will pass the error to the next() function, which then further passes it on to the global error handler and that's it. Magic! -- error is correctly handled
 * @returns {Anonymous function} - can be assigned to a parameter e.g. createUser
 */

const catchAsyncFn = (func: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		return func(req, res, next).catch((error: Error) => next(error.message));
	};
};

export default catchAsyncFn;
