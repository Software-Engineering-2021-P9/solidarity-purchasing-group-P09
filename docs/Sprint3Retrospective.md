# TEMPLATE FOR RETROSPECTIVE (Team ##)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done
- Total points committed vs done
- Nr of hours planned vs spent (as a team)

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |         | -      |            |              |
| n     |         |        |            |              |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review
  - Total hours estimated
  - Total hours spent
- Technical Debt management:
  - Total hours estimated
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours estimated for remediation by SonarQube only for the selected and planned issues
  - Hours spent on remediation
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )

## ASSESSMENT

- What caused your errors in estimation (if any)?

1. The biggest problem during this sprint was the we technical debt we accumulated in the last sprints. We are going too fast and this causes little analysis errors that become big after some weeks.
   For example, in order to start the biggest task of the sprint we had to finish a dependent task that should've been finished in the last sprint. This obviously caused a delay and the former task is still in progress.

- What lessons did you learn (both positive and negative) in this sprint?

1. It's hard to share the same global vision for all the team members. Development must be slowed down a little bit, to improve accuracy in decisions. The best way to handle this situation is to keep everyone aligned and reduce the gap between the individual and the global vision.

2. Nobody have to work on their own, following their individual vision.

3. Adriana is a UI monster designer

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
