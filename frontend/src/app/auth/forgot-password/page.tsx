import Input from "@/components/input";
import Button from "@/components/button";
import CustomLink from "@/components/custom-link";

function Page() {
    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <h1 className="text-center text-2xl font-bold">Forgot your password?</h1>
                    <p className="text-center text-sm text-gray-700">
                        We’ll send you a link to reset it. Enter your email address used for Vihara.
                    </p>
                </div>
                <form className="space-y-4">
                    <Input name="email" type="email" label="Your email address" />
                    <Button className="w-full text-center font-semibold">
                        Send Reset Link
                    </Button>
                </form>
                <p className="text-center text-xs leading-none">
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
            </div>
        </div>
    );
}

export default Page;
