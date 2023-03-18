import base64
import numpy as np
import cv2
from ultralytics import YOLO
from fastapi import FastAPI

app = FastAPI()
# name of classes
names = {
    0: 'person',
    1: 'bicycle',
    2: 'car',
    3: 'motorcycle',
    4: 'airplane',
    5: 'bus',
    6: 'train',
    7: 'truck',
    8: 'boat',
    9: 'traffic light',
    10: 'fire hydrant',
    11: 'stop sign',
    12: 'parking meter',
    13: 'bench',
    14: 'bird',
    15: 'cat',
    16: 'dog',
    17: 'horse',
    18: 'sheep',
    19: 'cow',
    20: 'elephant',
    21: 'bear',
    22: 'zebra',
    23: 'giraffe',
    24: 'backpack',
    25: 'umbrella',
    26: 'handbag',
    27: 'tie',
    28: 'suitcase',
    29: 'frisbee',
    30: 'skis',
    31: 'snowboard',
    32: 'sports ball',
    33: 'kite',
    34: 'baseball bat',
    35: 'baseball glove',
    36: 'skateboard',
    37: 'surfboard',
    38: 'tennis racket',
    39: 'bottle',
    40: 'wine glass',
    41: 'cup',
    42: 'fork',
    43: 'knife',
    44: 'spoon',
    45: 'bowl',
    46: 'banana',
    47: 'apple',
    48: 'sandwich',
    49: 'orange',
    50: 'broccoli',
    51: 'carrot',
    52: 'hot dog',
    53: 'pizza',
    54: 'donut',
    55: 'cake',
    56: 'chair',
    57: 'couch',
    58: 'potted plant',
    59: 'bed',
    60: 'dining table',
    61: 'toilet',
    62: 'tv',
    63: 'laptop',
    64: 'mouse',
    65: 'remote',
    66: 'keyboard',
    67: 'cell phone',
    68: 'microwave',
    69: 'oven',
    70: 'toaster',
    71: 'sink',
    72: 'refrigerator',
    73: 'book',
    74: 'clock',
    75: 'vase',
    76: 'scissors',
    77: 'teddy bear',
    78: 'hair drier',
    79: 'toothbrush'
}


# calculate center of two points
def calculate_center(x1, y1, x2, y2):
    center_x = int((x1 + x2) / 2)
    center_y = int((y1 + y2) / 2)
    return [center_x, center_y]


# calculate distance between two points
def calculate_distance(person, chair):
    person = calculate_center(person[0], person[1], person[2], person[3])
    chair = calculate_center(chair[0], chair[1], chair[2], chair[3])
    h = abs(person[1] - chair[1])
    v = abs(person[0] - chair[0])
    return (h ** 2 + v ** 2) ** 0.5


# get sum x, y coordinates of person and chair
def calculate_sum(person, chair):
    return [min(person[0], chair[0]), min(person[1], chair[1]), max(person[2], chair[2]), max(person[3], chair[3])]


# find the nearest person to the chair over threshold
def find_nearest_person(persons, chairs, threshold):
    sitting_center = []
    sitting_box = []
    for chair in chairs:
        distances = []
        for person in persons:
            distances.append(calculate_distance(person, chair))
        if distances and min(distances) < threshold:
            nearest_person_index = distances.index(min(distances))
            sitting_box.append([calculate_sum(persons[nearest_person_index], chair), min(distances)])
            # calculate center x,y of person and chair
            sitting_center.append([calculate_center(persons[nearest_person_index][0],
                                                    persons[nearest_person_index][1],
                                                    persons[nearest_person_index][2],
                                                    persons[nearest_person_index][3]),
                                   calculate_center(chair[0], chair[1], chair[2], chair[3]), min(distances)])
            # remove person and chair from list
            persons.pop(nearest_person_index)
            chairs.pop(chairs.index(chair))
    return [sitting_box, sitting_center]


# index page
@app.get("/")
def root():
    frame_width, frame_height = [1280, 720]

    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, frame_width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, frame_height)

    model = YOLO('yolov8x.pt')

    persons = []
    chairs = []
    tables = []
    ret, frame = cap.read()
    results = model(frame)
    for box in results[0].boxes:
        x1, y1, x2, y2, score, label = box.boxes.tolist()[0]
        x1, y1, x2, y2, label = map(int, [x1, y1, x2, y2, label])

        # if label is person, add to persons list
        if label == 0:
            persons.append([x1, y1, x2, y2])
        # if label is chair, add to chairs list
        elif label in [56, 57]:
            chairs.append([x1, y1, x2, y2])
        # if table
        elif label == 60:
            tables.append([x1, y1, x2, y2])
        # draw other objects
        else:
            center_x = int((x1 + x2) / 2)
            center_y = int((y1 + y2) / 2)
            cv2.circle(frame, (int(center_x), int(center_y)), 20, [255, 0, 0], 2)
            cv2.putText(frame, f"{label}:{names[label]} {score:.2f}", (int(center_x), int(center_y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        [0, 0, 255], 2)

    # get sitting bounding box and center of person and chair
    sitting_box, sitting_center = find_nearest_person(persons=persons, chairs=chairs, threshold=300)
    payload = {
        "resolution": {
            "width": frame_width,
            "height": frame_height
        },
        "data": [

        ],
        "image": ""
    }

    # draw sitting bounding box and append to payload
    for person in sitting_box:
        cv2.rectangle(frame, (person[0][0], person[0][1]), (person[0][2], person[0][3]), [0, 255, 0], 2)
        center_x, center_y = calculate_center(person[0][0], person[0][1], person[0][2], person[0][3])
        payload["data"].append(
            {
                "x": center_x,
                "y": center_y,
                "type": "sitting"
            }
        )

    # draw line between person and chair
    for center in sitting_center:
        cv2.line(frame, (center[0][0], center[0][1]), (center[1][0], center[1][1]), [255, 0, 255], 2)
        calc_center = calculate_center(center[0][0], center[0][1], center[1][0], center[1][1])
        cv2.putText(frame, f"distance: {center[2]:.2f}", (calc_center[0], calc_center[1]),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    [255, 255, 255], 2)

    # draw remain persons and append to payload
    for person in persons:
        center_x, center_y = calculate_center(person[0], person[1], person[2], person[3])
        cv2.circle(frame, (int(center_x), int(center_y)), 20, [0, 0, 255], 2)
        cv2.putText(frame, f"person", (int(center_x), int(center_y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    [255, 255, 255], 2)
        payload["data"].append(
            {
                "x": center_x,
                "y": center_y,
                "type": "person"
            }
        )

    # draw remain chairs and append to payload
    for chair in chairs:
        center_x, center_y = calculate_center(chair[0], chair[1], chair[2], chair[3])
        cv2.circle(frame, (int(center_x), int(center_y)), 20, [0, 255, 255], 2)
        cv2.putText(frame, f"chair", (int(center_x), int(center_y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, [255, 255, 255],
                    2)
        payload["data"].append(
            {
                "x": center_x,
                "y": center_y,
                "type": "chair"
            }
        )

    for table in tables:
        center_x, center_y = calculate_center(table[0], table[1], table[2], table[3])
        cv2.circle(frame, (int(center_x), int(center_y)), 20, [255, 255, 0], 2)
        cv2.putText(frame, f"table", (int(center_x), int(center_y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, [255, 255, 255],
                    2)
        payload["data"].append(
        {
                "x": center_x,
                "y": center_y,
                "type": "table"
            }
        )

    # compress image and encode to base64
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
    success, encoded_image = cv2.imencode('.jpg', frame, encode_param)

    if success:
        encoded_bytes = np.array(encoded_image).tobytes()
        payload["image"] = "data:image/png;base64," + base64.b64encode(encoded_bytes).decode('utf-8')

    cap.release()
    return payload


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main2:app", port=8000, reload=True, host="10.18.246.255")
