import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type CreateVideoResponse = {
  __typename?: 'CreateVideoResponse';
  downloadUrl: Scalars['String']['output'];
  trackingId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createVideo?: Maybe<CreateVideoResponse>;
};


export type MutationCreateVideoArgs = {
  input: CreateVideoInput;
};

export type Query = {
  __typename?: 'Query';
  uploadDetails: UploadDetails;
  videoStatus: VideoStatusResponse;
};


export type QueryUploadDetailsArgs = {
  input: UploadDetailsInput;
};


export type QueryVideoStatusArgs = {
  trackingId: Scalars['ID']['input'];
};

export type UploadDetails = {
  __typename?: 'UploadDetails';
  audioFilename: Scalars['String']['output'];
  audioUploadUrl: Scalars['String']['output'];
  imageFilename: Scalars['String']['output'];
  imageUploadUrl: Scalars['String']['output'];
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

export type VideoStatusResponse = {
  __typename?: 'VideoStatusResponse';
  status?: Maybe<VideoStatus>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateVideoInput: CreateVideoInput;
  CreateVideoResponse: ResolverTypeWrapper<CreateVideoResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UploadDetails: ResolverTypeWrapper<UploadDetails>;
  UploadDetailsInput: UploadDetailsInput;
  VideoStatus: VideoStatus;
  VideoStatusResponse: ResolverTypeWrapper<VideoStatusResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateVideoInput: CreateVideoInput;
  CreateVideoResponse: CreateVideoResponse;
  ID: Scalars['ID']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  UploadDetails: UploadDetails;
  UploadDetailsInput: UploadDetailsInput;
  VideoStatusResponse: VideoStatusResponse;
}>;

export type CreateVideoResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVideoResponse'] = ResolversParentTypes['CreateVideoResponse']> = ResolversObject<{
  downloadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trackingId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createVideo?: Resolver<Maybe<ResolversTypes['CreateVideoResponse']>, ParentType, ContextType, RequireFields<MutationCreateVideoArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  uploadDetails?: Resolver<ResolversTypes['UploadDetails'], ParentType, ContextType, RequireFields<QueryUploadDetailsArgs, 'input'>>;
  videoStatus?: Resolver<ResolversTypes['VideoStatusResponse'], ParentType, ContextType, RequireFields<QueryVideoStatusArgs, 'trackingId'>>;
}>;

export type UploadDetailsResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadDetails'] = ResolversParentTypes['UploadDetails']> = ResolversObject<{
  audioFilename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  audioUploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageFilename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VideoStatusResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoStatusResponse'] = ResolversParentTypes['VideoStatusResponse']> = ResolversObject<{
  status?: Resolver<Maybe<ResolversTypes['VideoStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateVideoResponse?: CreateVideoResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UploadDetails?: UploadDetailsResolvers<ContextType>;
  VideoStatusResponse?: VideoStatusResponseResolvers<ContextType>;
}>;

