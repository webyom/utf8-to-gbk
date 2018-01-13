import {appendQueryString} from './misc';

let DataGrid = {
  getState(dataGridComponent, params = {}) {
    let dgState = null;
    let dataGridInstance = dataGridComponent && dataGridComponent.dataGridInstance;
    if (dataGridInstance) {
      dgState = {
        sortColumnId: params.sortby,
        sortOrder: params.order,
        filterMap: dataGridInstance.parseFilterMap(params.condition)
      };
    }
    return dgState;
  },

  getQueryUrl(url, params = {}) {
    return appendQueryString(url, {
      page: params.page,
      limit: params.pageSize,
      sortby: params.sortColumnId,
      order: params.sortOrder,
      condition: params.filterMap
    });
  }
};

export default DataGrid;
