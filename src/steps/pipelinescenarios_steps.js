import { PipelineScenarios } from "../pages/PipelineScenarios.js";
import { Given, When, Then } from "@cucumber/cucumber";
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';




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

When('Using the Create Pipeline , Enter the exiting pipeline name and create', async function () {
    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.create_pipeline_with_existing_name(AUTOMATION_CONSTANTS.PIPELINE_NAME);
    await this.attach('Pipeline Creation with Existing Pipeline Name', 'text/plain');

});

Then('It should display an error message "Pipeline already exists, kindly update the name and try again."', async function () {
    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.verify_existing_pipeline_error();

    await this.attach("While Creating Pipeline with Existing Name , An Error Message displayed sucessfully", "text/plain");
});

When('Clicking on Edit Pipeline , Delete the Pipeline', async function () {

    this.pipelinescenarios = new PipelineScenarios(this.page);

    await this.pipelinescenarios.edit_existing_pipeline();

    await this.attach('Existing Pipeline Edited Successfully for Deletion', 'text/plain');

}
);

Then ('Pipeline Should be deleted Sucessfully', async function () {

    this.pipelinescenarios = new PipelineScenarios(this.page);  

    await this.pipelinescenarios.delete_existing_pipeline();

    await this.attach('Pipeline Deleted Sucessfully', 'text/plain');

}   
);

