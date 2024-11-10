'use client'

import {
	VideoCreationStatus,
	type VideoStatusQuery,
	type VideoStatusQueryVariables,
} from '@/lib/graphql/generated/graphql'
import { videoStatusQuery } from '@/lib/graphql/queries/videoStatusQuery'
import { useVideoStore } from '@/hooks/useVideoStore'
import { type ApolloError, useQuery } from '@apollo/client'
import { useEffect } from 'react'

const POLL_INTERVAL_MS = 10 * 1000

export const useVideoStatus = (): {
	status?: VideoCreationStatus
	loading: boolean
	error?: ApolloError
} => {
	const { trackingId, setTrackingId } = useVideoStore((state) => ({
		trackingId: state.trackingId,
		setTrackingId: state.setTrackingId,
	}))
	const { data, loading, error } = useQuery<
		VideoStatusQuery,
		VideoStatusQueryVariables
	>(videoStatusQuery, {
		variables: { trackingId: trackingId ?? '' },
		skip: trackingId === null,
		pollInterval: trackingId ? POLL_INTERVAL_MS : 0,
	})
	const status = data?.videoStatus.status ?? undefined
	const isFinished =
		status === VideoCreationStatus.Complete ||
		status === VideoCreationStatus.Failed

	useEffect(() => {
		if (isFinished) {
			setTrackingId(undefined)
		}
	}, [isFinished, setTrackingId])

	return { status, loading, error }
}
