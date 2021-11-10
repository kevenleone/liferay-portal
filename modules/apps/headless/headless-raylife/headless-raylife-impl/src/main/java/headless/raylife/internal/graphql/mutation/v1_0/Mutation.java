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

package headless.raylife.internal.graphql.mutation.v1_0;

import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;

import headless.raylife.dto.v1_0.OrderPayment;
import headless.raylife.resource.v1_0.OrderPaymentResource;

import java.util.function.BiFunction;

import javax.annotation.Generated;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.osgi.service.component.ComponentServiceObjects;

/**
 * @author José Abelenda
 * @generated
 */
@Generated("")
public class Mutation {

	public static void setOrderPaymentResourceComponentServiceObjects(
		ComponentServiceObjects<OrderPaymentResource>
			orderPaymentResourceComponentServiceObjects) {

		_orderPaymentResourceComponentServiceObjects =
			orderPaymentResourceComponentServiceObjects;
	}

	@GraphQLField
	public OrderPayment createOrderPayment(
			@GraphQLName("orderId") Long orderId,
			@GraphQLName("orderPayment") OrderPayment orderPayment)
		throws Exception {

		return _applyComponentServiceObjects(
			_orderPaymentResourceComponentServiceObjects,
			this::_populateResourceContext,
			orderPaymentResource -> orderPaymentResource.postOrderPayment(
				orderId, orderPayment));
	}

	@GraphQLField
	public Response createOrderPaymentBatch(
			@GraphQLName("orderId") Long orderId,
			@GraphQLName("callbackURL") String callbackURL,
			@GraphQLName("object") Object object)
		throws Exception {

		return _applyComponentServiceObjects(
			_orderPaymentResourceComponentServiceObjects,
			this::_populateResourceContext,
			orderPaymentResource -> orderPaymentResource.postOrderPaymentBatch(
				orderId, callbackURL, object));
	}

	private <T, R, E1 extends Throwable, E2 extends Throwable> R
			_applyComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeFunction<T, R, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			return unsafeFunction.apply(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private <T, E1 extends Throwable, E2 extends Throwable> void
			_applyVoidComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeConsumer<T, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			unsafeFunction.accept(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private void _populateResourceContext(
			OrderPaymentResource orderPaymentResource)
		throws Exception {

		orderPaymentResource.setContextAcceptLanguage(_acceptLanguage);
		orderPaymentResource.setContextCompany(_company);
		orderPaymentResource.setContextHttpServletRequest(_httpServletRequest);
		orderPaymentResource.setContextHttpServletResponse(
			_httpServletResponse);
		orderPaymentResource.setContextUriInfo(_uriInfo);
		orderPaymentResource.setContextUser(_user);
		orderPaymentResource.setGroupLocalService(_groupLocalService);
		orderPaymentResource.setRoleLocalService(_roleLocalService);
	}

	private static ComponentServiceObjects<OrderPaymentResource>
		_orderPaymentResourceComponentServiceObjects;

	private AcceptLanguage _acceptLanguage;
	private com.liferay.portal.kernel.model.Company _company;
	private GroupLocalService _groupLocalService;
	private HttpServletRequest _httpServletRequest;
	private HttpServletResponse _httpServletResponse;
	private RoleLocalService _roleLocalService;
	private BiFunction<Object, String, Sort[]> _sortsBiFunction;
	private UriInfo _uriInfo;
	private com.liferay.portal.kernel.model.User _user;

}