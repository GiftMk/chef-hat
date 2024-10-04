import ffmpeg from 'fluent-ffmpeg'
import {
	type Result,
	emptySuccess,
	failure,
	getValueOrThrow,
	isFailure,
} from '@chef-hat/ts-result'
import { getMetadata } from './getMetadata'
import type { NormalisationSettings } from './NormalisationSettings'
import { getInputOptions } from './getInputOptions'

export const normaliseAudio = async (
	audioPath: string,
	outputPath: string,
	settings: NormalisationSettings,
): Promise<Result> => {
	const metadataResult = await getMetadata(audioPath, settings)
	if (isFailure(metadataResult)) {
		return metadataResult
	}
	const metadata = getValueOrThrow(metadataResult)

	return await new Promise<Result>((resolve, reject) =>
		ffmpeg(audioPath)
			.audioFilters([
				{
					filter: 'loudnorm',
					options: [
						...getInputOptions(settings),
						'print_format=json',
						`measured_I=${metadata.inputIntegrated}`,
						`measured_LRA=${metadata.inputLoudnessRange}`,
						`measured_TP=${metadata.inputTruePeak}`,
						`measured_thresh=${metadata.inputThreshold}`,
						`offset=${metadata.targetOffset}`,
						'linear=true',
					],
				},
			])
			.audioQuality(320)
			.on('start', (command) =>
				console.log(`Started normalising audio with command ${command}`),
			)
			.on('end', () => resolve(emptySuccess()))
			.on('error', (e) => reject(failure(e.message)))
			.saveToFile(outputPath),
	)
}
