const nullId = '00000000';

export function newId() {
	return nullId.replace(/0/g, () => (Math.floor(Date.now() + Math.random() * 16) % 16).toString(16));
}
