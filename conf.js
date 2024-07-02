document.title = '리뷰킴';

const {isArray} = Array;
const {now} = Date;

Object.defineProperties(self, {
	// INIT_MAP: {value: new Map},
	// COMP_MAP: {value: new Map},
	DIR: {value: location.protocol == 'https:' ? '' : '.'},
  COMP_DIR: {get(){return `${DIR}/comp`}},
	IMG_DIR: {get(){return `${DIR}/img`}}, //https ->  /img   아니면 ./img
	DB_HOST: {value: 'db.review.kim'},  
	DELAY_LIST: {value: new Map},
})

Object.defineProperty(Array.prototype, 'remove', {
	value(o){
		const i = this.indexOf(o); //배열안에 o 에 대한 인덱스 
		if(i >= 0) this.splice(i, 1); //그 배열안에 값이 들어 있으면  그 요소 삭제  
    //? filter를 쓰지 않은 이유  한개만 삭제?->새로운 배열로 만들기 때문에 

    //const isSearch =false;
    // [].filter((el,idx,arr)=>{  
    //   if(el ===o && !isSearch){ 
    //    isSearch=true;
    //    return ;
    //   }
    //   return el;
    //   })
	}
});

Object.defineProperty(RadioNodeList.prototype, 'value', {   //좀더 분석
	get(){
		let value = [];
		this.forEach($ => { 
			if($.type == 'radio'){ //? $.type은 어디를 가리키는 지 단일선택
				if($.checked) value = $.value;
				return;
			}

			if($.type == 'checkbox' && !$.checked) return;
			value.push($.value); 
		});
    return value;
	},
	set(value){
    const isArr = isArray(value);
		this.forEach(($, i) => {
			if(isArr){  //중첩 if 문을 쓴이유   
				if($.type == 'checkbox'){
					$.checked = value.includes($.value);
				}else{
          //value가  배열이고 $.type 이 체크박스가 아닌경우  
					$.value = value[i];
				}
				return;
			}
      $.checked = value == $.value;
		});
	}
})

//v , u 어떻게 들어가는 지 
// v='y-m-d(w) h:i:s'  문자열 
// u  

Object.defineProperty(Date.prototype, 'format', {
  enumerable : false, 
  value(v, arg2 = ['지금막','분 전','시간 전','일 전']){ //객체의 속성 열거 시 비노출
  let [W,w,Y,m,d,h,i,s] = [
      ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][this.getDay()],//0-6
      ['일', '월', '화', '수', '목', '금', '토'][this.getDay()],
      this.getFullYear(),
      (this.getMonth() + 1),
      this.getDate(),
      this.getHours(),
      this.getMinutes(),
      this.getSeconds()
  ],
 
  date = {
      W,w,Y,m,d,h,i,s,
      y: Y.toString().substr(-2), //2024 ->24
      M: m.toString().padStart(2, 0),  //9->09   12->12
      D: d.toString().padStart(2, 0),   //1 ->01 
      H: h.toString().padStart(2, 0),  
      I: i.toString().padStart(2, 0),
      S: s.toString().padStart(2, 0)
  }


  v = v.replace(/(W|Y|m|d|h|i|s|M|D|H|I|S)/gi, $1 => (date[$1] || $1));
  // console.log(v );//6.25
  
  let diff =(new Date().getTime() - this.getTime())/1000, //밀리초단위 ->초
      day_diff =Math.floor(diff/86400); //날짜차이 


  if(arg2){
      return (
        //day_diff 는 0이하 일경우
          day_diff <= 0 && (
            //diff가 60보다 작으면 arg2[0]을 반환
              diff < 60 && arg2[0] ||
              //diff가 3600(1시간)보다 작으면 Math.floor(diff/60) + arg2[1]를 반환 -> diff를 분 단위로 변환하여 내림
              diff < 3600 && Math.floor(diff/60) + arg2[1] ||
              diff < 86400 && Math.floor(diff/3600) + arg2[2] //시간단위로 반환
          )
          || day_diff < 7 && day_diff + arg2[3] //모든 조건이 false이고, day_diff가 7보다 작으면
          || day_diff >= 7 && v //모든 조건이 false이고, day_diff가 7 이상이면 v를 반환
      )
  }
  return v;
}});
// 밀리초 ms 3000 남은 시간을 일,시간,분 , 초 형식으로 변환 
function remainTime(ms){
    if(0 < ms) {

      const d = Math.floor(ms / (1000*60*60*24)); //날짜 
      const h = Math.floor((ms / (1000*60*60)) % 24); //시간 
      const i = Math.floor((ms / (1000*60)) % 60);
      const s = Math.floor(ms / 1000 % 60);

      return `${d}일 ${h.toString().padStart(2, 0)}:${i.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
  } else {
      return 0;
  }
}
self.raf = requestAnimationFrame;

//디바운싱
function delay(_, $){
  /*
    _ = ms or 이벤트이름 
    $ 요소 or 디바운스 고유이름

    await delay(1000) // 1초 대기후 동작
    1. await delay('load') // _가 문자열일경우 이벤트로 동작
    2. awiit delay('load', $img);
    
    const clickDebounce = debounce(1000);
    onclick = () => clickDebounce(() => {
      console.log('b');  
    })

    -> onclick = () => { try{
      await delay(1000, 'a');
      console.log('b');
    }catch{} };
  */
 
  const ac = new AbortController;
  const isDebounce = typeof $ == 'string';  //$ === $img ->false  , $ ==='a' -> true
  const id = isDebounce ? $ : `await ${await_i++}`; //await_i 위치  182 
  
  //$=== 'a'-> 'a' ,  $ ===$img -> await 1


  //커스텀 이벤트를 선언해줘야 함


  //onabort 이벤트 핸들러 설정
  ac.signal.onabort = () => {
    cancelDelay[typeof ac._](ac._); //188줄  _ 는 3000초 일수도 'load' 일수도 
    //_ 3000초 -> clearTimeout(3000)
    //_ 'load' -> cancelAnimationFrame(_)  //애니메이션 프레임 요청
    DELAY_LIST.delete(id);  //DELAY_LIST 해당 아이디 값을 
    ac.rej('delay abort');
  }

  if(isDebounce) DELAY_LIST.get(id)?.abort();
  DELAY_LIST.set(id, ac);

  return new Promise((res, rej) => {
    let __;
    if(_ == null){
      __ = String(raf(res));
    }else if(typeof _ == 'number'){
      __ = setTimeout(() => res(), _);
    }else{
      ($ || self).addEventListener(_, e => {
        DELAY_LIST.delete(id);
        res(e);
      }, {passive: true, once: true});
      __ = () => ($ || self).removeEventListener(_, res);
    } 
    assign(ac, {_: __, rej})
  });
};
//웹소켓 및 데이터 처리 
Object.assign(self, {
  // compLoad(...nameList){
  //   return nameList.map(async name => {
  //         self[`comp_${name}`] = new Function('_', 'apply', `const push = typeof this == 'function' ? attr => {
  //            c.isPush = false;
  //            this(attr);
  //            c.isPush = true
  //         } : null;${await (await fetch(`${self.COMP_DIR || '.'}/${name}.js`)).text()};\nc = comp(_, $, apply);c.isPush = !!push;return c;`);
  //   });
  // },
  await_i: 1,
  res(i, data){ //어떤식으로 들어오는 지 
    //type 이름이 await 1? 
    dispatchEvent(new CustomEvent(`await ${i}`, {detail: data})); //이벤트 발생
  },
  cancelDelay: {
    string: _ => cancelAnimationFrame(_),
    number: _ => clearTimeout(_),
    function: _ => _()   //함수가 들어올 경우가 있나?
  },
  async onready(){
    // await Promise.all(compLoad('user'));

    cookie.my &&= cookie.my; //cookie.my=cookie.my &&cookie.my;

    await import('https:seu.ai/brotli.js');
    const {
      compress,//? 압축
      decompress //? 압축 풀기
    } = await brotliwasm.load(); //어떤 값이 들어오게 되는 지 brotliwasm 
    assign(self, {
      enBrotli(blob){//blob?
        return compress(blob, 4096, 11) // 4096? 11?
      }, 
      deBrotli(blob){
        return new TextDecoder().decode(decompress(blob))
      },
      //서버에게 응답 명령 받는 함수
      async req(cmd, data){ //cmd, data ex
        //ws
        if(ws.readyState == ws.CLOSED) await ws.reload();
        ws.send(enBrotli(new TextEncoder().encode(`${cmd}\x1D${JSON.stringify(assign(data || {}, {await_i}))}`)));
        return (await delay(`await ${await_i++}`)).detail;
      },
      logout(){
        ws.close();
        delete cookie.my;
        DATA.my = {};
      }
    })
    assign(self.ws = {}, {
      url: `wss:${DB_HOST}`,
      async reload(){
        assign(self.ws = new WebSocket(this.url), {
          reload: this.reload,
          onerror: this.onerror,
          onmessage: this.onmessage,
          onclose: this.onclose
        });
        await delay('open', ws);
      },
      async onerror(e){
        await this.reload();
				DATA.my = await req('login');
      },
      async onmessage({data}){
        const [i, detail] = deBrotli(new Uint8Array(await data.arrayBuffer())).split('\x1D')
        res(i, detail ? JSON.parse(detail) : {});
      },
      async onclose(e){
        await delay(1000);
        if(!ws.state){
          this.reload();
          return;
        }
        /*
        if(
          ws.state.readyState != ws.state.OPEN &&
          e.code == 1000 &&
          e.reason
        ){
          logout()
        }
        */
      }
    })

		if(!cookie.my) return;
    await ws.reload();
		DATA.my = await req('login');
  },

  cookie: new Proxy({}, {
    get(target, key) {
      return localStorage.getItem(`cookie/${key}`);
    },
    set(target, key, val){
      fetch(`//${DB_HOST}`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({[key]: val}),
      })
      localStorage.setItem(`cookie/${key}`, val);
      return true;
    },
    deleteProperty(target, key){
      fetch(`//${DB_HOST}`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({[key]: null}),
      })
      localStorage.removeItem(`cookie/${key}`);
      return true;
    }
  }),

	async onload(){
    await readyPromise;
		render();
    const {hash} = location;
    if(hash){
      location.hash = '';
      location.hash = hash;
    }
	},
  isHashChange: false,
  popupClose(){
    location.hash = '';
    history.replaceState(null, document.title, location.pathname)
    // else{
    //   history.pushState(null, document.title, href);
    // }
  },
  onhashchange(){
    isHashChange = true;
  },
	async onpopstate(){
    if(location.search.includes('exit')){
      if(confirm('탈퇴 후에는 한 달간은 재가입이 불가능합니다.')){
        alert('탈퇴가 완료되었습니다.');
        fetch(`https://api.seu.ai/exit?my=${cookie.my}`, {mode: 'no-cors'});
        logout();
        popupClose();
        apply();
        return;
      }else{
        popupClose();
      }
    }
    if(location.search.includes('logout')){
      logout();
      popupClose();
      apply();
      return;
    }
   // isHistory = true;
   try{
    await delay(250, 'popstate');
    if(isHashChange){
      isHashChange = false;
      return;
    }
    DELAY_LIST.forEach(ac => ac.abort());
    DELAY_LIST.clear();
    render();
  }catch{}
  },

	copy(text){
    const $ = assign(document.createElement('textarea'), {value: text});
    document.body.append($);
    $.select();
    document.execCommand('copy');
    $.remove();
	},
	async password(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-1',new TextEncoder('utf-8').encode(text)))].map(v => v.toString(16).padStart(2, '0')).join('')},
	cookie: new Proxy({}, {
		get(target, key) {
			return localStorage.getItem(`cookie/${key}`);
		},
		set(target, key, val){
			fetch(`//${DB_HOST}`, {
				method: 'POST',
				credentials: "include",
				body: JSON.stringify({[key]: val}),
			})
			localStorage.setItem(`cookie/${key}`, val);
			return true;
		},
		deleteProperty(target, key){
			fetch(`//${DB_HOST}`, {
				method: 'POST',
				credentials: "include",
				body: JSON.stringify({[key]: null}),
			})
			localStorage.removeItem(`cookie/${key}`);
			return true;
		}
	}),
  link(href){
    history.pushState(null, document.title, href);
    onpopstate()
  }
});
const readyPromise = self.onready?.();
history.replaceState(null, document.title, null);

document.body.addEventListener('click', e => {
	const {target :$} = e;
  const $a = $.closest('a[href]:not([target])');
	if($.closest('button:not([type="submit"])')){
		e.preventDefault();
	}
  if(!$a || $a.getAttribute('href').startsWith('#')){
		return;
  }
  e.preventDefault();

  if(!$a.href.includes(location.origin)){
    if(self.APP){
      self.APP?.blank($a.href, 'com.android.chrome');
    }else{
      open($a.href);
    }
    return;
  }
  let href = decodeURIComponent($a.href);
  
  if(location.href != href) link(href);
  $?.blur();
});
addEventListener('await count', ({detail: {pageNo, count}}) => {
  if(DATA.no == pageNo){
    DATA.count = count;
  }
});

addEventListener('await cuu', ({detail :count}) => {
  console.log(count)
})