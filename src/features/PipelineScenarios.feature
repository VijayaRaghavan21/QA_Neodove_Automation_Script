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
Given Navigate to Pipeline
When  Edit the Pipeline , Clicking on Delete
Then Pipeline Should be deleted Sucessfully 

