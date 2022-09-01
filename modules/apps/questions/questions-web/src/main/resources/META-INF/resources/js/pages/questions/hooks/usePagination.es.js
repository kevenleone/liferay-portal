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

import {useEffect, useState} from 'react';

import useQueryParams from '../../../hooks/useQueryParams.es';

const usePagination = () => {
	const [page, setPage] = useState(null);
	const [pageSize, setPageSize] = useState(null);
	const [search, setSearch] = useState(null);

	const queryParams = useQueryParams(location);

	useEffect(() => {
		const pageNumber = queryParams.get('page') || 1;
		setPage(isNaN(pageNumber) ? 1 : parseInt(pageNumber, 10));
	}, [queryParams]);

	useEffect(() => {
		setPageSize(queryParams.get('pagesize') || 20);
	}, [queryParams]);

	useEffect(() => {
		setSearch(queryParams.get('search') || '');
	}, [queryParams]);

	return {page, pageSize, search};
};

export default usePagination;
