export type InputState = {
	inputBucket: string
	inputKey: string
	outputBucket: string
}

type OutputState =
	| {
			outputBucket: string
			outputKey: string
	  }
	| { error: string }
