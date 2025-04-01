# Yamif Quiz
## Overview
Yamif Quiz is an Instagram quiz filter designed to add some fun to a wedding reception. It features questions about the couple, giving guests a chance to learn new things about the bride and groom while enjoying the celebration.

## Prerequisites
* Spark AR

## Running the Project
1. Clone the project locally
2. Open the project in Spark AR
3. Run the project

The filter should look something like this.
![Yamif Quiz Demo](./assets/demo.gif)

## Updating the Questions
You can update the list of questions by editing `scripts/questions.js`. It's an array of JSON objects with the following format:

```json
{
  question: "Question here?",
  left: "Left answer",
  right: "Right answer",
  answer: "Right answer"
},
```

| Name | Description |
| --- | --- |
| `question` | The text that will appear on the top box. This should be the question to be answered. |
| `left` | The text that will appear on the left box. |
| `right` | The text that will appear on the right box. |
| `answer` | The answer to the question. It should match either the text in `left` or the text in `right`. |


To answer a question, tilt your head in the direction of the box. The box should be highlighted green if correct, and red if incorrect. A final score is displayed at the end.