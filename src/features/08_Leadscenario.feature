Feature: Add lead into campaign and perform lead actions
  Scenario: Add Walk-In leads into the Campaign and verify in Lead Summary
    # --- Step 1: Create Pipeline (reuse existing pipeline creation flow) ---
    Given a Pipeline has been created for Leads Scenario

    # --- Step 2: Create Campaign named "Leads Scenario Campaign" ---
    And Choosing the Pipeline where to Create the Campaign
    And Click on Create Campaign
    And Give the Name for Leads Scenario Campaign
    And Choosing the Users to assign inside the Campaign
    And Choosing the Lead Distribution type
    And Campaign should create successfully

    # --- Step 3: Add 10 Walk-In leads via Actions → Add Lead ---
    When the user adds 10 Walk-In leads into the Campaign via Actions

    # --- Step 4: Verify leads are shown inside the Campaign ---
    Then all Walk-In leads should be displayed inside the Campaign

    # --- Step 5: Go to Lead Summary, verify and print phone numbers ---
    And the Lead Summary should show all added phone numbers

  Scenario: Verify the walk-in lead coming in Start Calling and disposing the lead with not connected
    Given Switch to Dialer Portal
    And Go to My campaign
    When Click on Lead Scenario Campaign Start Calling
    Then Dispose upto 5 leads and verify they are the created Walk-In leads
    And Take a Break and refresh the page
    And Switch back to Admin portal

  Scenario: Verify the lead disposition call logs present in Admin portal
    Given Navigate to the Leads Scenario Pipeline
    And Go to the Lead Scenario Campaign
    When Go to Call Logs
    And Go to Classic View
    Then Verify whether 5 disposition leads are present

  Scenario: Verify the campaign lead distribution count
    Given I navigate to the Leads Scenario Pipeline
    And I navigate to the Lead Scenario Campaign
    When I check the lead count in the campaign distribution
    Then the lead count should be displayed according to the lead status

 