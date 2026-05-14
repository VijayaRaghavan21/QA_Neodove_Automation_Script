
Feature: Pipeline Scenarios

Scenario:Edit Pipeline
Given Navigate to the Pipeline
When  Edit the Pipeline
Then  Updated the Pipeline Sucessfully


Scenario:With Existing Pipeline Name , The New Pipeline Should not create
Given Navigate to the Pipeline
When Using the Create Pipeline , Enter the exiting pipeline name and create
Then It should display an error message "Pipeline already exists, kindly update the name and try again."

Scenario:Delete Pipeline
Given Navigate to the Pipeline
When Clicking on Edit Pipeline , Delete the Pipeline
Then Pipeline Should be deleted Sucessfully 

 Scenario: Creating a new Pipeline for Campaing Creation
    Given Navigate to settings page , Open the Pipeline Tab
    When Using the Create Pipeline , Adding the Pipeline
    Then I should see the Pipeline in the Pipeline list