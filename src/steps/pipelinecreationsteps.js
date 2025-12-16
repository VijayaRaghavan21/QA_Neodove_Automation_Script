import { Given, When, Then } from '@cucumber/cucumber';
import { Pipelinecreation } from '../pages/pipelinecreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

Given(
    'Navigate to settings page , Open the Pipeline Tab',
    async function () {
        this.pipelinecreation = new Pipelinecreation(this.page);

        await this.pipelinecreation.navigate_to_pipeline_creation_page();

        await this.attach('Navigated to Pipeline Creation Page', 'text/plain');
    }
);

When('Using the Create Pipeline , Adding the Pipeline', async function () {
    await this.pipelinecreation.create_new_pipeline(AUTOMATION_CONSTANTS.PIPELINE_NAME);
    await this.attach('Pipeline Created Successfully', 'text/plain');
}
);

Then(
    'I should see the Pipeline in the Pipeline list',
    async function () {
        await this.pipelinecreation.pipeline_creation_verification(
            AUTOMATION_CONSTANTS.PIPELINE_NAME
        );

        await this.attach(
            'Pipeline Creation Verified in the List',
            'text/plain'
        );
    }
);
