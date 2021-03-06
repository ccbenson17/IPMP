define({
  "page1": {
    "selectToolHeader": "选择一种方法，以选择要进行批量更新的记录。",
    "selectToolDesc": "该微件提供了 3 种不同的方法来生成一组要更新的选定记录。只能从中选择一种方法。如果您需要使用其中的多种方法，请创建微件的新实例。",
    "selectByShape": "根据区域选择",
    "shapeTypeSelector": "单击您想要允许的工具",
    "shapeType": {
      "point": "点",
      "line": "线",
      "polyline": "折线",
      "freehandPolyline": "手绘折线",
      "extent": "范围",
      "polygon": "面",
      "freehandPolygon": "手绘面"
    },
    "freehandPolygon": "手绘面",
    "selectBySpatQuery": "根据要素选择",
    "selectByAttQuery": "根据要素和相关要素选择",
    "selectByQuery": "根据查询选择",
    "toolNotSelected": "请选择一种选择方法",
    "noDrawToolSelected": "请至少选择一个绘图工具"
  },
  "page2": {
    "layersToolHeader": "选择要更新的图层和选择工具选项(如果存在)。",
    "layersToolDesc": "您在第一页所选的选择方法将被用于选择和更新下列图层集。如果您选中了多个图层，则仅可更新通用可编辑字段。依据您对选择工具所做的具体选择，将需要不同的其他选项。",
    "layerTable": {
      "colUpdate": "更新",
      "colLabel": "图层",
      "colSelectByLayer": "根据图层选择",
      "colSelectByField": "查询字段",
      "colhighlightSymbol": "高亮显示符号"
    },
    "toggleLayers": "在打开与关闭之间切换图层的可见性",
    "noEditableLayers": "无可编辑图层",
    "noLayersSelected": "在继续处理前请选择一个或多个图层。"
  },
  "page3": {
    "commonFieldsHeader": "选择要批量更新的字段。",
    "commonFieldsDesc": "只有通用可编辑字段会显示在下方。请选择您希望更新的字段。如果不同图层的同一字段具有不同的域，则只会显示并使用一个域。",
    "noCommonFields": "无通用字段",
    "fieldTable": {
      "colEdit": "可编辑",
      "colName": "名称",
      "colAlias": "别名",
      "colAction": "操作"
    }
  },
  "tabs": {
    "selection": "定义选择类型",
    "layers": "定义要更新的图层",
    "fields": "定义要更新的字段"
  },
  "errorOnOk": "请在保存配置前填写所有参数",
  "next": "前进",
  "back": "后退",
  "save": "保存符号",
  "cancel": "取消",
  "ok": "确定",
  "symbolPopup": "符号选择器",
  "editHeaderText": "要在微件顶部显示的文本",
  "widgetIntroSelectByArea": "请使用以下工具之一以创建要更新的所选要素集。 如果行<font class='maxRecordInIntro'>突出显示</font>，则已超出最大记录数。",
  "widgetIntroSelectByFeature": "使用下面的工具从 <font class='layerInIntro'>${0}</font> 图层中选择要素。 将使用此要素选择和更新所有相交要素。 如果行<font class='maxRecordInIntro'>突出显示</font>，则表示已超出最大记录数。",
  "widgetIntroSelectByFeatureQuery": "使用以下工具从 <font class='layerInIntro'>${0}</font> 中选择要素。 将使用此要素的 <font class='layerInIntro'>${1}</font> 属性来查询以下图层并更新生成的要素。 如果行<font class='maxRecordInIntro'>突出显示</font>，则已超出最大记录数。",
  "widgetIntroSelectByQuery": "输入用于创建选择集的值。 如果行<font class='maxRecordInIntro'>突出显示</font>，则已超出最大记录数。"
});