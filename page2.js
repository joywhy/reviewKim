
const DATA = {
};

Object.assign(self,{
Main(_){
  const $ = html`<main> main 컴포넌트</main>`;
  return comp(_, $);
},
Section(_){
  const $ = html`<section> section 컴포넌트</section>`;
  return comp(_, $);

}

});
const PAGE= {
  ''(){
    const $= html`<header>header입니다.</header><><footer>footer입니다.</footer>`;
    const $$ = ℓ($,
      Main
    );
   
    return $;
  }
}