Features = new Mongo.Collection("features");
TabularTables = {};

TabularTables.Features = new Tabular.Table({
  name: "Features",
  collection: Features,
  columns: [
    {data: "title", title: "Title"},
    {data: "description", title: "Description"},
    {
      data: "lastCheckedOut",
      title: "Last Checkout",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).calendar();
        } else {
          return "Never";
        }
      }
    },
    {
      tmpl: Meteor.isClient && Template.bookCheckOutCell
    }
  ]
});

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        features: function() {
            return Features.find({}, {
                sort: {
                    createdAt: -1
                }
            });
        }
    });

    Template.body.events({
        "submit .new-feature": function(event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var title = event.target.title.value;
            var description = event.target.description.value;

            // Insert a task into the collection
            Features.insert({
                title: title,
                description: description,
                createdAt: new Date() // current time
            });

            // Clear form
            event.target.title.value = "";
            event.target.description.value = "";
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
