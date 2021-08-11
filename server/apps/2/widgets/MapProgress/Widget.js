///////////////////////////////////////////////////////////////////////////
// Robert Scheitlin - Map Progress Indicator
///////////////////////////////////////////////////////////////////////////
/*global define, setTimeout, clearTimeout*/

/**
 * @fileoverview
 * (Custom Widget – {@link module:MapProgress|More info}) Handles functionality for loading: displaying the icon and blocking web app events. If loading icon is visible, web map is not editable.
 */
define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/on', 'jimu/BaseWidget', 'esri/dijit/util/busyIndicator', 'jimu/utils', 'dojo/dom-style', 'dojo/query'], function (
	declare,
	lang,
	on,
	BaseWidget,
	busyUtil,
	utils,
	domStyle,
	query
) {
	/**
	 * @module MapProgress
	 */
	var clazz = declare([BaseWidget], {
		handle: null,
		name: 'MapProgress',
		timer: null,
		wabLoadingIndi: null,
		lastTime: null,
		isLoading: null,

		startup: function () {
			this.inherited(arguments);
			this.wabLoadingIndi = query('.map-loading')[0];
			domStyle.set(this.wabLoadingIndi, 'z-index', -1);
			var busyURL = utils.processUrlInWidgetConfig(this.config.mapprogressimage, this.folderUrl);
			this.handle = busyUtil.create({
				target: 'map',
				imageUrl: busyURL,
				backgroundOpacity: 0.01,
			});

			this.own(
				on(
					this.map,
					'update-start',
					lang.hitch(this, function () {
						this.timer = setTimeout(
							lang.hitch(this, function () {
								this.timeoutClose();
							}),
							500000
						);
						this.showOrHide(1, false);
					})
				)
			);

			this.own(
				on(
					this.map,
					'update-end',
					lang.hitch(this, function () {
						clearTimeout(this.timer);
						this.showOrHide(0, false);
					})
				)
			);
			if (query('[id^="dojox_widget_Standby_"]')[0]) {
				var busyDom = query('[id^="dojox_widget_Standby_"]')[0];
				if (busyDom.childNodes[0]) {
					domStyle.set(busyDom.childNodes[0], 'cursor', 'default');
				}
				if (busyDom.childNodes[1]) {
					domStyle.set(busyDom.childNodes[1], 'cursor', 'default');
				}
			}
			this.isLoading = false;
		},

		onClose: function () {
			if (this.handle) {
				this.handle.destroy();
			}
		},

		/*In case the map hangs and the update-end never fires*/
		timeoutClose: function () {
			if (this.handle) {
				this.showOrHide(0, false);
			}
		},

		showOrHide: function (show, isTimeout) {
			if (this.isLoading && !isTimeout) {
				//console.log('--- loading rejected');
				return;
			}
			var date = new Date();
			var now = date.getTime();

			if (!show && this.lastTime - now < 1000 && !this.isLoading) {
				//console.log('---  setting timeout');

				if (!this.isLoading) {
					this.isLoading = true;
					setTimeout(this.showOrHide(0, true), 1000);
				}
				return;
			}
			if (show) {
				this.handle.show();
				//console.log('--- Show loading icon');
			} else {
				if (this.handle) {
					this.handle.hide();
					this.isLoading = false;
					//console.log('--- Hide loading icon');
				} else {
					//	console.log('--- Scope Error');
				}
			}
			this.lastTime = now;
		},

		destroy: function () {
			this.inherited(arguments);
			if (this.wabLoadingIndi) {
				domStyle.set(this.wabLoadingIndi, 'z-index', 'initial');
			}
		},
	});

	return clazz;
});
