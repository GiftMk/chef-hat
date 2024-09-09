import { makeVideo } from '../src'
import ora from 'ora'
import { selectFile } from '@chef-hat/local-runner-utils'
import { AUDIO_DIRECTORY, IMAGES_DIRECTORY } from './constants'
import { getOutputPath } from './getOutputPath'
import figlet from 'figlet'

console.log(
	figlet.textSync('Video Maker', { font: 'Sub-Zero', whitespaceBreak: true }),
)

const audioPath = await selectFile(
	AUDIO_DIRECTORY,
	'Please select an audio file',
)
const imagePath = await selectFile(IMAGES_DIRECTORY, 'Please select an image')
const outputPath = await getOutputPath()

const spinner = ora().start()
const { errors } = await makeVideo({
	audioPath,
	imagePath,
	outputPath,
})

if (errors.length) {
	spinner.fail(
		`Failed to make video. The following error(s) occurred: ${errors.join(', ')}`,
	)
} else {
	spinner.succeed(`Video successfully written to ${outputPath}`)
}
