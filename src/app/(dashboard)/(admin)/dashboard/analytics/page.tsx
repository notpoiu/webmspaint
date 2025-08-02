import { AnalyticsClient } from "./client/analytics";
import { AnalyticsProvider } from "./client/provider";

export default function Analytics() {
  return (
    <div className="px-5">
      <AnalyticsProvider>
        <AnalyticsClient />
      </AnalyticsProvider>
    </div>
  );
}
