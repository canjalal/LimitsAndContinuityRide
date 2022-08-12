# LimitsAndContinuityRide
An app to explore limits and continuity

Background

Learn about limits and continuity! Given a random function plotted on screen, click any points on the graph to explore the different types of limits and discontinuity.
Finally, fix the ride by patching each discontinuity the right way.

Functionality

In Limits and Continuity Ride, users will be able to:

1.) Generate and plot a piecewise continuous function between x = -10 and x = 10, and (excluding near vertical symptotes) y = -10 and y = 10.
2.) Be able to request a left-limit check, right-limit check, full-limit check, function defined, continuity. They can also do global checks like
whether a y-value is in the range, and end behavior. All of this will be visualizable.
4.) They can customize the function based on how many discontinuities and of which type and any horizontal asymptotes they want.
5.) They can go into game mode where they patch another random function with "bridges" over discontinuities. When they click test, a cart will ride across the screen.
    If it makes it to the other end of the screen, they win, otherwise the cart will fall off and people die.

In addition, this project will include
1.) A splash screen with 2 modes + screen to generate custom function
2.) An instruction screen specific to each mode
3.) Icons of a little person running left / right, looking up / down, icons of a bridge (fixes vertical asymptotes), ramp (fixes jumps), tie (fixes removable discontinuity)
4.) A button and options to generate a random curve using Canvas on a set of axes
5.) Clickable points that will zoom in to a modified graph/axes and a different side menu (see wireframe)

Wireframe

At this Google Jamboard:
https://jamboard.google.com/d/1ulXo6nA1B1f3nOWoBK3pvFIbIggpmrb_U2y-vO2zlyo/viewer?f=0
For the sake of brevity, the quiz will be removed, and possibly the game mode, the minimal viable product will be the explore mode and function plotting/generating
with animations of the different function tests

Technologies, Libraries, and APIs

Chart.js, possibly function-plot (https://mauriciopoppe.github.io/function-plot/, uses D3) if Chart.js is too high level
Canvas

Implementation Timeline
Friday:
- Familiarization with implementing Chart.js and/or function-plot, plotting own functions
- Write mathematical functions and programming reasoning for horizontal asymptotes, vertical asymptotes, random removable discontinuities, and jump discontinuities
that ensure continuity and differentiability (smoothness) at each point
- Write plan for modules (CSS files, JS files) and pages
- Ask questions about sources like graphics

Weekend:
- Procure / draw graphics, design UI, and write HTML / CSS

Monday:
- Finish HTML/CSS
- Write animations
- Write transitions, events, JavaScript

Tuesday:
- Finish core functionality
- Testing, debugging

Wednesday:
- Refactoring, making things prettier
- Writing Google Slides

Thursday morning:
- practicing Google Slides