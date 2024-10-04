import { introText, selectFile } from '@chef-hat/local-runner-utils'
import { INPUTS_DIRECTORY, OUTPUTS_DIRECTORY } from './constants'
import { normaliseAudio } from '../src/normalisation/normaliseAudio'
import path from 'node:path'
import { isFailure, isSuccess } from '@chef-hat/ts-result'
import ora from 'ora'
import type { NormalisationSettings } from '../src/normalisation/NormalisationSettings'

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
const settings: NormalisationSettings = {
	integrated: -16,
	truePeak: -1.5,
	loudnessRange: 11,
}
const result = await normaliseAudio(audioPath, outputPath, settings)

if (isSuccess(result)) {
	spinner.succeed()
}

if (isFailure(result)) {
	spinner.fail(result.error)
}
