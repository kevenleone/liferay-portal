import {useContext, useState} from 'react';
import {WarningBadge} from '~/common/components/fragments/Badges/Warning';

import {ApplicationPropertiesContext} from '~/common/context/ApplicationPropertiesProvider';
import {getItem} from '~/common/services/liferay/storage';
import {smoothScroll} from '~/common/utils/scroll';
import {getChannel} from '~/routes/selected-quote/services/Channel';
import {createOrders} from '~/routes/selected-quote/services/Order';
import {getSku} from '~/routes/selected-quote/services/Product';
import {
	ACTIONS,
	SelectedQuoteContext,
} from '../../../context/SelectedQuoteContextProvider';

import {
	createDocumentInFolder,
	createFolderIfNotExist,
	createRootFolders,
} from '../../../services/DocumentsAndMedia';

import UploadFiles from './UploadFiles';

const dropAreaProps = {
	heightContainer: '120px',
	limitFiles: 4,
	widthContainer: '100%',
};

const UploadDocuments = () => {
	const [{accountId, product, sections}, dispatch] = useContext(
		SelectedQuoteContext
	);
	const properties = useContext(ApplicationPropertiesContext);
	const [loading, setLoading] = useState(false);

	const setSections = (newSections) => {
		dispatch({
			payload: newSections,
			type: ACTIONS.SET_SECTIONS,
		});
	};

	const onSetError = (_section, value) => {
		setSections(
			sections.map((section) => {
				if (section.title === _section.title) {
					return {
						...section,
						error: value,
					};
				}

				return section;
			})
		);
	};

	const onSetFiles = (_section, files) => {
		setSections(
			sections.map((section) => {
				if (section.title === _section.title) {
					return {
						...section,
						files,
					};
				}

				return section;
			})
		);
	};

	const setFilePropertyValue = (id, key, value) => {
		setSections(
			sections.map((section) => ({
				...section,
				files: section.files.map((fileEntry) => {
					if (fileEntry.id === id) {
						fileEntry[key] = value;

						return fileEntry;
					}

					return fileEntry;
				}),
			}))
		);
	};

	const getChannelId = async () => {
		const {
			data: {items},
		} = await getChannel();

		return items[0].id;
	};

	const getSkuId = async () => {
		const {
			basics: {productQuote},
		} = JSON.parse(getItem('raylife-application-form'));

		const {
			data: {items},
		} = await getSku(productQuote);

		return items[0].id;
	};

	const createOrder = () => {
		Promise.all([getChannelId(), getSkuId()]).then((response) => {
			const channelId = response[0];
			const skuId = response[1];

			createOrders(accountId, channelId, skuId, product).then(
				(response) => {
					const {
						data: {id},
					} = response;

					dispatch({payload: id, type: ACTIONS.SET_ORDER_ID});
				}
			);
		});
	};

	const onClickConfirmUpload = async () => {
		setLoading(true);

		const quoteFolder = await createRootFolders(
			properties.applicationsfoldername
		);

		for (const section of sections) {
			onSetError(section, false);

			const sectionFolder = await createFolderIfNotExist(
				quoteFolder.id,
				section.title,
				true
			);

			if (section.required && section.files.length === 0) {
				onSetError(section, true);

				continue;
			}

			for (const fileEntry of section.files) {
				if (fileEntry.documentId) {
					continue;
				}

				try {
					const {
						data,
					} = await createDocumentInFolder(
						sectionFolder.id,
						fileEntry,
						(progress) =>
							setFilePropertyValue(
								fileEntry.id,
								'progress',
								progress
							)
					);

					setFilePropertyValue(fileEntry.id, 'documentId', data.id);
				} catch (error) {
					console.error(error);
				}
			}
		}

		createOrder();
		setLoading(false);
		dispatch({payload: 'selectPaymentMethod', type: ACTIONS.SET_EXPANDED});
		dispatch({payload: 'uploadDocuments', type: ACTIONS.SET_EXPANDED});
		dispatch({
			payload: {panelKey: 'uploadDocuments', value: true},
			type: ACTIONS.SET_STEP_CHECKED,
		});
		smoothScroll();
	};

	return (
		<div className="upload-container">
			{sections.map((section, index) => (
				<div className="upload-section" key={index}>
					<div className="header">
						<h3 className="title">
							{section.title}
							{section.required ? (
								<span className="required">*</span>
							) : (
								<span className="optional">
									{` (optional)`}
								</span>
							)}
						</h3>

						<span className="subtitle">{section.subtitle}</span>
					</div>

					<div className="upload-content">
						<UploadFiles
							dropAreaProps={{
								...dropAreaProps,
								type: section.type,
							}}
							files={section.files}
							setFiles={(files) => onSetFiles(section, files)}
							title={section.title}
						/>
					</div>

					{section.error && (
						<div className="upload-alert">
							<WarningBadge>
								<div className="alert-content">
									<div className="alert-description">
										{section.errorMessage}
									</div>
								</div>
							</WarningBadge>
						</div>
					)}
				</div>
			))}
			<div className="upload-footer">
				<button
					className="btn btn-lg btn-primary"
					disabled={loading}
					onClick={onClickConfirmUpload}
				>
					CONFIRM UPLOADS
				</button>
			</div>
		</div>
	);
};

export default UploadDocuments;
