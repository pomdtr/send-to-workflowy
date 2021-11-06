const utils = {
  parseCookies: (cookies) =>
    cookies
      ? Object.fromEntries(
          cookies
            .split('; ')
            .map((x) => x.split(/=(.*)$/, 2).map(decodeURIComponent))
        )
      : {},
  ensureArray: function (val) {
    return Array.isArray(val) ? val : [val];
  },
  getTimestamp: function (meta) {
    return Math.floor(
      (Date.now() -
        meta.projectTreeData.mainProjectTreeInfo.dateJoinedTimestampInSeconds) /
        60
    );
  },
  makePollId: function () {
    return (Math.random() + 1).toString(36).substr(2, 8);
  },
  httpAbove299toError: function ({ response: resp, body }) {
    var status = resp.statusCode;
    if (
      !(
        status === 302 &&
        ['/', 'https://workflowy.com/'].includes(resp.headers.location)
      )
    ) {
      if (300 <= status && status < 600) {
        throw new Error(
          `Error with request ${resp.request.uri.href}:${status}`
        );
      }
      if (body.error) {
        throw new Error(
          `Error with request ${resp.request.uri.href}:${body.error}`
        );
      }
    }
    return;
  },
  handleErr(reason) {
    while (reason.reason) {
      reason = reason.reason;
    }
    if (reason.status == 404) {
      console.log(
        "It seems your sessionid has expired. Let's log you in again."
      );
      return auth();
    } else {
      console.log(`Error ${reason.status}: `, reason.message);
      process.exit(1);
    }
  },
  findAllBreadthFirst(topLevelNodes, search, maxResults) {
    const queue = [].concat(topLevelNodes);
    let nodes = [];
    while ((node = queue.shift())) {
      if (node && search(node)) {
        nodes.push(node);
      } else if (node && node.ch && node.ch.length) {
        queue.push(...node.ch);
      }
      if (nodes.length == maxResults) {
        break;
      }
    }
    return nodes;
  },

  makeChildren(str) {
    const makeOne = (str = '') => {
      const cut = (str = '', char = '') => {
        const pos = str.search(char);
        return pos === -1
          ? [str, '']
          : [str.substr(0, pos), str.substr(pos + 1)];
      };
      const outdent = (str = '') => {
        const spaces = Math.max(0, str.search(/\S/));
        const re = new RegExp(`(^|\n)\\s{${spaces}}`, 'g');
        return str.replace(re, '$1');
      };
      const [nm, ch] = cut(str, '\n');
      return { nm, ch: this.makeChildren(outdent(ch)) };
    };
    const sanitize = (str = '') => {
      return str.trim().replace(/\n\s*\n/g, '\n');
    };
    return str === ''
      ? []
      : sanitize(str)
          .split(/\n(?!\s)/)
          .map(makeOne);
  },
};

module.exports = utils;
