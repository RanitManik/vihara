import Input from "@/components/input";
import Button from "@/components/button";
import CustomLink from "@/components/custom-link";
import PasswordInput from "@/app/auth/_components/password-input";

function Page() {
    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <h1 className="text-center text-2xl font-bold">Sign up</h1>
                <form className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            required
                            name="fname"
                            type="text"
                            label="First Name"
                        />
                        <Input
                            required
                            name="lName"
                            type="text"
                            label="Last Name"
                        />
                    </div>
                    <Input
                        required
                        name="email"
                        type="email"
                        label="Email address"
                    />
                    <PasswordInput required name="password" label="Password" />
                    <p className="text-xs leading-none">
                        By creating an account, you agree with our{" "}
                        <CustomLink className="text-xs font-semibold" href="/">
                            Terms and Conditions
                        </CustomLink>{" "}
                        and{" "}
                        <CustomLink className="text-xs font-semibold" href="/">
                            Privacy Statement
                        </CustomLink>
                        .
                    </p>
                    <Button
                        type="submit"
                        className="w-full text-center font-semibold"
                    >
                        Continue with email
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <span>Already have an account? </span>
                    <CustomLink href="/auth/sign-in">Sign in</CustomLink>
                </div>
            </div>
        </div>
    );
}

export default Page;
