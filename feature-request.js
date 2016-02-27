Features = new Mongo.Collection("features");
var updatePriority = function (maxPriority) {
    var optionsHtmls = '';
    for (var i = 1; i <= maxPriority + 1; i++) {
        optionsHtmls += '<option>' + i + '</option>';
    };
    $('#clientPriority').html(optionsHtmls);
}

var findUpdatePriority = function (client) {
    clientWithMaxPriority = Features.findOne({'client': client}, {sort : {clientPriority: -1}, limit: 1});
    var maxPriority = 0;
    if (clientWithMaxPriority) {
        maxPriority = clientWithMaxPriority.clientPriority;
    }
    updatePriority(maxPriority);
}

TabularTables = {};

TabularTables.Features = new Tabular.Table({
  name: "Features",
  collection: Features,
  order: [[6, "desc"]],
  columns: [
    {data: "title", title: "Title"},
    {data: "description", title: "Description"},
    {data: "client", title: "Client"},
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
          findUpdatePriority(this.client);
          Features.remove(this._id);
        },
        "click .edit": function () {
          formData = Features.findOne({_id : this._id});
        }
    });
    Template.newFeatureForm.helpers({
        fromData: function(){
                return {};
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
        "change #client" : function(event) {
            client = event.target.value;
            findUpdatePriority(client);
        },
        "submit .new-feature": function(event) {
            // Prevent default browser form submit
            event.preventDefault();

            // Get value from form element
            var title = event.target.title.value;
            var description = event.target.description.value;
            var client = event.target.client.value;
            var clientPriority = parseInt(event.target.clientPriority.value);
            var targetDate = event.target.targetDate.value;
            var url = event.target.url.value;
            var productArea = event.target.productArea.value;
            Meteor.call("updateOldPriority" , {'client' : client, 'clientPriority' : clientPriority});
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
        findUpdatePriority('Client A');
    });
}
Meteor.methods({
    updateOldPriority : function(obj){
        Features.update({
                client: obj.client,
                clientPriority : { $gt : obj.clientPriority}
            }, {
                $inc: {clientPriority: 1}
            });
    }
})
