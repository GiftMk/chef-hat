import { selectFile, introText } from '@chef-hat/local-runner-utils'
import { INPUTS_DIRECTORY, OUTPUTS_DIRECTORY } from './constants'
import { resizeImage } from '../src/resizeImage'
import path from 'node:path'
import ora from 'ora'
import { SixteenByNine } from '../src/AspectRatio'
import { isSuccess } from '@chef-hat/ts-result'

introText('Image Processor')

const imagePath = await selectFile(INPUTS_DIRECTORY, 'Please select an image')
const outputPath = path.join(
	OUTPUTS_DIRECTORY,
	`${new Date().toUTCString()}.png`,
)
const spinner = ora().start()
const result = await resizeImage(imagePath, SixteenByNine, outputPath)

if (isSuccess(result)) {
	spinner.succeed()
} else {
	spinner.fail()
}
