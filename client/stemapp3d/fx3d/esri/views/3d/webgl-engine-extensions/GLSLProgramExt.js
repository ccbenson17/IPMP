/**
 * Copyright @ 2021 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["esri/core/libs/gl-matrix-2/vec4f64","esri/core/libs/gl-matrix-2/vec3f64","esri/core/libs/gl-matrix-2/vec2f64","esri/core/libs/gl-matrix-2/vec4","esri/core/libs/gl-matrix-2/vec3","esri/core/libs/gl-matrix-2/vec2"],function(t,r,i,n,e,o){var a=r.vec3f64,e=e.vec3,f=i.vec2f64,o=o.vec2,u=t.vec4f64,n=n.vec4,l=0;return function(t,r){var i,c,s,g=l++,h=function(){if(null==i){i=r.createProgram();for(var n=0;n<t.length;++n)r.attachShader(i,t[n].getGLName());m()}},m=function(){null!=i&&(r.linkProgram(i),r.getProgramParameter(i,35714)||console.error("Could not initialize shader\nVALIDATE_STATUS: "+r.getProgramParameter(i,35715)+", gl error ["+r.getError()+"] infoLog: "+r.getProgramInfoLog(i)),c={},s={})};this.dispose=function(){for(var n=0;n<t.length;++n){var e=t[n].getGLName();r.isShader(e)&&r.deleteShader(e)}r.isProgram(i)&&r.deleteProgram(i)},this.getId=function(){return g},this.getShader=function(r){return t["vertex"===r?0:1]},this.use=function(){h(),r.useProgram(i)},this.getLocation=function(t){return h(),null==c[t]&&(c[t]=r.getUniformLocation(i,t)),c[t]},this.hasUniform=function(t){return null!=this.getLocation(t)},this.getAttribLocation=function(t){return h(),null==s[t]&&(s[t]=r.getAttribLocation(i,t)),s[t]};var v={};this.uniform1i=function(t,i){var n=v[t];null!=n&&i===n||(r.uniform1i(this.getLocation(t,r),i),v[t]=i)},this.uniform1f=function(t,i){var n=v[t];null!=n&&i===n||(r.uniform1f(this.getLocation(t,r),i),v[t]=i)};var L={};this.uniform2f=function(t,i,n){var e=L[t];null!=e&&i===e[0]&&n===e[1]||(r.uniform2f(this.getLocation(t,r),i,n),null==e?L[t]=f.fromValues(i,n):o.set(e,i,n))},this.uniform2fv=function(t,i){var n=L[t];(i.length>2||null==n||i[0]!==n[0]||i[1]!==n[1])&&(r.uniform2fv(this.getLocation(t,r),i),null==n?L[t]=f.create(i):o.copy(n,i))};var d={};this.uniform3f=function(t,i,n,o){var f=d[t];null!=f&&i===f[0]&&n===f[1]&&o===f[2]||(r.uniform3f(this.getLocation(t,r),i,n,o),null==f?d[t]=a.fromValues(i,n,o):e.set(f,i,n,o))},this.uniform3fv=function(t,i){var n=d[t];(i.length>3||null==n||i[0]!==n[0]||i[1]!==n[1]||i[2]!==n[2])&&(r.uniform3fv(this.getLocation(t,r),i),null==n?d[t]=a.create(i):e.copy(n,i))};var P={};this.uniform4f=function(t,i,e,o,a){var f=P[t];null!=f&&i===f[0]&&e===f[1]&&o===f[2]&&a===f[3]||(r.uniform4f(this.getLocation(t,r),i,e,o,a),null==f?P[t]=u.fromValues(i,e,o,a):n.set(f,i,e,o,a))},this.uniform4fv=function(t,i){var e=P[t];(i.length>4||null==e||i[0]!==e[0]||i[1]!==e[1]||i[2]!==e[2]||i[3]!==e[3])&&(r.uniform4fv(this.getLocation(t,r),i),null==e?P[t]=u.create(i):n.copy(e,i))},this.uniformMatrix4fv=function(t,i){r.uniformMatrix4fv(this.getLocation(t,r),!1,i)},this.dispose=function(){if(null!=i){for(var n=0;n<t.length;++n){var e=t[n].getGLName();r.detachShader(i,e),r.deleteShader(e)}r.deleteProgram(i)}}}});