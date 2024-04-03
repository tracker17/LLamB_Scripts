const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

var product = "EventCloud";
var product_name = "Event Management";
var query = "Avaamo";

async function openBotAndLogContentAndClickLink() {
  let driver = await new Builder().forBrowser("chrome").build();
  let startTime, endTime, responseTime;

  try {
    // Open the bot link
    await driver.get(
      "https://c25.avaamo.com/web_channels/3041d293-0ca7-4996-a66c-16b12eae713e/demo.html?custom_properties[contactID]=003Em00000BEP2QIAX&debug=true"
    );

    // Click on the bot to start loading
    let botButton = await driver.findElement(By.className("avm-bot-avatar avm-bot-icon animated bot-avatar-outline"));
    await botButton.click();

    // Wait for a brief moment for the bot content to load
    await driver.sleep(15000); // Adjust the sleep time as needed

    // Switch to the frame containing the bot content
    await driver.switchTo().frame(2);

    await driver.sleep(10000);
    // Find and click the "Seek help" link
    let GetSupport = await driver.findElement(By.css("a[title='Seek help for issues related to the product or any other concerns.']"));
    await GetSupport.click();
    console.log("Clicked on the 'GetSupport' link.");

    // Wait for a brief moment for the new content to load
    await driver.sleep(10000);

    let ProductGroup = product.toLowerCase();
    if (ProductGroup == "eventcloud") {
      ProductGroup = await driver.findElement(
        By.css("a[title='These are the products that help event professionals plan and execute meetings and events.']")
      );
    } else {
      ProductGroup = await driver.findElement(
        By.css("a[title='These are the venue-related products used by event professionals, travel managers and hoteliers.']")
      );
    }
    await ProductGroup.click();
    console.log("Clicked on the 'ProductGroup' link.");

    // Wait for a brief moment for the new content to load
    await driver.sleep(10000);

    let Product = await driver.findElement(By.css(`a[title='${product_name}']`));
    await Product.click();
    console.log("Clicked on the 'Product' link.");

    // Wait for a brief moment for the new content to load
    await driver.sleep(10000);

    // Execute JavaScript to send a message after clicking the "Product" button
    await driver.executeScript(`window.sendMessage("${query}")`);

    await driver.sleep(70000);

    let createCase = await driver.findElement(By.css(`a[title='Create a Case']`));
    await createCase.click();
    console.log("Clicked on the 'createCase' link.");

    await driver.sleep(10000);

    let addDescription = await driver.findElement(By.css(`a[title='Continue with this description']`));
    await addDescription.click();
    console.log("Clicked on the 'addDescription' link.");

    await driver.sleep(10000);

    // Find the textarea and send keys
    let textArea = await driver.findElement(By.className("textbox avm_accessible_txt_box_helper"));
    await textArea.sendKeys("This is a test description.");
    await driver.sleep(5000);

    // Click the button with class "btn default_card_submit"
    let submitButton = await driver.findElement(By.className("btn default_card_submit"));
    await submitButton.click();
    console.log("Clicked on the submit button.");

    // Record start time
    startTime = Date.now();

    // Wait for the reply containing the specified text
    await driver.wait(until.elementLocated(By.className("submit_case")), 50000);
    console.log("Found 'submit_case' element. Response received.");

    // Record end time
    endTime = Date.now();

    // Calculate response time
    responseTime = endTime - startTime;
    let seconds = responseTime / 1000;
    console.log("Response time:", responseTime, "milliseconds", seconds, " seconds");

    return seconds;
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  } finally {
    // Close the browser
    await driver.quit();
  }
}

async function runMultipleTimes() {
  let responseTimes = [];
  for (let i = 1; i <= 2; i++) {
    console.log(`Run ${i}:`);
    let responseTime = await openBotAndLogContentAndClickLink();
    console.log("---------------------------------------");
    responseTimes.push(responseTime);
  }
  return responseTimes;
}

async function writeResponseTimesToCSV() {
  let responseTimes = await runMultipleTimes();
  let csvData = "Run,Response Time (s)\n";
  responseTimes.forEach((time, index) => {
    csvData += `Run${index + 1},${time}\n`;
  });

  fs.writeFile("reports/response_times.csv", csvData, function (err) {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      console.log("Response times saved to response_times.csv");
    }
  });
}

writeResponseTimesToCSV();
