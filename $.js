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
		// console.log(tpl);
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
		return $$.map(($, i) => {
			//$ 에 apply 가 있다면 
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
			const prop = attrList[i];
			keys(prop).forEach(k => {
				if(typeof prop[k] == 'object'){
					if(k == 'style'){
						const style = prop[k];
						keys(style).forEach(k => {
							if(style[k] == null){
								$.style.removeProperty(k)
							}else{
								$.style.setProperty(k, style[k]);
							}
						});
						return;
					}

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

				if(($.getAttribute?.(k) || $[k]) === prop[k]) return;

				if(prop[k] == null){
					delete $[k];
					$.removeAttribute(k);
				}else{
					$[k] = prop[k];
				}
			});
		});
	},
	comp($, $new, apply){
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
	/* 
	$p = html`
	<div>hello
	<p class=ℓ></p>
	</div>`; 
	*/
	ℓ: ($p, ...applyList) =>  {
		//태그 이름이 l 클래스 
		//id가 example이라면, 클래스 이름이 ℓexample
		/*
		이건 왜 동작하는지 
		<button id ="naver-oauth" class="ℓ">
		네이버 로그인
		</button>
		*/
		//id가 정의되지 않았다면, 클래스 이름이 ℓ 
		//NodeList
		const $$ = [...$p.querySelectorAll(`l, .ℓ${$p.id ?? ''}`)];
		// console.log($$);
		$$.forEach(($, i) => {
			//요소의 로컬이름이 l 인경우 <l></l>
			if($.localName == 'l'){
				// 선택된 부모 노드가 가지고 있는 노드를 새로운 텍스트 노드로 교체
				$.replaceWith($ = new Text); 
				//applyList 없으면 그대로 텍스트 노드로 
				
				$$[i] = applyList.shift()?.($) ?? $;
				// console.log($$[i]);
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
	cond: ($frag, fn) => $ => { // $?
		// console.log($);
		return {
			is: false,
			$start: $,
			$end: $,
			apply(is){
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


