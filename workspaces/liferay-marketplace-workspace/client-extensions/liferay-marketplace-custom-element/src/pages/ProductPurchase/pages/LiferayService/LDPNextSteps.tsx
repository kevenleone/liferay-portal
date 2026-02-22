/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useEffect} from 'react';

import Loading from '../../../../components/Loading';
import {OrderStatus} from '../../../../enums/Order';
import {usePlacedOrder} from '../../../../hooks/data/usePlacedOrder';

import './LDPNextSteps.scss';

const Container = ({
	description,
	loading,
	title,
}: {
	description: string;
	loading?: boolean;
	title: string;
}) => (
	<div className="ldp-background">
		<div className="d-flex justify-content-center w-100">
			<div className="align-items-center col-3 d-flex flex-column justify-content-center mt-9">
				<div className="ldp-next-steps loading-overlay">
					<div className="loading-container">
						{loading && <Loading className="mb-6" />}

						<span className="mt-4">
							<h1>{title}</h1>
							<div className="my-5 text-center">
								<span>{description}</span>
							</div>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
);

const LDPNextSteps: React.FC<{
	description: string;
	title: string;
}> = ({description, title}) => {
	const urlParams = new URLSearchParams(window.location.search);
	const orderId = urlParams.get('orderId');

	const {data: order, error} = usePlacedOrder(orderId!!, {
		refreshInterval: 10000,
	});

	useEffect(() => {
		if (order?.orderStatusInfo?.label === OrderStatus.COMPLETED) {
			window.location.href = `/liferay-service/launch?orderId=${orderId}`;
		}
	}, [order?.orderStatusInfo?.label, orderId]);

	if (error) {
		return <Container description="" title="Something went wrong" />;
	}

	return <Container description={description} loading title={title} />;
};

export default LDPNextSteps;
