import { graphql } from '../generated'

export const uploadDetailsQuery = graphql(`
  query UploadDetails($input: UploadDetailsInput!) {
    uploadDetails(input: $input) {
        audioFilename,
        audioUploadUrl,
        imageFilename,
        imageUploadUrl
    }
  }
`)
