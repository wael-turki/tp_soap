const soap = require('soap');
const WSDL_URL = 'http://localhost:8000/calculator?wsdl';
const TEMP_WSDL_URL = 'http://localhost:8000/temperature?wsdl';
async function main() {
    try {
        // Créer le client SOAP
        const client = await soap.createClientAsync(WSDL_URL);

        console.log('✅ Client SOAP connecté !');

        console.log('🚀 Opérations disponibles:',
            Object.keys(client.CalculatorService.CalculatorPort));


        console.log('\n--- Tests des opérations ---\n');
        // Test Addition
        const addResult = await client.AddAsync({ a: 10, b: 5 });
        console.log(`Addition: 10 + 5 = ${addResult[0].result}`);
        // Test Soustraction
        const subResult = await client.SubtractAsync({ a: 10, b: 3 });
        console.log(`Soustraction: 10 - 3 = ${subResult[0].result}`);
        // Test Multiplication
        const mulResult = await client.MultiplyAsync({ a: 4, b: 7 });
        console.log(`Multiplication: 4 × 7 = ${mulResult[0].result}`);
        // Test Division
        const divResult = await client.DivideAsync({ a: 20, b: 4 });
        console.log(`Division: 20 ÷ 4 = ${divResult[0].result}`);
        // Test Division par zéro (erreur)
        console.log('\n--- Test erreur: Division par zéro ---');
        try {
            await client.DivideAsync({ a: 10, b: 0 });
        } catch (error) {
            console.log('❌ Erreur capturée:',
                error.root?.Envelope?.Body?.Fault?.Reason?.Text || error.message);
        }
        // Test Modulo
        const modResult =
            await client.ModuloAsync({ a: 12, b: 5 });

        console.log(
            `Modulo: 12 % 5 = ${modResult[0].result}`
        );
        // Test Power
        const powerResult =
            await client.PowerAsync({ a: 4, b: 2 });

        console.log(
            `Power: 4 ^ 2 = ${powerResult[0].result}`
        );


        console.log('\n--- conversion de température ---\n');
        const tempClient = await soap.createClientAsync(TEMP_WSDL_URL);

        console.log('\n Temperature ');

        // Celsius → Fahrenheit
        const cToF = await tempClient.CelsiusToFahrenheitAsync({ a: 25 });
        console.log(`25°C = ${cToF[0].result}°F`);

        // Fahrenheit → Celsius
        const fToC = await tempClient.FahrenheitToCelsiusAsync({ a: 77 });
        console.log(`77°F = ${fToC[0].result}°C`);

        // Celsius → Kelvin
        const cToK = await tempClient.CelsiusToKelvinAsync({ a: 0 });
        console.log(`0°C = ${cToK[0].result}K`);
    } catch (error) {
        console.error('Erreur de connexion:', error.message);
    }
}
main();