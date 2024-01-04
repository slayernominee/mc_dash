"use client"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <div className="flex">            

        <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">
        <div>
        <div className="inline-flex h-16 w-16 items-center justify-center">
        <span
        className="grid h-10 w-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
        >
        L
        </span>
        </div>
        
        <div className="border-t border-gray-100">
        <div className="px-2">
        <div className="py-4">
        <Link
        href="/dashboard/"
        className={`group relative flex justify-center rounded px-2 py-1.5 ${pathname === '/dashboard' ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        General
        </span>
        </Link>
        </div>
        
        <ul className="space-y-1 border-t border-gray-100 pt-4">
        <li>
        <Link
        href="/dashboard/players/ops"
        className={`group relative flex justify-center rounded px-2 py-1.5 ${pathname.startsWith("/dashboard/players/") ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        Players
        </span>
        </Link>
        </li>
        
        <li>
        <Link
        href="/dashboard/console"
        className={`group relative flex justify-center rounded px-2 py-1.5 ${pathname === '/dashboard/console' ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        Console
        </span>
        </Link>
        </li>
        
        <li>
        <Link
        href="/dashboard/files"
        className={`group relative flex justify-center rounded px-2 py-1.5 ${pathname === '/dashboard/files' ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        Files
        </span>
        </Link>
        </li>
        
        <li>
        <Link
        href=""
        className={`group relative flex justify-center rounded px-2 py-1.5 ${pathname.startsWith("/dashboard/advanced/") ? "text-blue-700 bg-blue-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
            
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        Advanced
        </span>
        </Link>
        </li>
        </ul>
        </div>
        </div>
        </div>
        
        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
        <form action="/logout">
        <button
        type="submit"
        className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 opacity-75"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
        </svg>
        
        <span
        className="absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100"
        >
        Logout
        </span>
        </button>
        </form>
        </div>
        </div>
        
        <div className="flex h-screen flex-1 flex-col justify-between border-e bg-white">
        <div className="px-4 py-6">
        <ul className="mt-14 space-y-1">
        <li>
        <Link
        href="/dashboard/"
        className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === '/dashboard'  ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
        >
        General
        </Link>
        </li>
        
        <li>
        <details className="group [&_summary::-webkit-details-marker]:hidden" open={pathname.startsWith("/dashboard/players")}>
        <summary
        className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        <span className="text-sm font-medium"> Players </span>
        
        <span className="shrink-0 transition duration-300 group-open:-rotate-180">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        >
        <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
        />
        </svg>
        </span>
        </summary>
        
        <ul className="mt-2 space-y-1 px-4">
        
        <li>
        <Link
        href="/dashboard/players/ops"
        className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === '/dashboard/players/ops'  ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
        >
        Operators
        </Link>
        </li>
        
        <li>
        <Link
        href="/dashboard/players/banned"
        className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === '/dashboard/players/banned'  ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
        >
        Banned Players
        </Link>
        </li>
        
        
        </ul>
        </details>
        </li>
        
        <li>
        <Link
        href="/dashboard/console"
        className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === '/dashboard/console'  ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
        >
        Console
        </Link>
        </li>
        
        <li>
        <Link
        href="/dashboard/files"
        className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === '/dashboard/files'  ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
        >
        Files
        </Link>
        </li>
        
        <li>
        <details className="group [&_summary::-webkit-details-marker]:hidden">
        <summary
        className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        <span className="text-sm font-medium"> Advanced </span>
        
        <span className="shrink-0 transition duration-300 group-open:-rotate-180">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        >
        <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
        />
        </svg>
        </span>
        </summary>
        
        <ul className="mt-2 space-y-1 px-4">
        <li>
        <a
        href=""
        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        Details
        </a>
        </li>
        
        <li>
        <a
        href=""
        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
        Security
        </a>
        </li>
        
        <li>
        <form action="/logout">
        <button
        type="submit"
        className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
        >
        Logout
        </button>
        </form>
        </li>
        </ul>
        </details>
        </li>
        </ul>
        </div>
        </div>
        </div>
        )
    }
    
    export { Sidebar }