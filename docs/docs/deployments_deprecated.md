# Deployment procedures
## Set of agreements when deploying

As discussed and agreed in https://issues.maibornwolff.de/browse/VDD-788 we want to have a documented procedure for deployments.
The documentation of this procedure lives here:

### Feature development
* Features are developed on a feature branch and will be merged to the default branch directly
* UI reviews should happen on different hosting environments (dev, int)

### Date & time
* Date and time for the deployment: 
  * standard: friday in the week of the sprint review, 10:00-11:00am 💨
  * hotfixes: "anytime" --> sync with VW
* the whole dev team should block 2h for the deployment
* The team will communicate to VW that the deployment has been finished

### Tagging
* Add tag before merging to INT environment
* Make sure tags are pushed

``` 
yarn set-version
```

### Testing
* E2E tests are running against the integration environment
* have a quick smoke test session on the release branch on integration before merging to staging. sth like 15-30 minutes with the whole team


## Step by Step instructions
1. Smoke test on DEV
1. Collect number of features and fixes and update changelog public/data/changelog accordingly
1. Merge changelog to develop
1. Run yarn `set-version` and follow the instructions (amend the commit and push changes)
1. Pull integration to local branch
1. Create a new branch from integration called release/integration/{version_number}
1. Merge DEV develop to release/integration/{version_number} and push to INT Environment
1. On INT: Cancel the automatic deployment from release/integration/{version_number}
1. Change the [environment variable](https://eu-west-1.console.aws.amazon.com/amplify/home?region=eu-west-1#/d23iqg4u8hv3wj/settings/variables) VITE_SHOW_DEVELOPER_LOGIN to true only for release branch
1. Trigger release branch deployment again and do smoke test when it is finished
1. On INT: Run the necessary dataScripts to update dynamoDB tables
1. On INT: Create PR from release/integration/{version_number} to integration and merge
1. Once the deployment pipleline is green. Smoke test [INT](https://integration.dpp-poc.de/)
1. Go to AppSync Integration, edit the schema by adding a space (somewhere to force a change) and save.
1. Inform VW via Email that the deployment is finished


🎉🎉🎉  last step: post a party parrot after the deployment 🦜🦜🦜
