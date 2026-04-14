import { Given, When, Then } from '@cucumber/cucumber';
import { Pipelinecreation } from '../pages/Pipelinecreation.js';
import { AUTOMATION_CONSTANTS } from '../enums/enum.js';

/** @typedef {import('../support/hooks.js').CustomWorld} World */

Given(
    'Navigate to settings page , Open the Pipeline Tab',
    /** @this {World} */ async function () {
        try {
            this.pipelinecreation = new Pipelinecreation(this.page);

            await this.pipelinecreation.navigate_to_pipeline_creation_page();

            await this.attach('Navigated to Pipeline Creation Page', 'text/plain');

        } catch (err) {

            console.error('Step failed:', err.message);

            await this.attach('Step failed: ' + err.message, 'text/plain');

            throw err;

        }
    }
);

When('Using the Create Pipeline , Adding the Pipeline', /** @this {World} */ async function () {
    try {
        await this.pipelinecreation.create_new_pipeline(AUTOMATION_CONSTANTS.PIPELINE_NAME);
        await this.attach('Pipeline Created Successfully', 'text/plain');
    } catch (err) {
        console.error('Step failed:', err.message);
        await this.attach('Step failed: ' + err.message, 'text/plain');
        throw err;
    }
});

Then(
    'I should see the Pipeline in the Pipeline list',
    /** @this {World} */ async function () {
        try {
            await this.pipelinecreation.pipeline_creation_verification(
                AUTOMATION_CONSTANTS.PIPELINE_NAME
            );

            await this.attach(
                'Pipeline Creation Verified in the List',
                'text/plain'
            );
        } catch (err) {
            console.error('Step failed:', err.message);
            await this.attach('Step failed: ' + err.message, 'text/plain');
            throw err;
        }
    }
);
