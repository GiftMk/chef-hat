import figlet from 'figlet'

export const showIntroText = (text: string) => {
	console.log(
		figlet.textSync(text, {
			font: 'Sub-Zero',
			whitespaceBreak: true,
		}),
	)
}
