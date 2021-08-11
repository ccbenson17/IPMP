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

/**
 * @fileoverview
 * (Custom Widget - {@link module:Splash|More info}) Splash Screen for web app. Links to IPMP home, and presents an interface for selecting a specific area & time of data to display.
 *
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/html',
	'dojo/on',
	'dojo/keys',
	'dojo/query',
	'dojo/cookie',
	'dijit/_WidgetsInTemplateMixin',
	'jimu/BaseWidget',
	'dojo/topic',
	'jimu/dijit/CheckBox',
	'jimu/utils',
	'esri/lang',
	'jimu/dijit/LoadingShelter',
	'dojo/Deferred',
	'dojox/form/CheckedMultiSelect',
	'dijit/form/TextBox',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'dojo/dom-construct',
	'dojo/dom',
	'esri/geometry/Point',
	'esri/geometry/Extent',
	'esri/InfoTemplate',
	'dojo/promise/all',
	'dojo/dom-class',
	'esri/config',
	'esri/renderers/UniqueValueRenderer',
	'esri/symbols/SimpleLineSymbol',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleMarkerSymbol',
	'esri/layers/FeatureLayer',
	'esri/request',
	'esri/Color',
	'jimu/WidgetManager',
	'dojo/domReady!',
], function (
	declare,
	lang,
	html,
	on,
	keys,
	query,
	cookie,
	_WidgetsInTemplateMixin,
	BaseWidget,
	topic,
	CheckBox,
	utils,
	esriLang,
	LoadingShelter,
	Deferred,
	CheckedMultiSelect,
	TextBox,
	Query,
	QueryTask,
	domConstruct,
	dom,
	Point,
	Extent,
	InfoTemplate,
	all,
	domClass,
	esriConfig,
	UniqueValueRenderer,
	SimpleLineSymbol,
	SimpleFillSymbol,
	SimpleMarkerSymbol,
	FeatureLayer,
	esriRequest,
	Color,
	WidgetManager
) {
	/**
	 * @module Splash
	 */
	var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
		baseClass: 'jimu-widget-splash',
		_hasContent: null,
		_requireConfirm: null,
		_isClosed: false,
		selectedYears: null,
		yearArr: null, // 0 ~ 2013, 1 ~ 2014, 2 ~ 2015, 3 ~ 2016... 5 ~ 2018
		yearArrI: null,
		selectedYearsText: null,
		selection: null,
		query: null,
		queryTask: null,
		rArr: null,
		cArr: null,
		jArr: null,
		jArrC: null,
		extent: null,
		yearC: null,
		featureLayer: null,
		loaderWidget: null,
		inputData: null,
		curAreaType: null,
		alem: null,
		blem: null,
		searchBox: null,
		oldInner: null,
		boxAlt: null,

		/**
		 * Load initial start up information
		 */
		postCreate: function () {
			this.inherited(arguments);
			html.setAttr(this.domNode, 'aria-label', this.nls._widgetLabel);

			//LoadingShelter
			this.shelter = new LoadingShelter({
				hidden: true,
			});
			this.shelter.placeAt(this.domNode);
			this.shelter.startup();

			this._hasContent = this.config.splash && this.config.splash.splashContent;
			this._requireConfirm = this.config.splash && this.config.splash.requireConfirm;
			this._showOption = this.config.splash && this.config.splash.showOption;
			this._confirmEverytime = this.config.splash && this.config.splash.confirmEverytime;

			if (this._hasContent) {
				this.customContentNode.innerHTML = this.config.splash.splashContent;
			}

			if (!this._requireConfirm && !this._showOption) {
				//html.setStyle(this.confirmCheck, 'display', 'none');
				html.addClass(this.okNode, 'enable-btn');
			} else {
				var hint = '';
				if (this._requireConfirm) {
					hint = this.config.splash.confirm.text;
					html.addClass(this.okNode, 'disable-btn');
				} else {
					hint = this.nls.notShowAgain;
					html.addClass(this.okNode, 'enable-btn');
				}
				// this.confirmCheck = new CheckBox({
				//   label: utils.stripHTML(hint),
				//   checked: false
				// }, this.confirmCheck);
				// this.own(on(this.selectYear, 'change', lang.hitch(this, this.isASwitchOn)));
				// this.confirmCheck.startup();

				this.selection = false;
			}
		},

		/**
		 * Runs on initial page load
		 */
		onOpen: function () {
			if (!utils.isInConfigOrPreviewWindow()) {
				var isFirstKey = this._getCookieKey();
				var isfirst = cookie(isFirstKey);
				if (esriLang.isDefined(isfirst) && isfirst.toString() === 'false') {
					this.close();
				}
			}
			// if (true === this._requireConfirm) {
			//   //checkbox
			//   this.confirmCheck.focus();
			// } else if ((false === this._requireConfirm && false === this._showOption) ||
			//   (false === this._requireConfirm && true === this._showOption)) {
			//   this.okNode.focus();
			// }
			if (!this._requireConfirm && !this._showOption) {
				this.okNode.focus();
			}
			// else {
			//   this.confirmCheck.focus();
			// }

			this._eventShow();
			window.isSplash = 1;
		},

		/**
		 * Sets up listeners on startup
		 */
		startup: function () {
			this.inherited(arguments);
			this.shelter.show();
			this._normalizeDomNodePosition();

			this._setConfig();

			this.own(
				on(
					this.domNode,
					'keydown',
					lang.hitch(this, function (evt) {
						if (html.hasClass(evt.target, this.baseClass) && evt.keyCode === keys.ESCAPE) {
							if (!this._requireConfirm) {
								this.close();
								utils.focusOnFirstSkipLink();
							}
						}
					})
				)
			);

			this.own(
				on(
					this.splashDesktop,
					'keydown',
					lang.hitch(this, function (evt) {
						if (html.hasClass(evt.target, 'jimu-widget-splash-desktop')) {
							if (evt.keyCode === keys.TAB) {
								evt.preventDefault();
							}
							//allow user to use tab-key to focus first node from widgetDom on this spacial widget.
							if (evt.keyCode === keys.ENTER || (!evt.shiftKey && evt.keyCode === keys.TAB)) {
								utils.focusFirstFocusNode(this.domNode);
							}
						}
					})
				)
			);

			var focusableNodes = utils.getFocusNodesInDom(this.domNode);
			utils.initFirstFocusNode(this.domNode, focusableNodes[0]);
			utils.initLastFocusNode(this.domNode, this.okNode);

			this._onlyFocus = true;
			this.own(
				on(
					this.customContentNode,
					'focus',
					lang.hitch(this, function () {
						if (this._onlyFocus) {
							this._onlyFocus = false;
						} else {
							this.customContentNode.scrollTop = 0;
							html.setStyle(this.customContentNode, 'display', 'none');
							// blur current node's focus state. It only works when it's between up and down settings.
							// this.domNode.focus(); //This causes the page to flicker.
							this.customContentNode.blur();
							html.setStyle(this.customContentNode, 'display', 'block');
							setTimeout(
								lang.hitch(this, function () {
									this._onlyFocus = true;
									this.customContentNode.focus();
								}),
								30
							);
						}
					})
				)
			);

			var smenu = document.querySelector('.sdropdown-el');
			smenu.addEventListener('click', (e) => this.onChangeSD(e, smenu));

			//var menu = document.querySelector('.dropdown-el');
			document.getElementById('enterData').addEventListener('change', lang.hitch(this, this.setSwitches));

			utils.setWABLogoDefaultAlt(this.customContentNode);

			this.handlerExecQuery();

			// Textbox search
			var myTextBox = new dijit.form.TextBox(
				{
					name: 'firstname',
					value: '' /* no or empty value! */,
					placeHolder: 'type in your name',
				},
				'firstname'
			);
			this.loaderWidget = WidgetManager.getInstance().getWidgetByLabel('MapProgress');
		},

		/**
		 * Fires when input menu is selected / clicked
		 * @param {*} e event
		 * @param {*} menu menu that displays available jurisdictions / area to select
		 */
		onChangeSD: function (e, menu) {
			e.preventDefault();
			e.stopPropagation();
			if (menu.classList.value === 'sdropdown-el expanded') {
				menu.classList.value = 'sdropdown-el';
				this.curAreaType = e.target.attributes[0].value;
				menu.scrollTop = 0;
				this.alem = document.querySelectorAll(`#${this.curAreaType}`)[0];
				this.alem.checked = true;
				this.setMenuItems();
			} else {
				if (this.alem) this.alem.checked = false;
				menu.classList.value = 'sdropdown-el expanded';
			}
		},

		/**
		 * Sets up and executes query
		 */
		handlerExecQuery: function () {
			// Using baseURl just in case we need to query multiple layers by year
			this.baseURL = 'https://ipmp.ctre.iastate.edu/arcgis/rest/services/mapservice20/MapServer/9';
			//this.baseURL2 = "https://ipmp.ctre.iastate.edu/arcgis/rest/services/mapservice19/MapServer/";
			//this.queryTask = new QueryTask('https://ipmp.ctre.iastate.edu/arcgis/rest/services/featservice15/FeatureServer/1/');
			lang.hitch(this, this.executeQueryTask('init'));
		},

		/**
		 * Handles query functionality for interactive elements
		 * @param {String} target mode of query: 'init' -> populate drop down menus | 'year' -> get years available from data | 'draw' -> draws selected data to map
		 */
		executeQueryTask: function (target) {
			this.query = new Query();
			this.query.returnExceededLimitFeatures = true;
			this.query.outSpatialReference = this.map.spatialReference;

			if (target == 'init') {
				this.query.returnDistinctValues = true;
				this.query.returnGeometry = false;
				this.query.where = `JURISDICTION<>'ARCH'`;
				this.query.outFields = ['JURISDICTION'];
				this.query.orderByFields = this.query.outFields;
				jurisTask = new QueryTask('https://ipmp.ctre.iastate.edu/arcgis/rest/services/aphares/juris/MapServer/0');
				console.log('Executed query with where = ' + this.query.where);
				jurisTask.execute(this.query, lang.hitch(this, this.genjArr));
				this.gencArr();
				this.genrArr();
			} else if (target == 'year') {
				this.loaderWidget.showOrHide(1, false);

				if (this.curAreaType == 'City') {
					this.query.where = "JURISDICTION='CITY OF " + this.inputData.toUpperCase() + "'";
				} else if (this.inputData == 'STATE OF IOWA') {
					this.query.where = "JURISDICTION='STATE OF IOWA'";
				} else if (this.curAreaType == 'County') {
					this.query.where = "JURISDICTION='COUNTY OF " + this.inputData.toUpperCase() + "'";
				} else {
					var area = this.curAreaType == 'RPA' ? 'RPA' : 'COUNTYNUM';
					this.query.where = `${area}=${this.inputData}`;
				}
				window.baseQ = this.query;
				this.query.returnDistinctValues = true;
				this.query.returnGeometry = false;
				this.query.outFields = ['YEAR'];

				/* YEAR Update - this array needs to have length == to the number of years */
				window.yearArrI = [0, 0, 0, 0, 0, 0, 0, 0];
				// this.queryTask = new QueryTask(this.baseURL2 + 1);
				// console.log("BEGINNING QUERYTASK");
				// this.queryTask.execute(this.query, (ev) => this.getYearUnique(ev, 1));

				this.queryTask = new QueryTask(this.baseURL);
				this.queryTask.execute(this.query, (ev) => this.getYearsinLayer(ev));

				if (!window.PC) {
					this.publishData(
						{
							value: this.query,
						},
						true
					);
					console.log('PC is null – Published query to data manager with query.where: ' + this.query.where);
				} else {
					topic.publish('publishData', 'Splash', 'Splash_T', this.query, false);
					console.log('PC is true – Published query to data manager with query.where: ' + this.query.where);
				}

				console.log('target was year: query where statement is: ' + this.query.where);
			} else if (target == 'draw') {
				this.loaderWidget.showOrHide(1, false);
				this.query.outFields = ['*'];
				this.query.returnDistinctValues = false;
				this.query.returnGeometry = true;

				queryp = '';
				queryw = '';
				let i;

				if (this.curAreaType == 'City') {
					queryw = "JURISDICTION='CITY OF " + this.inputData.toUpperCase() + "'";
				} else if (this.inputData == 'STATE OF IOWA') {
					queryw = "JURISDICTION='STATE OF IOWA'";
				} else if (this.curAreaType == 'County') {
					queryw = "JURISDICTION='COUNTY OF " + this.inputData.toUpperCase() + "'";
				} else {
					var area = this.curAreaType == 'RPA' ? 'RPA' : 'COUNTYNUM';
					queryw = `${area}=${this.inputData}`;
				}
				var numYrs = 0;
				for (i = 0; i < window.yearArrI.length; i++) if (window.yearArrI[i]) numYrs++;
				for (i = 0; i < window.yearArrI.length; i++) {
					this.queryTask = new QueryTask(`${this.baseURL}`);
					if (window.yearArrI[i] === 2) {
						numYrs--;
						this.query.where = queryw + ' AND YEAR = ' + (2013 + i);
						if (queryp != '') {
							queryp += ' OR YEAR=' + (2013 + i);
						} else {
							queryp += ' AND (YEAR=' + (2013 + i);
						}
						setTimeout(this.execute(0, numYrs), 2000 * i);
					} else if (window.yearArrI[i] === 1) {
						numYrs--;
						this.query.where = queryw + ' AND YEAR = ' + (2013 + i);
						setTimeout(this.execute(1, numYrs), 2000 * i);
					}
				}
			}
		},

		/**
		 * Draws the selected data to web map
		 * @param {*} hide true if this layer should be shown / false otherwise
		 * @param {*} numYrs number of years to draw
		 */
		execute: function (hide, numYrs) {
			this.queryTask.execute(this.query, (ev) => this.drawLayers(ev, hide, numYrs));
			console.log('target was draw: query where statement is: ' + this.query.where + ' | querytask = ' + this.queryTask.url);
		},

		/**
		 * Removes search element, if exists
		 */
		setMenuItemsS: function () {
			if (document.getElementById('search')) {
				var elem = document.getElementById('search');
				elem.parentNode.removeChild(elem);
			}
		},

		/**
		 * Populates Jurisdiciton / Area input text menu with rpa / countynum / city / county values (based on value of area dropdown menu)
		 */
		setMenuItems: function () {
			var options = '';
			var i;
			switch (this.curAreaType) {
				case 'RPA':
					if (this.rArr == null) {
						console.log('rArr was null!');
						return;
					}
					for (i = 0; i < this.rArr.length; i++) options += '<option value="' + this.rArr[i] + '" />';
					break;
				case 'CountyNum':
					if (this.cArr == null) {
						console.log('cArr was null!');
						return;
					}
					for (i = 0; i < this.cArr.length; i++) options += '<option value="' + this.cArr[i] + '" />';
					break;
				case 'City':
					if (this.jArr == null) {
						console.log('jArr was null!');
						return;
					}
					for (i = 0; i < this.jArr.length; i++) options += '<option value="' + this.jArr[i] + '" />';
					break;
				case 'County':
					if (this.jArrC == null) {
						console.log('jArrC was null!');
						return;
					}
					for (i = 0; i < this.jArrC.length; i++) options += '<option value="' + this.jArrC[i] + '" />';
					break;
				default:
					console.log('Not a valid input! Field was: ' + this.curAreaType);
			}
			document.getElementById('areaname').innerHTML = options;
		},

		/**
		 * Generates RPA menu with values 1 through 18
		 */
		genrArr: function () {
			// RPA 1 - 18
			this.rArr = new Array();
			for (let i = 1; i <= 18; i++) this.rArr.push(i);
			console.log('genrArr');
		},

		/**
		 * Generates County menu with values 1 through 99
		 */
		gencArr: function () {
			// RPA 1 - 99
			this.cArr = new Array();
			for (let i = 1; i <= 99; i++) this.cArr.push(i);
			console.log('gencArr');
		},

		/**
		 * Populate City and County menu from results in iowa
		 * @param {*} featureSet result of query
		 */
		genjArr: function (featureSet) {
			//Performance enhancer - assign featureSet array to a single variable.
			var resultFeatures = featureSet.features;
			var temp = [];
			if (resultFeatures.length === 0) {
				alert('No results found.');
			} else {
				for (let i = 0; i < resultFeatures.length; i++) if (resultFeatures[i].attributes.JURISDICTION != null) temp.push(resultFeatures[i].attributes.JURISDICTION);
			}
			this.jArr = [];
			this.jArrC = [];
			for (let i = 0; i < temp.length; i++) {
				if (temp[i].substring(0, 8) == 'CITY OF ') {
					this.jArr.push(this.toLowerCase(temp[i].substring(8, temp[i].length)));
				} else {
					if (temp[i].substring(0, 10) == 'COUNTY OF ') {
						temp[i] = temp[i].substring(10, temp[i].length);
					}
					this.jArrC.push(this.toLowerCase(temp[i]));
				}
			}

			console.log('genjArr');
			this.curAreaType = 'City';
			this.setMenuItems(this.curAreaType);
		},

		// writeSpaces: function (str) {
		// 	var newStr = '';
		// 	for (let i = 0; i < str.length; i++) {
		// 		if (str.charAt(i) == '_') {
		// 			newStr += ' ';
		// 		} else {
		// 			newStr += str.charAt(i);
		// 		}
		// 	}
		// 	return newStr;
		// },

		/**
		 * Helper function for genjArr
		 * Convert all letters (besides first in word) to lowercase
		 * @param {string} str str to modify
		 */
		toLowerCase: function (str) {
			var newStr = str.charAt(0);
			for (let i = 1; i <= str.length; i++) {
				if (str.charAt(i - 1) != ' ') {
					if (i < str.length) newStr += str.charAt(i).toLowerCase();
				} else {
					newStr += str.charAt(i);
				}
			}
			return newStr;
		},

		// stringify: function (num, toString) {
		// 	var newStr = '';
		// 	if (toString) {
		// 		for (let i = 0; i < num; i++) {
		// 			newStr += 'A';
		// 		}
		// 		return newStr;
		// 	}
		// 	newStr = num.length;
		// 	return newStr;
		// },

		/**
		 * Maps a year (as string) to the relevant index for querying the FeatureServer
		 * @param {string} thisYear the year to find index
		 */
		getIndexfromYear: function (thisYear) {
			switch (thisYear) {
				case '2013':
					return 0;
				case '2014':
					return 1;
				case '2015':
					return 2;
				case '2016':
					return 3;
				case '2017':
					return 4;
				case '2018':
					return 5;
				case '2019':
					return 6;
				case '2020':
					return 7;
			}
			/* YEAR Update - handle cases for each year */
		},

		/**
		 * Creates the switch buttons for splash screen, unique to each year
		 */
		setSwitches: function () {
			this.inputData = document.getElementById('enterData').value;
			/* YEAR Update - these following two arrays need to have length == to the number of years */
			window.yearArrI = [0, 0, 0, 0, 0, 0, 0, 0];
			window.yearArr = [1, 1, 1, 1, 1, 1, 1, 1]; // [0, 0, 0, 0, 0, 0]; javascript needs access to six elements
			this.yearC = 0;

			// Currently this works. Not sure if another solution is available (see trello), but I think could be improved
			this.OnEvent = OnEvent;

			/**
			 * Sets year of toggled button to True/False for showing/hiding on draw
			 * @param {*} ev even
			 * @param {*} index index of switch
			 * @param {*} theMap reference to main map object
			 */
			function OnEvent(ev, index, theMap) {
				let thisYear;
				switch (index) {
					case 0:
						thisYear = '2013';
						break;
					case 1:
						thisYear = '2014';
						break;
					case 2:
						thisYear = '2015';
						break;
					case 3:
						thisYear = '2016';
						break;
					case 4:
						thisYear = '2017';
						break;
					case 5:
						thisYear = '2018';
						break;
					case 6:
						thisYear = '2019';
						break;
					case 7:
						thisYear = '2020';
						break;
					/* YEAR Update - handle cases for each year */
				}

				if (window.yearArrI[index] == 2) {
					// if 2, button is on (as 1 means button is loaded, which defaults to off, and 0 means button is not loaded)
					window.yearArrI[index] = 1;
					if (theMap.getLayer(thisYear)) theMap.getLayer(thisYear).hide();
					this.yearC--;
				} else {
					if (theMap.getLayer(thisYear)) theMap.getLayer(thisYear).show();
					window.yearArrI[index] = 2;
					this.yearC++;
				}

				topic.publish('publishData', 'yearToggle', 'yearToggle', thisYear, true);
				console.log('yearArrI at index = ' + index + ' is ' + window.yearArrI[index]);
				this.isASwitchOn();
			}

			for (let i = 0; i < window.yearArrI.length; i++) {
				window.yearArr[i] = document.createElement('input');
				window.yearArr[i].setAttribute('type', 'checkbox');
				window.yearArr[i].setAttribute('id', 'togBtn' + i);
				window.yearArr[i].addEventListener('change', (ev) => this.OnEvent(ev, i, this.map));
			}

			this.executeQueryTask('year');
		},

		/**
		 * Creates switch buttons based on available years of queried layer
		 */
		updateYears: function () {
			document.getElementById('myDIV1').innerHTML = '';
			for (let i = 0; i < window.yearArrI.length; i++) {
				if (window.yearArrI[i]) {
					var divFlex = document.createElement('div');
					divFlex.setAttribute('style', 'flex-basis: 5%');
					// add / make switches visible
					var label = document.createElement('label');
					label.setAttribute('class', 'switch');

					var div = document.createElement('div');
					div.setAttribute('class', 'slider' + (i) + ' round'); // to change is the div class

					var pt = document.getElementById('myDIV1').appendChild(divFlex).appendChild(label);
					pt.appendChild(window.yearArr[i]);
					pt.appendChild(div);
					console.log(div + " " + i);
				}
			}
			this.isASwitchOn();
		},

		/**
		 * Determines which years are available in queried data
		 * @param {*} response response of query
		 */
		getYearsinLayer: function (response) {
			/* YEAR Update - this array needs to have length == to the number of years */
			window.yearArrI = [0, 0, 0, 0, 0, 0, 0];
			var resultFeatures = response.features;
			if (resultFeatures.length === 0) {
				alert('No results found.');
			} else {
				for (let i = 0; i < resultFeatures.length; i++)
					switch (resultFeatures[i].attributes.YEAR) {
						case 2013:
							window.yearArrI[0] = 1;
							console.log('Found 2013 in query');
							break;
						case 2014:
							console.log('Found 2014 in query');
							window.yearArrI[1] = 1;
							break;
						case 2015:
							console.log('Found 2015 in query');
							window.yearArrI[2] = 1;
							break;
						case 2016:
							console.log('Found 2016 in query');
							window.yearArrI[3] = 1;
							break;
						case 2017:
							console.log('Found 2017 in query');
							window.yearArrI[4] = 1;
							break;
						case 2018:
							console.log('Found 2018 in query');
							window.yearArrI[5] = 1;
							break;
						case 2019:
							console.log('Found 2019 in query');
							window.yearArrI[6] = 1;
							break;
						case 2020:
							console.log('Found 2020 in query');
							window.yearArrI[7] = 1;
							break;
						/* YEAR Update - handle cases for each year */
					}
			}
			this.updateYears();
			this.loaderWidget.showOrHide(0, false);
		},
		/**
		 * Returns which (unique) year is in queried data
		 * @param {*} response response of query
		 * @param {*} index index of queuried year
		 */
		getYearUnique: function (response, index) {
			var resultFeatures = response.features;
			if (resultFeatures.length) {
				window.yearArrI[8 - index] = 1;
				console.log(`UNIQUE: Found ${2020 - index} in query!`);
			}
			/* YEAR Update - index < number of years */
			if (index < 8) {
				index++;
				this.queryTask = new QueryTask(this.baseURL2 + index);
				this.queryTask.execute(this.query, (ev) => this.getYearUnique(ev, index));
			} else {
				this.updateYears();
				this.loaderWidget.showOrHide(0, false);
			}
		},

		/**
		 * Draws graphics to the main map from the data queried from server.
		 * @param {*} featureSet data to draw
		 * @param {*} hide true if this layer is hidden on map load
		 * @param {*} last true if this is the last layer to draw
		 */
		drawLayers: function (featureSet, hide, last) {
			let curryear = featureSet.features[0].attributes.YEAR;
			//Performance enhancer - assign featureSet array to a single variable.
			var resultFeatures = featureSet.features;
			console.log('Beginning draw layer');
			if (resultFeatures.length === 0) {
				alert('No results found.');
			} else {
				//if (this.featureLayer) this.map.removeLayer(this.map.getLayer("Treatment"));
				//this.map.graphics.clear();
				var geometryTypeQuery = featureSet.geometryType;
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
					fields: featureSet.fields,
				};

				//var infoTemplateQuery = theMap.getLayer('featservice15_3982').infoTemplate; // wildcard for all fields.  Specifiy particular fields here if desired.
				//create a feature layer based on the feature collection
				this.featureLayer = new FeatureLayer(featureCollection, {
					id: `${resultFeatures[0].attributes['YEAR']}`,
					infoTemplate: window.myInfoTemplate, // very roundabout solution, prefer to load from config
				});

				this.featureLayer._name = this.featureLayer.id;
				this.featureLayer.htmlPopupType = 'esriServerHTMLPopupTypeAsHTMLText';
				this.featureLayer.infoTemplate.info.title = `{IPMP_RTE} in {YEAR} — ID: {OBJECTID}`;

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

					feature.setSymbol(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 3));
					this.featureLayer.add(feature);
				}
				var renderer = new UniqueValueRenderer(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), 3), 'type');
				renderer.addValue('very poor', new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 'red', 3));
				renderer.addValue('poor', new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 'orange', 3));
				renderer.addValue('fair', new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 'yellow', 3));
				renderer.addValue('good', new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 'green', 3));
				renderer.addValue('very good', new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, 'blue', 3));
				this.featureLayer.setRenderer(renderer);


				/**
				 * Sorts the feature layers on the map when drawing
				 */
				let index = this.map.graphicsLayerIds.length - 1;
				for (let i = 1; i < this.map.graphicsLayerIds.length; i++) {
					let tmp = parseInt(this.map.graphicsLayerIds[i]);
					if (tmp > 2000 && tmp < 3000) {
						if (tmp > curryear) {
							index = i;
						}
					}
				}
				this.map.addLayer(this.featureLayer, index);
				if (hide) this.map.getLayer(this.featureLayer.id).hide();

				if (!last) {
					this.extent = this.calcGraphicsExtent(resultFeatures);
					this.map.setExtent(this.extent); //zoom to query results
					this.loaderWidget.showOrHide(0, false);
				} else {
				}
				this._openResultInAttributeTable(this.featureLayer);
			}
		},

		/**
		 * Calculates max bounds (x and y) of graphic geometry array
		 * @param {*} graphicsArray feature data with geometry
		 */
		calcGraphicsExtent: function (graphicsArray) {
			var g = graphicsArray[0].geometry,
				fullExt = g.getExtent(),
				ext,
				i,
				il = graphicsArray.length;

			if (fullExt === null) {
				fullExt = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
			}
			for (i = 1; i < il; i++) {
				ext = (g = graphicsArray[i].geometry).getExtent();
				if (ext === null) {
					ext = new Extent(g.x, g.y, g.x, g.y, g.spatialReference);
				}
				fullExt = fullExt.union(ext);
			}
			return fullExt;
		},

		/**
		 * Loads the final (most recent) layer to attribute table on map load.
		 * @param {*} currentLayer data to load into table
		 */
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

		/**
		 * Styling for OK button
		 */
		_setOkNodeAriaLabel: function () {
			var okNodeAriaLabel = this.okNode.innerHTML;
			if (this._requireConfirm) {
				// && !this.confirmCheck.getValue()) {
				okNodeAriaLabel = okNodeAriaLabel + ' ' + window.jimuNls.common.disabled;
			}
			html.attr(this.okNode, 'aria-label', okNodeAriaLabel);
		},

		/**
		 * Styling – Sets splash config
		 */
		_setConfig: function () {
			this._setWidthForOldVersion().then(
				lang.hitch(this, function () {
					this._setSizeFromConfig();

					var button = this.config.splash.button;
					if (typeof button !== 'undefined') {
						if (typeof button.color !== 'undefined') {
							html.setStyle(this.okNode, 'backgroundColor', button.color);
							html.setStyle(this.okNode, 'color', utils.invertColor(button.color)); //auto color for text
						}
						if (typeof button.transparency !== 'undefined') {
							html.setStyle(this.okNode, 'opacity', 1 - button.transparency);
						}
					}
					this.okNode.innerHTML = this.config.splash.button.text || this.nls.ok;
					html.attr(this.okNode, 'title', this.config.splash.button.text || this.nls.ok);
					this._setOkNodeAriaLabel();

					var background = this.config.splash.background;
					if (typeof background !== 'undefined') {
						//image
						if ('image' === background.mode && typeof background.image !== 'undefined') {
							var bg = '',
								repeat = '';
							bg = 'url(' + utils.processUrlInWidgetConfig(background.image, this.folderUrl) + ') center center ';
							repeat = 'no-repeat';

							var type = background.type;
							if ('undefined' !== typeof type) {
								html.addClass(this.splashContainerNode, type);
								if ('tile' === type) {
									repeat = 'repeat'; //only "tile" need repeat
								}
							}
							html.setStyle(this.splashContainerNode, 'background', bg + repeat);
						} else if ('color' === background.mode && typeof background.color !== 'undefined') {
							//color
							if ('undefined' !== typeof background.color) {
								html.setStyle(this.splashContainerBackground, 'backgroundColor', background.color);
							}
							if ('undefined' !== typeof background.transparency) {
								html.setStyle(this.splashContainerBackground, 'opacity', 1 - background.transparency);
							}
						}
					}
					//html.setStyle(query(".label", this.domNode)[0], 'color', utils.invertColor(background.color));//auto color for text
					var confirm = this.config.splash.confirm;
					if (typeof confirm !== 'undefined' && this.domNode) {
						var dom = query('.label', this.domNode)[0];
						if ('undefined' !== typeof confirm.color && dom) {
							html.setStyle(dom, 'color', confirm.color);
						}
						if ('undefined' !== typeof confirm.transparency && dom) {
							html.setStyle(dom, 'opacity', 1 - confirm.transparency);
						}
					}

					if ('undefined' !== typeof this.config.splash.contentVertical) {
						this.contentVertical = this.config.splash.contentVertical;
					} else {
						this.contentVertical = 'top';
					}

					//resize
					if (!utils.isInConfigOrPreviewWindow()) {
						var isFirstKey = this._getCookieKey();
						var isfirst = cookie(isFirstKey);
						if (esriLang.isDefined(isfirst) && isfirst.toString() === 'false') {
							this.close();
						}
					}

					this.resize();
					this.own(
						on(
							window,
							'resize',
							lang.hitch(this, function () {
								this.resize();
							})
						)
					);
					this._resizeContentImg();

					html.removeClass(this.envelopeNode, 'buried'); //show the node
					this.shelter.hide();
				})
			);
		},

		/**
		 * Styling – sets position of child element
		 */
		_normalizeDomNodePosition: function () {
			html.setStyle(this.domNode, 'top', 0);
			html.setStyle(this.domNode, 'left', 0);
			html.setStyle(this.domNode, 'right', 0);
			html.setStyle(this.domNode, 'bottom', 0);
		},

		/**
		 * Sets placement of splash screen in window
		 * @param {*} position position data
		 */
		setPosition: function (position) {
			this.position = position;

			html.place(this.domNode, window.jimuConfig.layoutId);
			this._normalizeDomNodePosition();
			if (this.started) {
				this.resize();
			}
		},

		/**
		 * Perform operations on window resize
		 */
		resize: function () {
			this._changeStatus();
		},

		/**
		 * Styling – sets main image of splash
		 */
		_resizeContentImg: function () {
			if (this._hasContent && !this._isClosed) {
				var customBox = html.getContentBox(this.envelopeNode);
				html.empty(this.customContentNode);

				var splashContent = html.toDom(this.config.splash.splashContent);
				html.place(splashContent, this.customContentNode);
				// single node only(no DocumentFragment)
				if (this.customContentNode.nodeType && this.customContentNode.nodeType === 1) {
					var contentImgs = query('img', this.customContentNode);
					if (contentImgs && contentImgs.length) {
						contentImgs.style({
							maxWidth: customBox.w - 40 - 20 + 'px', // prevent x scroll
							maxHeight: customBox.h - 40 + 'px',
						});
					}
				}
			}
		},

		/**
		 * Performs style changes based on window transforms
		 */
		_changeStatus: function () {
			if (window.appInfo.isRunInMobile) {
				html.setStyle(this.envelopeNode, 'height', '100%');
				html.setStyle(this.envelopeNode, 'width', '100%');
			} else {
				this._setSizeFromConfig();
			}

			//this._resizeCustomContent();
			this._resizeContentImg();
		},

		/**
		 * Styling
		 * @param {*} node
		 * @param {*} prop
		 */
		_getNodeStylePx: function (node, prop) {
			if (node && prop) {
				return parseInt(html.getStyle(node, prop), 10);
			} else {
				return 0;
			}
		},

		/**
		 * Styling
		 */
		_resizeCustomContent: function () {
			var containerContent = html.getContentBox(this.splashContainerNode),
				customContentScrollheight = this.customContentNode.scrollHeight,
				footerBox = html.getMarginBox(this.footerNode);
			var contentMarginButtom = this._getNodeStylePx(this.customContentNode, 'margin-bottom'), //between content & confirm text
				footerBottom = this._getNodeStylePx(this.footerNode, 'bottom'), //between footer & splashBottom
				contentSpace = containerContent.h - (footerBox.h + footerBottom);

			var isNeedLimitCustomContentHeight = customContentScrollheight >= contentSpace;
			if (true === isNeedLimitCustomContentHeight || window.appInfo.isRunInMobile) {
				//limit the customContent height   OR   extend height in mobile
				html.setStyle(this.customContentNode, 'height', contentSpace - contentMarginButtom + 'px');
			} else {
				html.setStyle(this.customContentNode, 'height', 'auto');
				this._moveContentToMiddle({
					contentSpace: contentSpace,
					customContentScrollheight: customContentScrollheight,
				});
			}
		},
		/**
		 * align custom content to vertically
		 * @param {*} context
		 */
		_moveContentToMiddle: function (context) {
			var contentMarginTop = 10, //this._getNodeStylePx(this.customContentNode, "margin-top"),
				middleLine = (context.contentSpace - contentMarginTop) / 2;
			//move the content to middle
			if (this.contentVertical === 'middle') {
				//customContent half-height line is upon the middleLine
				var uponTheMiddleline = context.customContentScrollheight / 2 - middleLine;
				if (uponTheMiddleline < 0) {
					//Content is short
					var abs = Math.abs(uponTheMiddleline);
					html.setStyle(this.customContentNode, 'marginTop', abs + contentMarginTop + 'px');
				} else {
					//Content too long
					html.setStyle(this.customContentNode, 'marginTop', contentMarginTop + 'px');
				}
			}
		},
		/**
		 * Grey out OK button, unless at least one year button is selected (true)
		 */
		isASwitchOn: function () {
			if (this._requireConfirm && this.yearC != 0) {
				html.addClass(this.okNode, 'enable-btn');
				html.removeClass(this.okNode, 'disable-btn');
				this._setOkNodeAriaLabel();
			} else {
				html.addClass(this.okNode, 'disable-btn');
				html.removeClass(this.okNode, 'enable-btn');
				this._setOkNodeAriaLabel();
			}
		},

		/**
		 * Get Cookie Information
		 */
		_getCookieKey: function () {
			return 'isfirst_' + encodeURIComponent(utils.getAppIdFromUrl());
		},

		/**
		 * Closes this widget, and draws selected data to web map.
		 */
		onOkClick: function () {
			if (this.yearC == 0 || this.yearC == null) {
				console.log('No years selected');
			} else {
				console.log('Ok Clicked: executing query task for draw');
				var yearC = this.yearC; // yearC will be set to 0 after draw task
				this.executeQueryTask('draw');
				this.yearC = yearC;

				// The following is a very roundabout way of setting the info template by directly pulling from entire dataset's infotemplate, thus 'c' cannot be null
				var temp = this.map.getLayer('mapservice20_5547');
				if (temp) {
					window.myInfoTemplate = temp.infoTemplate;
					this.map.removeLayer(temp);
				}
				this.close();
			}
		},

		/**
		 * Fires on OK button interaction
		 * @param {*} evt button event
		 */
		onOkKeydown: function (evt) {
			if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
				this.onOkClick();
				if (!this._requireConfirm || this._requireConfirm) {
					// always true
					utils.focusOnFirstSkipLink();
				} else {
					evt.preventDefault();
				}
			}
		},

		// _openResultInAttributeTable: function (currentLayer) {
		// 	if (this.autozoomtoresults) {
		// 		setTimeout(
		// 			lang.hitch(this, function () {
		// 				this.zoomall();
		// 			}),
		// 			300
		// 		);
		// 	}
		// 	var aLayer = {
		// 		layerObject: currentLayer,
		// 		title: currentLayer.name,
		// 		id: currentLayer.id,
		// 		getLayerObject: function () {
		// 			var def = new Deferred();
		// 			if (this.layerObject) {
		// 				def.resolve(this.layerObject);
		// 			} else {
		// 				def.reject('layerObject is null');
		// 			}
		// 			return def;
		// 		},
		// 	};
		// 	if (!Object.create) {
		// 		Object.create = function (proto, props) {
		// 			if (typeof props !== 'undefined') {
		// 				throw 'The multiple-argument version of Object.create is not provided by this browser and cannot be shimmed.';
		// 			}

		// 			function ctor() {}
		// 			ctor.prototype = proto;
		// 			return new ctor();
		// 		};
		// 	}
		// 	this.publishData({
		// 		target: 'AttributeTable',
		// 		layer: Object.create(aLayer),
		// 	});
		// },

		/**
		 * Fires on widget close
		 */
		close: function () {
			this._isClosed = true;
			this._eventHide();
			this.widgetManager.closeWidget(this);
		},

		/**
		 * Styling – set splash screen size
		 */
		_setSizeFromConfig: function () {
			var size = this.config.splash.size;
			if ('undefined' !== typeof size) {
				if (typeof size === 'object') {
					var percent = size.percent;
					var wh = size.wh;
					if ('percent' === size.mode && typeof percent !== 'undefined') {
						html.setStyle(this.envelopeNode, 'width', percent);
						html.setStyle(this.envelopeNode, 'height', percent);
					} else if ('wh' === size.mode && typeof wh !== 'undefined') {
						this._setWidthInCurrentScreen(wh);
						this._setHeightInCurrentScreen(wh);
					}
				}
			}
		},

		/**
		 * set width based on window size
		 * @param {*} wh pixels
		 */
		_setWidthInCurrentScreen: function (wh) {
			var screenWidth = window.innerWidth;
			if (!window.appInfo.isRunInMobile && wh.w <= screenWidth) {
				html.setStyle(this.envelopeNode, 'width', wh.w + 'px');
			} else {
				html.setStyle(this.envelopeNode, 'width', '100%');
			}
		},

		/**
		 * Set Height
		 * @param {*} wh pixel
		 */
		_setHeightInCurrentScreen: function (wh) {
			var screenHeight = window.innerHeight;
			if (!window.appInfo.isRunInMobile && wh.h <= screenHeight) {
				html.setStyle(this.envelopeNode, 'height', wh.h + 'px');
			} else {
				html.setStyle(this.envelopeNode, 'height', '100%');
			}
		},

		/**
		 * for old version update
		 */
		_setWidthForOldVersion: function () {
			var def = new Deferred();
			var size = this.config.splash.size;
			var isOldVersion = 'wh' === size.mode && typeof size.wh !== 'undefined' && null === size.wh.h;
			if (true === isOldVersion) {
				//this._setWhiteColorTextForOldVersion();
				return utils
					.getEditorContentHeight(this.config.splash.splashContent, this.domNode, {
						contentWidth: 600 - 40,
						contentMarginTop: 20, //contentMarginTop
						footerHeight: 88 + 10, //contentMarginBottom
					})
					.then(
						lang.hitch(this, function (h) {
							size.wh.h = h;
							return h;
						})
					);
			} else {
				//this._restoreTextColorForNormal();
				def.resolve();
				return def;
			}
		},
		// _setWhiteColorTextForOldVersion: function() {
		//   html.setStyle(this.customContentNode, 'color', "#fff");
		// },
		// _restoreTextColorForNormal: function() {
		//   html.setStyle(this.customContentNode, 'color', "#000");
		// }

		/**
		 * event for AppStatePopup
		 */
		_eventShow: function () {
			setTimeout(
				lang.hitch(this, function () {
					topic.publish('splashPopupShow');
				}),
				800
			); // becauseof MapManager._checkAppState setTimeout 500;
		},

		/**
		 * event for AppStatePopup
		 */
		_eventHide: function () {
			topic.publish('splashPopupHide');
		},
	});
	return clazz;
});
