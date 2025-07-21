import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            我的博客
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-600">
              首页
            </Link>
            <Link href="/admin" className="hover:text-gray-600">
              管理
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
