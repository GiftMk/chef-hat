import ffmpeg from 'fluent-ffmpeg'
import {
	type Result,
	emptySuccess,
	failure,
	getValueOrThrow,
	isFailure,
} from '@chef-hat/ts-result'
import { getMetadata } from './getMetadata'

export const normaliseAudio = async (
	audioPath: string,
	outputPath: string,
): Promise<Result> => {
	const metadataResult = await getMetadata(audioPath)
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
						'I=-16',
						'TP=-1.5',
						'LRA=11',
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
