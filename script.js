var config = {
  apiKey: "AIzaSyDWjo68NKTNSKU9CBIRVEkrWo2_Pt7Lb_Q",
  authDomain: "frendly-e4639.firebaseapp.com",
  databaseURL: "https://frendly-e4639.firebaseio.com",
  projectId: "frendly-e4639"
};
firebase.initializeApp(config);
var db = firebase.firestore();
const serviceApi = "https://frendly.herokuapp.com";

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
const getQuery = getUrlVars(window.location.search);

//get accesstoken
$(document).ready(() => {
  const accessToken = window.localStorage.getItem("identity");

  const getUserProfile = accessToken => {
    fetch(`${serviceApi}/me`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: accessToken })
    })
      .then(async response => {
        //get html element then edit
        const result = await response.json();
        if (result) {
          checkIfExistingUser(result);
        }
      })
      .catch(e => console.error(e));
  };

  if (getQuery.code && !accessToken) {
    fetch(`${serviceApi}/getToken`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: getQuery.code,
        origin: window.location.origin,
        pathname: window.location.pathname
      })
    })
      .then(async response => {
        //get html element then edit
        const result = await response.json();
        if (result) {
          window.localStorage.setItem("identity", result.access_token);
          getUserProfile(result.access_token);
        }
      })
      .catch(e => console.error(e));
  } else {
    getUserProfile(accessToken);
  }
});

//save data to database
const saveNewUser = data => {
  const profilePhotoalter =
    data.profilePicture["displayImage~"].elements[2]["identifiers"][0][
      "identifier"
    ];
  data.profilePicture = profilePhotoalter;

  db.collection("users")
    .doc(data.id)
    .set(data)
    .then(function(docRef) {
      console.log("Document written with ID: ");
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
};

window.updateUser = (data) => {
  db.collection("users")
    .doc(data.id)
    .update(data)
    .then(function(docRef) {
      console.log("Document updated with ID: ");
    })
    .catch(function(error) {
      console.error("Error updating document: ", error);
    });
}

const checkIfExistingUser = user => {
  try {
    db.collection("users")
      .doc(user.id)
      .onSnapshot(doc => {
        if (doc.data()) {
          console.log("Document found with ID: ");
          const user = doc.data();
          const firstName = user.firstName || 'friend';
          const lastName = user.lastName || 'lastname';
          const city = user.city || 'city';
          const title = user.role || 'role';
          const company = user.company || 'company';
          const userAvatar = user.profilePicture || '/images/avatar-blank.jpeg';

          $(".firstName").text(firstName);
          $(".lastName").text(lastName);
          $(".city").text(city);
          $(".title").text(title);
          $(".company").text(company);
          $("#profileImage").attr('src', userAvatar);
          window.loadAllUserCity({city, userId: user.id});
          window.loggedUser = {
            firstname: firstName,
            lastname: lastName,
            email: user.email,
            id: user.id,
            city
          }
        } else {
          const payload = {
            firstName: user.firstName.localized.en_US,
            lastName: user.lastName.localized.en_US,
            city: "",
            role: "",
            company: "",
            id: user.id,
            email: user.elements[0]["handle~"]["emailAddress"],
            profilePicture: user.profilePicture
          };
           window.loggedUser = {
            firstname: payload.firstName,
            lastname: payload.lastName,
            email: payload.email,
            id: payload.id
          }
          // saveNewUser(payload);
        }
      });
  } catch (error) {
    console.log(error);
  }
};

//check if on 
