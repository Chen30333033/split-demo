## 1. Implementation

- [x] 1.1 Introduce the calculator and Use a static form in index.html and styles.css with a Traditional Chinese introduction, labeled inputs, and visible controls. Verify the copy and controls through content review. Owner layout acceptance is tracked in 2.1.
  - spectra-exclude: equal-split-calculator / Open the landing page | Static content and control labels are checked by reviewing the page markup.
  - spectra-exclude: equal-split-calculator / Open the landing page / Read the calculator controls | Fixed text and labels are checked by content review.

- [x] 1.2 [after: 1.1] Calculate equal shares, Explain invalid input, and Clear calculator state with script.js. Display approximate shares to two decimal places when rounding is needed. Write browser tests under tests/ before implementing and verify that the new tests fail first and pass after implementation. Cover the exact result, rounded result, zero headcount, empty total, and both reset scenarios.

  - Six behavioral assertions failed before script.js and passed afterward with a simulated form in Node. The owner ran node tests/run-browser-tests.mjs in Windows PowerShell and supplied a screenshot showing all six browser cases passed.

## 2. Owner acceptance

- [x] 2.1 [after: 1.2] Open the page at desktop and phone widths and verify that the title, inputs, controls, and feedback are readable without clipping. Use the keyboard to calculate 900 dollars for 3 people and clear the result.




  - Owner confirmed the 400 × 800 Chrome preview and desktop keyboard calculation and reset.
