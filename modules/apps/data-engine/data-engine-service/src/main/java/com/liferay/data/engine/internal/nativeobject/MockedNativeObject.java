package com.liferay.data.engine.internal.nativeobject;

import com.liferay.data.engine.model.DEDataListViewTable;
import com.liferay.data.engine.nativeobject.DataEngineNativeObject;
import com.liferay.data.engine.nativeobject.DataEngineNativeObjectField;
import com.liferay.petra.string.StringPool;
import org.osgi.service.component.annotations.Component;

import java.util.ArrayList;
import java.util.List;

@Component(immediate = true, service = DataEngineNativeObject.class)
public class MockedNativeObject implements DataEngineNativeObject {
	@Override
	public String getClassName() {
		return MockedNativeObject.class.getName();
	}

	@Override
	public List<DataEngineNativeObjectField> getDataEngineNativeObjectFields() {

		DataEngineNativeObjectField dataEngineNativeObjectField = new DataEngineNativeObjectField(
			DEDataListViewTable.INSTANCE.deDataListViewId, StringPool.BLANK);

		List<DataEngineNativeObjectField> list = new ArrayList<>();

		list.add(dataEngineNativeObjectField);

		return list;
	}

	@Override
	public String getName() {
		return "Mocked Native Object";
	}
}
