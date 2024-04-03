const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const csv = require("csv-parser");

async function executeBotQueries() {
  // Read the CSV file
  const rows = [];
  fs.createReadStream("inputs/llamb_queries.csv")
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      // Loop over each row and execute the bot query
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        await executeBotQuery(row);
      }
    });
}

async function executeBotQuery(row) {
  let driver = await new Builder().forBrowser("chrome").build();

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
    await driver.sleep(8000);

    let ProductGroup = row.product.toLowerCase();
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
    console.log(`Clicked on the ${row.product} link.`);

    // Wait for a brief moment for the new content to load
    await driver.sleep(10000);

    let Product = await driver.findElement(By.css(`a[title='${row.product_name}']`));
    await Product.click();
    console.log(`Clicked on the ${row.product_name} link.`);

    // Wait for a brief moment for the new content to load
    await driver.sleep(10000);

    // Record start time before sending the message
    let startTime = Date.now();

    // Execute JavaScript to send a message after clicking the "Product" button
    await driver.executeScript(`window.sendMessage("${row.query}")`);

    // Wait until the response is received
    await driver.wait(until.elementLocated(By.className("avm-xml-html")), 50000);

    // Record end time after receiving the response
    let endTime = Date.now();

    // Calculate response time
    let responseTime = endTime - startTime;
    let seconds = responseTime / 1000;
    console.log("Response time:", responseTime, "milliseconds", seconds, " seconds for ", row.query);

    // Write data to CSV file
    // const data = `${row.query},${startTime},${endTime},${seconds}\n`;
    const data = `${row.query},${seconds}\n`;
    fs.appendFileSync("reports/llamb_load_time.csv", data);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

executeBotQueries();
