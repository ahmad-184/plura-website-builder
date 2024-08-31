import Image from "next/image";

export default function PluraLogo() {
  return (
    <aside className="flex items-center gap-2 select-none">
      <Image
        src={"/assets/plura-logo.svg"}
        alt="plura logo"
        width={40}
        height={40}
      />
      <span className="text-xl font-bold">Plura.</span>
    </aside>
  );
}
