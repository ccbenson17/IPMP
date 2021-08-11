// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.
//>>built
define("dojo/_base/declare dojo/_base/lang dojo/_base/html dojo/_base/array dojo/topic dojo/aspect dojo/Evented dojo/query dojo/NodeList-dom dijit/_WidgetBase ./MoveableNode ./LinkList jimu/utils libs/Sortable".split(" "),function(u,e,f,v,k,m,y,n,D,w,z,A,B,x){function q(a){var b={};isFinite(a.l)&&(b.left=a.l+"px");isFinite(a.t)&&(b.top=a.t+"px");isFinite(a.w)&&(b.width=a.w+"px");isFinite(a.h)&&(b.height=a.h+"px");return b}var g,C=u([w],{box:null,marginBox:null,postCreate:function(){this.inherited(arguments);
this.domNode=f.create("div",{"class":"node-margin"});this.type="addBtn"===this.node.type?"addMargin":"margin"}});return u([w,y],{postCreate:function(){this.nodeList=new A({name:this.name});this.own(k.subscribe("widgetChoosePageOk",e.hitch(this,this._onWidgetChoosePageOk)));this.own(k.subscribe("widgetSettingPageOk",e.hitch(this,this._onWidgetSettingPageOk)))},startup:function(){this.inherited(arguments);this.settings&&this.initNodes()},setSettings:function(a){this.settings=e.clone(a);this.initNodes()},
setAppConfig:function(a){this.appConfig=a},addWidget:function(a){a=this.createMoveableNode("widget",a);this.nodeList.insertNode(a);this.placeNodes()},createMoveableNode:function(a,b){var c=e.clone(this.box);c.h=Infinity;var d=new z({type:a,w:74,h:118,setting:b,listName:this.name,parentBox:c,nls:this.nls,folderUrl:this.folderUrl,appConfig:this.appConfig});f.place(d.domNode,this.domNode);d.startup();this.bindMoveEvent(d);"group"===a&&(m.after(d,"openGroup",e.hitch(this,this.openGroup,d)),m.after(d,
"closeGroup",e.hitch(this,this.closeGroup,d)));d.on("removeNode",e.hitch(this,function(){"poolWidgets"===this.name||"groupOnScreen"===this.name?(d.gnode?(this.nodeList.removeNode(d),this._reopenGroup()):this.nodeList.removeNode(d),this.placeNodes(),"poolWidgets"===this.name?this.publishPoolChangeEvent():k.publish("groupChanged",d.gnode.setting)):(d.setting.uri="",d.setting.label=this.nls.defaultWidgetLabel,d.setting.name=void 0,d.setting.placeholderIndex="?",d.setting.config=void 0,d.setting.itemId=
void 0,this.label=this.nls.defaultWidgetLabel,B.widgetJson.removeManifestFromWidgetJson(d.setting),k.publish("widgetChanged",d.setting))}));d.on("clickOpenAtStart",e.hitch(this,function(){var h={id:d.setting.id,openAtStart:!d.setting.openAtStart};h.isOnScreen="poolWidgets"===this.name?!1:!0;k.publish("openAtStartChange",h)}));this.createMarginNode(d);return d},openGroup:function(a){var b;this.openedGNode&&this.openedGNode!==a&&this.openedGNode.closeGroup(this.openedGNode);var c=a.setting.widgets;
var d=this.getNodePosition(this.nodeList.getNodeIndex(a)).r;var h=this._groupCanAddMoreWidget(a)?Math.ceil((c.length+1)/g):Math.ceil(c.length/g);var l=d*g+1;var r=this.nodeList.getNodeByIndex(l);for(b=this.nodeList.getCount()+1;b<l;b++){var p=this.createMoveableNode("empty");p.gnode=a;this.nodeList.insertNode(p,r)}this.openedGNode=a;this.openedGNode.panelRow=d+1;this.createGroupPanel(d+1,h);c.forEach(e.hitch(this,function(t){t=this.createMoveableNode("widget",t);t.gnode=a;this.nodeList.insertNode(t,
r)}));"groupOnScreen"===this.name?this._groupCanAddMoreWidget(a)?(b=this.createMoveableNode("addBtn"),b.gnode=a,this.nodeList.insertNode(b,r),c=g*h-c.length-1):c=g*h-c.length:c=g*h-c.length;for(b=0;b<c;b++)p=this.createMoveableNode("empty"),p.gnode=a,this.nodeList.insertNode(p,r);this.placeNodes();this.emit("groupOpened")},_groupCanAddMoreWidget:function(a){return"undefined"===typeof a.setting.maxWidgets||a.setting.maxWidgets>a.setting.widgets.length},createGroupPanel:function(a,b){a={t:118*(a-1)-
10,h:118*b+0*(b-1),w:94*g-20+20};window.isRTL?a.r=10:a.l=10;this.groupPanel=f.create("div",{"class":"widget-group-panel",style:q(a)},this.domNode);a=(this.openedGNode.pos.c-1)%g*94+37;window.isRTL&&(a=1===this.openedGNode.pos.c?94*g-37:(g-this.openedGNode.pos.c+1)%g*94-37);f.create("div",{"class":"group-triangle",style:{left:a+"px"}},this.groupPanel);this.groupPanel.type="panel"},closeGroup:function(a){var b=[];a.setting.widgets=[];this.nodeList.visitNodes(e.hitch(this,function(c){c.gnode===a&&("empty"!==
c.type&&"addBtn"!==c.type&&a.setting.widgets.push(c.setting),b.push(c))}));b.forEach(e.hitch(this,function(c){this.nodeList.removeNode(c)}));0===a.setting.widgets.length?"poolWidgets"===this.name&&this.nodeList.removeNode(a):a.updateSmallWidgets();this.placeNodes();f.destroy(this.groupPanel);this.openedGNode=null;this.emit("groupClosed")},initNodes:function(){this.box=f.getContentBox(this.domNode);this.position=f.position(this.domNode,!0);g=Math.floor(this.box.w/94);this.destroyShadowNode();var a=
this.settings;"notRemoveableWidgetOnScreen"===this.name?a=a.sort(function(c,d){return c.label.localeCompare(d.label)}):"removeableWidgetOnScreen"===this.name?1<a.length&&(a=a.sort(function(c,d){var h;v.some(["left","top","right","bottom"],function(l){if(!isNaN(c.position[l])){if(isNaN(d.position[l]))return h=1,!0;if(c.position[l]!==d.position[l])return h=c.position[l]-d.position[l],!0}else if(!isNaN(d.position[l]))return h=-1,!0});return isNaN(h)?0:h})):a=a.sort(function(c,d){return c.index-d.index});
if(this.openedGNode){var b=this.openedGNode.label;this.closeGroup(this.openedGNode)}this.nodeList.destroyAllNodes();"poolWidgets"===this.name&&(this.addBtn=this.createMoveableNode("addBtn"),this.nodeList.insertNode(this.addBtn));a.forEach(e.hitch(this,function(c,d){if(c=c.widgets?this.createMoveableNode("group",c):c.uri?this.createMoveableNode("widget",c):this.createMoveableNode("placeholder",c))f.setAttr(c.domNode,"data-id",d),this.nodeList.insertNode(c)}));"poolWidgets"===this.name&&this.nodeList.insertNode(this.createMoveableNode("empty"));
"removeableWidgetOnScreen"===this.name&&x?(this.sortableNodes&&this.sortableNodes.destroy(),this.sortableNodes=x.create(this.domNode,{sort:!0,disabled:!1,draggable:".widget-node",animation:150,onSort:e.hitch(this,function(){var c=[],d;this.sortableNodes.toArray().forEach(function(h,l){d=e.clone(a[+h]);d.position=e.clone(a[l].position);c.push(d)});k.publish("onScreenOrderChanged",c)})})):this.placeNodes();b&&(b=this.nodeList.getNodeByLabel(b))&&(this.openGroup(b),b.status="open")},getListHeight:function(){var a=
0;this.nodeList.visitNodes(function(b){a=Math.max(b.pos.r,a)});return 118*a},_removeActive:function(){n(".node-margin-active",this.domNode).removeClass("node-margin-active");n(".empty-node-active",this.domNode).removeClass("empty-node-active");n(".node-active",this.domNode).removeClass("node-active")},bindMoveEvent:function(a){"addBtn"!==a.type&&a.dnd&&(m.after(a.dnd,"onMove",e.hitch(this,function(b,c,d){b=this.getMousePosition(d);this.mouseNode=this.getNodeByMousePosition(a,b);this._removeActive();
this.mouseNode&&"margin"===this.mouseNode.type?f.addClass(this.mouseNode.domNode,"node-margin-active"):this.mouseNode&&"empty"===this.mouseNode.type?f.addClass(this.mouseNode.domNode,"empty-node-active"):!this.mouseNode||"group"!==this.mouseNode.type&&"widget"!==this.mouseNode.type||f.addClass(this.mouseNode.domNode,"node-active")}),!0),m.after(a.dnd,"onMoveStart",e.hitch(this,function(){this.destroyShadowNode();this.createShadowNode(a);f.setStyle(a.boxNode,"cursor","move")}),!0),m.after(a.dnd,"onMoveStop",
e.hitch(this,this._onMoveStop,a),!0))},_onMoveStop:function(a){var b=!1,c=[];f.setStyle(a.boxNode,"cursor","pointer");this.mouseNode&&(a===this.mouseNode?console.log("move to the same node"):"margin"===this.mouseNode.type?(this.moveNodeToMargin(a,this.mouseNode),"groupOnScreen"===this.name&&c.push(a.gnode.setting),b=!0):"empty"===this.mouseNode.type?this.mouseNode.gnode&&"group"===a.type?console.log("not allow move group to opened group, revert"):(this.moveNodeToEmpty(a,this.mouseNode),"groupOnScreen"===
this.name&&c.push(a.gnode.setting),b=!0):"group"===this.mouseNode.type?"group"===a.type?console.log("not allow move group to closed group, revert"):"open"===this.mouseNode.status?console.log("please put widget into the opened group panel"):!1===a.setting.inPanel?this._showOffPanelToGroupError():a.gnode&&a.gnode===this.mouseNode?console.log("the moving widget is already in the group"):this.mouseNode.setting.maxWidgets&&this.mouseNode.setting.widgets&&this.mouseNode.setting.widgets.length+1>this.mouseNode.setting.maxWidgets?
this._showGroupExceedMaxError(this.mouseNode.setting):(this.moveWidgetToGroup(a,this.mouseNode),"groupOnScreen"===this.name&&(c.push(a.gnode.setting),c.push(this.mouseNode.setting)),b=!0):"widget"===this.mouseNode.type&&("group"===a.type?console.log("not allow move group to widget, revert"):!1===a.setting.inPanel||!1===this.mouseNode.setting.inPanel?this._showOffPanelToGroupError():a.gnode||this.mouseNode.gnode?console.log("can not nest group"):(this.moveWidgetToWidget(a,this.mouseNode),b=!0)),this._reopenGroup());
this.destroyShadowNode();b&&("poolWidgets"===this.name?this.publishPoolChangeEvent():0<c.length&&this.publishOnScreenGroupsChangeEvent());this.placeNodes()},_reopenGroup:function(){if(this.openedGNode){var a=this.openedGNode;this.closeGroup(a);this.nodeList.isExist(a)&&this.openGroup(a)}},getNodePosition:function(a){var b={};var c=Math.ceil(a/g);a%=g;0===a&&(a=g);b.t=118*(c-1);var d=94*(a-1)+20;b.l=window.isRTL?this.box.w-d-74:d;b.w=74;b.h=118;b.r=c;b.c=a;return b},getMarginNodePosition:function(a){var b=
{};a=a.pos;b.l=window.isRTL?a.l+74+10:a.l-10-2.5;b.t=a.t;b.w=5;b.h=118;return b},createMarginNode:function(a){var b=new C({label:a.label,node:a});f.place(b.domNode,this.domNode);return a.margin=b},getMousePosition:function(a){return{x:a.pageX-this.position.x,y:a.pageY-this.position.y}},moveNodeToMargin:function(a,b){b=this.getNodeByMarginNode(b);console.log("moveNodeToMargin");n(".node-margin-active",this.domNode).removeClass("node-margin-active");b.gnode&&!a.gnode?a.gnode=b.gnode:!b.gnode&&a.gnode&&
(a.gnode=null);this.nodeList.moveNode(a,b)},moveNodeToEmpty:function(a,b){n(".empty-node-active",this.domNode).removeClass("empty-node-active");b.gnode&&!a.gnode?a.gnode=b.gnode:!b.gnode&&a.gnode&&(a.gnode=null);this.nodeList.moveNode(a,b)},getNodeByMarginNode:function(a){var b;this.nodeList.visitNodes(function(c){c.margin===a&&(b=c)});return b},placeNodes:function(){var a,b;this.nodeList.visitNodes(e.hitch(this,function(c,d){a=this.getNodePosition(d);c.pos=a;f.setStyle(c.domNode,q(a));b=this.getMarginNodePosition(c);
c.margin.pos=b;f.setStyle(c.margin.domNode,q(b))}));this.nodeList.printNodeList()},moveWidgetToGroup:function(a,b){a&&a.setting&&delete a.setting.openAtStart;b.addWidget(a);this.nodeList.removeNode(a)},moveWidgetToWidget:function(a,b){a&&a.setting&&delete a.setting.openAtStart;var c=this.createMoveableNode("group",{label:this._getGroupLabel(),widgets:[a.setting,b.setting]});this.nodeList.insertNode(c,b);this.nodeList.removeNode(a);this.nodeList.removeNode(b)},createShadowNode:function(a){this.shadowNode=
f.create("div",{"class":"node-shadow",style:q(f.getMarginBox(a.domNode))},this.domNode)},destroyShadowNode:function(){this.shadowNode&&f.destroy(this.shadowNode)},getNodeByMousePosition:function(a,b){var c;this.nodeList.visitNodes(function(d){if("addBtn"!==d.type){if(b.x>d.pos.l+10&&b.x<d.pos.l+d.pos.w-10&&b.y>d.pos.t+10&&b.y<d.pos.t+d.pos.h-10&&d!==a)return c=d,!0;if(b.x>d.margin.pos.l&&b.x<d.margin.pos.l+d.margin.pos.w&&b.y>d.margin.pos.t&&b.y<d.margin.pos.t+d.margin.pos.h&&d.margin!==a)return c=
d.margin,!0}});return c},_getGroupLabel:function(){var a=-1;this.appConfig.visitElement(e.hitch(this,function(b){if(b.widgets)if(b.label===this.nls.newGroup)a=0;else if(b.label.startWith(this.nls.newGroup)){var c=b.label.lastIndexOf("_");-1<c&&(b=parseInt(b.label.substr(c+1,b.label.length),10),a=Math.max(a,b))}}));return-1===a?this.nls.newGroup:this.nls.newGroup+"_"+(a+1)},_showOffPanelToGroupError:function(){console.log("Off panel widget is not allowed in group.");this.emit("offpanel-group-error")},
_showGroupExceedMaxError:function(a){this.emit("group-exceed-max-error",a)},_onWidgetChoosePageOk:function(a,b){if(b.listName===this.name)if(1===a.length){if("addBtn"===b.type)var c=a[0];else"group"===b.type?c=a[0]:(c=e.clone(b.setting),e.mixin(c,a[0]));k.publish("editWidget",c,b)}else"poolWidgets"===this.name?(v.forEach(a,function(d){this.addWidget(d)},this),this.publishPoolChangeEvent()):("addBtn"===b.type?c=e.clone(this.appConfig.getConfigElementById(b.gnode.setting.id)):"group"===b.type&&(c=e.clone(this.appConfig.getConfigElementById(b.setting.id))),
c.widgets=c.widgets.concat(a),k.publish("groupChanged",c))},_onWidgetSettingPageOk:function(a,b){if(b.listName===this.name)if(a.id)k.publish("widgetChanged",a);else if("poolWidgets"===this.name)this.addWidget(a),this.publishPoolChangeEvent();else{var c;"addBtn"===b.type?c=e.clone(this.appConfig.getConfigElementById(b.gnode.setting.id)):"group"===b.type&&(c=e.clone(this.appConfig.getConfigElementById(b.setting.id)));c.widgets.push(a);c.label||(c.label=this._getGroupLabel());k.publish("groupChanged",
c)}},publishPoolChangeEvent:function(){var a=[],b=[];this.nodeList.visitNodes(function(c,d){"widget"!==c.type||c.gnode?"group"===c.type&&(c.setting.index=d,a.push(c.setting)):(c.setting.index=d,b.push(c.setting))});k.publish("widgetPoolChanged",{widgets:b,groups:a,controllerId:this.controller.id})},publishOnScreenGroupsChangeEvent:function(){var a=[];this.nodeList.visitNodes(function(b){"group"===b.type&&a.push(b.setting)});k.publish("onScreenGroupsChanged",{groups:a})}})});