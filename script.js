// ----------------------------------------------------------------------------------------------------------------------
// DONT EVEN THINK OF TOUCHING THE BELOW CODE
// ----------------------------------------------------------------------------------------------------------------------


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { get, child, push, update, getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlmLzA13cO7l2-j-DHH_5JSfE-NCujMsk",
  authDomain: "iedc-idea-portal.firebaseapp.com",
  databaseURL: "https://iedc-idea-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iedc-idea-portal",
  storageBucket: "iedc-idea-portal.appspot.com",
  messagingSenderId: "811731150292",
  appId: "1:811731150292:web:55eb85c51d9e7d94516241",
  measurementId: "G-86EX32HX40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

const connectedRef = ref(db, '.info/connected');
onValue(connectedRef, (snapshot) => {
  const connected = snapshot.val();

  if (connected) {
    console.log("Connected");
  }
});



// ----------------------------------------------------------------------------------------------------------------------
// DEFINED FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------------

async function readData(path) {
  const mydata = ref(db, path);
  try {
    const snapshot = await get(mydata);
    const data = snapshot.val();
    return data;
  } catch (error) {
    console.error("Error reading questions:", error);
  }
}

async function fetchCount() {
  const countData = await readData("/write/questions/count");
  console.log("Count is", countData);
  return countData;
}

async function fetchQuestionsAndCreateElements() {
  try {
    let countData = await readData("/write/questions/count");
    const parentDiv = document.getElementById("datalist");

    for (let i = 1; i <= countData; i++) {
      // data
      const elData = document.createElement("div");
      elData.id = `question-${i}`;
      elData.className = `data`;

      // data > data--id
      const elDataId = document.createElement("div");
      elDataId.className = "data--id";

      // data > data--id > h1
      const elDataIdHeading = document.createElement("h1");

      // data > data--info
      const elDataInfo = document.createElement("div");
      elDataInfo.className = "data--info"

      // data > data--info > h1
      const elDataInfoHeading = document.createElement("h1");
      const elDataInfoParagraph = document.createElement("p");

      const questionTitleData = await readData(`/write/questions/question-title-${i}`);
      elDataInfoHeading.textContent = questionTitleData;
      const questionDescData = await readData(`/write/questions/question-desc-${i}`);
      elDataInfoParagraph.textContent = questionDescData;
      elDataIdHeading.textContent = `#${i}`;

      elDataId.appendChild(elDataIdHeading);
      elDataInfo.appendChild(elDataInfoHeading);
      elDataInfo.appendChild(elDataInfoParagraph);
      elData.appendChild(elDataId)
      elData.appendChild(elDataInfo)
      parentDiv.appendChild(elData);
    }
  } catch (error) {
    console.error("Error fetching or creating elements:", error);
  }
}
fetchQuestionsAndCreateElements();

const updateDataList = () => {
  document.getElementById("datalist").innerHTML = "";
  setTimeout(fetchQuestionsAndCreateElements, 2000);
}

const form = document.getElementById("form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  async function writeNewPost() {
    let title = document.getElementById("title");
    let desc = document.getElementById("desc");
    let count = await readData("/write/questions/count");
    count = count + 1
    const postTitle = title.value;
    const postDesc = desc.value;
    const updates = {}
    updates[`/write/questions/question-title-${count}`] = postTitle;
    updates[`/write/questions/question-desc-${count}`] = postDesc;
    updates['/write/questions/count'] = count;
    console.log("uploaded", postTitle)
    console.log("uploaded", postDesc)
    console.log("updated", count)

    if (title.value != null) {
      console.log("you just clicked")
    }

    return update(ref(db), updates);
  }
  writeNewPost()
  await updateDataList();
})

