/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package headless.raylife.internal.resource.v1_0;

import com.liferay.commerce.constants.CommercePaymentConstants;
import com.liferay.commerce.exception.NoSuchOrderException;
import com.liferay.commerce.model.CommerceOrder;
import com.liferay.petra.string.CharPool;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;
import headless.raylife.resource.v1_0.OrderPaymentResource;
import com.liferay.portal.kernel.portlet.LiferayPortletRequest;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;
import headless.raylife.dto.v1_0.OrderPayment;

import com.liferay.commerce.service.CommerceOrderLocalService;

import javax.servlet.http.HttpServletRequest;

/**
 * @author José Abelenda
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/order-payment.properties",
	scope = ServiceScope.PROTOTYPE, service = OrderPaymentResource.class
)
public class OrderPaymentResourceImpl extends BaseOrderPaymentResourceImpl {

	public OrderPayment postOrderPayment(Long orderId, OrderPayment orderPayment)
		throws Exception {

		CommerceOrder commerceOrder = _commerceOrderLocalService.fetchCommerceOrder(orderId);

		if(commerceOrder == null) {
			throw new NoSuchOrderException("Unable to find order with ID " +
										   orderId);
		}

		StringBundler sb = new StringBundler();

		sb.append(PortalUtil.getPortalURL(contextHttpServletRequest));
		sb.append(PortalUtil.getPathModule());
		sb.append(CharPool.SLASH);
		sb.append(CommercePaymentConstants.SERVLET_PATH);
		sb.append("?groupId=");
		sb.append(commerceOrder.getGroupId());
		sb.append("&uuid=");
		sb.append(commerceOrder.getUuid());
		sb.append(StringPool.AMPERSAND);
		sb.append("nextStep=");
		sb.append(orderPayment.getCallbackURL());

		OrderPayment newOrderPayment = new OrderPayment();
		newOrderPayment.setPaymentServletURL(sb.toString());

		return newOrderPayment;
	}

	@Reference
	private CommerceOrderLocalService _commerceOrderLocalService;
}