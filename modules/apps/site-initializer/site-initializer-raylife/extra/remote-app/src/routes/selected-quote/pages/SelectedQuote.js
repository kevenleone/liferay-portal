/* eslint-disable no-console */
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

const CheckButton = ({checked, expanded, hasError = false}) => (
	<div className="panel-right">
		<div
			className={classNames('panel-right-icon', {
				'step-checked': checked && !hasError && !expanded,
			})}
		>
			<ClayIcon symbol="check" />
		</div>
	</div>
);

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

				return;
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
									payload: {
										panelKey: 'uploadDocuments',
										value: true,
									},
									type: ACTIONS.SET_EXPANDED,
								});

								dispatch({
									payload: {
										panelKey: 'uploadDocuments',
										value: false,
									},
									type: ACTIONS.SET_STEP_CHECKED,
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

			<CheckButton
				checked={checked}
				expanded={expanded}
				hasError={hasError}
			/>
		</div>
	);
};

const SelectedQuote = () => {
	const [{sections}] = useContext(SelectedQuoteContext);

	return (
		<div className="selected-quote">
			<QuoteInfo />

			<div className="selected-quote-right-page">
				<Panel
					PanelRight={CheckButton}
					id="createAnAccount"
					title="1. Create an Account"
				>
					<CreateAnAccount />
				</Panel>

				<Panel
					PanelMiddle={({checked, expanded}) => (
						<div className="panel-middle">
							{!expanded && checked && (
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
