Feature: Filters in Lead Summary Page

  Scenario: Verify the Lead Creation Date filter
    Given I navigate to the Leads Scenario Pipeline
    And I go to the Lead Scenario Campaign
    And I click on the Lead summary
    And I click on the Date filter
    When I apply each filter and verify the Lead creation date matches the selected filter
    Then the Leads should be displayed successfully according to the applied filter

  Scenario: Verify user filter functionality
    Given I navigate to the Leads Scenario Pipeline
    And I go to the Lead Scenario Campaign
    And I click on the Lead summary
    And the user clicks on the "Users" filter
    When the user selects a user from the list
    Then only leads assigned to the selected user should be displayed

  Scenario: Verify Stage filter functionality
    Given I navigate to the Leads Scenario Pipeline
    And I go to the Lead Scenario Campaign
    And I click on the Lead summary
    And I click on the Stage filter
    When I select OPEN stage and apply the filter
    Then all displayed leads should show Lead Stage as OPEN


  Scenario: Verify Filters Lead Status Uncontacted In-Progress and Follow-Up
    Given I navigate to the Leads Scenario Pipeline
    And I go to the Lead Scenario Campaign
    And I click on the Lead summary
    When I apply Filters with Lead Status "Uncontacted"
    Then 5 leads should be displayed with Lead Status "Uncontacted"
    When I apply Filters with Lead Status "In-Progress"
    Then 5 leads should be displayed with Lead Status "In-Progress"
    # Follow-Up is a list filter; Lead Status column still shows In-Progress for these 5 leads
    When I apply Filters with Lead Status "Follow-Up"
    Then 5 leads should be displayed with Lead Status "In-Progress"

  @run
  Scenario: Verify combined Filters for Lead Details phone Lead Status and Stage
    Given I navigate to the Leads Scenario Pipeline
    And I go to the Lead Scenario Campaign
    And I click on the Lead summary
    When I apply combined Filters Contact Number Status In-Progress and Stage OPEN
    Then the filtered lead should display with Lead Status "In-Progress" and Lead Stage "OPEN"
