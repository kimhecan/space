## ERD

![스크린샷 2024-05-03 오전 12 38 22](https://github.com/kimhecan/space/assets/39295881/1cd3089d-1050-4c53-bb6d-608ec58c0b9c)


## 환경설정
-  .env.development, .env.production DB고나련 환경변수를 로컬에 맞게 설정해주세요


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```



## 구현 사항

### Common


- **URL**: `http://{{host}}/common/files`
- **Description**: 회원프로필, 게시글의 첨부파일 등 이미지를 서버에 저장하고 첨부파일의 주소를 리턴합니다.
- **Method**: `POST`
- **Payload(form-data)**:
  ```
  {
    files: .png or .docx ...
  }
  ```
- **Response**
  ```json
  {
    "fileNames": [
        "baa35c94-b0e5-4e3f-831b-98116d5b5324.docx (or.png ...)"
    ]
  }
  ```

<br />
<br />

#### Authentication
- **URL**: `http://{{host}}/auth/join`
- **Description**: 회원가입 api 입니다.
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email":"kimhecan1@gmail.com",
    "password": "123",
    "name": "김희찬",
    "gender": "Male",
    "profileImage": "52cec797-c730-4788-b964-382628e3a401.png"
  }
  ```
- **Response**
  ```json
  {
    "accessToken": "JWT 토큰",
    "refreshToken": "JWT 토큰"
  }
  ```
<br />
<br />

- **URL**: `http://{{host}}/auth/login`
- **Description**: 로그인 api 입니다.
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email":"kimhecan@gmail.com",
    "password": "123"
  }
  ```
- **Response**
  ```json
  {
    "accessToken": "JWT 토큰",
    "refreshToken": "JWT 토큰"
  }
  ```
<br />
<br />

- **URL**: `http://{{host}}/auth/token/access`
- **Description**: accessToken을 재발급하는 api 입니다.(refreshToken 까지 재발급합니다.)
- **Method**: `GET`
- **Header**:
  ```json
  {
    "Authorization": "Bearer JWT refresh 토큰"
  }
  ```
- **Response**
  ```json
  {
    "accessToken": "JWT 토큰",
    "refreshToken": "JWT 토큰"
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/auth/token/refresh`
- **Description**: refresh 토큰을 재발급하는 api 입니다.
- **Method**: `GET`
- **Header**:
  ```json
  {
    "Authorization": "Bearer JWT refresh 토큰"
  }
  ```
- **Response**
  ```json
  {
    "refreshToken": "JWT 토큰"
  }
  ```

<br>

#### 이후 api는 기본으로 header에 accessToken을 넣어주셔야 합니다.(공통)

<br>

### User

- **URL**: `http://{{host}}/user/:userId`
- **Description**: 특정 user 정보를 조회할 때 사용합니다. (본인이 아닌 경우 email은 내려오지 않습니다.)
- **Method**: `GET`
- **Response**
  ```json
  {
    "id": 9,
    "email": "kimhecan@gmail.com",
    "name": "김희찬",
    "gender": "Male",
    "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
    "createdAt": "2024-04-30T11:06:29.297Z",
    "updatedAt": "2024-04-30T11:06:29.297Z",
    "deletedAt": null
  }
  ```

  <br>
  <br>

- **URL**: `http://{{host}}/user/profile`
- **Description**: 본인의 프로필을 수정합니다. email은 수정불가합니다(body에 넣어도 무시됨)
- **Method**: `FETCH`
- **Payload**:
  ```json
  {
    "password": "123",
    "name": "김희찬123",
    "gender": "Male",
    "profileImage": "52cec797-c730-4788-b964-382628e3a401.png"
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/post/me`
- **Description**: 자신이 작성한 글 목록을 조회합니다.
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
        "id": 1,
        "title": "title",
        "content": "content",
        "type": "Question",
        "anonymous": false,
        "attachmentUrl": "asdfasdf",
        "createdAt": "2024-04-30T14:05:38.488Z",
        "updatedAt": "2024-04-30T14:05:38.488Z",
        "deletedAt": null
    }
  ]
  ```

<br>
<br>

- **URL**: `http://{{host}}/chat/me`
- **Description**: 자신이 작성한 댓글 목록을 조회합니다.
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
        "id": 4,
        "content": "댓글입니다.",
        "anonymous": false,
        "createdAt": "2024-05-01T12:27:14.095Z",
        "updatedAt": "2024-05-01T12:27:14.000Z",
        "deletedAt": null
    },
    {
        "id": 5,
        "content": "댓글입니다.2",
        "anonymous": true,
        "createdAt": "2024-05-01T12:30:12.338Z",
        "updatedAt": "2024-05-01T12:30:12.000Z",
        "deletedAt": null
    },
    {
        "id": 6,
        "content": "댓글입니다.2 의 댓글",
        "anonymous": true,
        "createdAt": "2024-05-01T12:32:13.655Z",
        "updatedAt": "2024-05-01T12:32:13.655Z",
        "deletedAt": null
    }
  ]
  ```

<br>
<br>

### Space
- **URL**: `http://{{host}}/space`
- **Description**: 공간을 생성합니다.(생성할때 역할과 권한을 설정하고 생성자의 역할도 함께 정합니다.)
- **Method**: `POST`
- **Payload**:
  ```json
  [
    {
      "name": "sapce1",
      "logo": "abc.png",
      "roles": [
          {
            "name": "admin-1",
            "type": "admin"
          },
          {
            "name": "participant-1",
            "type": "participant"
          },
          {
            "name": "participant-2",
            "type": "participant"
          }
        ],
      "myRole": {
        "name": "admin-1",
        "type": "admin"
      }
    }
  ]
  ```

<br>
<br>

- **URL**: `http://{{host}}/space/my-space`
- **Description**: 내가 들어가 있는 공간 리스트를 조회합니다.
- **Method**: `POST`
- **Response**:
  ```json
  [
    {
        "id": 11,
        "name": "sapce1",
        "logo": "abc.png",
        "ownerId": 11,
        "adminCode": "43f81cc7",
        "participantCode": "b8ffa626",
        "createdAt": "2024-05-01T11:45:44.321Z",
        "updatedAt": "2024-05-01T11:45:44.321Z",
        "deletedAt": null,
        "roles": [
            {
                "id": 9,
                "name": "participant-2",
                "type": "participant",
                "createdAt": "2024-05-01T11:45:44.337Z",
                "updatedAt": "2024-05-01T11:45:44.337Z",
                "deletedAt": null
            },
            {
                "id": 8,
                "name": "participant-1",
                "type": "participant",
                "createdAt": "2024-05-01T11:45:44.337Z",
                "updatedAt": "2024-05-01T11:45:44.337Z",
                "deletedAt": null
            },
            {
                "id": 7,
                "name": "admin-1",
                "type": "admin",
                "createdAt": "2024-05-01T11:45:44.332Z",
                "updatedAt": "2024-05-01T11:45:44.332Z",
                "deletedAt": null
            }
        ],
        "myRole": "admin-1"
    }
  ]
  ```

<br>
<br>

- **URL**: `http://{{host}}/space/:spaceId/join`
- **Description**: 공간의 관리자, 참여자 코드를 반환합니다. (소유자만 가능)
- **Method**: `GET`
- **Payload**:
  ```json
  {
    "adminCode": "43f81cc7",
    "participantCode": "b8ffa626"
  }
  ```

<br>
<br>


- **URL**: `http://{{host}}/space/:spaceId/join`
- **Description**: 다른 공간에 참여하는 api 입니다. (참여코드와 권한이 일치해야함)
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "code": "b8ffa626",
    "role": {
        "name": "participant-1",
        "type": "participant"
    }
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/space/:spaceId/owner/:newOwnerId`
- **Description**: 공간의 소유자를 임명하는 api 입니다.(소유자만 가능)
- **Method**: `FETCH`

<br>
<br>

- **URL**: `http://{{host}}/space/:spaceId/user/:userId/role`
- **Description**: 공간 구성원의 역할을 변경하는 api 입니다. (소유자만 가능)
- **Method**: `FETCH`
- **Payload**:
  ```json
  {
    "role": "participant-2"
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/space/:spaceId`
- **Description**: 공간을 삭제합니다. (소유자만 가능)
- **Method**: `DELETE`

<br>
<br>

### SpaceRole
- **URL**: `http://{{host}}/space/:spaceId/role`
- **Description**: 역할을 삭제합니다.
- **Method**: `DELETE`
- **Payload**:
  ```json
    {
      "role": "admin-1"
    }
  ```

<br>
<br>

### Post

- **URL**: `http://{{host}}/post?spaceId=:spaceId`
- **Description**: 특정 공간에 있는 게시글을 조회합니다.
- **Method**: `GET`
- **Payload**:
  ```json
  [
    {
        "id": 6,
        "title": "질문있어요1",
        "content": "내용입니다.1",
        "type": "Question",
        "anonymous": false,
        "attachmentUrl": "asdfasdf.png",
        "createdAt": "2024-05-02T06:05:36.748Z",
        "updatedAt": "2024-05-02T06:05:36.748Z",
        "deletedAt": null,
        "user": {
            "id": 16,
            "email": "kimhecan3@gmail.com",
            "name": "김희찬3",
            "gender": "Male",
            "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
            "createdAt": "2024-05-02T06:02:56.208Z",
            "updatedAt": "2024-05-02T06:02:56.208Z",
            "deletedAt": null
        },
        "chats": [
            {
                "id": 8,
                "content": "댓글입니다.1",
                "anonymous": true,
                "createdAt": "2024-05-02T06:14:06.248Z",
                "updatedAt": "2024-05-02T06:14:06.000Z",
                "deletedAt": null,
                "user": {
                    "id": 16,
                    "email": "kimhecan3@gmail.com",
                    "name": "김희찬3",
                    "gender": "Male",
                    "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
                    "createdAt": "2024-05-02T06:02:56.208Z",
                    "updatedAt": "2024-05-02T06:02:56.208Z",
                    "deletedAt": null
                },
                "replies": []
            }
        ],
        "isPopular": true,
        "isNew": false,
        "isUpdated": false,
        "hasNewChats": false
    },
    {
        "id": 7,
        "title": "질문있어요2",
        "content": "내용입니다.2",
        "type": "Question",
        "anonymous": false,
        "attachmentUrl": "asdfasdf.png",
        "createdAt": "2024-05-02T06:06:46.909Z",
        "updatedAt": "2024-05-02T06:06:46.909Z",
        "deletedAt": null,
        "user": {
            "id": 16,
            "email": "kimhecan3@gmail.com",
            "name": "김희찬3",
            "gender": "Male",
            "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
            "createdAt": "2024-05-02T06:02:56.208Z",
            "updatedAt": "2024-05-02T06:02:56.208Z",
            "deletedAt": null
        },
        "chats": [],
        "isPopular": true,
        "isNew": true,
        "isUpdated": false,
        "hasNewChats": false
    },
    {
        "id": 8,
        "title": "질문있어요2222",
        "content": "내용입니다.2",
        "type": "Question",
        "anonymous": false,
        "attachmentUrl": "asdfasdf.png",
        "createdAt": "2024-05-02T15:42:15.065Z",
        "updatedAt": "2024-05-02T15:42:15.065Z",
        "deletedAt": null,
        "user": {
            "id": 15,
            "email": "kimhecan2@gmail.com",
            "name": "김희찬2",
            "gender": "Male",
            "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
            "createdAt": "2024-05-02T06:02:50.437Z",
            "updatedAt": "2024-05-02T06:02:50.437Z",
            "deletedAt": null
        },
        "chats": [
            {
                "id": 9,
                "content": "댓글입니다.1",
                "anonymous": true,
                "createdAt": "2024-05-02T15:42:29.236Z",
                "updatedAt": "2024-05-02T15:42:29.000Z",
                "deletedAt": null,
                "user": null,
                "replies": []
            }
        ],
        "isPopular": true,
        "isNew": true,
        "isUpdated": false,
        "hasNewChats": false
    }
  ]
  ```

<br>
<br>

- **URL**: `http://{{host}}/post/:postId?spaceId=:spaceId`
- **Description**: 특정 공간에 있는 특정 게시글을 조회합니다.
- **Method**: `GET`
- **Payload**:
  ```json
  {
    "id": 4,
    "title": "질문있어요",
    "content": "내용입니.",
    "type": "Question",
    "anonymous": true,
    "attachmentUrl": "asdfasdf.png",
    "createdAt": "2024-05-01T12:07:48.878Z",
    "updatedAt": "2024-05-01T12:07:48.878Z",
    "deletedAt": null,
    // 익명게시글인 경우 && (관리자 또는 본인이 아닌 경우)
    "user": null,
    "chats": [
        {
            "id": 4,
            "content": "댓글입니다.",
            "anonymous": false,
            "createdAt": "2024-05-01T12:27:14.095Z",
            "updatedAt": "2024-05-01T12:27:14.000Z",
            "deletedAt": null,
            "user": {
                "id": 12,
                "email": "kimhecan12@gmail.com",
                "name": "김희찬12",
                "gender": "Male",
                "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
                "createdAt": "2024-05-01T11:32:00.602Z",
                "updatedAt": "2024-05-01T11:32:00.602Z",
                "deletedAt": null
            },
            "replies": [
                {
                    "id": 6,
                    "content": "댓글입니다.2 의 댓글",
                    "anonymous": true,
                    "createdAt": "2024-05-01T12:32:13.655Z",
                    "updatedAt": "2024-05-01T12:32:13.655Z",
                    "deletedAt": null,
                    "user": {
                        "id": 12,
                        "email": "kimhecan12@gmail.com",
                        "name": "김희찬12",
                        "gender": "Male",
                        "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
                        "createdAt": "2024-05-01T11:32:00.602Z",
                        "updatedAt": "2024-05-01T11:32:00.602Z",
                        "deletedAt": null
                    }
                }
            ]
        },
        {
            "id": 5,
            "content": "댓글입니다.2",
            "anonymous": true,
            "createdAt": "2024-05-01T12:30:12.338Z",
            "updatedAt": "2024-05-01T12:30:12.000Z",
            "deletedAt": null,
            "user": {
                "id": 12,
                "email": "kimhecan12@gmail.com",
                "name": "김희찬12",
                "gender": "Male",
                "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
                "createdAt": "2024-05-01T11:32:00.602Z",
                "updatedAt": "2024-05-01T11:32:00.602Z",
                "deletedAt": null
            },
            "replies": []
        },
        {
            "id": 6,
            "content": "댓글입니다.2 의 댓글",
            "anonymous": true,
            "createdAt": "2024-05-01T12:32:13.655Z",
            "updatedAt": "2024-05-01T12:32:13.655Z",
            "deletedAt": null,
            "user": {
                "id": 12,
                "email": "kimhecan12@gmail.com",
                "name": "김희찬12",
                "gender": "Male",
                "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
                "createdAt": "2024-05-01T11:32:00.602Z",
                "updatedAt": "2024-05-01T11:32:00.602Z",
                "deletedAt": null
            },
            "replies": []
        }
    ]
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/post?spaceId=:spaceId`
- **Description**: 특정 공간에서 게시글을 생성합니다.
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "title": "질문있어요",
    "content": "내용입니다.",
    "type": "Question",
    "anonymous": true,
    "attachmentUrl": "asdfasdf.png"
  }
  ```

<br>
<br>

- **URL**: `http://{{host}}/post/:postId?spaceId=:spaceId`
- **Description**: 특정 공간에서 게시글을 삭제합니다(관리자 또는 본인만 가능)
- **Method**: `DELETE`

<br>
<br>

### Chat

1. 유저는 게시글을 클릭하여 내부 댓글 목록을 조회할 수 있습니다.
2. 모든 사용자는 자유롭게 게시글에 댓글을 작성할 수 있습니다.
3. 모든 사용자는 댓글에 답글을 달 수 있습니다.
4. 댓글은 "관리자" 또는 "작성자"만 삭제할 수 있습니다.
5. 댓글 또한 익명 상태로 작성하는 것이 가능합니다.
    1. 익명 댓글에 대한 제약사항은 기본적으로 익명 게시글의 제약사항과 동일합니다.



- **URL**: `http://{{host}}/chat?postId=:postId`
- **Description**: 특정 게시글에 댓글을 작성합니다.
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "content": "댓글입니다.",
    "anonymous": false,
    // 대댓글인 경우
    "parentId": 1
  }
  ```

<br>
<br>


- **URL**: `http://{{host}}/chat/:chatId?spaceId=:spaceId&postId=:postId`
- **Description**: 특정 댓글을 삭제합니다.
- **Method**: `DELETE`


<br>
<br>

### 신규 기능, 인터랙션

- **URL**: `http://{{host}}/interaction/curious/:postId?spaceId=:spaceId`
- **Description**: 게시글에 "저도 궁금해요"를 누루면 보내지는 api입니다. (이미 해당글에 누른상태에서 누루면 softDelete 됩니다.)
- **Method**: `POST`

<br>
<br>

- **URL**: `http://{{host}}/interaction/like/:chatId?spaceId=:spaceId`
- **Description**: 댓글에 "좋아요"를 누루면 보내지는 api입니다. (이미 해당글에 누른상태에서 누루면 softDelete 됩니다.)
- **Method**: `POST`


<br>
<br>

- **URL**: `http://{{host}}/interaction/statistic?spaceId=:spaceId`
- **Description**: 인터랙션들에 대한 통계정보입니다.
    - 공간 내에서 본인이 평균 대비 얼마나 인터랙션을 보냈는가 / 받았는가
      - `averageInteractionPerUser`는 공간내에서 일어난 평균 인터랙션 수입니다. (보낸 평균과 받은 평균은 같음)
      - `userSentInteractionCount`는 유저가 보낸 인터랙션 수 입니다.
      - `userReceivedInteractionCount`는 유저가 받은 인터랙션 수 입니다.
    - 공간 내에서 본인이 속한 역할에 대해 본인이 평균 대비 얼마나 인터랙션을 보냈는가 / 받았는가
      -  `rolesInteractions`에서 본인이 속한 역할의 인터렉션과 `userSentInteractionCount`, `userReceivedInteractionCount`를 비교하면 됩니다.
    - 공간 내에서 역할 별로 얼마나 인터랙션을 보냈는가 / 받았는가
      - `rolesInteractions`를 전체 돌면 됩니다.
- **Method**: `GET`
- **Response**:
  ```json
    {
      "rolesInteractions": [
          {
            "role": "admin-1",
            "interaction": {
                "send": 6,
                "receive": 1
            }
          },
          {
            "role": "participant-1",
            "interaction": {
                "send": 2,
                "receive": 7
            }
          },
          {
            "role": "participant-2",
            "interaction": {
                "send": 0,
                "receive": 0
            }
          }
      ],
      "userRole": "participant-1",
      "userSentInteractionCount": 2,
      "userReceivedInteractionCount": 7,
      "averageInteractionPerUser": 3
    }
  ```