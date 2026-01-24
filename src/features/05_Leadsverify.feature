

Feature: Leads Verification

  Scenario: Validate uploaded Excel data appears correctly inside the campaign
    Given Opening the lead Summary page inside the campaign
    When All the Leads will Display
    Then Confirm the Lead in the Excel File are displayed inside the campaign
    Then Verify All the Leads in Start Calling flow in Dialer Portal
