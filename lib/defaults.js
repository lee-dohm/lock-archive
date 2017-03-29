module.exports = {
  daysUntilLock: 14,
  lockComment: 'Because this pull request is closed and hasn\'t seen further activity in %d days, it is ' +
               'considered finished. Please open a new issue if there are any concerns with the ' +
               'changes introduced here.',
  perform: !process.env.DRY_RUN
};
