const DATA = {
    isLogged:false,
    my:{},
    recruit :{
        no:1,
        title: "[인천 / 연수구] 케이슨 24 베이커리 카페",
        desc : '[2인제한] 시그니처 핸드드립 원데이 클래스',
        service :"핸드드립 원데이 클래스 + 디져트 3종 택1",
        keyword : ["디져트 맛집","인청 카페","케이슨 24"],
        
    }
}

Object.assign(self,{
    onpointerdown(){},
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
                html`<div class="modalWrap ℓ"></div><article id=login><button class=" close ℓ"></button><img class="title" src=${IMG_DIR}/logo_en_reviewKim.svg>   <button id="naver-oauth" class="ℓ"><img src="${IMG_DIR}/naverloginbutton.svg" alt="네이버로그인"></button><button id="google-oauth" class="ℓ"><img src="${IMG_DIR}/googleloginbutton.svg" alt="구글로그인"></button> </article>`, 
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
     const $ = html`<section class="card "><div class=slide><div class="slideContainer ℓ"><div class=imgContainer><img src=${IMG_DIR}/slide_makingCocktail_01.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_02.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_03.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_04.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_05.jpg alt=칵테일제조사진> </div></div> <div class=progressBar><img src=${IMG_DIR}/line1.svg><img class=progressLine src=${IMG_DIR}/line2.svg></div></div></section>`;
     const $$ = ℓ($);
     let startX, dx, tx = 0; //startX 마우스 클릭 포인트

     function slideMoveHandler({x, y}){
        dx = x - startX;  //dx 움직인 거리
        update($$, {style:{transform:`translateX(${tx + dx}px)`}});
     }
     const apply = ( ) => {
        update($$, {
            onpointerdown(e){ //누르고 있는 상태
                ({x :startX} = e);
                console.log(startX);
                addEventListener('pointermove', slideMoveHandler); //누르고 마우스를 움직였을때

                addEventListener('pointerup', () => {
                    tx = tx + dx;
                    removeEventListener('pointermove', slideMoveHandler);
                }, {once: true});
                // startX =dx;
            }
        });
        // startX =dx;
     } 
     return comp(_,$,apply);
    },
    //recruit section
    comp_recruit(_){
    const $  = html`<section class="recruit"><><></section>`;
    const $$ = ℓ($,
        comp_recruit_header,
        comp_recruit_content
    );

    const apply = ( ) => {
        update($$);
      } 
    return comp(_,$,apply);
    },
    comp_recruit_header(_){
        const $  = html`<header><div class="buttonList"><><></div><h1>[경기 / 하남] 마이 논알콜 하이볼 리스트</h1><div class="des subTitle_30">3가지 논알콜 하이볼 시연 및 시음</div></header>`;
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
//..

        }
        return comp(_,$,apply);
    },
    comp_recruit_content(_){
        const $ = html`
        <dl class="service">
        <dt class="subTitle_20">제공 서비스</dt>
        <dd >핸드드립 원데이 클래스 + 디져트 3종 택1</dd></dl>
        <dl class="keyword"><dt class="subTitle_20 ">키워드<img src=${IMG_DIR}/copyicon.svg alt=키워드></dt><dd>
        <></dd></dl>
        
        <dl class="guide">
        <dt class="subTitle_20">안내</dt>
        <dd>
        <p class="danger">직접 매장에 예약하여 방문 후 리뷰를 작성하는 캠페인입니다</p>
       
        <div class="announcement">
        뷰어 발표기간 <span>6.20 - 6.25</span>
        </div>
       
        <div class="date">
        <h3>참여 날짜 및 시간대</h3>

        <div class="dateContent">
        <div>
         <span>6월24일</span>    <span>6월25일</span>    <span>6월26일</span>    <span>6월27일</span> <span>6월28일</span>
        </div>
        <ul>
        <li>-1타임 오전 10:00 - 12:00 (총 2시간)</li>
        <li>-2타임 오후 14:00 - 16:00 (총 2시간)</li>
        </ul>
        *날짜 선택후 1타임과 2타임 중 택 1
        </div>
        </div>
       
        <p class ="coffee">
        <h3>☕️커피 기본 교육☕️</h3>
        내가 만들어보는 라떼와 아메리카노
        <ul>
        <li>라떼 스티밍 체험 </li>
        <li>에스프레소를 추출 및 시음하는 아메리카노 & 라떼 체험</li>
        </ul>
        </p>

        <p>
        <h3>논알콜로 즐기는 홈파티</h3>
        논알콜 하이볼 시리즈! 논알콜 위스키 시럽을 활용한 음료 제조 체험
        <ul>
        <li>기본 시연 및 시음으로 3가지 음료</li>
        <li>재료들을 나열해두고 자기만의 하이볼 만들어서 모두와 함께 맛보고 의견 나누기</li>
        </ul>
        </p>

        <p>
        <h3>주차 지원 : 3시간</h3>
        신청시 한팀당 최대 2명(신청자 포함)입니다.🥰
        </p>

        </dd></dl>`;
         const $$ = ℓ($,
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
        const keyword =  ["하남데이트","하남카페", "카페창업","하남가볼만한곳","커피머신기"];
      
        const apply = ( ) => { 
            update($$,keyword);
         }; 
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