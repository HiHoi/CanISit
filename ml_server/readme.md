# 착좌 감지 시스템
1층 오픈스튜디오의 혼잡도 계산을 위해, 테이블, 사람, 앉아있는 사람, 빈 의자를 인식하는 시스템입니다.

# 기술 스택
 - Python 3.9
 - YOLOv8 (Machine Learning, Object Dectection)
 - OpenCv2 (Computer Vision)
 - FastAPI (REST API)
 - NumPy (Mathematical)

# API
Media Type: application/json

```python3
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
	image: base64.encode(img)
}	
```

# 실행
ultralytics package는 **curr <= Python 3.9** 가 필요합니다.

```shell
pip install -r requirments.txt
python main.py
```
