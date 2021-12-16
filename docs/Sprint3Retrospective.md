# TEMPLATE FOR RETROSPECTIVE (Team ##)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done  -> 5 stories done out of 7 stories(2 of them from previous sprint 1 is done)
- Total points committed vs done -> 13 points done out of 20
- Nr of hours planned vs spent (as a team) -> Nr of hours planned is 111h and spent 115h 35m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |     15    | -      |     78h 40m       |       80h       |
|*[Insufficient Balance Reminder](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-8) |     2    |    2    |   4h        |    1h          |
|*[Product given to client](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-4) |     1    |    3    |   15m        |    0h          |
|[Schedule bag delivery](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-43) |     1    |    2    |   3h 30m         |    8h          |
|[Schedule pick-up](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-44) |     1    |    2    |   3h         |    4h         |
|[Check orders pending cancelation](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-10) |     2    |    3    |   8h         |   9h 30m         |
|[Browse availability](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-37) |     1    |    3    |   3h 30m         |    3h         |
|[Confirm booking](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-48) |     2    |    5    |   9h         |    10h         |


- * corresponds the stories from the previous sprint


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average=4h 30m, standard deviation= 4.01
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table=110h 40m / 115h 35m = 0.958 

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated = 8h
  - Total hours spent = 6h
  - Nr of automated unit test cases = 108
  - Coverage (if available) = 81.3%
- E2E testing:
  - Total hours estimated = 4h
  - Total hours spent = 4h
- Code review
  - Total hours estimated  = 10h
  - Total hours spent = 5h 30m
- Technical Debt management:
  - Total hours estimated = 5h 30m
  - Total hours spent = 6h
  - Hours estimated for remediation by SonarQube  = 2m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues = 2m
  - Hours spent on remediation = 3h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") = 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) all A

## ASSESSMENT

- What caused your errors in estimation (if any)?

1. The biggest problem during this sprint was the we technical debt we accumulated in the last sprints. We are going too fast and this causes little analysis errors that become big after some weeks.
   For example, in order to start the biggest task of the sprint we had to finish a dependent task that should've been finished in the last sprint. This obviously caused a delay and the former task is still in progress.

- What lessons did you learn (both positive and negative) in this sprint?

1. It's hard to share the same global vision for all the team members. Development must be slowed down a little bit, to improve accuracy in decisions. The best way to handle this situation is to keep everyone aligned and reduce the gap between the individual and the global vision.

2. Nobody have to work on their own, following their individual vision.

- Which improvement goals set in the previous retrospective were you able to achieve?

1. We did daily scrums and kept ourselves updated on the situation (not daily, but we also did asynchronous updates).
2. The formatter now works well and the reviews are not too big of a mess.

- Which ones you were not able to achieve? Why?

1. Github tools and email notifications are not suitable for us, in this situation. Telegram group works better.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

1. Improve accuracy in the thinking of big stories, spending more time on their design.
2. Try foresee better if there will be dependency issues that cause the inability to start a scheduled task.
3. We need to finish coding and do reviews sooner than the end of the sprint.

- One thing you are proud of as a Team!!

1. We keep improving and we learn how to use different technologies every time.
2. Our code is extremely organised
