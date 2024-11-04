import { graphql } from '../generated'

export const videoStatusQuery = graphql(`
  query VideoStatus($trackingId: ID!) {
    videoStatus(trackingId: $trackingId) {
      status
    }
  }
`)
