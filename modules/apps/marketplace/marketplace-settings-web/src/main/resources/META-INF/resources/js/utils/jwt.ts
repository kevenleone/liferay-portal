/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

function base64UrlDecode(text: string) {
	const base64 = text.replace(/-/g, '+').replace(/_/g, '/');

	return decodeURIComponent(
		atob(base64)
			.split('')
			.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join('')
	);
}

export function decodeJWT(token: string) {
	const [header, payload, signature] = token.split('.');

	// Decode header and payload

	const decodedHeader = base64UrlDecode(header);
	const decodedPayload = base64UrlDecode(payload);

	return {
		header: JSON.parse(decodedHeader),
		payload: JSON.parse(decodedPayload),
		signature,
	};
}
