/// <reference types="node" />

import {Agent as httpAgent} from 'http';
import {Agent as httpsAgent} from 'https';
import {AWSError} from './error';
import {Credentials, CredentialsOptions} from './credentials';
import {ConfigurationServicePlaceholders} from './config_service_placeholders';

export class ConfigBase extends ConfigurationOptions{
    constructor(options?: ConfigurationOptions);
    /**
     * Loads credentials from the configuration object.
     */
    getCredentials(callback: (err: AWSError) => void): void;
    /**
     * Loads configuration data from a JSON file into this config object.
     * Loading configuration willr eset all existing configuration on the object.
     * This feature is not supported in the browser environment of the SDK.
     * 
     * @param {string} path - the path relative to your process's current working directory to load configuration from.
     */
    loadFromPath(path: string): Config;
    /**
     * Updates the current configuration object with new options.
     * 
     * @param {ConfigurationOptions} options - a map of option keys and values.
     * @param {boolean} allowUnknownKeys - Defaults to false. Whether unknown keys can be set on the configuration object.
     */
    update(options: ConfigurationOptions, allowUnknownKeys?: boolean): void;
    /**
     * Sets the promise dependency the SDK will use wherever Promises are returned.
     * @param {function} dep - a reference to a Promise constructor
     */
    setPromisesDependency(dep: any): void;
}

export class Config extends ConfigBase {
    /**
     * Creates a new configuration object.
     * This is the object that passes option data along to service requests, including credentials, security, region information, and some service specific settings.
     */
    constructor(options?: ConfigurationOptions & ConfigurationServicePlaceholders);
    /**
     * Updates the current configuration object with new options.
     * 
     * @param {ConfigurationOptions} options - a map of option keys and values.
     * @param {boolean} allowUnknownKeys - Defaults to false. Whether unknown keys can be set on the configuration object.
     */
    update(options: ConfigurationOptions & ConfigurationServicePlaceholders, allowUnknownKeys?: boolean): void;
}

export type GlobalConfigInstance = Config & ConfigurationServicePlaceholders;

interface HTTPOptions {
    /**
     * the URL to proxy requests through.
     */
    proxy?: string
    /**
     * the Agent object to perform HTTP requests with.
     * Used for connection pooling.
     * Defaults to the global agent (http.globalAgent) for non-SSL connections.
     */
    agent?: httpAgent | httpsAgent
    /**
     * The number of milliseconds to wait before giving up on a connection attempt.
     * Defaults to two minutes (120000).
     */
    timeout?: number
    /**
     * Whether the SDK will send asynchronous HTTP requests.
     * Used in the browser environment only.
     * Set to false to send requests synchronously.
     * Defaults to true (async on).
     */
    xhrAsync?: boolean
    /**
     * Sets the 'withCredentials' property of an XMLHttpRequest object.
     * Used in the browser environment only.
     * Defaults to false.
     */
    xhrWithCredentials?: boolean
}
interface Logger {
    write?: (chunk: any, encoding?: string, callback?: () => void) => void
    log?: (...messages: any[]) => void;
}
interface ParamValidation {
    /**
     * Validates that a value meets the min constraint. 
     * This is enabled by default when paramValidation is set to true.
     */
    min?: boolean
    /**
     * Validates that a value meets the max constraint.
     */
    max?: boolean
    /**
     * Validates that a string value matches a regular expression.
     */
    pattern?: boolean
    /**
     * Validates that a string value matches one of the allowable enum values.
     */
    enum?: boolean
}
interface RetryDelayOptions {
    /**
     * The base number of milliseconds to use in the exponential backoff for operation retries. 
     * Defaults to 100 ms.
     */
    base?: number
    /**
     * A custom function that accepts a retry count and returns the amount of time to delay in milliseconds. 
     * The base option will be ignored if this option is supplied.
     */
    customBackoff?: (retryCount: number) => number
}

declare abstract class ConfigurationOptions {
    /**
     * Whether to compute checksums for payload bodies when the service accepts it.
     * Currently supported in S3 only.
     */
    computeChecksums?: boolean
    /**
     * Whether types are converted when parsing response data.
     */
    convertResponseTypes?: boolean
    /**
     * Whether to apply a clock skew correction and retry requests that fail because of an skewed client clock.
     */
    correctClockSkew?: boolean
    /**
     * The AWS credentials to sign requests with.
     */
    credentials?: Credentials|CredentialsOptions
    /**
     * A set of options to pass to the low-level HTTP request.
     */
    httpOptions?: HTTPOptions
    /**
     * An object that responds to .write() (like a stream) or .log() (like the console object) in order to log information about requests.
     */
    logger?: Logger
    /**
     * The maximum amount of redirects to follow for a service request.
     */
    maxRedirects?: number
    /**
     * The maximum amount of retries to perform for a service request.
     */
    maxRetries?: number
    /**
     * Returns whether input parameters should be validated against the operation description before sending the request. 
     * Defaults to true. 
     * Pass a map to enable any of the following specific validation features: min|max|pattern|enum
     */
    paramValidation?: ParamValidation | boolean
    /**
     * The region to send service requests to.
     */
    region?: string
    /**
     * Returns A set of options to configure the retry delay on retryable errors.
     */
    retryDelayOptions?: RetryDelayOptions
    /**
     * Whether the provided endpoint addresses an individual bucket.
     * false if it addresses the root API endpoint.
     */
    s3BucketEndpoint?: boolean
    /**
     * Whether to disable S3 body signing when using signature version v4.
     */
    s3DisableBodySigning?: boolean
    /**
     * Whether to force path style URLs for S3 objects.
     */
    s3ForcePathStyle?: boolean
    /**
     * Whether the signature to sign requests with (overriding the API configuration) is cached.
     */
    signatureCache?: boolean
    /**
     * The signature version to sign requests with (overriding the API configuration).
     * Possible values: 'v2'|'v3'|'v4'
     */
    signatureVersion?: "v2"|"v3"|"v4"|string
    /**
     * Whether SSL is enabled for requests.
     */
    sslEnabled?: boolean
    /**
     * An offset value in milliseconds to apply to all signing times.
     */
    systemClockOffset?: number
    /**
     * Whether to use the Accelerate endpoint with the S3 service.
     */
    useAccelerateEndpoint?: boolean
}