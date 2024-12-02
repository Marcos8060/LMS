import Sidebar from "@/app/components/layout/layout";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row md:overflow-hidden bg-background">
      <section className="md:block hidden w-full flex-none md:w-64">
        <Sidebar />
      </section>
      <section className="w-full overflow-y-auto">
        <div className="flex-grow py-6 px-2 md:px-6 md:py-6 ">
          {children}
        </div>
      </section>
    </div>
  );
}
