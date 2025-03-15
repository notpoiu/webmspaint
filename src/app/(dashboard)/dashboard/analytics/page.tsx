import { AnalyticsClient } from "./client/analytics";
import { AnalyticsProvider } from "./client/provider";

export default function Analytics() {
    return (
        <AnalyticsProvider>
            <AnalyticsClient />
        </AnalyticsProvider>
    )
}