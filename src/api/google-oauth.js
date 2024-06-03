// const CLIENT_ID = "105140587367-9vopq2ppro5udibmfcvv0l4rbslrq9qq.apps.googleusercontent.com";
// const SECRET_KEY ="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";

async function loginGoogleOauth(
  CLIENT_ID,
  SECRET_KEY,
  REDIRECT_URL = 'https://api.seu.ai/login/google/',
  STATE='iLOVEPPANG',
) {
  open(
    `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&include_granted_scopes=true&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&state=${STATE}&scope=https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.emails.read`)}

//head 삽입
// content에 자신의 OAuth2.0 클라이언트ID를 넣습니다.
{
  /* <script src="https://accounts.google.com/gsi/client" async></script>
<script>
    onload = () => {
        import('./google-oauth.js').then(({default: googleOauth}) => {
            googleOauth()
        })
    }
</script> */
}

function decodeJwtResponse(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //decodeURIComponent  ?
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
//처음 실행하는 함수
function init(CLIENT_ID) {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback({ credential }) {
      const responsePayload = decodeJwtResponse(credential);

      //  const userinfo = {
      //   email: responsePayload.email,
      //   nickname: naver_id_login.getProfileData('nickname'),
      //   age: naver_id_login.getProfileData('age'),
      //   id :responsePayload.sub,

      //   fullName: responsePayload.name,
      //   giveName: responsePayload.given_name,
      //   familyName : responsePayload.family_name,
      //   profileImg : responsePayload.picture
      //  };

      return responsePayload;
    },
  });

  google.accounts.id.prompt((notification) => {
    console.log(notification);
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      // try next provider if OneTap is not displayed or skipped
    }
  });
}
export { loginGoogleOauth };
