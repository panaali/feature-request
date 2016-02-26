if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    features: [
      { text: "This is feature 1" },
      { text: "This is feature 2" },
      { text: "This is feature 3" }
    ]
  });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
