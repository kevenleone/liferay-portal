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

package com.liferay.dynamic.data.mapping.internal.report;

import com.liferay.dynamic.data.mapping.constants.DDMFormInstanceReportConstants;
import com.liferay.dynamic.data.mapping.model.DDMFormFieldType;
import com.liferay.dynamic.data.mapping.model.DDMFormInstanceRecord;
import com.liferay.dynamic.data.mapping.model.LocalizedValue;
import com.liferay.dynamic.data.mapping.model.Value;
import com.liferay.dynamic.data.mapping.service.DDMFormInstanceRecordLocalService;
import com.liferay.dynamic.data.mapping.storage.DDMFormFieldValue;
import com.liferay.dynamic.data.mapping.storage.DDMFormValues;
import com.liferay.dynamic.data.mapping.util.comparator.DDMFormInstanceRecordModifiedDateComparator;
import com.liferay.portal.json.JSONFactoryImpl;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

import org.powermock.api.mockito.PowerMockito;

/**
 * @author Marcos Martins
 */
@RunWith(MockitoJUnitRunner.class)
public class TextDDMFormFieldTypeReportProcessorTest extends PowerMockito {

	@Before
	public void setUp() {
		_setUpJSONFactoryUtil();

		_textDDMFormFieldTypeReportProcessor.ddmFormInstanceRecordLocalService =
			_ddmFormInstanceRecordLocalService;
	}

	@Test
	public void testProcessDDMFormInstanceReportEditLastFiveRecords()
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		when(
			ddmFormFieldValue.getName()
		).thenReturn(
			"field1"
		);

		when(
			ddmFormFieldValue.getType()
		).thenReturn(
			DDMFormFieldType.TEXT
		);

		Value value = new LocalizedValue();

		value.addString(value.getDefaultLocale(), "text 6");
		value.setDefaultLocale(LocaleUtil.US);

		when(
			ddmFormFieldValue.getValue()
		).thenReturn(
			value
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getFormInstanceId()
		).thenReturn(
			0L
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecord(3)
		).thenReturn(
			formInstanceRecord
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecordsCount(
				0, WorkflowConstants.STATUS_APPROVED)
		).thenReturn(
			5
		);

		JSONObject processedFieldJSONObject =
			_textDDMFormFieldTypeReportProcessor.process(
				ddmFormFieldValue,
				JSONUtil.put(
					"type", DDMFormFieldType.TEXT
				).put(
					"values",
					JSONUtil.putAll(
						JSONUtil.put(
							"formInstanceRecordId", 5
						).put(
							"value", "text 5"
						),
						JSONUtil.put(
							"formInstanceRecordId", 4
						).put(
							"value", "text 4"
						),
						JSONUtil.put(
							"formInstanceRecordId", 3
						).put(
							"value", "text 3"
						),
						JSONUtil.put(
							"formInstanceRecordId", 2
						).put(
							"value", "text 2"
						),
						JSONUtil.put(
							"formInstanceRecordId", 1
						).put(
							"value", "text 1"
						))
				),
				3, DDMFormInstanceReportConstants.EVENT_ADD_RECORD_VERSION);

		Assert.assertEquals(
			DDMFormFieldType.TEXT, processedFieldJSONObject.getString("type"));

		JSONArray valuesJSONArray = processedFieldJSONObject.getJSONArray(
			"values");

		JSONObject jsonObject = valuesJSONArray.getJSONObject(0);

		Assert.assertEquals("text 6", jsonObject.getString("value"));

		jsonObject = valuesJSONArray.getJSONObject(2);

		Assert.assertEquals("text 4", jsonObject.getString("value"));
	}

	@Test
	public void testProcessDDMFormInstanceReportOnDeleteEvent()
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		when(
			ddmFormFieldValue.getName()
		).thenReturn(
			"field1"
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getFormInstanceId()
		).thenReturn(
			0L
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecord(3)
		).thenReturn(
			formInstanceRecord
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecordsCount(
				0, WorkflowConstants.STATUS_APPROVED)
		).thenReturn(
			5
		);

		List<DDMFormInstanceRecord> formInstanceRecords = new ArrayList<>();

		for (int i = 5; i > 0; i--) {
			formInstanceRecords.add(_createFormInstanceRecord("text " + i));
		}

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecords(
				Mockito.eq(0L), Mockito.eq(WorkflowConstants.STATUS_APPROVED),
				Mockito.eq(0), Mockito.eq(5),
				Mockito.any(DDMFormInstanceRecordModifiedDateComparator.class))
		).thenReturn(
			formInstanceRecords
		);

		JSONObject processedFieldJSONObject =
			_textDDMFormFieldTypeReportProcessor.process(
				ddmFormFieldValue, JSONUtil.put("type", DDMFormFieldType.TEXT),
				3, DDMFormInstanceReportConstants.EVENT_DELETE_RECORD_VERSION);

		Assert.assertEquals(
			DDMFormFieldType.TEXT, processedFieldJSONObject.getString("type"));

		JSONArray valuesJSONArray = processedFieldJSONObject.getJSONArray(
			"values");

		JSONObject jsonObject = valuesJSONArray.getJSONObject(0);

		Assert.assertEquals("text 5", jsonObject.getString("value"));
	}

	@Test
	public void testProcessDDMFormInstanceReportWithEmptyData()
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		when(
			ddmFormFieldValue.getName()
		).thenReturn(
			"field1"
		);

		when(
			ddmFormFieldValue.getType()
		).thenReturn(
			DDMFormFieldType.TEXT
		);

		Value value = new LocalizedValue();

		value.addString(value.getDefaultLocale(), "text");
		value.setDefaultLocale(LocaleUtil.US);

		when(
			ddmFormFieldValue.getValue()
		).thenReturn(
			value
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getFormInstanceId()
		).thenReturn(
			0L
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecord(0)
		).thenReturn(
			formInstanceRecord
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecordsCount(
				0, WorkflowConstants.STATUS_APPROVED)
		).thenReturn(
			1
		);

		JSONObject processedFieldJSONObject =
			_textDDMFormFieldTypeReportProcessor.process(
				ddmFormFieldValue,
				JSONUtil.put(
					"type", DDMFormFieldType.TEXT
				).put(
					"values", JSONFactoryUtil.createJSONObject()
				),
				0, DDMFormInstanceReportConstants.EVENT_ADD_RECORD_VERSION);

		Assert.assertEquals(
			DDMFormFieldType.TEXT, processedFieldJSONObject.getString("type"));

		JSONArray valuesJSONArray = processedFieldJSONObject.getJSONArray(
			"values");

		JSONObject jsonObject = valuesJSONArray.getJSONObject(0);

		Assert.assertEquals("text", jsonObject.getString("value"));
	}

	@Test
	public void testProcessDDMFormInstanceReportWithExistingData()
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		when(
			ddmFormFieldValue.getName()
		).thenReturn(
			"field1"
		);

		when(
			ddmFormFieldValue.getType()
		).thenReturn(
			DDMFormFieldType.TEXT
		);

		Value value = new LocalizedValue();

		value.addString(value.getDefaultLocale(), "text 2");
		value.setDefaultLocale(LocaleUtil.US);

		when(
			ddmFormFieldValue.getValue()
		).thenReturn(
			value
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getFormInstanceId()
		).thenReturn(
			0L
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecord(0)
		).thenReturn(
			formInstanceRecord
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecordsCount(
				0, WorkflowConstants.STATUS_APPROVED)
		).thenReturn(
			2
		);

		JSONObject processedFieldJSONObject =
			_textDDMFormFieldTypeReportProcessor.process(
				ddmFormFieldValue,
				JSONUtil.put(
					"type", DDMFormFieldType.TEXT
				).put(
					"values",
					JSONUtil.put(
						JSONUtil.put(
							"formInstanceRecordId", 1
						).put(
							"value", "text 1"
						))
				),
				0, DDMFormInstanceReportConstants.EVENT_ADD_RECORD_VERSION);

		Assert.assertEquals(
			DDMFormFieldType.TEXT, processedFieldJSONObject.getString("type"));

		JSONArray valuesJSONArray = processedFieldJSONObject.getJSONArray(
			"values");

		JSONObject jsonObject = valuesJSONArray.getJSONObject(0);

		Assert.assertEquals("text 2", jsonObject.getString("value"));

		jsonObject = valuesJSONArray.getJSONObject(1);

		Assert.assertEquals("text 1", jsonObject.getString("value"));
	}

	@Test
	public void testProcessDDMFormInstanceReportWithFiveExistingEntries()
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		when(
			ddmFormFieldValue.getName()
		).thenReturn(
			"field1"
		);

		when(
			ddmFormFieldValue.getType()
		).thenReturn(
			DDMFormFieldType.TEXT
		);

		Value value = new LocalizedValue();

		value.addString(value.getDefaultLocale(), "text 6");
		value.setDefaultLocale(LocaleUtil.US);

		when(
			ddmFormFieldValue.getValue()
		).thenReturn(
			value
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getFormInstanceId()
		).thenReturn(
			0L
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecord(6)
		).thenReturn(
			formInstanceRecord
		);

		when(
			_ddmFormInstanceRecordLocalService.getFormInstanceRecordsCount(
				0, WorkflowConstants.STATUS_APPROVED)
		).thenReturn(
			6
		);

		JSONObject processedFieldJSONObject =
			_textDDMFormFieldTypeReportProcessor.process(
				ddmFormFieldValue,
				JSONUtil.put(
					"type", DDMFormFieldType.TEXT
				).put(
					"values",
					JSONUtil.putAll(
						JSONUtil.put(
							"formInstanceRecordId", 5
						).put(
							"value", "text 5"
						),
						JSONUtil.put(
							"formInstanceRecordId", 4
						).put(
							"value", "text 4"
						),
						JSONUtil.put(
							"formInstanceRecordId", 3
						).put(
							"value", "text 3"
						),
						JSONUtil.put(
							"formInstanceRecordId", 2
						).put(
							"value", "text 2"
						),
						JSONUtil.put(
							"formInstanceRecordId", 1
						).put(
							"value", "text 1"
						))
				),
				6, DDMFormInstanceReportConstants.EVENT_ADD_RECORD_VERSION);

		Assert.assertEquals(
			DDMFormFieldType.TEXT, processedFieldJSONObject.getString("type"));

		JSONArray valuesJSONArray = processedFieldJSONObject.getJSONArray(
			"values");

		JSONObject jsonObject = valuesJSONArray.getJSONObject(0);

		Assert.assertEquals("text 6", jsonObject.getString("value"));

		jsonObject = valuesJSONArray.getJSONObject(4);

		Assert.assertEquals("text 2", jsonObject.getString("value"));
	}

	private DDMFormInstanceRecord _createFormInstanceRecord(String valueString)
		throws Exception {

		DDMFormFieldValue ddmFormFieldValue = mock(DDMFormFieldValue.class);

		Value value = new LocalizedValue();

		value.addString(value.getDefaultLocale(), valueString);
		value.setDefaultLocale(LocaleUtil.US);

		when(
			ddmFormFieldValue.getValue()
		).thenReturn(
			value
		);

		DDMFormValues ddmFormValues = mock(DDMFormValues.class);

		when(
			ddmFormValues.getDDMFormFieldValuesMap()
		).thenReturn(
			HashMapBuilder.<String, List<DDMFormFieldValue>>put(
				"field1", Arrays.asList(ddmFormFieldValue)
			).build()
		);

		DDMFormInstanceRecord formInstanceRecord = mock(
			DDMFormInstanceRecord.class);

		when(
			formInstanceRecord.getDDMFormValues()
		).thenReturn(
			ddmFormValues
		);

		return formInstanceRecord;
	}

	private void _setUpJSONFactoryUtil() {
		JSONFactoryUtil jsonFactoryUtil = new JSONFactoryUtil();

		jsonFactoryUtil.setJSONFactory(new JSONFactoryImpl());
	}

	@Mock
	private DDMFormInstanceRecordLocalService
		_ddmFormInstanceRecordLocalService;

	private final TextDDMFormFieldTypeReportProcessor
		_textDDMFormFieldTypeReportProcessor =
			new TextDDMFormFieldTypeReportProcessor();

}