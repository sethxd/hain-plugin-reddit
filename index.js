'use strict'

const _ = require('lodash');
const http = require('http');
const req = require('request');

module.exports = (pluginContext) => {
  const shell = pluginContext.shell

  function search (query, res) {
    const query_trim = query.trim()
    console.log(query);

    if (query_trim.length === 0) {
      return
    }

    res.add({
      id: query_trim,
      payload: 'search',
      title: query_trim,
      desc: 'Search all of reddit for "' + query + '"'
    })

    let subs = "http://api.reddit.com/subreddits/search?q=" + query_trim;
    console.log(subs);
    req.get(subs, function(data) {
      console.log(data);
      data = _.take(data, 5).map((x) => {
       return {
         id: x['data']['children']['data']['url'],
         payload: 'subreddit',
         title: x['data']['children']['data']['url'],
         desc: "Go directly to the " + x['data']['children']['data']['title'] + " subreddit.",
         icon: "#fa fa-bookmark"
       };
       res.add(data);
     })
   });


  }

  function execute (id, payload) {
    if (payload == 'search') {
      shell.openExternal(`https://www.reddit.com/search?q=${id}`);
    } else if (payload == 'subreddit') {
      shell.openExternal(`https://www.reddit.com${id}`);
    } else {
      return
    }

  }

  return { search, execute }
}
