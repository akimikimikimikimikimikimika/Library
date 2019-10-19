(()=>{
	/* searching for base object */
	var base;
	(()=>{
		try{
			base=window;
		}catch(e){
			try{
				base=self;
			}
			catch(e){}
		}
		if (!base) return;
	})();
	let proto=Number.prototype;

	/* exporting functions in Math */
	"asin,acos,atan,asinh,acosh,atanh,pow,expm1,log,log1p,log2,log10,atan2,hypot,abs,sign,sqrt,cbrt,floor,ceil,trunc,round,max,min,random,PI,E,LN2,LN10,LOG2E,LOG10E".split(",").forEach(v=>base[v]=Math[v]);
	M_PI=PI;
	M_E=E;
	TAU=2*PI;
	Euler=0.577215664901532860;

	/* Complex value initializer */
	let cn=(()=>{
		let a=args=>{
			let a=Array.from(args).map(a=>gcv(a));
			let o={x:0,y:0};
			a.forEach(v=>o={x:o.x+v.x,y:o.y+v.y});
			return cn(o.x,o.y);
		};
		let m=args=>{
			let a=Array.from(args).map(a=>gcv(a,{x:1,y:0}));
			let o={x:1,y:0};
			a.forEach(v=>o={x:o.x*v.x-o.y*v.y,y:o.x*v.y+o.y*v.x});
			return cn(o.x,o.y);
		};
		let d=(rf,rt)=>{
			let f=gcv(rf,{x:1,y:0}),t=gcv(rt,{x:1,y:0});
			let d=t.r**2;
			return cn(
				(f.x*t.x+f.y*t.y)/d,
				(-f.x*t.y+f.y*t.x)/d
			);
		};
		let w={
			get:(t,p)=>{
				switch (p) {
					case Symbol.toStringTag:return "Complex";
					case "x":case "real":return t.x;
					case "y":case "image":return t.y;
					case "r":case "abs":case "hypot":return hypot(t.y,t.x);
					case "t":case "arg":case "atan2":return atan2(t.y,t.x);
					case "norm":
						let r=hypot(t.y,t.x);
						return cn(t.x/r,t.y/r);
					case "new":return cn(t.x,t.y);
					case "constructor":return Number;
					default:return t[p];
				}
			},
			set:(t,p,v)=>{
				var rv=parseFloat(v);
				switch (p) {
					case "x":case "y":
						if (!isNaN(rv)) {
							if (p=="x") t.x=rv;
							if (p=="y") t.y=rv;
						}
						break;
					case "r":
						if (!isNaN(rv)) {
							let r=rv/hypot(t.y,t.x);
							t.x*=r,t.y*=r;
						}
						break;
					case "t":
						if (!isNaN(rv)) {
							let r=hypot(t.y,t.x);
							t.x=r*cos(rv),t.y=r*sin(rv);
						}
						break;
				}
			}
		};
		let Complex=(x,y)=>{
			let toString=()=>y?`${o.x}${o.y>=0?"+":""}${o.y}i`:`${o.x}`;
			let valueOf=()=>o.x;
			let add=args=>a(Array.from(args).concat(o));
			let multiply=args=>m(Array.from(args).concat(o));
			let div=t=>d(o,t);
			let o={
				x:x-0,y:y-0,
				toString:()=>toString(),
				valueOf:()=>valueOf(),
				add:(...args)=>add(args),
				multiply:(...args)=>multiply(args),
				div:divisor=>div(divisor)
			};
			if (isNaN(o.x)) o.x=0;
			if (isNaN(o.y)) o.y=0;
			return new Proxy(o,w);
		};
		return (x,y)=>Complex(x,y);
	})();
	let gcv=(v,d)=>{
		if (!(isNaN(v.x-0)||isNaN(v.y-0))) return cn(v.x,v.y);
		else if (!isNaN(v-0)) return cn(v,0);
		else if (d===NaN) return NaN;
		else if (d) return cn(d.x,d.y);
		else return cn(0,0);
	};
	base.Complex=cn;

	let exp=a=>{
		let v=gcv(a);
		let r=Math.exp(v.x),t=v.y;
		return cn(r*Math.cos(t),r*Math.sin(t));
	};
	base.exp=x=>exp(x);

	let log=a=>{
		let v=gcv(a);
		return cn(Math.log(v.r),v.t);
	};
	base.log=base.ln=x=>log(x);

	let pow=(a1,a2)=>{
		let x1=gcv(a1),x2=gcv(a2);
		if ((x1.image==0)&&(x2.image==0)) return Math.pow(x1.real,x2.real);
		else return exp(log(x1).multiply(x2));
	};
	base.pow=(x1,x2)=>pow(x1,x2);

	(()=>{
		let f=(a,t)=>{
			let i=gcv(a),p1,m1,c1,s1,p2,m2,c2,s2;
			let vr=t&8?+i.x:-i.y,vt=t&8?+i.y:+i.x;
			if (t&1) {
				let p=Math.exp(vr),m=Math.exp(-vr);
				p1=p+m,m1=p-m;
				c1=Math.cos(vt),s1=Math.sin(vt);
			}
			if (t&2) {
				let p=Math.exp(2*vr),m=Math.exp(-2*vr);
				p2=p+m,m2=p-m;
				c2=Math.cos(2*vt),s2=Math.sin(2*vt);
			}

			if (t&1==1) {
				return cn(
					(t==9?m1:p1)*(t==1?s1:c1)/+2,
					(t==9?p1:m1)*(t==1?c1:s1)/+2
				);
			}
			if (t&2==2) {
				let d=p2+2*(-1)**(t&4?1:0)*c2;
				return cn(
					(t&8?m2*1:p2*s2)/d,
					(t&8?2*s2:m2*c2)/d*(-1)**(t&4?1:0)
				);
			}
			if (t&3==3) {
				let d=p2+2*(-1)**((t&4?1:0)+(t&8?1:0))*c2;
				return cn(
					(t==11?m1:p1)*(t==7?s1:c1)/d*+2,
					(t==11?p1:m1)*(t==7?c1:s1)/d*-2
				);
			}
		};
		let a=[
			["sin ", 1],
			["cos ", 5],
			["tan ", 2],
			["cot ", 6],
			["sec ", 3],
			["csc ", 7],
			["sinh", 9],
			["cosh",13],
			["tanh",10],
			["coth",14],
			["sech",11],
			["csch",15]
		];
		a.forEach(p=>eval(`
			let ${p[0]}=x=>f(x,${p[1]});
			base.${p[0]}=x=>${p[0]}(x);
		`));
	})();

	/* custom functions */

	let radian=v=>v*PI/180;
	base.radian=x=>radian(x);
	proto.radian=function(){return radian(this);};

	let degree=v=>v/180*PI;
	base.degree=x=>degree(x);
	proto.degree=function(){return degree(this);};

	let clamp=(v,min,max)=>min(max(v,min),max);
	base.clamp=(x,min,max)=>clamp(x,min,max);
	proto.clamp=function(min,max){return clamp(this,min,max);};

	let sum=args=>{
		let a=args.map(v=>v-0).filter(v=>!isNaN(v));
		return a.reduce((p,c)=>p+c,0);
	};
	base.sum=(...values)=>sum(values);

	let product=args=>{
		let a=args.map(v=>v-0).filter(v=>!isNaN(v));
		return a.reduce((p,c)=>p+c,1);
	};
	base.product=(...values)=>product(values);

	let lcm=args=>{
		let a=args.map(v=>max(parseInt(v),1)).filter(v=>!isNaN(v));
		var m=1;
		if (a.length) m=max.apply({},a);
		var l=m;
		for (;a.some(n=>l%n);l+=m);
		return l;
	};
	base.lcm=(...values)=>lcm(values);

	let gcd=args=>{
		let a=args.map(v=>parseInt(v)).filter(v=>!isNaN(v));
		if (a.length) {
			var g=a[0];
			for (var n=1;n<a.length;n++) {
				var l=Math.max(g,a[n]),s=Math.min(g,a[n]);
				while (s) {
					var r=l%s;
					if (r) l=s,s=r;
					else g=s,s=0;
				}
			}
			return g;
		}
		else return null;
	};
	base.gcd=base.gcm=(...values)=>gcd(values);

	let factorize=a=>{
		let v=parseInt(a);
		if (isNaN(v)||v<1) return NaN;
		else if (v==1) return [];
		else {
			let l=[];
			var c=v;
			for (var n=2;n<=c;n++) {
				if ((c/n)%1==0) {
					c/=n;
					l.push(n);
					if (c==1) break;
					else n=1;
				}
				else if (c/n<2) n=c-1;
			}
			return l;
		}
	};
	base.factorize=x=>factorize(x);

	let combin=(rn,rr)=>{
		let n=parseInt(rn),r=parseInt(rr);
		if ((n<0)||isNaN(n)||(r<0)||isNaN(r)||(n<r)) return NaN;
		var y=1;
		for (var m=1;m<=r;m++) y*=(n-r+m)/m;
		return Math.round(y);
	};
	base.combin=(n,r)=>combin(n,r);

	let permut=(rn,rr)=>{
		let n=parseInt(rn),r=parseInt(rr);
		if ((n<0)||isNaN(n)||(r<0)||isNaN(r)||(n<r)) return NaN;
		var y=1;
		for (var m=1;m<=r;m++) y*=(n-r+m);
		return y;
	};
	base.permut=(n,r)=>permut(n,r);

	let multinomial=args=>{
		let a=Array.from(args).map(v=>parseInt(v)).filter(v=>(!isNaN(v))&&(v>=0));
		var s=a.reduce((p,c)=>p+c,0);
		var y=1;
		a.forEach(r=>{
			if (s>r) for (var m=r;m>0;m--,s--) y*=s/m;
		});
		return Math.round(y);
	};
	base.multinomial=(...args)=>multinomial(args);

	let fact=a=>{
		let x=parseInt(a);
		if (isNaN(x)||(x<0)) return NaN;
		var y=1;
		for (var n=x;n>0;n--) y*=n;
		return y;
	};
	base.fact=x=>fact(x);

	let semifact=a=>{
		let x=parseInt(a);
		if (isNaN(x)||(x<0)) return NaN;
		var y=1;
		for (var n=x;n>0;n-=2) y*=n;
		return y;
	};
	base.semifact=x=>semifact(x);

	/* C. Lanczos's approximation */
	let lgamma=(()=>{
		let c=[],N=150,cv=log(2*PI)/2;
		let pr=(a1,a2)=>{
			let a=[];
			for (var n=0;n<(a1.length+a2.length-1);n++) a[n]=0;
			for (var n=0;n<a1.length;n++) for (var m=0;m<a2.length;m++) a[n+m]+=a1[n]*a2[m];
			return a;
		};
		let int=a=>{
			var v=0;
			for (var n=0;n<a.length;n++) v+=a[n]/(n+1);
			return v;
		};
		let setup=()=>{
			if (!c.setup) for (var n=1;n<=N;n++) {
				var a=[-1,2];
				for (var m=0;m<n;m++) a=pr(a,[m,1]);
				c[n-1]=int(a);
			}
		};

		return a=>{
			let x=gcv(a,NaN);
			if (x===NaN) return NaN;
			setup();
			var y=cn(x.real-0.5,x.image).multiply(log(x)).add(cn(-x.real+cv,-x.image));
			c.forEach((c,i)=>{
				var v=cn(c/2/(i+1));
				for (var n=0;n<=i;n++) v=v.div(cn(x.real+1+n,x.image));
				y=y.add(v);
			});
			return y;
		};
	})();
	base.lgamma=x=>lgamma(x);
	let gamma=a=>{
		let x=gcv(a,NaN);
		if (x===NaN) return NaN;
		switch (x%1) {
			case 0:
				if (x>0) return cn(fact(x-1));
				else return cn(Infinity);
			case 0.5:
				let n=x-0.5;
				var y=sqrt(PI);
				if (n>0) y*=semifact(2*n-1)/(2**n);
				if (n<0) y*=((-2)**(-n))/semifact(-2*n-1);
				return cn(y);
			default:
				if (x>0) return exp(lgamma(x));
				if (x<0) return PI/Math.sin(PI*x)/exp(lgamma(1-x));
		}
	};
	base.gamma=x=>gamma(x);

	let beta=(()=>{
		let N=1000;
		let halves=(x,y)=>{
			if ((x==0.5)&&(y==0.5)) return PI;
			var t=x,v=1;
			while (t>0.5) {
				t--;
				v*=t/(t+y);
			}
			return v*halves(y,0.5);
		};
		let f1=(x,y)=>{
			var v=(x+y)/(x*y);
			for (var n=1;n<=N;n++) v/=1+x*y/n/(x+y+n);
			return v;
		};
		let f2=(x,y)=>{
			var v=0;
			for (var n=0;n<=N;n++) {
				var sv=(-1)**n/(x+n);
				for (var m=1;m<=n;m++) sv*=(y-m)/m;
				v+=sv;
			}
			return v;
		};
		return (rx,ry)=>{
			let x=parseFloat(rx),y=parseFloat(ry);
			if (isNaN(x)||(x<=0)||isNaN(y)||(y<=0)) return NaN;
			if ((x%1==0)&&(y%1==0)) return 1/multinomial([x-1,y-1])/(x+y-1);
			else if ((x%1==0.5)&&(y%1==0.5)) halves(x,y);
			else {
				let m=max(x,y);
				if (m>=1) return f2(x,y);
				else if (m<=0.5) return f1(x,y);
				else return (-2*m+2)*f1(x,y)+(2*m-1)*f2(x,y);
			}
		};
	})();
	base.beta=(x,y)=>beta(x,y);

	let erf=(()=>{
		let N=50;
		for (var n=0;n<N;n++) ;
		return a=>{
			let x=parseFloat(a);
			if (isNaN(x)) return NaN;
			if (log10(abs(x))*(2*N+1)>=log10(Number.MAX_VALUE)) return sign(x);
			var y=0;
			for (var n=0;n<=N;n++) {
				var v=x/(2*n+1);
				for (var k=1;k<=n;k++) v*=-(x**2)/k;
				y+=v;
			}
			y*=2/sqrt(PI);
			return y;
		};
	})();
	base.erf=x=>erf(x);

	let invErf=(()=>{
		let N=50,c=[1];
		let setup=()=>{
			if (c.length==1) for (var k=1;k<=N;k++) {
				c[k]=0;
				for (var m=0;m<k;m++) c[k]+=c[m]*c[k-1-m]/(m+1)/(2*m+1);
			}
		};
		return a=>{
			let x=parseFloat(a);
			if (isNaN(x)||(x>1)||(x<-1)) return NaN;
			if (abs(x)==1) return x*Infinity;
			setup();
			var y=0;
			c.forEach((c,k)=>{y+=c/(2*k+1)*(sqrt(PI)*x/2)**(2*k+1)});
			return y;
		};
	})();
	base.invErf=x=>invErf(x);

	let lambertW=a=>{
		let x=parseFloat(a);
		if (isNaN(x)) return NaN;
		else if (x<-1/E) return NaN;
		else if (x==-1/E) return -1;
		var c=x>0?(-1+sqrt(1+4*x))/2:0,p;
		for (var n=1;n<=1000;n++) {
			p=c;
			var pt=(p*p+x/exp(p))/(p+1);
			pt=p*exp(p)-pt*exp(pt);
			if (!pt) break;
			c=p-((p*exp(p)-x)**2)/(p+1)/exp(p)/pt;
			if (abs(c/p-1)<1e-16) break;
		}
		return c;
	};
	base.lambertW=x=>lambertW(x);

	let bernoulli=a=>{
		let n=parseInt(a);
		if (isNaN(n)||n<0) return NaN;
		var b=0;
		for (var j=0;j<=n;j++) {
			var p=0;
			for (var m=j;m<=n;m++) p+=combin(m,j)/(m+1);
			b+=p*((-1)**j)*(j**n);
		}
		return b;
	};
	base.bernoulli=x=>bernoulli(x);

	/* Matrix */
	(()=>{
		let pa=args=>{
			let a=Array.from(args).map(rv=>{
				let v=parseFloat(rv);
				return isNaN(v)?0:v;
			});
			let dim=sqrt(a.length);
			if (dim%1==0) return {
				args:a,
				dim:dim
			};
			else return null;
		};
		let rm=(a,d,r,c)=>{
			return a.filter((v,i)=>{
				if ((i>=c*d)&&(i<(c+1)*d)) return false;
				else if ((i-r)%d==0) return false;
				else return true;
			});
		};
		let d=(a,dim)=>{
			if (dim==1) return a[0];
			else {
				var v=0;
				for (var r=0;r<dim;r++) v+=((-1)**r)*a[r]*d(rm(a,dim,r,0),dim-1);
				return v;
			}
		};
		let det=args=>{
			let o=pa(args);
			if (o) return d(o.args,o.dim);
			else return null;
		};
		let inverseMatrix=args=>{
			let o=pa(args);
			if (!o) return null;
			let dv=det(o.args);
			if (!dv) return null;
			let v=[];
			for (var c=0;c<o.dim;c++) for (var r=0;r<o.dim;r++) v.push((-1)**(c+r)*d(rm(o.args,o.dim,c,r),o.dim-1)/dv);
			return v;
		};
		base.det=(...matrix)=>det(matrix);
		base.inverseMatrix=(...matrix)=>inverseMatrix(matrix);
	})();

	/* Solver */
	(()=>{

		const SQRT3=sqrt(3);
		let alloc=args=>{
			var s;
			switch (args.length) {
				case 0:s=["Any"];break;
				case 1:s=args[0]==0?["Any"]:[];break;
				case 2:s=one.apply(0,args.reverse());break;
				case 3:s=two.apply(0,args.reverse());break;
				case 4:s=three.apply(0,args.reverse());break;
				case 5:s=four.apply(0,args.reverse());break;
				default:s=higher(args);break;
			}
			s.forEach(v=>{
				["x","y"].forEach(x=>v[x]=round(v[x]*1e+15)*1e-15);
			});
			return s;
		};

		let one=(a,b)=>[{x:-b/a,y:0}];
		let two=(a,b,c)=>{
			let v1=-b/(2*a);
			let v2=(b**2)/(4*a**2)-c/a;
			if (v2>0) {
				let r=Math.sqrt(v2);
				return [{x:v1+r,y:0},{x:v1-r,y:0}];
			}
			if (v2<0) {
				let r=Math.sqrt(-v2);
				return [{x:v1,y:+r},{x:v1,y:-r}];
			}
			if (v2==0) return [{x:v1,y:0}];
		};
		let three=(a,b,c,d)=>{
			let nb=b/a,nc=c/a,nd=d/a;
			var l=two(1,2*nb**3-9*nb*nc+27*nd,(nb**2-3*nc)**3);
			if (l[0].y==0) {
				l=[l[0],l[1]?l[1]:l[0]];
				l=l.map(v=>cbrt(v.x));
				return [
					{x:(-nb+l[0]+l[1])/3,y:0},
					{x:(-nb*2-l[0]-l[1])/6,y:(l[0]-l[1])*SQRT3/6},
					{x:(-nb*2-l[0]-l[1])/6,y:(l[1]-l[0])*SQRT3/6}
				];
			}
			else {
				let r=cbrt(hypot(l[0].y,l[0].x)),t=atan2(l[0].y,l[0].x)/3;
				let x=r*cos(t),y=r*sin(t);
				return [
					{x:(-nb+x*2)/3,y:0},
					{x:(-nb-x-SQRT3*y)/3,y:0},
					{x:(-nb-x+SQRT3*y)/3,y:0}
				];
			}
		};
		let four=(a,b,c,d,e)=>{
			let nb=b/a,nc=c/a,nd=d/a,ne=e/a;
			let bq=nb/4;
			let p=nc-6*bq**2,q=nd-2*nc*bq+8*bq**3,r=ne-nd*bq+nc*bq**2-3*bq**4;
			let ul=three(1,2*p,p**2-4*r,-(q**2));
			let u=ul.find(o=>o.y==0).x;
			if (!u) return [];
			let ru=u**0.5;
			return [].concat(
				two(1,+ru,(p+u-q/ru)/2),
				two(1,-ru,(p+u+q/ru)/2)
			).map(v=>{
				v.x-=bq;
				return v;
			});
		};
		let higher=a=>{
			let s=[];
			let da=differ(a);
			let dda=differ(da);
			let evx=alloc(da).filter(o=>o.y==0).map(o=>o.x).sort((a,b)=>a-b);
			var aveStep=0;
			if (evx.length>1) for (var n=0;n<(evx.length-1);n++) aveStep+=(evx[n+1]-evx[n])/(evx.length-1)/4;
			else aveStep=1;
			if (!evx.length) {
				let rav=assign(0,a),sl=assign(0,da);
				if (rav*sl>0) findBorder(0,a,da,dda,-aveStep,s);
				if (rav*sl<0) findBorder(0,a,da,dda,+aveStep,s);
			}
			let f=evx[0],l=evx[evx.length-1];
			evx.forEach(x=>{if (assign(x,a)==0) s.push({x:x,y:0});});
			if (assign(f-aveStep,da)*assign(f,a)>0) findBorder(f,a,da,dda,-aveStep,s);
			if (assign(l+aveStep,da)*assign(l,a)<0) findBorder(l,a,da,dda,+aveStep,s);
			for (var n=0;n<(evx.length-1);n++) {
				let ls=assign(evx[n],a),rs=assign(evx[n+1],a);
				if (ls*rs<0) {
					let v=approx((evx[n]+evx[n+1])/2,a,da,dda);
					if (v!=null) s.push({x:v,y:0});
				}
			}
			if ((a.length-1-s.length)<5) {
				var qa=a,big=false;
				s.forEach(v=>{
					let qr=div(a,[-v.x,1]);
					big=big||abs(qr.remainder[0]/v.x)>=1e-10;
					qa=qr.quotient;
				});
				if (!big) s.push.apply(s,alloc(qa));
			}
			return s;
		};

		let differ=args=>{
			let a=args.map((v,i)=>v*i);
			a.shift();
			return a;
		};
		let assign=(x,a)=>{
			var v=0;
			a.forEach((c,i)=>v+=c*(x**i));
			return v;
		};
		let findBorder=(val,a,da,dda,st,s)=>{
			let rav=assign(v,a);
			var v=val;
			for (;assign(v,a)*rav<0;v+=st);
			v=approx(v-st/2,a,da,dda);
			if (v!=null) s.push({x:v,y:0});
		};
		let approx=(x,f0,f1,f2)=>{
			var c=x,p;
			var n=0;
			do {
				p=c;
				let p0=assign(p,f0),p1=assign(p,f1),p2=assign(p,f2);
				let v=[2*p0*p1,2*p1*p1-p0*p2];
				if (v[0]==0) return p;
				else if (v[1]==0) return null;
				c=p-v[0]/v[1];
				if (!isFinite(c)) return p;
				if (n>100) return c;
				n++;
			} while (abs(p-c)>=1e-16);
			return c;
		};
		let divide=(f,b)=>{
			let o=div(parseArg(f),parseArg(b));
			o.quotient=o.quotient.reverse();
			o.remainder=o.remainder.reverse();
			return o;
		};
		let div=(f,b)=>{
			if (b.length>f.length) return {
				quotient:[0],
				remainder:Array.from(f)
			};
			else {
				let r=Array.from(f),q=[];
				for (var n=r.length-b.length;n>=0;n--) {
					let d=r[n+b.length-1]/b[b.length-1];
					q.unshift(d);
					b.forEach((v,i)=>r[n+i]-=v*d);
				}
				while (r[r.length-1]==0) r.pop();
				if (r.length==0) r.push(0);
				return {
					quotient:q,
					remainder:r
				};
			}
		};

		let parseArg=args=>{
			let a=Array.from(args).reverse();
			while (a[a.length-1]==0) a.pop();
			return a;
		};
		let assignValue=(x,args)=>assign(x,parseArg(args));
		let solve=args=>{
			let s=alloc(parseArg(args));
			return s.filter(v=>v.y==0).map(v=>v.x).sort((a,b)=>a-b);
		};
		let solveWithOption=args=>{
			var a=Array.from(args);
			var o=a.pop();
			a=parseArg(a);
			if (!o) o={imaginal:false};
			let s=alloc(a);
			if (o.imaginal) return s.map(v=>cn(v.x,v.y));
			else return s.filter(v=>v.y==0).map(v=>v.x);
		};

		base.assignValue=(x,...args)=>assignValue(x,args);
		base.divide=(from,by)=>divide(from,by);
		base.solve=(...args)=>solve(args);
		base.solveWithOption=(...args)=>solveWithOption(args);

	})();

	/* Scientific constants */
	(()=>{
		let ct=(()=>{
			let h={
				get:(t,k)=>{
					switch (k) {
						case Symbol.toStringTag:return "Constant";
						case "constructor":return Number;
						default:return t[k];
					}
				}
			};
			return (n,v,u,p)=>{
				let valueOf=()=>v;
				let toString=()=>`${v.toExponential(p)} ${u} (${n})`;
				return new Proxy({
					name:n,
					value:v,
					unit:u,
					valueOf:()=>valueOf(),
					toString:()=>toString()
				},h);
			};
		})();
		base.Gravity=ct("Gravitational acceleration",9.80665,"㎨",5);
		base.Atmosphere=ct("Standard atmosphere",101325,"㎩",5);
		base.Celsius=ct("0 ℃",273.15,"K",4);
		base.LightSpeed=ct("Speed of light",299792458,"㎧",9);
		base.Charge=ct("Elementary charge",1.602176634e-19,"C",9);
		base.Planck=ct("Planck constant",6.62607015e-34,"J∙s",8);
		base.Dirac=ct("Dirac constant",1.0545718176462e-34,"J∙s",13);
		base.Avogadro=ct("Avogadro constant",6.02214076e+23,"/㏖",8);
		base.Boltzmann=ct("Boltzmann constant",1.380649e-23,"J/K",6);
		base.Faraday=ct("Faraday constant",96485.33212331,"C/㏖",12);
		base.Gas=ct("Gas constant",8.3144626181532,"J/(㏖∙K)",13);
		base.Volume=ct("Molar volume of a gas",22.71095464e-3,"㎥/㏖",9);
		base.Gravitation=ct("Gravitational constant",6.67430e-11,"N∙m²/㎏²",5);
		base.Permittivity=ct("Permittivity of vacuum",8.8541878128e-12,"F/m",10);
		base.Permeability=ct("Permeability of vacuum",1.25663706212e-6,"H/m",11);
		base.Rydberg=ct("Rydberg constant",10973731.568160,"/m",13);
	})();

})();