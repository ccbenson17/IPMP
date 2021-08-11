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
 * (Custom Widget – {@link module:HomeButton|More info}) On click, this widget returns the user to the main splash screen. Clears all layers and info from the map.
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'jimu/BaseWidget',
	'esri/dijit/HomeButton',
	'esri/geometry/Extent',
	'esri/SpatialReference',
	'dojo/_base/html',
	'dojo/dom-construct',
	'dojo/topic',
	'dojo/keys',
	'jimu/WidgetManager',
	'dojo/topic',
	'dojo/on',
], function (declare, lang, BaseWidget, HomeButton, Extent, SpatialReference, html, domConstruct, keys, WidgetManager, topic, on) {
	/**
	 * @module HomeButton
	 */
	var clazz = declare([BaseWidget], {
		name: 'HomeButton',
		baseClass: 'jimu-widget-homebutton',

		moveTopOnActive: false,

		postCreate: function () {
			html.setAttr(this.domNode, 'aria-label', window.apiNls.widgets.homeButton.home.title);
			this.own(topic.subscribe('appConfigChanged', lang.hitch(this, this.onAppConfigChanged)));
		},

		startup: function () {
			var initalExtent = null;
			this.inherited(arguments);
			this.own(on(this.map, 'extent-change', lang.hitch(this, 'onExtentChange')));

			var configExtent = this.appConfig && this.appConfig.map && this.appConfig.map.mapOptions && this.appConfig.map.mapOptions.extent;

			if (configExtent) {
				initalExtent = new Extent(configExtent.xmin, configExtent.ymin, configExtent.xmax, configExtent.ymax, new SpatialReference(configExtent.spatialReference));
			} else {
				initalExtent = this.map._initialExtent || this.map.extent;
			}

			this.createHomeDijit({
				map: this.map,
				extent: initalExtent,
			});
		},

		createHomeDijit: function (options) {
			this.homeDijit = new HomeButton(options, domConstruct.create('div'));
			this.own(on(this.homeDijit, 'home', lang.hitch(this, 'onHome')));
			this.own(on(this.domNode, 'keydown', lang.hitch(this, this.onHomeKeyDown)));
			html.place(this.homeDijit.domNode, this.domNode);
			this.homeDijit.startup();
		},

		onAppConfigChanged: function (appConfig, reason, changedData) {
			if (reason === 'mapOptionsChange' && changedData && appConfig && changedData.extent) {
				//WidgetManager.getInstance().openWidget('widgets_Splash_Widget_31');
				var extent = new Extent(changedData.extent);
				this.homeDijit.set('extent', extent);
			}
		},

		onExtentChange: function () {
			html.removeClass(this.domNode, 'inHome');
		},

		onHomeKeyDown: function (evt) {
			if (evt.keyCode === keys.ENTER || evt.keyCode === keys.SPACE) {
				//WidgetManager.getInstance().openWidget('widgets_Splash_Widget_31');
				this.homeDijit.home(); //trigger home event
			}
		},

		onHome: function (evt) {
			var length = this.map.graphicsLayerIds.length;
			if (!(evt && evt.error)) {
				for (var i = 0; i < length; i++) this.map.removeLayer(this.map.getLayer(this.map.graphicsLayerIds[1]));
				WidgetManager.getInstance().openWidget('widgets_Splash_Widget_31');
				topic.publish('publishData', 'HOME', 'HOME', 0, false);
				html.addClass(this.domNode, 'inHome');
				
			}
		},
	});
	return clazz;
});
