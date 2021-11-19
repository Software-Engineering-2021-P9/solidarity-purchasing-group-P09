TEMPLATE FOR RETROSPECTIVE (Team P9##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 3 stories done out of 5 stories committed 
- Total points committed vs done: 19 points done out of 27 committed
- Nr of hours planned vs spent (as a team): 114h 05m hours spent out of 113h

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| #0 | 10 | |71 h 30 m | 57 h|
|   [Enter new client](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-2)    | 2       |    5 |      8 h    |        15 h    |
| [Enter client order](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-1)     |       2  |      8 |       10 h     |       15 h 30 m      |
| [Wallet top-up](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-5)   |  2       |  8     |      10 h     |    8 h 50m       |
|  [Product given to client](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-4)    | 2         |  3    |    7 h 30 m         | 6 h 30 m         | 
|   [Browse products in shop](https://polito-se2-21-09.myjetbrains.com/youtrack/issue/S202109SPG-3) |  2 |3 | 6 h | 11 h 15 m
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation): average =  5.704, standard deviation = 3.136
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 113/114 = 0.991

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3.5
  - Total hours spent: 2.5
  - Nr of automated unit test cases: 35
  - Coverage (if available): 90.1%
- E2E testing:
  - Total hours estimated: 1
  - Total hours spent: 1
- Code review 
  - Total hours estimated: 7 
  - Total hours spent: 4h 45m
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube: 4 m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 4 m 
  - Hours spent on remediation: 0 h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): all 'A'
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
We overestimated our velocity by a little. We spent some time to build a valid base architecture, and we understimated the time to get confortable with it. 

- What lessons did you learn (both positive and negative) in this sprint? 
Reviews take time, and also we need to insert a deadline to open a pull request and ask for a review (To give time to other team members to organize their time).  Spending a little time for design helps a lot.

- Which improvement goals set in the previous retrospective were you able to achieve?
We were able to define a usefull template for writing understandable coding for everyone and spent time for design and planning in advance
  
- Which ones you were not able to achieve? Why? 
We did not do enough Daily scrums, because we did think it was not necessary for how the work was going on

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

1) We should align our work through daily scrums.
2) Defining a deadline for opening PR reviews
3) When someone need help (s)he should ask to everyone 
4) Everyone should be more present when somebody needs help

- One thing you are proud of as a Team!!
1) We work very hard and never give up. 
2) We can learn new thing really fast.
3) We solve internal conflicts (personal and code related) with calm. 
4) We used new technologies (handlers, shared-validators, OpenAPI, FIGMA)
