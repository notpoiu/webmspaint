"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

interface GithubContent {
  type: string;
  path: string;
}

type Review = {
  name: string;
  username: string;
  body: string;
  img: string;
  stars: number;
};

const ReviewCard = ({
  img,
  name,
  username,
  body,
  stars,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
  stars: number;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "max-h-[170px] transition-all duration-300"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={img}
          loading="lazy"
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
          <p className="flex absolute right-5 text-sm">{stars.toString()}/5</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-ellipsis">{body}</blockquote>
    </figure>
  );
};

export default function ReviewMarquee() {
  const [firstRow, setFirstRow] = useState<Review[]>([]);
  const [secondRow, setSecondRow] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Hit our cached server endpoint instead of GitHub directly
        const response = await fetch("/api/reviews", { method: "GET" });
        const payload = await response.json();
        const reviews = (payload?.reviews || []) as Review[];
        const avg = typeof payload?.average === "number" ? payload.average : 0;

        const mid = Math.floor(reviews.length / 2);
        setFirstRow(reviews.slice(0, mid));
        setSecondRow(reviews.slice(mid));
        setAverage(avg);
      } catch {
        // swallow and show empty state
        setFirstRow([]);
        setSecondRow([]);
        setAverage(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const memoizedFirstMarquee = useMemo(
    () => (
      <Marquee className="[--duration:500s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    ),
    [firstRow]
  );

  const memoizedSecondMarquee = useMemo(
    () => (
      <Marquee reverse className="[--duration:500s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
    ),
    [secondRow]
  );

  return isLoading ? (
    <div className="flex w-screen flex-col items-center justify-center">
      <p>Loading...</p>
    </div>
  ) : (
    <>
      <p className="text-muted-foreground text-sm">
        Average mspaint rating: {average.toFixed(2)} ⭐
      </p>

      <div className="relative py-10 flex w-screen flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl text-left">
        {memoizedFirstMarquee}
        {memoizedSecondMarquee}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </>
  );
}
