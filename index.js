const yaml = require('js-yaml');

const Lock = require('./lib/lock');
const paginate = require('./lib/paginate');

// Check for Issues and PRs to lock every hour
const INTERVAL = 60 * 60 * 1000;

module.exports = async robot => {
  // Check for lockables at startup
  check();

  setInterval(check, INTERVAL);

  async function check() {
    robot.log.info('Checking for lockable pull requests');

    const github = await robot.integration.asIntegration();

    return github.integrations.getInstallations({}).then(paginate(github, installations => {
      return installations.map(checkInstallation);
    }));
  }

  async function checkInstallation(installation) {
    const github = await robot.auth(installation.id);

    return github.integrations.getInstallationRepositories({}).then(paginate(github, data => {
      data.repositories.forEach(async repo => {
        const lock = await forRepository(github, repo);
        return lock.markAndSweep();
      });
    }));
  }

  async function forRepository(github, repository) {
    const owner = repository.owner.login;
    const repo = repository.name;
    const configPath = '.github/lock.yaml';
    let config;

    try {
      const data = await github.repos.getContent({owner, repo, configPath});
      config = yaml.load(new Buffer(data.content, 'base64').toString());
    } catch (err) {
      robot.log.error(err, 'An error occurred reading the configuration');

      // Don't actually perform for repository without a config
      config = {perform: false};
    }

    robot.log.debug(config, 'Configuration loaded')

    config = Object.assign(config, {owner, repo, logger: robot.log});

    return new Lock(github, config);
  }
};
