import ProductComparison from '~/common/components/product-comparison';
import {STORAGE_KEYS, Storage} from '~/common/services/liferay/storage';

const applicationId = Storage.getItem(STORAGE_KEYS.APPLICATION_ID);

const QuoteInfo = ({product}) => {
	const onClickPolicyDetails = () => {};

	return (
		<div className="quote-info">
			{product.id && (
				<ProductComparison
					highlightMostPopularText="Great Coverage"
					onClickPolicyDetails={onClickPolicyDetails}
					product={product}
					purchasable={false}
				/>
			)}

			<div className="policy-id">POLICY {`#${applicationId}`}</div>
		</div>
	);
};

export default QuoteInfo;
