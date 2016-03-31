'use strict'

const _ = require('lodash');
const got = require('got');

module.exports = (pluginContext) => {
  const shell = pluginContext.shell
  const logger = pluginContext.logger;

  function search(query, res) {
    const query_trim = query.trim()

    if (query_trim.length === 0) {
      return
    }

    res.add({
      id: query_trim,
      payload: 'search',
      title: query_trim,
      desc: 'Search all of reddit for "' + query + '."'
    })

    let subs = "https://api.reddit.com/search?q=" + query_trim + "&type=sr";

    got(subs)
      .then(response => {
        let data = JSON.parse(response.body);
        data = data.data.children;
        data = _.take(data, 5).map((x) => {
          return {
            id: x.data.url,
            payload: 'subreddit',
            title: '<b>' + x.data.url + '</b> - <span style="color:blue; font-size:0.8em;">' + x.data.subscribers + ' subscribers</span>',
            desc: 'Go directly to the "' + x.data.display_name + '" subreddit.',
            icon: "#fa fa-sign-in"
          };
        });
        res.add(data);
    })
  }

  function execute(id, payload) {
    if (payload == 'search') {
      shell.openExternal(`https://www.reddit.com/search?q=${id}`);
      return;
    } else if (payload == 'subreddit') {
      shell.openExternal(`https://www.reddit.com${id}`);
      return;
    } else {
      return;
    }

  }

  return {
    search,
    execute
  }
}
