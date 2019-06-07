//load all users with city equals
setTimeout(() => {
  console.log(window.loggedUser);
}, 3000);
window.loadAllUserCity = ({city, userId}) => {
  db.collection("users")
    .where("city", "==", city)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        //empty
      } else {
        querySnapshot.forEach(function(doc) {
          console.log(doc.data());
          if(doc.data().id !== userId) {
            appendRow(doc.data());
          }
        });
        //load data;
      }
    });
};

const appendRow = profile => {
  $("#profile-listings").append(`
    <div class="profile-box col-sm-12 col-md-6 col-lg-4">
          <div class="row">
            <div class="col-4 profile-box-image">
              <img
                src=${profile.profilePicture}
                alt=${profile.firstName}
                class="img-thumbnail" />
            </div>
              <div class="col-8 profile-box-description">
                <p>${profile.firstName} ${profile.lastName}</p>
                <p>${profile.role} at ${profile.company}</p>
                <p>${profile.neighborhood}, ${profile.city}</p>
              </div>
            </div>
          <div class="row">
              <a href="http://www.google.com" class="btn btn-primary">Say Hi</a>
          </div>
        </div>`);
};
