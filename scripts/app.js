var mockJSON = {
    "_id": "6624c326000581d5944e0ec1",
    "user_id": "507f191e810c19729de860ea",
    "title": "Sample Post Title",
    "content": "This is the content of the sample post.",
    "created_time": "2024-04-21T07:41:26.251Z",
    "__v": 0
}; 

function makeJSON() { 
    let title = mockJSON.title;
    console.log(title);
}

window.onload = makeJSON;