// See also https://no-color.org/
const NO_COLOR = process.env.NO_COLOR

// Few ANSI color codes
// Reference: https://telepathy.freedesktop.org/doc/telepathy-glib/telepathy-glib-debug-ansi.html
// See also: https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const color = {
	reset: "\x1b[0m",
	bg: {
		red: "\x1b[41m",
		green: "\x1b[42m"
	}
}

export const OK = (condition?: boolean, text = String(Boolean(condition))) =>
	NO_COLOR
		? text
		: `${condition ? color.bg.green : color.bg.red}${text}${color.reset}`
