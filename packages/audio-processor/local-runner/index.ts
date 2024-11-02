import {
	introText,
	selectFile,
	INPUTS_DIRECTORY,
	OUTPUTS_DIRECTORY,
} from '@chef-hat/local-runner'
import { normaliseAudio } from '../src/normalisation/normaliseAudio'
import path from 'node:path'
import { isFailure, isSuccess } from '@chef-hat/ts-result'
import ora from 'ora'

introText('Audio Processor')

const audioPath = await selectFile(
	INPUTS_DIRECTORY,
	'Please select an audio file',
)
const outputPath = path.join(
	OUTPUTS_DIRECTORY,
	`${new Date().toLocaleTimeString()}.wav`,
)

const spinner = ora().start()
const result = await normaliseAudio(audioPath, outputPath)

if (isSuccess(result)) {
	spinner.succeed()
}

if (isFailure(result)) {
	spinner.fail(result.error)
}
