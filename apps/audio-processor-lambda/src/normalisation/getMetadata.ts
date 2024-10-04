import type { LoudnormMetadata } from './LoudnormMetadata'
import ffmpeg from 'fluent-ffmpeg'
import {
	type Result,
	emptySuccess,
	failure,
	getValueOrThrow,
	isFailure,
} from '@chef-hat/ts-result'
import { LoudnormJsonExtractor } from './loudnormJsonExtractor'
import { getMetadataFromJson } from './getMetadataFromJson'
import type { NormalisationSettings } from './NormalisationSettings'
import { getInputOptions } from './getInputOptions'

export const getMetadata = async (
	audioPath: string,
	settings: NormalisationSettings,
): Promise<Result<LoudnormMetadata>> => {
	const loudnormJsonExtractor = new LoudnormJsonExtractor()

	const result = await new Promise<Result>((resolve, reject) => {
		ffmpeg(audioPath)
			.audioFilters([
				{
					filter: 'loudnorm',
					options: [...getInputOptions(settings), 'print_format=json'],
				},
			])
			.audioQuality(320)
			.format('null')
			.on('start', (command) =>
				console.log(`Started normalising audio with command ${command}`),
			)
			.on('stderr', (line) => loudnormJsonExtractor.consume(line))
			.on('end', () => resolve(emptySuccess()))
			.on('error', (e) => reject(failure(e.message)))
			.saveToFile('-')
	})

	if (isFailure(result)) {
		return result
	}

	const extractResult = loudnormJsonExtractor.extract()
	if (isFailure(extractResult)) {
		return extractResult
	}
	const loudnormJson = getValueOrThrow(extractResult)
	return getMetadataFromJson(loudnormJson)
}
