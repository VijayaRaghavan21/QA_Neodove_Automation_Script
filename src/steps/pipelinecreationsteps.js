const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { pipelinecreation} = require('../pages/pipelinecreation');
const { AUTOMATION_CONSTANTS } = require('../enums/enum.js');


Given('Navigate to settings page , Open the Pipeline Tab', async function () {
    this.pipelinecreation = new pipelinecreation(this.page);
    await this.pipelinecreation.navigate_to_pipeline_creation_page();
    await this.attach('Navigated to Pipeline Creation Page', 'text/plain');
});

When('Using the Create Pipeline , Adding the Pipeline', async function () {

    await this.pipelinecreation.create_new_pipeline(AUTOMATION_CONSTANTS.PIPELINE_NAME);
    await this.attach('Pipeline Created Successfully', 'text/plain');
});

Then('I should see the Pipeline in the Pipeline list', async function () {
    await this.pipelinecreation.pipeline_creation_verification(AUTOMATION_CONSTANTS.PIPELINE_NAME);
    await this.attach('Pipeline Creation Verified in the List', 'text/plain');

});