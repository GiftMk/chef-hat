import figlet from 'figlet'

export const introText = (text: string) => {
	console.log(
		figlet.textSync(text, {
			width: 80,
			font: 'Sub-Zero',
			whitespaceBreak: true,
		}),
	)
}
