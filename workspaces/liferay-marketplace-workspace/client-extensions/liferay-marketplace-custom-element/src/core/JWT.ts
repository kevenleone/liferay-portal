/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const headerObj = {
	alg: 'HS256',
	typ: 'JWT',
};

export default class JWT {
	static base64UrlEncode(text: string) {
		return btoa(text)
			.replace(/=/g, '')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
	}

	static async createSignature(
		header: string,
		payload: unknown,
		secret: string
	) {
		const encoder = new TextEncoder();

		const data = encoder.encode(header + '.' + payload);

		const key = await crypto.subtle.importKey(
			'raw',
			encoder.encode(secret),
			{hash: {name: 'SHA-256'}, name: 'HMAC'},
			false,
			['sign']
		);

		const signature = await crypto.subtle.sign('HMAC', key, data);

		return this.base64UrlEncode(
			String.fromCharCode(...new Uint8Array(signature))
		);
	}

	static async createJWT(payloadObj: unknown, secret: string) {
		const header = this.base64UrlEncode(JSON.stringify(headerObj));
		const payload = this.base64UrlEncode(JSON.stringify(payloadObj));

		const signature = await this.createSignature(header, payload, secret);

		return `${header}.${payload}.${signature}`;
	}
}
