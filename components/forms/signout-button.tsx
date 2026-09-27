"use client";
import { signOut } from "next-auth/react";
export function SignoutButton(){return <button type="button" onClick={() => void signOut({ redirectTo: "/" })} className="text-sm underline underline-offset-4">Sign out</button>}
