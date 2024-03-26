const origin = 'https://github.com/itmier/yf-cli';
const comparePath = `${origin}/compare/`;
const commitPath = `${origin}/commit/`;

const logs = [];

module.exports = {
  filters: [
    {
      name: 'Features',
      regExp: /^(?:feat|add):/i,
    },
    {
      name: 'Bugfixes',
      regExp: /^fix:/i,
    },
    {
      name: 'Performance',
      regExp: /^perf:/i,
    }
  ],
  parse(commits){
    // RegExp.prototype.toJSON = RegExp.prototype.toString; // JSON.stringify会调用正则表达式的toJSON
    // return JSON.stringify(commits, null, 2); // output commits

    let output = '';

    commits.forEach((log) => {
      let date = new Date(log.timestamp * 1000);
      date = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).substr(-2)}-${('0' + date.getDate()).substr(-2)}`;

      let currentTag = log.tag || log.commits[0].h;
      let prevTag = log.previousTag || log.commits[log.commits.length - 1].h;
      output += `### [${currentTag}]() (${date})\n\n`;

      log.results.forEach((result) => {
        output += `#### ${result.filter.name}\n`;

        result.commits.forEach((commit) => {
          if (logs.indexOf(commit.s) > -1) return;

          logs.push(commit.s);
          output += `* ${commit.s}\n`;
        });

        output += '\n';
      });

      output += '\n\n';
    });

    return output;
  }
};