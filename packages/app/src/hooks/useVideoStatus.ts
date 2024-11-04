'use client'

import {
	VideoStatus,
	type VideoStatusQuery,
	type VideoStatusQueryVariables,
} from '@/lib/graphql/generated/graphql'
import { videoStatusQuery } from '@/lib/graphql/queries/videoStatusQuery'
import { type ApolloError, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const POLL_INTERVAL_MS = 15 * 1000
const POLLING_DURATION_MS = 10 * 60 * 1000

export const useVideoStatus = (
	trackingId: string | undefined,
	setTrackingId: (trackingId?: string) => void,
): {
	status?: VideoStatus
	loading: boolean
	error?: ApolloError
} => {
	const [isPolling, setIsPolling] = useState(false)
	const { data, loading, error, startPolling, stopPolling } = useQuery<
		VideoStatusQuery,
		VideoStatusQueryVariables
	>(videoStatusQuery, {
		variables: { trackingId: trackingId ?? '' },
		skip: trackingId === null,
	})

	useEffect(() => {
		if (trackingId && !isPolling) {
			startPolling(POLL_INTERVAL_MS)
			setIsPolling(true)
		}
		const handler = setTimeout(() => {
			stopPolling()
			setIsPolling(false)
		}, POLLING_DURATION_MS)

		return () => clearTimeout(handler)
	}, [trackingId, startPolling, stopPolling, isPolling])

	const status = data?.videoStatus.status
	const isFinished = status === VideoStatus.Complete || VideoStatus.Failed

	useEffect(() => {
		if (isFinished) {
			setTrackingId(undefined)
		}
	}, [isFinished, setTrackingId])

	return { status, loading, error }
}
