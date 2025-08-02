import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { DotPattern } from '@/components/magicui/dot-pattern';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import SparklesText from '@/components/magicui/sparkles-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Badge } from '@/components/ui/badge';

// Simple progress bar component since @/components/ui/progress is missing
const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 mt-2 ${className}`}>
    <div 
      className="bg-blue-500 h-2 rounded-full" 
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

interface SubscriptionCardProps {
  user: {
    name: string;
    image: string;
  };
  subscription: {
    plan: string;
    remaining: string;
    progress: number;
  };
  features: string[];
}

export function SubscriptionCard({ user, subscription, features }: SubscriptionCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <DotPattern
        className="absolute inset-0 z-0 opacity-30 [--dot-size:8px]"
        size={20}
        radius={1.5}
        offset-x={0}
        offset-y={0}
      />
      <Card className="relative z-10">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {user.image && (
                <Image
                  src={user.image}
                  alt="Discord Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <AnimatedGradientText className="text-lg font-semibold">
                  Discord Username
                </AnimatedGradientText>
                <SparklesText text={user.name} className="text-sm" />
              </div>

              <div className="mt-4">
                <AnimatedGradientText className="text-lg font-semibold">
                  Current Subscription
                </AnimatedGradientText>
                <div className="flex items-center space-x-2">
                  <SparklesText text={`${subscription.plan} (${subscription.remaining} remaining)`} className="text-sm" />
                </div>
                <Progress value={subscription.progress} className="mt-2 w-full h-2" />
              </div>

              <div className="mt-4">
                <AnimatedGradientText className="text-lg font-semibold">
                  Features
                </AnimatedGradientText>
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <ShimmerButton borderRadius="8px">
                  <Link href="/shop">Extend</Link>
                </ShimmerButton>
                <ShimmerButton borderRadius="8px">
                  <Link href="/download">Download</Link>
                </ShimmerButton>
                <ShimmerButton borderRadius="8px">
                  <Link href="/support">Support</Link>
                </ShimmerButton>
                <ShimmerButton borderRadius="8px">
                  <Link href="/settings">Settings</Link>
                </ShimmerButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
