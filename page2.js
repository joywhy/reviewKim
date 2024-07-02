const DATA = {
    isLogged:false,
    my:{},
    keyword: ["하남데이트","하남카페", "카페창업","하남가볼만한곳","커피머신기"]
}

Object.assign(self,{
    //main button 컴포넌트
    comp_mainBtn(_){
    const $ = html `<button class="ℓ mainBtn"></button>`;
    const $$ = ℓ($);
    const apply = ( {text, width= '100%', height= '100%', style = {}, onclick}) => { 
        update($$, {innerText: text, style: {...style, width, height}, onclick})
    } 
     return comp(_,$,apply);
    },
    //header 컴포넌트 
    comp_header(_){
    const $ = html`<header><div class=container><h1><a href=/ class=logo><img src=img/logo_kor_reviewKim.svg alt=리뷰킴> <img src=img/logo_en_reviewKim.svg alt=reviewkim></a></h1> <> </header>`;
    const $$ = ℓ($, comp_rightHeader)
    const apply = () => { 
         update($$)
        } 
     return comp(_, $, apply);
    },
    //right header 컴포넌트
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
                //로그인 버튼
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
                        //modalbackground
                        {onclick(){
                            isModal=false;
                            apply(); 
                        }},
                        //close btn
                        {onclick(){
                            isModal=false;
                            apply(); 
                        }},
                        //소셜 로그인 naver
                        {onclick(){login('naver')}},
                        //소셜 로그인 google
                        {onclick(){login('google')}}
                        ); 
                        return {$start, $end};
                    }
                })
            ); 
            return () => {
                update($$, {
                    text: '로그인',
                    width: '100px',
                    onclick(){
                        isModal = true;
                        apply();
                    },
                }, isModal)
                return {$start, $end: $$[1].$end};
            } 
        }),
        //로그인시  comp_rightheader 
        cond(
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
    },
    //card 형태의 right section
    comp_card(_){
     const $ = html`<section class="card">card</section>`;
     const apply = ( ) => {  } 
     return comp(_,$,apply);
    },
    //recruit section
    comp_recruit(_){
    const $  = html`<section class="recruit"><><></section>`;
    const $$ = ℓ($,
        comp_recruit_header,
        loop(
         html`<span class ="tag ℓ"></span>`,
        $ => {
        const $$ = ℓ($);
        return (item, i, {$start, $end}) => { 
          
        update($$,{innerText:`#${item}`});
        return {$start, $end, i};
       }
      },
    ));


    const apply = ( ) => {
        update($$,{},DATA.keyword);
      } 
    return comp(_,$,apply);
    },
    comp_recruit_header(_){
        const $  = html`<header><div class="buttonList"><><></div><h1>[경기 / 하남] 마이 논알콜 하이볼 리스트</h1><div class="des">3가지 논알콜 하이볼 시연 및 시음</div></header>`;
        const $$ = ℓ($,
            comp_mainBtn,
            comp_mainBtn,
        );
        const apply = ()=>{
        update($$,{
            text: 'B',
            width: '30px',
            height:'27px',
            style:{display: "flex","justify-content": "center","align-items": "center"},
            onclick(){},
        },
        {
            text: '방문형',
            width: '60px',
            height:'27px',
            style:{"background-color":`var(--color-gray-10)`,  "font-size": "13px",color:`var(--color-gray-70)`,display: "flex","justify-content": "center","align-items": "center","margin-left":'5px'},
            onclick(){},
        },
    );

        }
        return comp(_,$,apply);
    }

});


const PAGE = {
''(){
 const $= html`<><main class="container"><><></main>`;
 const $$ = ℓ($,
 comp_header,
 comp_card,
 comp_recruit
 );

 (self.apply = () => {
    update($$);
 })();
 return $;
}


}