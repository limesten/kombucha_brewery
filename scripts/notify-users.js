const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const calcFinishDate = (batch, settings) => {
    let expectedBrewingDays;
    let expectedFinishDate;
    if (batch.status == 'First fermentation') {
        expectedBrewingDays = settings.first_fermentation_days;
        expectedFinishDate = new Date(batch.start_date);
    } else if (batch.status == 'Second fermentation') {
        expectedBrewingDays = settings.second_fermentation_days;
        expectedFinishDate = new Date(batch.second_fermentation_start);
    } else {
        throw new Error('Unknown batch status when calculating finish date');
    }
    expectedFinishDate.setDate(expectedFinishDate.getDate() + expectedBrewingDays);
    return expectedFinishDate;
};

(async () => {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
        console.error('DB URL env variable missing');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const pool = new Pool({
        connectionString: dbUrl,
    });

    let today = new Date().toISOString().split('T')[0];

    try {
        const client = await pool.connect();

        let sql = `
            SELECT * FROM batches
            WHERE
            status != 'Finished' 
        `;

        const activeBatches = await client.query(sql);
        const userSettings = {};

        for (const batch of activeBatches.rows) {
            if (!userSettings.hasOwnProperty(batch.user_id)) {
                let sql = `
                    SELECT * from brew_settings
                    WHERE
                    user_id = $1
                    LIMIT 1;
                `;
                const brewSettings = await client.query(sql, [batch.user_id]);
                userSettings[batch.user_id] = brewSettings.rows[0];
            }
        }

        for (const batch of activeBatches.rows) {
            const settings = userSettings[batch.user_id];

            if (!settings) {
                throw new Error(`Settings not found for user ${batch.user_id}`);
            }

            if (!settings.notification_email) {
                console.log(`No email found for ${settings.user_id}`);
                continue;
            }

            const finishDate = calcFinishDate(batch, settings);
            const finishDateStr = finishDate.toISOString().split('T')[0];
            console.log(`Batch ${batch.id} (${batch.brewing_vessel}): Expected finish date: ${finishDateStr}, Today: ${today}, Status: ${batch.status}`);
            
            if (finishDateStr == today) {
                console.log(`will send reminder for batch ${batch.id}`);
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: settings.notification_email,
                    subject: `Time to check your kombucha in vessel: ${batch.brewing_vessel} today!`,
                    text: `Time to taste test your kombucha!`,
                    html: '<b>Time to taste test your kombucha!</b>',
                };
                try {
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent: %s', info.messageId);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            } else {
                console.log(`no reminder for batch ${batch.id}`);
            }
        }

        client.release();
    } catch (err) {
        console.error(`DB error: ${err}`);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
