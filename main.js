var fs = require('fs');
var parse = require('csv');
var csvWriter = require('csv-write-stream');

var parser = parse.parse({delimiter: ';'}, function(err, data){
  //console.log("OK HERE'S THE STUFF FUCK-O:");
  //console.log(data);
  var chosenEmployee = pickEmployee(data);
});

fs.createReadStream(__dirname+'/csv/employees.csv').pipe(parser);

var pickEmployee = function(data){

  var employees = [];
  var nEmployees = data.length - 1;

  //Iterate over each row of the csv
  for (var i = 0 ; i < data.length ; i++){
    var employeeNumber = i - 1;

    //Skip over the first row cause its stupid
    if (i == 0){
      continue;
    }
    //Turn it into string
    var row = "" + data[i];

    //Split row into cells
    var cells = row.split(",");

    //Create employee object from cells
    var employee = {
      firstName : cells[0],
      lastName : cells[1],
      hasBeenChosenBefore : (cells[2]) //JSON parse turns the text into a Boolean
    }

    //stick employee into employees array
    employees[employeeNumber] = employee;
  }

  var notFound = true;
  while (notFound) {
    var number = getRandomIntInclusive(0, (nEmployees-1));

    
    var chosenEmployee = employees[number];

    if (chosenEmployee.hasBeenChosenBefore == 'FALSE') {
      console.log("This is the chosen employee: " + chosenEmployee.firstName + " " + chosenEmployee.lastName);
      notFound = false;
      chosenEmployee.hasBeenChosenBefore = 'TRUE';
    } else {
      console.log("This friggin guys been chosen before hahahaha: " + chosenEmployee.firstName + " " + chosenEmployee.lastName);
    }
  }

  var writer = csvWriter({ headers: ["First Name", "Last Name","Has Been Chosen Before"]});
  writer.pipe(fs.createWriteStream('csv/employees.csv'));

for (i = 0; i < employees.length; i++) {
  writer.write([employees[i].firstName, employees[i].lastName, employees[i].hasBeenChosenBefore]);
}

  writer.end();

  //print out whole array
//console.dir(employees);

};
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
