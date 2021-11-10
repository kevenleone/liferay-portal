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

package headless.raylife.client.dto.v1_0;

import headless.raylife.client.function.UnsafeSupplier;
import headless.raylife.client.serdes.v1_0.OrderPaymentSerDes;

import java.io.Serializable;

import java.util.Objects;

import javax.annotation.Generated;

/**
 * @author José Abelenda
 * @generated
 */
@Generated("")
public class OrderPayment implements Cloneable, Serializable {

	public static OrderPayment toDTO(String json) {
		return OrderPaymentSerDes.toDTO(json);
	}

	public String getCallbackURL() {
		return callbackURL;
	}

	public void setCallbackURL(String callbackURL) {
		this.callbackURL = callbackURL;
	}

	public void setCallbackURL(
		UnsafeSupplier<String, Exception> callbackURLUnsafeSupplier) {

		try {
			callbackURL = callbackURLUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String callbackURL;

	public String getPaymentServletURL() {
		return paymentServletURL;
	}

	public void setPaymentServletURL(String paymentServletURL) {
		this.paymentServletURL = paymentServletURL;
	}

	public void setPaymentServletURL(
		UnsafeSupplier<String, Exception> paymentServletURLUnsafeSupplier) {

		try {
			paymentServletURL = paymentServletURLUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String paymentServletURL;

	@Override
	public OrderPayment clone() throws CloneNotSupportedException {
		return (OrderPayment)super.clone();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof OrderPayment)) {
			return false;
		}

		OrderPayment orderPayment = (OrderPayment)object;

		return Objects.equals(toString(), orderPayment.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		return OrderPaymentSerDes.toJSON(this);
	}

}