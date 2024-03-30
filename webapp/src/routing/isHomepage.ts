export const isHomepage = (url = new URL(location.href)) => {
	if (url.pathname === "/") return true
	if (url.pathname === "/index.html") return true
	return false
}
