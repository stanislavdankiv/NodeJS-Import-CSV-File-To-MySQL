const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');

// Import CSV Data to MySQL database
importCsvData2MySQL('customers.csv');

function importCsvData2MySQL(filename){
	let stream = fs.createReadStream(filename);
	let csvData = [];
	let csvStream = csv
		.parse()
		.on("data", function (data) {
			csvData.push(data);
		})
		.on("end", function () {
			// -> Remove Header ROW
			csvData.shift();
			
			// -> Create a connection to the database
			const connection = mysql.createConnection({
				host: '192.168.42.16',
				user: 'admin',
				password: 'password',
				database: 'testdb'
			});

			// Open the MySQL connection
			connection.connect((error) => {
				if (error) {
					console.error(error);
				} else {
					let query = 'INSERT INTO customers (id, address, name, age) VALUES ?';
					connection.query(query, [csvData], (error, response) => {
						console.log(error || response);
					});
				}
			});
		});

	stream.pipe(csvStream);
}
