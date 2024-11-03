import { graphql } from '../generated'

export const createVideoMutation = graphql(`
  mutation CreateVideo($input: CreateVideoInput!) {
    createVideo(input: $input) {
      downloadUrl,
      trackingId
    }
  }
`)
