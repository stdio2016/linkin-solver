import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col items-center justify-between py-24 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-left sm:items-start">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Linkedin games solver
          </h1>
          <div className="w-full">
            <Link href="/queens" className="flex border-1 rounded-md justify-between">
              <div className="p-3 flex items-center">Queens</div>
              <div className="p-3 bg-purple-400 flex items-center rounded-r-md">
                <Image src="vercel.svg" alt="" width={50} height={50}/>
              </div>
            </Link>
          </div>
          <div className="w-full">
            <Link href="" className="flex border-1 rounded-md justify-between">
              <div className="p-3 flex items-center">Tango (Coming Soon)</div>
              <div className="p-3 bg-gray-200 flex items-center rounded-r-md">
                <Image src="globe.svg" alt="" width={50} height={50}/>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
