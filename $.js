const {assign, keys} = Object
const TPL_MAP = new Map;

assign(self, {
	tpl(text, tpl){
		//TPL_MAP 에 text 있다면 그 템플릿의 클론을 반환
		if(TPL_MAP.has(text)) return TPL_MAP.get(text).cloneNode(true) 
			  // 그렇지 않다면, 새로운 템플릿을 생성하고 TPL_MAP에 캐시한 후, 그 내용(content)을 반환
		TPL_MAP.set(
			text,
			tpl = assign(document.createElement("template"), {innerHTML: text}).content //DocumentFragment 객체를 반환 
		);
		return tpl;
	},

	frag: text => text.replaceAll('<>', '<l></l>'), //<>hello</> -> <l>hello</l>  반환   text 는 어떤식으로 들어오는가
	//text 와 val 은 어떤식으로 들어오는가
	
	/*
	html`test`;
	*/

	svg(text, ...val){
		const tpl = tpl(`<svg>${frag(String.raw({raw: text}, ...val))}`.cloneNode(true)); // SVG 요소에 대한 템플릿 생성
		tpl.replaceChildren(...tpl.firstChild.childNodes);// 템플릿의 자식을 첫 번째 자식의 자식들로 대체
		return tpl;
	},
	html: (text, ...val) => tpl(frag(String.raw({raw: text}, ...val))).cloneNode(true), // HTML 템플릿을 생성하고 클론을 반환
	//$$ [text, text, text, p.ℓ, p.ℓ, a.mainBtn.ℓ, span.ℓ, button.ℓ, span.ℓ, button.ℓ, text, text]
    //attrList `이은희님`
	update($$, ...attrList){
		console.log($$);
		return $$.map(($, i) => {
			//블럭단위로 객체화 되어 있는 상태
			if('apply' in $){
				const isPush = 'isPush' in $;
				if(isPush) $.isPush = false;
				$ = $.apply(attrList[i]) ?? $;
				if(isPush) $.isPush = true;
			}
			if(!($ instanceof Node)) return $;
			/*
			if(classList){
				$.classList = classFormat(classList);
			}else{
				$.removeAttribute('class');
			}
			*/
			try{
				const prop = attrList[i];
			
				keys(prop).forEach(k => {
					// console.log(k);//함수일경우 함수명이 key-> onclick
					if(typeof prop[k] == 'object'){
                         /*
						 태그 인라인스타일 적용
						 예시 {style:['font-size': '1px', color:'black',display: isNone ? 'none' : null]} 
						 -> <span style="font-size: 1px; color: black "></span>
						 */
						if(k == 'style'){
							const style = prop[k];//style=['font-size': '1px', color:'black']
							keys(style).forEach(styleKey => {//styleKey = ['font-size',  color]  
								//특정 스타일을 기본값으로 초기화 할 경우 
								if(style[styleKey] == null){
									$.style.removeProperty(styleKey)
								}else{
									//인라인 스타일 적용
									$.style.setProperty(styleKey, style[styleKey]);
								}
							});
							return;
						}
					     //태크 데이터속성 정의{dataset :{abc:1}} -> <tag data-abc="1">
						if(k == 'dataset'){
							keys(prop[k]).forEach(key => {
								if(prop[k][key] == null){
									delete prop[k][key];
									delete $.dataset[key];
								}
							})
							assign($.dataset, prop[k])
						}
					}
					//변경점이 없었을 때 
					if(($.getAttribute?.(k) || $[k]) === prop[k]) return;
					// 속성과 프로퍼티에 대한 명칭이 다른기 때문에 제대로 가져오지 않았기 때문 
					/*
					ariaPressed

					<span class="mainBtn">B</span>
					document.querySelector('span').ariaPressed = true
					true 
					document.querySelector('span')
					<span class ="mainBtn" aria-pressed="true">B</span>
					document.querySelector('span').getAttribute('ariaPressed')
					null
					document.querySelector('span').getAttribute('aria-pressed')
					true
					*/

					/*
					속성 삭제
			        {src : null}
					<img src='null'> x
					<img> o
					*/
					if(prop[k] == null){
						delete $[k];
						$.removeAttribute(k);
					}else{
						$[k] = prop[k];
					}
				});
			}catch{
				console.error($$, $, i)
			}
		});
	},
	comp($, $new, apply){ //new Text html`<span class=ℓ>`  apply
		const {firstChild :$start, lastChild :$end} = $new;
		$.replaceWith($new);
		return {apply, $start, $end};
	},
	getPage(path = location.pathname.slice(1)){
		path = path.split('/');
		while(path){
			const url = path.join('/');
			if(url in PAGE) return PAGE[url];
			path.pop()
		}
		return PAGE[''];
	},
	render(layer = getPage(), $ = document.body){
		$.textContent = '';
		// UPDATE_SET
		$.append(layer(DATA, $ instanceof SVGElement));
		onconnect($);
	},
	startTime: 1703*1.e+9, //1703*1.e+9,
	uid: () => (new Date - startTime).toString(36),
	ℓ: ($p, ...applyList) =>  {
	/*	
	ℓ함수(레이어 함수) 역할 
	:기존 html($p)에 변경여지가 있는 부분(<> .ℓ)을 $$로 부분 추출한다.
    변경부분($$)을 순회하며 applyList에 있는 교체한 요소를 삽입후 반환
	
	매개변수 정보
	$p = parent 부모(변경하려는 html) 
    applyList = $p 에서 <>에 변경될 플래그맨트들이 순서대로 정렬된 배열. 배열요소로 cond(), loop() 등이 들어온다.

	(주의)$p는 이전 $.js 에 frag 함수로 인해 <> 가 <l></l> 자동 변환되어 들어옴.
	*/

	/*
	변경여지가 있는 부분(<> .ℓ)을  정적 NodeList로 부분 추출
	
	태그 이름이 l 이거나 클래스 이름이 ℓ 인 경우 부분추출한다. 
    (주의) $p.id  는 흔히 하는 html 의 id 가  아니며 추후 개발될 부분으로 설명 생략함 
	*/
	const $$ = [...$p.querySelectorAll(`l, .ℓ${$p.id ?? ''}`)];

		$$.forEach(($, i) => {
			if($.localName == 'l'){	// <l></l> 경우
				$.replaceWith($ = new Text);  // <l></l> -> new Text 교체
				//$$[i] = comp_timer($ = new Text)
				$$[i] = applyList.shift()?.($) ?? $;

				// console.log(applyList.shift()?.($));
				//$$[i] = comp(_, $, apply);
				//$$[i] = {html`<span class=ℓ>`  apply}
			}
		})
		return $$;
	},
	getBlock($, $end){
		const $$ = [$];
		while(true){
			if(!$.nextSibling || !$end || $ == $end) return $$; // || !$end
			if($ = $.nextSibling) $$.push($);
		}
	},
	remove: ({$start, $end}) => getBlock($start, $end).forEach($ => $.remove()),
	blockRemove(block){
		const $ = new Text;
		block.$end.after($);
		remove(block);
		assign(block, {$start: $, $end: $})
	},
	setBind($, fn, item, i){
		$ = $.cloneNode(true);
		return {$, apply: fn($, item, i), $start: $.firstChild, $end: $.lastChild}
	},
	//UI 프레임워크

	/*
	$frag
	=
	  html`<a href=/my>
      <img src=${IMG_DIR}/user.svg>
      <span class=ℓ></span>
      </a>
      <a href=?logout>로그아웃</a>`
    fn

    $ => {
    const {firstChild: $start, lastChild: $end} = $;
    console.log($start); //header
    console.log($end); //footer
    // console.log("----------");
    const $$ = ℓ($,);
    
    return () => {
    update($$,
    {innerText:`${DATA.my.nick}님`}
    );


    return {$start, $end};
   }
    }

	*/

	//		$$[i] = applyList.shift()?.($) ?? $;

	/*
$ => { 
	

		console.log($);
		return {
			is: false,
			$start: $,
			$end: $,
			apply(is){ //apply 함수에서 실행
				//is 가 변경된 경우
				if(this.is != (this.is = !!is)){
					//is  true 
					if(is){
						const {$, apply, $start, $end} = setBind($frag, fn);
						this.$start.before($);
						this.$start.remove();
						assign(this, {$start, $end}, (this.blockApply = apply)?.())
					}else{
						//is  false
						blockRemove(this);
						this.blockApply = null;
					}
				}else if(is){
					assign(this, this.blockApply?.());
				}
			}
		}
	},
	
	
	*/

	
	cond: ($frag, fn) => $ => { 
		/*
	   cond 함수  역할 

	   : 조건이 맞으면 DOM 요소를 반환, 조건이 맞지않으면 DOM 요소를 지우는 함수를 반환한다.
		*/

		// console.log($);
		return {
			is: false,
			$start: $,
			$end: $,
			apply(is){ //apply 함수에서 실행
				// console.trace();
				//is 가 변경된 경우
				if(this.is != (this.is = !!is)){
					//is  true 
					if(is){
						const {$, apply, $start, $end} = setBind($frag, fn);
						this.$start.before($);
						this.$start.remove();
						assign(this, {$start, $end}, (this.blockApply = apply)?.())
					}else{
						//is  false
						blockRemove(this);
						this.blockApply = null;
					}
				}else if(is){
					assign(this, this.blockApply?.());
				}
			}
		}
	},
	//리스트 순회하면서  DOM 요소 삽입 업데이트
	loop: ($frag, fn) => $ => ({
		$start: $,
		$end: $,
		apply(list, len){
			const map = this.map;
			const newMap = new Map;
			if(len){
				list = [...Array(len)];
			}else{
				len = list?.length;
			}
			if(!len){
				blockRemove(this);
				this.map = null
				return;
			}

			const lastIndex = len - 1;
			let $start = this.$start;;
			let add = $start.before.bind($start);
			list.forEach((item, i) => {
				const key = item && typeof item == 'object' ? item.id ?? item : i;
				let block = map?.get(key);
				if(block){
					if($start != block.$start){
						add(...getBlock(block.$start, block.$end));
					}
					newMap.set(key, assign(block, block.apply(item, i, block)));
				}else{
					const {$, $start, $end, apply} = setBind($frag, fn, item, i)
					newMap.set(key, block = {...apply(item, i, {$start, $end}), apply})
					add($);
				}
				if(i == 0) this.$start = block.$start;

				if(i == lastIndex){
					this.$end = block.$end;
				}else{
					$start = block.$end;
					add = $start.after.bind($start);
					$start = $start.nextSibling;
				}
			});

			if(map) map.forEach((block, key) => {
				if(!newMap.has(key)) remove(block);
			});
			this.map = newMap;
		}
	}),
	getIsSVG: $ => $.parentNode instanceof SVGElement,

	setListener(e, $){
    if(e == 'connect'){
			addEventListener(e, $.onconnect.bind($), {once: true, passive: true});
			delete $.onconnect;
    }else{
			$.addEventListener(e, $['on' + e]);
    }
	},
	onconnect($){
		if($.isConnected && $.onconnect) setListener('connect', $);

		const w = document.createTreeWalker(
				$,
				NodeFilter.SHOW_ELEMENT,
				e => 'onconnect' in e && e.isConnected ?
				NodeFilter.FILTER_ACCEPT
				:
				NodeFilter.FILTER_SKIP
		);
		while($ = w.nextNode()) setListener('connect', $);

		dispatchEvent(new CustomEvent('connect'));
	}
})


