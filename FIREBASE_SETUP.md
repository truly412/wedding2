# Firebase 설정 가이드

축하 메시지 기능을 사용하려면 Firebase Firestore 데이터베이스를 설정해야 합니다.

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속합니다
2. "프로젝트 추가" 버튼을 클릭합니다
3. 프로젝트 이름을 입력합니다 (예: wedding-invitation)
4. Google 애널리틱스는 선택사항입니다
5. 프로젝트 생성을 완료합니다

## 2. 웹 앱 등록

1. Firebase 콘솔에서 프로젝트 개요 페이지로 이동합니다
2. "웹 앱에 Firebase 추가" (</> 아이콘)를 클릭합니다
3. 앱 닉네임을 입력합니다 (예: wedding-web)
4. "Firebase 호스팅도 설정" 체크박스는 선택사항입니다
5. "앱 등록" 버튼을 클릭합니다

## 3. Firebase 구성 정보 복사

앱 등록 후 표시되는 Firebase 구성 정보를 복사합니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## 4. script.js 파일 수정

1. `C:\dev\wedding2\script.js` 파일을 엽니다
2. 파일 상단의 `firebaseConfig` 객체를 찾습니다
3. YOUR_API_KEY 등의 값을 복사한 구성 정보로 교체합니다

**수정 전:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

**수정 후:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef..."
};
```

## 5. Firestore 데이터베이스 생성

1. Firebase 콘솔 왼쪽 메뉴에서 "Firestore Database"를 클릭합니다
2. "데이터베이스 만들기" 버튼을 클릭합니다
3. **프로덕션 모드**로 시작합니다 (보안 규칙을 직접 설정하기 위함)
4. Cloud Firestore 위치를 선택합니다 (권장: asia-northeast3 - 서울)
5. "사용 설정" 버튼을 클릭합니다

## 6. Firestore 보안 규칙 설정

1. Firestore Database 페이지에서 "규칙" 탭을 클릭합니다
2. 다음 규칙을 복사하여 붙여넣습니다:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 메시지 컬렉션: 모두 읽기 가능, 쓰기 가능 (스팸 방지 추천)
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.resource.data.name is string &&
                       request.resource.data.name.size() > 0 &&
                       request.resource.data.name.size() <= 50 &&
                       request.resource.data.message is string &&
                       request.resource.data.message.size() > 0 &&
                       request.resource.data.message.size() <= 500;
      allow update, delete: if false;
    }
  }
}
```

3. "게시" 버튼을 클릭하여 규칙을 적용합니다

이 규칙은:
- 모든 사람이 메시지를 읽을 수 있습니다
- 메시지 작성 시 이름(1-50자)과 메시지(1-500자) 검증을 합니다
- 메시지 수정/삭제는 불가능합니다

## 7. 테스트

1. 웹 브라우저에서 `index.html` 파일을 엽니다
2. 개발자 도구 콘솔(F12)을 열어 "Firebase 초기화 성공" 메시지를 확인합니다
3. 축하 메시지 섹션에서 메시지를 작성하고 전송해봅니다
4. Firebase 콘솔의 Firestore Database에서 데이터가 저장되었는지 확인합니다

## 8. 실시간 업데이트

설정이 완료되면 다음 기능들이 자동으로 작동합니다:
- ✅ 메시지 작성 시 Firestore에 자동 저장
- ✅ 페이지 로드 시 최근 50개 메시지 자동 불러오기
- ✅ 실시간 업데이트: 다른 사람이 메시지를 남기면 자동으로 화면에 표시
- ✅ XSS 공격 방지를 위한 HTML 이스케이프 처리

## 문제 해결

### Firebase 초기화 실패
- 개발자 도구 콘솔에서 오류 메시지를 확인하세요
- firebaseConfig 값이 정확한지 확인하세요
- Firebase 프로젝트가 활성화되어 있는지 확인하세요

### 메시지가 저장되지 않음
- Firestore 보안 규칙이 올바르게 설정되었는지 확인하세요
- 개발자 도구 콘솔에서 오류 메시지를 확인하세요
- Firebase 콘솔에서 Firestore Database가 생성되었는지 확인하세요

### 메시지가 표시되지 않음
- 인터넷 연결을 확인하세요
- 브라우저 캐시를 삭제하고 페이지를 새로고침하세요
- 개발자 도구 콘솔에서 오류 메시지를 확인하세요

## 비용 안내

Firebase Firestore 무료 할당량:
- 문서 읽기: 하루 50,000건
- 문서 쓰기: 하루 20,000건
- 저장 용량: 1GB

일반적인 웨딩 청첩장의 방문자 수준에서는 **무료 플랜으로 충분합니다**.

더 많은 정보는 [Firebase 가격 정책](https://firebase.google.com/pricing)을 참고하세요.

## 추가 기능 (선택사항)

### 스팸 방지
현재 설정은 누구나 메시지를 작성할 수 있습니다. 스팸을 방지하려면:
1. Firebase Authentication을 추가하여 로그인 기능 구현
2. Firestore 보안 규칙에 rate limiting 추가
3. 관리자 페이지를 만들어 부적절한 메시지 삭제 기능 추가

### 관리자 기능
메시지 관리를 위한 별도 관리자 페이지 제작을 고려해보세요:
- 메시지 삭제
- 메시지 수정
- 통계 확인

---

**축하합니다!** 이제 실시간 축하 메시지 기능이 작동합니다! 🎉
