"use client";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";

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
}

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
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
          <p className="flex absolute right-5 text-sm">{stars.toString()}/5</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function ReviewMarquee() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [alreadyFetched, setAlreadyFetched] = useState(false);

  const [firstRow, setFirstRow] = useState<Review[]>([]);
  const [secondRow, setSecondRow] = useState<Review[]>([]);

  useEffect(() => {
    if (alreadyFetched) return;
    setAlreadyFetched(true);

    fetch("https://api.github.com/repos/mspaint-cc/assets/contents/reviews").then(async (res) => {
      const data = await res.json();
      
      const randomReviews = data.filter((review: unknown) => {
        const githubItem = review as GithubContent;
        if (githubItem.type === "file") return false;
        return Math.random() < 0.5;
      });
      const slicedReviews = randomReviews.slice(0, 17);
      const newReviews: Review[] = [];

      for (const user_folder of slicedReviews) {
        if (user_folder.type !== "dir") { continue; }
        
        const path = "https://raw.githubusercontent.com/mspaint-cc/assets/main/" + user_folder.path + "/";
        const req = await fetch(path + "data.json");
        const data = await req.json();

        if (data.banned == true) { continue; }
        
        newReviews.push({
          name: data.name,
          username: data.username,
          body: data.content,
          img: path + "pfp.png",
          stars: data.stars
        } as Review);
      }

      setReviews(newReviews);
    }).catch(() => { setAlreadyFetched(false) })
  }, []);
  
  useEffect(() => {
    setFirstRow(reviews.slice(0, reviews.length / 2));
    setSecondRow(reviews.slice(reviews.length / 2));
  }, [reviews])

  return (
    <div className="relative py-10 flex w-screen flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl text-left">
      <Suspense fallback={<div>Loading...</div>}>
        <Marquee className="[--duration:60s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:60s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </Suspense>
    </div>
  );
}
