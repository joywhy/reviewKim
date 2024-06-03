
async function loginGoogleOauth(
  CLIENT_ID,
  SECRET_KEY,
  REDIRECT_URL = 'https://api.seu.ai/login/google/',
  STATE='iLOVEPPANG',
) {
  open(
    `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&include_granted_scopes=true&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&state=${STATE}&scope=https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.emails.read`)}

  //   popup(url = '', width = 900, height = outerHeight){
  //     open(url, null, `width=${width},height=${height},left=${(outerWidth - width) / 2},resizable=no,scrollbars=yes,status=no;`);
  // }
  // //창의 화면 왼쪽에서의 위치를 지정합니다. 음수는 사용할 수 없습니다.

  

// function decodeJwtResponse(token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   //decodeURIComponent  ?
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split('')
//       .map(function (c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join('')
//   );

//   return JSON.parse(jsonPayload);
// }
// //처음 실행하는 함수
// function init(CLIENT_ID) {
//   google.accounts.id.initialize({
//     client_id: CLIENT_ID,
//     callback({ credential }) {
//       const responsePayload = decodeJwtResponse(credential);

//       //  const userinfo = {
//       //   email: responsePayload.email,
//       //   nickname: naver_id_login.getProfileData('nickname'),
//       //   age: naver_id_login.getProfileData('age'),
//       //   id :responsePayload.sub,

//       //   fullName: responsePayload.name,
//       //   giveName: responsePayload.given_name,
//       //   familyName : responsePayload.family_name,
//       //   profileImg : responsePayload.picture
//       //  };

//       return responsePayload;
//     },
//   });

//   google.accounts.id.prompt((notification) => {
//     console.log(notification);
//     if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//       // try next provider if OneTap is not displayed or skipped
//     }
//   });
// }

export { loginGoogleOauth };
