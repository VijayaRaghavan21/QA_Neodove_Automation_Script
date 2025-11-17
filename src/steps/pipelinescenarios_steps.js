import { PipelineScenarios } from "../pages/pipelinescenarios.js";
import { Given, When, Then } from "@cucumber/cucumber";



Given('Navigate to the Pipeline', async function () {


    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.page.waitForTimeout(2000);

    await this.pipelinescenarios.navigate_to_pipeline_page();

    await this.attach('Navigated to Pipeline Scenarios Page', 'text/plain');
});


When('Edit the Pipeline', async function () {

    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.edit_existing_pipeline();

    await this.attach('Existing Pipeline Edited Successfully', 'text/plain');
});


Then('Updated the Pipeline Sucessfully', async function () {


    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.verify_pipeline_update_success();
    await this.attach(
        'Pipeline Update Verified with Success Message',
        'text/plain'
    );
});
