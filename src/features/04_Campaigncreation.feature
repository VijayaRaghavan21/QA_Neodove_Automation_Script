

Feature: Creating a New Campaign and Adding leads inside the Campaign

Scenario: Create New Campaign
  Given Choosing the Pipeline where to Create the Campaign
  When Click on Create Campaign
  And Give the Name for Campaign 
  And Choosing the Users to assign inside the Campaign
  And Choosing the Lead Distribution type 
  Then Campaign should create successfully

Scenario: Add Leads to the Campaign

Given Upload Leads After Campaign Creation
When Mapping the Fields the with the Column in the excel
Then Lead Should Upload successfully
