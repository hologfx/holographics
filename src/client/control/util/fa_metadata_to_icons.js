var fs = require("fs");

var contents = fs.readFileSync("fa_input.json");
var jsonContent = JSON.parse(contents);

var outputArray = [];

for(let icon in jsonContent) {
  if (jsonContent[icon].styles.includes('brands') || jsonContent[icon].styles.includes('solid')) {
    outputArray.push({
      name: jsonContent[icon].label,
      id: icon,
      unicode: jsonContent[icon].unicode,
      filter: jsonContent[icon].search.terms,
      class: jsonContent[icon].styles.includes('brands') ? `fab fa-${icon}` : `fa fa-${icon}`
    });
  }
}

fs.writeFileSync("fa_output.json", JSON.stringify(outputArray));