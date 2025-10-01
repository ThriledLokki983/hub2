import { useEffect } from "react"
import { useTimeOut } from "./"

export const useDebounce = (callback, delay, dependencies) => {
	const { reset, clear } = useTimeOut(callback, delay);

	useEffect(() => {
		reset()
	}, [reset, ...dependencies])

	useEffect(() => {
		return clear
	}, [])
}