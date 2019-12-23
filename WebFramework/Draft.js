(()=>{

	/* resource cache */
	var caches=[];
	/* required resources */
	let rr=[];
	/* whether another resource can be received */
	var acceptable=true;
	/* whether header already received */
	var hasHeader=false;

	let header=d=>{
		if (!d.resources) return false;
		if (d.resources.constructor!=Array) return false;
		for (var n of d.resources) {
			if (typeof(n)!="string") return false;
			if (rr.some(i=>i==n)) return false;
			rr.push(n);
			let c=caches.find(c=>c.id==n);
			if (c) c.option=optionParser(d[n]);
			else caches.push({
				id:n,
				res:null,
				option:optionParser(d[n])
			});
		}
		caches.forEach(c=>{
			let m=rr.indexOf(c.id);
			if (m<0) caches.splice(m,1);
		});
		bootCheck();
		return true;
	};
	let other=(i,r)=>{
		if (typeof(r)!="function") return false;
		/* after header loading */
		if (hasHeader) {
			let c=caches.find(c=>(c.id==i)&&(!c.res));
			if (c) c.res=r;
			else return false;
		}
		/* before header loading */
		else {
			if (caches.every(c=>c.id!=i)) caches.push({
				id:i,
				res:r,
				option:null
			});
			else return false;
		}
		bootCheck();
		return true;
	};
	let bootCheck=()=>{
		if (!hasHeader) return;
		if (caches.some(c=>!c.res)) return;
		acceptable=false;
		mainThread();
	};

	let interface=(i,r)=>{
		if (!acceptable) return false;
		/* for header */
		if (i=="header") {
			if (hasHeader) return false;
			let w=header(r);
			if (!w) acceptable=false;
			else hasHeader=true;
			return w;
		}
		/* for other resource */
		else return other(i,r);
	};

	let optionParser=ro=>{
		var o=ro;
		if (!o) o={};
		if (!o.args) o.args=[];
		if (o.args.constructor!=Array) o.args=[];
		return o;
	};
	let mainThread=()=>{
		let cue=rr.map(i=>caches.find(d=>d.id==i));
		/* create agent functions */
		cue.forEach(c=>{
			let a=[];
			for (var n=0;n<c.option.args.length;n++) a.push(`a[${n}]`);
			a.push("o");
			c.func=new Function("o","a","f",`return f(${a.join(",")});`);
		});
		(async ()=>{
			for (let c of cue) {
				let args=c.option.args.map(a=>object[a]);
				let r=c.func(object,args,c.res);
				if (!r) continue;
				else if (r.constructor==Promise) object[c.id]=await r;
				else object[c.id]=r;
			}
		})();
	};

	let object={
		/* DOM functions */
		ce:t=>document.createElement(t),
		che:t=>document.createElementNS("http://www.w3.org/1999/xhtml",t),
		cse:t=>document.createElementNS("http://www.w3.org/2000/svg",t),
		cme:t=>document.createElementNS("http://www.w3.org/1998/Math/MathML",t),
		cdf:()=>document.createDocumentFragment(),
		cd:(id,className,text)=>{
			let d=object.ce("div");
			if (id) d.id=id;
			if (className) d.className=className;
			if (text) d.textContent=text;
			return d;
		},
		id:i=>document.getElementById(i),
		qs:s=>document.querySelector(s),
		qsa:s=>document.querySelectorAll(s),
		ap:(p,...c)=>{for (e of c) p.appendChild(e);return c[0];},
		ib:(...e)=>{
			let p=e[e.length-1];
			for (var n=e.length-1;n>0;n--) p.insertBefore(e[n-1],e[n]);
			return e[0];
		},
		rep:(...e)=>{
			let o=e.pop();
			let p=o.parentNode;
			p.replaceChild(e[e.length-1],o);
			for (var n=e.length-1;n>0;n--) p.insertBefore(e[n-1],e[n]);
			return e[0];
		},
		rc:c=>c.parentNode.removeChild(c),
		cn:e=>e.cloneNode(true),
		ael:(e,t,f)=>{e.addEventListener(t,f);return e;},
		ga:(e,k)=>e.getAttribute(k),
		sa:(e,k,v)=>{
			if (v) e.setAttribute(k,v);
			else e.removeAttribute(k);
			return e;
		},
		gs:(e,k,c)=>{
			if (c) return getComputedStyle(e).getPropertyValue(k);
			else return e.style.getPropertyValue(k);
		},
		ss:(e,k,v)=>{
			if (v) e.style.setProperty(k,v);
			else e.style.removeProperty(k);
			if (!object.ga(e,"style")) object.sa(e,"style");
			return e;
		},
		cc:(e,c)=>e.classList.contains(c),
		tc:(e,c)=>{
			e.classList.toggle(c);
			if (!e.className) sc(e);
			return e;
		},
		sc:(e,c)=>{
			if (c) object.sa(e,"class",c);
			else object.ra(e,"class");
			return e;
		},
		bcr:e=>e.getBoundingClientRect(),
		mm:m=>window.matchMedia(m).matches,
		mal:(m,f)=>window.matchMedia(m).addListener(f),
		csm:s=>object.mm(`(prefers-color-scheme: ${s})`),
		csal:(s,f)=>object.mal(`(prefers-color-scheme: ${s})`,f),
		html:document.documentElement,
		head:document.head
	};

	window.framework=(identifier,resource)=>interface(identifier,resource);

})();