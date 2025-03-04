import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import CustomLink from "@/components/custom-link";

function Page() {
    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <h1 className="text-center text-2xl font-bold">Sign in</h1>
                <form className="space-y-4">
                    <Input name="email" type="email" label="Email address" />
                    <Input name="password" type="password" label="Password" />
                    <div className="flex items-center justify-between">
                        <Checkbox label="Keep me signed in" />
                        <CustomLink href="/auth/forgot-password">
                            Forgot password?
                        </CustomLink>
                    </div>
                    <Button className="w-full text-center font-semibold">
                        Continue with email
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <span>Don’t have an account? </span>
                    <CustomLink href="/auth/sign-up">Register</CustomLink>
                </div>
            </div>
        </div>
    );
}

export default Page;
