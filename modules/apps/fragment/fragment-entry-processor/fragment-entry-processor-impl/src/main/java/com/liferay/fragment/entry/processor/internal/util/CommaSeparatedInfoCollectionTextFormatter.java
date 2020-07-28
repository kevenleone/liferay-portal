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

package com.liferay.fragment.entry.processor.internal.util;

import com.liferay.info.formatter.InfoCollectionTextFormatter;
import com.liferay.info.type.Labeled;
import com.liferay.petra.string.StringPool;

import java.util.Collection;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @author Jorge Ferrer
 */
public class CommaSeparatedInfoCollectionTextFormatter
	implements InfoCollectionTextFormatter<Object> {

	@Override
	public String format(Collection<Object> collection, Locale locale) {
		Stream<Object> stream = collection.stream();

		return stream.map(
			collectionItem -> {
				if (collectionItem instanceof Labeled) {
					Labeled collectionItemLabeled = (Labeled)collectionItem;

					return collectionItemLabeled.getLabel(locale);
				}

				return collectionItem.toString();
			}
		).collect(
			Collectors.joining(StringPool.COMMA_AND_SPACE)
		);
	}

}