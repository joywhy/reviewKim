const DATA = {
    isLogged:false,
    my:{}
}

Object.assign(self,{
    comp_header(_){
        const $ = html`<header><div class=container><h1><a href=/ class=logo><img src=img/logo_kor_reviewKim.svg alt=리뷰킴> <img src=img/logo_en_reviewKim.svg alt=reviewkim></a></h1> <> </header>`;
        const $$ = ℓ($, comp_rightHeader)
        const apply = () => { 
            update($$)
        } 
        return comp(_, $, apply);
    },
    comp_mainBtn(_){
    let text, width, height, onclick;  // 전역함수로 선언될수 있기때문에  apply로 받아오는 변수를 컴포넌트내부에 꼭 선언할것
    const $ = html `<button class="ℓ mainBtn"></button>`;
    const $$ = ℓ($);
    const apply = (attr = {text, width, height, onclick}) => { 
        ({text, width = '100%', height = '100%', onclick} = attr); 
        update($$, {innerText: text, style: {width, height}, onclick})
    } 

    return comp(_,$,apply);
    },
    comp_rightHeader(_){
      let isModal=false;
      const $ = html`<div class="rightSide center"><><></div>`;
      const $$ = ℓ($,
        //비로그인시  comp_rightheader 
        cond(
        html`<span>비즈니스 문의</span><><>`, 
        $ => {
            const {firstChild: $start} = $;
            const $$ = ℓ($,
                comp_mainBtn, 
                //로그인 버튼 클릭시 모달창
                cond(
                html`<div class="modalWrap ℓ"></div><article id=login><button class=" close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg>   <button id="naver-oauth" class="ℓ"><img src="${IMG_DIR}/naverloginbutton.svg" alt="네이버로그인"></button><button id="google-oauth" class="ℓ"><img src="${IMG_DIR}/googleloginbutton.svg" alt="구글로그인"></button> </article>`, 

                $ => {
                    const {firstChild: $start, lastChild: $end} = $;
                    const $$ = ℓ($);
                    async function login(type){
                        removeEventListener('await login', loginHander);
                        (await import(`https:seu.ai/login/${type}.js`)).default((await req('key')).key);
                        addEventListener('await login', loginHander, {once: true});
                      }
                      function loginHander({detail: {my, token}}){
                        isModal=false;
                        cookie.my = token;
                        DATA.my = my;
                        DATA.isLogged = true;
                        self.apply();
                      }

                    return () => {
                        update($$, 
                        {onclick(){
                            isModal=false;
                            apply(); 
                        
                        }},
                        {onclick(){
                            isModal=false;
                            apply(); 
                       
                        }},
                        {onclick(){login('naver')}},
                        {onclick(){login('google')}}
                        ); 
                        return {$start, $end};
                    }
                })
            ); 
            return () => {
                console.log($$);
                // console.trace($$, isModal);
                update($$, {
                    text: '로그인',
                    width: '100px',
                    onclick(){
                        isModal = true;
                        // console.log("동작 1");
                        apply();
                    },
                }, isModal)
                return {$start, $end: $$[1].$end};
            } 
        }),
        //로그인시  comp_rightheader 
        cond(
            // html`<a href=/my><img src=${IMG_DIR}/user.svg>ㅇㄹㅇㄹ</a><a href=?logout>로그아웃</a>`, 
            html`<a href=/my><img src=${IMG_DIR}/user.svg><span class=ℓ></span></a><a href=?logout>로그아웃</a>`, 
            $ => {
                const {firstChild: $start, lastChild: $end} = $;
                const $$ = ℓ($);
                return () => {
                    update($$,{innerText:`${DATA.my.nick}님`});
                    return {$start, $end};
                }
            }),
    );
    const apply = () => {
        update($$,!DATA.isLogged, DATA.isLogged)
     };

    return comp(_, $, apply);
    }

});


const PAGE = {
''(){
 const $= html`<><div class="container"></div>`;
 const $$ = ℓ($,
 comp_header 
 );

 (self.apply = () => {
    update($$);
 })();
 return $;
}


}