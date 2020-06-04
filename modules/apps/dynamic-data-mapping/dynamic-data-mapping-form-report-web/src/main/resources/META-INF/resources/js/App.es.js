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

import React from 'react';

import Card from './components/card/Card.es';
import BarChart from './components/chart/bar/BarChart.es';
import PieChart from './components/chart/pie/PieChart.es';
import EmptyState from './components/empty-state/EmptyState.es';
import List from './components/list/List.es';
import toDataArray, {sumTotalEntries, toArray} from './utils/data.es';
import fieldTypes from './utils/fieldTypes.es';

const chartFactory = (options, type, values, totalEntries) => {
	switch (type) {
		case 'checkbox_multiple':
			return (
				<BarChart
					data={toDataArray(options, values)}
					totalEntries={totalEntries}
				/>
			);

		case 'radio':
		case 'select':
			return (
				<PieChart
					data={toDataArray(options, values)}
					totalEntries={totalEntries}
				/>
			);

		case 'text':
			return <List data={toArray(values)} totalEntries={totalEntries} />;

		default:
			return null;
	}
};

export default ({data, fields}) => {
	let hasCards = false;

	const cards = fields.map(({label, name, options, type}, index) => {
		const {values = {}, totalEntries = sumTotalEntries(values)} =
			data[name] || {};

		const chart = chartFactory(options, type, values, totalEntries);

		if (chart === null) {
			return null;
		}
		else {
			hasCards = true;
		}

		const field = {
			label,
			name,
			type,
			...fieldTypes[type],
		};

		return (
			<Card field={field} key={index} totalEntries={totalEntries}>
				{chart}
			</Card>
		);
	});

	if (!hasCards) {
		return <EmptyState />;
	}

	return cards;
};
