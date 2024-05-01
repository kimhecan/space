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
1. 유저는 이메일 / 패스워드를 이용해 로그인할 수 있습니다.
2. 로그인한 유저는 JWT 토큰을 발급 받고, 이후 모든 API에서 본인 인증 수단으로 사용합니다.
3. Access Token의 제한 시간은 한 시간, Refresh Token의 제한 시간은 30일입니다.


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

1. 유저는 이메일, 성, 이름, 프로필 사진을 갖습니다.
2. 다른 유저의 프로필을 조회할 수 있습니다. 단, 다른 유저의 이메일은 조회할 수 없습니다.
3. 유저는 자신의 프로필을 조회하고, 이메일을 제외한 나머지를 수정할 수 있습니다.
4. 유저는 자신이 작성한 글 목록 및 댓글 목록을 모아볼 수 있습니다.


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

1. 클라썸은 여러 공간으로 구성되어 있습니다.
    1. 공간 개설 시, 이름과 로고, 공간 내에서 사용할 역할(SpaceRole)을 함께 설정할 수 있습니다.
2. 유저는 자신이 참여 중인 공간 목록을 조회할 수 있습니다.
3. 유저는 자유롭게 공간을 개설하거나, 다른 공간에 참여할 수 있습니다.
    1. 공간을 개설할 경우, 유저는 소유자로 공간에 참여합니다.
    2. 소유자는 관리자와 같은 역할을 공유하며, 관리자가 지닌 모든 권한을 갖습니다.
    3. 이에 추가로 공간 구성원의 역할을 변경할 수 있는 권한 및 공간을 삭제할 수 있는 권한을 갖습니다.
    4. 소유자는 다른 구성원을 소유자로 임명할 수 있습니다.
4. 개설된 공간은 관리자용 입장 코드와 참여자용 입장 코드를 가집니다.
    1. 코드는 영문 + 숫자의 조합으로 구성된 8자리 고유 문자열입니다.
    2. 유저는 입장 코드를 통해 공간에 참여할 수 있습니다. 이 때 권한은 사용한 코드에 따라 결정됩니다.

<br>

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

1. 모든 공간 구성원들은 단 하나의 역할만 가질 수 있고, 공간 참여 시 권한에 따라 역할을 결정할 수 있습니다.
2. 각 공간은 저마다의 역할 세트를 구성할 수 있습니다.
3. 각각의 역할은 관리자용 역할과 참여자용 역할이 구별되어 있습니다.
`ex) 교수 (관리자) | 조교 (관리자) | 학생 (참여자)`
4. 관리자는 역할을 삭제할 수 있습니다.
    1. 단, 유저가 이미 사용 중인 역할은 삭제할 수 없습니다.

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

1. 공간 내에서는 게시글 목록을 조회할 수 있습니다.
2. 공간 내에서는 자유롭게 게시글을 등록할 수 있으며, 각 게시글에는 파일이나 이미지를 첨부할 수 있습니다.
3. 게시글의 종류에는 "공지"와 "질문" 두 가지가 있습니다.
4. 관리자는 "공지"와 “질문”을 모두 작성할 수 있고, 참여자는 "질문"만 작성할 수 있습니다.
5. “질문" 게시글은 익명 상태로 작성하는 것이 가능합니다.
    1. 단, 익명 상태로 게시글을 작성할 수 있는 것은 “참여자"뿐입니다.
    2. 관리자의 경우, “익명” 게시글의 글쓴이를 확인할 수 있습니다.
    3. 따라서 참여자에게는 게시글 목록 데이터에서 글쓴이의 정보가 존재하지 않아야 합니다. (본인 제외)
6. 게시글은 "관리자" 또는 "작성자"만 삭제할 수 있습니다.
7. 게시글은 다음의 조건에 따라 인기글이 될 수 있습니다.
    1. 인기글은 공간 당 최대 5개 입니다.
    2. 인기글의 조건은 게시글 작성자를 제외한 총 댓글 수 입니다.
    3. 댓글 수가 동일하다면 댓글에 참여한 유저 수로 인기글을 정합니다.

<br>
<br>

- **URL**: `http://{{host}}/post?spaceId=:spaceId`
- **Description**: 특정 공간에 있는 게시글을 조회합니다.
- **Method**: `GET`
- **Payload**:
  ```json
  [
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
        "chats": [],
        "isPopular": true
    },
    {
        "id": 5,
        "title": "질문있어요2",
        "content": "내용입니다.2",
        "type": "Question",
        "anonymous": false,
        "attachmentUrl": "asdfasdf.png",
        "createdAt": "2024-05-01T12:08:58.421Z",
        "updatedAt": "2024-05-01T12:08:58.421Z",
        "deletedAt": null,
        "user": {
            "id": 13,
            "email": "kimhecan123@gmail.com",
            "name": "김희찬123",
            "gender": "Male",
            "profileImage": "52cec797-c730-4788-b964-382628e3a401.png",
            "createdAt": "2024-05-01T11:44:17.013Z",
            "updatedAt": "2024-05-01T11:44:17.013Z",
            "deletedAt": null
        },
        "chats": [],
        "isPopular": true
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
