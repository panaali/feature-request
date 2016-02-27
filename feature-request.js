Features = new Mongo.Collection("features");
TabularTables = {};

TabularTables.Features = new Tabular.Table({
  name: "Features",
  collection: Features,
  order: [[6, "desc"]],
  columns: [
    {data: "title", title: "Title"},
    {data: "description", title: "Description"},
    {data: "clientPriority", title: "Client Priority"},
    {data: "targetDate", title: "Target date"},
    {data: "url", title: "Url"},
    {data: "productArea", title: "Product Area"},
    {
      data: "createdAt",
      title: "Create Date",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).calendar();
        } else {
          return "Never";
        }
      }
    },
    {
      tmpl: Meteor.isClient && Template.featureEditCell
    }
  ]
});

if (Meteor.isClient) {
    Template.tabular.events({
         "click .remove": function () {
          Features.remove(this._id);
        }
    });
    Template.body.helpers({
        features: function() {
            return features.find({}, {
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
            var client = event.target.client.value;
            var clientPriority = event.target.clientPriority.value;
            var targetDate = event.target.targetDate.value;
            var url = event.target.url.value;
            var productArea = event.target.productArea.value;

            // Insert a task into the collection
            Features.insert({
                title: title,
                description: description,
                client: client,
                clientPriority: clientPriority,
                targetDate: targetDate,
                url: url,
                productArea: productArea,
                createdAt: new Date() // current time
            });

            // Clear form
            event.target.title.value = "";
            event.target.description.value = "";
        }
    });

    Template.newFeatureForm.onRendered(function() {
        this.$('.datetimepicker').datetimepicker({
            format: 'YYYY-MM-DD'
        });
    });
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
