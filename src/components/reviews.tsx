import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import Image from "next/image";

const reviews = [
  {
    name: "Onyx",
    username: "@onyxchaser",
    body: 'The menu is very cool and very cool and has many good functions and is amazing for "speedrunning" 5 stars real',
    img: "https://utfs.io/f/q5sBExIITNsAO1XWE3fJyoYp9eBqSGTshKxnIFf610uVRZ3M",
  },
  {
    name: "lolcat",
    username: "@lolcat_3877",
    body: "I couldn’t figure out how to paint, but the script is good",
    img: "https://utfs.io/f/q5sBExIITNsAdO1nkQIz9xuXCEt5MnF08N6vQyf3cG7hTZoV",
  },
  {
    name: "Keller",
    username: "@amonicee",
    body: "10/10 mspaint is a good working doors croc gaming chair deivid and upio must have worked hard on it getting most of the things to work well",
    img: "https://utfs.io/f/q5sBExIITNsA1ZEF0upliRzy8hvrj5K7ba2VAnUo0DMksdmC",
  },
  {
    name: "BOB",
    username: "@craftomancer",
    body: "swag at its finest",
    img: "https://utfs.io/f/q5sBExIITNsAvNfiUQOTU2hgxAjVYwkpdXfBI9zH1yOaue5E",
  },
  {
    name: "DaXxed [GD]",
    username: "@daxxedgd",
    body: "Ms paint is honestly something else, truly the peak of Roblox doors scripting.",
    img: "https://utfs.io/f/q5sBExIITNsABdpqkWAKU9TJFX7q3z8ExZVAWyQeLOfamDgu",
  },
  {
    name: "MelonTighDe",
    username: "@otigh",
    body: "Mspaint is very good but sometimes i lag back 😭 cuz of the speed bypass but non the less all good 🙂",
    img: "https://utfs.io/f/q5sBExIITNsAyTU2sXEodEnluv6LfbZ04sCwrmkiRPq19FWQ",
  },
  {
    name: "Wacky",
    username: "@zipzap_yt",
    body: "mspaint is one of the best doors scripts out there besides lolhax, imo mspaint needs is a better notification system tho",
    img: "https://utfs.io/f/q5sBExIITNsAtlz4k0emeb70kQqyYB5TRpHGF1cCiE9wlLVg",
  },
  {
    name: "Marshel",
    username: "@marshel.",
    body: "zib zib zib zib zib zib zib. Zib zib zib!✅👍",
    img: "https://utfs.io/f/q5sBExIITNsAYGx1dcZ30NmSRPGJauKMkw3EhjIDXtbWplvo",
  },
  {
    name: "Bacalhauz",
    username: "@bacalhauz",
    body: "Amazing work. You couldn't ask for more than that.",
    img: "https://utfs.io/f/q5sBExIITNsAaWmLrZVP6ChJ38IXqGrs2omRDUBykQVz5AHM",
  },
  {
    name: "Potoo",
    username: "@PotooDagger",
    body: "If aliens were to invade earth, it would be for mspaint.",
    img: "https://utfs.io/f/q5sBExIITNsAE0SDeGs7eNKStliDX3HWdpfPxvZVy1bjCUzq",
  },
  {
    name: "TotallyNotChrono",
    username: "@notchron",
    body: "i have no idea why its called mspaint but its cool",
    img: "https://utfs.io/f/q5sBExIITNsAOCumWLfJyoYp9eBqSGTshKxnIFf610uVRZ3M",
  },
  {
    name: "vee",
    username: "@4ibu",
    body: "mspaint automatically make you cooler 😎 use now!",
    img: "https://utfs.io/f/q5sBExIITNsA6OzrzvHsIMkyhwi9DKxlYHUEu513Bce0vmRr",
  },
  {
    name: "goofiest goober",
    username: "@smoothcriminal.heehee",
    body: "One of the best DOORS scripts of all time. Good features, good anticheat, good everything.",
    img: "https://utfs.io/f/q5sBExIITNsABPWIRfEAKU9TJFX7q3z8ExZVAWyQeLOfamDg",
  },
  {
    name: "☆★𝕯𝖔𝖗𝖎𝖙𝖔★☆",
    username: "@happydorito92",
    body: "Mspaint is a great way to paint and now I have good crocs and gaming chairs because of Mspaint",
    img: "https://utfs.io/f/q5sBExIITNsA6ppaUsHsIMkyhwi9DKxlYHUEu513Bce0vmRr",
  },
  {
    name: "ᨓ 🐇🌸 ៹ sumi ૮₍𖦹ﻌ𖦹₎ა",
    username: "@sumi8a",
    body: "now i dont get heart attacks by rush, 10/10",
    img: "https://utfs.io/f/q5sBExIITNsAxdRM9B12P3KgHVY7Wi9ytU5LZaklOrn8RMsS",
  },
  {
    name: "RegularVynixu",
    username: "@.vynixu",
    body: "mspaint is really good, I just want my name on the site 5/5 ⭐",
    img: "https://utfs.io/f/q5sBExIITNsAsNkmVF6NwdMIvFxr2P315KLDmb98sgRiSYuJ",
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
