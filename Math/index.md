## Math Library

Math Libraryは,様々な数学関数を提供するJavaScriptライブラリです。ビルトインのMathオブジェクトに含まれる関数をより使いやすくし,その上で新たな関数を実装します。

### 使い方
- ダウンロードして使う
	1. [ここをクリック](https://akimikimikimikimikimikimika.github.io/Library/Math/Math.js "Color Library")して,ライブラリをダウンロードする
	2. あなたのWebサイトにライブラリをアップロードして,HTMLに次のコードを追加する
	```HTML
	<script src="ライブラリのURL"></script>
	```

- Testerで使う  
	[Tester](https://akimikimikimikimikimikimika.github.io/Tester/ "Tester") のJavaScriptのテスト項目においては, `use("Math")` を実行すると簡単にライブラリをインポートできる。
### 機能
- JavaScriptのビルトインオブジェクトであるMathをより簡単に利用できるようにする  
	例えば, `Math.sin(x)`　は,単純に `sin(x)` でアクセス可能になる。
- ちょっとした関数から複雑な関数まで使えるように
	表計算ソフトウェアにある `combin(n,r)` のような,あると便利な関数を実装している。  
	そして,複雑な計算を行なってくれる関数も実装している。
- 科学定数の実装
	主要な科学定数に簡単にアクセスできる  
	値の単位も掲載しているので,確認にも便利

### `Math` の実装
次の関数や定数は, `Math.sin(x)` → `sin(x)` のように, `Math.` を付加せずに呼び出すことができる。  
- 三角関数,双曲線関数  
	`sin(x)`, `cos(x)`, `tan(x)`, `sinh(x)`, `cosh(x)`, `tanh(x)`, `asin(x)`, acos(x)`, `atan(x)`, `asinh(x)`, `acosh(x)`, `atanh(x)`
- 指数,対数  
	`pow(x,y)`, `exp(x)`, `expm1(x)`, `log(x)`, `log1p(x)`, `log2(x)`, `log10⒳`, `sqrt(x)`, `cbrt(x)`  
- 絶対値,偏角  
	`hypot(x…)`, `atan2(y,x)`
- 符号  
	`abs(x)`, `sign(x)`
- 整数化  
	`floor(x)`, `ceil(x)`, `trunc(x)`, `round(x)`
- 最大,最小  
	`max(x…)`, `min(x…)`
- 乱数  
	`random()`
- 定数  
	`PI`, `E`, `LN2`, `LN10`, `LOG2E`, `LOG10E`

### オリジナルの関数

- `Complex(x,y)`
	* 当ライブラリ内で使用可能な複素数オブジェクトを返す
	* 加減乗除の演算は実数部のみで実行され,通常のNumberが返される
	* 次の関数はこの複素数の入力及び出力に対応している  
		exp,log,pow,sin,cos,tan,cot,sec,csc,sinh,cosh,tanh,coth,sech,csch  
		但し,`log`は主値のみ返す
	* Complexで生成される複素数は次のプロパティを有する
		- `x`,`y` … 実部,虚部を取得,設定する
		- `r` … 絶対値を取得,設定する
		- `t` … 偏角を取得,設定する
		- `norm` … 偏角が等しい,大きさが1のベクトルを返す
		- `add(c1,c2…)` … この複素数に別の複素数 `c1`,`c2`… を足し合わせた複素数を返す
		- `multiply(c1,c2…)` … この複素数に別の複素数 `c1`,`c2`… を掛け合わせた複素数を返す

- `degree(x)`  
	弧度法で `x` の角度を度数法に変換する
- `radian(x)`  
	度数法で `x` の角度を弧度法に変換する

- `cot(x)`, `sec(x)`, `csc(x)`, `coth(x)`, `sech(x)`, `csch(x)`
	それぞれ該当する三角関数及び双曲線関数の値を返す

- `clamp(x,min,max)`  
	`x`が`min`以下の場合は`min`を返し,`x`が`max`以上の場合は`max`を返し,それ以外の場合は`x`を返す

- `sum(x1,x2,…)`  
	引数`x1,x2,…`の和を返す
- `product(x1,x2,…)`  
	引数`x1,x2,…`の積を返す

- `lcm(x1,x2,…)`  
	正整数`x1,x2,…`の最小公倍数を返す
- `gcd(x1,x2,…)`  
	正整数`x1,x2,…`の最大公約数を返す
- `factorize(x)`  
	正整数`x`の全ての素因数を返す
	```JavaScript
	factorize(600); // [2,2,2,3,5,5]
	factorize(487); // [487] (素数)
	```

- `fact(x)`  
	自然数`x`の階乗を返す
- `semifact(x)`  
	自然数`x`の二重階乗を返す
- `gamma(x)`  
	ガンマ関数 `Γ(x)` の近似値を返す
- `lgamma(x)`  
	対数ガンマ関数 `ln(Γ(x))` を返す  
	`x`は正の実数でなければならない
- `beta(x,y)`  
	ベータ関数 `Β(x,y)` の近似値を返す  
	`x`,`y` は正の実数でなければならない
- `erf(x)`  
	誤差関数 `erf(x)` を返す
- `invErf(x)`  
	誤差関数の逆関数を返す
- `lambertW(x)`  
	ランベルトのW関数 `W(x)` の近似値を返す  
	`x`は `-1/e` 以上でなければならない
- `bernoulli(x)`  
	ベルヌーイ数を返す  
	`x`は0以上の整数でなければならない


- `combin(n,r)`  
	二項係数 `n!/r!(n-r)!` を返す
- `permut(n,r)`  
	順列 `n!/(n-r)!` を返す
- `multinomial(a,b,c,…)`  
	多項係数 `(a+b+c+…)!/a!b!c!…` を返す

- `solve(a,b,…,c,d)`  
	整式からなる方程式 `axⁿ+bxⁿ⁻¹+…+cx+d=0` の実数解を返す
- `solveWithOption(a,b,…,c,d,option)`  
	`option` で指定した設定に基づき方程式の解を返す  
	`option` のパラメータ
	* `imaginal` … 解を複素数で返すかどうかを指定  
		`true` を指定すると, `{x:実部,y:虚部}` の形のオブジェクトとして解を返す  
		又,5次以下の方程式では虚数解を求めるようになる

	```JavaScript
	// 例
	solve(1,-5,6); // = [2,3] (x²-5x+6=0)

	l=solveWithOption(1,1,-7,65,{imaginal:true}); // x³+x²-7x+65=0 → -5,2±3i  
	l[0]; // {x:-5,y: 0}
	l[1]; // {x: 2,y:+3}
	l[2]; // {x: 2,y:-3}
	```

- `assignValue(x,a,b,…,c,d)`  
	整式 `axⁿ+bxⁿ⁻¹+…+cx+d` に値を代入して求める

### 科学定数
- `Gravity`  
	重力加速度 (9.80665 ㎨)
- `Atmosphere`  
	標準大気圧 (101325 ㎩)
- `Celsius`  
	0 ℃ のケルビン表現 (273.15 K)
- `LightSpeed`  
	光速 (299792458 ㎧)
- `Charge`  
	電気素量 (1.6021766208×10⁻¹⁹ C)
- `Planck`  
	プランク定数 (6.626070040×10⁻³⁴ J/s)
- `Dirac`  
	ディラック定数 (1.0545718176462×10⁻³⁴ J/s)
- `Avogadro`  
	アボガドロ定数 (6.022140857×10²³ /㏖)
- `Boltzmann`  
	ボルツマン定数 (1.38064852×10⁻²³ J/K)
- `Faraday`  
	ファラデー定数 (96485.33289 C/㏖)
- `Gas`  
	気体定数 (8.3144598 J/(㏖×K))
- `Volume`  
	標準状態での気体1モルの体積 (22.71095464×10⁻³ ㎥/㏖)
- `Gravitation`  
	万有引力定数 (6.67430×10⁻¹¹ N∙m²/㎏²)
- `Permittivity`  
	真空の誘電率 (8.8541878128×10⁻¹² F/m)
- `Permeability`  
	真空の透磁率 (1.25663706212×10⁻⁶ H/m)
- `Rydberg`  
	リュードベリ定数 (10973731.568160 /m)

### 数学定数
- `TAU`  
	正円の円周と半径の比,つまり `2π`  
	Python の math.tau と同じ
- `Euler`  
	オイラー定数 (約0.577)