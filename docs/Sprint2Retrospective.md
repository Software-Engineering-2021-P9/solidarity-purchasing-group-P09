TEMPLATE FOR RETROSPECTIVE (Team P09)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 4 stories done out of 6 stories committed (2 stories from the previous sprint, 1 done and 1 not)
- Total points committed vs done: 20 points done out of 25 point committed
- Nr of hours planned vs spent (as a team): 117 hours spent out of 112 hours

**Remember**  a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story                                                        | # Tasks | Points | Hours est. | Hours actual |
| ------------------------------------------------------------ | ------- | ------ | ---------- | ------------ |
| _#0_                                                         | 11      | -      | 59h 30m    | 51h 20m      |
| *[Enter new client](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-2) | 1       | 5      | 4h         | 5h           |
| *[Product given to client](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-4) | 1       | 3      | 3h 30m     | 4h           |
| [Registration](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-6) | 4       | 5      | 16h 30m    | 24h 30m      |
| [Book](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-7) | 2       | 5      | 5h 30m     | 6h           |
| [Insufficient Blance Reminder](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-8) | 2       | 2      | 9h         | 11h          |
| [Report availability](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-9) | 3       | 5      | 14h        | 14h 55m      |

\* user stories from the previous sprint

- Hours per task (average, standard deviation): average = 5.85, standard deviation = 3.36 
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table = 0.957

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 7 hours
  - Total hours spent: 8 hours 
  - Nr of automated unit test cases: 72 
  - Coverage (if available): 79.1 %
- E2E testing:
  - Total hours estimated: 3 hour
  - Total hours spent: 3 hour
- Code review 
  - Total hours estimated:  4 hours
  - Total hours spent: 3 hours 30 minutes
- Technical Debt management:
  - Total hours estimated: 10 hours
  - Total hours spent: 6 hours 15 minutes 
  - Hours estimated for remediation by SonarQube: 2 minutes
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 2 minutes
  - Hours spent on remediation: 20 minutes
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): all 'A'


## ASSESSMENT

- What caused your errors in estimation (if any)?

  As in the previous sprints, we overestimated our velocity but not as much as the other times, this trend is improving. In particular, during this sprint, we made a big estimation error related to the login part, which wasn't implemented in the first sprint. In the middle of the sprint, we realised that this part was very important because our application is thought to be used by different users (with different roles). So most of the tasks were blocked until the login part was done and this took more time than we expected during the planning. 

- What lessons did you learn (both positive and negative) in this sprint?

  During the first sprint we realised that having a design behind us is very important, in fact the first thing we did was to update the GUI and API design according to the new user stories. But we learned that the design is also related to the user flow of actions and, especially in our case, to permissions and diversification based on the user's role. 

  We also learned that we need more reviewers because otherwise we spend more time waiting for a review rather than working on the task. This also caused that some stories were not committed in time even if they were ready.  

- Which improvement goals set in the previous retrospective were you able to achieve? 

  One of the goals we were able to achieve is talking more in our Telegram group and asking for help if necessary. We were also able to respect the deadline for opening PRs that was 3 days before the sprint demo. 

- Which ones you were not able to achieve? Why?

  We weren't able to do daily scrums even if asynchronously and that slowed the overall group work. 

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

1. Daily scrums (for real this time!!).
2. We have to align our Prettier code formatter, in order to make it easier for the reviewer to see relevant changes
3. We have to learn how to use the Github tools in a proper way (selection of PR reviewers, changes requested, re-review requested, ...)

- One thing you are proud of as a Team!!

1. We keep improving and we learn how to use different technologies every time.
2. Our code is extremely organised