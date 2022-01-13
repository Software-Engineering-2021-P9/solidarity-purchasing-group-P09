TEMPLATE FOR RETROSPECTIVE (Team P9)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 5 stories done out of 5 stories committed 
- Total points committed vs done: 30 points done out of 30 committed
- Nr of hours planned vs spent (as a team): 112 hours spent out of 110h

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0 | 21 | |81h |  73h|
|   [Check unretrieved food](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-120)    | 4       |    5 |      10h 30m    |        16h 15m    |
| [Alert frequent missed pickups](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-121)   |  2       |  5|      6h     |    6h       |
|  [Telegram update products available](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-119)    | 1|  13    |    3h 30| 4h 30m         | 
|  *[Insufficient Balance Reminder](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-8) |  2 |2| 6 h |  9h 15m
| *[Confirm booking](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-48)     |       2  |      5|      3h     |       5h 30m      |
   
> '*' refers to story from previous sprint
> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average =  1.95, standard deviation = 1.16
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 110/112= 0,982

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 7h 30m
  - Nr of automated unit test cases: 172
  - Coverage (if available): 90.9%
- E2E testing:
  - Total hours estimated: 4h 30m
  - Total hours spent: 5h
- Code review 
  - Total hours estimated:  8h
  - Total hours spent: 8h 15m
- Technical Debt management:
  - Total hours estimated: 16h 15m
  - Total hours spent: 16h
  - Hours estimated for remediation by SonarQube: 0m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues:  0m 
  - Hours spent on remediation: 2h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): all 'A'
  

## ASSESSMENT

- What caused your errors in estimation (if any)?

1. One of the biggest underestimation was about the manager page: we did not know any library to create and show graphs. We did not create a task to learn and find that library. The tests had some problems, and it slowed the back-end tasks. Also we want to make our front-end more refined so it took a little bit more time than expected.

- What lessons did you learn (both positive and negative) in this sprint?

1. Since everybody know better the codebase, it was easier to communicate between front and back end. Also it was easier to make minor and effective adjustments in the code .

2. We learned to use the right tools for communicating, so PR request & review were done faster.
3. We planned less stories than usual, giving us more time to fix  previous problems, and finishing all the planned stories

- Which improvement goals set in the previous retrospective were you able to achieve?

1. For the telegram bot, we created a task just to learn how it works, so the design of it was more effective and truthful.
2. We splitted the biggest story into more specific tasks, making it easier to better identify design errors.
3. The tasks were successfully design to not be dependent from other task.
- Which ones you were not able to achieve? Why?

1. We were not able to finish coding and reviewing sooner, mostly due to the holidays

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

1. If there was another sprint we should start earlier working, since we always started late.

- One thing you are proud of as a Team!!

1. We keep improving and we learn how to use different technologies every time.
2. Our code is extremely organised
3. Our front end is very beautiful!
