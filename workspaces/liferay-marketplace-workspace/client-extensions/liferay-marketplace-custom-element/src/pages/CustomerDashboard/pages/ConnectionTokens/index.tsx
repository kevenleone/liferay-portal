/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {format} from 'date-fns';
import {useEffect, useState} from 'react';
import useSWR from 'swr';

import EmptyState from '../../../../components/EmptyState';
import Loading from '../../../../components/Loading';
import Table from '../../../../components/Table/Table';
import JWT from '../../../../core/JWT';
import useModalContext from '../../../../hooks/useModalContext';
import i18n from '../../../../i18n';
import {Liferay} from '../../../../liferay/liferay';
import fetcher from '../../../../services/fetcher';
import {MarketplaceSpringBootOAuth2} from '../../../../services/oauth/OAuth2Client';
import {copyToClipboard} from '../../../../utils/browser';
import {useOutletContext} from 'react-router-dom';

const DataSources = () => {
	const {
		data: projectDataSources,
		isLoading,
		isValidating,
		mutate,
	} = useSWR(`/oauth2-servers`, () =>
		fetcher('/o/c/oauth2servercontrollers')
	);

	const onRevoke = async (row: {id: number}) => {
		if (
			!confirm(
				i18n.sub(
					'x-will-be-deleted-and-this-action-cant-be-undone-are-you-sure-you-want-to-delete-it',
					'Data Source'
				)
			)
		) {
			return;
		}

		await fetcher.delete(`/o/c/oauth2servercontrollers/${row.id}`);

		mutate((data: any) => data, {revalidate: true});
	};

	const {items = [], totalCount} = projectDataSources || {};

	if (isLoading) {
		return <Loading className="my-6" shape="circle" size="md" />;
	}

	if (totalCount === 0) {
		return (
			<EmptyState
				description="No data source was found, copy the token above and associate it with a Liferay DXP."
				type="BLANK"
			>
				<ClayButton
					disabled={isValidating}
					displayType="secondary"
					onClick={() => mutate((data) => data, {revalidate: true})}
					size="sm"
				>
					Refresh
				</ClayButton>
			</EmptyState>
		);
	}

	return (
		<Table
			columns={[
				{
					key: 'name',
					render: () => 'Liferay DXP',
					title: 'Name',
				},
				{
					key: 'origin',
					render: (origin) => (
						<a href={origin} rel="noopener " target="_blank">
							{origin}
						</a>
					),
					title: 'Origin',
				},

				{
					key: 'dateCreated',
					render: (dateCreated) =>
						format(new Date(dateCreated), 'dd MMM, yyyy'),
					title: 'Date Added',
				},
				{
					key: 'status',
					render: () => (
						<ClayLabel displayType="success">Active</ClayLabel>
					),
					title: 'Status',
				},
				{
					key: 'actions',
					render: (_, row) => (
						<ClayButton
							displayType="secondary"
							onClick={() => onRevoke(row)}
							size="xs"
						>
							Revoke
						</ClayButton>
					),
					title: 'Actions',
				},
			]}
			rows={items}
		/>
	);
};

const ConnectionTokens = () => {
	const {selectedAccount} = useOutletContext<{selectedAccount: Account}>();
	const [projectDataSourceToken, setProjectDataSourceToken] = useState('');
	const modal = useModalContext();

	useEffect(() => {
		JWT.createJWT(
			{
				data: {
					accountImage: selectedAccount.logoURL,
					accountId: Liferay.CommerceContext.account?.accountId,
					accountName: selectedAccount.name,
					userId: Liferay.ThemeDisplay.getUserId(),
					userName: Liferay.ThemeDisplay.getUserName(),
				},
				domain: window.location.origin,
				url:
					new MarketplaceSpringBootOAuth2().getHomePageURL() +
					'/dxp/connect',
			},
			'marketplace'
		)
			.then(setProjectDataSourceToken)
			.catch(console.error);
	}, []);

	return (
		<div className="rounded w-100">
			<div className="border col-6 col-lg-6 col-md-12 p-4">
				<div className="align-items-center d-flex justify-content-between">
					<h3>Connect Your Marketplace Account with Liferay DXP</h3>

					<div
						className="align-items-center d-flex justify-content-center"
						style={{
							backgroundColor: '#dadada',
							borderRadius: '50%',
							height: 40,
							width: 40,
						}}
					>
						<ClayIcon symbol="diagram" />
					</div>
				</div>

				<div className="mt-2 py-3">
					<label htmlFor="token">
						Copy this token to your Liferay DXP Instance
					</label>

					<div className="align-items-center d-flex">
						<ClayInput
							disabled
							id="token"
							name="token"
							readOnly
							style={{paddingRight: 20}}
							value={projectDataSourceToken}
						/>

						<ClayIcon
							color="gray"
							onClick={() => {
								copyToClipboard(projectDataSourceToken);

								Liferay.Util.openToast({
									message: i18n.sub(
										'copied-x-to-the-clipboard',
										'token'
									),
									title: i18n.translate('success'),
								});
							}}
							style={{
								backgroundColor: 'white',
								cursor: 'pointer',
								marginLeft: -30,
							}}
							symbol="copy"
						/>
					</div>
				</div>

				<a
					href="https://learn.liferay.com/en/w/analytics-cloud/getting-started/connecting-liferay-dxp-to-analytics-cloud"
					rel="noopener noreferrer"
					target="_blank"
				>
					Click here to learn how to connect Liferay DXP to Analytics
					Cloud
				</a>
			</div>

			<div className="border mt-4 p-4">
				<h3 className="mb-4">Data Sources</h3>

				<DataSources />
			</div>
		</div>
	);
};

export default ConnectionTokens;
