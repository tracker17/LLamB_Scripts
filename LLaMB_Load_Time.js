const { Builder, By, until } = require("selenium-webdriver");
var product = "EventCloud";
var product_name = "Event Management";
var query = "How can I adjust the order amount?";

async function openBotAndLogContentAndClickLink() {
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

    // Record start time before sending the message
    let startTime = Date.now();

    // Execute JavaScript to send a message after clicking the "Product" button
    await driver.executeScript(`window.sendMessage("${query}")`);

    // Wait until the response is received
    await driver.wait(until.elementLocated(By.className("avm-xml-html")), 50000);
    console.log("Found 'avm-xml-html' element. Response received.");

    // Record end time after receiving the response
    let endTime = Date.now();

    // Calculate response time
    let responseTime = endTime - startTime;
    let seconds = responseTime / 1000;
    console.log("Response time:", responseTime, "milliseconds", seconds, " seconds");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the browser
    await driver.quit();
  }
}

openBotAndLogContentAndClickLink();
