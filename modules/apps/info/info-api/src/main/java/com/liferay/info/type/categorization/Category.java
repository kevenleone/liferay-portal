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

package com.liferay.info.type.categorization;

import com.liferay.info.localized.InfoLocalizedValue;
import com.liferay.info.type.Keyed;
import com.liferay.info.type.Labeled;

import java.util.Locale;

/**
 * @author Jorge Ferrer
 */
public class Category implements Keyed, Labeled {

	public Category(
		String key, InfoLocalizedValue<String> labelInfoLocalizedValue) {

		_key = key;
		_labelInfoLocalizedValue = labelInfoLocalizedValue;
	}

	@Override
	public String getKey() {
		return _key;
	}

	public String getLabel(Locale locale) {
		return _labelInfoLocalizedValue.getValue(locale);
	}

	private final String _key;
	private final InfoLocalizedValue<String> _labelInfoLocalizedValue;

}