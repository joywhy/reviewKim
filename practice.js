const $frag = html`<a href=#login class=mainBtn>로그인</a><div class="blind popup"><article id=login><button class="close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`
      ;

      const fn = $ => {
        // console.log(...$.childNodes); 
        //$ ->   <a href=#login class=mainBtn>로그인</a><div class="blind popup"><article id=login><button class="close ℓ"></button><img src=${IMG_DIR}/logo_en_reviewKim.svg><></article></div>`, 
      
    const {firstChild: $start, lastChild: $end} = $;
        // console.log($start,$end);
    const $$ = ℓ($,comp_login);
    
    return () => {
      update($$, {onclick(){popupClose()}},{}); //{} 빈객체의 존재의미
      return {$start, $end};
     } };


setBind($frag, fn);


function setBind($, fn, item, i){
    $ = $.cloneNode(true);
    return {$, apply: fn($, item, i), $start: $.firstChild, $end: $.lastChild}
};

