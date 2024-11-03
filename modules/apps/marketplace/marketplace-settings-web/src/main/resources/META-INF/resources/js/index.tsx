/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useEffect, useState} from 'react';

import Connect from './steps/Connect';
import Status from './steps/Status';
import Step from './steps/Step';
import Validate from './steps/Validate';

const steps = [
	{
		Component: Connect,
		description:
			'Use the token generated in Marketplace to connect this workspace.',
		heading: 'Connect Marketplace',
		subTitle: '',
		title: 'Connect',
	},
	{
		Component: Validate,
		description: '',
		heading: 'Marketplace Information',
		subTitle: '',
		title: 'Validate',
	},
	{
		Component: Status,
		description: `Congratulations ${Liferay.ThemeDisplay.getUserName()}, you successfully connected to a Marketplace instance.`,
		heading: 'Status',
		subTitle: '',
		title: 'Status',
	},
];

const App = () => {
	const [oAuth2Profile, setOAuth2Profile] = useState();
	const [token, setToken] = useState('');
	const [step, setStep] = useState(0);
	const [decodedToken, setDecodedToken] = useState<any>(null);
	const currentStep = steps[step];

	const Component = currentStep.Component;

	const onNext = () => setStep(step + 1);
	const onBack = () => setStep(step - 1);

	useEffect(() => {
		async function getToken() {
			const response = await Liferay.Util.fetch(
				'/o/c/oauth2clientcontrollers'
			);

			return response.json();
		}

		getToken()
			.then((response) => setOAuth2Profile(response.items[0]))
			.catch(console.error);
	}, []);

	return (
		<div className="mt-2 pb-4 sheet-lg">
			{!oAuth2Profile && <Step step={step} steps={steps} />}

			<div className="my-2 sheet sheet-lg">
				<h3>{currentStep.heading}</h3>

				<p>{currentStep.description}</p>

				<Component
					decodedToken={decodedToken}
					oAuth2Profile={oAuth2Profile}
					onBack={onBack}
					onNext={onNext}
					setDecodedToken={setDecodedToken}
					setOAuth2Profile={setOAuth2Profile}
					setToken={setToken}
					token={token}
				/>
			</div>
		</div>
	);
};

export {App};
