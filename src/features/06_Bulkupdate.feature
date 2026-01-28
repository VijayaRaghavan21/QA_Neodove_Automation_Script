Feature: Bulk update verification in Campaign

Scenario:Change lead status to In Progress using bulk update
  Given Go to the Campaign lead summary page
  When I select the lead Summary page
  And Update the lead Stage to inprogress and update the follow up date
  Then all the leads should be updated to In Progress in the lead summary page


Scenario: Follow up leads are coming in the Dialer portal under follow up leads
  Given Switch to Dialer Portal
  When I Click the My Leads
  And I Click on Start Calling under Follow up leads
  Then All Leads Should display in the Start Calling Flow

Scenario: Copy Leads to different Campaign
  Given Switch to admin Portal and select the Pipeline
  When Creating a New Campaign for copy leads
  And Copying Leads from existing campaign to Another Campaign
  Then Verify all the leads are copied to the destination Campaign

@run
Scenario: Move Leads to different Campaign

  Given Switch to admin Portal and select the Pipeline
  When Creating a New Campaign for move leads
  And Move Leads from existing campaign to Another Campaign
  Then Verify all the leads are moved to the destination Campaign

