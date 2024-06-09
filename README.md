# 다중 PC 환경 모니터링 및 원격 채팅 기술
- 해당 프로젝트는 전북대학교 2024 상반기 캡스톤프로젝트를 위해 제작이 되었습니다.

## 서론
 해당 프로젝트를 요구한 기업은 다음과 같은 문제를 겪고 있었습니다.
```
 해당 기업은 여러 매장의 포스기를 관리하는 기업입니다.
매장에서 기업측에 문의하는 내용은 주로 단순히 "포스기가 정상적으로 작동하지 않는다." 라는 문제만 받고 있습니다.
이는 포스기를 사용하는 매장측에서 어떤 문제때문에 발생하는지 정확히 파악을 하지 못하여 포괄적으로 말하는 것입니다.
이러한 포스기의 원인을 찾기위해 상당히 많은 인적 자원을 투자하게 됩니다.
 그리하여 포스기의 정보를 수집하고 스크린샷을 찍어오는 기술을 통해서 매장측에 어떤 문제가 있는지 바로 파악하기 위해새로운 프로그램이 필요합니다.
```
 저희는 해당 프로젝트를 수행하기 위해 다음과 같이 역할을 분리하여 진행하였습니다.
```
1. 포스기의 데이터를 수집하고 명령을 받으며 수집한 데이터를 주기적으로 서버에 보내는 클라이언트.
2. 서버에 저장된 클라이언트 정보를 조회하고 클라이언트에 명령을 내리는 관리자 페이지.
3. 클라이언트의 데이터를 저장하며 관리자의 명령을 전달하는 서버
```

## 흐름도
- 위에 서술된 내용을 정리하면 현 프로젝트는 세개의 세부 프로젝트로 분류할 수 있습니다.
  - `Client(collector)`
  - `Server(backend)`
  - `WebBrowser(Admin-page)`
- 각 프로젝트의 대한 내용은 하위 폴더의 `README`를 참고해주세요.
- 해당 프로젝트의 전제 흐름도에 대한 내용은 다음 사진과 같습니다.
![Server ActiviteDiagram](https://github.com/jbnu-capstone-jjinjjin/project/assets/129056857/dcfe1e79-135a-4316-85b8-6460183b8144)
![Daemon ActiviteDiagram](https://github.com/jbnu-capstone-jjinjjin/project/assets/129056857/2d3cbbe6-8c1f-4c5a-a807-8619b35b5f71)
