/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {createResourceURL, fetch, openToast} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import DocumentPreviewer from '../../components/document-previewer/DocumentPreviewer';
import {DOCUSIGN_STATUS} from '../../utils/contants';

const KeyPair = ({children, colon = true, question}) => (
	<div>
		<b>
			{question} {colon && ':'}
		</b>
		<span className="ml-1">{children}</span>
	</div>
);

function EnvelopeView({
	baseResourceURL,
	match: {
		params: {envelopeId},
	},
}) {
	const [{envelope, fileEntryDetails, isLoading}, setEnvelope] = useState({
		isLoading: true,
	});

	const getEnvelope = async () => {
		try {
			const response = await fetch(
				createResourceURL(baseResourceURL, {
					envelopeId,
					p_p_resource_id: '/digital_signature/get_ds_envelope',
				})
			);

			const data = await response.json();

			setEnvelope({...data, isLoading: false});
		} catch (e) {
			openToast({
				message: Liferay.Language.get('an-unexpected-error-occurred'),
				title: Liferay.Language.get('error'),
				type: 'danger',
			});
		}
	};

	useEffect(() => {
		getEnvelope();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const docusignStatus = DOCUSIGN_STATUS[envelope?.status] || {
		...DOCUSIGN_STATUS.other,
		label: envelope?.status,
	};

	if (isLoading) {
		return <ClayLoadingIndicator />;
	}

	return (
		<div className="envelope-view">
			<div className="envelope-view__header">
				<div>
					<span className="envelope-view__header__title">
						{envelope.emailSubject}
					</span>
					<ClayLabel
						className="ml-2"
						displayType={docusignStatus.color}
					>
						{docusignStatus.label}
					</ClayLabel>
				</div>
				<ClayButton>
					<ClayIcon symbol="download" />
					<span className="ml-1">
						{Liferay.Language.get('download')}
					</span>
				</ClayButton>
			</div>

			{fileEntryDetails?.previewFileURL && (
				<DocumentPreviewer
					baseImageURL={fileEntryDetails.previewFileURL}
					initialPage={fileEntryDetails.initialPage}
					totalPages={fileEntryDetails.previewFileCount}
				/>
			)}

			<div className="envelope-view__details">
				<div>
					<b>Envelope ID</b>: {envelopeId}
				</div>
				<hr />
				<KeyPair colon={false} question="Please Sign" />
				<KeyPair question="To">sender@email.com</KeyPair>
				<KeyPair question="From">recipient@email.com</KeyPair>

				<pre>
					Raylife Insurance lfrgs-liferay-damage-control@liferay.com
					Makena Ford, Please DocuSign Sample Insurance ESign Doc.pdf
					Thank You, Raylife Insurance
				</pre>
			</div>
		</div>
	);
}

export default EnvelopeView;
