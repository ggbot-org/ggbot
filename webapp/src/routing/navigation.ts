export const GOTO = (url: URL) => {
	if (url.pathname === location.pathname) return
	location.assign(url)
}
