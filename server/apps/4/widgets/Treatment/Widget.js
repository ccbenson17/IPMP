/**
 * @fileoverview
 * (Custom Widget - {@link module:Treatment|More info}) Treatment provides an interface for selecting points from the rawdata FeatureSet, and calculates cost estimates for projects based on the selection. On open, it hides current layers, and makes the rawdata featureSet visible on the map.
 */
/*global define, console, setTimeout*/
define([
	//dojo
	'dojo/_base/declare',
	'jimu/BaseWidget',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/Button',
	'dojo/on',
	'dojo/dom',
	'dojo/aspect',
	'dijit/form/SimpleTextarea',
	'dojo/dom-class',
	'dojo/_base/array',
	'dojo/string',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dojo/promise/all',

	'esri/map',
	'esri/tasks/StatisticDefinition',
	'esri/toolbars/draw',
	'esri/graphic',

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
	'esri/request',
	'esri/InfoTemplate',
	'dojo/promise/all',
	'dojo/dom-class',
	'esri/lang',
	'jimu/dijit/LoadingShelter',
	'esri/Color',
	'dijit/registry',
	'esri/plugins/FeatureLayerStatistics',
	'jimu/WidgetManager',
	'dojo/domReady!',
], function (
	//dojo
	declare,
	BaseWidget,
	_WidgetsInTemplateMixin,
	Button,
	on,
	dom,
	aspect,
	SimpleTextarea,
	domClass,
	array,
	dojoString,
	lang,
	Deferred,
	all,

	Map,
	StatisticDefinition,
	Draw,
	Graphic,

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
	registry,
	FeatureLayerStatistics,
	WidgetManager
) {
	/**
	 * @module Treatment
	 */
	return declare([BaseWidget, _WidgetsInTemplateMixin], {
		// DemoWidget code goes here

		//please note that this property is be set by the framework when widget is loaded.
		//templateString: template,

		baseClass: 'jimu-widget-PickColumns',
		name: 'PickColumns',
		label: 'PickColumns',

		selectedYear: null,
		oldFeature: null,
		selectionToolbar: null,
		fieldsSelectionSymbol: null,
		content: null,
		infoTemplate: null,
		featureLayer: null,
		selectQuery: null,
		query: null,
		loaderWidget: null,
		badQuery: null,
		recursionBind: null,

		postCreate: function () {
			this.inherited(arguments);
			console.log('postCreate');
		},

		/**
		 * On startup, the Treatment Widget hides all current layers from the map, and adds the points (rawdata) layer. This Widget provides functionality to select a region of points, and provide cost analysis on the selected data.
		 */
		startup: function () {
			this.inherited(arguments);

			// on(this.selectYR, "change", ev => {
			//   this.setActiveLayer();
			// });

			this.fieldsSelectionSymbol = new SimpleFillSymbol(
				SimpleFillSymbol.STYLE_SOLID,
				new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color('#00ffff'), 2),
				new Color([255, 255, 0, 0.5])
			);

			this.selectQuery = new Query();
			// selectQuery.distance = 16;  // Return all segments within 16m of the point
			//selectQuery.units = "meters";
			this.selectQuery.outFields = ['*'];
			this.initSelectToolbar();

			on(dom.byId('selectFieldsButton'), 'click', (ev) => {
				this.selectionToolbar.activate(Draw.EXTENT);
			});

			on(dom.byId('clearSelectionButton'), 'click', (ev) => {
				dom.byId('IriResult').innerHTML = ' ';
				dom.byId('RutResult').innerHTML = ' ';
				dom.byId('LongResult').innerHTML = ' ';
				dom.byId('TransResult').innerHTML = ' ';
				dom.byId('AlligResult').innerHTML = ' ';
				dom.byId('DcrackResult').innerHTML = ' ';
				dom.byId('JspallResult').innerHTML = ' ';
				dom.byId('sumLengthResult').innerHTML = '<i>No Selected Fields</i>';
				dom.byId('colYear').innerHTML = ' ';

				//dom.byId("clearSelectionButton").disabled = true;
			});

			this.own(
				on(
					this.selectionToolbar,
					'DrawEnd',
					lang.hitch(this, function (geometry) {
						if (this.featureLayer) {
							this.selectionToolbar.deactivate();
							this.selectQuery.geometry = geometry;
							this.featureLayer.selectFeatures(this.selectQuery, FeatureLayer.SELECTION_NEW);
						}
					})
				)
			);

			document.getElementById('pave_type').value = 'PCC';

			this.loaderWidget = WidgetManager.getInstance().getWidgetByLabel('MapProgress');
			this.recursionBind = 0;
		},

		/**
		 * Draws the PCI Line layer on map
		 * @param {*} featureSet The result of the query from https://ipmp.ctre.iastate.edu/arcgis/rest/services/aphares/March/MapServer/
		 */
		setLayer: function (featureSet) {
			if (this.featureLayer) {
				this.map.removeLayer(this.map.getLayer('Treatment'));
				this.featureLayer = null;
			}

			// This, when map on layer has correct fields: this.featureLayer = this.map.getLayer(this.selectedYear)
			var resultFeatures = featureSet.features;

			if (resultFeatures.length === 0) {
				alert('No results found.');
			} else {
				//this.map.graphics.clear();
				var geometryTypeQuery = featureSet.geometryType;

				var symbolQuery = new SimpleMarkerSymbol(
					new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 20, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color([0, 0, 205, 1]), 1), new Color([0, 0, 205, 0.5]))
				);

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
					fields: featureSet.fields,
				};

				var fieldsSelectionSymbol = (this.featureLayer = new FeatureLayer(featureCollection, {
					id: 'Treatment',
					infoTemplate: window.myInfoTemplate,
					mode: FeatureLayer.MODE_ON_DEMAND,
					hasGeometryProperties: true,
					outFields: ['*'],
				}));

				//loop though the features
				var color, pci;
				for (var i = 0, len = resultFeatures.length; i < len; i++) {
					var feature = resultFeatures[i];
					pci = feature.attributes['PCI'];

					if (pci <= 20) {
						color = 'red';
					} else if (pci <= 40) {
						color = 'orange';
					} else if (pci <= 60) {
						color = 'yellow';
					} else if (pci <= 80) {
						color = 'green';
					} else {
						color = 'blue';
					}

					feature.setSymbol(new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, new Color(color), 1), new Color(color)));
					this.featureLayer.add(feature);
				}

				// //loop though the features
				// for (var i = 0, len = resultFeatures.length; i < len; i++) {
				//   var feature = resultFeatures[i];
				//   feature.setSymbol(symbolQuery);
				//   this.featureLayer.add(feature);
				// }
			}

			this.map.addLayer(this.featureLayer);
			this.loaderWidget.showOrHide(0, false);
		},

		setActiveLayer: function () {
			if (this.featureLayer) {
				// this.selectQuery.geometry = null;
				// this.featureLayer.selectFeatures(this.badQuery, FeatureLayer.SELECTION_NEW);
			}
			// if (this.oldFeature) {
			//   // This will probably cause a lot of issues, but there's no deep copy method for a featureLayer object, which comes as a great surprise from esri.
			//   this.map.removeLayer(this.map.getLayer(this.selectedYear));
			//   this.featureLayer = this.oldFeature;
			//   this.featureLayer.on("selection-complete", ev => function() {});
			//   this.featureLayer.on("selection-clear", ev => function() {});
			//   //this.featureLayer.setDefinitionExpression(null);
			//   //this.featureLayer.setSelectionSymbol(null);
			//   this.map.addLayer(this.featureLayer);
			// }
			var id = this.selectYR.get('value');
			switch (parseInt(id)) {
				case 1:
					this.selectedYear = '2018';
					break;
				case 2:
					this.selectedYear = '2017';
					break;
				case 3:
					this.selectedYear = '2016';
					break;
				case 4:
					this.selectedYear = '2015';
					break;
				case 5:
					this.selectedYear = '2014';
					break;
				case 6:
					this.selectedYear = '2013';
					break;
			}
			this.featureLayer = this.map.getLayer(this.selectedYear);
			this.oldFeature = Object.assign({}, this.featureLayer._graphicsVal);
			this.recursionBind = 0;

			this.featureLayer.setDefinitionExpression('PCI >= 0');
			this.featureLayer.setSelectionSymbol(this.fieldsSelectionSymbol);

			this.loaderWidget.showOrHide(0, false);
		},

		/**
		 * Determines if the given variable is of object type.
		 * @param {*} obj the variable to test
		 */
		isObject: function (obj) {
			var type = typeof obj;
			return type === 'function' || (type === 'object' && !!obj);
		},

		/**
		 * Performs an iterative clone of the given object.
		 * @param {*} src the object to copy
		 */
		iterationCopy: function (src) {
			let target = {};
			this.recursionBind++;
			for (let prop in src) {
				if (src.hasOwnProperty(prop)) {
					// if the value is a nested object, recursively copy all it's properties
					if (this.isObject(src[prop]) && this.recursionBind < 100) {
						target[prop] = this.iterationCopy(src[prop]);
					} else {
						target[prop] = src[prop];
					}
				}
			}
			return target;
		},

		initSelectToolbar: function () {
			this.selectionToolbar = new Draw(this.map);
		},

		/**
		 * Contains the calculations for performing cost analysis on the selected points.
		 * @param {FeatureLayer} result The elements selected by user.
		 */
		getStats: function (result) {
			results = result.features;
			// The return object of the query containing the statistics requested
			console.log(`Contained ${results.length}`);
			if (!results.length) {
				dom.byId('msgs').innerHTML = 'No items selected.';
				return;
			}
			document.getElementById('clearSelectionButton').disabled = false;

			var stats = results[0].attributes;
			var PaveType = results[0].attributes.PAVE_TYPE;

			// get date to use to query which year to use
			var maxTime = 0;
			var iri = 0;
			var rut = 0;
			var long = 0;
			var trans = 0;
			var allig = 0;
			var dcrack = 0;
			var jspall = 0;
			var lgth = 0;
			var pava = PaveType;

			let length = results.length;
			for (let i = 0; i < length - 1; i++) {
				stats = results[i].attributes;
				if (maxTime < stats.MAX_DATE) maxTime = stats.MAX_DATE;
				iri += stats.IRI;
				rut += (stats.AVG_LRUT + stats.AVG_RRUT) / 2;
				long += ((stats.LONG_L + stats.LONG_M + stats.LONG_H + stats.LONG_WP_L + stats.LONG_WP_M + stats.LONG_WP_H) / 5280) * stats.CALC_LGTH;
				trans += (((stats.TRANS_L + stats.TRANS_M + stats.TRANS_H) * 9.02) / 5280) * stats.CALC_LGTH;
				allig += (((stats.ALLIG_M + stats.ALLIG_H) * 24) / (stats.CALC_LGTH * 24)) * 100;
				dcrack += ((stats.DCRACK_M + stats.DCRACK_H) / 264) * (stats.CALC_LGTH / 20);
				jspall += ((stats.JSPALL_M + stats.JSPALL_H) / 264) * (stats.CALC_LGTH / 20);
				lgth += stats.CALC_LGTH / 5280;
			}
			iri = iri / length;
			rut = rut / length;

			// Print the statistic results to the DOM
			dom.byId('IriResult').innerHTML = Math.round(iri) + ' in/mi';
			dom.byId('RutResult').innerHTML = rut.toFixed(3) != 'NaN' ? rut.toFixed(3) + +' in' : 'No data';
			dom.byId('LongResult').innerHTML = long.toFixed(2) + ' ft/mi';
			dom.byId('TransResult').innerHTML = trans.toFixed(2) + ' ft/mi';
			dom.byId('AlligResult').innerHTML = allig.toFixed(2) + ' %';
			dom.byId('DcrackResult').innerHTML = dcrack.toFixed(2) + ' count/mi';
			dom.byId('JspallResult').innerHTML = jspall.toFixed(2) != 'NaN' ? jspall.toFixed(2) + ' count/mi' : 'No data';
			dom.byId('sumLengthResult').innerHTML = lgth.toFixed(2) + ' mi';
			dom.byId('colYear').innerHTML = stats.YEAR;

			var select_id = document.getElementById('pave_type');

			if (select_id.options[select_id.selectedIndex].value == 'PCC') {
				window.tempRef.PCCtreatments(long, trans, dcrack, jspall, lgth);
			} else {
				window.tempRef.ACCtreatments(rut, long, trans, allig, lgth);
			}
		},

		/**
		 * Additional cost estimate for when ACC is selected from Pavement menu
		 * @param {long} rut2 average rut from selected points
		 * @param {long} long3 average long from selected points
		 * @param {long} trans4 average trans from selected points
		 * @param {long} allig average allig from selected points
		 * @param {long} pmlgth  	average pmlgth from selected points
		 */
		ACCtreatments: function (rut2, long3, trans4, allig, pmlgth) {
			var i = 0;
			options = [];
			var strategy = {};
			var arrayLength = options.length;
			if ((allig > 5 && long3 > 5279) || trans4 > 1583 || rut2 > 0.26) {
				strategy = {
					title: 'Thick HMA OVERLAY',
					cost: pmlgth * 280000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (allig > 0 && rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
				strategy = {
					title: 'Milling & Overlay',
					cost: pmlgth * 120000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
				strategy = {
					title: 'Cold in Place Recycling',
					cost: pmlgth * 100000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
				strategy = {
					title: 'Mill & Overlay with Cold in Place Recycling',
					cost: pmlgth * 150000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (long3 > 5279 && trans4 > 1583) {
				strategy = {
					title: 'Whitetopping',
					cost: pmlgth * 300000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (rut2 > 0.26) {
				strategy = {
					title: 'Milling only',
					cost: pmlgth * 10000,
					remarks: 'Minor',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (long3 < 2040 && trans4 < 792) {
				strategy = {
					title: 'Thin HMA Overlay',
					cost: pmlgth * 52000,
					remarks: 'Minor',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (rut2 < 0.26 && long3 > 500 && long3 < 2640 && trans4 > 100 && trans4 < 792) {
				strategy = {
					title: 'Chip Seal',
					cost: pmlgth * 22000,
					remarks: 'Minor',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}
			if (rut2 < 0.26 && long3 > 500 && long3 < 2640 && trans4 > 100 && trans4 < 792) {
				strategy = {
					title: 'Microsurfacing',
					cost: pmlgth * 45000,
					remarks: 'Minor',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}
			if (rut2 < 0.26 && (long3 < 2640 || trans4 < 792)) {
				strategy = {
					title: 'Milling and Chip Seal',
					cost: pmlgth * 26000,
					remarks: 'Minor',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}
			if ((long3 > 100 && long3 < 2640) || (trans4 > 50 && trans4 < 792)) {
				strategy = {
					title: 'Crack Seal/Fill',
					cost: pmlgth * 5280,
					remarks: 'Preservation',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			if (allig > 0 && (long3 < 2040 || trans4 < 792)) {
				strategy = {
					title: 'Patching',
					cost: pmlgth * 30000,
					remarks: 'Localized',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '    ' + strategy.remarks;
				i++;
			}

			// loop through the array to append child to the innerHTML based on array length

			var content;
			arrayLength = options.length;
			//if array empty
			if (arrayLength < 1) {
				// insertAdjacentHTML() parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.

				dom.byId('msgs').innerHTML = 'No treatments proposed.';
				// dom.byId("msgs").innerHTML = arrayLength;
			}

			// else loop through the array to append child to the innerHTML based on array length
			else {
				dom.byId('msgs').innerHTML = "<div id='container'></div>";
				var div_treat = dom.byId('container');
				for (var t = 0; t < arrayLength; t++) {
					// this preserves the current html while adding to it
					var position = t + 1;
					div_treat.insertAdjacentHTML('beforeend', '<strong>Option ' + position + ":</strong><span class = 'stats'>" + options[t] + '</span><br>');
				}
			}
			//dom.byId("treat1").innerHTML = PaveType;
			// dom.byId("treat2").innerHTML = options[1];
			// dom.byId("treat3").innerHTML = options[2];

			dom.byId('treatments').style.display = 'block';
		},

		PCCtreatments: function (long5, trans6, dcrk, jsp, pmlgth) {
			var i = 0;
			options = [];
			var strategy = {};
			var arrayLength = options.length;
			if (long5 > 1319 && trans6 > 791) {
				strategy = {
					title: 'Thick HMA OVERLAY with Crack and Seat',
					cost: pmlgth * 280000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '-------- $' + Math.round(strategy.cost) + '------------ ' + strategy.remarks;
				i++;
			}

			if (long5 > 1319 && trans6 > 791) {
				strategy = {
					title: 'Thick HMA OVERLAY with Rubblization',
					cost: pmlgth * 200000,
					remarks: 'Major',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '          ' + strategy.remarks;
				i++;
			}

			if (long5 > 1319 || (trans6 > 791 && (dcrk < 5 || jsp < 5))) {
				strategy = {
					title: 'Full Depth Repair',
					cost: pmlgth * 125000,
					remarks: 'Localized',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '         ' + strategy.remarks;
				i++;
			}

			if (trans6 > 791) {
				strategy = {
					title: 'Slab Replacement',
					cost: pmlgth * 100000,
					remarks: 'Localized',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '        ' + strategy.remarks;
				i++;
			}

			if ((long5 < 1319 && long5 > 300) || (trans6 < 791 && trans6 > 200)) {
				strategy = {
					title: 'Crack Sealing',
					cost: pmlgth * 5280,
					remarks: 'Preservation',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '       ' + strategy.remarks;
				i++;
			}

			if (long5 < 500 || trans6 < 300) {
				strategy = {
					title: 'Do Nothing',
					cost: 0,
					remarks: 'No treatment proposed',
				};
				options[i] = strategy.title + '    $' + Math.round(strategy.cost) + '       ' + strategy.remarks;
				i++;
			}

			// loop through the array to append child to the innerHTML based on array length

			var content;
			arrayLength = options.length;
			//if array empty
			if (arrayLength < 1) {
				// insertAdjacentHTML() parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.

				dom.byId('msgs').innerHTML = 'No treatments proposed.';
				// dom.byId("msgs").innerHTML = arrayLength;
			}

			// else loop through the array to append child to the innerHTML based on array length
			else {
				dom.byId('msgs').innerHTML = "<div id='container'></div>";
				var div_treat = dom.byId('container');
				for (var t = 0; t < arrayLength; t++) {
					// this preserves the current html while adding to it
					var position = t + 1;
					div_treat.insertAdjacentHTML('beforeend', '<strong>Option ' + position + ":</strong><span class = 'stats'>" + options[t] + '</span><br>');
				}
			}
			//dom.byId("treat1").innerHTML = PaveType;
			// dom.byId("treat2").innerHTML = options[1];
			// dom.byId("treat3").innerHTML = options[2];

			dom.byId('treatments').style.display = 'block';
		},

		onReceiveData: function (name, widgetId, data, historyData) {
			console.log('Received data from ' + name + ' with data equal to: ' + data);
			if (name == 'Splash' && (window.isSplash || data.target != 'AttributeTable')) {
				console.log('treatment - received ' + data);
				// this.setYearWhere()
				// //filter out messages
				if (widgetId != 'Splash_T') {
					this.query = historyData[historyData.length - 1].value; // I'm assuming nothing else is using the data manager and know that query is at index 0
				} else {
					this.query = data;
				}
				this.query.returnDistinctValues = false;
				this.query.returnGeometry = true;
			}
		},

		removestuffs: function (testDiv) {
			testDiv.style.display = 'none';
			while (testDiv.hasChildNodes()) testDiv.removeChild(testDiv.lastChild);
			testDiv.style.display = display;
		},

		errback: function (err) {
			console.log("Couldn't retrieve summary statistics. ", err);
		},

		onOpen: function () {
			// var y = dom.byId("selectFieldsButton");
			// y.setDisabled(true);
			// var x = dom.byId("clearSelectionButton");
			// x.setDisabled(true);
			console.log('onOpen');
			this.map.graphicsLayerIds.forEach((id) => {
				this.map.getLayer(id).hide();
			});
			// Get rawdata -- called mapservice20_3812 as named in this.map.graphicLayerIds
			this.featureLayer = this.map.getLayer('mapservice20_3812');
			if (this.featureLayer) {
				this.featureLayer.show();
				this.featureLayer.on('selection-complete', this.getStats);
			}
			window.tempRef = this;
		},

		onClose: function () {
			window.tempRef = null;
			this.map.graphicsLayerIds.forEach((id) => {
				this.map.getLayer(id).show();
			});
			if (this.map.getLayer('mapservice20_3812')) this.map.getLayer('mapservice20_3812').hide();
			if (this.featureLayer) {
				//this.map.removeLayer(this.map.getLayer("Treatment"));
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
