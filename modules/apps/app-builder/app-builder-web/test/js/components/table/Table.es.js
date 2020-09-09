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

import {act, cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import Table from '../../../../src/main/resources/META-INF/resources/js/components/table/Table.es';
import {COLUMNS, ITEMS} from '../../constants.es';

describe('Table', () => {

    beforeEach(cleanup)

    it('renders', () => {
        const {asFragment} = render(
        <Table 
            columns={[]} 
            items={[]} 
        />
        )

        expect(asFragment).toMatchSnapshot()
    });

    it('renders with one item', () => {
        const item = {
            ...ITEMS.ONE[0],
            name: ITEMS.ONE[0].name.en_US
        }

        const {queryAllByText} = render(
        <Table 
            columns={COLUMNS} 
            items={[item]} 
        />
        )

        // expect(queryAllByText(/Item/).length).toBe(1)
    });

    it('renders with editable item', async () => {
        const item = {
            ...ITEMS.ONE[0],
            name: ITEMS.ONE[0].name.en_US,
            originalItem: {
                ...ITEMS.ONE[0],
                name: ITEMS.ONE[0].name.en_US,
            }
        }

        const [name, ...dates] = COLUMNS;
        const columns = [{...name, editable: true}, ...dates]

        const {debug, queryByRole, queryByText} = render(
        <Table 
            columns={columns} 
            editMode={{id: 1}} 
            items={[item]}
        />
        )

        const input = queryByRole('textbox');

        expect(input.value).toBe(item.name);

        await act(async () => {
        })
        await fireEvent.change(input, {target: {value: 'Item Renamed'}});      


        // expect(input.value).toBe('Item Renamed');
        
        // await act(async () => {
        //     queryByText('save').click()
        // })
        

        debug()

        // expect(queryAllByText(/Item/).length).toBe(1)
    });
});