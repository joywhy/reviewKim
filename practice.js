const $frag =  html`<a href=/my><img src=${IMG_DIR}/user.svg><span class=ℓ></span></a><a href=?logout>로그아웃</a>`;
const fn = $ => {
        //html 컴포넌트 
    const {firstChild: $start, lastChild: $end} = $;
    console.log($start,$end);
    const $$ = ℓ($,); 
    
    return () => {
    update($$,{innerText:`${DATA.my.nick}님`});
    return {$start, $end};
 }
};
const $ = new Text; //로그인시 유저 사진과 로그아웃 버튼 위치

const  cond= ($frag, fn) => $ => { 
    /*
   cond 함수  역할 

   : 조건이 맞으면 DOM 요소를 반환, 조건이 맞지않으면 DOM 요소를 지우는 함수를 반환한다.
    */

    console.log($);
    return {
        is: false,
        $start: $,
        $end: $,
        apply(is){ //apply 함수에서 실행
            console.trace();
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
};