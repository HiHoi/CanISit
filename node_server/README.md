# Node Server
프론트 서버와 이미지 분석 서버 사이에서 데이터를 가공 및 전달
data time 생성


# 기술 스택
- node.js v19.8.1
- node.js express 4.18.2
- REST API

# API
- request(get /data)
- Media Type: application/json
```
response = {
	resolution: {
		width: int,
		height: int
	},
	data: [
		{
			x: float,
			y: float
			type: str
		}
	],
	image: base64.encode(img),
        timestamp: unix time,
        time: str(ko-KR)
}	
```

# 실행
```
git clone https://github.com/HiHoi/CanISee.git
cd ./CanISee/node_server
npm start
```
