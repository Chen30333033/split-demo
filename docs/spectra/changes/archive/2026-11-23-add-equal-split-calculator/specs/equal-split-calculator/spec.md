## Purpose

Help visitors calculate equal shares for a shared expense on the 平帳 landing page.

## ADDED Requirements

### Requirement: Introduce the calculator

The landing page SHALL identify itself as 平帳, explain equal splitting, and provide labeled total and participant fields with calculation and clear controls.

#### Scenario: Open the landing page

- **WHEN** a visitor opens the landing page
- **THEN** the page displays 平帳, a short introduction, and the calculator fields and controls

##### Example: Read the calculator controls

- **GIVEN** the visitor opens index.html
- **WHEN** the page loads
- **THEN** the page shows 平帳 and controls labeled 總金額, 人數, 計算, and 清空

### Requirement: Calculate equal shares

The form SHALL divide a positive total in New Taiwan dollars by a positive integer participant count. It SHALL accept at most two decimal places for the total and display amounts rounded half up to the nearest cent, with 約 when the share is rounded.

#### Scenario: Calculate an exact share

- **WHEN** the visitor enters 900 dollars and 3 participants and submits
- **THEN** the page displays 每人應付 300 元 and clears any previous error

#### Scenario: Calculate a rounded share

- **WHEN** the visitor enters 100 dollars and 3 participants and submits
- **THEN** the page displays 每人約 33.33 元

### Requirement: Explain invalid input

The form SHALL show a field-specific error for a missing or invalid value and clear any previous share.

#### Scenario: Reject a zero headcount

- **WHEN** the visitor enters 900 dollars and 0 participants and submits
- **THEN** the page displays 人數必須是大於 0 的整數 and no share

#### Scenario: Reject an empty total

- **WHEN** the visitor leaves the total empty, enters 3 participants, and submits
- **THEN** the page prompts for a valid positive total and displays no share

### Requirement: Clear calculator state

The form SHALL clear both inputs and all feedback and return keyboard focus to the total when the visitor activates 清空.

#### Scenario: Clear a displayed result

- **WHEN** a visitor calculates 900 dollars for 3 participants and activates 清空
- **THEN** both inputs and the result are empty and focus returns to the total

#### Scenario: Clear a validation error

- **WHEN** a visitor submits 900 dollars for 0 participants and activates 清空
- **THEN** both inputs and the validation error are empty and focus returns to the total

