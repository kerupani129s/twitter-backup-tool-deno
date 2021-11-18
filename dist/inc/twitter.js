import hmacSha1 from './hmac-sha1.js';
import * as base64 from 'https://denopkg.com/chiefbiiko/base64/mod.ts';
import * as hex from 'https://deno.land/std/encoding/hex.ts';

export default class Twitter {

	#options;

	constructor(options) {
		this.#options = options;
	}

	get(path, paramsObj) {
		return this.#request('GET', path, paramsObj);
	}

	async #request(method, path, paramsObj) {

		const url = this.#getRestUrl(path);
		const params = this.#objToArray(paramsObj);

		// 認証情報
		const authHeader = await this.#getAuthHeader(method, url, params);

		const headers = {'Authorization': authHeader};

		// 通信
		const query = this.#percentEncodeParams(params).map(pair => pair.key + '=' + pair.value).join('&');

		const response = await fetch((! params || method === 'POST' ? url : url + '?' + query), {method, headers});

		const json = await response.json();

		// response.ok で正しく判断できる？
		if ( 'errors' in json )
			throw 'TwitterApiErrors:\n' + json['errors'].map(error => '\tCode ' + error.code + ': ' + error.message).join('\n');

		return json;

	}

	async #getAuthHeader(method, url, params) {

		// パラメータ準備
		const oauthParamsObj = {
			'oauth_consumer_key'    : this.#options['api_key'],
			'oauth_nonce'           : this.#getNonce(),
			'oauth_signature_method': 'HMAC-SHA1',
			'oauth_timestamp'       : this.#getTimestamp(),
			'oauth_token'           : this.#options['access_token'],
			'oauth_version'         : '1.0'
		};

		const oauthParams = this.#objToArray(oauthParamsObj);

		const allParams = this.#percentEncodeParams([...oauthParams, ...params]);

		this.#ksort(allParams);

		// シグネチャ作成
		const signature = await this.#getSignature(method, url, allParams);

		// 認証情報
		return 'OAuth ' + this.#percentEncodeParams([...oauthParams, {key: 'oauth_signature', value: signature}]).map(pair => pair.key + '="' + pair.value + '"').join(', ');

	}

	#getSignature(method, url, allParams) {

		const allQuery = allParams.map(pair => pair.key + '=' + pair.value).join('&');

		// シグネチャベース・キー文字列
		const signatureBaseString = [
			method.toUpperCase(),
			this.#percentEncode(url),
			this.#percentEncode(allQuery)
		].join('&');

		const signatureKeyString = [
			this.#options['api_secret_key'],
			this.#options['access_token_secret']
		].map(secret => this.#percentEncode(secret)).join('&');

			// シグネチャ計算
			const signatureUint8Array = hmacSha1(signatureBaseString, signatureKeyString);

			return base64.fromUint8Array(signatureUint8Array);

	}

	#getRestUrl(path) {
		return 'https://api.twitter.com/1.1/' + path + '.json';
	}

	/**
	 * RFC3986 仕様の encodeURIComponent
	 */
	#percentEncode(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, char => '%' + char.charCodeAt().toString(16));
	}

	#percentEncodeParams(params) {

		return params.map(pair => {
			const key   = this.#percentEncode(pair.key);
			const value = this.#percentEncode(pair.value);
			return {key, value};
		});

	}

	#ksort(params) {

		return params.sort((a, b) => {
			const keyA = a.key;
			const keyB = b.key;
			if ( keyA < keyB ) return -1;
			if ( keyA > keyB ) return 1;
			return 0;
		});

	}

	#getNonce() {
		const array = new Uint8Array(32);
		window.crypto.getRandomValues(array);
		return hex.encode(array);
	}

	#getTimestamp() {
		return Math.floor(Date.now() / 1000);
	}

	#objToArray(object) {
		return Object.entries(object).map(([key, value]) => ({key, value}));
	}

}
