const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");

async function measureBotLoadingTime() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open the website containing the bot
    await driver.get(
      "https://c25.avaamo.com/web_channels/3041d293-0ca7-4996-a66c-16b12eae713e/demo.html?custom_properties[contactID]=003Em00000BEP2QIAX&debug=true"
    );

    // Click on the bot to start loading
    let botButton = await driver.findElement(By.className("avm-bot-avatar avm-bot-icon animated bot-avatar-outline"));
    await botButton.click();

    // Measure the start time after clicking on the bot
    let startTime = Date.now();

    // Check for the presence of the element repeatedly until it's found
    let elementFound = false;
    while (!elementFound) {
      await driver.sleep(1000); // Check every second
      elementFound = await driver.executeScript(`
        let frame = window.frames[2];
        if (frame) {
          let elements = frame.document.getElementsByClassName("conversation-item clearfix not-mine");
          return elements.length > 0;
        }
        return false;
      `);
    }
    // Measure the end time when the element is found
    let endTime = Date.now();

    // Calculate the response time and duration in seconds
    let responseTime = endTime - startTime;
    let seconds = responseTime / 1000;
    console.log(`Bot loading time: ${responseTime} milliseconds or ${seconds} seconds `);
    return { startTime, endTime, responseTime, seconds };
  } finally {
    await driver.quit();
  }
}

async function runMultipleTimesAndWriteToCSV() {
  const numberOfRuns = 2;
  const csvFilePath = "reports/bot_loading_times.csv";

  let csvContent = "Run,Start Time,End Time,Response Time (ms),Time(Seconds)\n";
  for (let i = 0; i < numberOfRuns; i++) {
    console.log(`\n----- Run ${i + 1} -----`);
    let { startTime, endTime, responseTime, seconds } = await measureBotLoadingTime();
    let startTimeFormatted = new Date(startTime).toLocaleTimeString();
    let endTimeFormatted = new Date(endTime).toLocaleTimeString();
    csvContent += `Run-${i + 1},${startTimeFormatted},${endTimeFormatted},${responseTime},${seconds}\n`;
  }
  fs.writeFileSync(csvFilePath, csvContent);
  console.log(`\nCSV file created: ${csvFilePath}`);
}

runMultipleTimesAndWriteToCSV();
