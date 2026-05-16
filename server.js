const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;

// Implémentation des opérations du service
const calculatorService = {
    CalculatorService: {
        CalculatorPort: {

            // Opération Addition
            Add: function (args) {
                const result = parseFloat(args.a) + parseFloat(args.b);
                console.log(`Add: ${args.a} + ${args.b} = ${result}`);
                return { result: result };
            },

            // Opération Soustraction
            Subtract: function (args) {
                const result = parseFloat(args.a) - parseFloat(args.b);
                console.log(`Subtract: ${args.a} - ${args.b} = ${result}`);
                return { result: result };
            },

            // Opération Multiplication
            Multiply: function (args) {
                const result = parseFloat(args.a) * parseFloat(args.b);
                console.log(`Multiply: ${args.a} * ${args.b} = ${result}`);
                return { result: result };
            },

            // Opération Division
            Divide: function (args) {
                if (parseFloat(args.b) === 0) {
                    throw {
                        Fault: {
                            Code: { Value: 'DIVIDE_BY_ZERO' },
                            Reason: { Text: 'Division par zéro impossible' }
                        }
                    };
                }
                const result = parseFloat(args.a) / parseFloat(args.b);
                console.log(`Divide: ${args.a} / ${args.b} = ${result}`);
                return { result: result };
            },
            // Opération Modulo
            Modulo: function (args) {

                if (parseFloat(args.b) === 0) {
                    throw {
                        Fault: {
                            Code: { Value: 'MODULO_BY_ZERO' },
                            Reason: { Text: 'Modulo par zéro impossible' }
                        }
                    };
                }

                const result =
                    parseFloat(args.a) % parseFloat(args.b);

                console.log(
                    `Modulo: ${args.a} % ${args.b} = ${result}`
                );

                return { result: result };
            },
            // Opération Power
            Power: function (args) {

                const result = Math.pow(
                    parseFloat(args.a),
                    parseFloat(args.b)
                );

                console.log(
                    `Power: ${args.a} ^ ${args.b} = ${result}`
                );

                return { result: result };
            },
        }
    }
};

// Implémentation du service de conversion de température
const temperatureService = {
    TemperatureService: {
        TemperaturePort: {

            CelsiusToFahrenheit: function (args) {
                const c = parseFloat(args.a);
                const result = (c * 9 / 5) + 32;

                console.log(`C -> F: ${c} = ${result}`);
                return { result };
            },

            FahrenheitToCelsius: function (args) {
                const f = parseFloat(args.a);
                const result = (f - 32) * 5 / 9;

                console.log(`F -> C: ${f} = ${result}`);
                return { result };
            },

            CelsiusToKelvin: function (args) {
                const c = parseFloat(args.a);
                const result = c + 273.15;

                console.log(`C -> K: ${c} = ${result}`);
                return { result };
            }

        }
    }
};

// Lire le fichier WSDL
const calculatorWsdl = fs.readFileSync(
  path.join(__dirname, "calculator.wsdl"),
  "utf8",
);

const temperatureWsdl = fs.readFileSync(
  path.join(__dirname, "temperature.wsdl"),
  "utf8",
);

// Démarrer le serveur
app.listen(PORT, function () {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);

    // Créer le service SOAP
    const calculatorServer = soap.listen(
        app,
        "/calculator",
        calculatorService,
        calculatorWsdl,
    );
    console.log(`Calculator disponible sur http://localhost:${PORT}/calculator?wsdl`);

    /* Temperature SOAP endpoint */
    const temperatureServer = soap.listen(
        app,
        "/temperature",
        temperatureService,
        temperatureWsdl,
    );

    console.log(`Temperature disponible sur : http://localhost:${PORT}/temperature?wsdl`);

    // Log des requêtes entrantes (debug)

    calculatorServer.log = function (type, data) {
        console.log(`[Calculator ${type}]`, data);
    };

    temperatureServer.log = function (type, data) {
    console.log(`[Temperature ${type}]`, data);
  };
});
