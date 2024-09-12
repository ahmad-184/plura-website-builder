import Image from "next/image";
import { pricingCards } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <main className="h-full w-full">
        <div
          className="fixed inset-0 -z-10 h-full w-full bg-transparent
          [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#3b82f6_100%)]
        dark:[background:radial-gradient(125%_125%_at_50%_10%,#020817_40%,#3b82f6_100%)]"
        />
        <section className="w-full h-full pt-36 flex items-center justify-center flex-col relative">
          <div
            className="absolute bottom-0 left-0 right-0 top-0 h-[550px]
             dark:bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)]
             bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]
              bg-[size:24px_34px] 
              [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]
              "
          />
          <p className="text-center z-10 relative bottom-5 md:bottom-0 select-none">
            Run your agency, in one place
          </p>
          <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
            <h1 className="text-9xl font-bold text-center md:text-[300px] select-none">
              Plura
            </h1>
          </div>
          <div className="flex justify-center items-center relative md:mt-[-70px]">
            <Image
              src={"/assets/preview.png"}
              alt="plura preview workspace"
              height={1200}
              width={1200}
              // placeholder="blur"
              // blurDataURL={blurDataURL}
              className="rounded-tl-2xl rounded-tr-2xl"
            />
            <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
          </div>
        </section>
        <section className="flex justify-center items-center flex-col gap-4 mt-20 pb-9 px-4">
          <h2 className="text-4xl text-center">Choose what fits you right</h2>
          <p className="text-muted-foreground text-center">
            Our straight forward pricing plans tailored to meet your needs. if{" "}
            {" youe're"} not <br />
            ready to commit you can get started for free
          </p>
          <div className="flex gap-4 flex-wrap mt-6 justify-center">
            {pricingCards.map((card) => (
              <Card
                key={card.priceId}
                className={cn(
                  "w-[300px] dark:bg-gray-900 flex flex-col justify-between",
                  {
                    "border-2 border-primary bg-white transition-background bg-gradient-to-br dark:from-65% from-40% to-100% dark:from-gray-900 from-white dark:to-primary/20 bg-[length:200%_200%] bg-[0%_0%] duration-700 hover:bg-[100%_100%]":
                      card.title === "Unlimited Saas",
                    "border border-gray-800": card.title !== "Unlimited Saas",
                  }
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn("", {
                      "text-muted-foreground": card.title !== "Unlimited Saas",
                    })}
                  >
                    {card.title}
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold">{card.price}</span>
                  <span className="text-muted-foreground">/m</span>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                  <div>
                    {card.features.map((feature) => (
                      <div key={feature} className="flex gap-2 items-center">
                        <Check className="text-muted-foreground" />
                        <p>{feature}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/agency?plan=${card.priceId}`}
                    className={cn(
                      "w-full text-center bg-primary p-2 rounded-md text-white",
                      {
                        "!bg-muted-foreground dark:text-gray-950":
                          card.title !== "Unlimited Saas",
                      }
                    )}
                  >
                    Get Starded
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
