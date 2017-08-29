# Probot: Lock &mdash; Unmaintained

> a GitHub Integration built with [Probot](https://github.com/probot/probot) that locks the conversation of old PRs.

This was originally constructed for a much earlier version of Probot. It is unmaintained and can be considered archived.

## Setup

```
# Install dependencies
npm install

# Run the bot
npm run
```

For more information, see the [documentation for probot](https://github.com/probot/probot).

## Configuration

This bot will not take action unless a `.github/lock.yaml` file exists in the repository to which it is installed. This file can also include the following configuration values:

* `daysUntilLock` &mdash; The number of days of inactivity required before the bot will lock the conversation on closed pull requests
* `lockComment` &mdash; The text to post in a comment before locking qualifying pull requests
* `perform` &mdash; `true` to perform locking, `false` to only log what would have been locked

See `lib/defaults.js` for the defaults to all of these values.

## Deploying to Heroku

1. [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy) - Click this button and pick an **App Name** that Heroku is happy with. Before you can complete this, you'll need config variables from the next step.
1. In another tab, [create an integration](https://github.com/settings/integrations/new) on GitHub, using `https://[yourappname].herokuapp.com/` (replacing `[yourappname]` with the name from step 1) as the **Homepage URL**, **Callback URL**, and **Webhook URL**. The permissions and events that your bot needs access to will depend on what you use it for. Read more about [creating an integration](https://developer.github.com/early-access/integrations/creating-an-integration/).
1. After creating your Github integrations, make sure that you click the green install button on the top left of the integration page. This gives you an option of installing the integration on all or a subset of your repositories.
1. Go back to the Heroku tab and fill in the configuration variables with the values for the GitHub Integration. You will need to fill in these values as heroku config vars: **INTEGRATION_ID** (found on your integration page) , **PRIVATE_KEY** (copy paste the the downloaded `private-key.pem`, when you created a key for your integration), **WEBHOOK_SECRET** (as set on the integration page).
