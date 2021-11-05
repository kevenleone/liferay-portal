import {axios} from '~/common/services/liferay/api';

const DeliveryAPI = 'o/headless-commerce-admin-order';

export const createOrders = (accountId, channelId, skuId) => {
	const payload = {
		accountId,
		channelId,
		currencyCode: 'USD',
		orderItems: [
			{
				quantity: 1,
				skuId,
			},
		],
		orderStatus: 2,
		shippingAmount: 0,
		shippingWithTaxAmount: 0,
	};

	return axios.post(`${DeliveryAPI}/v1.0/orders`, payload);
};
