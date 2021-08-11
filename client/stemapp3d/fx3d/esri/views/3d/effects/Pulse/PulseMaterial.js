/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/text!./PulseMaterial.xml","dojo/_base/declare","../../webgl-engine-extensions/GLSLShader","../../webgl-engine-extensions/GLSLProgramExt","../../support/fx3dUtils","../Materials"],function(e,t,i,s,r,n){var a=t([n],{declaredClass:"esri.views.3d.effects.Pulse.PulseMaterial",constructor:function(e){this._gl=e.gl,this._shaderSnippets=e.shaderSnippets,this._program=null,this._viewingMode=e.viewingMode,this._pushState=e.pushState,this._restoreState=e.restoreState},destroy:function(){this._program&&(this._program.dispose(),delete this._program,this._program=null)},_addDefines:function(e,t){var i="";if(null!=t)if(Array.isArray(t))for(var s=0,r=t.length;s<r;s++){var n=t[s];i+="#define "+n+"\n"}else for(var n in t)i+="#define "+n+"\n";return this._shaderSnippets.defines+"\n"+i+e},loadShaders:function(){if(this._shaderSnippets){void 0!==this._shaderSnippets.pulseVS&&void 0!==this._shaderSnippets.pulseFS||this._shaderSnippets._parse(e);var t=[];"global"==this._viewingMode?t.push("GLOBAL"):t.push("LOCAL");var r=this._addDefines(this._shaderSnippets.pulseVS,t),n=new i(35633,r,this._gl),a=new i(35632,this._shaderSnippets.pulseFS,this._gl);this._program=new s([n,a],this._gl)}return this._initResources()},getProgram:function(){return this._program},_initResources:function(){return!0},bind:function(e,t){this._program.use(),this._program.uniformMatrix4fv("me",e.proj),this._program.uniformMatrix4fv("sp",e.view),this._program.uniform1i("ls",e.ls),this._program.uniform1f("lp",e.lp),this._program.uniform3fv("lm",e.camPos),this._program.uniform3fv("os",e.lightingData.direction),this._program.uniform4fv("is",e.lightingData.ambient),this._program.uniform4fv("il",e.lightingData.diffuse),this._program.uniform4fv("pl",e.lightingData.specular),this._oldTex=this._gl.getParameter(32873);var i=this.getOldActiveUnit(t);e.mp.bind(i+1),this._program.uniform1i("mp",i+1),e.em.bind(i+2),this._program.uniform1i("em",i+2),this._program.uniform2fv("ll",e.ll),this._program.uniform2fv("li",[e.li,e.ps]),this._program.uniform2fv("es",e.es),this._program.uniform1f("op",e.op),this._program.uniform1f("ss",e.ss),this._gl.activeTexture(33984+i+3),this._gl.bindTexture(3553,e.ei),this._program.uniform1i("ei",i+3),this._program.uniform1f("sl",e.time),this._program.uniform1i("pi",e.reachedRepeatLimit),this._program.uniform3fv("ms",e.ms),1!=t._depthTestEnabled&&(this._pushState(["setDepthTestEnabled",t._depthTestEnabled]),t.setDepthTestEnabled(!0)),519!=t._depthFunction&&(this._pushState(["setDepthFunction",t._depthFunction]),t.setDepthFunction(519)),0!=t._depthWriteEnabled&&(this._pushState(["setDepthWriteEnabled",t._depthWriteEnabled]),t.setDepthWriteEnabled(!1)),1!=t._polygonCullingEnabled&&(this._pushState(["setFaceCullingEnabled",t._polygonCullingEnabled]),t.setFaceCullingEnabled(!0)),1028!=t._cullFace&&(this._pushState(["setCullFace",t._cullFace]),t.setCullFace(1028)),1!=t._blendEnabled&&(this._pushState(["setBlendingEnabled",t._blendEnabled]),t.setBlendingEnabled(!0)),this._pushState(["setBlendFunctionSeparate",[t._blendFunctionState.srcRGB,t._blendFunctionState.dstRGB,t._blendFunctionState.srcAlpha,t._blendFunctionState.dstAlpha]]),t.setBlendFunction(770,771)},release:function(e){this._gl.activeTexture(33984+e._activeTextureUnit+1),this._gl.bindTexture(3553,this._oldTex),this._restoreState(e),this._gl.useProgram(null)}});return a});