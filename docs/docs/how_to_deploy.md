# Deployment procedures

### Feature development
* Features are developed on a feature branch and will be merged to the develop branch directly
* UI reviews should happen on different hosting environments (staging)

## Staging Deployment
When a feature is finished it should be deployed to staging
1. Smoke test on DEV
1. Collect number of features and fixes and update changelog public/data/changelog accordingly
1. Merge changelog to develop
1. Run yarn `set-version` and follow the instructions (amend the commit and push changes)
1. Pull staging branch to local
1. Merge develop branch into staging branch and push to INT Environment
1. OPTIONAL (on INT Account): Run the necessary dataScripts to update dynamoDB tables
1. OPTIONAL Go to AppSync, edit the schema by adding a space (somewhere to force a change) and save.
1. Once the deployment pipleline is green. Smoke test the new feature on [Staging](https://qa.dpp-poc.de/)

## Integration Deployment
### Date & time
* Date and time for the deployment: 
  * standard: friday in the week of the sprint review, 10:00-11:00am 💨
  * hotfixes: "anytime" --> sync with VW
* The whole dev team should block 2h for the deployment
* The team will communicate to VW that the deployment has been finished

### Testing
* E2E tests were running against the staging environment
* Feature Freeze for staging branch
* Have a smoke test session on staging environment [Staging](https://qa.dpp-poc.de/) sth like 15-30 minutes with the whole team
* Smoke test all failed E2E test cases

### Deployment
1. On INT: Run the necessary dataScripts to update dynamoDB tables
1. On INT: Create PR from staging to integration and merge (MAKE SURE TO NOT DELETE THE SOURCE BRANCH)
1. Once the deployment pipleline is green. Smoke test [INT](https://integration.dpp-poc.de/)
1. Go to AppSync Integration, edit the schema by adding a space (somewhere to force a change) and save.
1. Inform VW via Email that the deployment is finished

🎉🎉🎉  last step: post a party parrot after the deployment 🦜🦜🦜
