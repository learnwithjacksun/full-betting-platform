import { Pattern } from "@/components/ui";
import { Header } from "@/components/main";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pattern>
      <Header />
      <main className="pt-[100px] pb-10 w-[95%] md:w-[480px] mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <div className="mt-10 border border-line p-4 bg-secondary backdrop-blur-sm rounded-lg">
          {children}
        </div>
      </main>
    </Pattern>
  );
}
