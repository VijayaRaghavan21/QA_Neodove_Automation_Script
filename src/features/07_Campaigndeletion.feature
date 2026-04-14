@run
Feature: Delete the created campaign and pipeline

  Scenario: Delete the Campaign
    Given Go to the pipeline
    When Select the checkbox and delete the campaign
    Then Campaign should be deleted successfully

  Scenario: Delete the Pipeline
    Given Navigate to the Pipeline
    When Clicking on Edit Pipeline , Delete the Pipeline
    Then Pipeline Should be deleted Sucessfully
