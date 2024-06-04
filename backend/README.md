## 2024 1학기 캡스톤 프로젝트 (메디앙 시스템 - 백엔드)

### 사용한 기술
- GCP (Google Cloud Platform)
- PostgreSQL
- Docker
- Spring boot

### 주요 기능
- 기기 등록 및 조회
- 메타 데이터 저장 및 조회
- 스크린 샷 저장 및 조회
- 기기와 서버 간의 명령 전송

### API 명세서

### DaemonController

#### `/daemon`
- **GET /connect**
    - **파라미터**:
        - `machineId` (Long, required): 기기 ID
    - **응답**: `SseEmitter`
    - **상태 코드**: `200 OK`
    - **설명**: 기기 연결 요청을 처리합니다.
    - **예외**:
        - `MachineNotRegisteredException`: `400 BAD REQUEST`
        - `InitialConnectionException`: `500 INTERNAL SERVER ERROR`

- **POST /control**
    - **파라미터**:
        - `requestDaemonCommandDTO` (JSON Body, required): 제어 명령 요청 데이터
            - **requestDaemonCommandDTO**:
              ```json
              {
                "machineId": 2,
                "control": {
                  "command": "kill",
                  "args": [1234]
                }
              }
              ```
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14T16:48:07",
        "message": "명령 제어 전송에 성공했습니다."
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 기기 제어 명령을 전송합니다.
    - **예외**:
        - `EmitterNotFoundException`: `404 NOT FOUND`
        - `CommandSendException`: `500 INTERNAL SERVER ERROR`

### ScreenshotController

#### `/screenshot`
- **POST**
    - **파라미터**:
        - `imageData` (MultipartFile, required): 이미지 파일 (PNG 형식)
        - `imageName` (String, required): 이미지 이름
        - `createdAt` (DateTime, required): 생성 시간
        - `machineId` (Long, required): 기기 ID
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14T16:43:01",
        "message": "스크린샷 저장에 성공했습니다."
      }
      ```
    - **상태 코드**: `200 OK`, `400 BAD REQUEST`
    - **설명**: 스크린샷을 추가합니다.
    - **예외**: `IOException`

- **GET /{id}/detail**
    - **파라미터**:
        - `id` (Long, required): 스크린샷 ID
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14T16:45:41",
        "message": "특정 id의 이미지 조회에 성공",
        "data": {
          "screenshotId": 1,
          "machineId": 123,
          "imageName": "example.png",
          "createdAt": "2023-06-01T12:00:00",
          "imageData": "base64_encoded_image_data"
        }
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 특정 스크린샷을 조회합니다.

- **GET /{id}**
    - **파라미터**:
        - `id` (Long, required): 기기 ID
        - `from` (DateTime, optional): 시작 시간
        - `to` (DateTime, optional): 종료 시간
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14T16:43:04",
        "message": "특정 id, 특정 시간에 해당하는 스크린샷을 성공적으로 가져왔습니다.",
        "data": [
          {
            "screenshotId": 1,
            "machineId": 123,
            "imageName": "example1.png",
            "createdAt": "2023-06-01T12:00:00"
          },
          {
            "screenshotId": 2,
            "machineId": 123,
            "imageName": "example2.png",
            "createdAt": "2023-06-01T13:00:00"
          }
        ]
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 특정 시간 범위 내의 스크린샷을 조회합니다.

### MachineController

#### `/machines`
- **GET**
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 16:31:39",
        "message": "현재 등록된 모든 기기를 성공적으로 조회했습니다.",
        "data": [
          {
            "machineId": 1,
            "machineName": "machine1",
            "uuid": "123e4567-e89b-12d3-a456-426614174000"
          }
        ]
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 현재 등록된 모든 기기를 조회합니다.

- **GET /{id}**
    - **파라미터**:
        - `id` (String, required): 기기 ID 또는 UUID
        - `type` (String, optional): 타입 (client)
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 16:48:07",
        "message": "id를 통해 기기를 성공적으로 조회했습니다.",
        "data": {
          "id": 1,
          "name": "Machine 1",
          "uuid": "123e4567-e89b-12d3-a456-426614174000"
        }
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 특정 ID 또는 UUID를 통해 기기를 조회합니다.
    - **예외**:
        - `MachineNotFoundException`: `404 NOT FOUND`
        - `InvalidTypeParameterException`: `400 BAD REQUEST`

- **POST**
    - **파라미터**:
        - `machineDTO` (JSON Body, required): 기기 추가 요청 데이터
            - **machineDTO**:
              ```json
              {
                "machineName": "test1001",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
              }
              ```
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 16:48:07",
        "message": "기기 추가에 성공했습니다.",
        "data": {
          "machineId": 11,
          "machineName": "test1001"
        }
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 기기를 추가합니다.

- **PATCH /{id}**
    - **파라미터**:
        - `id` (Long, required): 기기 ID
        - `requestMachineDTO` (JSON Body, required): 기기 수정 요청 데이터
            - **requestMachineDTO**:
              ```json
              {
                "machineName": "updatedMachine",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
              }
              ```
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 16:48:07",
        "message": "특정 id의 머신 정보를 성공적으로 수정했습니다."
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 특정 ID의 기기 정보를 수정합니다.

- **GET /{id}/metrics**
    - **파라미터**:
        - `id` (Long, required): 기기 ID
        - `from` (DateTime, optional): 시작 시간
        - `to` (DateTime, optional): 종료 시간
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 17:02:15",
        "message": "특정 id, 특정 시간에 해당하는 메타데이터를 성공적으로 가져왔습니다.",
        "data": [
          ]
      }
       ```

### MetricsController

#### `/metrics`
- **POST**
    - **파라미터**:
        - `requestMetricsDTO` (JSON Body, required): 메타데이터 추가 요청 데이터
            - **requestMetricsDTO**:
              ```json
              {
                "machineId": 1,
                "createdAt": "2024-05-14T15:46:31.612697",
                "metricType": "HW_INFO",
                "data": {}
              }
              ```
    - **응답**:
      ```json
      {
        "status": 200,
        "timestamp": "2024-05-14 16:49:14",
        "message": "메타 데이터를 성공적으로 추가했습니다."
      }
      ```
    - **상태 코드**: `200 OK`
    - **설명**: 메타데이터를 추가합니다.