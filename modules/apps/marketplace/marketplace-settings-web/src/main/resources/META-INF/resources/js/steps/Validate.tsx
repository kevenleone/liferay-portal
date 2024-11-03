/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {fetch} from 'frontend-js-web';
import React, {useState} from 'react';

import MarketplaceIcon from '../assets/Marketplace';

type ValidateProps = {
	decodedToken: {
		header: {
			alg: string;
			typ: string;
		};
		payload: {
			data: {
				accountId: number;
				accountImage: string;
				accountName: string;
				userId: string;
				userName: string;
			};
			domain: string;
			url: string;
		};
		signature: string;
	};
	onBack: () => void;
	onNext: () => void;
	token: string;
};

async function validateToken(url: string, data: any) {
	const response = await fetch(url, {
		body: JSON.stringify({
			...data,
			companyId: Liferay.ThemeDisplay.getCompanyId(),
			origin: window.location.origin,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	return response.json();
}

async function saveClientToken(data: unknown) {
	const response = await Liferay.Util.fetch('/o/c/oauth2clientcontrollers', {
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	return response.json();
}

export default function Validate({
	decodedToken,
	onBack,
	onNext,
	token,
}: ValidateProps) {
	const [loading, setLoading] = useState(false);

	const onValidate = async () => {
		const {
			payload: {data: payloadData, domain, url},
		} = decodedToken;

		setLoading(true);

		const response = await validateToken(url, payloadData);

		await saveClientToken({
			proxyURL: new URL(url).origin,
			token,
			url: domain,
			uuid: response.externalReferenceCode,
		});

		setLoading(false);

		onNext();
	};

	return (
		<div>
			<div className="border mb-4 p-2">
				<div className="align-items-center d-flex justify-content-between">
					<div className="align-items-center d-flex">
						<img
							className="rounded"
							draggable={false}
							height={42}
							src={decodedToken.payload.data.accountImage}
							width={42}
						/>

						<div className="ml-2">
							<h3 className="mb-0">
								{decodedToken.payload.data.accountName}
							</h3>

							<small className="text-secondary">
								<b className="mr-1">Account Owner:</b>

								{decodedToken.payload.data.userName}
							</small>
						</div>
					</div>

					<ClayButton
						className="align-items-center d-flex"
						displayType="secondary"
						onClick={() =>
							window.open(
								decodedToken.payload.domain +
									'/web/marketplace/customer-dashboard/#/connection-tokens'
							)
						}
						size="sm"
					>
						<MarketplaceIcon className="mr-1" /> Dashboard
					</ClayButton>
				</div>
			</div>

			<div className="d-flex justify-content-between">
				<ClayButton
					disabled={loading}
					displayType="secondary"
					onClick={onBack}
				>
					Back
				</ClayButton>

				<ClayButton
					disabled={loading}
					displayType="primary"
					onClick={onValidate}
				>
					Validate
				</ClayButton>
			</div>
		</div>
	);
}
