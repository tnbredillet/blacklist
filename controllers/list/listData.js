var models = require(__dirname + "/../../models");

module.exports = function(req, res) {

  var List = models.List
  var listId = req.param('listId', null)
  var layout = req.param("layout", null)
  var metaData = req.metaData
  var User = models.User
  var Vote = models.Vote

  new List({
    id: listId
  }).fetch({
    withRelated: ['users', 'votes']
  }).then(function(list) {
    var users           = list.related("users").toJSON()
    var votes           = list.related("votes").toJSON()
    var list            = list.toJSON()
    var user            = new User()
    var rankArray       = user.findRankArray(votes)
    var current_user_id = metaData.current_user.id
    var results         = {}
    results.totalPeople            = users.length
    results.listName               = list.name
    results.listId                 = list.id
    results.latestVotes            = new Vote().getLatestVotes(votes,users)
    results.currentUser_Points     = user.findPointsOnListFromRankArray(current_user_id, rankArray)
    results.currentUser_PointsLeft = user.getPointsLeft(current_user_id, votes)
    results.currentUser_Rank       = user.findRank(current_user_id, rankArray, results.totalPeople)
    results.percentage             = 100-(results.currentUser_Rank / results.totalPeople) * 100
    results.votesThisWeek          = user.votesThisWeek(current_user_id, votes)

    mostHated = user.mostHated( users , votes );

    results.users = [];
    for (var i in users) {
      var userHash = {}
      userHash.user = users[i]
      var user_id = userHash.user.id
      userHash.userPoints = user.findPointsOnListFromRankArray(user_id, rankArray)
      userHash.currentUser_PointsLeft = results.currentUser_PointsLeft
      userHash.userRank = user.findRank(user_id, rankArray, results.totalPeople)
      userHash.votesThisWeek = user.votesThisWeek(user_id, votes)
      userHash.mostHatedD = ( mostHated[0].id == users[i].id )
      userHash.mostHatedW = ( mostHated[1].id == users[i].id )
      userHash.mostHatedM = ( mostHated[2].id == users[i].id )
      results.users.push(userHash);
    }
    results.users.sort(function(a, b) {
      return a.userRank - b.userRank
    });

    if (layout) {
      res.render("list/_list", {
        layout: false,
        metaData: req.metaData,
        results: results
      });
    } else {
      res.render("list/_list_home", {
        layout: false,
        metaData: req.metaData,
        results: results
      });
    }


  })

};