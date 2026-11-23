## Context

The project has Spectra configuration and a spec directory. This change introduces its first public web page.

## Goals / Non-Goals

**Goals:**

- Introduce 平帳 and let visitors calculate and clear an equal split on desktop and mobile.

**Non-Goals:**

- Account access, payment collection, expense history, and distributing fractional remainders are outside this release.

## Decisions

### Use a static form

Use native HTML, CSS, and JavaScript. A labeled form keeps the calculator keyboard-operable and lets the page run from static hosting.

### Display approximate shares to two decimal places

Show exact shares without unnecessary trailing zeroes. When shares require rounding to cents, mark the result with 約 so the displayed amounts are understood as estimates.

## Implementation Contract

- In scope: Landing page, calculator validation, result display, reset, and browser tests.
- Out of scope: Backend services, persistence, and individual allocations for remainders.
- The form exposes 總金額 and 人數 fields with 計算 and 清空 buttons. Calculation displays one result or a field-specific error, replacing prior feedback. Reset clears both inputs and all feedback and returns focus to 總金額.
- Accept a positive total with at most two fractional digits and a positive integer headcount. Keep amounts in cents during calculation and use half-up rounding for a fractional cent.
- Verify the scenarios in specs/equal-split-calculator/spec.md and inspect the form on desktop and mobile for visible controls and readable feedback.

## Risks / Trade-offs

Rounded shares can leave a remainder when multiplied by the headcount. The approximate label communicates that the tool shows an estimate for each person.
