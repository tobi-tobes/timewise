# TimeWise
A Focus Timer and Productivity Aid

## Table of Contents
- [Introduction](#introduction)
    * [The Project](#the-project)
    * [The Team](#the-team)
- [Getting Started](#getting-started)
    * [Installation](#installation)
    * [Usage](#usage)
    * [The Stats Dashboard](#the-stats-dashboard)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction
### The Project
*TimeWise* is the ALX Specializations Portfolio Project of Oluwatobi Tijani. It is a productivity aid that limits your access to certain websites of your choosing for a time period that you select so you can work on the browser without distractions. You can choose from a list of pre-set timers or create your own time session.

### The Team
- Oluwatobi Tijani: [Github](https://github.com/tobi-tobes), [LinkedIn](https://www.linkedin.com/in/oluwatobi-tijani/)

## Getting Started
### Installation
*TimeWise* will soon be available for download from the Chrome Web Store. In the meantime, to use *TimeWise*, simply clone the repository to your local machine. Once the repo is on your machine, on Google Chrome, go to the menu icon at the end of the browser toolbar. Hover over `Extensions`, and click on `Manage Extensions` as shown in the picture below:

![Navigating to Chrome Extensions](https://i.imgur.com/3oaplqS.png)

You will be redirected to the Extensions page. Enable `Developer mode`, and then click on `Load unpacked`. This will allow you to upload *TimeWise* to your Extensions store. When File Explorer comes up, upload the `timewise` folder itself.

![Uploading TimeWise to your Extension Store](https://i.imgur.com/reuIqjl.png)

You can also pin the extension to your toolbar for easy access. And with that, *TimeWise* is installed on your browser!

### Usage
To use *TimeWise*, click on the extension's icon on your toolbar. The extension will open on another tab. On the first page, click on a preset timer or create a custom time.

![Pick a pre-set time or create a custom time](https://i.imgur.com/pxwudaf.png)

![Use the sliders to select a time and click it](https://i.imgur.com/e2fR5BP.png)

On the Timer Configuration page, toggle between strict and non-strict mode. If you choose strict mode, you will not be able to pause or end the timer before the end of the duration. Put the websites you want to block during your session in the textarea, separated by a comma. Then you can start the session.

![The timer configuration page](https://i.imgur.com/kHwVLks.png)

### The Stats Dashboard
An important part of the *TimeWise* extension is the stats dashboard, which is accessible from the `STATS` link on the extension, or you can access it from [here](https://tobi-tobes.github.io/timewise/).

![The stats dashboard - daily view](https://i.imgur.com/13Vf2QH.png)

The stats dashboard gives you a breakdown of your usage stats on the extension. You can view how many sessions you've completed overall, the average length of your sessions, and the total length of breaks taken. You can also get a daily and weekly view of your usage on the extension. There's also functionality to set a daily goal that you want to achieve each day on the extension.

![The stats dashboard - weekly view](https://i.imgur.com/D6fio6r.png)

## Contributing
Your contributions are always welcome! Since we use GitHub Flow, all code changes happen through pull requests:
1. Fork the repo and create your branch from `master`
2. If you've added code that should be tested, make sure to add tests to the `tests` directory (create an appropriate sub-directory)
3. If you've made changes to the extension or the stats dashboard, be sure to update the README documentation
4. Make sure that all tests pass!
5. Make sure that your code is `ESLint` (JavaScript) approved!
6. Issue your pull request!

Some further guidelines:
- We use GitHub Issues to track bugs. Feel free to report a bug by opening up a new issue. Bug reports should be detailed, including background and sample code.

Thank you again for thinking of contributing to this project! And many thanks to GitHub user @briandk for the [contributing template](https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62)!

## License
MIT License

## Acknowledgments
The external libraries listed below were extremely beneficial in the creation of TimeWise. Many thanks to the developers working on these projects. Check them out:
- [dyCalendarJS](https://www.dyclassroom.com/dycalendarjs/introduction): Create a calendar for your blog and website.
- [Chart.js](https://www.chartjs.org/): Simple yet flexible JavaScript charting library for the modern web.
