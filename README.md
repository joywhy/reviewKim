# layer.js 프레임워크 설명

## 전역 상태관리 

```js
//page.js
const DATA = {
    userinfo: {},
    no: 1,
}
```
DATA 객체는 전역 상태관리를 하는 store 객체 입니다. page.js 파일 전역에 생성합니다. 

## 경로 지정 

```js
const PAGE = {
    path({...state}){
    //   path 경로 페이지에 들어가는 컴포넌트
    }
};
```

PAGE page.js 파일 전역에 PAGE 객체를 생성합니다. page 객체의 메서드 이름이 곧 페이지의 path를 가리킵니다. 빈문자열''이름으로 메서드를 만든다면 ./ 페이지 경로를 나타냅니다. 또한 해당 매개변수는 해당 페이지에 사용하는 상태State들이 들어간다.

```js
//예시
const PAGE = {
//  ./ 페이지 경로
''({dateList,endDate}){

},
//  /shop 페이지 경로
shop({}){

},
//  /my 페이지 경로
my({}){
    
},
...
};
```