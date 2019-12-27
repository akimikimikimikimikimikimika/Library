let p=(...args)=>{
	let ar=Array.from(args);
	let r=[],l=Math.max.apply({},ar.map(a=>a.length));
	for (var n=0;n<l;n++) r[n]=ar.reduce((p,c)=>{
		if (n<c.length) return p+c[n];
		else return p;
	},0);
	for (var n=l-1;n>=0;n--) {
		r[n-1]+=Math.floor(r[n]/10);
		r[n]%=10;
	}
	return r;
};

let m=(a,...args)=>{
	let ar=Array.from(args);
	let r=Array.from(a),l=Math.max(a.length,Math.max.apply({},ar.map(a=>a.length)));
	for (var n=0;n<l;n++) r[n]=ar.reduce((p,c)=>{
		if (n<c.length) return p-c[n];
		else return p;
	},r[n]);
	for (var n=l-1;n>=0;n--) if (r[n]<0) {
		r[n-1]+=Math.floor(r[n]/10);
		r[n]=r[n]%10+10;
	}
	return r;
};