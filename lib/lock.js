module.exports = class Lock {
  constructor(github, config = {perform: false}) {
    this.github = github;
    this.config = Object.assign({}, require('./defaults'), config);
    this.logger = config.logger || console;
  }

  async markAndSweep() {
    this.logger.trace(this.config, 'starting mark and sweep');

    this.getLockablePullRequests().then(paginate(this.github, data => {
      data.items.forEach(pull => this.lock(pull));
    }))
  }

  async getLockablePullRequests() {
    const {daysUntilLock, owner, repo} = this.config;
    const timestamp = this.since(daysUntilLock).toISOString().replace(/\.\d{3}\w$/, '');
    const params = {
      q: `repo:${owner}/${repo} is:pr is:closed updated:<${timestamp}`,
      sort: 'updated',
      order: 'desc',
      per_page: 100
    };

    this.logger.debug(params, 'searching %s/%s for lockable pull requests', owner, repo);
    return this.github.search.issues(params);
  }

  lock(pull) {
    const {daysUntilLock, owner, repo, lockComment, perform} = this.config;
    const number = pull.number;

    if (perform) {
      this.logger.info('%s/%s#%d is being locked', owner, repo, number);
      const params = {owner, repo, number, body: util.format(lockComment, daysUntilLock)};

      return this.github.issues.createComment(params).then(() => {
        return this.github.issues.lock(params);
      })
    } else {
      this.logger.info('%s/%s#%d would have been locked (dry-run)', owner, repo, number);
    }
  }

  since(days) {
    const ttl = days * 24 * 60 * 60 * 1000;
    return new Date(new Date() - ttl);
  }
};
