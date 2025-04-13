import getServiceWidget from "utils/config/service-helpers";
import createLogger from "utils/logger";
import { httpProxy } from "utils/proxy/http";

const proxyName = "telegramProxyHandler";
const logger = createLogger(proxyName);

// convert tsv to json
async function parseResponse(response) {
    const lines = Buffer.from(response).toString('utf-8').trim().split('\n');
    const headers = lines[0].split('\t');

    const result = {};
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split('\t');

        if (values.length > 2) {
            const key = values[0];
            result[key] = {};
            headers.slice(1).forEach((header, j) => {
                result[key][header] = values[j + 1];
            });
        } else if (values.length === 2) {
            const [key, value] = values;
            result[key] = value;
        }
    }

    return JSON.stringify(result, null, 2);
}

export default async function telegramProxyHandler(req, res) {
    const { group, service, index } = req.query;
    const serviceWidget = await getServiceWidget(group, service, index);
    const url = new URL(serviceWidget.url);

    try {
        const [status, , data] = await httpProxy(url);
        if (status === 200) {
            // logger.debug("Received data from telegram api: %s", data);
            const response = await parseResponse(data);
            return res.status(200).send(response);
        }

        return res.status(status).send(data);
    } catch (error) {
        logger.error("Exception calling Telegram API: %s", error.message);
        return res.status(500).json({ error: "Telegram API Error", message: error.message });
    }
};