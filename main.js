const btn = document.getElementById('login');
const modal = document.getElementById('modalWrap');
const closeBtn = document.getElementById('closeBtn');

btn.onclick = function () {
  modal.style.display = 'block';
};

closeBtn.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};


function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const { getCookie } = await import('./main.js');
const isLogin = getCookie(nickname);
const headerRightSide = document.getElementsByClassName('rightSide');

if(isLogin){
//로그인시 header > rightSide  디자인
const username = getCookie(nickname);
const profile_image =getCookie(profile_image);

 //  headerRightSide.innerHtml ='';
//  headerRightSide.innerHtml =`
//  <img src=${profile_image} alt ="프로필사진"/>
//   <span>${username}님</span>
//   <button class="logout" id="logout">로그아웃</button>
//    `;
}else {
//비로그인시 header > rightSide  디자인
// <div class="rightSide center">
//     <a href="">비즈니스 문의</a>
//     <button class="mainBtn login" id="login">로그인</button>

//     <div id="modalWrap"> 
//       <div id="modalBody">
//         <span id="closeBtn">&times;</span> 
      
//           <img src="./src/img/logo_en_reviewKim.svg"/>
      
//           <button id="naver-oauth">
//             <img src="./src/img/naverloginbutton.svg" alt="네이버로그인">
//           </button>

//           <button id="google-oauth">
//             <img src="./src/img/googleloginbutton.svg" alt="구글로그인">
//           </button>              
//       </div>
//     </div>

//   </div>

}


// export {getCookie} ;