
 function getURLnaverLogin(
  CLIENT_ID,
  REDIRECT_URL = 'https://api.seu.ai/login/naver/',
  STATE ='hLiDdL2uhPtsftcU'
) {
  const URL =  'https://nid.naver.com/oauth2.0/authorize';

  const queryParams = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    response_type: 'code',
    state :STATE
  };
  const queryString = new URLSearchParams(queryParams).toString();

  return   `${URL}?${queryString}`
}

// async function getToken(CLIENT_ID, SECRET_KEY, code) {
//   try {
//     const response = await fetch('https://nid.naver.com/oauth2.0/token', {
//       method: 'POST',
//       headers: {
//         grant_type: 'authorization_code',
//         client_id: CLIENT_ID,
//         client_secret: SECRET_KEY,

//         state: 'hLiDdL2uhPtsftcU',
//         code: code,
//       },
//     });
//     console.log(response);
//     return response.json();
//   } catch (error) {
//     console.log(`[ERROR] ${error}`);
//   }
// }

// async function renewToken(CLIENT_ID, SECRET_KEY, refreshToken) {
//   try {
//     const response = await fetch('https://nid.naver.com/oauth2.0/token', {
//       method: 'POST',
//       headers: {
//         grant_type: 'authorization_code',
//         client_id: CLIENT_ID,
//         client_secret: SECRET_KEY,
//         refresh_token: refreshToken,
//       },
//     });
//     console.log(response);
//     return response.json();
//   } catch (error) {
//     console.log(`[ERROR] ${error}`);
//   }
// }

export { getURLnaverLogin };

