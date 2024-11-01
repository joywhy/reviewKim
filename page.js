const KST_TIME = 32400000; //DATA 객체 외부에 있는 이유

const DATA = {
  my: {},
  no: 1,
  address: [
    '경기 하남시 미사강변서로 22 에코큐브지식산업센터 B106호',
    '풍산동 490-1'
  ],
  dateList: [
    [
      new Date(new Date('2024-06-24T10:00Z') - KST_TIME),
      new Date(new Date('2024-06-24T12:00Z') - KST_TIME) 
    ],
    [
      new Date(new Date('2024-06-24T14:00Z') - KST_TIME),
      new Date(new Date('2024-06-24T16:00Z') - KST_TIME)
    ],
    [
      new Date(new Date('2024-06-25T10:00Z') - KST_TIME),
      new Date(new Date('2024-06-25T12:00Z') - KST_TIME) 
    ],
    [
      new Date(new Date('2024-06-25T14:00Z') - KST_TIME),
      new Date(new Date('2024-06-25T16:00Z') - KST_TIME)
    ],
    [
      new Date(new Date('2024-06-26T10:00Z') - KST_TIME),
      new Date(new Date('2024-06-26T12:00Z') - KST_TIME) 
    ],
    [
      new Date(new Date('2024-06-26T14:00Z') - KST_TIME),
      new Date(new Date('2024-06-26T16:00Z') - KST_TIME)
    ],
    [
      new Date(new Date('2024-06-27T10:00Z') - KST_TIME),
      new Date(new Date('2024-06-27T12:00Z') - KST_TIME) 
    ],
    [
      new Date(new Date('2024-06-27T14:00Z') - KST_TIME),
      new Date(new Date('2024-06-27T16:00Z') - KST_TIME)
    ],
    [
      new Date(new Date('2024-06-28T10:00Z') - KST_TIME),
      new Date(new Date('2024-06-28T12:00Z') - KST_TIME) 
    ],
    [
      new Date(new Date('2024-06-28T14:00Z') - KST_TIME),
      new Date(new Date('2024-06-28T16:00Z') - KST_TIME)
    ],
  ],
  endDate: new Date(new Date('2024-06-25') - KST_TIME), // T00:00:00Z
  lat: 37.5525647, //위도 모집공고 위치 ->경기 하남시 미사강변서로 22 에코큐브지식산업센터 B106호
  lng: 127.1843589 //경도 모집공고 위치
}
//함수
Object.assign(self,{
  //카운트 다운 
  comp_timer(_){ //_ = new Text
    let endDate, time, format;
    const $ = html`<span class=ℓ>`,
      $$ = ℓ($); //[span.ℓ]

    const apply = (attr = {endDate, time, format}) => { 

      ({endDate, time, format} = attr); 
       //() 로 감싼 이유
      //{endDate, time, format} 
      if(endDate) time = endDate - Date.now();
      update($$,{innerText: remainTime(time)});
      //update([span.ℓ],{innerText: `13d일 12:12:00`})
    };
    setInterval(apply, 1000)

    return comp(_, $, apply);
  },
  //네이버지도
  comp_map(_, apply){ 
    let height, lat, lng, zoom;
    const $ = html`<div class="ℓ map"></div>`,
    $$ = ℓ($);
    $.append(assign(
      document.createElement('script'),
      {
        src: 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=r8bf836d46&submodules=geocoder',
        onload(){
          const map = new naver.maps.Map($$[0], {
            center: new naver.maps.LatLng(lat, lng),
            zoom
          });

          new naver.maps.Marker({position: map.getCenter(), map})
        
        }
      }
    ));
    (apply = (attr = {height, lat, lng, zoom}) => {
      ({height, lat, lng, zoom = 16} = attr);
      update($$,
        {style: {height: `${height}px`}}
      );
    });
    return comp(_, $, apply);
  },
  //로그인 
  comp_login(_, apply){
    const $ = html`
      <button id="naver-oauth" class="ℓ"><img src="${IMG_DIR}/naverloginbutton.svg" alt="네이버로그인"></button>
      <button id="google-oauth" class="ℓ"><img src="${IMG_DIR}/googleloginbutton.svg" alt="구글로그인"></button>
    `,
    $$ = ℓ($);
    /*
    [ 
     button#naver-oauth.ℓ,
     button#google-oauth.ℓ
    ]
    */
    async function login(type){
      removeEventListener('await login', loginHander);
      (await import(`https:seu.ai/login/${type}.js`)).default((await req('key')).key);
      addEventListener('await login', loginHander, {once: true});
    }
    function loginHander({detail: {my, token}}){
      popupClose();
      cookie.my = token;
      DATA.my = my;
      self.apply();
    }
    update($$,
      {onclick(){login('naver')}},
      {onclick(){login('google')}}
    );
    (apply = () => {});
    return comp(_, $, apply);
  }
})
/*
PAGE 객체의 프로퍼티의 값(메서드의 네이밍)은 웹사이트의 경로를 가르킨다.
'' => ./ 페이지 경로
my => /my 페이지 경로

[참조] $.js  125line render함수  getPage함수 참고
*/

const PAGE = {
  /*
  '' 메서드 
  -> ./ 페이지 경로에 해당

  매개변수 정보
  매개변수 dateList는 DATA.dateList로 인식함

  [참조] $.js  render함수 
  */
  ''({   
    my,  
    dateList,  //DATA.dateList로 인식 
    endDate,
    lng,
    lat
  }){
 /* 
 $ = 부모가 되는 템플릿리터럴 변수

 .ℓ = 랜더링이 필요한 부분 
 <> = 리팩토링이 필요한 부분(구조변경여지가 있는부분)

 템프릿 리터럴 $ 작성시 공백또한 잡히기때문에 띄어쓰기 없이 한줄로 작성한다. 

 -잘 작성한 예-
 const $ = html `<header> <div class=container> <h1><a href=/ class=logo>... </header>`;
 -잘못 작성한 예- 
 const $ = html `<header> 
 <div class=container> <h1><a href=/ class=logo>
 ... </header>`; 

 $$ =>  $ 중 변경점이 있는 <>   .ℓ 를 추출 및 알맞게 변경한 배열
 */
/*

*/
    const $ = html`<header><div class=container><h1><a href=/ class=logo><img src=${IMG_DIR}/logo_kor_reviewKim.svg alt=리뷰킴> <img src=${IMG_DIR}/logo_en_reviewKim.svg alt=reviewkim> </a></h1> <div class="rightSide center"> <a href=//pf.kakao.com/_gQbVG/chat>비즈니스 문의</a><><></div></div> </header><main class=container> <section> <header><div><span class=mainBtn>B</span><span>방문형</span></div><h1>[경기 / 하남] 마이 논알콜 하이볼 리스트</h1><p>3가지 논알콜 하이볼 시연 및 시음</p></header><div class=slide><div class=slideContainer><div class=imgContainer><img src=${IMG_DIR}/slide_makingCocktail_01.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_02.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_03.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_04.jpg alt=칵테일제조사진><img src=${IMG_DIR}/slide_makingCocktail_05.jpg alt=칵테일제조사진> </div></div> <div class=progressBar><img src=${IMG_DIR}/line1.svg><img class=progressLine src=${IMG_DIR}/line2.svg></div></div><div class=articleTitle><h2><span>D-day</span><></h2><div class=recruitment><img src=${IMG_DIR}/users.svg alt=모집인원아이콘> <p class=ℓ></p><span>/30</span></div></div><ul><li><h3>접수 기간</h3><p class=ℓ></p></li> <li><h3>뷰어 발표</h3><p>6.20 - 6.26</p></li><li><h3>등록 기간</h3><p>6.24 - 7.10</p></li><li><h3>리뷰 마감</h3><p>7.11</p></li></ul> <div class=buttonList>
    <a href=//pf.kakao.com/_gQbVG/chat>문의</a><a class="mainBtn ℓ">신청</a> </div></section> <section><header><div class=buttonList> <span class=mainBtn>B</span><span>방문형</span></div><h1>[경기 / 하남] 마이 논알콜 하이볼 리스트</h1><p>3가지 논알콜 하이볼 시연 및 시음</p> </header> <dl> <dt>제공 서비스</dt> <dd class=serve>3가지 논알콜 하이볼 시연 및 시음</dd><dd class=serve>나만의 하이볼 레시피 만들기(재료 제공)</dd><dd class=serve>웰컴 커피 및 간단한 간식 제공</dd><dt>키워드<img src=${IMG_DIR}/copyicon.svg alt=키워드></dt><dd class=keyword><span class=tag>하남데이트</span> <span class=tag>하남카페</span><span class=tag>카페창업</span><span class=tag>하남가볼만한곳</span> <span class=tag>커피머신기</span></dd><dt>안내</dt><dd class=guide><p class=dangerText>! 직접 매장에 예약하여 방문 후 리뷰를 작성하는 캠페인입니다 !</p><div class=announcementDate> 뷰어 발표기간 <span>6.20 - 6.26</span></div><div class=participation><h3>참여 날짜 및 시간대</h3><div><div class=tagContainer> <div class=tag>6월24일</div><div class=tag>6월25일</div><div class=tag>6월26일</div><div class=tag>6월27일</div><div class=tag>6월28일</div></div>- 1타임 오전 10:00 - 12:00 (총2시간)<br>- 2타임 오전 14:00 - 16:00 (총2시간)<br><span class=des>*날짜 선택후 1타임과 2타임 중 택 1</span></div></div><div class=cocktail><h3>🥳논알콜로 즐기는 홈파티🎉</h3> 논알콜 하이볼 시리즈! 논알콜 위스키 시럽을 활용한 음료 제조 체험 <ul><li>기본 시연 및 시음으로 3가지 음료</li><li>재료들을 나열해두고 자기만의 하이볼 만들어서 모두와 함께 맛보고 의견나누기</li></ul></div><div class=parking><h3>주차 지원 : 3시간</h3> 신청시 한팀당 최대 2명(신청자 포함)입니다.🥰 </div><img src=${IMG_DIR}/poster.png alt="모집 공고 포스터"></dd><dt>방문장소</dt><dd class=place><div class=address><em>도로명</em><span class=ℓ></span><button class=ℓ>복사</button></div><div class=address><em>지번</em><span class=ℓ></span><button class=ℓ>복사</button></div><></dd></dl></section><></main><footer><div class=container><div class=topFooter><h4>070-7630-1111</h4>평일 10:00 - 17:00 / 점심 시간 12:00 - 13:00<br>주말, 공휴일 제외</div><div class=bottomFooter><div><h6>개인정보처리방침 | 이용약관</h6>상호명: 리을컴퍼니 주소 : 경기 수원시 팔달구 고매로20번길 24 사업자등록번호: 183-42-00547<br>대표 : 박재천 이메일 :admin@lieul.com </div><a href=/ class=logo><img src=${IMG_DIR}/logo_kor_reviewKim.svg alt="리뷰 킴"><img src=${IMG_DIR}/logo_en_reviewKim.svg alt=reviewKim></a></div></div></footer>`
    //ℓ함수 첫번째 인자= 부모 $ ,이후 인자 <>에 변경될 플래그맨트들  순서대로 작성
     const $$ = ℓ($,
    //
      cond(
      html`<a href=/my><img src=${IMG_DIR}/user.svg><span class=ℓ></span></a><a href=?logout>로그아웃</a>`, 
      $ => {
        //html 컴포넌트 
    const {firstChild: $start, lastChild: $end} = $;
    console.log($start,$end);
    const $$ = ℓ($,); 
    
    return () => {
    update($$,{innerText:`${DATA.my.nick}님`});
    return {$start, $end};
   }
    }
  ),
    cond(
      html`<a href=#login class=mainBtn>로그인</a><div class="blind popup"><article id=login><button class="close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`, 
      
      $ => {
        // console.log(...$.childNodes); 
        //$ ->   <a href=#login class=mainBtn>로그인</a><div class="blind popup"><article id=login><button class="close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`, 
      
    const {firstChild: $start, lastChild: $end} = $;
        // console.log($start,$end);
    const $$ = ℓ($,comp_login);
    
    return () => {
      update($$, {onclick(){popupClose()}},{}); //{} 빈객체의 존재의미
      return {$start, $end};
     } 

    }),
    comp_timer,
    comp_map,
    cond(
      html`<section class=blind>
      <form class=ℓ>
      <a class="close ℓ"></a>
      <span>체험단 신청하기</span>
      <h1>[경기 / 하남] 마이 논알콜 하이볼 리스트</h1>
      <div class=vote><em>복수선택</em>
      <></div>
      <label>리뷰 작성할 블로그 주소<input name=url required=true></label>
      <div class=policy><span>유의사항 및 개인정보 활용</span><label>
      <input type=checkbox required=true> 체험단 미션 수행 및 유의사항, 개인정보 제3자 제공에 동의합니다.</label></div>
      <button type=submit class=mainBtn>신청</button></form></section>`, 
      $ => {
    const {firstChild: $start, lastChild: $end} = $;
    const $$ = ℓ($,
    loop(html`
      <label><input type=checkbox name=date class=ℓ>
      <div><em class=ℓ></em><span class=ℓ></span></div></label>`,
       $ => {
    const $$ = ℓ($,);
    
    return (item, i, {$start, $end}) => { //i 갯수
    update($$,
    {value:i}, //input value 값 ?
    {innerText:`${i % 2 + 1}타임 ${Math.floor((item[1] - item[0]) / 3600000) % 24}시간`},  //1타임 두시간
    {innerText:`${item[0].format('D일 (w) H:I', false)} - ${item[1].format('H:I', false)}`} //24일 (월) 10:00 - 12:00
    );
    return {$start, $end, i};
      }
    }, /* len*/
  ));
    
    return () => {
    update($$,
    {onsubmit(){
      event.preventDefault();
      const {date: {value :dateList},
       url: {value :url}} = this.elements;
       if(dateList.length) req('req', {no: DATA.no, dateList: dateList.join(','), url}).then(() => {alert('신청이 완료되었습니다');this.querySelector('.close').click()})}},
    {href:`/${location.pathname.slice(1).split('/').slice(1).join('/')}`},
    dateList   //dateList 가 들어감
    );
    return {$start, $end};
    }
    }));
    



    (async() => {
      //해당페이지에 대한 동접자
      DATA.count = await req('count', {no: DATA.no});
      apply();
    })();

    (self.apply = () => {
   
/*
현재 $$ 값
[
{is: false, $start: text, $end: text, apply: ƒ},
{is: true, $start: a.mainBtn, $end: div.blind.popup, apply: ƒ, blockApply: ƒ},
{$start: span.ℓ, $end: span.ℓ, apply: ƒ},   <--- comp_timer 남은 시간
p.ℓ,                                        <---  신청 인원
p.ℓ,                                        <---  접수 기간
a.mainBtn.ℓ,                                <--- 신청 버튼
span.ℓ,
button.ℓ, 
span.ℓ, 
button.ℓ,
{$start: div.ℓ.map, $end: script, apply: ƒ},     <--- comp_map,
{is: false, $start: text, $end: text, apply: ƒ}
 ]
*/
    update($$,
    DATA.my.no, //$ = $.apply(attrList[i])
    !DATA.my.no, //비로그인 여부 비로그인->true 로그인->false
    {format:`D일 H:I:S`,endDate:endDate},
    {innerText: DATA.count},
    {innerText:`- ${endDate.format('m.d', false)}`},
    {href:DATA.my.no ? '/form/1' : '#login'},
    {innerText:DATA.address[0]},
    {onclick(){copy(DATA.address[0])}},
    {innerText:DATA.address[1]},
    {onclick(){copy(DATA.address[1])}},
    {lat:lat,lng:lng,zoom:15},
    DATA.my.no && location.pathname.startsWith('/form') //is
    )})();
    return $;
  },
  my({my}){
    const $ = html`
    <header><div class=container>
    <h1><a href=/ class=logo>
    <img src=${IMG_DIR}/logo_kor_reviewKim.svg alt=리뷰킴>
    <img src=${IMG_DIR}/logo_en_reviewKim.svg alt=reviewkim>
    </a></h1>
    
    <div class="rightSide center">
    <a href=//pf.kakao.com/_gQbVG/chat>비즈니스 문의</a>
    <><></div></div>
    </header>

    <main class=userInfo>
    <img class="userPhoto ℓ">
    <strong class=ℓ></strong>
    <dl style="--dt: 80;"><dt>Name</dt>
    <dd class=ℓ></dd>
    <dt>Gender</dt>
    <dd class=ℓ></dd>
    <dt>Mail</dt>
    <dd class=ℓ></dd>
    <dt>Birthday</dt>
    <dd class=ℓ></dd>
    <dt>Tel</dt>
    <dd class=ℓ></dd>
    </dl><a href=?logout>로그아웃</a>
    </main>
    
    <footer>
    <div class=container>
    <div class=topFooter>
    <h4>070-7630-1111</h4>
    평일 10:00 - 17:00 / 점심 시간 12:00 - 13:00<br>주말, 공휴일 제외</div>
    <div class=bottomFooter>
    <div>
    <h6>개인정보처리방침 | 이용약관</h6>상호명: 리을컴퍼니 주소 : 경기 수원시 팔달구 고매로20번길 24 사업자등록번호: 183-42-00547<br>대표 : 박재천 이메일 :admin@lieul.com </div>
    <a href=/ class=logo>
    <img src=${IMG_DIR}/logo_kor_reviewKim.svg alt="리뷰 킴">
    <img src=${IMG_DIR}/logo_en_reviewKim.svg alt=reviewKim>
    </a></div></div>
    </footer>`

const $$ = ℓ($,
	cond(
		html`
      <a href=/my>
      <img src=${IMG_DIR}/user.svg>
      <span class=ℓ></span>
      </a>
      <a href=?logout>로그아웃</a><>`,
       $ => {
			const {
				firstChild: $start,
				lastChild: $end
			} = $;
			const $$ = ℓ($, loop());

			return () => {
				update($$, {innerText: `${DATA.my.nick}님`});
				return {$start, $end};
			}
		}),
	cond(
		html`<a href=#login class=mainBtn>로그인</a>
      <div class="blind popup">
      <article id=login>
      <button class="close ℓ">
      </button>
      <img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`,
		$ => {
			const {
				firstChild: $start,
				lastChild: $end
			} = $;
			const $$ = ℓ($,
				comp_login
			);

			return () => {
				update($$, {
					onclick() {
						popupClose()
					}
				}, {});
				return {
					$start,
					$end
				};
			}
		})
);;
(self.apply = () => {
	if (!DATA.my.no) {
		link('/');
		return;
	}
	update($$,
		DATA.my.no,
		!DATA.my.no,
     {
			src: DATA.my.memo
		}, 
    {
			innerText: DATA.my.nick
		}, 
    {
			innerText: DATA.my.name
		},
     {
			innerText: DATA.my.gender
		}, 
    {
			innerText: DATA.my.mail
		}, 
    {
			innerText: DATA.my.birthday
		}, 
    {
			innerText: DATA.my.tel
		}
	)
})();
return $;

  }
}