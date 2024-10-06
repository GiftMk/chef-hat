import type { CreateJobCommandInput } from '@aws-sdk/client-mediaconvert'
import type { MediaConvertConfig } from './MediaConvertConfig'
import type { InputState } from './InputState'

export const getMediaConvertJob = (
	config: MediaConvertConfig,
	state: InputState,
): CreateJobCommandInput => ({
	Queue: config.queue,
	UserMetadata: {},
	Role: config.role,
	Settings: {
		TimecodeConfig: {
			Source: 'ZEROBASED',
		},
		OutputGroups: [
			{
				Name: 'File Group',
				Outputs: [
					{
						ContainerSettings: {
							Container: 'MP4',
							Mp4Settings: {},
						},
						VideoDescription: {
							Width: state.video.width,
							Height: state.video.height,
							VideoPreprocessors: {
								ImageInserter: {
									InsertableImages: [
										{
											ImageX: 0,
											ImageY: 0,
											Layer: 1,
											ImageInserterInput: `${state.image.bucket}/${state.image.key}`,
											Opacity: 100,
										},
									],
									SdrReferenceWhiteLevel: 203,
								},
							},
							CodecSettings: {
								Codec: 'H_264',
								H264Settings: {
									ParNumerator: 40,
									FramerateDenominator: 1,
									MaxBitrate: 8000000,
									ParDenominator: 33,
									FramerateControl: 'SPECIFIED',
									RateControlMode: 'QVBR',
									FramerateNumerator: 30,
									SceneChangeDetect: 'TRANSITION_DETECTION',
									ParControl: 'SPECIFIED',
								},
							},
						},
						AudioDescriptions: [
							{
								AudioSourceName: 'Audio Selector 1',
								CodecSettings: {
									Codec: 'AAC',
									AacSettings: {
										Bitrate: 96000,
										CodingMode: 'CODING_MODE_2_0',
										SampleRate: 48000,
									},
								},
							},
						],
					},
				],
				OutputGroupSettings: {
					Type: 'FILE_GROUP_SETTINGS',
					FileGroupSettings: {
						Destination: state.outputBucket,
					},
				},
			},
		],
		FollowSource: 1,
		Inputs: [
			{
				AudioSelectors: {
					'Audio Selector 1': {
						DefaultSelection: 'DEFAULT',
					},
				},
				TimecodeSource: 'ZEROBASED',
				FileInput: `${state.audio.bucket}/${state.audio.key}`,
			},
		],
	},
	BillingTagsSource: 'JOB',
	AccelerationSettings: {
		Mode: 'DISABLED',
	},
	StatusUpdateInterval: 'SECONDS_60',
	Priority: 0,
})
