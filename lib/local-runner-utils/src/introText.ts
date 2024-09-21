import figlet from 'figlet'

export const introText = (text: string) => {
	console.log(
		figlet.textSync(text, {
			font: 'Sub-Zero',
			whitespaceBreak: true,
		}),
	)
}
