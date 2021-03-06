///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/Deferred',
  'dojo/dom-construct',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/Evented',
  'dojo/text!./templates/Coordinates.html',
  'dojo/_base/array',
  'jimu/dijit/formSelect'
],
  function (declare,
    lang,
    Deferred,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Evented,
    template,
    array,
    Select) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
      baseClass: 'cf-coordinates',
      declaredClass: 'CriticalFacilities.Coordinates',
      templateString: template,
      _started: null,
      label: 'Coordinates',
      parent: null,
      nls: null,
      map: null,
      appConfig: null,
      config: null,
      fields: [],
      xField: null,
      yField: null,
      theme: '',
      styleColor: '',
      firstField: '',

      constructor: function (options) {
        lang.mixin(this, options);
      },

      postCreate: function () {
        this.inherited(arguments);
        this._initUI();
      },

      _initUI: function () {
        if (this.firstField === 'X') {
          this._initXField();
          this._initYField();
        } else {
          this._initYField();
          this._initXField();
        }
        this._setFields(this.fields, this.xField, this.yField);
      },

      _initXField: function () {
        var xSelectTd = this._initSelectTd(this.xField.label + ':');
        this.lblX = xSelectTd.label;
        this.selectX = new Select({
          name: 'selectX',
          style: 'min-width: 200px',
          'aria-label': this.xField.label
        });
        this.selectX.placeAt(xSelectTd.select);
        this.selectX.startup();
      },

      _initYField: function () {
        var ySelectTd = this._initSelectTd(this.yField.label + ':');
        this.lblY = ySelectTd.label;
        this.selectY = new Select({
          name: 'selectY',
          style: 'min-width: 200px',
          'aria-label': this.yField.label
        });
        this.selectY.placeAt(ySelectTd.select);
        this.selectY.startup();
        this.lastFocusNode = this.selectY.domNode;
      },

      _initSelectTd: function (label) {
        var tr = domConstruct.create('tr', {
          className: 'bottom-border'
        }, this.coordinateTable);
        var td = domConstruct.create('td', {
          className: 'field-control-td pad-left-10'
        }, tr);
        var labelDiv = domConstruct.create('div', {
          className: 'main-text float-left'
        }, td);
        labelDiv.innerHTML = label;
        return {
          select: domConstruct.create('td', {
            className: 'float-right field-control-td'
          }, tr),
          label: labelDiv
        };
      },

      startup: function () {
        this._started = true;
        this._updateAltIndexes();
      },

      onShown: function () {
        this.pageContainer.nextDisabled = false;
        this.prevResult = this._getResults();
      },

      validate: function (type, result) {
        var def = new Deferred();
        if (type === 'next-view') {
          def.resolve(this._nextView(result));
        } else if (type === 'back-view') {
          def.resolve(this._backView(result));
        } else {
          this._homeView(result).then(function (v) {
            def.resolve(v);
          });
        }
        return def;
      },

      _updateAltIndexes: function () {
        if (this.pageContainer && !this._startPageView) {
          this._startPageView = this.pageContainer.getViewByTitle('StartPage');
          this._locationTypeView = this.pageContainer.getViewByTitle('LocationType');

          if (this._startPageView && this._locationTypeView) {
            this.altNextIndex = this._startPageView.index;
            this.altBackIndex = this._locationTypeView.index;
          } else if (this._startPageView) {
            this.altNextIndex = this._startPageView.index;
            this.altBackIndex = this._startPageView.index;
          }
        }
      },

      _nextView: function (nextResult) {
        //The assumption is that if they click next the definition of mapping is complete
        //  This may need a better approach to evaluate when it is actually complete rather than just when they have clicked next
        //  Need to keep in mind that they could have the auto recognized fields established and never have to click a select control
        if (nextResult.currentView.label === this.label) {
          var results = this._getResults();
          var hasResult = results.fields.length > 0;
          this.parent._locationMappingComplete = hasResult;
          this.emit('location-mapping-update', hasResult);
        }
        return true;
      },

      _backView: function (backResult) {
        //The assumption is that if they click back the definition of mapping is not complete
        //  This may need a better approach to evaluate when it is actually complete rather than just when they have clicked next
        //  Need to keep in mind that they could have the auto recognized fields established and never have to click a select control
        if (backResult.currentView.label === this.label) {
          var hasResult = false;
          this._setPreviousResult(this.prevResult ? this.prevResult.fields : []);
          if (this.prevResult) {
            hasResult = this.prevResult.fields.length > 0;
          }
          this.parent._locationMappingComplete = hasResult;
          this.emit('location-mapping-update', hasResult);
        }
        return true;
      },

      _homeView: function (backResult) {
        var def = new Deferred();
        var homeView = this.pageContainer.getViewByTitle('Home');
        homeView.verifyClearSettings(backResult).then(function (v) {
          def.resolve(v);
        });
        return def;
      },

      _setFields: function (fields, xField, yField) {
        var defaultXField = this._getDefaultFieldName(fields, xField);
        var defaultYField = this._getDefaultFieldName(fields, yField);

        var xOptions = [{
          label: this.nls.warningsAndErrors.noValue,
          value: this.nls.warningsAndErrors.noValue
        }];
        var yOptions = [{
          label: this.nls.warningsAndErrors.noValue,
          value: this.nls.warningsAndErrors.noValue
        }];
        array.forEach(fields, function (f) {
          xOptions.push({
            label: f.label,
            value: f.value,
            selected: defaultXField === f.value
          });
          yOptions.push({
            label: f.label,
            value: f.value,
            selected: defaultYField === f.value
          });
        });

        this.selectX.addOption(xOptions);
        this.selectY.addOption(yOptions);
      },

      _getDefaultFieldName: function (fields, configField) {
        var isRecognizedValues = configField.isRecognizedValues;
        for (var i = 0; i < isRecognizedValues.length; i++) {
          var isRecognizedValue = isRecognizedValues[i];
          for (var ii = 0; ii < fields.length; ii++) {
            var field = fields[ii];
            if (field.value.toString().toUpperCase() === isRecognizedValue.toString().toUpperCase()) {
              return field.value;
            }
          }
        }
        return undefined;
      },

      setStyleColor: function (styleColor) {
        this.styleColor = styleColor;
      },

      updateImageNodes: function () {
        //TODO toggle white/black images
      },

      _getResults: function () {
        return {
          type: "xy",
          fields: (this.selectX.value !== this.nls.warningsAndErrors.noValue &&
            this.selectY.value !== this.nls.warningsAndErrors.noValue) ? [{
              targetField: "X",
              sourceField: this.selectX.value
            }, {
              targetField: "Y",
              sourceField: this.selectY.value
            }] : []
        };
      },

      _setPreviousResult: function (result) {
        if (result.length === 0) {
          var defaultXField = this._getDefaultFieldName(this.fields, this.xField);
          var defaultYField = this._getDefaultFieldName(this.fields, this.yField);
          result = [{
            targetField: "X",
            sourceField: defaultXField
          }, {
            targetField: "Y",
            sourceField: defaultYField
          }]
        }
        array.forEach(result, function (r) {
          var sourceField = r.sourceField;
          if (sourceField === undefined) {
            sourceField = this.nls.warningsAndErrors.noValue;
          }
          var targetField = r.targetField;
          if (targetField === "X") {
            this.selectX.set('value', sourceField);
          } else if (targetField === "Y") {
            this.selectY.set('value', sourceField);
          }
        }, this);
      }
    });
  });