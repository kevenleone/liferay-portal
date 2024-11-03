/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayForm, {ClayInput} from '@clayui/form';
import {fetch} from 'frontend-js-web';
import React from 'react';

import {decodeJWT} from '../utils/jwt';

type ConnectProps = {
	oAuth2Profile: any;
	onNext: () => void;
	setDecodedToken: React.SetStateAction<any>;
	setOAuth2Profile: React.SetStateAction<any>;
	setToken: React.Dispatch<React.SetStateAction<string>>;
	token: string;
};

export default function Connect({
	oAuth2Profile,
	onNext,
	setDecodedToken,
	setOAuth2Profile,
	setToken,
	token,
}: ConnectProps) {
	const onConnect = () => {
		try {
			setDecodedToken(decodeJWT(token));

			onNext();
		}
		catch (error) {
			console.error(error);

			Liferay.Util.openToast({
				message:
					'Token is not valid. Please insert a valid Marketplace token.',
				title: Liferay.Language.get('error'),
				type: 'danger',
			});
		}
	};

	const onDisconnect = async () => {
		const response = await fetch(
			`${oAuth2Profile.proxyURL}/dxp/disconnect/${oAuth2Profile.uuid}`,
			{
				method: 'DELETE',
			}
		);

		if (response.ok) {
			await Liferay.Util.fetch(
				`/o/c/oauth2clientcontrollers/${oAuth2Profile.id}`,
				{
					method: 'DELETE',
				}
			);

			Liferay.Util.openToast({
				message:
					'Your DXP Instance is now disconnected from Marketplace',
				title: Liferay.Language.get('success'),
				type: 'success',
			});

			return setOAuth2Profile(null);
		}

		Liferay.Util.openToast({
			message: 'Unable to disconnect',
			title: Liferay.Language.get('error'),
			type: 'danger',
		});
	};

	return (
		<>
			<a
				href="https://learn.liferay.com/en/w/analytics-cloud/getting-started/connecting-liferay-dxp-to-analytics-cloud"
				rel="noopener noreferrer"
				target="_blank"
			>
				Click here to learn how to connect Liferay DXP to Marketplace
				Cloud
			</a>

			<ClayForm.Group className="mt-4">
				<label htmlFor="marketplace-token">Marketplace Token</label>

				<ClayInput
					disabled={oAuth2Profile?.token}
					name="marketplace-token"
					onChange={(event) => setToken(event.target.value)}
					placeholder="Paste token here."
					value={oAuth2Profile?.token || token}
				/>
			</ClayForm.Group>

			<div className="d-flex justify-content-end">
				{oAuth2Profile?.token ? (
					<ClayButton displayType="danger" onClick={onDisconnect}>
						{Liferay.Language.get('disconnect')}
					</ClayButton>
				) : (
					<ClayButton
						disabled={!token}
						displayType="primary"
						onClick={onConnect}
					>
						{Liferay.Language.get('connect')}
					</ClayButton>
				)}
			</div>
		</>
	);
}
