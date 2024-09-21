import { selectFile, showIntroText } from '@chef-hat/local-runner-utils'
import { INPUTS_DIRECTORY, OUTPUTS_DIRECTORY } from './constants'
import { v4 as uuidv4 } from 'uuid'
import { resizeImage } from '../src/resizeImage'
import path from 'node:path'
import ora from 'ora'
import { SixteenByNine } from '../src/aspect-ratio/SixteenByNine'

showIntroText('Image Processor')

const imagePath = await selectFile(INPUTS_DIRECTORY, 'Please select an image')
const outputPath = path.join(OUTPUTS_DIRECTORY, `${uuidv4()}.png`)

const spinner = ora().start()
const errors = await resizeImage(imagePath, new SixteenByNine(), outputPath)

if (errors.length) {
	spinner.fail()
} else {
	spinner.succeed()
}
