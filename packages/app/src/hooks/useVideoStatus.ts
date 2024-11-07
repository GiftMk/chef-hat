'use client'

import {
	VideoStatus,
	type VideoStatusQuery,
	type VideoStatusQueryVariables,
} from '@/lib/graphql/generated/graphql'
import { videoStatusQuery } from '@/lib/graphql/queries/videoStatusQuery'
import { useVideoStore } from '@/hooks/useVideoStore'
import { type ApolloError, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

const POLL_INTERVAL_MS = 15 * 1000
const POLLING_DURATION_MS = 10 * 60 * 1000

export const useVideoStatus = (): {
	status?: VideoStatus
	loading: boolean
	error?: ApolloError
} => {
	const { trackingId, setTrackingId } = useVideoStore((state) => ({
		trackingId: state.trackingId,
		setTrackingId: state.setTrackingId,
	}))
	const [isPolling, setIsPolling] = useState(false)
	const { data, loading, error, startPolling, stopPolling } = useQuery<
		VideoStatusQuery,
		VideoStatusQueryVariables
	>(videoStatusQuery, {
		variables: { trackingId: trackingId ?? '' },
		skip: trackingId === null,
	})
	const status = data?.videoStatus.status ?? undefined
	const isFinished =
		status === VideoStatus.Complete || status === VideoStatus.Failed

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

	useEffect(() => {
		if (isFinished && isPolling) {
			stopPolling()
			setTrackingId(undefined)
		}
	}, [isFinished, setTrackingId, stopPolling, isPolling])

	return { status, loading, error }
}
