
function comp_login(_, apply){
  const $ = html`
    <button id="naver-oauth" class="ℓ"><img src="${IMG_DIR}/naverloginbutton.svg" alt="네이버로그인"></button>
    <button id="google-oauth" class="ℓ"><img src="${IMG_DIR}/googleloginbutton.svg" alt="구글로그인"></button>
  `,
  $$ = ℓ($);

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
};


function ℓ ($p, ...applyList)  { //applyList[com_login]
 
  const $$ = [...$p.querySelectorAll(`l, .ℓ${$p.id ?? ''}`)];
  console.log($$);
  $$.forEach(($, i) => {
    //요소의 로컬이름이 l 인경우 <l></l>
    console.log($.localName == 'l');
    if($.localName == 'l'){
      // 선택된 부모 노드가 가지고 있는 노드를 새로운 텍스트 노드로 교체
      $.replaceWith($ = new Text); 
      //applyList 없으면 그대로 텍스트 노드로 
      
      $$[i] = applyList.shift()?.($) ?? $;
      // applyList.shift().(l)
    }
  })
  return $$;
}
const $ =  html`<a href=#login class=mainBtn>로그인</a><div class="blind popup"><article id=login><button class="close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`; 
      
const $$ = ℓ($,comp_login);

