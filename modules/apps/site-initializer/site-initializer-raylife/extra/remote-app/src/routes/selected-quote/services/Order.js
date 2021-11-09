import {axios} from '~/common/services/liferay/api';

const DeliveryAPI = 'o/headless-commerce-admin-order';

export const createOrders = (accountId, channelId, skuId, product) => {
	const payload = {
		accountId,
		channelId,
		currencyCode: 'USD',
		orderItems: [
			{
				discountAmount: product.promo,
				finalPrice: product.promo,
				quantity: 1,
				skuId,
				unitPrice: product.price,
			},
		],
		orderStatus: 2,
		shippingAmount: 0,
		shippingWithTaxAmount: 0,
		subtotal: product.price,
		total: product.promo ? product.promo : product.price,
	};

	return axios.post(`${DeliveryAPI}/v1.0/orders`, payload);
};
