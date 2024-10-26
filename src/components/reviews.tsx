import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Onyx",
    username: "@onyxchaser",
    body: 'The menu is very cool and very cool and has many good functions and is amazing for "speedrunning" 5 stars real',
    img: "/pfps/onyx.png",
  },
  {
    name: "lolcat",
    username: "@lolcat_3877",
    body: "I couldn’t figure out how to paint, but the script is good",
    img: "/pfps/lolcat.png",
  },
  {
    name: "Keller",
    username: "@amonicee",
    body: "10/10 mspaint is a good working doors croc gaming chair deivid and upio must have worked hard on it getting most of the things to work well",
    img: "/pfps/keller.png",
  },
  {
    name: "BOB",
    username: "@craftomancer",
    body: "swag at its finest",
    img: "/pfps/craft.png",
  },
  {
    name: "DaXxed [GD]",
    username: "@daxxedgd",
    body: "Ms paint is honestly something else, truly the peak of Roblox doors scripting.",
    img: "/pfps/daxxedgd.png",
  },
  {
    name: "MelonTighDe",
    username: "@otigh",
    body: "Mspaint is very good but sometimes i lag back 😭 cuz of the speed bypass but non the less all good 🙂",
    img: "/pfps/otigh.png",
  },
  {
    name: "Wacky",
    username: "@zipzap_yt",
    body: "mspaint is one of the best doors scripts out there besides lolhax, imo mspaint needs is a better notification system tho",
    img: "/pfps/wacky.png",
  },
  {
    name: "Marshel",
    username: "@marshel.",
    body: "zib zib zib zib zib zib zib. Zib zib zib!✅👍",
    img: "/pfps/marshel.png",
  },
  {
    name: "Bacalhauz",
    username: "@bacalhauz",
    body: "Amazing work. You couldn't ask for more than that.",
    img: "/pfps/bacal.gif",
  },
  {
    name: "Potoo",
    username: "@PotooDagger",
    body: "If aliens were to invade earth, it would be for mspaint.",
    img: "/pfps/smartindividual.png",
  },
  {
    name: "TotallyNotChrono",
    username: "@notchron",
    body: "i have no idea why its called mspaint but its cool",
    img: "/pfps/notchron.png",
  },
  {
    name: "vee",
    username: "@4ibu",
    body: "mspaint automatically make you cooler 😎 use now!",
    img: "/pfps/vee.png",
  },
  {
    name: "goofiest goober",
    username: "@smoothcriminal.heehee",
    body: "One of the best DOORS scripts of all time. Good features, good anticheat, good everything.",
    img: "/pfps/smoothcriminal.gif",
  },
  {
    name: "☆★𝕯𝖔𝖗𝖎𝖙𝖔★☆",
    username: "@happydorito92",
    body: "Mspaint is a great way to paint and now I have good crocs and gaming chairs because of Mspaint",
    img: "/pfps/happydorito92.png",
  },
  {
    name: "ᨓ 🐇🌸 ៹ sumi ૮₍𖦹ﻌ𖦹₎ა",
    username: "@sumi8a",
    body: "now i dont get heart attacks by rush, 10/10",
    img: "/pfps/sumi8a.png",
  },
  {
    name: "RegularVynixu",
    username: "@.vynixu",
    body: "mspaint is really good, I just want my name on the site 5/5 ⭐",
    img: "/pfps/vynixu.png",
  }
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
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
        <Image className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function ReviewMarquee() {
  return (
    <div className="relative py-10 flex w-screen flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl text-left">
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
    </div>
  );
}
