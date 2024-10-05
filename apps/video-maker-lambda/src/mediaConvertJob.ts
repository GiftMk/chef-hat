import type { CreateJobCommandInput } from '@aws-sdk/client-mediaconvert'

export const mediaConvertJob: CreateJobCommandInput = {
	Queue: 'arn:aws:mediaconvert:ap-southeast-2:319715224908:queues/Default',
	UserMetadata: {},
	Role: 'arn:aws:iam::319715224908:role/service-role/MediaConvert_Admin_Role',
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
							Width: 1920,
							Height: 1080,
							VideoPreprocessors: {
								ImageInserter: {
									InsertableImages: [
										{
											ImageX: 0,
											ImageY: 0,
											Layer: 1,
											ImageInserterInput:
												's3://cheff-hatmedia-convert-test/Inspo.png',
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
						Destination: 's3://cheff-hat-video-maker-outputs/',
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
				FileInput: 's3://cheff-hat-video-maker-inputs/lagoon.wav',
			},
		],
	},
	BillingTagsSource: 'JOB',
	AccelerationSettings: {
		Mode: 'DISABLED',
	},
	StatusUpdateInterval: 'SECONDS_60',
	Priority: 0,
}
