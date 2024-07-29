import { getImage } from "@/lib/getImage";

export async function dynamicImage({ url }: { url: string }): Promise<{
  src: string;
  blurDataURL: any;
}> {
  const { base64, img } = await getImage(url);

  return {
    src: img.src,
    blurDataURL: base64,
  };
}
