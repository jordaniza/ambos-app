function Ct(){}const Wr=n=>n;function sr(n,o){for(const f in o)n[f]=o[f];return n}function lr(n){return n()}function Yr(){return Object.create(null)}function ar(n){n.forEach(lr)}function hr(n){return typeof n=="function"}function Hr(n,o){return n!=n?o==o:n!==o||n&&typeof n=="object"||typeof n=="function"}function Vr(n){return Object.keys(n).length===0}function Rt(n,...o){if(n==null){for(const a of o)a(void 0);return Ct}const f=n.subscribe(...o);return f.unsubscribe?()=>f.unsubscribe():f}function Xr(n){let o;return Rt(n,f=>o=f)(),o}function zr(n,o,f){n.$$.on_destroy.push(Rt(o,f))}function Jr(n,o,f,a){if(n){const p=St(n,o,f,a);return n[0](p)}}function St(n,o,f,a){return n[1]&&a?sr(f.ctx.slice(),n[1](a(o))):f.ctx}function Qr(n,o,f,a){if(n[2]&&a){const p=n[2](a(f));if(o.dirty===void 0)return p;if(typeof p=="object"){const y=[],h=Math.max(o.dirty.length,p.length);for(let c=0;c<h;c+=1)y[c]=o.dirty[c]|p[c];return y}return o.dirty|p}return o.dirty}function Kr(n,o,f,a,p,y){if(p){const h=St(o,f,a,y);n.p(h,p)}}function Zr(n){if(n.ctx.length>32){const o=[],f=n.ctx.length/32;for(let a=0;a<f;a++)o[a]=-1;return o}return-1}function vr(n){const o={};for(const f in n)f[0]!=="$"&&(o[f]=n[f]);return o}function te(n,o){const f={};o=new Set(o);for(const a in n)!o.has(a)&&a[0]!=="$"&&(f[a]=n[a]);return f}function re(n){return n&&hr(n.destroy)?n.destroy:Ct}function ee(n){const o=typeof n=="string"&&n.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return o?[parseFloat(o[1]),o[2]||"px"]:[n,"px"]}var pr={},Nt={},v={};v.byteLength=mr;v.toByteArray=xr;v.fromByteArray=Br;var k=[],T=[],yr=typeof Uint8Array<"u"?Uint8Array:Array,ot="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var q=0,dr=ot.length;q<dr;++q)k[q]=ot[q],T[ot.charCodeAt(q)]=q;T["-".charCodeAt(0)]=62;T["_".charCodeAt(0)]=63;function kt(n){var o=n.length;if(o%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var f=n.indexOf("=");f===-1&&(f=o);var a=f===o?0:4-f%4;return[f,a]}function mr(n){var o=kt(n),f=o[0],a=o[1];return(f+a)*3/4-a}function wr(n,o,f){return(o+f)*3/4-f}function xr(n){var o,f=kt(n),a=f[0],p=f[1],y=new yr(wr(n,a,p)),h=0,c=p>0?a-4:a,d;for(d=0;d<c;d+=4)o=T[n.charCodeAt(d)]<<18|T[n.charCodeAt(d+1)]<<12|T[n.charCodeAt(d+2)]<<6|T[n.charCodeAt(d+3)],y[h++]=o>>16&255,y[h++]=o>>8&255,y[h++]=o&255;return p===2&&(o=T[n.charCodeAt(d)]<<2|T[n.charCodeAt(d+1)]>>4,y[h++]=o&255),p===1&&(o=T[n.charCodeAt(d)]<<10|T[n.charCodeAt(d+1)]<<4|T[n.charCodeAt(d+2)]>>2,y[h++]=o>>8&255,y[h++]=o&255),y}function gr(n){return k[n>>18&63]+k[n>>12&63]+k[n>>6&63]+k[n&63]}function _r(n,o,f){for(var a,p=[],y=o;y<f;y+=3)a=(n[y]<<16&16711680)+(n[y+1]<<8&65280)+(n[y+2]&255),p.push(gr(a));return p.join("")}function Br(n){for(var o,f=n.length,a=f%3,p=[],y=16383,h=0,c=f-a;h<c;h+=y)p.push(_r(n,h,h+y>c?c:h+y));return a===1?(o=n[f-1],p.push(k[o>>2]+k[o<<4&63]+"==")):a===2&&(o=(n[f-2]<<8)+n[f-1],p.push(k[o>>10]+k[o>>4&63]+k[o<<2&63]+"=")),p.join("")}var ht={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ht.read=function(n,o,f,a,p){var y,h,c=p*8-a-1,d=(1<<c)-1,x=d>>1,g=-7,F=f?p-1:0,C=f?-1:1,U=n[o+F];for(F+=C,y=U&(1<<-g)-1,U>>=-g,g+=c;g>0;y=y*256+n[o+F],F+=C,g-=8);for(h=y&(1<<-g)-1,y>>=-g,g+=a;g>0;h=h*256+n[o+F],F+=C,g-=8);if(y===0)y=1-x;else{if(y===d)return h?NaN:(U?-1:1)*(1/0);h=h+Math.pow(2,a),y=y-x}return(U?-1:1)*h*Math.pow(2,y-a)};ht.write=function(n,o,f,a,p,y){var h,c,d,x=y*8-p-1,g=(1<<x)-1,F=g>>1,C=p===23?Math.pow(2,-24)-Math.pow(2,-77):0,U=a?0:y-1,V=a?1:-1,X=o<0||o===0&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(c=isNaN(o)?1:0,h=g):(h=Math.floor(Math.log(o)/Math.LN2),o*(d=Math.pow(2,-h))<1&&(h--,d*=2),h+F>=1?o+=C/d:o+=C*Math.pow(2,1-F),o*d>=2&&(h++,d/=2),h+F>=g?(c=0,h=g):h+F>=1?(c=(o*d-1)*Math.pow(2,p),h=h+F):(c=o*Math.pow(2,F-1)*Math.pow(2,p),h=0));p>=8;n[f+U]=c&255,U+=V,c/=256,p-=8);for(h=h<<p|c,x+=p;x>0;n[f+U]=h&255,U+=V,h/=256,x-=8);n[f+U-V]|=X*128};/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */(function(n){const o=v,f=ht,a=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;n.Buffer=c,n.SlowBuffer=Wt,n.INSPECT_MAX_BYTES=50;const p=2147483647;n.kMaxLength=p,c.TYPED_ARRAY_SUPPORT=y(),!c.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function y(){try{const e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),e.foo()===42}catch{return!1}}Object.defineProperty(c.prototype,"parent",{enumerable:!0,get:function(){if(c.isBuffer(this))return this.buffer}}),Object.defineProperty(c.prototype,"offset",{enumerable:!0,get:function(){if(c.isBuffer(this))return this.byteOffset}});function h(e){if(e>p)throw new RangeError('The value "'+e+'" is invalid for option "size"');const t=new Uint8Array(e);return Object.setPrototypeOf(t,c.prototype),t}function c(e,t,r){if(typeof e=="number"){if(typeof t=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return F(e)}return d(e,t,r)}c.poolSize=8192;function d(e,t,r){if(typeof e=="string")return C(e,t);if(ArrayBuffer.isView(e))return V(e);if(e==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(R(e,ArrayBuffer)||e&&R(e.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(R(e,SharedArrayBuffer)||e&&R(e.buffer,SharedArrayBuffer)))return X(e,t,r);if(typeof e=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const i=e.valueOf&&e.valueOf();if(i!=null&&i!==e)return c.from(i,t,r);const u=Gt(e);if(u)return u;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]=="function")return c.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}c.from=function(e,t,r){return d(e,t,r)},Object.setPrototypeOf(c.prototype,Uint8Array.prototype),Object.setPrototypeOf(c,Uint8Array);function x(e){if(typeof e!="number")throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function g(e,t,r){return x(e),e<=0?h(e):t!==void 0?typeof r=="string"?h(e).fill(t,r):h(e).fill(t):h(e)}c.alloc=function(e,t,r){return g(e,t,r)};function F(e){return x(e),h(e<0?0:rt(e)|0)}c.allocUnsafe=function(e){return F(e)},c.allocUnsafeSlow=function(e){return F(e)};function C(e,t){if((typeof t!="string"||t==="")&&(t="utf8"),!c.isEncoding(t))throw new TypeError("Unknown encoding: "+t);const r=dt(e,t)|0;let i=h(r);const u=i.write(e,t);return u!==r&&(i=i.slice(0,u)),i}function U(e){const t=e.length<0?0:rt(e.length)|0,r=h(t);for(let i=0;i<t;i+=1)r[i]=e[i]&255;return r}function V(e){if(R(e,Uint8Array)){const t=new Uint8Array(e);return X(t.buffer,t.byteOffset,t.byteLength)}return U(e)}function X(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');let i;return t===void 0&&r===void 0?i=new Uint8Array(e):r===void 0?i=new Uint8Array(e,t):i=new Uint8Array(e,t,r),Object.setPrototypeOf(i,c.prototype),i}function Gt(e){if(c.isBuffer(e)){const t=rt(e.length)|0,r=h(t);return r.length===0||e.copy(r,0,0,t),r}if(e.length!==void 0)return typeof e.length!="number"||it(e.length)?h(0):U(e);if(e.type==="Buffer"&&Array.isArray(e.data))return U(e.data)}function rt(e){if(e>=p)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+p.toString(16)+" bytes");return e|0}function Wt(e){return+e!=e&&(e=0),c.alloc(+e)}c.isBuffer=function(t){return t!=null&&t._isBuffer===!0&&t!==c.prototype},c.compare=function(t,r){if(R(t,Uint8Array)&&(t=c.from(t,t.offset,t.byteLength)),R(r,Uint8Array)&&(r=c.from(r,r.offset,r.byteLength)),!c.isBuffer(t)||!c.isBuffer(r))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===r)return 0;let i=t.length,u=r.length;for(let s=0,l=Math.min(i,u);s<l;++s)if(t[s]!==r[s]){i=t[s],u=r[s];break}return i<u?-1:u<i?1:0},c.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},c.concat=function(t,r){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(t.length===0)return c.alloc(0);let i;if(r===void 0)for(r=0,i=0;i<t.length;++i)r+=t[i].length;const u=c.allocUnsafe(r);let s=0;for(i=0;i<t.length;++i){let l=t[i];if(R(l,Uint8Array))s+l.length>u.length?(c.isBuffer(l)||(l=c.from(l)),l.copy(u,s)):Uint8Array.prototype.set.call(u,l,s);else if(c.isBuffer(l))l.copy(u,s);else throw new TypeError('"list" argument must be an Array of Buffers');s+=l.length}return u};function dt(e,t){if(c.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||R(e,ArrayBuffer))return e.byteLength;if(typeof e!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const r=e.length,i=arguments.length>2&&arguments[2]===!0;if(!i&&r===0)return 0;let u=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return nt(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return r*2;case"hex":return r>>>1;case"base64":return bt(e).length;default:if(u)return i?-1:nt(e).length;t=(""+t).toLowerCase(),u=!0}}c.byteLength=dt;function Yt(e,t,r){let i=!1;if((t===void 0||t<0)&&(t=0),t>this.length||((r===void 0||r>this.length)&&(r=this.length),r<=0)||(r>>>=0,t>>>=0,r<=t))return"";for(e||(e="utf8");;)switch(e){case"hex":return tr(this,t,r);case"utf8":case"utf-8":return xt(this,t,r);case"ascii":return Zt(this,t,r);case"latin1":case"binary":return vt(this,t,r);case"base64":return Qt(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return rr(this,t,r);default:if(i)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),i=!0}}c.prototype._isBuffer=!0;function P(e,t,r){const i=e[t];e[t]=e[r],e[r]=i}c.prototype.swap16=function(){const t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let r=0;r<t;r+=2)P(this,r,r+1);return this},c.prototype.swap32=function(){const t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let r=0;r<t;r+=4)P(this,r,r+3),P(this,r+1,r+2);return this},c.prototype.swap64=function(){const t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let r=0;r<t;r+=8)P(this,r,r+7),P(this,r+1,r+6),P(this,r+2,r+5),P(this,r+3,r+4);return this},c.prototype.toString=function(){const t=this.length;return t===0?"":arguments.length===0?xt(this,0,t):Yt.apply(this,arguments)},c.prototype.toLocaleString=c.prototype.toString,c.prototype.equals=function(t){if(!c.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t?!0:c.compare(this,t)===0},c.prototype.inspect=function(){let t="";const r=n.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},a&&(c.prototype[a]=c.prototype.inspect),c.prototype.compare=function(t,r,i,u,s){if(R(t,Uint8Array)&&(t=c.from(t,t.offset,t.byteLength)),!c.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(r===void 0&&(r=0),i===void 0&&(i=t?t.length:0),u===void 0&&(u=0),s===void 0&&(s=this.length),r<0||i>t.length||u<0||s>this.length)throw new RangeError("out of range index");if(u>=s&&r>=i)return 0;if(u>=s)return-1;if(r>=i)return 1;if(r>>>=0,i>>>=0,u>>>=0,s>>>=0,this===t)return 0;let l=s-u,m=i-r;const B=Math.min(l,m),_=this.slice(u,s),E=t.slice(r,i);for(let w=0;w<B;++w)if(_[w]!==E[w]){l=_[w],m=E[w];break}return l<m?-1:m<l?1:0};function mt(e,t,r,i,u){if(e.length===0)return-1;if(typeof r=="string"?(i=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,it(r)&&(r=u?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(u)return-1;r=e.length-1}else if(r<0)if(u)r=0;else return-1;if(typeof t=="string"&&(t=c.from(t,i)),c.isBuffer(t))return t.length===0?-1:wt(e,t,r,i,u);if(typeof t=="number")return t=t&255,typeof Uint8Array.prototype.indexOf=="function"?u?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):wt(e,[t],r,i,u);throw new TypeError("val must be string, number or Buffer")}function wt(e,t,r,i,u){let s=1,l=e.length,m=t.length;if(i!==void 0&&(i=String(i).toLowerCase(),i==="ucs2"||i==="ucs-2"||i==="utf16le"||i==="utf-16le")){if(e.length<2||t.length<2)return-1;s=2,l/=2,m/=2,r/=2}function B(E,w){return s===1?E[w]:E.readUInt16BE(w*s)}let _;if(u){let E=-1;for(_=r;_<l;_++)if(B(e,_)===B(t,E===-1?0:_-E)){if(E===-1&&(E=_),_-E+1===m)return E*s}else E!==-1&&(_-=_-E),E=-1}else for(r+m>l&&(r=l-m),_=r;_>=0;_--){let E=!0;for(let w=0;w<m;w++)if(B(e,_+w)!==B(t,w)){E=!1;break}if(E)return _}return-1}c.prototype.includes=function(t,r,i){return this.indexOf(t,r,i)!==-1},c.prototype.indexOf=function(t,r,i){return mt(this,t,r,i,!0)},c.prototype.lastIndexOf=function(t,r,i){return mt(this,t,r,i,!1)};function Ht(e,t,r,i){r=Number(r)||0;const u=e.length-r;i?(i=Number(i),i>u&&(i=u)):i=u;const s=t.length;i>s/2&&(i=s/2);let l;for(l=0;l<i;++l){const m=parseInt(t.substr(l*2,2),16);if(it(m))return l;e[r+l]=m}return l}function Vt(e,t,r,i){return Q(nt(t,e.length-r),e,r,i)}function Xt(e,t,r,i){return Q(or(t),e,r,i)}function zt(e,t,r,i){return Q(bt(t),e,r,i)}function Jt(e,t,r,i){return Q(ur(t,e.length-r),e,r,i)}c.prototype.write=function(t,r,i,u){if(r===void 0)u="utf8",i=this.length,r=0;else if(i===void 0&&typeof r=="string")u=r,i=this.length,r=0;else if(isFinite(r))r=r>>>0,isFinite(i)?(i=i>>>0,u===void 0&&(u="utf8")):(u=i,i=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const s=this.length-r;if((i===void 0||i>s)&&(i=s),t.length>0&&(i<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");u||(u="utf8");let l=!1;for(;;)switch(u){case"hex":return Ht(this,t,r,i);case"utf8":case"utf-8":return Vt(this,t,r,i);case"ascii":case"latin1":case"binary":return Xt(this,t,r,i);case"base64":return zt(this,t,r,i);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Jt(this,t,r,i);default:if(l)throw new TypeError("Unknown encoding: "+u);u=(""+u).toLowerCase(),l=!0}},c.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Qt(e,t,r){return t===0&&r===e.length?o.fromByteArray(e):o.fromByteArray(e.slice(t,r))}function xt(e,t,r){r=Math.min(e.length,r);const i=[];let u=t;for(;u<r;){const s=e[u];let l=null,m=s>239?4:s>223?3:s>191?2:1;if(u+m<=r){let B,_,E,w;switch(m){case 1:s<128&&(l=s);break;case 2:B=e[u+1],(B&192)===128&&(w=(s&31)<<6|B&63,w>127&&(l=w));break;case 3:B=e[u+1],_=e[u+2],(B&192)===128&&(_&192)===128&&(w=(s&15)<<12|(B&63)<<6|_&63,w>2047&&(w<55296||w>57343)&&(l=w));break;case 4:B=e[u+1],_=e[u+2],E=e[u+3],(B&192)===128&&(_&192)===128&&(E&192)===128&&(w=(s&15)<<18|(B&63)<<12|(_&63)<<6|E&63,w>65535&&w<1114112&&(l=w))}}l===null?(l=65533,m=1):l>65535&&(l-=65536,i.push(l>>>10&1023|55296),l=56320|l&1023),i.push(l),u+=m}return Kt(i)}const gt=4096;function Kt(e){const t=e.length;if(t<=gt)return String.fromCharCode.apply(String,e);let r="",i=0;for(;i<t;)r+=String.fromCharCode.apply(String,e.slice(i,i+=gt));return r}function Zt(e,t,r){let i="";r=Math.min(e.length,r);for(let u=t;u<r;++u)i+=String.fromCharCode(e[u]&127);return i}function vt(e,t,r){let i="";r=Math.min(e.length,r);for(let u=t;u<r;++u)i+=String.fromCharCode(e[u]);return i}function tr(e,t,r){const i=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>i)&&(r=i);let u="";for(let s=t;s<r;++s)u+=cr[e[s]];return u}function rr(e,t,r){const i=e.slice(t,r);let u="";for(let s=0;s<i.length-1;s+=2)u+=String.fromCharCode(i[s]+i[s+1]*256);return u}c.prototype.slice=function(t,r){const i=this.length;t=~~t,r=r===void 0?i:~~r,t<0?(t+=i,t<0&&(t=0)):t>i&&(t=i),r<0?(r+=i,r<0&&(r=0)):r>i&&(r=i),r<t&&(r=t);const u=this.subarray(t,r);return Object.setPrototypeOf(u,c.prototype),u};function A(e,t,r){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}c.prototype.readUintLE=c.prototype.readUIntLE=function(t,r,i){t=t>>>0,r=r>>>0,i||A(t,r,this.length);let u=this[t],s=1,l=0;for(;++l<r&&(s*=256);)u+=this[t+l]*s;return u},c.prototype.readUintBE=c.prototype.readUIntBE=function(t,r,i){t=t>>>0,r=r>>>0,i||A(t,r,this.length);let u=this[t+--r],s=1;for(;r>0&&(s*=256);)u+=this[t+--r]*s;return u},c.prototype.readUint8=c.prototype.readUInt8=function(t,r){return t=t>>>0,r||A(t,1,this.length),this[t]},c.prototype.readUint16LE=c.prototype.readUInt16LE=function(t,r){return t=t>>>0,r||A(t,2,this.length),this[t]|this[t+1]<<8},c.prototype.readUint16BE=c.prototype.readUInt16BE=function(t,r){return t=t>>>0,r||A(t,2,this.length),this[t]<<8|this[t+1]},c.prototype.readUint32LE=c.prototype.readUInt32LE=function(t,r){return t=t>>>0,r||A(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+this[t+3]*16777216},c.prototype.readUint32BE=c.prototype.readUInt32BE=function(t,r){return t=t>>>0,r||A(t,4,this.length),this[t]*16777216+(this[t+1]<<16|this[t+2]<<8|this[t+3])},c.prototype.readBigUInt64LE=D(function(t){t=t>>>0,j(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&z(t,this.length-8);const u=r+this[++t]*2**8+this[++t]*2**16+this[++t]*2**24,s=this[++t]+this[++t]*2**8+this[++t]*2**16+i*2**24;return BigInt(u)+(BigInt(s)<<BigInt(32))}),c.prototype.readBigUInt64BE=D(function(t){t=t>>>0,j(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&z(t,this.length-8);const u=r*2**24+this[++t]*2**16+this[++t]*2**8+this[++t],s=this[++t]*2**24+this[++t]*2**16+this[++t]*2**8+i;return(BigInt(u)<<BigInt(32))+BigInt(s)}),c.prototype.readIntLE=function(t,r,i){t=t>>>0,r=r>>>0,i||A(t,r,this.length);let u=this[t],s=1,l=0;for(;++l<r&&(s*=256);)u+=this[t+l]*s;return s*=128,u>=s&&(u-=Math.pow(2,8*r)),u},c.prototype.readIntBE=function(t,r,i){t=t>>>0,r=r>>>0,i||A(t,r,this.length);let u=r,s=1,l=this[t+--u];for(;u>0&&(s*=256);)l+=this[t+--u]*s;return s*=128,l>=s&&(l-=Math.pow(2,8*r)),l},c.prototype.readInt8=function(t,r){return t=t>>>0,r||A(t,1,this.length),this[t]&128?(255-this[t]+1)*-1:this[t]},c.prototype.readInt16LE=function(t,r){t=t>>>0,r||A(t,2,this.length);const i=this[t]|this[t+1]<<8;return i&32768?i|4294901760:i},c.prototype.readInt16BE=function(t,r){t=t>>>0,r||A(t,2,this.length);const i=this[t+1]|this[t]<<8;return i&32768?i|4294901760:i},c.prototype.readInt32LE=function(t,r){return t=t>>>0,r||A(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},c.prototype.readInt32BE=function(t,r){return t=t>>>0,r||A(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},c.prototype.readBigInt64LE=D(function(t){t=t>>>0,j(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&z(t,this.length-8);const u=this[t+4]+this[t+5]*2**8+this[t+6]*2**16+(i<<24);return(BigInt(u)<<BigInt(32))+BigInt(r+this[++t]*2**8+this[++t]*2**16+this[++t]*2**24)}),c.prototype.readBigInt64BE=D(function(t){t=t>>>0,j(t,"offset");const r=this[t],i=this[t+7];(r===void 0||i===void 0)&&z(t,this.length-8);const u=(r<<24)+this[++t]*2**16+this[++t]*2**8+this[++t];return(BigInt(u)<<BigInt(32))+BigInt(this[++t]*2**24+this[++t]*2**16+this[++t]*2**8+i)}),c.prototype.readFloatLE=function(t,r){return t=t>>>0,r||A(t,4,this.length),f.read(this,t,!0,23,4)},c.prototype.readFloatBE=function(t,r){return t=t>>>0,r||A(t,4,this.length),f.read(this,t,!1,23,4)},c.prototype.readDoubleLE=function(t,r){return t=t>>>0,r||A(t,8,this.length),f.read(this,t,!0,52,8)},c.prototype.readDoubleBE=function(t,r){return t=t>>>0,r||A(t,8,this.length),f.read(this,t,!1,52,8)};function b(e,t,r,i,u,s){if(!c.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>u||t<s)throw new RangeError('"value" argument is out of bounds');if(r+i>e.length)throw new RangeError("Index out of range")}c.prototype.writeUintLE=c.prototype.writeUIntLE=function(t,r,i,u){if(t=+t,r=r>>>0,i=i>>>0,!u){const m=Math.pow(2,8*i)-1;b(this,t,r,i,m,0)}let s=1,l=0;for(this[r]=t&255;++l<i&&(s*=256);)this[r+l]=t/s&255;return r+i},c.prototype.writeUintBE=c.prototype.writeUIntBE=function(t,r,i,u){if(t=+t,r=r>>>0,i=i>>>0,!u){const m=Math.pow(2,8*i)-1;b(this,t,r,i,m,0)}let s=i-1,l=1;for(this[r+s]=t&255;--s>=0&&(l*=256);)this[r+s]=t/l&255;return r+i},c.prototype.writeUint8=c.prototype.writeUInt8=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,1,255,0),this[r]=t&255,r+1},c.prototype.writeUint16LE=c.prototype.writeUInt16LE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,2,65535,0),this[r]=t&255,this[r+1]=t>>>8,r+2},c.prototype.writeUint16BE=c.prototype.writeUInt16BE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,2,65535,0),this[r]=t>>>8,this[r+1]=t&255,r+2},c.prototype.writeUint32LE=c.prototype.writeUInt32LE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,4,4294967295,0),this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=t&255,r+4},c.prototype.writeUint32BE=c.prototype.writeUInt32BE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,4,4294967295,0),this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=t&255,r+4};function _t(e,t,r,i,u){Ut(t,i,u,e,r,7);let s=Number(t&BigInt(4294967295));e[r++]=s,s=s>>8,e[r++]=s,s=s>>8,e[r++]=s,s=s>>8,e[r++]=s;let l=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=l,l=l>>8,e[r++]=l,l=l>>8,e[r++]=l,l=l>>8,e[r++]=l,r}function Bt(e,t,r,i,u){Ut(t,i,u,e,r,7);let s=Number(t&BigInt(4294967295));e[r+7]=s,s=s>>8,e[r+6]=s,s=s>>8,e[r+5]=s,s=s>>8,e[r+4]=s;let l=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=l,l=l>>8,e[r+2]=l,l=l>>8,e[r+1]=l,l=l>>8,e[r]=l,r+8}c.prototype.writeBigUInt64LE=D(function(t,r=0){return _t(this,t,r,BigInt(0),BigInt("0xffffffffffffffff"))}),c.prototype.writeBigUInt64BE=D(function(t,r=0){return Bt(this,t,r,BigInt(0),BigInt("0xffffffffffffffff"))}),c.prototype.writeIntLE=function(t,r,i,u){if(t=+t,r=r>>>0,!u){const B=Math.pow(2,8*i-1);b(this,t,r,i,B-1,-B)}let s=0,l=1,m=0;for(this[r]=t&255;++s<i&&(l*=256);)t<0&&m===0&&this[r+s-1]!==0&&(m=1),this[r+s]=(t/l>>0)-m&255;return r+i},c.prototype.writeIntBE=function(t,r,i,u){if(t=+t,r=r>>>0,!u){const B=Math.pow(2,8*i-1);b(this,t,r,i,B-1,-B)}let s=i-1,l=1,m=0;for(this[r+s]=t&255;--s>=0&&(l*=256);)t<0&&m===0&&this[r+s+1]!==0&&(m=1),this[r+s]=(t/l>>0)-m&255;return r+i},c.prototype.writeInt8=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,1,127,-128),t<0&&(t=255+t+1),this[r]=t&255,r+1},c.prototype.writeInt16LE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,2,32767,-32768),this[r]=t&255,this[r+1]=t>>>8,r+2},c.prototype.writeInt16BE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,2,32767,-32768),this[r]=t>>>8,this[r+1]=t&255,r+2},c.prototype.writeInt32LE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,4,2147483647,-2147483648),this[r]=t&255,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24,r+4},c.prototype.writeInt32BE=function(t,r,i){return t=+t,r=r>>>0,i||b(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=t&255,r+4},c.prototype.writeBigInt64LE=D(function(t,r=0){return _t(this,t,r,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),c.prototype.writeBigInt64BE=D(function(t,r=0){return Bt(this,t,r,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function Et(e,t,r,i,u,s){if(r+i>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function It(e,t,r,i,u){return t=+t,r=r>>>0,u||Et(e,t,r,4),f.write(e,t,r,i,23,4),r+4}c.prototype.writeFloatLE=function(t,r,i){return It(this,t,r,!0,i)},c.prototype.writeFloatBE=function(t,r,i){return It(this,t,r,!1,i)};function Ft(e,t,r,i,u){return t=+t,r=r>>>0,u||Et(e,t,r,8),f.write(e,t,r,i,52,8),r+8}c.prototype.writeDoubleLE=function(t,r,i){return Ft(this,t,r,!0,i)},c.prototype.writeDoubleBE=function(t,r,i){return Ft(this,t,r,!1,i)},c.prototype.copy=function(t,r,i,u){if(!c.isBuffer(t))throw new TypeError("argument should be a Buffer");if(i||(i=0),!u&&u!==0&&(u=this.length),r>=t.length&&(r=t.length),r||(r=0),u>0&&u<i&&(u=i),u===i||t.length===0||this.length===0)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(i<0||i>=this.length)throw new RangeError("Index out of range");if(u<0)throw new RangeError("sourceEnd out of bounds");u>this.length&&(u=this.length),t.length-r<u-i&&(u=t.length-r+i);const s=u-i;return this===t&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(r,i,u):Uint8Array.prototype.set.call(t,this.subarray(i,u),r),s},c.prototype.fill=function(t,r,i,u){if(typeof t=="string"){if(typeof r=="string"?(u=r,r=0,i=this.length):typeof i=="string"&&(u=i,i=this.length),u!==void 0&&typeof u!="string")throw new TypeError("encoding must be a string");if(typeof u=="string"&&!c.isEncoding(u))throw new TypeError("Unknown encoding: "+u);if(t.length===1){const l=t.charCodeAt(0);(u==="utf8"&&l<128||u==="latin1")&&(t=l)}}else typeof t=="number"?t=t&255:typeof t=="boolean"&&(t=Number(t));if(r<0||this.length<r||this.length<i)throw new RangeError("Out of range index");if(i<=r)return this;r=r>>>0,i=i===void 0?this.length:i>>>0,t||(t=0);let s;if(typeof t=="number")for(s=r;s<i;++s)this[s]=t;else{const l=c.isBuffer(t)?t:c.from(t,u),m=l.length;if(m===0)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(s=0;s<i-r;++s)this[s+r]=l[s%m]}return this};const $={};function et(e,t,r){$[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(u){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:u,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}et("ERR_BUFFER_OUT_OF_BOUNDS",function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),et("ERR_INVALID_ARG_TYPE",function(e,t){return`The "${e}" argument must be of type number. Received type ${typeof t}`},TypeError),et("ERR_OUT_OF_RANGE",function(e,t,r){let i=`The value of "${e}" is out of range.`,u=r;return Number.isInteger(r)&&Math.abs(r)>2**32?u=At(String(r)):typeof r=="bigint"&&(u=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(u=At(u)),u+="n"),i+=` It must be ${t}. Received ${u}`,i},RangeError);function At(e){let t="",r=e.length;const i=e[0]==="-"?1:0;for(;r>=i+4;r-=3)t=`_${e.slice(r-3,r)}${t}`;return`${e.slice(0,r)}${t}`}function er(e,t,r){j(t,"offset"),(e[t]===void 0||e[t+r]===void 0)&&z(t,e.length-(r+1))}function Ut(e,t,r,i,u,s){if(e>r||e<t){const l=typeof t=="bigint"?"n":"";let m;throw s>3?t===0||t===BigInt(0)?m=`>= 0${l} and < 2${l} ** ${(s+1)*8}${l}`:m=`>= -(2${l} ** ${(s+1)*8-1}${l}) and < 2 ** ${(s+1)*8-1}${l}`:m=`>= ${t}${l} and <= ${r}${l}`,new $.ERR_OUT_OF_RANGE("value",m,e)}er(i,u,s)}function j(e,t){if(typeof e!="number")throw new $.ERR_INVALID_ARG_TYPE(t,"number",e)}function z(e,t,r){throw Math.floor(e)!==e?(j(e,r),new $.ERR_OUT_OF_RANGE(r||"offset","an integer",e)):t<0?new $.ERR_BUFFER_OUT_OF_BOUNDS:new $.ERR_OUT_OF_RANGE(r||"offset",`>= ${r?1:0} and <= ${t}`,e)}const nr=/[^+/0-9A-Za-z-_]/g;function ir(e){if(e=e.split("=")[0],e=e.trim().replace(nr,""),e.length<2)return"";for(;e.length%4!==0;)e=e+"=";return e}function nt(e,t){t=t||1/0;let r;const i=e.length;let u=null;const s=[];for(let l=0;l<i;++l){if(r=e.charCodeAt(l),r>55295&&r<57344){if(!u){if(r>56319){(t-=3)>-1&&s.push(239,191,189);continue}else if(l+1===i){(t-=3)>-1&&s.push(239,191,189);continue}u=r;continue}if(r<56320){(t-=3)>-1&&s.push(239,191,189),u=r;continue}r=(u-55296<<10|r-56320)+65536}else u&&(t-=3)>-1&&s.push(239,191,189);if(u=null,r<128){if((t-=1)<0)break;s.push(r)}else if(r<2048){if((t-=2)<0)break;s.push(r>>6|192,r&63|128)}else if(r<65536){if((t-=3)<0)break;s.push(r>>12|224,r>>6&63|128,r&63|128)}else if(r<1114112){if((t-=4)<0)break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,r&63|128)}else throw new Error("Invalid code point")}return s}function or(e){const t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r)&255);return t}function ur(e,t){let r,i,u;const s=[];for(let l=0;l<e.length&&!((t-=2)<0);++l)r=e.charCodeAt(l),i=r>>8,u=r%256,s.push(u),s.push(i);return s}function bt(e){return o.toByteArray(ir(e))}function Q(e,t,r,i){let u;for(u=0;u<i&&!(u+r>=t.length||u>=e.length);++u)t[u+r]=e[u];return u}function R(e,t){return e instanceof t||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===t.name}function it(e){return e!==e}const cr=function(){const e="0123456789abcdef",t=new Array(256);for(let r=0;r<16;++r){const i=r*16;for(let u=0;u<16;++u)t[i+u]=e[r]+e[u]}return t}();function D(e){return typeof BigInt>"u"?fr:e}function fr(){throw new Error("BigInt not supported")}})(Nt);var Lt={exports:{}},I=Lt.exports={},S,N;function ft(){throw new Error("setTimeout has not been defined")}function st(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?S=setTimeout:S=ft}catch{S=ft}try{typeof clearTimeout=="function"?N=clearTimeout:N=st}catch{N=st}})();function Mt(n){if(S===setTimeout)return setTimeout(n,0);if((S===ft||!S)&&setTimeout)return S=setTimeout,setTimeout(n,0);try{return S(n,0)}catch{try{return S.call(null,n,0)}catch{return S.call(this,n,0)}}}function Er(n){if(N===clearTimeout)return clearTimeout(n);if((N===st||!N)&&clearTimeout)return N=clearTimeout,clearTimeout(n);try{return N(n)}catch{try{return N.call(null,n)}catch{return N.call(this,n)}}}var L=[],W=!1,O,K=-1;function Ir(){!W||!O||(W=!1,O.length?L=O.concat(L):K=-1,L.length&&Dt())}function Dt(){if(!W){var n=Mt(Ir);W=!0;for(var o=L.length;o;){for(O=L,L=[];++K<o;)O&&O[K].run();K=-1,o=L.length}O=null,W=!1,Er(n)}}I.nextTick=function(n){var o=new Array(arguments.length-1);if(arguments.length>1)for(var f=1;f<arguments.length;f++)o[f-1]=arguments[f];L.push(new Pt(n,o)),L.length===1&&!W&&Mt(Dt)};function Pt(n,o){this.fun=n,this.array=o}Pt.prototype.run=function(){this.fun.apply(null,this.array)};I.title="browser";I.browser=!0;I.env={};I.argv=[];I.version="";I.versions={};function M(){}I.on=M;I.addListener=M;I.once=M;I.off=M;I.removeListener=M;I.removeAllListeners=M;I.emit=M;I.prependListener=M;I.prependOnceListener=M;I.listeners=function(n){return[]};I.binding=function(n){throw new Error("process.binding is not supported")};I.cwd=function(){return"/"};I.chdir=function(n){throw new Error("process.chdir is not supported")};I.umask=function(){return 0};var Fr=Lt.exports;(function(n){Object.defineProperty(n,Symbol.toStringTag,{value:"Module"});const o=Nt,f=Fr,a=h=>h&&h.__esModule?h:{default:h},p=a(f),y=globalThis||void 0||self;Object.defineProperty(n,"Buffer",{enumerable:!0,get:()=>o.Buffer}),Object.defineProperty(n,"process",{enumerable:!0,get:()=>p.default}),n.global=y})(pr);let tt=!1;function ie(){tt=!0}function oe(){tt=!1}function Ar(n,o,f,a){for(;n<o;){const p=n+(o-n>>1);f(p)<=a?n=p+1:o=p}return n}function Ur(n){if(n.hydrate_init)return;n.hydrate_init=!0;let o=n.childNodes;if(n.nodeName==="HEAD"){const d=[];for(let x=0;x<o.length;x++){const g=o[x];g.claim_order!==void 0&&d.push(g)}o=d}const f=new Int32Array(o.length+1),a=new Int32Array(o.length);f[0]=-1;let p=0;for(let d=0;d<o.length;d++){const x=o[d].claim_order,g=(p>0&&o[f[p]].claim_order<=x?p+1:Ar(1,p,C=>o[f[C]].claim_order,x))-1;a[d]=f[g]+1;const F=g+1;f[F]=d,p=Math.max(F,p)}const y=[],h=[];let c=o.length-1;for(let d=f[p]+1;d!=0;d=a[d-1]){for(y.push(o[d-1]);c>=d;c--)h.push(o[c]);c--}for(;c>=0;c--)h.push(o[c]);y.reverse(),h.sort((d,x)=>d.claim_order-x.claim_order);for(let d=0,x=0;d<h.length;d++){for(;x<y.length&&h[d].claim_order>=y[x].claim_order;)x++;const g=x<y.length?y[x]:null;n.insertBefore(h[d],g)}}function br(n,o){n.appendChild(o)}function Tr(n){if(!n)return document;const o=n.getRootNode?n.getRootNode():n.ownerDocument;return o&&o.host?o:n.ownerDocument}function ue(n){const o=Ot("style");return o.textContent="/* empty */",Cr(Tr(n),o),o.sheet}function Cr(n,o){return br(n.head||n,o),o.sheet}function Rr(n,o){if(tt){for(Ur(n),(n.actual_end_child===void 0||n.actual_end_child!==null&&n.actual_end_child.parentNode!==n)&&(n.actual_end_child=n.firstChild);n.actual_end_child!==null&&n.actual_end_child.claim_order===void 0;)n.actual_end_child=n.actual_end_child.nextSibling;o!==n.actual_end_child?(o.claim_order!==void 0||o.parentNode!==n)&&n.insertBefore(o,n.actual_end_child):n.actual_end_child=o.nextSibling}else(o.parentNode!==n||o.nextSibling!==null)&&n.appendChild(o)}function ce(n,o,f){tt&&!f?Rr(n,o):(o.parentNode!==n||o.nextSibling!=f)&&n.insertBefore(o,f||null)}function fe(n){n.parentNode&&n.parentNode.removeChild(n)}function se(n,o){for(let f=0;f<n.length;f+=1)n[f]&&n[f].d(o)}function Ot(n){return document.createElement(n)}function Sr(n){return document.createElementNS("http://www.w3.org/2000/svg",n)}function pt(n){return document.createTextNode(n)}function le(){return pt(" ")}function ae(){return pt("")}function he(n,o,f,a){return n.addEventListener(o,f,a),()=>n.removeEventListener(o,f,a)}function yt(n,o,f){f==null?n.removeAttribute(o):n.getAttribute(o)!==f&&n.setAttribute(o,f)}const Nr=["width","height"];function kr(n,o){const f=Object.getOwnPropertyDescriptors(n.__proto__);for(const a in o)o[a]==null?n.removeAttribute(a):a==="style"?n.style.cssText=o[a]:a==="__value"?n.value=n[a]=o[a]:f[a]&&f[a].set&&Nr.indexOf(a)===-1?n[a]=o[a]:yt(n,a,o[a])}function pe(n,o){for(const f in o)yt(n,f,o[f])}function Lr(n,o){Object.keys(o).forEach(f=>{Mr(n,f,o[f])})}function Mr(n,o,f){o in n?n[o]=typeof n[o]=="boolean"&&f===""?!0:f:yt(n,o,f)}function ye(n){return/-/.test(n)?Lr:kr}function de(n){return n.dataset.svelteH}function me(n){return Array.from(n.childNodes)}function Dr(n){n.claim_info===void 0&&(n.claim_info={last_index:0,total_claimed:0})}function $t(n,o,f,a,p=!1){Dr(n);const y=(()=>{for(let h=n.claim_info.last_index;h<n.length;h++){const c=n[h];if(o(c)){const d=f(c);return d===void 0?n.splice(h,1):n[h]=d,p||(n.claim_info.last_index=h),c}}for(let h=n.claim_info.last_index-1;h>=0;h--){const c=n[h];if(o(c)){const d=f(c);return d===void 0?n.splice(h,1):n[h]=d,p?d===void 0&&n.claim_info.last_index--:n.claim_info.last_index=h,c}}return a()})();return y.claim_order=n.claim_info.total_claimed,n.claim_info.total_claimed+=1,y}function jt(n,o,f,a){return $t(n,p=>p.nodeName===o,p=>{const y=[];for(let h=0;h<p.attributes.length;h++){const c=p.attributes[h];f[c.name]||y.push(c.name)}y.forEach(h=>p.removeAttribute(h))},()=>a(o))}function we(n,o,f){return jt(n,o,f,Ot)}function xe(n,o,f){return jt(n,o,f,Sr)}function Pr(n,o){return $t(n,f=>f.nodeType===3,f=>{const a=""+o;if(f.data.startsWith(a)){if(f.data.length!==a.length)return f.splitText(a.length)}else f.data=a},()=>pt(o),!0)}function ge(n){return Pr(n," ")}function _e(n,o){o=""+o,n.data!==o&&(n.data=o)}function Be(n,o){n.value=o??""}function Ee(n,o,f,a){f==null?n.style.removeProperty(o):n.style.setProperty(o,f,a?"important":"")}function Or(n,o,{bubbles:f=!1,cancelable:a=!1}={}){return new CustomEvent(n,{detail:o,bubbles:f,cancelable:a})}function Ie(n,o){return new n(o)}let Z;function ut(n){Z=n}function H(){if(!Z)throw new Error("Function called outside component initialization");return Z}function Fe(n){H().$$.on_mount.push(n)}function Ae(n){H().$$.after_update.push(n)}function Ue(n){H().$$.on_destroy.push(n)}function be(){const n=H();return(o,f,{cancelable:a=!1}={})=>{const p=n.$$.callbacks[o];if(p){const y=Or(o,f,{cancelable:a});return p.slice().forEach(h=>{h.call(n,y)}),!y.defaultPrevented}return!0}}function Te(n,o){return H().$$.context.set(n,o),o}function Ce(n){return H().$$.context.get(n)}function Re(n,o){const f=n.$$.callbacks[o.type];f&&f.slice().forEach(a=>a.call(this,o))}const J=[],Tt=[];let Y=[];const lt=[],qt=Promise.resolve();let at=!1;function $r(){at||(at=!0,qt.then(qr))}function Se(){return $r(),qt}function jr(n){Y.push(n)}function Ne(n){lt.push(n)}const ct=new Set;let G=0;function qr(){if(G!==0)return;const n=Z;do{try{for(;G<J.length;){const o=J[G];G++,ut(o),Gr(o.$$)}}catch(o){throw J.length=0,G=0,o}for(ut(null),J.length=0,G=0;Tt.length;)Tt.pop()();for(let o=0;o<Y.length;o+=1){const f=Y[o];ct.has(f)||(ct.add(f),f())}Y.length=0}while(J.length);for(;lt.length;)lt.pop()();at=!1,ct.clear(),ut(n)}function Gr(n){if(n.fragment!==null){n.update(),ar(n.before_update);const o=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,o),n.after_update.forEach(jr)}}function ke(n){const o=[],f=[];Y.forEach(a=>n.indexOf(a)===-1?o.push(a):f.push(a)),f.forEach(a=>a()),Y=o}export{Nt as $,Jr as A,Kr as B,Zr as C,Qr as D,zr as E,Ue as F,te as G,kr as H,re as I,he as J,ar as K,jr as L,pe as M,Rr as N,se as O,de as P,be as Q,hr as R,Rt as S,ye as T,Re as U,Be as V,Ne as W,Xr as X,ee as Y,Wr as Z,pr as _,le as a,Tr as a0,ue as a1,Or as a2,Yr as a3,qr as a4,Vr as a5,ke as a6,Z as a7,ut as a8,lr as a9,J as aa,$r as ab,ie as ac,oe as ad,Ae as b,ge as c,fe as d,ae as e,Ot as f,we as g,me as h,ce as i,yt as j,Ee as k,pt as l,Pr as m,_e as n,Fe as o,Tt as p,Ie as q,sr as r,Hr as s,Se as t,vr as u,Sr as v,xe as w,Ct as x,Te as y,Ce as z};
