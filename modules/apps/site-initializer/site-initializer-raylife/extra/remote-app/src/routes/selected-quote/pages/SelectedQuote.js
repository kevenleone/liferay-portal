import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import {CreateAnAccount} from '../components/Steps/CreateAnAccount';
import Panel from '../components/Steps/Panel';
import ViewFilesPanel from '../components/Steps/Panel/ViewFilesPanel';
import PaymentMethod from '../components/Steps/PaymentMethod';
import UploadDocuments from '../components/Steps/UploadDocuments';
import QuoteInfo from '../components/quote-info';
import SelectedQuoteContextProvider, {
	ACTIONS,
	SelectedQuoteContext,
} from '../context/SelectedQuoteContextProvider';

const DiscardChanges = ({checked, expanded, hasError}) => {
	const [showDiscardChanges, setShowDiscardChanges] = useState(false);
	const [{sections}, dispatch] = useContext(SelectedQuoteContext);

	const onDiscardChanges = () => {
		try {
			dispatch({
				payload: sections?.map((section) => {
					const discardFilesChanged = section?.files.filter(
						(file) => file.documentId
					);

					return {
						...section,
						files: discardFilesChanged,
					};
				}),
				type: ACTIONS.SET_SECTIONS,
			});
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		let filesChanged = false;

		sections?.forEach((section) => {
			const noFileDocumentsId = section.files?.some(
				(file) => !file.documentId
			);

			if (noFileDocumentsId) {
				filesChanged = true;
			}
		});

		setShowDiscardChanges(filesChanged);
	}, [sections]);

	return (
		<div className="panel-right">
			{checked && !hasError && (
				<div className="change-link">
					{!expanded ? (
						<a
							onClick={() => {
								dispatch({
									payload: 'uploadDocuments',
									type: ACTIONS.SET_EXPANDED,
								});
							}}
						>
							Change
						</a>
					) : (
						showDiscardChanges && (
							<a
								onClick={() => {
									onDiscardChanges();
								}}
							>
								Discard Changes
							</a>
						)
					)}
				</div>
			)}

			<div
				className={classNames('panel-right-icon', {
					checked: checked && !hasError && !expanded,
				})}
			>
				<ClayIcon symbol="check" />
			</div>
		</div>
	);
};

const SelectedQuote = () => {
	const [{sections}] = useContext(SelectedQuoteContext);

	return (
		<div className="selected-quote">
			<QuoteInfo />

			<div className="selected-quote-right-page">
				<Panel id="createAnAccount" title="1. Create an Account">
					<CreateAnAccount />
				</Panel>

				<Panel
					PanelMiddle={({checked, showContentPanel}) => (
						<div className="panel-middle">
							{!showContentPanel && checked && (
								<ViewFilesPanel sections={sections} />
							)}
						</div>
					)}
					PanelRight={DiscardChanges}
					changeable
					id="uploadDocuments"
					title="2. Upload Documents"
				>
					<UploadDocuments />
				</Panel>

				<Panel
					id="selectPaymentMethod"
					title="3. Select Payment Method"
				>
					<PaymentMethod />
				</Panel>
			</div>
		</div>
	);
};

export default function () {
	return (
		<SelectedQuoteContextProvider>
			<SelectedQuote />
		</SelectedQuoteContextProvider>
	);
}
