import dotenv from "dotenv";
 dotenv.config();

 const pingApp = async () => {
     const APP_URL = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
     try {
         logWithTimestamp(`Self-ping to ${APP_URL}...`);
         const response = await fetch(`${APP_URL}/api/ping/website`);
         logWithTimestamp(`Self-ping successful! Status: ${response.status}`);
     }
     catch (error) {
         logWithTimestamp(`Error on self-ping: ${error.message}`);
     }
 };
 

 const logWithTimestamp = (message) => {
     console.log(`${message}`);
 };
 

 export const setupSelfPing = () => {
     // Wait 10 seconds after startup before starting the ping loop
     // This gives the server enough time to fully initialize
     setTimeout(() => {
         // Initial ping
         pingApp();
         // Set up ping interval (every 5 minutes = 300000 ms)
         setInterval(pingApp, 300000);
         logWithTimestamp('Self-ping service started. Pinging every 5 minutes.');
     }, 10000);
 };


 export const pingURL = (req, res) => {
     res.status(200).send('Ping successful');
 };