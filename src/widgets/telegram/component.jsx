import Block from "components/services/widget/block";
import Container from "components/services/widget/container";
import { useTranslation } from "next-i18next";

import useWidgetAPI from "utils/proxy/use-widget-api";


export default function Component({ service }) {
    const { t } = useTranslation();
    const { widget } = service;

    const { data: telegramData, error: telegramError } = useWidgetAPI(widget);
    if (telegramError) {
        return <Container service={service} error={telegramError} />;
    }

    if (!telegramData) {
        return (
            <Container service={service}>
                <Block label="telegram.bot_count" />
                <Block label="telegram.bot_active" />
                <Block label="telegram.webhook_connections" />
            </Container>
        );
    }

    return (
        <Container service={service}>
            <Block
                label="telegram.bot_count"
                value={t("common.number", { value: telegramData.bot_count })}
            />
            <Block
                label="telegram.bot_active"
                value={t("common.number", { value: telegramData.active_bot_count })}
            />
            <Block
                label="telegram.webhook_connections"
                value={t("common.number", { value: telegramData.active_webhook_connections })}
            />
        </Container>
    );
}