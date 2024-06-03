
 function getURLgoogleLogin(
  CLIENT_ID,
  REDIRECT_URL = 'https://api.seu.ai/login/google/',
  STATE='iLOVEPPANG',
) {
  const URL =  'https://accounts.google.com/o/oauth2/v2/auth';
  const scope = 'https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.emails.read';
  const queryParams = {
    access_type: "offline",
    include_granted_scopes: "true",
    client_id :CLIENT_ID,
    redirect_uri :REDIRECT_URL,
    response_type: 'code',
    state :STATE,
    scope :scope
  };
  const queryString = new URLSearchParams(queryParams).toString();

  return   `${URL}?${queryString}`
};

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

export { getURLgoogleLogin };
