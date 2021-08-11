/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/_base/lang","dojo/_base/array","dojo/_base/declare","esri/core/lang","esri/views/3d/webgl-engine/lib/Util","esri/core/libs/earcut/earcut","../../webgl-engine-extensions/VertexBufferLayout","../../webgl-engine-extensions/GLVertexArrayObject","../../webgl-engine-extensions/GLXBO","../../webgl-engine-extensions/GLVerTexture","../../support/fx3dUtils","../../support/fx3dUnits","../Effect","./AreaExtrudeMaterial","./AreaExtrudeGeometry"],function(e,i,t,r,s,n,a,o,h,d,_,l,f,g,u){var c,v=_.constants.VertexAttrConstants,x=(window.WebGLRenderingContext,t([f],{declaredClass:"esri.views.3d.effects.AreaExtrude.AreaExtrudeEffect",effectName:"AreaExtrude",constructor:function(e){this.orderId=2,this._polygonIdNum=0,this._polygonIndex=0,this._polygonNormals=[],this._indexNums=0,this._vertexNums=0,this._renderObjects={},this._maxDist=0,this._needsAllLoaded=!1},_initRenderingInfo:function(){this.renderingInfo.height=1e4,this.renderingInfo.topColors=[[128,100,253],[160,162,140],[255,100,128]],this._colorBarDirty=!0,this.renderingInfo.bottomColor=[0,255,0],this._renderingInfoDirty=!0,this._vacDirty=!0,this._shapeDirty=!0,this.inherited(arguments)},_doRenderingInfoChange:function(e){this.inherited(arguments);for(var i in e)e.hasOwnProperty(i)&&this.renderingInfo.hasOwnProperty(i)&&(_.endsWith(i.toLowerCase(),"info")?_.isInforAttrChanged(this.renderingInfo[i],e[i])&&(this._renderingInfoDirty=!0):_.endsWith(i.toLowerCase(),"color")?e[i]instanceof Array&&3==e[i].length&&(this.renderingInfo[i]=[e[i][0]/255,e[i][1]/255,e[i][2]/255]):_.endsWith(i.toLowerCase(),"colors")?e[i]instanceof Array&&(this.renderingInfo[i]=e[i],this._colorBarDirty=!0,this._renderingInfoDirty=!0):"height"===i.toLowerCase()||"transparency"===i.toLowerCase()?(this._clampScope(e,i),"height"==i&&this._heightUnit?(this.renderingInfo[i]=l.toMeters(this._heightUnit,e[i],this._view.viewingMode),this._updateDefaultLabelHeight()):this.renderingInfo[i]=e[i]):typeof e[i]==typeof this.renderingInfo[i]&&(this.renderingInfo[i]=e[i]))},_updateDefaultLabelHeight:function(){this._layer._labelDefaultHeight={flag:1,min:this._scopes.height[0],max:this.renderingInfo.height}},setContext:function(t){this.inherited(arguments),this._effectConfig&&e.isArray(this._effectConfig.renderingInfo)&&(this._heightUnit=null,i.forEach(this._effectConfig.renderingInfo,function(e){"height"===e.name.toLowerCase()&&(this._heightUnit=e.unit,this.renderingInfo.height=l.toMeters(this._heightUnit,this.renderingInfo.height,this._view.viewingMode),this._updateDefaultLabelHeight())}.bind(this)))},destroy:function(){this._resetBuffers()},_resetBuffers:function(){for(var e in this._renderObjects)this._dispose(this._renderObjects[e].vbo),this._dispose(this._renderObjects[e].ibo),this._dispose(this._renderObjects[e].vao);this._renderObjects={}},_initVertexLayout:function(){this._vertexAttrConstants=[v.POSITION,v.AUXPOS1,v.AUXPOS2],this._vertexBufferLayout=new a(this._vertexAttrConstants,[3,2,2],[5126,5126,5126])},_initRenderContext:function(){if(this.inherited(arguments),this._vacDirty)if(this._initVertexLayout(),this._vacDirty=!1,this._isAddingGeometry)for(var e in this._renderObjects)this._unBindBuffer(this._renderObjects[e].vao,this._renderObjects[e].vbo,this._renderObjects[e].ibo),this._renderObjects[e].vao&&(this._renderObjects[e].vao._initialized=!1);else this._resetBuffers();return this._localBindsCallback||(this._localBindsCallback=this._localBinds.bind(this)),this._buildAreaGeometries()},_buildAreaGeometries:function(){var e=this._isAddingGeometry?this._addedGraphics:this._allGraphics();if(e.length>0){var i=this._vertexBufferLayout.getStride();this._isAddingGeometry||(this._polygonIdNum=0,this._indexNums=0,this._vertexNums=0);for(var t=[],r=0;r<e.length;r++){var s=e[r];if(null!=s.geometry){var n=s.geometry.rings;n&&0!==n.length&&(t.push(new u(s,this._polygonIdNum,i)),this._polygonIdNum++)}}for(var a=0;a<t.length;a++)this.waitForGeometry(t[a]);return this._resetAddGeometries(),!0}return!1},waitForGeometry:function(e){var i=this;if(e){for(var t=e.createBuffers(i._wgs84SpatialReference,i._view.renderSpatialReference),r=0;r<t.length;r++){var s=t[r];s&&(i._renderObjects[s.origin.id]||(i._renderObjects[s.origin.id]={vbo:new h(i._gl,(!0),i._vertexBufferLayout),ibo:new h(i._gl,(!1)),vao:i._vaoExt?new o(i._gl,i._vaoExt):null,offset:0,origin:s.origin.vec3,buffers:[]}));var n=i._renderObjects[s.origin.id];n.vbo.addData(!0,s.vertices);for(var a=s.indices,d=0;d<a.length;d++)a[d]+=n.offset;n.ibo.addData(!0,s.indices),n.offset+=s.vertexNum,n.buffers.push(s),i._maxDist<s.dist&&(i._maxDist=s.dist),i._maxDist>1e5&&(i._maxDist=1e5),n.vao&&(n.vao._initialized=!1)}i._polygonIndex+=t.length}},_initPolygonNormalVerTexture:function(){var e=this._allGraphics();if(e.length>0){var t=this._gl.getParameter(3379),r=e.length,s=_.nextHighestPowerOfTwo(r);s>t&&(s=t,console.warn("Too many graphics, and extra features will be discarded."));var n=Math.ceil(r/s);n=_.nextHighestPowerOfTwo(n),n>t&&(n=t,console.warn("Too many graphics, and extra features will be discarded.")),this._vizFieldVerTextures[this._vizFieldDefault].setData(s,n,new Float32Array(s*n*4));var a,o,h,d;return i.forEach(this._vizFields,function(i){var t=new Float32Array(s*n*4);o=e[0].attributes[i],o||(o=0),(!o||"number"!=typeof o||o<0)&&(o=0),h=d=o;for(var r=0;r<e.length;r++)a=e[r].attributes,o=a[i],(!o||"number"!=typeof o||o<0)&&(o=0),t[4*r]=o,d<o&&(d=o),h>o&&(h=o);this._vizFieldVerTextures[i].setData(s,n,t),this._vizFieldMinMaxs[i].min=h,this._vizFieldMinMaxs[i].max=d,this._updateVizFieldMinMaxToLayer()}.bind(this)),vec2d.set2(s,n,this._vizFieldVerTextureSize),!0}return!1},_loadShaders:function(){return this.inherited(arguments),this._material||(this._material=new g({pushState:this._pushState.bind(this),restoreState:this._restoreState.bind(this),gl:this._gl,viewingMode:this._view.viewingMode,shaderSnippets:this._shaderSnippets})),this._material.loadShaders()},_initColorBar:function(){if(!this._colorBarDirty)return!0;this._colorBarTexture||(this._colorBarTexture=this._gl.createTexture());var e=this._gl.getParameter(32873);this._gl.bindTexture(3553,this._colorBarTexture),this._gl.pixelStorei(37440,!0),this._gl.texParameteri(3553,10240,9728),this._gl.texParameteri(3553,10241,9728),this._gl.texParameteri(3553,10242,33071),this._gl.texParameteri(3553,10243,33071);var i=_.createColorBarTexture(32,1,this.renderingInfo.topColors);return this._gl.texImage2D(3553,0,6408,6408,5121,i),this._gl.generateMipmap(3553),this._gl.bindTexture(3553,e),0===this._gl.getError()},_localBinds:function(e,i){e.bind(this._material._program),this._vertexBufferLayout.enableVertexAttribArrays(this._gl,this._material._program),i.bind()},_bindBuffer:function(e,i,t){e?(e._initialized||e.initialize(this._localBindsCallback,[i,t]),e.bind()):this._localBinds(i,t)},_unBindBuffer:function(e,i,t){e?e.unbind():(i.unbind(),this._vertexBufferLayout.disableVertexAttribArrays(this._gl,this._material._program),t.unbind())},render:function(i,t){if(this.inherited(arguments),this._layer.visible&&this.ready&&this._bindPramsReady()){this._hasSentReady||(this._layer.emit("fx3d-ready"),this._hasSentReady=!0),this._material.bind(e.mixin({},{ol:this._vizFieldVerTextures[this._vizFieldDefault],oo:this._vizFieldVerTextures[this._vizFields[this._currentVizPage]],sm:this._vizFieldVerTextureSize,eo:this.renderingInfo.animationInterval,io:[this._scopes.height[0],this.renderingInfo.height],oe:this.renderingInfo.transparency,pm:this.renderingInfo.bottomColor,ep:this._vizFieldMinMaxs[this._vizFieldDefault].min>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min?this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].min:this._vizFieldMinMaxs[this._vizFieldDefault].min,os:this._vizFieldMinMaxs[this._vizFieldDefault].max>this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max?this._vizFieldMinMaxs[this._vizFieldDefault].max:this._vizFieldMinMaxs[this._vizFields[this._currentVizPage]].max,ms:this._colorBarTexture,mi:this._maxDist},i),t);for(var r in this._renderObjects)c=this._renderObjects[r],this._bindBuffer(c.vao,c.vbo,c.ibo),this._gl.drawElements(4,c.ibo.getNum(),5125,0);this._material.release(t),this._unBindBuffer(c.vao,c.vbo,c.ibo)}}}));return x});