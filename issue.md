# FLOW FORM
    This application is considered to be an alternative of Google Form, so the features that exist in Google Form should be included. This application must provide essencial features that doesn't exist in Google Form. At the top of that this application should be lightweight and easy to use.

# Form Feature Specifications

## 1. PDF Upload & Auto Form Generation

Users can upload a PDF file, and the system will automatically convert the PDF content into a form using external AI APIs.

### Expected Behavior

* User uploads a PDF document.
* The system processes the document using AI.
* Questions are automatically generated based on the PDF content.
* Generated questions can still be edited manually by the form creator.

---

## 2. Timer

This optional feature allows the form creator to set a time limit for responders.

### Expected Behavior

* The timer starts when a responder opens the form.
* Remaining time is displayed during the session.
* When the timer reaches zero, the form session ends.

---

## 3. Auto Send

This optional feature automatically submits the form when the timer expires.

### Expected Behavior

* Requires the Timer feature to be enabled.
* If time runs out, the form is automatically submitted.
* Unanswered questions remain empty.

---

## 4. Focus Tab Mode

This optional security feature prevents responders from switching browser tabs during the form session.

### Expected Behavior

* If the responder switches to another browser tab or window:

  * The current form progress is reset.
  * The timer continues running and does not reset.
* Forms with Focus Tab Mode enabled cannot use the Auto Save feature.

### Restrictions

* Incompatible with Auto Save.

---

## 5. Auto Save

This optional feature automatically saves responder progress periodically.

### Expected Behavior

* Answers are saved every few seconds.
* Responders can continue later without losing progress.

### Restrictions

* Cannot be enabled together with Focus Tab Mode.

---

## 6. Auto Shuffle

This optional feature randomizes question order for each responder.

### Expected Behavior

* Questions are shuffled when the form is opened.
* Each responder may receive a different question order.

---

## 7. Scoring

This optional feature enables automatic or manual scoring for form responses.

## Scoring Variants

### A. Manual Scoring

The form creator manually assigns score values to each question.

#### Expected Behavior

* Each question can have a custom score value.
* Total score has no maximum limit.
* Scores are fully controlled by the form creator.

---

### B. Auto Scoring

The system automatically calculates scores equally across questions.

#### Expected Behavior

* Total score is fixed at 100.
* Score per question is calculated as:

Score per Question = 100 / Total Counted Questions

* The form creator can exclude certain questions from score calculation.

Example:

* Total questions: 10
* Counted questions: 5
* Score per counted question: 20

---

## 8. Leaderboard

If Scoring is enabled, the form creator can access a leaderboard page.

### Expected Behavior

* Responses are ranked from highest to lowest score.
* The leaderboard displays:

  * Responder name or identifier
  * Total score
  * Submission time
  * Ranking position


# BACKEND

## Modular Architecture Library

Because using Next.js, there is no index file that running on server. Instead, all backend logic are inside path [lib/be/]. Inside that use modular architecture that separate form and user module. All modules share one database [lib/be/db]