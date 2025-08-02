import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import MiniDashboardCard from '@/components/mini-dashboard-card';
import { GetUserSubscription, GetUserPurchaseHistory } from '@/server/redeemkey';
import DotPattern from '@/components/magicui/dot-pattern';
import { cn } from '@/lib/utils';

export default async function SubscriptionDashboard() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect("/sign-in");
  }

  const subscription = await GetUserSubscription(session.user.id);
  const purchaseHistory = await GetUserPurchaseHistory(session.user.id);

  async function signOutCall() {
    "use server"
    await signOut();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] -z-50"
        )}
      /> 

      <MiniDashboardCard 
        session={session} 
        subscription={subscription} 
        purchaseHistory={purchaseHistory} 
        signout={signOutCall}
      />
    </div>
  );
}
