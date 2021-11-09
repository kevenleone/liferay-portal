/* eslint-disable no-console */
import React, {useEffect, useState} from 'react';

import {LiferayService} from '~/common/services/liferay';
import {STORAGE_KEYS, Storage} from '~/common/services/liferay/storage';
import {CreateAnAccount} from '../components/Steps/CreateAnAccount';
import Panel from '../components/Steps/Panel';
import PaymentMethod from '../components/Steps/PaymentMethod';
import UploadDocuments from '../components/Steps/UploadDocuments';
import QuoteInfo from '../components/quote-info';

const productId = Storage.getItem(STORAGE_KEYS.PRODUCT_ID);

export const SelectedQuote = () => {
	const [panel, setPanel] = useState({
		createAnAccount: {
			checked: false,
			expanded: true,
		},
		selectPaymentMethod: {
			checked: false,
			expanded: false,
		},
		uploadDocuments: {
			checked: false,
			expanded: false,
		},
	});

	const [sections, setSections] = useState(null);
	const [discardChanges, setDiscardChanges] = useState(false);
	const [selectedQuote, setSelectedQuote] = useState({
		accountId: 0,
		orderId: 0,
	});

	const [product, setProduct] = useState({});

	const _setPanel = (panelKey, panelKeyProperty, value) => {
		const newPanel = {...panel};

		newPanel[panelKey][panelKeyProperty] =
			value ?? !newPanel[panelKey][panelKeyProperty];

		setPanel(newPanel);
	};

	const setExpanded = (panelKey) => {
		_setPanel(panelKey, 'expanded');
	};

	const setStepChecked = (panelKey, value) => {
		_setPanel(panelKey, 'checked', value);
	};

	const hasUploadError = () => {
		const hasError = sections?.some(({error}) => error);

		return hasError;
	};

	const onSelectedQuote = (property, value) => {
		setSelectedQuote({...selectedQuote, [`${property}`]: value});
	};

	useEffect(() => {
		LiferayService.getQuoteComparisonById(productId)
			.then((product) => {
				console.log(product);
				setProduct({...product, mostPopular: true});
			})
			.catch((error) => console.error(error.message));
	}, []);

	return (
		<div className="selected-quote">
			<QuoteInfo product={product} />

			<div className="selected-quote-right-page">
				<Panel
					defaultExpanded={panel.createAnAccount.expanded}
					stepChecked={panel.createAnAccount.checked}
					title="1. Create an Account"
				>
					<CreateAnAccount
						onSelectedQuote={onSelectedQuote}
						setExpanded={setExpanded}
						setStepChecked={setStepChecked}
					/>
				</Panel>

				<Panel
					changeable
					defaultExpanded={panel.uploadDocuments.expanded}
					hasError={hasUploadError()}
					sections={sections}
					setDiscardChanges={() => setDiscardChanges(!discardChanges)}
					stepChecked={panel.uploadDocuments.checked}
					title="2. Upload Documents"
				>
					<UploadDocuments
						discardChanges={discardChanges}
						onSelectedQuote={onSelectedQuote}
						product={product}
						selectedQuote={selectedQuote}
						setDiscardChanges={() => setDiscardChanges(false)}
						setExpanded={setExpanded}
						setSection={(sections) => setSections(sections)}
						setStepChecked={setStepChecked}
					/>
				</Panel>

				<Panel
					defaultExpanded={panel.selectPaymentMethod.expanded}
					stepChecked={panel.selectPaymentMethod.checked}
					title="3. Select Payment Method"
				>
					<PaymentMethod
						product={product}
						selectedQuote={selectedQuote}
					/>
				</Panel>
			</div>
		</div>
	);
};

export const Test = () => {
	const [product, setProduct] = useState({});

	useEffect(() => {
		LiferayService.getQuoteComparisonById(productId)
			.then((product) => {
				console.log(product);
				setProduct({...product, mostPopular: true});
			})
			.catch((error) => console.error(error.message));
	}, []);

	return <PaymentMethod product={product} selectedQuote={{orderId: 44420}} />;
};

export default SelectedQuote;
