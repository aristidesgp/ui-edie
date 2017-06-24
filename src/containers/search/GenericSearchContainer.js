import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import GenericSearch from 'components/sidebar/search/GenericSearch'

import {
  updateSearchParams,
  fetchSearchFields,
  openFieldsPopover,
  closeFieldsPopover,
  fetchFieldTopValues,
  updateQueryChips,

  fetchSearchOptions,
  addSearchOption,
  updateSearchOption,
  removeSearchOption,
  fetchSysSearchOptions,
  showSavedSearch,
  selectSearch,

  openSearchSavePopover,
  closeSearchSavePopover,

  fetchWorkflows,
  fetchWorkflowCategories,
  openSearchWfModal,
  closeSearchWfModal,
  selectSearchWfCategory,
  changeSeachWfFilter,
  selectWfRow,
  selectSearchWf,
  addSearchWf,
  removeSearchWf,
  replaceSearchWfs,

  showThreats,
  showRelDevicesPopover,
  fetchRelDevices,
  showIrrelDevicesModal,
  fetchIrrelDevices,
  showSearchFieldsModal,
  updateSelectedSearchFields,
  updateRelDeviceFields,
  shareSavedSearch,

  fetchMonitorTemplates,

  updateSearchViewFilter,
  showViewFilterModal,
  selectViewFilter,

  showSearchGraphModal,
  fetchSearchRecordCount,
  maximizeSearchGraph,

  showSearchTagModal,
  updateSearchTags
} from 'actions'

class GenericSearchContainer extends React.Component {
  render () {
    return (
      <GenericSearch {...this.props}/>
    )
  }
}
export default connect(
  state => ({
    params: state.search.params,
    queryChips: state.search.queryChips,
    fields: state.search.fields,
    fieldPopoverOpen: state.search.fieldPopoverOpen,
    selectedField: state.search.selectedField,
    anchorEl: state.search.anchorEl,
    fieldTopValues: state.search.fieldTopValues,
    searchOptions: state.search.searchOptions,

    savePopoverOpen: state.search.savePopoverOpen,
    selectedOption: state.search.selectedOption,

    userInfo: state.dashboard.userInfo,
    envVars: state.settings.envVars,

    workflows: state.settings.workflows,
    workflowCategories: state.devices.workflowCategories,
    selectedCategory: state.search.selectedCategory,
    wfModalOpen: state.search.wfModalOpen,
    selectedWf: state.search.selectedWf,
    selectedWfs: state.search.selectedWfs,
    workflowFilter: state.search.workflowFilter,
    selectedRowWf: state.search.selectedRowWf,

    savedSearchModalOpen: state.search.savedSearchModalOpen,
    sysSearchOptions: state.search.sysSearchOptions,
    selectedSearch: state.search.selectedSearch,
    loadingSearchOptions: state.search.loadingSearchOptions,

    relDevicePopoverOpen: state.search.relDevicePopoverOpen,
    relDevices: state.search.relDevices,
    irrelDeviceModalOpen: state.search.irrelDeviceModalOpen,
    irrelDevices: state.search.irrelDevices,

    searchFieldsModalOpen: state.search.searchFieldsModalOpen,
    selectedSearchFields: state.search.selectedSearchFields,
    searchFields: state.search.searchFields,
    shareSearchResult: state.search.shareSearchResult,

    monitorTemplates: state.settings.monitorTemplates,

    viewFilter: state.search.viewFilter,
    viewFilterModalOpen: state.search.viewFilterModalOpen,
    selectedViewFilter: state.search.selectedViewFilter,

    searchGraphModalOpen: state.search.searchGraphModalOpen,
    searchRecordCounts: state.search.searchRecordCounts,
    graphMaximized: state.search.graphMaximized,

    searchTagModalOpen: state.search.searchTagModalOpen,
    searchTags: state.search.searchTags
  }),
  dispatch => ({
    ...bindActionCreators({
      updateSearchParams,
      fetchSearchFields,
      openFieldsPopover,
      closeFieldsPopover,
      fetchFieldTopValues,
      updateQueryChips,

      fetchSearchOptions,
      addSearchOption,
      updateSearchOption,
      removeSearchOption,
      fetchSysSearchOptions,
      showSavedSearch,
      selectSearch,

      openSearchSavePopover,
      closeSearchSavePopover,

      fetchWorkflows,
      fetchWorkflowCategories,
      openSearchWfModal,
      closeSearchWfModal,
      selectSearchWfCategory,
      changeSeachWfFilter,
      selectWfRow,
      selectSearchWf,
      addSearchWf,
      removeSearchWf,
      replaceSearchWfs,

      showThreats,
      showRelDevicesPopover,
      fetchRelDevices,
      showIrrelDevicesModal,
      fetchIrrelDevices,
      showSearchFieldsModal,
      updateSelectedSearchFields,
      updateRelDeviceFields,
      shareSavedSearch,

      fetchMonitorTemplates,

      updateSearchViewFilter,
      showViewFilterModal,
      selectViewFilter,

      showSearchGraphModal,
      fetchSearchRecordCount,
      maximizeSearchGraph,

      showSearchTagModal,
      updateSearchTags
    }, dispatch)
  })
)(withRouter(GenericSearchContainer))