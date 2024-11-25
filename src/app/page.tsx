import { SignIn, SignInButton, SignedOut } from "@clerk/nextjs";
export default async function Home() {
    return (
        <>
            <div className="w-full text-center">
                <h1 className="text-2xl">Kombucha brewery</h1>
                <p className="text-xl">Please sign in below</p>
                <SignedOut>
                    <SignInButton>Sign in</SignInButton>
                </SignedOut>
            </div>
        </>
    );
}
