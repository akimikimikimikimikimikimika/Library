const Color=(()=>{let version="2.0"; let adjustRGB=input=>{try{if (isNaN(input-0)) return 0;else if (input<0) return 0;else if (input>255) return 255;else return input;}catch(e){return 0;}};let adjustHue=(input,t)=>{if (isNaN(input-0)) return 0;else return input%angle[t];};let adjustSX=input=>{if (isNaN(input-0)) return 0;else if (input<0) return 0;else if (input>1) return 1;else return input;};let adjustA=input=>{if (isNaN(input-0)) return 1;else if (input<0) return 0;else if (input>1) return 1;else return input;};let validateStringMode=input=>{switch (input) {case "Hex":case "RGBA":case "RGB":case "HSLA":case "HSL":case "HSVA":case "HSV":return true;default:return false;}}; let format=(input,max,unit)=>{var value=0;if ((/^\./).test(input)) input=`0${input}`;if (unit=="hex") value=parseInt(input,16)/255*max;else if ((/^[0-9\.]+\%$/).test(input)) value=(input.match(/[0-9\.]+/)[0]-0)/100*max;else if ((/^[0-9\.]+$/).test(input)) value=input.match(/[0-9\.]+/)[0].replace(/^\./,"0.")-0;if (value>max) value=max;switch (unit) {case "rad":value*=180/Math.PI;break;case "grad":value*=9/10;break;case "turn":value*=360;break;}return value;};let roundForA=v=>Math.round(v*1000)/1000; let re={Hex6:/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,Hex8:/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i,Hex3:/^\#([A-F0-9])([A-F0-9])([A-F0-9])$/i,Hex4:/^\#([A-F0-9])([A-F0-9])([A-F0-9])([A-F0-9])$/i,RGBA:/rgba*\(? *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%* *)\)?/i,RGB:/rgb\(? *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *\)?/i,HSLA:/hsla*\(? *([0-9\.]+) *(deg|rad|grad|turn|) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *\)?/i,HSL:/hsl\(? *([0-9\.]+) *(deg|rad|grad|turn|) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *\)?/i,HSVA:/hsva*\(? *([0-9\.]+) *(deg|rad|grad|turn|) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *\)?/i,HSV:/hsv\(? *([0-9\.]+) *(deg|rad|grad|turn|) *, *([0-9\.]+ *\%*) *, *([0-9\.]+ *\%*) *\)?/i,}; let RGBtoHSX=(r,g,b,w)=>{r/=255;g/=255;b/=255;let M=Math.max(r,g,b),m=Math.min(r,g,b);let p={h:null,s:w?((M-m)/(1-Math.abs(M+m-1))):((M-m)/M),x:(M+(w?m:M))/2,defH:M!=m};if (isNaN(p.s)) p.s = 0;if (p.defH) switch (m) {case r:p.h=(b-g)/(M-m)*60+180;break;case g:p.h=(r-b)/(M-m)*60+300;break;case b:p.h=(g-r)/(M-m)*60+60;break;}return p;};let HSXtoRGB=(h,s,x,d,w)=>{var M=m=0;if (w) {let ds=(1-Math.abs(x*2-1))*s/2;M=(x+ds)*255;m=(x-ds)*255;}else {M=x*255;m=(1-s)*x*255;}if (!d) return {r:M,g:M,b:M};else if (h>=300) return {r:M,g:m,b:(360-h)/60*(M-m)+m};else if (h>=240) return {r:(h-240)/60*(M-m)+m,g:m,b:M};else if (h>=180) return {r:m,g:(240-h)/60*(M-m)+m,b:M};else if (h>=120) return {r:m,g:M,b:(h-120)/60*(M-m)+m};else if (h>= 60) return {r:(120-h)/60*(M-m)+m,g:M,b:m};else if (h>= 0) return {r:M,g:(h-000)/60*(M-m)+m,b:m};}; let adjust=(d,to)=>{switch (to) {case "rgb":d.R=adjustRGB(d.R),d.G=adjustRGB(d.G),d.B=adjustRGB(d.B);var f1=RGBtoHSX(d.R,d.G,d.B,true),f2=RGBtoHSX(d.R,d.G,d.B,false);d.H=f1.h;d.S=f1.s;d.L=f1.x;d.hsvH=f2.h;d.hsvS=f2.s;d.hsvV=f2.x;d.colored=f1.defH;break;case "hsl":d.H=adjustHue(d.H,0),d.S=adjustSX(d.S),d.L=adjustSX(d.L);d.colored=d.S>0;var f0=HSXtoRGB(d.H,d.S,d.L,d.S>0,true);d.R=f0.r;d.G=f0.g;d.B=f0.b;var f2=RGBtoHSX(d.R,d.G,d.B,false);d.hsvH=f2.h;d.hsvS=f2.s;d.hsvV=f2.x;break;case "hsv":d.hsvH=adjustHue(d.hsvH,0),d.hsvS=adjustSX(d.hsvS),d.hsvV=adjustSX(d.hsvV);d.colored=d.hsvS>0;var f0=HSXtoRGB(d.hsvH,d.hsvS,d.hsvV,d.hsvS>0,false);d.R=f0.r;d.G=f0.g;d.B=f0.b;var f1=RGBtoHSX(d.R,d.G,d.B,true);d.H=f1.h;d.S=f1.s;d.L=f1.x;break;}}; let angle=[360,2*Math.PI,400,1]; let argArrange=(d,args)=>{var apr="rgb";d.valid=true;switch (args.length) {case 4:d.R=args[0];d.G=args[1];d.B=args[2];d.A=args[3];if (d.name) d.name=null;break;case 3:d.R=args[0];d.G=args[1];d.B=args[2];if (d.name) d.name=null;break;case 1:if (isColor(args[0])) {let c=args[0];d.R=c.R;d.G=c.G;d.B=c.B;d.A=c.A;d.name=c.name;d.stringMode=c.stringMode=="NAME"?"Hex":c.stringMode;}else if (!isNaN(args[0]-0)) d.R=d.G=d.B=adjustRGB(args[0]);else {var ag="";if ((typeof args[0])=="string") ag=args[0].replace(/ /g,"");else ag=`${args[0]}`;if (constant[ag.toLowerCase()]) {let c=constant[ag.toLowerCase()];d.R=c.R;d.G=c.G;d.B=c.B;d.A=c.A;d[sym4]=c.name;}else if (re.Hex8.test(ag)) {let s=ag.match(re.Hex8);d.R=format(s[1],255,"hex");d.G=format(s[2],255,"hex");d.B=format(s[3],255,"hex");d.A=format(s[4],1,"hex");if (d.name) d.name=null;}else if (re.Hex6.test(ag)) {let s=ag.match(re.Hex6);d.R=format(s[1],255,"hex");d.G=format(s[2],255,"hex");d.B=format(s[3],255,"hex");if (d.name) d.name=null;}else if (re.Hex4.test(ag)) {let s=ag.match(re.Hex4);d.R=format(s[1],4335,"hex");d.G=format(s[2],4335,"hex");d.B=format(s[3],4335,"hex");d.A=format(s[4],17,"hex");if (d.name) d.name=null;}else if (re.Hex3.test(ag)) {let s=ag.match(re.Hex3);d.R=format(s[1],4335,"hex");d.G=format(s[2],4335,"hex");d.B=format(s[3],4335,"hex");if (d.name) d.name=null;}else if (re.RGBA.test(ag)) {let s=ag.match(re.RGBA);d.R=format(s[1],255);d.G=format(s[2],255);d.B=format(s[3],255);d.A=format(s[4],1);if (d.name) d.name=null;}else if (re.RGB.test(ag)) {let s=ag.match(re.RGB);d.R=format(s[1],255);d.G=format(s[2],255);d.B=format(s[3],255);if (d.name) d.name=null;}else if (re.HSLA.test(ag)) {let s=ag.match(re.HSLA);d.H=format(s[1],360,s[2]);d.S=format(s[3],1);d.L=format(s[4],1);d.A=format(s[5],1);if (d.name) d.name=null;apr="hsl";}else if (re.HSL.test(ag)) {let s=ag.match(re.HSL);d.H=format(s[1],360,s[2]);d.S=format(s[3],1);d.L=format(s[4],1);if (d.name) d.name=null;apr="hsl";}else if (re.HSVA.test(ag)) {let s=ag.match(re.HSVA);d.hsvH=format(s[1],360,s[2]);d.hsvS=format(s[3],1);d.hsvV=format(s[4],1);d.A=format(s[5],1);if (d.name) d.name=null;apr="hsv";}else if (re.HSV.test(ag)) {let s=ag.match(re.HSV);d.hsvH=format(s[1],360,s[2]);d.hsvS=format(s[3],1);d.hsvV=format(s[4],1);if (d.name) d.name=null;apr="hsv";}else d.valid=false;}break;case 0:break;default:d.valid=false;break;}adjust(d,apr);}; let initialize=(args)=>{let d={A:1,R:0,G:0,B:0,H:0,S:0,L:0,hsvH:0,hsvS:0,hsvV:0,colored:false,stringMode:"Hex",valid:true,writable:true,name:null};let t=()=>d;argArrange(d,args);let c=new Proxy(t,{construct:(target,args)=>{if (args.length) return initialize(args);else return initialize([c]);},apply:(target,t,args)=>{if (args.length) return initialize(args);else return initialize([c]);},has:()=>false,deleteProperty:()=>false,isExtensible:()=>false,preventExtensions:()=>true,getPrototypeOf:()=>Color,setPrototypeOf:()=>false,defineProperty:()=>false,getOwnPropertyDescriptor:(t,p)=>{return {configurable:false};},get:getter,set:setter});return c;}; let getter=(t,p,c)=>{let d=t();let toPrimitive=t=>{switch (t){case "number":return toNumber(d);case "string":return toString(d);case "default":return toString(d);}};let invert=()=>{if (d.writable) {let b=inverter(c);d.R=b[0];d.G=b[1];d.B=b[2];d.A=b[3];}return c;};let inverted=()=>{return initialize(inverter(c));};let pull=(clr,p)=>{if (d.writable) {let b=puller(c,clr,p);d.R=b[0];d.G=b[1];d.B=b[2];d.A=b[3];}return c;};let pulled=(clr,p)=>{return initialize(puller(c,clr,p));};let ct=()=>{let l=[];for (var x in constV) l.push(constant[x]);return l;};let isEqual=(c1,c2)=>equal(c1,c2);let isEqualTo=(clr)=>equal(c,clr);let A=v=>agent(d,c,{s:"a"},v);let R=(v,t)=>agent(d,c,{p:"R",t:t},v);let G=(v,t)=>agent(d,c,{p:"G",t:t},v);let B=(v,t)=>agent(d,c,{p:"B",t:t},v);let H=(v,t)=>agent(d,c,{p:"H",t:t},v);let S=v=>agent(d,c,{p:"S"},v);let L=v=>agent(d,c,{p:"L"},v);switch (p) {case Symbol.toStringTag:return "Color";case Symbol.toPrimitive:return (hint)=>toPrimitive(hint);case "A":return d.A-0;case "a":return value=>A(value);case "R":return d.R-0;case "r":return (value,type)=>R(value,type);case "G":return d.G-0;case "g":return (value,type)=>G(value,type);case "B":return d.B-0;case "b":return (value,type)=>B(value,type);case "H":return d.H-0;case "h":return (value,type)=>H(value,type);case "S":return d.S-0;case "s":return value=>S(value);case "L":return d.L-0;case "l":return value=>L(value);case "hsvH":return d.hsvH-0;case "hsvS":return d.hsvS-0;case "hsvV":return d.hsvV-0;case "colored":return !!d.colored;case "Hex":case "hex":return Hex(d);case "RGBA":case "rgba":return RGBA(d);case "RGB":case "rgb":return RGB(d);case "HSLA":case "hsla":return HSLA(d);case "HSL":case "hsl":return HSL(d);case "HSV":case "hsv":return HSV(d);case "HSVA":case "hsva":return HSVA(d);case "stringMode":return `${d.name?"NAME":d.stringMode}`;case "name":return d.name===sym1?null:d.name;case "valid":return d.valid;case "isEqual":return (color1,color2)=>isEqual(color1,color2);case "isEqualTo":return (color)=>isEqualTo(color);case "invert":return ()=>invert();case "inverted":return ()=>inverted();case "pull":return (color,proportion)=>pull(color,proportion);case "pulled":return (color,proportion)=>pulled(color,proportion);case "constants":return ct();case "version":return version;case "grayscale":return lightness=>grayscale(lightness);case "random":return random();case sym1:return sym2;default:if (constant[p]) return constant[p];else return undefined;}}; let setter=(t,p,v)=>{let d=t();switch (p) {case "R":case "G":case "B":if (d.writable) {d[p]=v;if (d.name) d.name=null;adjust(d,"rgb");}return true;case "A":if (d.writable) {d.A=adjustA(v);if (d.name) d.name=null;}return true;case "H":case "S":case "L":if (d.writable) {d[p]=v;adjust(d,"hsl");if (d.name) d.name=null;}return true;case "hsvH":case "hsvS":case "hsvV":if (d.writable) {d[p]=v;adjust(d,"hsv");if (d.name) d.name=null;}return true;case "Hex":case "hex":case "RGBA":case "rgba":case "RGB":case "rgb":case "HSLA":case "hsla":case "HSL":case "hsl":case "HSV":case "hsv":case "HSVA":case "hsva":if (d.writable) {argArrange(d,[v]);if (d.name) d.name=null;}return true;case "stringMode":if (d.writable&validateStringMode(v)) d.stringMode=v;return true;case sym3:if (d.writable) d.writable=!!v;case sym4:if (d.writable) d.name=v===sym1?sym1:`${v}`;default:return false;}}; let agent=(d,c,o,v)=>{if (v!=undefined) {if (d.writable) {if (o.p=="A") v=adjustA(v);if ((/[rgb]/).test(o.p)&&o.t==1) v*=255;if (o.p=="H") v*=360/angle[o.t];d[o.p]=v;if (d.name) d.name=null;return c;}}else {var v=d[o.p];if ((/[rgb]/).test(o.p)&&o.t==1) v/=255;if (o.p=="H") v*=angle[o.t]/360;return v;}}; let toString=d=>{if (d.name===sym1) return Object.prototype.toString.call(Color);else if (d.name) return d.name;else switch (d.stringMode) {case "Hex":return Hex(d);case "RGBA":return RGBA(d);case "RGB":return RGB(d);case "HSLA":return HSLA(d);case "HSL":return HSL(d);case "HSVA":return HSVA(d);case "HSV":return HSV(d);}};let toNumber=d=>{let R=Math.round(d.R);let G=Math.round(d.G);let B=Math.round(d.B);return (R<<16)+(G<<8)+B;}; let Hex=d=>{let R=Math.round(d.R);let G=Math.round(d.G);let B=Math.round(d.B);return `#${R<16?"0":""}${R.toString(16)}${G<16?"0":""}${G.toString(16)}${B<16?"0":""}${B.toString(16)}`;};let RGBA=d=>{let R=Math.round(d.R);let G=Math.round(d.G);let B=Math.round(d.B);let A=roundForA(d.A);return `rgba(${R},${G},${B},${A})`;};let RGB=d=>{let R=Math.round(d.R);let G=Math.round(d.G);let B=Math.round(d.B);return `rgb(${R},${G},${B})`;};let HSLA=d=>{let H=Math.round(d.H);let S=Math.round(d.S*100);let L=Math.round(d.L*100);let A=roundForA(d.A);return `hsla(${H},${S}%,${L}%,${A})`;};let HSL=d=>{let H=Math.round(d.H);let S=Math.round(d.S*100);let L=Math.round(d.L*100);return `hsl(${H},${S}%,${L}%)`;};let HSVA=d=>{let H=Math.round(d.hsvH);let S=Math.round(d.hsvS*100);let V=Math.round(d.hsvV*100);let A=roundForA(d.A);return `hsva(${H},${S}%,${V}%,${A})`;};let HSV=d=>{let H=Math.round(d.hsvH);let S=Math.round(d.hsvS*100);let V=Math.round(d.hsvV*100);return `hsv(${hsvH},${hsvS}%,${hsvV}%)`;}; let isColor=v=>v[sym1]===sym2;let equal=(c1,c2) =>{if (!isColor(c1)|!isColor(c2)) return false;else return (c1.R==c2.R)&&(c1.G==c2.G)&&(c1.B==c2.B)&&(c1.A==c2.A);};let inverter=c=>{return [255-c.R,255-c.G,255-c.B,c.A];};let puller=(c1,c2,p)=>{if (p>1) p=1;else if (p<0) p=0;let r=1-p;return [(c1.R*r)+(c2.R*p),(c1.G*r)+(c2.G*p),(c1.B*r)+(c2.B*p),(c1.A*r)+(c2.A*p)];};let grayscale=l=>Color(l*255,l*255,l*255,1);let random=()=>Color( Math.random()*256,Math.random()*256,Math.random()*256,1); let sym1=Symbol(),sym2=Symbol(),sym3=Symbol(),sym4=Symbol(); let constV={AliceBlue:[240,248,255],AntiqueWhite:[250,235,215],Aqua:[0,255,255],Aquamarine:[127,255,212],Azure:[240,255,255],Beige:[245,245,220],Bisque:[255,228,196],Black:[0,0,0],BlanchedAlmond:[255,235,205],Blue:[0,0,255],BlueViolet:[138,43,226],Brown:[165,42,42],BurlyWood:[222,184,135],CadetBlue:[95,158,160],Chartreuse:[127,255,0],Chocolate:[210,105,30],Coral:[255,127,80],CornflowerBlue:[100,149,237],Cornsilk:[255,248,220],Crimson:[220,20,60],Cyan:[0,255,255],DarkBlue:[0,0,139],DarkCyan:[0,139,139],DarkGoldenRod:[184,134,11],DarkGray:[169,169,169],DarkGrey:[169,169,169],DarkGreen:[0,100,0],DarkKhaki:[189,183,107],DarkMagenta:[139,0,139],DarkOliveGreen:[85,107,47],DarkOrange:[255,140,0],DarkOrchid:[153,50,204],DarkRed:[139,0,0],DarkSalmon:[233,150,122],DarkSeaGreen:[143,188,143],DarkSlateBlue:[72,61,139],DarkSlateGray:[47,79,79],DarkSlateGrey:[47,79,79],DarkTurquoise:[0,206,209],DarkViolet:[148,0,211],DeepPink:[255,20,147],DeepSkyBlue:[0,191,255],DimGray:[105,105,105],DimGrey:[105,105,105],DodgerBlue:[30,144,255],FireBrick:[178,34,34],FloralWhite:[255,250,240],ForestGreen:[34,139,34],Fuchsia:[255,0,255],Gainsboro:[220,220,220],GhostWhite:[248,248,255],Gold:[255,215,0],GoldenRod:[218,165,32],Gray:[128,128,128],Grey:[128,128,128],Green:[0,128,0],GreenYellow:[173,255,47],HoneyDew:[240,255,240],HotPink:[255,105,180],IndianRed:[205,92,92],Indigo:[75,0,130],Ivory:[255,255,240],Khaki:[240,230,140],Lavender:[230,230,250],LavenderBlush:[255,240,245],LawnGreen:[124,252,0],LemonChiffon:[255,250,205],LightBlue:[173,216,230],LightCoral:[240,128,128],LightCyan:[224,255,255],LightGoldenRodYellow:[250,250,210],LightGray:[211,211,211],LightGrey:[211,211,211],LightGreen:[144,238,144],LightPink:[255,182,193],LightSalmon:[255,160,122],LightSeaGreen:[32,178,170],LightSkyBlue:[135,206,250],LightSlateGray:[119,136,153],LightSlateGrey:[119,136,153],LightSteelBlue:[176,196,222],LightYellow:[255,255,224],Lime:[0,255,0],LimeGreen:[50,205,50],Linen:[250,240,230],Magenta:[255,0,255],Maroon:[128,0,0],MediumAquaMarine:[102,205,170],MediumBlue:[0,0,205],MediumOrchid:[186,85,211],MediumPurple:[147,112,219],MediumSeaGreen:[60,179,113],MediumSlateBlue:[123,104,238],MediumSpringGreen:[0,250,154],MediumTurquoise:[72,209,204],MediumVioletRed:[199,21,133],MidnightBlue:[25,25,112],MintCream:[245,255,250],MistyRose:[255,228,225],Moccasin:[255,228,181],NavajoWhite:[255,222,173],Navy:[0,0,128],OldLace:[253,245,230],Olive:[128,128,0],OliveDrab:[107,142,35],Orange:[255,165,0],OrangeRed:[255,69,0],Orchid:[218,112,214],PaleGoldenRod:[238,232,170],PaleGreen:[152,251,152],PaleTurquoise:[175,238,238],PaleVioletRed:[219,112,147],PapayaWhip:[255,239,213],PeachPuff:[255,218,185],Peru:[205,133,63],Pink:[255,192,203],Plum:[221,160,221],PowderBlue:[176,224,230],Purple:[128,0,128],RebeccaPurple:[102,51,153],Red:[255,0,0],RosyBrown:[188,143,143],RoyalBlue:[65,105,225],SaddleBrown:[139,69,19],Salmon:[250,128,114],SandyBrown:[244,164,96],SeaGreen:[46,139,87],SeaShell:[255,245,238],Sienna:[160,82,45],Silver:[192,192,192],SkyBlue:[135,206,235],SlateBlue:[106,90,205],SlateGray:[112,128,144],SlateGrey:[112,128,144],Snow:[255,250,250],SpringGreen:[0,255,127],SteelBlue:[70,130,180],Tan:[210,180,140],Teal:[0,128,128],Thistle:[216,191,216],Tomato:[255,99,71],transparent:[0,0,0,0],Turquoise:[64,224,208],Violet:[238,130,238],Wheat:[245,222,179],White:[255,255,255],WhiteSmoke:[245,245,245],Yellow:[255,255,0],YellowGreen:[154,205,50],};let constant={};for (x in constV) {let v=initialize(constV[x]);constant[x]=v;constant[x.toLowerCase()]=v;v[sym4]=x;v[sym3]=false;} let Color=initialize([]);Color[sym4]=sym1;Color[sym3]=false;return Color;})();