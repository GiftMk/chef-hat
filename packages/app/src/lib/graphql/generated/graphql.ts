/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateVideoInput = {
  audioFilename: Scalars['String']['input'];
  imageFilename: Scalars['String']['input'];
};

export type UploadDetailsInput = {
  audioExtension: Scalars['String']['input'];
  imageExtension: Scalars['String']['input'];
};

export enum VideoStatus {
  Complete = 'COMPLETE',
  Failed = 'FAILED',
  InProgress = 'IN_PROGRESS',
  Unknown = 'UNKNOWN'
}

export type CreateVideoMutationVariables = Exact<{
  input: CreateVideoInput;
}>;


export type CreateVideoMutation = { __typename?: 'Mutation', createVideo?: { __typename?: 'CreateVideoResponse', downloadUrl: string, trackingId: string } | null };

export type UploadDetailsQueryVariables = Exact<{
  input: UploadDetailsInput;
}>;


export type UploadDetailsQuery = { __typename?: 'Query', uploadDetails: { __typename?: 'UploadDetails', audioFilename: string, audioUploadUrl: string, imageFilename: string, imageUploadUrl: string } };

export type VideoStatusQueryVariables = Exact<{
  trackingId: Scalars['ID']['input'];
}>;


export type VideoStatusQuery = { __typename?: 'Query', videoStatus: { __typename?: 'VideoStatusResponse', status: VideoStatus } };


export const CreateVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"trackingId"}}]}}]}}]} as unknown as DocumentNode<CreateVideoMutation, CreateVideoMutationVariables>;
export const UploadDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UploadDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadDetailsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"audioFilename"}},{"kind":"Field","name":{"kind":"Name","value":"audioUploadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageFilename"}},{"kind":"Field","name":{"kind":"Name","value":"imageUploadUrl"}}]}}]}}]} as unknown as DocumentNode<UploadDetailsQuery, UploadDetailsQueryVariables>;
export const VideoStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VideoStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"trackingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trackingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"trackingId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<VideoStatusQuery, VideoStatusQueryVariables>;