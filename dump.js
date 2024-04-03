await driver.sleep(8000);

// Execute JavaScript in the frame context to get the new content after clicking the link
let newContent = await driver.executeScript(`
      let elements = document.getElementsByClassName("avm-xml-html");
      return elements.length > 0 ? elements[elements.length-1].innerText : null;
    `);
