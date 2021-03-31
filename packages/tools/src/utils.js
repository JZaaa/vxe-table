import XEUtils from 'xe-utils/ctor'
import GlobalConfig from '../../conf'
import formats from '../../v-x-e-table/src/formats'

let zindexIndex = 0
let lastZindex = 1

function getColFuncWidth (isExists, defaultWidth = 16) {
  return isExists ? defaultWidth : 0
}

class ColumnInfo {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  constructor ($xetable, _vm, { renderHeader, renderCell, renderFooter, renderData } = {}) {
    const $xegrid = $xetable.$xegrid
    const proxyOpts = $xegrid ? $xegrid.proxyOpts : null
    const formatter = _vm.formatter
    const visible = XEUtils.isBoolean(_vm.visible) ? _vm.visible : true
    if (_vm.cellRender && _vm.editRender) {
      UtilTools.warn('vxe.error.errConflicts', ['column.cell-render', 'column.edit-render'])
    }
    // 在 v3.0 中废弃 editRender.type
    if (_vm.editRender && _vm.editRender.type === 'visible') {
      UtilTools.warn('vxe.error.delProp', ['column.edit-render.type', 'column.cell-render'])
    }
    // 在 v3.0 中废弃 prop
    if (_vm.prop) {
      UtilTools.warn('vxe.error.delProp', ['column.prop', 'column.field'])
    }
    // 在 v3.0 中废弃 label
    if (_vm.label) {
      UtilTools.warn('vxe.error.delProp', ['column.label', 'column.title'])
    }
    // 在 v3.0 中废弃 class
    if (_vm.class) {
      UtilTools.warn('vxe.error.delProp', ['column.class', 'column.className'])
    }
    // 在 v3.0 中废弃 type=index
    if (_vm.type === 'index') {
      UtilTools.warn('vxe.error.delProp', ['column.type=index', 'column.type=seq'])
    } else if (_vm.type === 'selection') {
      // 在 v3.0 中废弃 type=selection
      UtilTools.warn('vxe.error.delProp', ['column.type=selection', 'column.type=checkbox'])
    } else if (_vm.type === 'expand') {
      if ($xetable.treeConfig && $xetable.treeOpts.line) {
        UtilTools.error('vxe.error.errConflicts', ['tree-config.line', 'column.type=expand'])
      }
      if (_vm.slots && !_vm.slots.content && _vm.slots.default) {
        UtilTools.error('vxe.error.expandContent')
      }
    }

    // 在 v3.0 中 cellRender 只能是对象类型
    if (XEUtils.isBoolean(_vm.cellRender) || (_vm.cellRender && !XEUtils.isObject(_vm.cellRender))) {
      UtilTools.warn('vxe.error.errProp', [`column.cell-render=${_vm.cellRender}`, 'column.cell-render={}'])
    }
    // 在 v3.0 中 editRender 只能是对象类型
    if (XEUtils.isBoolean(_vm.editRender) || (_vm.editRender && !XEUtils.isObject(_vm.editRender))) {
      UtilTools.warn('vxe.error.errProp', [`column.edit-render=${_vm.editRender}`, 'column.edit-render={}'])
    }
    // 在 v3.0 中废弃 remoteSort
    if (_vm.remoteSort) {
      UtilTools.warn('vxe.error.delProp', ['column.remote-sort', 'sort-config.remote'])
    }
    // 在 v3.0 中废弃 sortMethod
    if (_vm.sortMethod) {
      UtilTools.warn('vxe.error.delProp', ['column.sort-method', 'sort-config.sortMethod'])
    }
    // 在 v3.0 中 sortBy 只能是字符串
    if (_vm.sortBy && !XEUtils.isString(_vm.sortBy)) {
      UtilTools.warn('vxe.error.errProp', [`column.sort-by=${JSON.stringify(_vm.sortBy)}`, `column.sort-by="${_vm.sortBy[0]}"`])
    }

    if (formatter) {
      if (XEUtils.isString(formatter)) {
        let globalFunc = formats.get(formatter)
        if (!globalFunc && XEUtils[formatter]) {
          globalFunc = XEUtils[formatter]
          // 在 v3.0 中废弃挂载格式化方式
          UtilTools.warn('vxe.error.errFormat', [formatter])
        }
        if (!XEUtils.isFunction(globalFunc)) {
          UtilTools.error('vxe.error.notFunc', [formatter])
        }
      } else if (XEUtils.isArray(formatter)) {
        let globalFunc = formats.get(formatter[0])
        if (!globalFunc && XEUtils[formatter[0]]) {
          globalFunc = XEUtils[formatter[0]]
          // 在 v3.0 中废弃挂载格式化方式
          UtilTools.warn('vxe.error.errFormat', [formatter[0]])
        }
        if (!XEUtils.isFunction(globalFunc)) {
          UtilTools.error('vxe.error.notFunc', [formatter[0]])
        }
      }
    }
    Object.assign(this, {
      // 基本属性
      type: _vm.type,
      // 在 v3.0 中废弃 prop
      prop: _vm.prop,
      property: _vm.field || _vm.prop,
      title: _vm.title,
      // 在 v3.0 中废弃 label
      label: _vm.label,
      width: _vm.width,
      minWidth: _vm.minWidth,
      resizable: _vm.resizable,
      fixed: _vm.fixed,
      align: _vm.align,
      headerAlign: _vm.headerAlign,
      footerAlign: _vm.footerAlign,
      showOverflow: _vm.showOverflow,
      showHeaderOverflow: _vm.showHeaderOverflow,
      showFooterOverflow: _vm.showFooterOverflow,
      className: _vm.class || _vm.className,
      headerClassName: _vm.headerClassName,
      footerClassName: _vm.footerClassName,
      indexMethod: _vm.indexMethod,
      seqMethod: _vm.seqMethod,
      formatter: formatter,
      sortable: _vm.sortable,
      sortBy: _vm.sortBy,
      sortType: _vm.sortType,
      sortMethod: _vm.sortMethod,
      remoteSort: _vm.remoteSort,
      filters: UtilTools.getFilters(_vm.filters),
      filterMultiple: XEUtils.isBoolean(_vm.filterMultiple) ? _vm.filterMultiple : true,
      filterMethod: _vm.filterMethod,
      filterResetMethod: _vm.filterResetMethod,
      filterRecoverMethod: _vm.filterRecoverMethod,
      filterRender: _vm.filterRender,
      treeNode: _vm.treeNode,
      cellType: _vm.cellType,
      cellRender: _vm.cellRender,
      editRender: _vm.editRender,
      contentRender: _vm.contentRender,
      exportMethod: _vm.exportMethod,
      footerExportMethod: _vm.footerExportMethod,
      titleHelp: _vm.titleHelp,
      // 自定义参数
      params: _vm.params,
      // 渲染属性
      id: _vm.colId || XEUtils.uniqueId('col_'),
      parentId: null,
      visible,
      halfVisible: false,
      defaultVisible: visible,
      checked: false,
      halfChecked: false,
      disabled: false,
      level: 1,
      rowSpan: 1,
      colSpan: 1,
      order: null,
      sortTime: 0,
      renderWidth: 0,
      renderHeight: 0,
      resizeWidth: 0,
      renderLeft: 0,
      renderArgs: [], // 渲染参数可用于扩展
      model: {},
      renderHeader: renderHeader || _vm.renderHeader,
      renderCell: renderCell || _vm.renderCell,
      renderFooter: renderFooter || _vm.renderFooter,
      renderData: renderData,
      // 单元格插槽，只对 grid 有效
      slots: _vm.slots,
      own: _vm
    })
    if (proxyOpts && proxyOpts.beforeColumn) {
      proxyOpts.beforeColumn({ $grid: $xegrid, column: this })
    }
  }

  getTitle () {
    // 在 v3.0 中废弃 label、type=index
    return UtilTools.getFuncText(this.title || this.label || (this.type === 'seq' || this.type === 'index' ? GlobalConfig.i18n('vxe.table.seqTitle') : ''))
  }

  getKey () {
    return this.property || (this.type ? `type=${this.type}` : null)
  }

  getMinWidth () {
    const { type, filters, sortable, remoteSort, sortOpts, editRender, editOpts, titleHelp } = this
    return 40 + getColFuncWidth(type === 'checkbox' || type === 'selection', 18) + getColFuncWidth(titleHelp, 18) + getColFuncWidth(filters) + getColFuncWidth((sortable || remoteSort) && sortOpts.showIcon) + getColFuncWidth(editRender && editOpts.showIcon, 32)
  }

  update (name, value) {
    // 不支持双向的属性
    if (name !== 'filters') {
      this[name] = value
      if (name === 'field') {
        this.property = value
      }
    }
  }
}

function outLog (type) {
  return function (message, params) {
    const msg = UtilTools.getLog(message, params)
    console[type](msg)
    return msg
  }
}

export const UtilTools = {
  warn: outLog('warn'),
  error: outLog('error'),
  getLog (message, args) {
    return `[vxe-table] ${GlobalConfig.i18n(message, args)}`
  },
  getFuncText (content) {
    return XEUtils.isFunction(content) ? content() : (GlobalConfig.translate ? GlobalConfig.translate(content) : content)
  },
  nextZIndex () {
    lastZindex = GlobalConfig.zIndex + zindexIndex++
    return lastZindex
  },
  getLastZIndex () {
    return lastZindex
  },
  // 行主键 key
  getRowkey ($xetable) {
    return $xetable.rowId || '_XID'
  },
  // 行主键 value
  getRowid ($xetable, row) {
    const rowId = XEUtils.get(row, UtilTools.getRowkey($xetable))
    return rowId ? encodeURIComponent(rowId) : ''
  },
  // 获取所有的列，排除分组
  getColumnList (columns) {
    const result = []
    columns.forEach(column => {
      result.push(...(column.children && column.children.length ? UtilTools.getColumnList(column.children) : [column]))
    })
    return result
  },
  getClass (property, params) {
    return property ? XEUtils.isFunction(property) ? property(params) : property : ''
  },
  getFilters (filters) {
    if (filters && XEUtils.isArray(filters)) {
      return filters.map(({ label, value, data, resetValue, checked }) => {
        return { label, value, data, resetValue, checked: !!checked, _checked: !!checked }
      })
    }
    return filters
  },
  formatText (value, placeholder) {
    return '' + (value === '' || value === null || value === undefined ? (placeholder ? GlobalConfig.emptyCell : '') : value)
  },
  getCellValue (row, column) {
    return XEUtils.get(row, column.property)
  },
  setCellValue (row, column, value) {
    return XEUtils.set(row, column.property, value)
  },
  isColumn (column) {
    return column instanceof ColumnInfo
  },
  getColumnConfig ($xetable, _vm, options) {
    return UtilTools.isColumn(_vm) ? _vm : new ColumnInfo($xetable, _vm, options)
  },
  // 组装列配置
  assemColumn (_vm) {
    const { $el, $xetable, $xecolumn, columnConfig } = _vm
    const groupConfig = $xecolumn ? $xecolumn.columnConfig : null
    columnConfig.slots = _vm.$scopedSlots
    if (groupConfig) {
      if ($xecolumn.$options._componentTag === 'vxe-table-column') {
        UtilTools.warn('vxe.error.groupTag', [`<vxe-table-colgroup title=${$xecolumn.title} ...>`, `<vxe-table-column title=${$xecolumn.title} ...>`])
      } else if ($xecolumn.$options._componentTag === 'vxe-column') {
        UtilTools.warn('vxe.error.groupTag', [`<vxe-colgroup title=${$xecolumn.title} ...>`, `<vxe-column title=${$xecolumn.title} ...>`])
      }
      if (!groupConfig.children) {
        groupConfig.children = []
      }
      groupConfig.children.splice([].indexOf.call($xecolumn.$el.children, $el), 0, columnConfig)
    } else {
      $xetable.collectColumn.splice([].indexOf.call($xetable.$refs.hideColumn.children, $el), 0, columnConfig)
    }
  },
  // 销毁列
  destroyColumn (_vm) {
    const { $xetable, columnConfig } = _vm
    const matchObj = XEUtils.findTree($xetable.collectColumn, column => column === columnConfig)
    if (matchObj) {
      matchObj.items.splice(matchObj.index, 1)
    }
  },
  hasChildrenList (item) {
    return item && item.children && item.children.length > 0
  },
  getColMinWidth (params) {
    const { $table, column } = params
    const { showHeaderOverflow: allColumnHeaderOverflow, resizableOpts, sortOpts, filterOpts, editOpts } = $table
    const { type, showHeaderOverflow, filters, sortable, remoteSort, titleHelp, editRender } = column
    const { minWidth } = resizableOpts
    if (minWidth) {
      const customMinWidth = XEUtils.isFunction(minWidth) ? minWidth(params) : minWidth
      if (customMinWidth !== 'auto') {
        return Math.max(1, XEUtils.toNumber(customMinWidth))
      }
    }
    const headOverflow = XEUtils.isUndefined(showHeaderOverflow) || XEUtils.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow
    const showEllipsis = headOverflow === 'ellipsis'
    const showTitle = headOverflow === 'title'
    const showTooltip = headOverflow === true || headOverflow === 'tooltip'
    const hasEllipsis = showTitle || showTooltip || showEllipsis
    let colMinWidth = 40
    if (hasEllipsis) {
      colMinWidth += getColFuncWidth(type === 'checkbox' || type === 'selection', 18) + getColFuncWidth(titleHelp, 18) + getColFuncWidth(filters && filterOpts.showIcon) + getColFuncWidth((sortable || remoteSort) && sortOpts.showIcon) + getColFuncWidth(UtilTools.isEnableConf(editRender) && editOpts.showIcon, 32)
    }
    return colMinWidth
  },
  parseFile (file) {
    const name = file.name
    const tIndex = XEUtils.lastIndexOf(name, '.')
    const type = name.substring(tIndex + 1, name.length)
    const filename = name.substring(0, tIndex)
    return { filename, type }
  },
  isNumVal (num) {
    return !isNaN(parseFloat('' + num))
  },
  isEnableConf (conf) {
    return conf && conf.enabled !== false
  }
}

export default UtilTools
