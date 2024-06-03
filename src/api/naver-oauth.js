// const CLIENT_ID = "zVhxXT6bnKTe2u6CE_LS";
// const SECRET_KEY ="rS9t1Y77iB";

async function loginNaverOauth(
  CLIENT_ID,
  SECRET_KEY,
  REDIRECT_URL = 'https://api.seu.ai/login/naver/'
) {
  open(
    `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&state=hLiDdL2uhPtsftcU`
  );
}

async function getToken(CLIENT_ID, SECRET_KEY, code) {
  try {
    const response = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: SECRET_KEY,

        state: 'hLiDdL2uhPtsftcU',
        code: code,
      },
    });
    console.log(response);
    return response.json();
  } catch (error) {
    console.log(`[ERROR] ${error}`);
  }
}

async function renewToken(CLIENT_ID, SECRET_KEY, refreshToken) {
  try {
    const response = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: SECRET_KEY,
        refresh_token: refreshToken,
      },
    });
    console.log(response);
    return response.json();
  } catch (error) {
    console.log(`[ERROR] ${error}`);
  }
}

export { loginNaverOauth };

// console.log(naver_id_login)
// var login = new naver_id_login(NAVER_CLIENT_ID, CALLBACK_URL);
// // 접근 토큰 값 출력
// // alert(naver_id_login.oauthParams.access_token);
// //naver_id_login.getAccessToken()

// // 네이버 사용자 프로필 조회
// login.setPopup(); //Popup형태의 인증 진행
// login.init_naver_id_login();

// await new Promise(res => {
//     self.res = res;
//     login.get_naver_userprofile('res()')
// });

// const userinfo = {
//     email: login.getProfileData('email'),
//     nickname: login.getProfileData('nickname'),
//     age: login.getProfileData('age'),
//     profileImage: login.getProfileData('profile_image'),
//     gender: login.getProfileData('gender'),
//     id: login.getProfileData('id'),
//     id: login.getProfileData('id'),
//     name: login.getProfileData('name'),
//     birthday: login.getProfileData('birthday'),
// }

// return userinfo;
