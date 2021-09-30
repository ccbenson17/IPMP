/**
 * @fileoverviewD
 * (Custom Widget - {@link module:PickColumns|More info}) PickColumns (Visualize ata in web app) is a custom widget used as an interface to graphs and visualizations related fields in the IPMP FeatureSet. It displays average values, and interactive maps which display a color-coded representation of the selected field.
 */

/*global define, console, setTimeout*/
define([
	//dojo
	'dojo/_base/declare',
	'jimu/BaseWidget',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/Button',
	'dojo/on',
	'dojo/aspect',
	'dijit/form/SimpleTextarea',
	'dojo/dom-class',
	'dojo/_base/array',
	'dojo/string',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dojo/promise/all',

	//esri
	'jimu/WidgetManager',
	'jimu/PanelManager',
	'esri/config',
	'esri/InfoTemplate',
	'esri/geometry/Point',
	'esri/geometry/Extent',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/layers/FeatureLayer',
	'esri/InfoTemplate',
	'dojo/promise/all',
	'dojo/dom-class',
	'esri/lang',
	'jimu/dijit/LoadingShelter',
	'esri/request',
	'esri/Color',
	'dojo/domReady!',
	'dijit/registry',
], function (
	//dojo
	declare,
	BaseWidget,
	_WidgetsInTemplateMixin,
	Button,
	on,
	aspect,
	SimpleTextarea,
	domClass,
	array,
	dojoString,
	lang,
	Deferred,
	all,

	//esri
	WidgetManager,
	PanelManager,
	esriConfig,
	InfoTemplate,
	Point,
	Extent,
	Query,
	QueryTask,
	SimpleLineSymbol,
	SimpleFillSymbol,
	SimpleMarkerSymbol,
	FeatureLayer,
	esriRequest,
	InfoTemplate,
	all,
	domClass,
	esriLang,
	LoadingShelter,
	Color,
	registry
) {
	/**
	 * @module PickColumns
	 */
	return declare([BaseWidget, _WidgetsInTemplateMixin], {
		// DemoWidget code goes here

		//please note that this property is be set by the framework when widget is loaded.
		//templateString: template,

		baseClass: 'jimu-widget-PickColumns',
		name: 'PickColumns',
		label: 'PickColumns',

		layerQuery: null,
		serviceQuery: null,
		optionFieldSel: null,
		prevFieldNode: null,
		curWidget: null,
		panelManager: null,
		widgetManager: null,
		layersVisible: null, //0 ~ all, 1 ~ 2013, 2 ~ 2014, 3 ~ 2015 .....
		query: null,
		baseWhere: null,
		yearWhere: null,
		queryTask: null,
		currTab: null, // 0 (first menu on top), 1 (2nd menu from top), 2, 3
		currSet: null,
		subset: null,
		curField: null,
		maxF: null,
		minF: null,
		crMin: null,
		crMax: null,
		avgF: null,
		typeInd: null,
		prox: null,
		yearCount: null,
		featureLayer: null,
		slider: null,
		sliderVals: null,
		loaderWidget: null,

		postCreate: function () {
			this.inherited(arguments);
			console.log('postCreate');
		},

		// startup: function () {
		//   this.inherited(arguments);
		//   this.mapIdNode.innerHTML = 'map id:' + this.map.id;
		//   console.log('startup');
		// },

		/**
		 * Loads on initial setup, crreating EventListeners for buttons and running initial setup.
		 */
		startup: function startupFunc() {
			this.inherited(arguments);

			// this.own(on(this.selectGraph, "change", lang.hitch(this, function () {
			//   if (this.selectGraph.get('value') != "Choose one:") {
			//     this.curTab = 0;
			//     this.selectAVG.set('value', "Choose one:");
			//     // this.selectMIN.set('value', "Choose one:");
			//     // this.selectMAX.set('value', "Choose one:");
			//     this.optionLayerSelVal = this.selectGraph.get('value');
			//     this.optionLayerSelText = this.selectGraph.get('displayedValue');
			//     this.openGraph(this.selectGraph.get('value'));
			//   }
			// })));

			// this.slider = document.getElementById("slider");

			// noUiSlider.create(slider, {
			//   start: [0, 100],
			//   connect: false,
			//   range: {
			//     min: 0,
			//     max: 100
			//   }
			// });

			// this.slider.setAttribute("disabled", true);
			// this.sliderVals = [];

			this.own(
				on(
					this.selectAVG,
					'change',
					lang.hitch(this, function () {
						if (this.selectAVG.get('value') != 'Choose one:') {
							this.curTab = 1;
							//this.selectGraph.set('value', "Choose one:");
							//this.selectMIN.set('value', "Choose one:");
							//this.selectMAX.set('value', "Choose one:");
							this.optionLayerSelVal = this.selectAVG.get('value');
							this.optionLayerSelText = this.selectAVG.get('displayedValue');
							this.openGraph(this.selectAVG.get('value'), 0);
						}
					})
				)
			);

			// document.getElementById("minB").addEventListener("click", ev => {
			//   this.getGraphicExtent(this.sliderVals[0]);
			// });

			// document.getElementById("maxB").addEventListener("click", ev => {
			//   this.getGraphicExtent(this.sliderVals[1]);
			// });

			// var selfRef = this;
			// this.slider.noUiSlider.on("change", function(values, handle, unencoded, tap, positions) {
			//   if (!selfRef.subset) return;
			//   // console.log(`Values[0] was ${parseInt(values[0])} and that is equal to ${selfRef.subset[parseInt(values[0])].attributes[selfRef.curField]}`);
			//   // console.log(`Values[1] was ${parseInt(values[1])} and that is equal to ${selfRef.subset[parseInt(values[1])].attributes[selfRef.curField]}`);
			//   if (!handle) {
			//     // min
			//     selfRef.sliderVals[0] = parseInt(values[0]);
			//     selfRef.crMin = selfRef.currSet.features[selfRef.sliderVals[0]].attributes[selfRef.curField];
			//     selfRef.setMaxMinNodes(1);
			//     selfRef.execQuery(1);
			//   } else {
			//     //max
			//     selfRef.sliderVals[1] = parseInt(values[1]);
			//     selfRef.crMax = selfRef.currSet.features[selfRef.sliderVals[1]].attributes[selfRef.curField];
			//     selfRef.setMaxMinNodes(0);
			//     selfRef.execQuery(1);
			//   }
			// });

			// document.getElementById("indPicker").addEventListener("change", ev => {
			//   if (this.subset && this.featureLayer) {
			//     this.setIndicatorLayer(ev.currentTarget.value);
			//   }
			// });

			var self = this;
			document.getElementById('indPicker').onchange = function () {
				self.setIndicatorLayer(document.getElementById('indPicker').value);
				self.setLegendColor();
			};

			document.getElementById('indTogB').addEventListener('click', (ev) => {
				if (this.featureLayer) {
					this.map.removeLayer(this.map.getLayer(`${this.curField} Indicator`));
					this.featureLayer = null;
				}
				this.setLegend(ev.currentTarget);
				if (this.subset && this.typeInd) this.setIndicatorLayer(document.getElementById('indPicker').value);
			});

			this.loaderWidget = WidgetManager.getInstance().getWidgetByLabel('MapProgress');
			//this.loaderWidget.visible = false;
		},

		/**
		 * Sets the color of the legend based on user-selected color.
		 */
		setLegendColor: function () {
			switch (document.getElementById('indTogB').innerText) {
				case 'Max':
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;vertical-align:middle;'> View maximum values on map: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Min </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Max </div>  </div>`;
					break;
				case '-Δ':
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> Displays value of change from previous to current year: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Max </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Min </div>  </div>`;
					break;
				case '+Δ':
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> Displays value of change from previous to current year: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Min </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Max </div>  </div>`;
					break;
				case 'Min':
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> View minimum values on map: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Max </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Min </div>  </div>`;
					break;
			}
		},

		/**
		 * Cycles button from Min -> Max -> -Δ -> +Δ -> Off -> Min
		 * @param {Button} obj The current HTML button element
		 */
		setLegend: function (obj) {
			switch (obj.innerText) {
				case 'Min':
					obj.innerText = 'Max';
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> View maximum values on map: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Min </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Max </div>  </div>`;
					this.typeInd = 2;
					break;
				case 'Max':
					obj.innerText = '-Δ';
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> Displays value of change from previous to current year: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Max </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Min </div>  </div>`;
					this.typeInd = 3;
					break;
				case '-Δ':
					obj.innerText = '+Δ';
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='flex-basis: 100%;'> Displays value of change from previous to current year: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Min </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Max </div>  </div>`;
					this.typeInd = 4;
					break;
				case '+Δ':
					obj.innerText = 'Off';
					document.getElementById('legend').innerHTML = `<div class="flex-container-PC" style='justify-content: center; flex-basis: 100%;'>  Add layer to map based on: </div>`;
					this.typeInd = 0;
					break;
				case 'Off':
					obj.innerText = 'Min';
					document.getElementById(
						'legend'
					).innerHTML = `<div class="flex-container-PC" style='justify-content: center;'> <div class="flex-container-PC" style='justify-content: center; flex-basis: 100%;'> View minimum values on map: </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						5,
						1
					)}'></div> <div> Max </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						30,
						1
					)}'></div>  <div>  High </div> <div class="box" style='background:${this.hexToHSL(
						document.getElementById('indPicker').value,
						55,
						1
					)}'></div>  <div>  Low </div> <div class="box" style='background:${this.hexToHSL(document.getElementById('indPicker').value, 80, 1)}'></div>  <div>  Min </div>  </div>`;
					this.typeInd = 1;
					break;
			}
		},

		openGraph: function (newFieldNode) {
			if (newFieldNode == this.prevFieldNode) return;

			if (this.featureLayer) {
				this.map.removeLayer(this.map.getLayer(`${this.curField} Indicator`));
				this.featureLayer = null;
			}

			console.log('New field node was ' + newFieldNode);

			let widConf;

			this.query.where = this.baseWhere;
			this.query.outFields = ['*']; // just in case
			this.curField = null;

			switch (newFieldNode) {
				// Menu 1
				case 'Averages by Jurisdiction':
					widConf = this._getWidgetConfig('Average Values', false);
					break;
				case 'RPA in Current Extent':
					widConf = this._getWidgetConfig('RPA by Year', false);
					break;
				//  Menu 2
				//case 'FAIL_COUNT':
					//this.query.where += ` AND PAVE_TYPE=PCC`;
					//widConf = this._getWidgetConfig('FAIL_COUNT', false);
					//break;
				case 'IRI':
					this.query.where += ` AND IRI<>999`;
					widConf = this._getWidgetConfig('IRI', false);
					break;
				case 'RUT':
					this.query.where += ` AND PAVE_TYPE<>PCC`;
					widConf = this._getWidgetConfig('RUT', false);
					break;
				default:
					widConf = this._getWidgetConfig(newFieldNode, false);
					break;
			}

			if (this.curTab != 0) {
				this.curField = newFieldNode;
				this.query.outFields = [this.curField, `OBJECTID`, `YEAR`];
				this.query.where += ` AND ${this.curField}<>0`;
				this.query.orderByFields = [this.curField];
			}
			this.execQuery(0);

			if (widConf == null) return;

			var headWidget = WidgetManager.getInstance().getControllerWidgets()[0]; // WidgetManager.getInstance().getWidgetByLabel(this._getWidgetConfig('Header', true).label);

			if (this.curWidget != null) {
				PanelManager.getInstance().closePanel(this.curWidget.id + '_panel');
				headWidget._removeFromOpenedIds([this.curWidget.id]);
			}

			widConf.visible = true;
			headWidget._createItem(widConf, headWidget.iconList.length + 1);
			headWidget.setOpenedIds([widConf.id]);

			this.curWidget = widConf;
			prevFieldNode = newFieldNode;
			headWidget.resize();

			// if (temp.visible) {
			//   temp.visible = false;
			//   PanelManager.getInstance().closePanel(temp.id + '_panel')
			//   headWidget._removeFromOpenedIds([temp.id])
			//   WidgetManager.getInstance().openWidget("widgets_MapProgress_Widget_NaN");
			// }
		},

		// CPU heavy process to disable any values with no results.
		checkIfEmpty: function () {
			this.selectAVG.options.forEach((element) => {
				var value;
				for (let i = 0; i < this.subset.length; i++) {
					value = this.subset[i].attributes[element.value];
					if (!value) {
						element.disabled = 'disabled';
						break;
					} else if (
						(element.value == 'FAIL_COUNT' && this.subset[i].attributes['PAVE_TYPE'] != 'PCC') ||
						(element.value == 'IRI' && value == 999) ||
						(element.value == 'RUT' && this.subset[i].attributes['PAVE_TYPE'] == 'PCC')
					) {
						element.disabled = 'disabled';
						break;
					}
				}
			});
		},

		// LEVEL 1 (1)
		// Nuke | Lightning |

		//utility function to get the proper widget config based on: the widget name !Not Label but Name!
		_getWidgetConfig: function (widget, useName) {
			var widgetCnfg = null;
			array.some(WidgetManager.getInstance().appConfig.widgetPool.widgets, function (aWidget) {
				if ((aWidget.label == widget && !useName) || (aWidget.name == widget && useName)) {
					widgetCnfg = aWidget;
					return true;
				}
				return false;
			});
			if (!widgetCnfg) {
				/*Check OnScreen widgets if not found in widgetPool*/
				array.some(WidgetManager.getInstance().appConfig.widgetOnScreen.widgets, function (aWidget) {
					if ((aWidget.label == widget && !useName) || (aWidget.name == widget && useName)) {
						widgetCnfg = aWidget;
						return true;
					}
					return false;
				});
			}
			return widgetCnfg;
		},

		drawSwitches: function () {
			document.getElementById('place').innerHTML = '';
			for (let i = 0; i < window.yearArrI.length; i++) {
				if (window.yearArrI[i]) {
					// add / make switches visible
					var label = document.createElement('label');
					label.setAttribute('class', 'switch');

					var div = document.createElement('div');
					div.setAttribute('class', 'sliderPC' + i + ' round'); // to change is the div class

					label.appendChild(window.yearArr[i]);
					label.appendChild(div);

					document.getElementById('place').appendChild(label);

					//var div = document.createElement("div");
					//div.appendChild(label);
				}
			}
		},

		onReceiveData: function (name, widgetId, data, historyData) {
			console.log('Received data from ' + name + ' with data equal to: ' + data);
			if (name == 'Splash' && (window.isSplash || data.target != 'AttributeTable')) {
				this.setYearWhere();
				//filter out messages
				if (widgetId != 'Splash_T') {
					this.query = historyData[historyData.length - 1].value; // I'm assuming nothing else is using the data manager and know that query is at index 0
				} else {
					this.query = data;
				}
				this.query.returnDistinctValues = false;
				this.query.returnGeometry = true;
				this.baseWhere = this.query.where;
				// Show PCI and PCI6 if RPA, only PCI6 if jurisdiction of city, and only PCI if County and not RPA
				var str = this.query.where;
				var index = str.indexOf('=');
				if (str.substring(0, index) != 'RPA') {
					if (str.length > index + 4 && str.substring(index + 2, index + 4) == 'CI') {
						this.selectAVG.removeOption('PCI');
					} else {
						//this.selectAVG.removeOption('PCI6');
						this.selectAVG.removeOption('CityPCI');
					}
				}
				//console.log("Received data from " + name + ". Query.where is: " + this.query.where);
			} else if (name == 'selectOR') {
				var temp = [];
				// this.updateSource(temp.filter(n => !data.includes(n.attributes.OBJECTID)), 0);
				for (let i = 0; i < this.currSet.features.length; i++) {
					if (data.includes(this.currSet.features[i].attributes.OBJECTID)) temp.push(this.currSet.features[i]);
				}
				this.updateSource(this.currSet, temp);
			} else if (name == 'selectCLR') {
				this.updateSource(this.currSet, this.currSet.features);
			} else if (name == 'yearToggle' && !window.isSplash) {
				this.setYearWhere();
				this.execQuery(0);
			} else if (name == 'HOME') {
				window.yearArrI = null;
				window.yearArr = null;
				if (this.featureLayer) {
					this.map.removeLayer(this.map.getLayer(`${this.curField} Indicator`));
					this.featureLayer = null;
				}
				var headWidget = WidgetManager.getInstance().getControllerWidgets()[0]; // WidgetManager.getInstance().getWidgetByLabel(this._getWidgetConfig('Header', true).label);

				if (this.curWidget != null) {
					PanelManager.getInstance().closePanel(this.curWidget.id + '_panel');
					headWidget._removeFromOpenedIds([this.curWidget.id]);
				}
				PanelManager.getInstance().closePanel('PickColumns__32_panel');
				headWidget._removeFromOpenedIds(['PickColumns__32']);
				WidgetManager.getInstance().closeWidget('PickColumns__32');
			}
			window.isSplash = 0;
		},

		setYearWhere: function () {
			this.yearWhere = '';
			let year;
			this.yearCount = 0;
			for (let i = 0; i < window.yearArrI.length; i++) {
				if (window.yearArrI[i] === 2) {
					if (this.yearWhere != '') {
						this.yearWhere += ' OR YEAR = ' + (2013 + i);
					} else {
						this.yearWhere = ' AND (YEAR = ' + (2013 + i);
					}
					this.yearCount++;
				}
			}
			if (this.yearWhere === '') {
				this.yearWhere = ' AND (YEAR = 1000)'; // return no results
			} else {
				this.yearWhere += ')';
			}
		},

		execQuery: function (mode) {
			var tmp = this.query.where;
			this.query.where += this.yearWhere;
			switch (mode) {
				case 0:
					this.loaderWidget.showOrHide(1, false);
					this.queryTask.execute(this.query, (result) => this.updateSource(result, 0));
					break;
				case 1:
					this.loaderWidget.showOrHide(1, false);
					this.query.where += ` AND ${this.curField} >= ${this.crMin} AND ${this.curField} <= ${this.crMax}`;
					this.queryTask.execute(this.query, (result) => this.updateSource(this.currSet, result));
					break;
				case 2:
					return this.queryTask.execute(this.query);
			}

			console.log('Executed query with where = ' + this.query.where);
			this.query.where = tmp;
		},

		updateSource: function (result, isSel) {
			var isSlider = isSel.features ? 1 : 0;
			if (!isSel) {
				isSel = result.features;
			} else if (isSlider) {
				isSel = isSel.features;
			}

			try {
				this.updateDataSourceData(0, {
					features: isSel,
				});
			} catch (e) {
				console.error(e);
			}

			this.currSet = result;
			this.subset = isSel;

			if (this.curField) {
				// if (!isSlider && this.subset.length !== 1) {
				//   this.slider.removeAttribute("disabled");
				//   slider.noUiSlider.updateOptions({
				//     start: [0, this.subset.length - 1],
				//     range: {
				//       min: 0,
				//       max: this.subset.length - 1
				//     }
				//   });
				//   this.sliderVals[0] = 0;
				//   this.sliderVals[1] = this.subset.length - 1;
				// }
				this.setValues(0);
				this.setIndicatorLayer(document.getElementById('indPicker').value);
			} else {
				//this.slider.setAttribute("disabled", true);
			}
			this.loaderWidget.showOrHide(0, false);
			//this.checkIfEmpty();
		},

		// concatenate string based on: value in min or max for the interactive button
		setMaxMinNodes(isMin) {
			var x = isMin ? this.crMin : this.crMax;
			var y = isMin ? 'minSpan' : 'maxSpan';

			if (x >= 0 && x <= 99999999) {
				if (x >= 1000 && x <= 9999) {
					var string = (x + '').substring(0, 4);
					document.getElementById(y).innerHTML = string;
				} else if (x >= 100000 && x <= 999999) {
					document.getElementById(y).innerHTML = (x + '').substring(0, 3) + 'k';
				} else if (x >= 1000000 && x <= 9999999) {
					document.getElementById(y).innerHTML = (x + '').substring(0, 1) + '.' + (x + '').substring(1, 3) + 'm';
				} else {
					document.getElementById(y).innerHTML = (x + '').substring(0, 5);
				}
			} else {
				console.log(console.log(`For ${this.curField}, value was ${isMin ? this.crMin : this.crMax}!`));
				document.getElementById(y).innerHTML = 'none';
			}
		},

		setValues: function (updateSlider) {
			var arr = [];
			for (let i = 0; i < this.subset.length; i++) arr.push(this.subset[i].attributes[this.curField]);

			if (updateSlider) {
				this.maxF = this.crMax = Math.max.apply(Math, arr);
				this.minF = this.crMin = Math.min.apply(Math, arr);

				//this.setMaxMinNodes(0);
				//this.setMaxMinNodes(1);
			}

			//var slider = document.getElementById('redSlider');
			//slider.setAttribute('min', 0);
			//slider.setAttribute('max', this.subset.length - 1);
			//slider.setAttribute('value', slider.max);

			this.avgF = Math.round((1000 * arr.reduce((a, b) => a + b, 0)) / arr.length) / 1000;
			if (!this.subset.length) {
				document.getElementById('count').innerHTML = `No year selected`;
			} else if (this.curTab === 1) {
				if (this.subset.length === 1) {
					document.getElementById('count').innerHTML = `${this.avgF} is the average for ${this.subset.length} record`;
				} else {
					document.getElementById('count').innerHTML = `${this.avgF} is the average for ${this.subset.length} records`;
				}
			} else {
				document.getElementById('count').innerHTML('No field selected');
			}
			console.log(`For ${this.curField}, max value was ${this.maxF} & min was ${this.minF}`);
		},

		changeMinandMax: function (values, handle) {
			if (!this.subset) return;
			if (!handle) {
				// min
				this.crMin = this.subset[values[0]];
				this.setMaxMinNodes(0);
			} else {
				//max
				this.crMax = this.subset[values[1]];
				this.setMaxMinNodes(1);
			}
		},

		setIndicatorLayer: function (color) {
			if (!this.query.returnGeometry || !this.typeInd || (this.yearCount < 2 && (this.typeInd === 3 || this.typeInd === 4))) {
				console.log(
					`Not drawing indicator layer. !returnGeometry was ${!this.query.returnGeometry} or !typeInd was ${!this.typeInd} or (yearCount was ${
						this.yearCount
					} (< 2) and typeInd was ${this.typeInd} (= 3)`
				);
				return;
			}

			if (this.featureLayer) {
				this.map.removeLayer(this.map.getLayer(`${this.curField} Indicator`));
				this.featureLayer = null;
			}

			console.log('Drawing indicator layer with color = ' + color);

			if (this.currSet.length === 0) {
				alert('No results found.');
			} else {
				var geometryTypeQuery = this.currSet.features.geometryType;

				var symbolQuery = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([128, 128, 128], 1), 2);

				//create a feature collection
				var featureCollection = {
					layerDefinition: null,
					featureSet: {
						features: [],
						geometryType: geometryTypeQuery,
					},
				};

				featureCollection.layerDefinition = {
					geometryType: geometryTypeQuery,
					drawingInfo: {
						renderer: {
							type: 'simple',
							symbol: symbolQuery.toJson(),
						},
					},
					fields: this.currSet.fields,
				};

				//create a feature layer based on: the feature collection
				this.featureLayer = new FeatureLayer(featureCollection, {
					id: `${this.curField} Indicator`,
					infoTemplate: window.myInfoTemplate,
				});

				this.map.addLayer(this.featureLayer);

				if (this.typeInd === 3 || this.typeInd === 4) {
					if (this.yearCount < 2) {
						alert('Cannot draw layer – drawing change by year requires at least two years selected.');
						return;
					}
					// Find object,
					for (var i = 0; i < this.subset.length; i++) {
						for (var j = i + 1; j < this.subset.length; j++) {
							if (this.subset[i].attributes['HIST_ID_INT'] === this.subset[j].attributes['HIST_ID_INT']) {
								var feature = this.subset[i];
								var portion;
								if (this.subset[i].attributes['YEAR'] < this.subset[j].attributes['YEAR']) {
									portion = this.subset[j].attributes[this.curField] / this.subset[i].attributes[this.curField];
								} else {
									portion = this.subset[i].attributes[this.curField] / this.subset[j].attributes[this.curField];
								}

								diff =
									this.typeInd === 3
										? Math.min(Math.max(20 * portion, 20), 80) // negative
										: Math.min(Math.max((1 / portion) * 20, 20), 80); // positive

								feature.setSymbol(
									new SimpleLineSymbol( // not efficient to create new symbol for each item in table, but needed to add unique color
										SimpleLineSymbol.STYLE_SOLID,
										new Color(this.hexToHSL(color, diff)), // low diff = high value relative to max
										3
									)
								);
								this.featureLayer.add(feature);
								break;
							}
						}
					}
				} else {
					//loop though the features
					for (var i = 0, len = this.subset.length; i < len; i++) {
						var feature = this.subset[i];
						if (this.typeInd === 1) {
							// min
							diff = Math.min(Math.max(10 * (this.avgF / feature.attributes[this.curField]), 20), 80);
						} else if (this.typeInd === 2) {
							// max
							diff = Math.min(Math.max(10 * (feature.attributes[this.curField] / this.avgF), 20), 80);
							//console.log(diff);
							//diff = Math.max(Math.min(10 * (feature.attributes[this.curField] / this.avgF), 10), 75);
						}
						feature.setSymbol(
							new SimpleLineSymbol( // not efficient to create new symbol for each item in table, but needed to add unique color
								SimpleLineSymbol.STYLE_SOLID,
								new Color(this.hexToHSL(color, diff)), // low diff = high value relative to max
								3
							)
						);
						this.featureLayer.add(feature);
					}
				}
				this._openResultInAttributeTable(this.featureLayer);
			}
		},

		getYear: function (val) {
			switch (val) {
				case 0:
					return 2013;
				case 1:
					return 2014;
				case 2:
					return 2015;
				case 3:
					return 2016;
				case 4:
					return 2017;
				case 5:
					return 2018;
				case 6:
					return 2019;
				case 7:
					return 2020;
			}
			/* YEAR Update - handle cases for each year */
		},

		getGraphicExtent: function (index) {
			// Adjust slider to set MIN and to updateSource only with objects > MIN
			if (this.currSet.features) {
				var g = this.currSet.features[0].geometry,
					fullExt = g.getExtent(),
					ext,
					i,
					il = this.currSet.features.length;

				if (index) {
					ext = (g = this.currSet.features[index].geometry).getExtent();
					if (!ext) {
						console.log(`Ext was null, not setting extent`);
						return;
					}
					this.map.setExtent(ext);
					document.getElementById('count').innerHTML = `Selected ${this.curField} = ${this.currSet.features[index].attributes[this.curField]} for item ${parseInt(index) + 1} of ${
						this.currSet.features.length
					}`;
					return ext;
				}

				if (fullExt === null) {
					fullExt = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
				}
				for (i = 1; i < il; i++) {
					ext = (g = this.currSet.features[i].geometry).getExtent();
					if (ext === null) {
						ext = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
					}
					fullExt = fullExt.union(ext);
				}
				this.map.setExtent(fullExt);
			} else {
				console.log('Source Layer has not been initialized  -- subset was null');
			}
		},

		calcGraphicsExtent: function (val) {
			if (this.subset) {
				var g = this.subset[0].geometry,
					fullExt = g.getExtent(),
					ext,
					i,
					il = this.subset.length;

				if (val) {
					if (val == 'min' && this.minF != null) {
						ext = (g = this.subset.find((el) => el.attributes[this.curField] === this.minF).geometry).getExtent();
					} else if (val == 'max' && this.maxF != null) {
						ext = (g = this.subset.find((el) => el.attributes[this.curField] === this.maxF).geometry).getExtent();
					}

					if (!ext) {
						console.log(`Ext was null, not setting extent`);
						return;
					}
					this.map.setExtent(ext);
					return ext;
				}

				if (fullExt === null) {
					fullExt = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
				}
				for (i = 1; i < il; i++) {
					ext = (g = this.currSet.features[i].geometry).getExtent();
					if (ext === null) {
						ext = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
					}
					fullExt = fullExt.union(ext);
				}
				this.map.setExtent(fullExt);
			} else {
				console.log('Source Layer has not been initialized  -- subset was null');
			}
		},

		hexToRgb: function (hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result
				? {
						r: parseInt(result[1], 16),
						g: parseInt(result[2], 16),
						b: parseInt(result[3], 16),
				  }
				: null;
		},

		hexToHSL: function (H, percent, returnHex) {
			// Convert hex to RGB first
			let r = 0,
				g = 0,
				b = 0;
			if (H.length == 4) {
				r = '0x' + H[1] + H[1];
				g = '0x' + H[2] + H[2];
				b = '0x' + H[3] + H[3];
			} else if (H.length == 7) {
				r = '0x' + H[1] + H[2];
				g = '0x' + H[3] + H[4];
				b = '0x' + H[5] + H[6];
			}
			// Then to HSL
			r /= 255;
			g /= 255;
			b /= 255;
			let cmin = Math.min(r, g, b),
				cmax = Math.max(r, g, b),
				delta = cmax - cmin,
				h = 0,
				s = 0,
				l = 0;

			if (delta == 0) h = 0;
			else if (cmax == r) h = ((g - b) / delta) % 6;
			else if (cmax == g) h = (b - r) / delta + 2;
			else h = (r - g) / delta + 4;

			h = Math.round(h * 60);

			if (h < 0) h += 360;

			l = (cmax + cmin) / 2;
			s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
			s = +(s * 100).toFixed(1);
			l = +(l * 100).toFixed(1);

			if (returnHex) return this.hslToHex(h, s, percent);
			return 'hsl(' + h + ',' + s + '%,' + percent + '%)';
		},

		hslToHex: function (h, s, l) {
			h /= 360;
			s /= 100;
			l /= 100;
			let r, g, b;
			if (s === 0) {
				r = g = b = l; // achromatic
			} else {
				const hue2rgb = (p, q, t) => {
					if (t < 0) t += 1;
					if (t > 1) t -= 1;
					if (t < 1 / 6) return p + (q - p) * 6 * t;
					if (t < 1 / 2) return q;
					if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
					return p;
				};
				const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
				const p = 2 * l - q;
				r = hue2rgb(p, q, h + 1 / 3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1 / 3);
			}
			const toHex = (x) => {
				const hex = Math.round(x * 255).toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			};
			return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
		},

		_listenDSManagerUpdateEvent: function () {
			this.exdsBeginUpdateHandle = on(
				this.dataSourceManager,
				'begin-update',
				lang.hitch(this, function (dsid) {
					this._handleLoadingStatusForExds(dsid, true);
				})
			);
		},

		_checkDataSource: function (config) {
			var dataSource = config && config.dataSource;
			var res = this._checkDataSourceCode(dataSource);
			this._avalidDataSource = res.code === 0;
			if (!this._avalidDataSource && this.mainDijit) {
				this.mainDijit.showNodata(res.message);
			}
		},

		_openResultInAttributeTable: function (currentLayer) {
			if (this.autozoomtoresults) {
				setTimeout(
					lang.hitch(this, function () {
						this.zoomall();
					}),
					300
				);
			}
			var aLayer = {
				layerObject: currentLayer,
				title: currentLayer.name,
				id: currentLayer.id,
				getLayerObject: function () {
					var def = new Deferred();
					if (this.layerObject) {
						def.resolve(this.layerObject);
					} else {
						def.reject('layerObject is null');
					}
					return def;
				},
			};
			if (!Object.create) {
				Object.create = function (proto, props) {
					if (typeof props !== 'undefined') {
						throw 'The multiple-argument version of Object.create is not provided by this browser and cannot be shimmed.';
					}

					function ctor() {}
					ctor.prototype = proto;
					return new ctor();
				};
			}
			this.publishData({
				target: 'AttributeTable',
				layer: Object.create(aLayer),
			});
		},

		onOpen: function () {
			console.log('onOpen');
			this.queryTask = new QueryTask('https://ipmp.ctre.iastate.edu/arcgis/rest/services/mapservice20/MapServer/9');
			this.fetchDataByName('Splash');
			this.drawSwitches();

			window.PC = 1; // this is only to show splash PC has been loaded
		},

		onClose: function () {
			if (this.featureLayer) {
				this.map.removeLayer(this.map.getLayer(`${this.curField} Indicator`));
				this.featureLayer = null;
			}
			console.log('onClose');
		},

		onMinimize: function () {
			console.log('onMinimize');
		},

		onMaximize: function () {
			console.log('onMaximize');
		},

		onSignIn: function (credential) {
			/* jshint unused:false*/
			console.log('onSignIn');
		},

		onSignOut: function () {
			console.log('onSignOut');
		},
	});
});
